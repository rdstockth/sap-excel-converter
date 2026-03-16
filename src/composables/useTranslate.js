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

  // ── Get PM/MO Type from a record depending on table ──
  function getPmType(rec, tableType) {
    if (tableType === 'IW38' || tableType === 'ZPM02') return (rec['Order Type'] || '').trim()
    if (tableType === 'ZPUCMN') return (rec['MO Type'] || '').trim()
    if (tableType === 'Hours')  return (rec['MO type'] || '').trim()
    return null  // IW47 has no direct PM type — not filtered
  }

  // ── Build indexed input: { "0": text0, "1": text1, ... } ──
  // Prevents ordering bugs — AI must return keyed object, we re-assemble by index.
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
    // IMPORTANT: Array responses are REJECTED — they have no index guarantee.
    if (Array.isArray(parsed)) {
      throw new Error('[Translate] AI returned a plain array — index alignment cannot be guaranteed. Retrying.')
    }

    if (parsed && typeof parsed === 'object') {
      // Unwrap nested wrapper: { translations: {...} } or { results: {...} }
      const inner = parsed?.translations || parsed?.results || parsed?.data
      if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
        parsed = inner
      } else if (inner && Array.isArray(inner)) {
        // Array inside wrapper is equally unsafe — reject
        throw new Error('[Translate] AI returned array inside wrapper — index alignment cannot be guaranteed. Retrying.')
      }

      // ── Re-assemble in original index order with source-echo validation ──
      const result = texts.map((origText, i) => {
        const val = parsed[String(i)] ?? parsed[i] ?? null

        // Support source-echo format: { "0": { "s": "...", "t": "..." } }
        if (val && typeof val === 'object' && typeof val.t === 'string') {
          if (typeof val.s === 'string') {
            const expectedPrefix = origText.trim().slice(0, 6)
            const returnedPrefix = val.s.trim().slice(0, 6)
            if (expectedPrefix && returnedPrefix && expectedPrefix !== returnedPrefix) {
              console.warn(
                '[Translate] Source-echo mismatch at index', i,
                '— expected:', JSON.stringify(expectedPrefix),
                'got:', JSON.stringify(returnedPrefix),
                '— entry rejected'
              )
              return null
            }
          }
          return val.t
        }

        return typeof val === 'string' ? val : null
      })

      const missing = result.filter(v => v === null).length
      if (missing > 0) console.warn('[Translate] Response missing/rejected', missing, 'of', texts.length, 'entries')
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
'2. Prefer this structure when applicable: "The [component] in/at/on the [location] is/has [symptom]."\n' +
'3. Use correct prepositions:\n' +
'   - Rooms / areas / buildings → "in the"\n' +
'   - Floors / ceilings / walls → "on the"\n' +
'   - Equipment / machines / positions → "at the"\n' +
'4. Preserve all equipment codes, tag numbers, model names, and identifiers exactly as provided.\n' +
'5. Keep the sentence concise and professional.\n' +
'6. Use present tense to describe the current condition.\n' +
'7. Do not add assumptions or extra details not present in the original text.\n' +
'8. For water supply problems use "has no water flow" (NOT "is not flowing").\n' +
'9. When describing faults, prefer standard maintenance terminology such as: "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n' +
'10. The sentence MUST NOT exceed 15 words. Simplify wording if needed to stay within this limit.\n\n' +
'THAI WORD DISAMBIGUATION — always interpret these words by maintenance context, NOT literal dictionary meaning:\n' +
'  • เบิก → "Requisition", "Request spare part" — this is a PARTS REQUEST action, NOT a fault description\n' +
'    e.g. เบิกวาล์ว 2 ตัว = Requisition 2 valve(s) — NEVER translate as "missing" or "withdraw"\n' +
'    Structure: "Requisition [qty] [part name/code]" or "Request [qty] [part name/code]"\n' +
'  • ใส่ (when followed by a component/part onto equipment) → "install", "add", "fit" — this is an INSTALLATION action\n' +
'    e.g. ใส่ Item รถเข็น = Install item on cart — NEVER translate as "is missing" or "put in"\n' +
'    Structure: "Install [part] on/at/in [equipment/location]"\n' +
'    NOTE: ใส่ = install/add only when acting on equipment. ใส่ in other contexts (e.g. wearing) is different.\n' +
'  • ติด (without ตั้ง) → "is triggered", "is active", "is on", "is stuck" (e.g. ติด alarm = alarm is triggered, ติดไฟ = light is on, ติดขัด = is stuck)\n' +
'    NEVER translate standalone ติด as "install" — use "ติดตั้ง" for installation.\n' +
'  • ดับ → "is off", "has gone out", "is dead" (e.g. ไฟดับ = light is off / power is out)\n' +
'  • ค้าง → "is stuck", "is frozen", "is jammed" (e.g. ค้างอยู่ = is stuck/frozen)\n' +
'  • หลุด → "has come loose", "has detached", "has fallen off"\n' +
'  • รั่ว → "is leaking"\n' +
'  • ตัน → "is clogged", "is blocked"\n' +
'  • เสีย → "is faulty", "is broken", "is not functioning"\n' +
'  • ขาด → "is broken", "is severed", "is missing" (choose by context — NEVER use "missing" if เบิก is present)\n' +
'  • สั่น → "is vibrating", "is shaking"\n' +
'  • ร้อน → "is overheating" (for machines), "is hot" (for surfaces)\n\n' +
'CRITICAL: ALL output values MUST be in English ONLY. Do NOT return Thai characters (ก-๙) in any output value under any circumstances. If a text cannot be translated, write your best English approximation.\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index. Each value must be an object with:\n' +
'  "s": first 6 characters of the source input (for alignment validation)\n' +
'  "t": the English translation\n' +
'Example: {"0":{"s":"ลาเบล","t":"Label is stuck"},"1":{"s":"เครื่อง","t":"Machine is not working"}}\n' +
'The index key MUST correspond exactly to the same-numbered input key. Never reorder. No markdown, no extra text.\n\n' +
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
'2. Prefer this structure when applicable: "The [component] in/at/on the [location] is/has [symptom]."\n' +
'3. Use correct prepositions:\n' +
'   - Rooms / areas / buildings → "in the"\n' +
'   - Floors / ceilings / walls → "on the"\n' +
'   - Equipment / machines / positions → "at the"\n' +
'4. Preserve all equipment codes, tag numbers, model numbers, and identifiers exactly as provided.\n' +
'5. Keep the sentence concise and professional.\n' +
'6. Use present tense to describe the current condition.\n' +
'7. Do not add assumptions or extra information not present in the original text.\n' +
'8. When describing faults, prefer standard maintenance terminology such as: "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n' +
'9. The sentence MUST NOT exceed 15 words. Simplify wording if needed to stay within this limit.\n\n' +
'CONTEXT CORRECTION — if the dictionary produced wrong word choices, fix them:\n' +
'  • "missing", "withdraw", or "draw" from เบิก → change to "Requisition" or "Request spare part"\n' +
'    e.g. "valve is missing 2" → "Requisition 2 valve KD4-1/4A"\n' +
'  • "is missing", "put in", or "insert" from ใส่ (on equipment) → change to "Install" or "Add"\n' +
'    e.g. "LC PCM item on cart is missing" → "Install LC PCM item on cart"\n' +
'  • "install" or "attach" from ติด (without ตั้ง) → change to "is triggered", "is active", or "is stuck" based on context\n' +
'    e.g. "install alarm" → "alarm is triggered", "install light" → "light is on"\n' +
'  • "cut" or "lack" from ขาด → choose "is severed", "is missing", or "is broken" by context\n' +
'  • "attach stuck" or "stick" from ติดขัด → "is jammed" or "is stuck"\n' +
'  • "extinguish" or "turn off" from ดับ in power context → "power is out" or "is off"\n\n''CRITICAL: ALL output values MUST be in English ONLY. Do NOT return Thai characters (ก-๙) in any output value under any circumstances. If a text cannot be improved, return it as-is in English.\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index, e.g. {"0":"...", "1":"..."}. The number of outputs MUST match the number of inputs. No markdown, no explanations, no extra text.\n\n' +
'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Rewrite English → Better English ──
  async function callAPIEngRewrite(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'You are a facility maintenance report writer for SAP work orders. The following texts are English translations produced from a Thai-English dictionary and may be literal, fragmented, or grammatically awkward.\n\n' +
'Task:\n' +
'Rewrite each item into a clear, natural, professional maintenance report sentence.\n\n' +
'Guidelines:\n' +
'1. Correct grammar, word order, and phrasing so the sentence reads naturally in a maintenance report.\n' +
'2. Prefer this structure when applicable: "The [component] in/at/on the [location] is/has [symptom]."\n' +
'3. Use correct prepositions:\n' +
'   - Rooms / areas / buildings → "in the"\n' +
'   - Floors / ceilings / walls → "on the"\n' +
'   - Equipment / machines / positions → "at the"\n' +
'4. Preserve all equipment codes, tag numbers, model numbers, and identifiers exactly as provided.\n' +
'5. Keep the sentence concise and professional.\n' +
'6. Use present tense to describe the current condition.\n' +
'7. Do not add assumptions or extra information not present in the original text.\n' +
'8. When describing faults, prefer standard maintenance terminology such as: "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n' +
'9. The sentence MUST NOT exceed 15 words. Simplify wording if needed to stay within this limit.\n\n' +
'CONTEXT CORRECTION — if the dictionary produced wrong word choices, fix them:\n' +
'  • "missing", "withdraw", or "draw" from เบิก → change to "Requisition" or "Request spare part"\n' +
'    e.g. "valve is missing 2" → "Requisition 2 valve KD4-1/4A"\n' +
'  • "is missing", "put in", or "insert" from ใส่ (on equipment) → change to "Install" or "Add"\n' +
'    e.g. "LC PCM item on cart is missing" → "Install LC PCM item on cart"\n' +
'  • "install" or "attach" from ติด (without ตั้ง) → change to "is triggered", "is active", or "is stuck" based on context\n' +
'    e.g. "install alarm" → "alarm is triggered", "install light" → "light is on"\n' +
'  • "cut" or "lack" from ขาด → choose "is severed", "is missing", or "is broken" by context\n' +
'  • "attach stuck" or "stick" from ติดขัด → "is jammed" or "is stuck"\n' +
'  • "extinguish" or "turn off" from ดับ in power context → "power is out" or "is off"\n\n''CRITICAL: ALL output values MUST be in English ONLY. Do NOT return Thai characters (ก-๙) in any output value under any circumstances. If a text cannot be improved, return it as-is in English.\n\n' +
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
        let thaiLeakCount = 0
        batch.forEach((origText, i) => {
          if (results[i]) {
            // ── Guard: reject result if AI returned Thai text ──
            if (hasThai(results[i])) {
              console.warn('[Translate] AI returned Thai in output — rejected:', results[i])
              thaiLeakCount++
              failedBatch.push(origText)
              return
            }
            translateCache.value[origText] = results[i]
            if (!skipLog) {
              aiLog.value.push({ original: origText, translated: results[i], source, batchNo: b + 1, ts: batchTs })
            }
            done++
          }
        })
        if (thaiLeakCount > 0) {
          errors++
          console.warn('[Translate] Batch ' + (b+1) + ': ' + thaiLeakCount + ' result(s) rejected (Thai output)')
        }
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
  // options: { dictPolish: bool, engRewrite: bool, bypassDict: bool, engRewritePmTypes: Set|null }
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
    // engRewritePmTypes: Set of allowed PM types e.g. Set(['PM01','PM06','PM09','PM11'])
    // null = no filter (allow all)
    const pmFilter = engRewritePmTypes && engRewritePmTypes.size > 0 ? engRewritePmTypes : null
    translateFields.forEach(key => {
      const [tableType, fieldName] = key.split('::')
      ;(allTableData[tableType] || []).forEach(rec => {
        const val = rec[fieldName]
        if (!val || typeof val !== 'string' || !val.trim()) return
        const trimmed = String(val).trim()
        if (hasThai(trimmed)) {
          allThaiTexts[trimmed] = true
        } else if (/[a-zA-Z]/.test(trimmed)) {
          // ENG Rewrite PM type filter
          if (pmFilter) {
            const pmType = getPmType(rec, tableType)
            if (pmType && !pmFilter.has(pmType)) return  // skip if PM type not in allowed list
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

    // ── Pass 1: Dictionary (skip if bypassDict) ──
    resetFuzzyHits()
    let dictHit = 0
    const needAI = []
    const dictResults = [] // for polish pass
    const ts = new Date().toISOString()

    if (bypassDict) {
      setStatus('⚡ Bypass Dict → AI ทั้งหมด...', uniqueThai.length + ' unique texts', 5)
      // Send all Thai texts directly to AI, skip dict entirely
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
      (bypassDict ? ' · ⚡ Bypass Dict' : ' · 📖 Dict: ' + dictHit) +
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
