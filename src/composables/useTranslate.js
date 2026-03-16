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
  // 🟢 แก้ไขบัค 4: ป้องกัน Race Condition (กดรัว)
  let _isTranslating = false 
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
    
    // 🟢 แก้ไขบัค 3: ให้ซ่อน Status เฉพาะตอนที่สำเร็จ 100% เท่านั้น (ถ้า error จะค้างไว้ให้เห็น)
    if (pct === 100) {
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

  // ── Get PM/MO Type from a record depending on table ──
  function getPmType(rec, tableType) {
    if (tableType === 'IW38' || tableType === 'ZPM02') return (rec['Order Type'] || '').trim()
    if (tableType === 'ZPUCMN') return (rec['MO Type'] || '').trim()
    if (tableType === 'Hours')  return (rec['MO type'] || '').trim()
    return null  // IW47 has no direct PM type — not filtered
  }

  // ── Build indexed input: { "0": text0, "1": text1, ... } ──
  function _buildIndexed(texts) {
    const obj = {}
    texts.forEach((t, i) => { obj[String(i)] = t })
    return obj
  }

  // ── Shared fetch core ──
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
    const raw = (data.choices?.[0]?.message?.content || '')
      .replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
      .replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      throw new Error('API returned non-JSON: ' + raw.slice(0, 120))
    }

    // ── Normalise response → ordered array ──
    if (Array.isArray(parsed)) {
      if (parsed.length !== texts.length) {
        console.warn('[Translate] Array length mismatch: expected', texts.length, 'got', parsed.length)
        while (parsed.length < texts.length) parsed.push(null)
        parsed = parsed.slice(0, texts.length)
      }
      return parsed
    }

    if (parsed && typeof parsed === 'object') {
      const inner = parsed?.translations || parsed?.results || parsed?.data
      if (inner && typeof inner === 'object' && !Array.isArray(inner)) parsed = inner
      else if (inner && Array.isArray(inner)) {
        const arr = inner
        while (arr.length < texts.length) arr.push(null)
        return arr.slice(0, texts.length)
      }

      const result = texts.map((_, i) => {
        const val = parsed[String(i)] ?? parsed[i] ?? null
        return typeof val === 'string' ? val : null
      })
      const missing = result.filter(v => v === null).length
      if (missing > 0) console.warn('[Translate] Keyed response missing', missing, 'of', texts.length, 'entries')
      return result
    }

    throw new Error('API returned unexpected type: ' + typeof parsed)
  }

  // ── API: Translate Thai → English ──
  async function callAPI(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'You are a facility maintenance report writer for SAP work orders.\n\n' +
'Task:\n' +
'Translate Thai maintenance issue descriptions into clear, natural English maintenance report sentences.\n\n' +
'Guidelines:\n' +
'1. Write natural maintenance-report sentences — NOT word-for-word translations.\n' +
'2. Prefer this structure when applicable: "The [component] in/at/on the [location] is [symptom]."\n' +
'3. Use correct prepositions:\n' +
'   - Rooms / areas / buildings → "in the"\n' +
'   - Floors / ceilings / walls → "on the"\n' +
'   - Equipment / machines / positions → "at the"\n' +
'4. For water supply problems use "has no water flow" (NOT "is not flowing").\n' +
'5. Preserve all equipment codes, model numbers, and identifiers exactly as provided.\n' +
'6. Keep sentences concise and professional (1 sentence preferred).\n' +
'7. Use present tense to describe the current condition.\n' +
'8. Do not add assumptions or extra details not present in the original text.\n' +
'9. When describing faults, prefer standard maintenance terms such as: "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index, e.g. {"0":"...", "1":"..."}. The number of outputs MUST match the number of inputs. No markdown, no explanations, no extra text.\n\n' +
'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Polish Dict-translated English ──
  async function callAPIPolish(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'You are a facility maintenance report writer for SAP work orders. The following texts are English translations produced from a Thai-English dictionary and may be literal, fragmented, or grammatically awkward.\n\n' +
'Task:\n' +
'Rewrite each item into a clear, natural, professional maintenance report sentence.\n\n' +
'Guidelines:\n' +
'1. Correct grammar, word order, and phrasing so the sentence reads naturally in a maintenance report.\n' +
'2. Prefer this structure when applicable: "The [component] in/at/on the [location] is [symptom]."\n' +
'3. Use correct prepositions:\n' +
'   - Rooms / areas / buildings → "in the"\n' +
'   - Floors / ceilings / walls → "on the"\n' +
'   - Equipment / machines / positions → "at the"\n' +
'4. Preserve all equipment codes, model numbers, and identifiers exactly as provided.\n' +
'5. Keep the sentence concise and professional (1 sentence preferred).\n' +
'6. Use present tense to describe the current condition.\n' +
'7. Do not add assumptions or extra information not present in the original text.\n' +
'8. When describing faults, prefer standard maintenance terminology such as: "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index, e.g. {"0":"...", "1":"..."}. The number of outputs MUST match the number of inputs. No markdown, no explanations, no extra text.\n\n' +
'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Rewrite English → Better English ──
  async function callAPIEngRewrite(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'You are a facility maintenance report writer for SAP work orders. The following texts are English SAP work order descriptions that may be abbreviated, terse, or unclear.\n\n' +
'Task:\n' +
'Rewrite each item into a clear, natural, professional maintenance report sentence.\n\n' +
'Guidelines:\n' +
'1. Expand abbreviations where necessary and improve clarity while preserving the original meaning.\n' +
'2. Prefer this structure when applicable: "The [component] in/at/on the [location] is/has [symptom or issue]."\n' +
'3. Use correct prepositions:\n' +
'   - Rooms / areas / buildings → "in the"\n' +
'   - Floors / ceilings / walls → "on the"\n' +
'   - Equipment / machines / positions → "at the"\n' +
'4. Preserve all equipment codes, tag numbers, model names, and identifiers exactly as provided.\n' +
'5. If the original text is already clear and complete, keep it with only minor grammatical improvements.\n' +
'6. Keep the sentence concise and professional (1 sentence preferred).\n' +
'7. Use present tense to describe the current condition.\n' +
'8. Do not add assumptions or extra details not present in the original text.\n' +
'9. When describing faults, prefer standard maintenance terminology such as: "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index, e.g. {"0":"...", "1":"..."}. The number of outputs MUST match the number of inputs. No markdown, no explanations, no extra text.\n\n' +
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
        
        // อ่านจาก Original เพื่อเช็ค Cache เสมอ
        const snap = _originalValues.get(rec)
        const checkVal = (snap && fieldName in snap) ? snap[fieldName] : val
        
        const tr = translateCache.value[String(checkVal).trim()]
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
  // ─────────────────────────────────────────────────
  async function runTranslation(allTableData, endpoint, batchSize, maxRetries, options = {}) {
    // 🟢 แก้ไขบัค 4: ป้องกัน Race Condition
    if (_isTranslating) { 
      console.warn('[Translate] Translation already in progress, skipping.')
      return 
    }
    _isTranslating = true

    try {
      const { dictPolish = false, engRewrite = false, bypassDict = false, engRewritePmTypes = null } = options
      _lastAllTableData = allTableData
      _failedTexts = []
      setFailedBadge(0)

      snapshotOriginals(allTableData)

      const allThaiTexts = {}
      const allEngTexts  = {}
      const pmFilter = engRewritePmTypes && engRewritePmTypes.size > 0 ? engRewritePmTypes : null
      
      translateFields.forEach(key => {
        const [tableType, fieldName] = key.split('::')
        ;(allTableData[tableType] || []).forEach(rec => {
          
          // 🟢 แก้ไขบัค 1: อ่านค่า original เพื่อไม่ให้ข้อความที่แปลแล้ว ถูกมองว่าเป็น Eng Original
          const snap = _originalValues.get(rec)
          const val = (snap && fieldName in snap) ? snap[fieldName] : rec[fieldName]
          
          if (!val || typeof val !== 'string' || !val.trim()) return
          const trimmed = String(val).trim()
          
          if (hasThai(trimmed)) {
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

      const uniqueThai = Object.keys(allThaiTexts).filter(t => !translateCache.value[t])
      const uniqueEng  = Object.keys(allEngTexts).filter(t => !translateCache.value[t])
      const hasTh  = Object.keys(allThaiTexts).length > 0

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
          translateCache.value[text] = result
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
      let polishDone = 0, polishErrors = 0
      if (dictPolish && dictResults.length && endpoint) {
        setStatus('✨ Dict → AI Polish...', dictResults.length + ' dict-translated texts', 12)
        const polishInputs = dictResults.map(d => d.translated)
        const { done, errors, failedBatch } = await _runBatches(
          polishInputs, endpoint, batchSize, maxRetries,
          'dict-polish', callAPIPolish, '✨ Dict Polish', ' · Dict hits: ' + dictResults.length,
          true  
        )
        polishDone = done; polishErrors = errors
        
        const polishTs = new Date().toISOString()
        dictResults.forEach(({ original, translated }, idx) => {
          const polished = translateCache.value[translated]
          if (polished && polished !== translated) {
            translateCache.value[original] = polished
            aiLog.value.push({
              original,
              translated: polished,
              dictStep: translated,
              source: 'dict-polish',
              batchNo: Math.floor(idx / batchSize) + 1,
              ts: polishTs
            })
          } else {
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
        
        // 🟢 แก้ไขบัค 2: หา Original (Thai) ของ text ที่ failed ส่งไป retry
        if (failedBatch.length) {
          failedBatch.forEach(failedEngText => {
            const match = dictResults.find(d => d.translated === failedEngText)
            if (match) {
              _failedTexts.push(match.original) // ดันภาษาไทยกลับเข้าไป
            } else {
              _failedTexts.push(failedEngText) // Fallback กรณีหาไม่เจอ (ไม่ควรเกิดขึ้น)
            }
          })
        }
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

      // ── Pass 3: ENG → AI Rewrite ──
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
        (bypassDict ? ' · ⚡ Bypass Dict' : ' · 📖 Dict: ' + dictHit) +
        (fuzzyHits ? ' · 🔍 Fuzzy: ' + fuzzyHits : '') +
        (polishDone ? ' · ✨ Polish: ' + polishDone : '') +
        (needAI.length ? ' · 🤖 AI: ' + aiDone : '') +
        (engReDone ? ' · ✍️ ENG: ' + engReDone : '') +
        (hasErrors ? ' · ❌ errors' : '')
      setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', hasErrors ? 80 : 100)
      return summary
      
    } finally {
      // 🟢 เคลียร์ Flag ไม่ว่าจะจบแบบ Error หรือ สำเร็จ
      _isTranslating = false
    }
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
