import { ref, reactive } from 'vue'
import { dictTranslate, hasThai, resetFuzzyHits, _fuzzyHits } from '../utils/translateDict.js'

export function useTranslate() {
  const translateFields = reactive(new Set([
    'IW38::Description'
  ]))

  const translateCache = ref({})

  const translateStatus = reactive({
    show: false,
    text: '',
    sub: '',
    pct: 0,
    retryAttempt: null,
    maxRetry: null,
    failedCount: 0,
    failedBadge: false
  })

  // Each entry: { original, translated, source: 'dict'|'ai'|'ai-retry'|'dict-polish'|'eng-rewrite', batchNo, ts }
  const aiLog = ref([])
  function clearLog() { aiLog.value = [] }

  let _failedTexts = []
  let _lastAllTableData = null
  let _isRetrying = false
  const _originalValues = new WeakMap()
  let _hideStatusTimer = null

  function setStatus(text, sub, pct, retryAttempt = null, maxRetry = null) {
    clearTimeout(_hideStatusTimer)
    translateStatus.show = true
    translateStatus.text = text
    translateStatus.sub  = sub || ''
    translateStatus.pct  = pct !== undefined ? Math.min(100, pct) : translateStatus.pct
    translateStatus.retryAttempt = retryAttempt
    translateStatus.maxRetry     = maxRetry
    if (pct >= 80) {
      _hideStatusTimer = setTimeout(() => { translateStatus.show = false }, 3000)
    }
  }

  function setFailedBadge(count) {
    translateStatus.failedCount = count
    translateStatus.failedBadge = count > 0
  }

  function toggleField(field) {
    if (translateFields.has(field)) translateFields.delete(field)
    else translateFields.add(field)
  }

  // ── Shared fetch core ──
  async function _fetchAPI(texts, endpoint, prompt) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], temperature: 0.1, max_tokens: 2000 })
    })
    if (!res.ok) throw new Error('API HTTP ' + res.status)
    const data = await res.json()
    const raw = (data.choices?.[0]?.message?.content || '')
      .replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
      .replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      throw new Error('API returned non-JSON: ' + raw.slice(0, 120))
    }

    if (!Array.isArray(parsed)) {
      // Sometimes API wraps array in an object e.g. { translations: [...] }
      const nested = parsed?.translations || parsed?.results || parsed?.data || Object.values(parsed)[0]
      if (Array.isArray(nested)) parsed = nested
      else throw new Error('API returned non-array: ' + JSON.stringify(parsed).slice(0, 120))
    }

    if (parsed.length !== texts.length) {
      console.warn('[Translate] Length mismatch: expected', texts.length, 'got', parsed.length, '— salvaging partial results')
      // Pad or trim to match input length — better than losing the whole batch
      while (parsed.length < texts.length) parsed.push(null)
      parsed = parsed.slice(0, texts.length)
    }

    return parsed
  }

  // ── API: Translate Thai → English ──
  async function callAPI(texts, endpoint) {
    const prompt =
      'You are a facility maintenance report writer. Translate these Thai SAP work order descriptions into natural English maintenance report sentences.\n\n' +
      'Rules:\n' +
      '1. Write complete, natural sentences — NOT word-for-word translations.\n' +
      '2. Use "The [component] in/at the [location] is [symptom]." structure when applicable.\n' +
      '3. For absence/flow issues use "has no water flow" not "is not flowing".\n' +
      '4. Use correct prepositions: rooms/areas → "in the", floors/ceilings → "on the", machine positions → "at the".\n' +
      '5. Preserve equipment codes, numbers, and model names exactly as-is.\n' +
      '6. Keep it concise (1 sentence preferred). No filler phrases.\n\n' +
      'Return ONLY a JSON array of translated strings in the same order. No markdown, no preamble.\n\n' +
      'Input:\n' + JSON.stringify(texts)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Polish Dict-translated English ──
  async function callAPIPolish(texts, endpoint) {
    const prompt =
      'You are a facility maintenance report writer. The following texts are English translations from a Thai-English dictionary — they may be choppy, literal, or grammatically awkward.\n\n' +
      'Rewrite each one into a single, natural, professional maintenance report sentence.\n\n' +
      'Rules:\n' +
      '1. Fix grammar, word order, and phrasing to sound natural.\n' +
      '2. Use "The [component] in/at the [location] is [symptom]." structure when applicable.\n' +
      '3. Use correct prepositions: rooms/areas → "in the", floors/ceilings → "on the", machine positions → "at the".\n' +
      '4. Preserve equipment codes, numbers, and model names exactly as-is.\n' +
      '5. Keep it concise (1 sentence preferred). No filler phrases.\n\n' +
      'Return ONLY a JSON array of polished strings in the same order. No markdown, no preamble.\n\n' +
      'Input:\n' + JSON.stringify(texts)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Rewrite English → Better English ──
  async function callAPIEngRewrite(texts, endpoint) {
    const prompt =
      'You are a facility maintenance report writer. The following texts are English SAP work order descriptions that may be abbreviated, terse, or unclear.\n\n' +
      'Rewrite each one into a single, clear, professional maintenance report sentence.\n\n' +
      'Rules:\n' +
      '1. Expand abbreviations and improve clarity while keeping the original meaning.\n' +
      '2. Use "The [component] in/at the [location] is/has [symptom/issue]." structure when applicable.\n' +
      '3. Use correct prepositions: rooms/areas → "in the", floors/ceilings → "on the", machine positions → "at the".\n' +
      '4. Preserve equipment codes, numbers, and model names exactly as-is.\n' +
      '5. If the text is already clear and complete, keep it with only minor improvements.\n' +
      '6. Keep it concise (1 sentence preferred). No filler phrases.\n\n' +
      'Return ONLY a JSON array of rewritten strings in the same order. No markdown, no preamble.\n\n' +
      'Input:\n' + JSON.stringify(texts)
    return _fetchAPI(texts, endpoint, prompt)
  }

  async function callAPIWithRetry(texts, endpoint, maxRetries, batchLabel, onRetry, apiFn) {
    let lastError
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delayMs = Math.pow(2, attempt - 1) * 1000
          onRetry?.(attempt, maxRetries, delayMs)
          await new Promise(r => setTimeout(r, delayMs))
        }
        return await (apiFn || callAPI)(texts, endpoint)
      } catch (e) { lastError = e; console.warn('[Translate]', batchLabel, 'attempt', attempt + 1, 'failed:', e.message) }
    }
    throw lastError
  }

  function snapshotOriginals(allTableData) {
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        if (!_originalValues.has(rec)) _originalValues.set(rec, {})
        const snap = _originalValues.get(rec)
        if (!(fieldName in snap)) snap[fieldName] = rec[fieldName]
      })
    })
  }

  function applyTranslations(allTableData) {
    let applied = 0
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const val = rec[fieldName]
        if (!val || typeof val !== 'string' || !val.trim()) return
        const tr = translateCache.value[String(val).trim()]
        if (tr) { rec[fieldName] = tr; applied++ }
      })
    })
    return applied
  }

  function restoreOriginals(allTableData) {
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const snap = _originalValues.get(rec)
        if (snap && fieldName in snap) rec[fieldName] = snap[fieldName]
      })
    })
  }

  // ── Run a text array through AI in batches ──
  // skipLog: true → do not push to aiLog (caller handles logging)
  async function _runBatches(textsArray, endpoint, batchSize, maxRetries, source, apiFn, statusPrefix, contextNote, skipLog = false) {
    let done = 0, errors = 0
    const failedBatch = []
    const totalBatches = Math.ceil(textsArray.length / batchSize)
    for (let b = 0; b < totalBatches; b++) {
      const batch = textsArray.slice(b * batchSize, (b + 1) * batchSize)
      setStatus(
        statusPrefix + ' (' + (done + batch.length) + '/' + textsArray.length + ')',
        'Batch ' + (b+1) + '/' + totalBatches + (contextNote || ''),
        10 + Math.round((b / totalBatches) * 85)
      )
      try {
        const results = await callAPIWithRetry(
          batch, endpoint, maxRetries, 'Batch '+(b+1)+'/'+totalBatches,
          (attempt, max, delayMs) => setStatus(
            '⏳ รอ ' + (delayMs/1000).toFixed(0) + 's แล้ว retry...',
            'Batch '+(b+1)+'/'+totalBatches+' · '+batch.length+' texts',
            10+Math.round((b/totalBatches)*85), attempt, max
          ),
          apiFn
        )
        translateStatus.retryAttempt = null
        const batchTs = new Date().toISOString()
        batch.forEach((origText, i) => {
          if (results[i]) {
            translateCache.value[origText] = results[i]
            if (!skipLog) {
              aiLog.value.push({ original: origText, translated: results[i], source, batchNo: b + 1, ts: batchTs })
            }
            done++
          }
        })
      } catch (e) {
        console.error('Batch ' + (b+1) + ' failed:', e)
        errors++
        batch.forEach(t => failedBatch.push(t))
      }
      if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
    }
    return { done, errors, failedBatch }
  }

  // ─────────────────────────────────────────────────
  // Main entry point
  // options: { dictPolish: bool, engRewrite: bool }
  // ─────────────────────────────────────────────────
  async function runTranslation(allTableData, endpoint, batchSize, maxRetries, options = {}) {
    const { dictPolish = false, engRewrite = false } = options
    _lastAllTableData = allTableData
    _failedTexts = []
    setFailedBadge(0)

    snapshotOriginals(allTableData)

    // ── Collect texts by type ──
    const allThaiTexts = {}
    const allEngTexts  = {}
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const val = rec[fieldName]
        if (!val || typeof val !== 'string' || !val.trim()) return
        const trimmed = String(val).trim()
        if (hasThai(trimmed)) {
          allThaiTexts[trimmed] = true
        } else if (/[a-zA-Z]/.test(trimmed)) {
          allEngTexts[trimmed] = true
        }
      })
    })

    const uniqueThai = Object.keys(allThaiTexts).filter(t => !translateCache.value[t])
    const uniqueEng  = Object.keys(allEngTexts).filter(t => !translateCache.value[t])
    const hasTh  = Object.keys(allThaiTexts).length > 0

    // ── ENG-only rewrite mode (no Thai texts at all) ──
    if (engRewrite && !hasTh) {
      if (!uniqueEng.length) {
        const applied = applyTranslations(allTableData)
        return '✅ ENG Rewrite (จาก cache) · Applied: ' + applied
      }
      if (!endpoint) {
        setStatus('⚠️ ' + uniqueEng.length + ' ENG texts — ใส่ Endpoint ก่อน', '', 50)
        return
      }
      setStatus('✍️ ENG → AI Rewrite...', uniqueEng.length + ' unique texts', 5)
      const { done, errors, failedBatch } = await _runBatches(
        uniqueEng, endpoint, batchSize, maxRetries,
        'eng-rewrite', callAPIEngRewrite, '✍️ ENG Rewrite', ' · ENG texts: ' + uniqueEng.length
      )
      if (failedBatch.length) { failedBatch.forEach(t => _failedTexts.push(t)); setFailedBadge(_failedTexts.length) }
      const applied = applyTranslations(allTableData)
      const summary = (errors ? '⚠️' : '✅') + ' ENG Rewrite · ' + done + ' rewritten · Applied: ' + applied
      setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', errors ? 80 : 100)
      return summary
    }

    // ── No Thai texts ──
    if (!hasTh && !engRewrite) return '✅ ไม่พบข้อความภาษาไทยในช่องที่เลือก'

    // ── Cache-only shortcut ──
    if (!uniqueThai.length) {
      const applied = applyTranslations(allTableData)
      const summary = '✅ แปลสำเร็จ (จาก cache) ' + applied + ' fields · Cache: ' + Object.keys(translateCache.value).length + ' texts'
      setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', 100)
      return summary
    }

    setStatus('📖 Dictionary pass...', uniqueThai.length + ' unique texts', 5)

    // ── Pass 1: Dictionary ──
    resetFuzzyHits()
    let dictHit = 0
    const needAI = []
    const dictResults = [] // for polish pass
    const ts = new Date().toISOString()
    uniqueThai.forEach(text => {
      const result = dictTranslate(text)
      translateCache.value[text] = result
      if (!hasThai(result)) {
        dictHit++
        aiLog.value.push({ original: text, translated: result, source: 'dict', batchNo: 0, ts })
        if (dictPolish) dictResults.push({ original: text, translated: result })
      } else {
        needAI.push(text)
      }
    })

    // ── Pass 2a: Dict → AI Polish ──
    let polishDone = 0, polishErrors = 0
    if (dictPolish && dictResults.length && endpoint) {
      setStatus('✨ Dict → AI Polish...', dictResults.length + ' dict-translated texts', 12)
      const polishInputs = dictResults.map(d => d.translated)
      // skipLog=true — we log manually below with Thai original as `original`
      const { done, errors, failedBatch } = await _runBatches(
        polishInputs, endpoint, batchSize, maxRetries,
        'dict-polish', callAPIPolish, '✨ Dict Polish', ' · Dict hits: ' + dictResults.length,
        true  // skipLog
      )
      polishDone = done; polishErrors = errors
      // Re-map: Thai original → polished English (override dict result in cache)
      // Log entry shows Thai→polished with dict result as middle step in title
      const polishTs = new Date().toISOString()
      dictResults.forEach(({ original, translated }, idx) => {
        const polished = translateCache.value[translated]
        if (polished && polished !== translated) {
          translateCache.value[original] = polished
          aiLog.value.push({
            original,
            translated: polished,
            dictStep: translated,   // store dict intermediate for display
            source: 'dict-polish',
            batchNo: Math.floor(idx / batchSize) + 1,
            ts: polishTs
          })
        } else {
          // Polish didn't improve — keep dict result, log as dict-polish with same text
          aiLog.value.push({
            original,
            translated: translated,
            dictStep: translated,
            source: 'dict-polish',
            batchNo: Math.floor(idx / batchSize) + 1,
            ts: polishTs
          })
        }
      })
      if (failedBatch.length) failedBatch.forEach(t => _failedTexts.push(t))
    }

    // ── Pass 2b: AI Translate (remaining Thai) ──
    let aiDone = 0, aiErrors = 0
    if (needAI.length && endpoint) {
      const { done, errors, failedBatch } = await _runBatches(
        needAI, endpoint, batchSize, maxRetries,
        'ai', callAPI, '🤖 AI pass',
        ' · Dict hit: ' + dictHit + (maxRetries > 0 ? ' · Max retry: ' + maxRetries : '')
      )
      aiDone = done; aiErrors = errors
      if (failedBatch.length) failedBatch.forEach(t => _failedTexts.push(t))
    } else if (needAI.length && !endpoint) {
      setStatus('⚠️ ' + needAI.length + ' ข้อความยังเหลือ — ใส่ Endpoint เพื่อใช้ AI', '', 50)
    }

    // ── Pass 3: ENG → AI Rewrite (combined with TH mode) ──
    let engReDone = 0, engReErrors = 0
    if (engRewrite && uniqueEng.length && endpoint) {
      setStatus('✍️ ENG → AI Rewrite...', uniqueEng.length + ' ENG texts', 88)
      const { done, errors, failedBatch } = await _runBatches(
        uniqueEng, endpoint, batchSize, maxRetries,
        'eng-rewrite', callAPIEngRewrite, '✍️ ENG Rewrite', ' · ENG texts: ' + uniqueEng.length
      )
      engReDone = done; engReErrors = errors
      if (failedBatch.length) failedBatch.forEach(t => _failedTexts.push(t))
    }

    const applied = applyTranslations(allTableData)
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)

    const fuzzyHits = _fuzzyHits
    const hasErrors = aiErrors > 0 || polishErrors > 0 || engReErrors > 0
    const summary = (hasErrors ? '⚠️' : '✅') + ' เสร็จสิ้น · Applied: ' + applied +
      ' · 📖 Dict: ' + dictHit +
      (fuzzyHits ? ' · 🔍 Fuzzy: ' + fuzzyHits : '') +
      (polishDone ? ' · ✨ Polish: ' + polishDone : '') +
      (needAI.length ? ' · 🤖 AI: ' + aiDone : '') +
      (engReDone ? ' · ✍️ ENG: ' + engReDone : '') +
      (hasErrors ? ' · ❌ errors' : '')
    setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', hasErrors ? 80 : 100)
    return summary
  }

  async function retryFailed(endpoint, batchSize, maxRetries) {
    if (!_failedTexts.length) return
    if (_isRetrying) { console.warn('[Translate] retryFailed already in progress, skipping.'); return }
    _isRetrying = true
    const retryTexts = _failedTexts.slice()
    _failedTexts = []
    setFailedBadge(0)
    const totalBatches = Math.ceil(retryTexts.length / batchSize)
    let retryDone = 0, retryErrors = 0
    try {
      for (let b = 0; b < totalBatches; b++) {
        const batch = retryTexts.slice(b * batchSize, (b + 1) * batchSize)
        setStatus('🔄 Retrying ' + (retryDone + batch.length) + '/' + retryTexts.length, 'Retry batch ' + (b+1) + '/' + totalBatches, 10 + Math.round((b / totalBatches) * 85))
        try {
          const results = await callAPIWithRetry(batch, endpoint, maxRetries, 'Retry batch '+(b+1)+'/'+totalBatches,
            (attempt, max, delayMs) => setStatus('⏳ รอ '+(delayMs/1000).toFixed(0)+'s...', 'Retry batch '+(b+1)+'/'+totalBatches, 10+Math.round((b/totalBatches)*85), attempt, max)
          )
          translateStatus.retryAttempt = null
          const batchTs = new Date().toISOString()
          batch.forEach((origText, i) => {
            if (results[i]) {
              translateCache.value[origText] = results[i]
              aiLog.value.push({ original: origText, translated: results[i], source: 'ai-retry', batchNo: b + 1, ts: batchTs })
              retryDone++
            }
          })
        } catch (e) {
          retryErrors++
          batch.forEach(t => _failedTexts.push(t))
        }
        if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
      }
    } finally { _isRetrying = false }
    const applied = _lastAllTableData ? applyTranslations(_lastAllTableData) : 0
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)
    const msg = (retryErrors ? '⚠️' : '✅') + ' Retry เสร็จ · สำเร็จ: ' + retryDone +
      (retryErrors ? ' · ยังเหลือ: ' + (retryTexts.length - retryDone) : '') + ' · Applied: ' + applied
    setStatus(msg, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', retryErrors ? 80 : 100)
    return msg
  }

  return {
    translateFields,
    translateCache,
    translateStatus,
    aiLog,
    clearLog,
    toggleField,
    runTranslation,
    retryFailed,
    applyTranslations,
    restoreOriginals,
    hasFailed: () => _failedTexts.length > 0
  }
}
