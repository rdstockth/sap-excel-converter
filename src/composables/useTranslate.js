import { ref, reactive } from 'vue'
import { dictTranslate, hasThai, resetFuzzyHits, _fuzzyHits } from '../utils/translateDict.js'

export function useTranslate() {
  const translateFields = reactive(new Set([
    'IW38::Description', 'IW38::Description.1',
    'ZPUCMN::Desc.',
    'Hours::Damage Text', 'Hours::Cause Text', 'Hours::Activity Text'
  ]))

  // FIX #3: use ref({}) instead of reactive({}) for reliable Vue reactivity on dynamic keys
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

  let _failedTexts = []
  let _lastAllTableData = null
  // FIX #4: guard flag to prevent concurrent retryFailed() calls
  let _isRetrying = false

  // FIX #5: store original field values so we can restore them if needed
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
    // fix: ซ่อนอัตโนมัติเมื่อ progress ครบ 100% หรือ 80% (error case)
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
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== texts.length) throw new Error('API returned unexpected format')
    return parsed
  }

  async function callAPIWithRetry(texts, endpoint, maxRetries, batchLabel, onRetry) {
    let lastError
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delayMs = Math.pow(2, attempt - 1) * 1000
          onRetry?.(attempt, maxRetries, delayMs)
          await new Promise(r => setTimeout(r, delayMs))
        }
        return await callAPI(texts, endpoint)
      } catch (e) { lastError = e; console.warn('[Translate]', batchLabel, 'attempt', attempt + 1, 'failed:', e.message) }
    }
    throw lastError
  }

  // FIX #5: snapshot original values into WeakMap before mutating, so caller can restore if needed
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
        if (!hasThai(val)) return
        // FIX #3: access ref value with .value
        const tr = translateCache.value[String(val).trim()]
        if (tr) { rec[fieldName] = tr; applied++ }
      })
    })
    return applied
  }

  // FIX #5: restore original (pre-translation) field values
  function restoreOriginals(allTableData) {
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const snap = _originalValues.get(rec)
        if (snap && fieldName in snap) rec[fieldName] = snap[fieldName]
      })
    })
  }

  async function runTranslation(allTableData, endpoint, batchSize, maxRetries) {
    _lastAllTableData = allTableData
    _failedTexts = []
    setFailedBadge(0)

    // FIX #5: snapshot originals before any mutation
    snapshotOriginals(allTableData)

    const allTexts = {}
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const val = rec[fieldName]
        if (hasThai(val)) allTexts[String(val).trim()] = true
      })
    })

    // FIX #3: access ref with .value
    const uniqueTexts = Object.keys(allTexts).filter(t => !translateCache.value[t])

    // FIX #1: split the two conditions — no Thai found vs. all already cached
    if (!Object.keys(allTexts).length) return '✅ ไม่พบข้อความภาษาไทยในช่องที่เลือก'
    if (!uniqueTexts.length) {
      // Everything already in cache — just apply and return
      const applied = applyTranslations(allTableData)
      const summary = '✅ แปลสำเร็จ (จาก cache) ' + applied + ' fields · Cache: ' + Object.keys(translateCache.value).length + ' texts'
      setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', 100)
      return summary
    }

    setStatus('📖 Dictionary pass...', uniqueTexts.length + ' unique texts', 5)

    // Pass 1: Dictionary
    resetFuzzyHits()
    let dictHit = 0
    const needAI = []
    uniqueTexts.forEach(text => {
      const result = dictTranslate(text)
      // FIX #3: write into ref value
      translateCache.value[text] = result
      if (!hasThai(result)) dictHit++
      else needAI.push(text)
    })

    // Pass 2: AI
    let aiDone = 0, errors = 0
    if (needAI.length && endpoint) {
      const totalBatches = Math.ceil(needAI.length / batchSize)
      for (let b = 0; b < totalBatches; b++) {
        const batch = needAI.slice(b * batchSize, (b + 1) * batchSize)
        setStatus(
          '🤖 AI pass (' + (aiDone + batch.length) + '/' + needAI.length + ')',
          'Batch ' + (b+1) + '/' + totalBatches + ' · Dict hit: ' + dictHit + (maxRetries > 0 ? ' · Max retry: ' + maxRetries : ''),
          10 + Math.round((b / totalBatches) * 85)
        )
        try {
          const results = await callAPIWithRetry(batch, endpoint, maxRetries, 'Batch '+(b+1)+'/'+totalBatches,
            (attempt, max, delayMs) => setStatus('⏳ รอ ' + (delayMs/1000).toFixed(0) + 's แล้ว retry...', 'Batch '+(b+1)+'/'+totalBatches+' · '+batch.length+' texts', 10+Math.round((b/totalBatches)*85), attempt, max)
          )
          translateStatus.retryAttempt = null
          // FIX #3: write into ref value
          batch.forEach((origText, i) => { if (results[i]) { translateCache.value[origText] = results[i]; aiDone++ } })
        } catch (e) {
          console.error('Batch ' + (b+1) + ' failed after retries:', e)
          errors++
          batch.forEach(t => _failedTexts.push(t))
        }
        if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
      }
    } else if (needAI.length && !endpoint) {
      setStatus('⚠️ ' + needAI.length + ' ข้อความยังเหลือ — ใส่ Endpoint เพื่อใช้ AI', '', 50)
    }

    const applied = applyTranslations(allTableData)
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)

    // _fuzzyHits is a live ES module binding — reads the current value correctly
    const fuzzyHits = _fuzzyHits
    const summary = (errors ? '⚠️' : '✅') + ' แปลสำเร็จ ' + applied + ' fields' +
      ' · 📖 Dict: ' + dictHit +
      (fuzzyHits ? ' · 🔍 Fuzzy: ' + fuzzyHits : '') +
      (needAI.length ? ' · 🤖 AI: ' + aiDone : '') +
      (errors ? ' · ❌ ' + errors + ' batch error' : '')
    setStatus(summary, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', errors ? 80 : 100)
    return summary
  }

  async function retryFailed(endpoint, batchSize, maxRetries) {
    if (!_failedTexts.length) return
    // FIX #4: prevent concurrent retry runs from corrupting _failedTexts
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
          // FIX #3: write into ref value
          batch.forEach((origText, i) => { if (results[i]) { translateCache.value[origText] = results[i]; retryDone++ } })
        } catch (e) {
          retryErrors++
          batch.forEach(t => _failedTexts.push(t))
        }
        if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
      }
    } finally {
      // FIX #4: always release the lock, even if something throws
      _isRetrying = false
    }

    const applied = _lastAllTableData ? applyTranslations(_lastAllTableData) : 0
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)

    const msg = (retryErrors ? '⚠️' : '✅') + ' Retry เสร็จ · สำเร็จ: ' + retryDone +
      (retryErrors ? ' · ยังเหลือ: ' + (retryTexts.length - retryDone) : '') + ' · Applied: ' + applied
    setStatus(msg, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', retryErrors ? 80 : 100)
    return msg
  }

  return {
    translateFields,
    translateCache,       // now a ref — template access: translateCache.value[key]
    translateStatus,
    toggleField,
    runTranslation,
    retryFailed,
    applyTranslations,
    restoreOriginals,     // FIX #5: exposed so caller can undo translations if needed
    hasFailed: () => _failedTexts.length > 0
  }
}
