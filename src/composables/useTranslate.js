import { ref, reactive } from 'vue'
import { dictTranslate, hasThai, resetFuzzyHits, _fuzzyHits } from '../utils/translateDict.js'

export function useTranslate() {
  const translateFields = reactive(new Set([
    'IW29::Description',
    'IW38::Description'
  ]))

  const translateCache = ref({})
  const polishCache = ref({})  // DictEng → PolishedEng (separate to avoid key collisions with Thai→Eng cache)

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

  let _failedTexts = []        // Thai texts that failed AI translation
  let _failedPolishTexts = []  // Dict-English texts that failed polish pass
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
    if (translateStatus.pct >= 80) {
      _hideStatusTimer = setTimeout(() => { translateStatus.show = false }, 3000)
    }
  }

  function setFailedBadge(count) {
    translateStatus.failedCount = count
    translateStatus.failedBadge = count > 0
  }

  function _totalFailed() {
    return _failedTexts.length + _failedPolishTexts.length
  }

  function toggleField(field) {
    if (translateFields.has(field)) translateFields.delete(field)
    else translateFields.add(field)
  }

  // ── Get PM/MO Type from a record depending on table ──
  function getPmType(rec, tableType) {
    if (tableType === 'IW38' || tableType === 'ZPM02') return (rec['Order Type'] || '').trim()
    if (tableType === 'IW29')   return (rec['Notifictn type'] || '').trim()
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
     'You are a maintenance report writer for SAP work orders.\n\n' +
'CONTEXT: These texts are maintenance fault reports submitted by factory technicians. The vast majority describe:\n' +
'  - A broken, faulty, or abnormal component (most common)\n' +
'  - A maintenance task to perform (fabricate, install, replace, adjust)\n' +
'  - A spare parts requisition\n' +
'Always interpret ambiguous words through this maintenance fault-report lens first before considering other meanings.\n\n' +

'TASK:\n' +
'Translate Thai maintenance issue descriptions into clear, natural English maintenance report sentences.\n\n' +

'MAINTENANCE SENTENCE STYLE:\n' +
'Prefer this structure when applicable:\n' +
'"The [component] in/at/on the [location] is/has [symptom]."\n' +
'Examples:\n' +
'Pipe in the washing tank is leaking.\n' +
'Sensor at the conveyor is not functioning.\n' +
'Drain pipe in basin 4 is clogged.\n\n' +

'PREPOSITION RULES:\n' +
'Rooms / areas / buildings → "in the"\n' +
'Floors / ceilings / walls → "on the"\n' +
'Equipment / machines / positions → "at the"\n\n' +

'EQUIPMENT CODE RULE:\n' +
'Equipment line/zone codes (LC, RX, PLP, DL, IW, ZPM, PCM, lc, pcm and similar short prefixes regardless of case) are internal identifiers.\n' +
'OMIT these codes entirely from the translation whether standalone or inside brackets.\n' +
'Examples to REMOVE: [PLP], LC, RX, lc, pcm.\n' +
'Keep identifiers that contain digits or describe real components such as DL1, RX2, KD4-1/4A, V-groove, Bra, Swift, Block, conveyor, He Cap2, MC2, QD75.\n\n' +

'GUIDELINES:\n' +
'1. Write natural maintenance-report sentences — NOT word-for-word translations.\n' +
'2. Keep the sentence concise and professional (aim for SAP Short Text field).\n' +
'3. Use present tense to describe current conditions.\n' +
'4. Do NOT add assumptions or extra information not present in the source.\n' +
'5. Preserve ALL symptoms mentioned in the source text.\n' +
'6. NEVER merge or remove symptoms to shorten the sentence.\n' +
'7. Keep the sentence under 20 words when possible but never remove symptoms to meet this limit.\n' +
'8. For water supply problems use "has no water flow" (NOT "is not flowing").\n' +
'9. Prefer standard maintenance terminology such as "is damaged", "is leaking", "is loose", "is not functioning", "is clogged", or "is broken".\n' +
'10. Standalone numbers with unclear meaning must be omitted. Keep numbers only when they indicate quantity, equipment identifier, or model code.\n\n' +

'HALLUCINATION GUARD:\n' +
'The translation MUST be strictly grounded in the source text.\n' +
'Do NOT invent components, causes, locations, or actions that are not explicitly written.\n' +
'Do NOT infer missing information.\n' +
'Do NOT convert a fault description into a repair action.\n' +
'Do NOT convert an action into a fault.\n' +
'Do NOT add quantities, parts, or equipment names that do not appear in the source.\n' +
'Translate ONLY what appears in the text.\n\n' +

'FAULT / ACTION CLASSIFICATION:\n' +
'Each text belongs to one of these categories:\n' +
'  A. Fault condition\n' +
'  B. Maintenance action\n' +
'  C. Spare parts requisition — ONLY when the Thai text contains เบิก or เบิกของ\n' +
'Translate accordingly.\n' +
'Examples:\n' +
'Fault → Pump motor is vibrating.\n' +
'Action → Install valve on tank.\n' +
'Action → Replace waste primer line at MC2.  ← "Change/เปลี่ยน" = Replace (NOT Requisition)\n' +
'Requisition → Requisition 2 valves.          ← ONLY when เบิก appears in source\n' +
'Never convert one category into another.\n' +
'CRITICAL: "Change", "เปลี่ยน", "order" (English) are maintenance ACTIONS — NEVER translate these as "Requisition".\n' +
'Use "Requisition" ONLY when the source text explicitly contains เบิก or เบิกของ.\n\n' +

'ANTI-OVERTRANSLATION RULE:\n' +
'Translate only the information present in the source text.\n' +
'Do not add explanations or causes.\n' +
'Example:\n' +
'Source: สายพานหลุด\n' +
'Correct: Belt has come loose.\n' +
'Incorrect: Belt has come loose from the pulley due to wear.\n\n' +

'UNKNOWN TERM RULE:\n' +
'If a word cannot be clearly identified, translate the closest literal maintenance meaning or approximate phonetic term.\n' +
'Do NOT guess a different component.\n\n' +

'THAI WORD DISAMBIGUATION — always interpret these words by maintenance context, NOT literal dictionary meaning:\n' +
'\n' +
'  • เบิก → spare parts request action — USE "Requisition" ONLY for this word\n' +
'    Translate as "Requisition [qty] [part]" or "Request [qty] [part]".\n' +
'    Example: เบิกวาล์ว 2 ตัว = Requisition 2 valves\n' +
'\n' +
'  • เปลี่ยน / Change [part] → Replace [part]  (maintenance action — NEVER "Requisition")\n' +
'    Example: Change สาย waste Primer at MC2 = Replace waste primer line at MC2\n' +
'\n' +
'  • order (English word in source) → treat as a maintenance action or work order — NEVER "Requisition"\n' +
'    Example: order drive for sato rewinder = Order drive for sato rewinder\n' +
'\n' +
'  • ใส่ (component added to equipment) → install / fit / add\n' +
'    Example: ใส่ Item รถเข็น = Install item on cart\n' +
'\n' +
'  • ติด (without ตั้ง) → is triggered / is active / is on / is stuck\n' +
'    Example: alarm ติด = Alarm is triggered\n' +
'\n' +
'  • ดับ → is off / has gone out / is dead\n' +
'    Example: ไฟดับ = Light is off\n' +
'    Example: คอมดับ = Computer is down\n' +
'\n' +
'  • com / คอม → computer or PC (NEVER communication)\n' +
'\n' +
'  • ค้าง → is stuck / is frozen / is jammed\n' +
'\n' +
'  • หลุด → has come loose / has detached / has fallen off\n' +
'\n' +
'  • รั่ว → is leaking\n' +
'\n' +
'  • ตัน → is clogged / is blocked\n' +
'    Example: ท่อน้ำอ่าง4ตัน = Drain pipe in basin 4 is clogged\n' +
'\n' +
'  • เสีย → is faulty / is broken / is not functioning\n' +
'\n' +
'  • ขาด → is broken / is severed / is missing (never "missing" if เบิก appears)\n' +
'\n' +
'  • สั่น → is vibrating / is shaking\n' +
'\n' +
'  • งาน (machining context) → workpiece / lens / surface\n' +
'    Example: งานยับย่น = Workpiece surface is wrinkled\n' +
'\n' +
'  • ยับย่น / เป็นริ้ว → is wrinkled / has ripples\n' +
'\n' +
'  • เพท / เพลท → plate\n' +
'    Example: เพทกั้น = partition plate\n' +
'\n' +
'  • กั้น → partition / divider / separator\n' +
'\n' +
'  • ตะแกรง → mesh / grid / screen\n' +
'\n' +
'  • ทำ (fabrication task) → fabricate / make\n' +
'    Example: ทำเพท = Fabricate plate\n' +
'\n' +
'  • ร้อน → machine = is overheating, surface = is hot\n' +
'\n' +
'  • สีแตก → paint is cracked / paint is chipping\n' +
'\n' +
'  • สีหลุด / สีล่อน → paint is peeling\n' +
'\n' +
'  • แตก → is cracked\n' +
'\n' +
'  • บิ่น → is chipped\n\n' +

'SPECIFIC PATTERN RULES:\n' +
'  • "เบิกของ Order [part with number]": Translate as "Requisition [full part with number]". Do not split the number as quantity.\n' +
'    Example: (LC)เบิกของ Order He Cap2 = Requisition He Cap2\n' +
'\n' +
'  • "[codes] [component] ตอน[measurement]": Translate as fault condition "[component] error when [measurement] at [location]".\n' +
'    Example: lc pcm MC2 QD75 ตอนวัดค่าUV = Error QD75 when UV measurement at MC2\n' +
'    (Omit codes; use maintenance fault-report context)\n\n' +

'THAI PHONETIC LETTERS:\n' +
'When "ตัว + Thai phonetic letter" refers to a printed character, convert it to the English letter.\n' +
'Examples: ตัวอาร์ = letter R, ตัวบี = letter B, ตัวเอ็ม = letter M.\n' +
'Example: ตัวอาร์ไม่สมบูรณ์ = Letter R is incomplete.\n\n' +

'CRITICAL: ALL output values MUST be English only. Never output Thai characters in results.\n\n' +

'IMPORTANT: Return ONLY a valid JSON object keyed by index. Each value must contain:\n' +
'  "s": first 6 characters of the source input\n' +
'  "t": the English translation\n' +
'Example: {"0":{"s":"ลาเบล","t":"Label is stuck"},"1":{"s":"เครื่อง","t":"Machine is not working"}}\n' +
'The index key MUST match the input index exactly. Never reorder. No markdown. No extra text.\n\n' +

'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Polish Dict-translated English ──
  async function callAPIPolish(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'You are a maintenance report writer for SAP work orders. The input texts are literal, fragmented English translations from a Thai dictionary. These are factory technicians’ fault reports describing a broken/faulty component, a maintenance task (fabricate/install/replace/adjust), or spare parts requisition. Always interpret through the maintenance lens.\n\n' +'TASK:\n' +
'Rewrite each item into one clear, natural, professional maintenance sentence.\n\n' +'MAINTENANCE SENTENCE STYLE:\n' +
'Prefer this structure when applicable:\n' +
'"The [component] in/at/on the [location] is/has [symptom]."\n' +
'Examples:\n' +
'Pipe in the washing tank is leaking.\n' +
'Sensor at the conveyor is not functioning.\n\n' +'PREPOSITION RULES:\n' +
'Rooms / areas / buildings → "in the"\n' +
'Floors / ceilings / walls → "on the"\n' +
'Equipment / machines / positions → "at the"\n\n' +'EQUIPMENT CODE RULE:\n' +
'Equipment line/zone codes (LC, RX, PLP, DL, IW, ZPM, PCM, lc, pcm and similar short prefixes regardless of case) are internal identifiers.\n' +
'OMIT these codes entirely whether standalone or inside brackets such as [PLP] or [LC].\n' +
'Keep identifiers that contain digits or represent real components such as DL1, RX2, KD4-1/4A, V-groove, Bra, Swift, Block, conveyor, He Cap2, MC2, QD75.\n\n' +'GUIDELINES:\n' +
'1. Fix grammar and word order for natural flow.\n' +
'2. Keep concise and professional.\n' +
'3. Use present tense.\n' +
'4. Preserve every symptom exactly; never merge or remove any.\n' +
'5. Stay under 20 words when possible without dropping content.\n' +
'6. Use standard terms: is damaged, is leaking, is loose, is not functioning, is clogged, is broken.\n' +
'7. Remove unclear standalone numbers; keep only for quantity, ID, or model.\n\n' +'HALLUCINATION GUARD:\n' +
'Stay 100% grounded in the source text. Do not add, assume, invent, or convert faults into actions (or actions into faults).\n\n' +'FAULT / ACTION CLASSIFICATION:\n' +
'Each sentence belongs to one of these categories:\n' +
'  A. Fault condition\n' +
'  B. Maintenance action\n' +
'  C. Spare parts requisition\n' +
'Rewrite accordingly.\n' +
'Examples:\n' +
'Fault → Pump motor is vibrating.\n' +
'Action → Install valve on tank.\n' +
'Action → Replace waste primer line at MC2.  ← "Change/Replace" is an action, NOT Requisition\n' +
'Requisition → Requisition 2 valves.          ← ONLY when source contains เบิก\n\n' +
'CRITICAL: Do NOT use "Requisition" for "order", "change", or "replace" — those are maintenance actions.\n' +
'"Requisition" is reserved strictly for เบิก (spare parts request). "order [part]" → "Order [part]." not "Requisition [part]."\n\n' +'ANTI-OVERTRANSLATION RULE:\n' +
'Do not expand meaning beyond the original sentence.\n' +
'Example:\n' +
'Input: Belt loose\n' +
'Correct: Belt has come loose.\n\n' +'CONTEXT CORRECTION — if the dictionary produced incorrect word choices, fix them:\n' +
'  • เบิก → "Requisition"\n' +
'  • ใส่ (on equipment) → "Install" or "Add"\n' +
'  • ติด (no ตั้ง) → "is triggered/active/stuck"\n' +
'  • ขาด → "is severed/broken/missing"\n' +
'  • ติดขัด → "is jammed/stuck"\n' +
'  • ดับ (power) → "power is out/is off"\n' +
'  • สีแตก → "paint is cracked"\n' +
'  • สีหลุด/ล่อน → "paint is peeling"\n' +
'  • Literal codes + UV → "Error QD75 when UV measurement at MC2"\n' +
'  • เบิกของ Order He Cap2 → "Requisition He Cap2"\n\n' +'CRITICAL: ALL output values MUST be English only. Never output Thai characters.\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index. Each value MUST contain:\n' +
'  "s": first 6 characters of the source input text (copied exactly)\n' +
'  "t": the rewritten English sentence\n' +
'Example: {"0":{"s":"Belt l","t":"Belt has come loose."},"1":{"s":"Pump m","t":"Pump motor is vibrating."}}\n' +
'The index key MUST match the input index exactly. Never reorder. No markdown. No extra text.\n\n' +
'Input:\n' + JSON.stringify(indexedInput)
    return _fetchAPI(texts, endpoint, prompt)
  }

  // ── API: Rewrite English → Better English ──
  async function callAPIEngRewrite(texts, endpoint) {
    const indexedInput = _buildIndexed(texts)
    const prompt =
      'You are a maintenance report editor for SAP work orders. The following texts are English maintenance descriptions that may be grammatically awkward or poorly structured.\n\n' +
'CONTEXT: These texts are maintenance fault reports submitted by factory technicians. They describe a broken/faulty component, a maintenance task, or spare parts requisition.\n\n' +
'TASK:\n' +
'Fix the sentence structure and grammar ONLY. Keep the original words as much as possible.\n' +
'Do NOT rephrase, do NOT substitute vocabulary, do NOT reinterpret meaning.\n' +
'Output ONE clean, correctly structured English sentence per input.\n\n' +
'WORD PRESERVATION RULE (MOST IMPORTANT):\n' +
'Keep every word from the original. Only change:\n' +
'  - Word order (to fix awkward structure)\n' +
'  - Add minimal linking words: "is", "at", "for", "in", "the", "a"\n' +
'  - Fix capitalisation and add period at end\n' +
'Do NOT replace words with synonyms. Do NOT rewrite into a different sentence style.\n' +
'Examples:\n' +
'"repaire air conditioner"      → "Repair air conditioner."              ✅ (fix typo only)\n' +
'"drive fore sato rewinder"     → "Drive for sato rewinder."             ✅ (fix typo only)\n' +
'"spare part order"             → "Order spare part."                    ✅ (reorder words)\n' +
'"Machine frequently stalls"    → "Machine frequently stalls."           ✅ (add period only)\n' +
'"plate heat exchanger change"  → "Change plate heat exchanger."         ✅ (reorder words)\n\n' +
'SAP SHORT TEXT COMPATIBILITY:\n' +
'Start with capital letter and end with period.\n\n' +
'EQUIPMENT CODE RULE:\n' +
'Omit internal codes (LC, RX, PLP, DL, IW, ZPM, PCM, lc, pcm etc.). Keep codes with digits or real names (MC2, DL1, UV2 etc.).\n\n' +
'GUIDELINES:\n' +
'1. PRESERVE original words — do not substitute or rephrase.\n' +
'2. Only fix: word order, grammar, typos, capitalisation, punctuation.\n' +
'3. Add only essential linking words ("is", "for", "at", "the") where truly needed.\n' +
'4. Do NOT add any information not present in the source.\n' +
'5. Do NOT change "order" → "Requisition", "change" → "Replace", or any other word substitution.\n' +
'6. "Requisition" must appear in output ONLY when it already appears in the input. Never introduce it.\n\n' +
'HALLUCINATION GUARD:\n' +
'Strictly use ONLY words present in the source text. Never invent or substitute anything.\n\n' +
'CRITICAL: ALL output values MUST be in English ONLY. Do NOT return Thai characters.\n\n' +
'IMPORTANT: Return ONLY a valid JSON object keyed by index. Each value MUST contain:\n' +
'  \"s\": first 6 characters of the source input text (copied exactly)\n' +
'  \"t\": the rewritten English sentence\n' +
'Example: {\"0\":{\"s\":\"air fi\",\"t\":\"Air fitting is leaking.\"},\"1\":{\"s\":\"Repair\",\"t\":\"Repair valve H/P.\"}}\n' +
'The index key MUST match the input index exactly. Never reorder. No markdown. No extra text.\n\n' +
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
  // cacheTarget: ref object to write results into (default: translateCache)
  async function _runBatches(textsArray, endpoint, batchSize, maxRetries, source, apiFn, statusPrefix, contextNote, skipLog = false, cacheTarget = null) {
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
            const cache = cacheTarget || translateCache
            cache.value[origText] = results[i]
            if (!skipLog) {
              aiLog.value.push({ original: origText, translated: results[i], source, batchNo: b + 1, ts: batchTs })
            }
            done++
          } else {
            // ── Missing/null result → queue for retry instead of silently dropping ──
            console.warn('[Translate] Batch ' + (b+1) + ': no result for index', i, '— queued for retry:', origText)
            failedBatch.push(origText)
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
    _failedPolishTexts = []
    setFailedBadge(0)

    snapshotOriginals(allTableData)

    // ── Collect texts by type ──
    const allThaiTexts = {}
    const allEngTexts  = {}
    // engRewritePmTypes:
    //   null            → no filter, allow all PM types
    //   new Set([...])  → allow only listed PM types
    //   new Set()       → empty set, allow none (skip all ENG rewrite)
    const pmFilter = engRewritePmTypes !== null ? engRewritePmTypes : null
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
            // empty Set → allow none; populated Set → allow only matching types
            if (!pmFilter.size || (pmType && !pmFilter.has(pmType))) return
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

    // ── Cache-only shortcut — only when ENG rewrite has nothing new to process ──
    if (!uniqueThai.length && !(engRewrite && uniqueEng.length)) {
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
        true,        // skipLog
        polishCache  // write into polishCache to avoid Thai-key collisions
      )
      polishDone = done; polishErrors = errors
      // Re-map: Thai original → polished English (override dict result in cache)
      // Log entry shows Thai→polished with dict result as middle step in title
      const polishTs = new Date().toISOString()
      dictResults.forEach(({ original, translated }, idx) => {
        const polished = polishCache.value[translated]  // read from polishCache (not translateCache)
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
      if (failedBatch.length) failedBatch.forEach(t => _failedPolishTexts.push(t))
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
    if (_totalFailed() > 0) setFailedBadge(_totalFailed())

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

  // ── Helper: run one retry pass for a given texts array + apiFn + cacheTarget ──
  async function _retryQueue(texts, label, endpoint, batchSize, maxRetries, apiFn, cacheTarget, logSource, totalForStatus) {
    const totalBatches = Math.ceil(texts.length / batchSize)
    let done = 0, errors = 0
    const stillFailed = []
    for (let b = 0; b < totalBatches; b++) {
      const batch = texts.slice(b * batchSize, (b + 1) * batchSize)
      setStatus('🔄 ' + label + ' (' + (done + batch.length) + '/' + totalForStatus + ')',
        'Batch ' + (b+1) + '/' + totalBatches, 10 + Math.round((b / totalBatches) * 75))
      try {
        const results = await callAPIWithRetry(batch, endpoint, maxRetries, label + ' batch '+(b+1),
          (attempt, max, delayMs) => setStatus('⏳ รอ '+(delayMs/1000).toFixed(0)+'s...', label+' batch '+(b+1)+'/'+totalBatches, 10+Math.round((b/totalBatches)*75), attempt, max),
          apiFn
        )
        translateStatus.retryAttempt = null
        const batchTs = new Date().toISOString()
        const cache = cacheTarget || translateCache
        batch.forEach((origText, i) => {
          if (results[i]) {
            if (hasThai(results[i])) {
              console.warn('[Translate] ' + label + ': AI returned Thai — rejected:', results[i])
              stillFailed.push(origText)
              return
            }
            cache.value[origText] = results[i]
            aiLog.value.push({ original: origText, translated: results[i], source: logSource, batchNo: b + 1, ts: batchTs })
            done++
          } else {
            console.warn('[Translate] ' + label + ': no result for index', i, '— kept in failed:', origText)
            stillFailed.push(origText)
          }
        })
      } catch (e) {
        errors++
        batch.forEach(t => stillFailed.push(t))
      }
      if (b < totalBatches - 1) await new Promise(r => setTimeout(r, 300))
    }
    return { done, errors, stillFailed }
  }

  async function retryFailed(endpoint, batchSize, maxRetries) {
    if (!_totalFailed()) return
    if (_isRetrying) { console.warn('[Translate] retryFailed already in progress, skipping.'); return }
    _isRetrying = true

    const retryThai   = _failedTexts.slice()
    const retryPolish = _failedPolishTexts.slice()
    _failedTexts        = []
    _failedPolishTexts  = []
    setFailedBadge(0)

    const totalForStatus = retryThai.length + retryPolish.length
    let retryDone = 0, retryErrors = 0

    try {
      // ── Retry Thai texts with callAPI (Thai → English) ──
      if (retryThai.length) {
        const { done, errors, stillFailed } = await _retryQueue(
          retryThai, '🔄 Thai Retry', endpoint, batchSize, maxRetries,
          callAPI, translateCache, 'ai-retry', totalForStatus
        )
        retryDone   += done
        retryErrors += errors
        stillFailed.forEach(t => _failedTexts.push(t))
      }

      // ── Retry Dict-Polish texts with callAPIPolish (Eng → Better Eng) ──
      if (retryPolish.length) {
        const { done, errors, stillFailed } = await _retryQueue(
          retryPolish, '🔄 Polish Retry', endpoint, batchSize, maxRetries,
          callAPIPolish, polishCache, 'dict-polish-retry', totalForStatus
        )
        retryDone   += done
        retryErrors += errors
        stillFailed.forEach(t => _failedPolishTexts.push(t))
      }
    } finally { _isRetrying = false }

    const applied = _lastAllTableData ? applyTranslations(_lastAllTableData) : 0
    if (_totalFailed() > 0) setFailedBadge(_totalFailed())
    const msg = (retryErrors ? '⚠️' : '✅') + ' Retry เสร็จ · สำเร็จ: ' + retryDone +
      (retryErrors ? ' · ยังเหลือ: ' + _totalFailed() : '') + ' · Applied: ' + applied
    setStatus(msg, 'Cache: ' + Object.keys(translateCache.value).length + ' texts', retryErrors ? 80 : 100)
    return msg
  }

  return {
    translateFields,
    translateCache,
    polishCache,
    translateStatus,
    aiLog,
    clearLog,
    toggleField,
    runTranslation,
    retryFailed,
    applyTranslations,
    restoreOriginals,
    hasFailed: () => _totalFailed() > 0
  }
}
