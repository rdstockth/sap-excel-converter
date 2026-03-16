import { ref, reactive } from 'vue'
import { dictTranslate, hasThai, resetFuzzyHits, _fuzzyHits } from '../utils/translateDict.js'

// ── Cache namespace prefixes (Bug #9: prevent cross-mode key conflicts) ──
const NS = { th: 'th:', en: 'en:', pl: 'pl:' }
const cacheKey = (ns, text) => ns + text.trim()   // Bug #8: always trim

// ── Symbol key for original-value snapshot (Bug #6: replaces WeakMap) ──
const ORIG_SYM = Symbol('origValues')

export function useTranslate() {
  const translateFields = reactive(new Set([
    'IW38::Description'
  ]))

  const translateCache = ref({})

  const translateStatus = reactive({
    show: false, text: '', sub: '', pct: 0,
    retryAttempt: null, maxRetry: null, failedCount: 0, failedBadge: false
  })

  // Each entry: { original, translated, source, batchNo, ts, dictStep? }
  const aiLog = ref([])
  function clearLog() { aiLog.value = [] }

  let _failedTexts = []
  let _lastAllTableData = null
  let _lastCacheNs = NS.th   // namespace of last failing pass
  let _isRetrying = false
  let _hideStatusTimer = null

  // ─────────────────────────────────────────────────
  // Status helpers
  // ─────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────
  // PM type helper
  // ─────────────────────────────────────────────────
  function getPmType(rec, tableType) {
    if (tableType === 'IW38' || tableType === 'ZPM02') return (rec['Order Type'] || '').trim()
    if (tableType === 'ZPUCMN') return (rec['MO Type'] || '').trim()
    if (tableType === 'Hours')  return (rec['MO type'] || '').trim()
    return null
  }

  // ─────────────────────────────────────────────────
  // Build indexed input { "0": text, "1": text, ... }
  // Prevents AI from reordering output
  // ─────────────────────────────────────────────────
  function _buildIndexed(texts) {
    const obj = {}
    texts.forEach((t, i) => { obj[String(i)] = t })
    return obj
  }

  // ─────────────────────────────────────────────────
  // JSON extraction (Bug #7: robust markdown stripping)
  // Extracts first { } or [ ] block from raw string
  // ─────────────────────────────────────────────────
  function _extractJSON(raw) {
    // Strip <think>...</think>
    raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    // Try to find first JSON block (object or array)
    const jsonMatch = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
    if (jsonMatch) return jsonMatch[1]
    // Fallback: strip ``` fences and return whatever is left
    return raw
      .replace(/^```[a-z]*\s*/i, '')
      .replace(/\s*```[\s\S]*$/, '')
      .trim()
  }

  // ─────────────────────────────────────────────────
  // Shared fetch core
  // Returns ordered array aligned with texts[]
  // ─────────────────────────────────────────────────
  async function _fetchAPI(texts, endpoint, prompt) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: Math.min(4000, Math.max(1000, texts.length * 35))
      })
    })
    if (!res.ok) throw new Error('API HTTP ' + res.status)
    const data = await res.json()
    const extracted = _extractJSON(data.choices?.[0]?.message?.content || '')

    let parsed
    try {
      parsed = JSON.parse(extracted)
    } catch (e) {
      throw new Error('API non-JSON: ' + extracted.slice(0, 120))
    }

    // ── Normalise to ordered array ──
    if (Array.isArray(parsed)) {
      if (parsed.length !== texts.length) {
        console.warn('[Translate] Array length mismatch: expected', texts.length, 'got', parsed.length)
        while (parsed.length < texts.length) parsed.push(null)
        parsed = parsed.slice(0, texts.length)
      }
      return parsed
    }

    if (parsed && typeof parsed === 'object') {
      // Unwrap nested wrapper e.g. { translations: {...} }
      const inner = parsed?.translations || parsed?.results || parsed?.data
      if (inner && !Array.isArray(inner) && typeof inner === 'object') parsed = inner
      else if (Array.isArray(inner)) {
        while (inner.length < texts.length) inner.push(null)
        return inner.slice(0, texts.length)
      }
      // Re-assemble by index key (prevents swap bugs)
      const result = texts.map((_, i) => {
        const val = parsed[String(i)] ?? parsed[i] ?? null
        return typeof val === 'string' ? val : null
      })
      const missing = result.filter(v => v === null).length
      if (missing > 0) console.warn('[Translate] Missing', missing, 'of', texts.length, 'keyed entries')
      return result
    }

    throw new Error('API unexpected type: ' + typeof parsed)
  }

  // ─────────────────────────────────────────────────
  // Prompt functions
  // ─────────────────────────────────────────────────
  async function callAPI(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'Translate Thai SAP maintenance descriptions to concise English.\n\n' +
      'Style: short, clear, technical — include what + where + problem. Max ~12 words.\n' +
      'Examples:\n' +
      '  "ท่อน้ำชั้น2รั่ว" → "Water pipe floor 2 leaking"\n' +
      '  "แอร์ห้อง301ไม่เย็น" → "AC room 301 not cooling"\n' +
      '  "loading conveyor 4 ไม่หมุน" → "Loading conveyor 4 not rotating"\n' +
      '  "เซ็นเซอร์สายพาน3ขาด" → "Sensor conveyor belt 3 broken"\n\n' +
      'Rules:\n' +
      '1. Include location/line number if present in the original.\n' +
      '2. Keep all codes, numbers, model names exactly as-is.\n' +
      '3. No articles (a/the), no "is/are", no punctuation unless needed.\n' +
      '4. If text is already English or mixed, clean it up without expanding.\n\n' +
      'IMPORTANT: Return ONLY a JSON object keyed by index, e.g. {"0":"...", "1":"..."}. Same count as input. No markdown, no preamble.\n\n' +
      'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  async function callAPIPolish(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'Polish these rough English maintenance descriptions. Fix grammar and word order only.\n\n' +
      'Style: short, clear, technical — include what + where + problem. Max ~12 words.\n' +
      'Examples:\n' +
      '  "pipe water floor 2 leak" → "Water pipe floor 2 leaking"\n' +
      '  "air not cool room 301" → "AC room 301 not cooling"\n' +
      '  "sensor belt line 3 cut" → "Sensor conveyor belt line 3 broken"\n\n' +
      'Rules:\n' +
      '1. Fix word order and grammar — do NOT add detail not in the original.\n' +
      '2. Keep location/line numbers if present.\n' +
      '3. Keep all codes, numbers, model names exactly as-is.\n' +
      '4. No articles (a/the), no "is/are", no punctuation unless needed.\n\n' +
      'IMPORTANT: Return ONLY a JSON object keyed by index, e.g. {"0":"...", "1":"..."}. Same count as input. No markdown, no preamble.\n\n' +
      'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  async function callAPIEngRewrite(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'Rewrite these English SAP maintenance descriptions to be concise and clear.\n\n' +
      'Style: short, clear, technical — include what + where + problem. Max ~12 words.\n' +
      'Examples:\n' +
      '  "pipe water top 2 leak" → "Water pipe floor 2 leaking"\n' +
      '  "loading conveyor 4 not spin" → "Loading conveyor 4 not rotating"\n' +
      '  "M/C 3 tank 2.2 error" → "M/C 3 tank 2.2 error" (already clear — keep as-is)\n\n' +
      'Rules:\n' +
      '1. Keep location, line numbers, and equipment context from the original.\n' +
      '2. Keep all codes, numbers, model names exactly as-is.\n' +
      '3. If already clear and short, return with minimal change.\n' +
      '4. No articles (a/the), no "is/are", no punctuation unless needed.\n\n' +
      'IMPORTANT: Return ONLY a JSON object keyed by index, e.g. {"0":"...", "1":"..."}. Same count as input. No markdown, no preamble.\n\n' +
      'Input:\n' + JSON.stringify(indexedInput)
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
      } catch (e) {
        lastError = e
        console.warn('[Translate]', batchLabel, 'attempt', attempt + 1, 'failed:', e.message)
      }
    }
    throw lastError
  }

  // ─────────────────────────────────────────────────
  // Snapshot / apply / restore originals
  // Bug #6: use Symbol property on record instead of WeakMap
  // so references survive even if caller recreates table arrays
  // ─────────────────────────────────────────────────
  function snapshotOriginals(allTableData) {
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        if (!rec[ORIG_SYM]) rec[ORIG_SYM] = {}
        if (!(fieldName in rec[ORIG_SYM])) rec[ORIG_SYM][fieldName] = rec[fieldName]
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
        const k = cacheKey(NS.th, val)
        const tr = translateCache.value[k] ??
          translateCache.value[cacheKey(NS.en, val)] ??
          translateCache.value[cacheKey(NS.pl, val)]
        if (tr) { rec[fieldName] = tr; applied++ }
      })
    })
    return applied
  }

  function restoreOriginals(allTableData) {
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const snap = rec[ORIG_SYM]
        if (snap && fieldName in snap) rec[fieldName] = snap[fieldName]
      })
    })
  }

  // ─────────────────────────────────────────────────
  // Run batches through AI
  // Bug #2: use `processed` counter for accurate progress display
  // Bug #1: returns resultsByInputIdx Map for callers that need index-based mapping
  // skipLog: caller handles logging manually (used by polish pass)
  // ─────────────────────────────────────────────────
  async function _runBatches(textsArray, endpoint, batchSize, maxRetries, source, apiFn, statusPrefix, contextNote, skipLog = false, cacheNs = NS.th) {
    let done = 0, processed = 0, errors = 0
    const failedBatch = []
    const totalBatches = Math.ceil(textsArray.length / batchSize)
    // Bug #1: store results indexed by global position in textsArray
    const resultsByInputIdx = new Map()

    for (let b = 0; b < totalBatches; b++) {
      const batch = textsArray.slice(b * batchSize, (b + 1) * batchSize)
      // Bug #2: show processed count, not done count
      setStatus(
        statusPrefix + ' (' + (processed + batch.length) + '/' + textsArray.length + ')',
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
          const globalIdx = b * batchSize + i
          const result = results[i]
          if (result) {
            // Bug #8: normalize key on set
            translateCache.value[cacheKey(cacheNs, origText)] = result
            resultsByInputIdx.set(globalIdx, result)
            if (!skipLog) {
              aiLog.value.push({ original: origText, translated: result, source, batchNo: b + 1, ts: batchTs })
            }
            done++
          }
        })
      } catch (e) {
        console.error('Batch ' + (b+1) + ' failed:', e)
        errors++
        batch.forEach(t => failedBatch.push({ text: t, ns: cacheNs }))
      }
      processed += batch.length  // Bug #2: always increment by batch size
      if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
    }
    return { done, processed, errors, failedBatch, resultsByInputIdx }
  }

  // ─────────────────────────────────────────────────
  // Main entry point
  // options: { dictPolish, engRewrite, bypassDict, engRewritePmTypes }
  // ─────────────────────────────────────────────────
  async function runTranslation(allTableData, endpoint, batchSize, maxRetries, options = {}) {
    const { dictPolish = false, engRewrite = false, bypassDict = false, engRewritePmTypes = null } = options
    _lastAllTableData = allTableData
    _failedTexts = []
    setFailedBadge(0)

    snapshotOriginals(allTableData)

    // ── Collect texts ──
    // Bug #5: text with any Thai → Thai path (handles mixed like "pump เสีย")
    const allThaiTexts = {}
    const allEngTexts  = {}
    const pmFilter = engRewritePmTypes && engRewritePmTypes.size > 0 ? engRewritePmTypes : null

    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const val = rec[fieldName]
        if (!val || typeof val !== 'string' || !val.trim()) return
        const trimmed = val.trim()
        if (hasThai(trimmed)) {
          // Bug #5: mixed text (Thai + ENG) → Thai path for translation
          allThaiTexts[trimmed] = true
        } else if (/[a-zA-Z]/.test(trimmed)) {
          if (pmFilter) {
            const pmType = getPmType(rec, tableType)
            if (pmType && !pmFilter.has(pmType)) return
          }
          allEngTexts[trimmed] = true
        }
      })
    })

    // Bug #8: filter by namespaced cache key
    const uniqueThai = Object.keys(allThaiTexts).filter(t => !translateCache.value[cacheKey(NS.th, t)])
    const uniqueEng  = Object.keys(allEngTexts).filter(t => !translateCache.value[cacheKey(NS.en, t)])
    const hasTh = Object.keys(allThaiTexts).length > 0

    // ── ENG-only rewrite mode ──
    if (engRewrite && !hasTh) {
      if (!uniqueEng.length) {
        const applied = applyTranslations(allTableData)
        return '✅ ENG Rewrite (จาก cache) · Applied: ' + applied
      }
      if (!endpoint) { setStatus('⚠️ ' + uniqueEng.length + ' ENG texts — ใส่ Endpoint ก่อน', '', 50); return }
      setStatus('✍️ ENG → AI Rewrite...', uniqueEng.length + ' unique texts', 5)
      const { done, errors, failedBatch } = await _runBatches(
        uniqueEng, endpoint, batchSize, maxRetries,
        'eng-rewrite', callAPIEngRewrite, '✍️ ENG Rewrite', ' · ENG texts: ' + uniqueEng.length,
        false, NS.en
      )
      if (failedBatch.length) { failedBatch.forEach(item => _failedTexts.push(item)); setFailedBadge(_failedTexts.length) }
      const applied = applyTranslations(allTableData)
      const summary = (errors ? '⚠️' : '✅') + ' ENG Rewrite · ' + done + ' rewritten · Applied: ' + applied
      setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', errors ? 80 : 100)
      return summary
    }

    if (!hasTh && !engRewrite) return '✅ ไม่พบข้อความภาษาไทยในช่องที่เลือก'

    if (!uniqueThai.length) {
      const applied = applyTranslations(allTableData)
      const summary = '✅ แปลสำเร็จ (จาก cache) ' + applied + ' fields · Cache: ' + Object.keys(translateCache.value).length + ' texts'
      setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', 100)
      return summary
    }

    // ── Pass 1: Dictionary ──
    resetFuzzyHits()
    let dictHit = 0
    const needAI = []
    const dictResults = []
    const ts = new Date().toISOString()

    if (bypassDict) {
      setStatus('⚡ Bypass Dict → AI ทั้งหมด...', uniqueThai.length + ' unique texts', 5)
      uniqueThai.forEach(text => needAI.push(text))
    } else {
      setStatus('📖 Dictionary pass...', uniqueThai.length + ' unique texts', 5)
      uniqueThai.forEach(text => {
        const result = dictTranslate(text)
        // Bug #8: store with namespace
        translateCache.value[cacheKey(NS.th, text)] = result
        if (!hasThai(result)) {
          dictHit++
          aiLog.value.push({ original: text, translated: result, source: 'dict', batchNo: 0, ts })
          if (dictPolish) dictResults.push({ original: text, translated: result })
        } else {
          needAI.push(text)
        }
      })
    }

    // ── Pass 2a: Dict → AI Polish ──
    // Bug #1: use resultsByInputIdx instead of cache-key lookup
    let polishDone = 0, polishErrors = 0
    if (dictPolish && dictResults.length && endpoint) {
      setStatus('✨ Dict → AI Polish...', dictResults.length + ' dict-translated texts', 12)
      const polishInputs = dictResults.map(d => d.translated)
      const { done, errors, failedBatch, resultsByInputIdx } = await _runBatches(
        polishInputs, endpoint, batchSize, maxRetries,
        'dict-polish', callAPIPolish, '✨ Dict Polish', ' · Dict hits: ' + dictResults.length,
        true, NS.pl  // skipLog=true, polish namespace
      )
      polishDone = done; polishErrors = errors
      const polishTs = new Date().toISOString()
      // Bug #1: map by index — no intermediate cache key lookup
      dictResults.forEach(({ original, translated }, idx) => {
        const polished = resultsByInputIdx.get(idx)
        const final = (polished && polished !== translated) ? polished : translated
        // Store under Thai original key (namespace th:)
        translateCache.value[cacheKey(NS.th, original)] = final
        aiLog.value.push({
          original,
          translated: final,
          dictStep: translated,
          source: 'dict-polish',
          batchNo: Math.floor(idx / batchSize) + 1,
          ts: polishTs
        })
      })
      if (failedBatch.length) failedBatch.forEach(item => _failedTexts.push(item))
    }

    // ── Pass 2b: AI Translate (remaining Thai) ──
    let aiDone = 0, aiErrors = 0
    if (needAI.length && endpoint) {
      const { done, errors, failedBatch } = await _runBatches(
        needAI, endpoint, batchSize, maxRetries,
        'ai', callAPI, '🤖 AI pass',
        ' · Dict hit: ' + dictHit + (maxRetries > 0 ? ' · Max retry: ' + maxRetries : ''),
        false, NS.th
      )
      aiDone = done; aiErrors = errors
      if (failedBatch.length) failedBatch.forEach(item => _failedTexts.push(item))
    } else if (needAI.length && !endpoint) {
      setStatus('⚠️ ' + needAI.length + ' ข้อความยังเหลือ — ใส่ Endpoint เพื่อใช้ AI', '', 50)
    }

    // ── Pass 3: ENG → AI Rewrite ──
    let engReDone = 0, engReErrors = 0
    if (engRewrite && uniqueEng.length && endpoint) {
      setStatus('✍️ ENG → AI Rewrite...', uniqueEng.length + ' ENG texts', 88)
      const { done, errors, failedBatch } = await _runBatches(
        uniqueEng, endpoint, batchSize, maxRetries,
        'eng-rewrite', callAPIEngRewrite, '✍️ ENG Rewrite', ' · ENG texts: ' + uniqueEng.length,
        false, NS.en
      )
      engReDone = done; engReErrors = errors
      if (failedBatch.length) failedBatch.forEach(item => _failedTexts.push(item))
    }

    const applied = applyTranslations(allTableData)
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)

    const fuzzyHits = _fuzzyHits
    const hasErrors = aiErrors > 0 || polishErrors > 0 || engReErrors > 0
    const summary = (hasErrors ? '⚠️' : '✅') + ' เสร็จสิ้น · Applied: ' + applied +
      (bypassDict ? ' · ⚡ Bypass Dict' : ' · 📖 Dict: ' + dictHit) +
      (fuzzyHits ? ' · 🔍 Fuzzy: ' + fuzzyHits : '') +
      (polishDone ? ' · ✨ Polish: ' + polishDone : '') +
      (needAI.length ? ' · 🤖 AI: ' + aiDone : '') +
      (engReDone ? ' · ✍️ ENG: ' + engReDone : '') +
      (hasErrors ? ' · ❌ errors' : '')
    setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', hasErrors ? 80 : 100)
    return summary
  }

  // ─────────────────────────────────────────────────
  // Retry failed batches
  // Bug #3: uses explicit 'ai-retry' source (separate from normal 'ai')
  // ─────────────────────────────────────────────────
  async function retryFailed(endpoint, batchSize, maxRetries, cacheNs = NS.th) {
    if (!_failedTexts.length) return
    if (_isRetrying) { console.warn('[Translate] retryFailed already in progress'); return }
    _isRetrying = true
    // _failedTexts stores { text, ns } objects
    const retryItems = _failedTexts.slice()
    _failedTexts = []
    setFailedBadge(0)
    const totalBatches = Math.ceil(retryItems.length / batchSize)
    let retryDone = 0, processed = 0, retryErrors = 0
    try {
      for (let b = 0; b < totalBatches; b++) {
        const batchItems = retryItems.slice(b * batchSize, (b + 1) * batchSize)
        const batchTexts = batchItems.map(it => it.text)
        setStatus(
          '🔄 Retrying (' + (processed + batchItems.length) + '/' + retryItems.length + ')',
          'Retry batch ' + (b+1) + '/' + totalBatches,
          10 + Math.round((b / totalBatches) * 85)
        )
        try {
          const results = await callAPIWithRetry(
            batchTexts, endpoint, maxRetries, 'Retry batch '+(b+1)+'/'+totalBatches,
            (attempt, max, delayMs) => setStatus(
              '⏳ รอ '+(delayMs/1000).toFixed(0)+'s...',
              'Retry batch '+(b+1)+'/'+totalBatches,
              10+Math.round((b/totalBatches)*85), attempt, max
            )
          )
          translateStatus.retryAttempt = null
          const batchTs = new Date().toISOString()
          batchItems.forEach(({ text: origText, ns: itemNs }, i) => {
            if (results[i]) {
              translateCache.value[cacheKey(itemNs, origText)] = results[i]
              aiLog.value.push({ original: origText, translated: results[i], source: 'ai-retry', batchNo: b + 1, ts: batchTs })
              retryDone++
            }
          })
        } catch (e) {
          retryErrors++
          batchItems.forEach(item => _failedTexts.push(item))
        }
        processed += batchItems.length
        if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
      }
    } finally { _isRetrying = false }

    const applied = _lastAllTableData ? applyTranslations(_lastAllTableData) : 0
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)
    const msg = (retryErrors ? '⚠️' : '✅') + ' Retry เสร็จ · สำเร็จ: ' + retryDone +
      (retryErrors ? ' · ยังเหลือ: ' + (retryItems.length - retryDone) : '') + ' · Applied: ' + applied
    setStatus(msg, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', retryErrors ? 80 : 100)
    return msg
  }

  return {
    translateFields, translateCache, translateStatus, aiLog, clearLog,
    toggleField, runTranslation, retryFailed, applyTranslations, restoreOriginals,
    hasFailed: () => _failedTexts.length > 0
  }
}
