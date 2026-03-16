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

  // ✅ [FIX] _failedTexts จะเก็บเป็น Object: { text, source, apiFn, original } แทน String ธรรมดา
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

  // ── API: Polish Dict-translated English ──
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

  // ── API: Rewrite English → Better English ──
  // ✅ [UPDATE] ปรับ Prompt ให้เก็บรายละเอียดครบถ้วน ไม่มโนเพิ่ม และจำกัดไม่เกิน 20 words
  async function callAPIEngRewrite(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'Rewrite these English SAP maintenance descriptions to be clear and detailed.\n\n' +
      'Style: Technical, structured (Component + Location + Exact Problem/Symptom). Max 20 words.\n' +
      'Examples:\n' +
      '  "pipe water top 2 leak joint" → "Water pipe joint on floor 2 leaking"\n' +
      '  "motor pump 3 vibrate loud noise bearing" → "Pump 3 motor vibrating with loud noise at bearing"\n' +
      '  "M/C 3 tank 2.2 error pressure low" → "M/C 3 tank 2.2 low pressure error"\n\n' +
      'Rules:\n' +
      '1. Retain all specific details: locations, specific parts, and exact symptoms from the original.\n' +
      '2. Keep all codes, numbers, and model names exactly as-is.\n' +
      '3. Ensure logical sentence flow without adding outside assumptions.\n' +
      '4. Omit unnecessary filler words (a/the) to keep it concise, but maintain readability.\n\n' +
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
  // ✅ [FIX] เพิ่ม parameter `originalMapper` เพื่อเก็บต้นฉบับภาษาไทยในกรณีที่ส่ง Dict-Eng ไป Polish
  async function _runBatches(textsArray, endpoint, batchSize, maxRetries, source, apiFn, statusPrefix, contextNote, skipLog = false, originalMapper = null) {
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
              const trueOriginal = originalMapper ? originalMapper[origText] : origText
              aiLog.value.push({ original: trueOriginal, translated: results[i], source, batchNo: b + 1, ts: batchTs })
            }
            done++
          }
        })
      } catch (e) {
        console.error('Batch ' + (b+1) + ' failed:', e)
        errors++
        // ✅ [FIX] ดันเป็น Object เก็บ Context สำหรับนำไป retry
        batch.forEach(t => failedBatch.push({
          text: t,
          source,
          apiFn,
          original: originalMapper ? originalMapper[t] : t
        }))
      }
      if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
    }
    return { done, errors, failedBatch }
  }

  // ─────────────────────────────────────────────────
  // Main entry point
  // ─────────────────────────────────────────────────
  async function runTranslation(allTableData, endpoint, batchSize, maxRetries, options = {}) {
    const { dictPolish = false, engRewrite = false, bypassDict = false, engRewritePmTypes = null } = options
    _lastAllTableData = allTableData
    _failedTexts = []
    setFailedBadge(0)

    snapshotOriginals(allTableData)

    // ── Collect texts by type ──
    const allThaiTexts = {}
    const allEngTexts  = {}
    const pmFilter = engRewritePmTypes && engRewritePmTypes.size > 0 ? engRewritePmTypes : null
    
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        // ✅ [FIX] อ่านจาก Original Snapshot เสมอ ป้องกันการดึงค่าที่ถูกแปลเป็น Eng ไปแล้วมาทำซ้ำ
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
      // ✅ [FIX] Push item (object)
      if (failedBatch.length) { failedBatch.forEach(item => _failedTexts.push(item)); setFailedBadge(_failedTexts.length) }
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

    // ── Pass 1: Dictionary (skip if bypassDict) ──
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
      
      // ✅ [FIX] สร้าง Map เพื่อให้ _runBatches รู้ว่าภาษาอังกฤษจาก Dict ตัวนี้ มาจากภาษาไทยต้นฉบับอะไร
      const dictMapper = {}
      dictResults.forEach(d => { dictMapper[d.translated] = d.original })

      const { done, errors, failedBatch } = await _runBatches(
        polishInputs, endpoint, batchSize, maxRetries,
        'dict-polish', callAPIPolish, '✨ Dict Polish', ' · Dict hits: ' + dictResults.length,
        true, // skipLog
        dictMapper // ✅ [FIX] ส่ง Map เข้าไป
      )
      polishDone = done; polishErrors = errors
      
      const polishTs = new Date().toISOString()
      dictResults.forEach(({ original, translated }, idx) => {
        const polished = translateCache.value[translated]
        if (polished && polished !== translated) {
          translateCache.value[original] = polished
          aiLog.value.push({
            original, translated: polished, dictStep: translated,
            source: 'dict-polish', batchNo: Math.floor(idx / batchSize) + 1, ts: polishTs
          })
        } else {
          aiLog.value.push({
            original, translated: translated, dictStep: translated,
            source: 'dict-polish', batchNo: Math.floor(idx / batchSize) + 1, ts: polishTs
          })
        }
      })
      if (failedBatch.length) failedBatch.forEach(item => _failedTexts.push(item))
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
      if (failedBatch.length) failedBatch.forEach(item => _failedTexts.push(item))
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

  // ✅ [FIX] เขียน retryFailed ใหม่ให้ฉลาดขึ้น แยก Context และ API ถูกต้อง
  async function retryFailed(endpoint, batchSize, maxRetries) {
    if (!_failedTexts.length) return
    if (_isRetrying) { console.warn('[Translate] retryFailed already in progress, skipping.'); return }
    _isRetrying = true
    
    const retryItems = _failedTexts.slice()
    _failedTexts = []
    setFailedBadge(0)
    
    // จัดกลุ่มตาม Source เพื่อใช้ API Function ให้ถูกต้อง
    const grouped = retryItems.reduce((acc, item) => {
      const key = item.source
      if (!acc[key]) acc[key] = { apiFn: item.apiFn, items: [] }
      acc[key].items.push(item)
      return acc
    }, {})

    let retryDone = 0, retryErrors = 0
    
    try {
      for (const [source, group] of Object.entries(grouped)) {
        const texts = group.items.map(i => i.text) // ข้อความที่จะยิงไป AI (อาจเป็นไทย หรืออังกฤษจาก Dict)
        const totalBatches = Math.ceil(texts.length / batchSize)
        
        for (let b = 0; b < totalBatches; b++) {
          const batchTexts = texts.slice(b * batchSize, (b + 1) * batchSize)
          const batchItems = group.items.slice(b * batchSize, (b + 1) * batchSize)
          
          setStatus(
            '🔄 Retrying ' + (retryDone + batchTexts.length) + '/' + retryItems.length, 
            'Retry batch ' + (b+1) + '/' + totalBatches + ' (' + source + ')', 
            10 + Math.round((b / totalBatches) * 85)
          )
          
          try {
            // ✅ [FIX] ส่ง group.apiFn เข้าไป
            const results = await callAPIWithRetry(
              batchTexts, endpoint, maxRetries, 'Retry batch '+(b+1)+'/'+totalBatches,
              (attempt, max, delayMs) => setStatus(
                '⏳ รอ '+(delayMs/1000).toFixed(0)+'s...', 
                'Retry batch '+(b+1)+'/'+totalBatches, 
                10+Math.round((b/totalBatches)*85), attempt, max
              ),
              group.apiFn 
            )
            
            translateStatus.retryAttempt = null
            const batchTs = new Date().toISOString()
            
            batchTexts.forEach((text, i) => {
              if (results[i]) {
                const item = batchItems[i]
                // ✅ [FIX] เซฟลง Cache ด้วย Original Text เสมอ (สำคัญสำหรับแก้บั๊ก Dict Polish)
                translateCache.value[item.original] = results[i]
                aiLog.value.push({ 
                  original: item.original, 
                  translated: results[i], 
                  source: source + '-retry', 
                  batchNo: b + 1, ts: batchTs 
                })
                retryDone++
              }
            })
          } catch (e) {
            retryErrors++
            batchItems.forEach(item => _failedTexts.push(item)) // เก็บ Object กลับไปถ้า Fail อีก
          }
          if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
        }
      }
    } finally { _isRetrying = false }
    
    const applied = _lastAllTableData ? applyTranslations(_lastAllTableData) : 0
    if (_failedTexts.length > 0) setFailedBadge(_failedTexts.length)
    
    const msg = (retryErrors ? '⚠️' : '✅') + ' Retry เสร็จ · สำเร็จ: ' + retryDone +
      (retryErrors ? ' · ยังเหลือ: ' + _failedTexts.length : '') + ' · Applied: ' + applied
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
