<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useWorker }    from './composables/useWorker.js'
import { useTranslate } from './composables/useTranslate.js'
import { detectTableType, recordToChunk, splitRecordsToRagTexts, mergedOrderToChunk, splitMergedRagTexts } from './utils/tableDetect.js'
import { buildOrderMap, applyMergeFilter, getOrderKey, getOrderKeyRaw, normalizeKey, getTableScore } from './utils/mergeUtils.js'

// ── Worker ──
const { workerStatus, workerLabel, initWorker, readExcel } = useWorker()

// ── Translate ──
const { translateFields, translateCache, translateStatus, aiLog, clearLog, toggleField, runTranslation, retryFailed } = useTranslate()

// ── Translation Log Panel ──
const logPanelOpen  = ref(false)
const logSearch     = ref('')
const logFilter     = ref('all')   // 'all' | 'dict' | 'dict-polish' | 'ai' | 'ai-retry' | 'eng-rewrite'
const logPage       = ref(1)
const LOG_PAGE_SIZE = 50

const filteredLog = computed(() => {
  let items = aiLog.value
  if (logFilter.value !== 'all') items = items.filter(e => e.source === logFilter.value)
  const q = logSearch.value.trim().toLowerCase()
  if (q) items = items.filter(e => e.original.toLowerCase().includes(q) || e.translated.toLowerCase().includes(q))
  return items
})

const pagedLog = computed(() => {
  const start = (logPage.value - 1) * LOG_PAGE_SIZE
  return filteredLog.value.slice(start, start + LOG_PAGE_SIZE)
})

const totalLogPages = computed(() => Math.max(1, Math.ceil(filteredLog.value.length / LOG_PAGE_SIZE)))

const logStats = computed(() => ({
  total: aiLog.value.length,
  dict:       aiLog.value.filter(e => e.source === 'dict').length,
  dictPolish: aiLog.value.filter(e => e.source === 'dict-polish').length,
  ai:         aiLog.value.filter(e => e.source === 'ai').length,
  aiRetry:    aiLog.value.filter(e => e.source === 'ai-retry').length,
  engRewrite: aiLog.value.filter(e => e.source === 'eng-rewrite').length,
}))

function downloadLog() {
  const rows = ['Original\tTranslated\tSource\tBatch\tTimestamp']
  aiLog.value.forEach(e => rows.push([e.original, e.translated, e.source, e.batchNo, e.ts].join('\t')))
  const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/tab-separated-values;charset=utf-8' }))
  const a = document.createElement('a'); a.href = url
  a.download = 'translation_log_' + new Date().toISOString().slice(0,19).replace(/[-T:]/g,'') + '.tsv'
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── App state ──
const files        = ref([])
const totalRows    = ref(0)
const doneCount    = ref(0)
const downloadUrls = ref([])
const downloadItems = ref([])
const showDlCard   = ref(false)
const toast        = ref({ show: false, msg: '' })
let toastTimer = null

// ── Settings ──
const settings = reactive({
  autoHeader:    true,
  prettyJson:    true,
  addTimestamp:  true,
  forceAscii:    false,
  jsonlFinetune: false,
  systemPrompt:  'You are a SAP PM expert assistant. Answer questions about work orders accurately.',
  ragMode:       false,
  filterComplete: false,
  splitFile:     false,
  splitSize:     1000,
  aiTranslate:   false,
  dictPolish:    false,
  engRewrite:    false,
  bypassDict:    false,
  aiApiEndpoint: 'https://thaillm.setthapong-pasavet.workers.dev/',
  batchSize:     20,
  maxRetries:    2,
})

// ── ENG Rewrite PM Type Filter ──
const engRewritePmTypes = reactive(new Set(['PM01', 'PM06', 'PM09', 'PM11']))
function togglePmType(t) {
  if (engRewritePmTypes.has(t)) engRewritePmTypes.delete(t)
  else engRewritePmTypes.add(t)
}

// ── Merge Filter ──
const minTableCount = ref(3)
const requiredTables = reactive({ IW38: true, IW47: false, IW29: false, ZPM02: false, ZPUCMN: false, Hours: false })
const filterStats    = ref(null)
let _lastRawOrderMap = null

// ── Progress ──
const progress = reactive({ show: false, pct: 0, label: '' })

// ── Preview ──
const preview = reactive({ html: '', mode: '' })

// ── Debug ──
const debugData = ref(null)
const debugSearch = ref('')
const debugSearchResult = ref('')
const debugBodyOpen = ref(true)

// ── Drag state ──
const isDragOver = ref(false)

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function ts() { return settings.addTimestamp ? '_' + new Date().toISOString().replace(/[-T:Z]/g,'').slice(0,15) : '' }
function escapeAscii(str) { return str.replace(/[\u0080-\uFFFF]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0')) }

function showToast(msg) {
  toast.value = { show: true, msg }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 2800)
}

function fmtSize(bytes) {
  return bytes < 1048576 ? (bytes/1024).toFixed(1)+' KB' : (bytes/1048576).toFixed(1)+' MB'
}

// ─────────────────────────────────────────────────
// File Management
// ─────────────────────────────────────────────────
function addFiles(newFiles) {
  newFiles.forEach(f => {
    if (!f.name.match(/\.(xlsx|xls|csv)$/i)) return
    if (files.value.find(x => x.file.name === f.name && x.file.size === f.size)) return
    files.value.push({ id: Date.now() + Math.random(), file: f, status: 'pending', rows: 0 })
  })
}

function removeFile(id) {
  const idx = files.value.findIndex(f => f.id === id)
  if (idx !== -1) files.value.splice(idx, 1)
}

function clearAll() {
  revokeAllUrls()  // Bug 2 fix: release object URLs ก่อนล้าง
  files.value = []; totalRows.value = 0; doneCount.value = 0
  downloadUrls.value = []; downloadItems.value = []; showDlCard.value = false
  progress.show = false; preview.html = ''
  debugData.value = null; filterStats.value = null
}

// ─────────────────────────────────────────────────
// Download
// ─────────────────────────────────────────────────
// Bug 2 fix: revoke ก่อน clear เสมอ
function revokeAllUrls() {
  downloadItems.value.forEach(item => {
    try { URL.revokeObjectURL(item.url) } catch (_) {}
  })
}
const TYPE_META = {
  json:         { bg:'var(--accent-lt)',  color:'var(--accent)',  border:'#BFDBFE', label:'JSON' },
  jsonl:        { bg:'var(--jsonl-lt)',   color:'var(--jsonl)',   border:'#BAE6FD', label:'JSONL' },
  'jsonl-ft':   { bg:'var(--jsonl-lt)',   color:'var(--jsonl)',   border:'#BAE6FD', label:'JSONL Fine-tune' },
  rag:          { bg:'var(--accent2-lt)', color:'var(--accent2)', border:'#DDD6FE', label:'RAG .txt' },
  merged:       { bg:'var(--warn-lt)',    color:'var(--warn)',    border:'#FDE68A', label:'MERGED JSON' },
  'merged-jsonl':{ bg:'var(--warn-lt)',   color:'var(--warn)',    border:'#FDE68A', label:'MERGED JSONL' },
  'merged-rag': { bg:'var(--warn-lt)',    color:'var(--warn)',    border:'#FDE68A', label:'MERGED RAG' },
}
const TYPE_ICON = { rag:'🤖', 'merged-rag':'🔗', merged:'🗂️', json:'📄', jsonl:'🗒️', 'jsonl-ft':'🎓', 'merged-jsonl':'🔗' }

function addDlEntry(name, url, rows, type) {
  downloadUrls.value.push({ name, url })
  downloadItems.value.push({ name, url, rows, type, meta: TYPE_META[type] || TYPE_META.json, icon: TYPE_ICON[type] || '📄' })
}

function createObjectUrl(text, mime) {
  if (settings.forceAscii) text = escapeAscii(text)
  return URL.createObjectURL(new Blob([text], { type: mime }))
}

async function downloadAll() {
  for (let i = 0; i < downloadUrls.value.length; i++) {
    const item = downloadUrls.value[i]
    const a = document.createElement('a'); a.href = item.url; a.download = item.name
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    if (i < downloadUrls.value.length - 1) await new Promise(r => setTimeout(r, 400))
  }
  showToast('✅ ดาวน์โหลดครบ ' + downloadUrls.value.length + ' ไฟล์')
}

// ─────────────────────────────────────────────────
// JSONL helpers
// ─────────────────────────────────────────────────
function recordsToJsonl(records) { return records.map(r => JSON.stringify(r)).join('\n') }
function recordsToFineTuneJsonl(records, tableType) {
  const sp = settings.systemPrompt || 'You are a SAP PM expert assistant.'
  return records.map(r => JSON.stringify({ messages: [
    { role: 'system', content: sp },
    { role: 'user', content: 'ข้อมูล Work Order จาก SAP:\n' + recordToChunk(r, tableType) },
    { role: 'assistant', content: 'รับทราบข้อมูล Work Order:\n' + recordToChunk(r, tableType) }
  ]})).join('\n')
}
function splitJsonl(text) {
  const lines = text.split('\n').filter(Boolean)
  if (!settings.splitFile || lines.length <= settings.splitSize) return [{ text, suffix: '' }]
  const parts = [], total = Math.ceil(lines.length / settings.splitSize)
  for (let p = 0; p < total; p++) parts.push({ text: lines.slice(p*settings.splitSize,(p+1)*settings.splitSize).join('\n'), suffix: '_part'+(p+1)+'of'+total })
  return parts
}

// ─────────────────────────────────────────────────
// Preview
// ─────────────────────────────────────────────────
function showPreview(sample, extra, mode) {
  if (mode === 'rag') {
    preview.html = `<div class="preview-body"><div style="font-size:11px;font-weight:600;color:var(--accent2);margin-bottom:6px">🤖 RAG Chunk ตัวอย่าง</div><pre style="color:#4B5563">${esc(extra)}</pre><div style="font-size:10.5px;color:var(--sub2);margin-top:7px;font-family:'DM Mono',monospace">แต่ละ chunk = 1 record · พร้อม embed เข้า ChromaDB / Pinecone</div></div>`
  } else if (mode === 'jsonl') {
    preview.html = `<div class="preview-body"><div style="font-size:11px;font-weight:600;color:var(--jsonl);margin-bottom:6px">🗒️ JSONL ตัวอย่าง (3 บรรทัดแรก)</div><pre style="color:#0E7490">${esc(extra)}</pre><div style="font-size:10.5px;color:var(--sub2);margin-top:7px;font-family:'DM Mono',monospace">1 บรรทัด = 1 JSON object</div></div>`
  } else {
    preview.html = `<div class="preview-body"><div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:6px">📄 JSON ตัวอย่าง (3 แถวแรก)</div><pre>${esc(JSON.stringify(sample, null, 2))}</pre><div style="font-size:10.5px;color:var(--sub2);margin-top:7px;font-family:'DM Mono',monospace">แสดง 3 แถวแรก · คลิก ⬇ ดาวน์โหลด เพื่อรับไฟล์เต็ม</div></div>`
  }
}

// ─────────────────────────────────────────────────
// Convert
// ─────────────────────────────────────────────────
const converting = ref(false)
async function convertAll(mode) {
  if (!files.value.length) { showToast('⚠️ กรุณาเพิ่มไฟล์ก่อน'); return }
  converting.value = true
  // Bug 2 fix: revoke URLs เก่าก่อนสร้างชุดใหม่
  revokeAllUrls()
  showDlCard.value = false; downloadItems.value = []; downloadUrls.value = []
  progress.show = true; progress.pct = 0
  totalRows.value = 0; doneCount.value = 0

  try {
    for (let i = 0; i < files.value.length; i++) {
      const item = files.value[i]
      item.status = 'converting'
      try {
        const records = await readExcel(item.file, settings.autoHeader)
        item.rows = records.length; totalRows.value += records.length; item.status = 'done'; doneCount.value++
        const stem     = item.file.name.replace(/\.[^.]+$/, '')
        const stamp    = ts()
        const tableType = detectTableType(records)

        if (settings.aiTranslate) {
          const singleData = {}; singleData[tableType] = records
          const msg = await runTranslation(singleData, settings.aiApiEndpoint, settings.batchSize, settings.maxRetries, { dictPolish: settings.dictPolish, engRewrite: settings.engRewrite, bypassDict: settings.bypassDict, engRewritePmTypes: settings.engRewrite ? engRewritePmTypes : null })
          if (msg) showToast(msg)
        }

        if (mode === 'json' || mode === 'both') {
          const indent = settings.prettyJson ? 2 : undefined
          if (settings.splitFile && records.length > settings.splitSize) {
            const total = Math.ceil(records.length / settings.splitSize)
            for (let p = 0; p < total; p++) {
              const name = stem + stamp + '_part' + (p+1) + 'of' + total + '.json'
              const url = createObjectUrl(JSON.stringify(records.slice(p*settings.splitSize,(p+1)*settings.splitSize), null, indent), 'application/json')
              addDlEntry(name, url, records.length, 'json')
            }
          } else {
            addDlEntry(stem+stamp+'.json', createObjectUrl(JSON.stringify(records, null, indent), 'application/json'), records.length, 'json')
          }
        }

        if (mode === 'jsonl' || mode === 'both') {
          const useFinetune = settings.jsonlFinetune
          const jsonlText = useFinetune ? recordsToFineTuneJsonl(records, tableType) : recordsToJsonl(records)
          const jsonlParts = splitJsonl(jsonlText)
          const suffix = useFinetune ? '_finetune' : ''
          jsonlParts.forEach(part => {
            addDlEntry(stem+stamp+suffix+part.suffix+'.jsonl', createObjectUrl(part.text, 'application/x-ndjson'), records.length, useFinetune ? 'jsonl-ft' : 'jsonl')
          })
        }

        if (settings.ragMode) {
          const parts = splitRecordsToRagTexts(records, item.file.name, settings.splitSize, settings.splitFile)
          parts.forEach(part => addDlEntry(stem+stamp+'_RAG_'+tableType+part.suffix+'.txt', createObjectUrl(part.text, 'text/plain;charset=utf-8'), records.length, 'rag'))
        }

        if (i === 0) {
          if (mode === 'jsonl' || mode === 'both') showPreview(null, records.slice(0,3).map(r=>JSON.stringify(r)).join('\n'), 'jsonl')
          else if (settings.ragMode) showPreview(null, recordToChunk(records[0], tableType), 'rag')
          else showPreview(records.slice(0,3), null, 'json')
        }
      } catch (err) { item.status = 'error'; console.error(err) }
      progress.pct = Math.round(((i+1)/files.value.length)*100)
      progress.label = (i+1) + ' / ' + files.value.length
    }
    showDlCard.value = true
    showToast('✅ แปลงสำเร็จ ' + doneCount.value + '/' + files.value.length + ' ไฟล์')
  } finally {
    // Bug 1 & 3 fix: รับประกันว่า converting และ progress จะถูก reset เสมอ แม้เกิด error
    converting.value = false
    progress.show = false
  }
}

// ─────────────────────────────────────────────────
// Merge & RAG
// ─────────────────────────────────────────────────
const merging = ref(false)
async function mergeAndRag() {
  if (!files.value.length) { showToast('⚠️ กรุณาเพิ่มไฟล์ก่อน'); return }
  merging.value = true
  progress.show = true; progress.pct = 0
  // Bug 2 fix: revoke URLs เก่าก่อนสร้างชุดใหม่
  revokeAllUrls()
  showDlCard.value = true; downloadItems.value = []; downloadUrls.value = []

  try {
    const allTableData = {}
    for (let i = 0; i < files.value.length; i++) {
      progress.pct = Math.round((i/files.value.length)*50)
      progress.label = 'อ่านไฟล์ ' + (i+1) + '/' + files.value.length + '...'
      try {
        const records = await readExcel(files.value[i].file, settings.autoHeader)
        const tableType = detectTableType(records)
        if (!allTableData[tableType]) allTableData[tableType] = []
        allTableData[tableType].push(...records)
      } catch (e) { console.error(e) }
    }

    progress.label = 'กำลัง Merge...'
    const rawOrderMap = buildOrderMap(allTableData)
    _lastRawOrderMap  = rawOrderMap
    refreshMinTableStats(rawOrderMap)
    const filteredOrderMap = applyMergeFilter(rawOrderMap, settings.filterComplete, minTableCount.value, requiredTables)
    updateFilterStats(rawOrderMap, filteredOrderMap)
    renderDebug(allTableData, rawOrderMap)

    if (settings.aiTranslate) {
      progress.label = 'กำลังแปลภาษา...'
      const msg = await runTranslation(allTableData, settings.aiApiEndpoint, settings.batchSize, settings.maxRetries, { dictPolish: settings.dictPolish, engRewrite: settings.engRewrite, bypassDict: settings.bypassDict, engRewritePmTypes: settings.engRewrite ? engRewritePmTypes : null })
      if (msg) showToast(msg)
    }

    const orderMap = filteredOrderMap
    const isIW29Mode = Array.isArray(allTableData['IW29']) && allTableData['IW29'].length > 0
    const primaryLabel = isIW29Mode ? 'notification' : 'order'
    const mergedRecords = Object.entries(orderMap).map(([orderKey, td]) => ({
      [primaryLabel]: orderKey,
      IW29:   td.IW29?.length   ? td.IW29   : null,
      IW38:   td.IW38?.length   ? td.IW38   : null,
      IW47:   td.IW47?.length   ? td.IW47   : null,
      ZPM02:  td.ZPM02?.length  ? td.ZPM02  : null,
      ZPUCMN: td.ZPUCMN?.length ? td.ZPUCMN : null,
      Hours:  td.Hours?.length  ? td.Hours  : null
    }))

    const orderCount = Object.keys(orderMap).length
    const chunkWord  = isIW29Mode ? 'Notification' : 'Order'
    const chunks     = Object.entries(orderMap).map(([k, td], idx) => '--- ' + chunkWord + ' '+(idx+1)+'/'+orderCount+' ---\n'+mergedOrderToChunk(k, td))
    const now        = new Date().toISOString().replace(/[-T:Z]/g,'').slice(0,15)
    const tableNames = Object.keys(allTableData).join(', ')

    progress.pct = 100; progress.label = 'Merged ' + orderCount + ' ' + chunkWord + 's จาก ' + files.value.length + ' ไฟล์'

    addDlEntry('MERGED_'+now+'.json',  createObjectUrl(JSON.stringify(mergedRecords, null, 2),'application/json'), orderCount, 'merged')
    addDlEntry('MERGED_'+now+'.jsonl', createObjectUrl(mergedRecords.map(r=>JSON.stringify(r)).join('\n'),'application/x-ndjson'), orderCount, 'merged-jsonl')

    const ragParts = splitMergedRagTexts(chunks, tableNames, orderCount, settings.splitSize, settings.splitFile)
    ragParts.forEach(part => addDlEntry('MERGED_RAG_'+now+part.suffix+'.txt', createObjectUrl(part.text,'text/plain;charset=utf-8'), orderCount, 'merged-rag'))

    // Best sample preview
    const sampleKey = Object.keys(orderMap).reduce((best, k) => getTableScore(orderMap[k]) > getTableScore(orderMap[best]) ? k : best, Object.keys(orderMap)[0])
    if (sampleKey) {
      const sc = ['IW29','IW38','IW47','ZPM02','ZPUCMN','Hours'].filter(t => orderMap[sampleKey][t]?.length > 0).length
      showPreview(null, '# ตัวอย่าง ' + chunkWord + ' ที่มีข้อมูลครบที่สุด (' + sc + ' tables)\n\n' + mergedOrderToChunk(sampleKey, orderMap[sampleKey]), 'rag')
    }

    const multiTableCount = Object.keys(orderMap).filter(k => getTableScore(orderMap[k]) > 1).length
    showToast('✅ ' + orderCount + ' ' + chunkWord + 's | 🔗 Match หลาย table: ' + multiTableCount)
  } finally {
    // Bug 1 fix: รับประกันว่า merging และ progress จะถูก reset เสมอ แม้เกิด error
    merging.value = false
    progress.show = false
  }
}

// ─────────────────────────────────────────────────
// Filter Stats
// ─────────────────────────────────────────────────
function refreshMinTableStats(rawOrderMap) {
  const total = Object.keys(rawOrderMap).length
  if (!total) return
  // Trigger a reactive update (used in template)
  filterStats.value = { total, rawOrderMap }
}

function updateFilterStats(rawOrderMap, filteredOrderMap) {
  const rawCount = Object.keys(rawOrderMap).length
  const filteredCount = Object.keys(filteredOrderMap).length
  const removed = rawCount - filteredCount
  const isIW29Mode = Object.keys(rawOrderMap).some(k => !k.startsWith('ORDER:') && /^\d{8,}$/.test(k))
  filterStats.value = { rawCount, filteredCount, removed, filterOn: settings.filterComplete, isIW29Mode }
}

function setMinTable(val) {
  minTableCount.value = val
  if (_lastRawOrderMap) {
    const filtered = applyMergeFilter(_lastRawOrderMap, settings.filterComplete, val, requiredTables)
    updateFilterStats(_lastRawOrderMap, filtered)
  }
}

function toggleRequired(tbl) {
  requiredTables[tbl] = !requiredTables[tbl]
  if (_lastRawOrderMap) {
    const filtered = applyMergeFilter(_lastRawOrderMap, settings.filterComplete, minTableCount.value, requiredTables)
    updateFilterStats(_lastRawOrderMap, filtered)
  }
}

// ─────────────────────────────────────────────────
// Debug Panel
// ─────────────────────────────────────────────────
function renderDebug(allTableData, orderMap) {
  debugData.value = { allTableData, orderMap }
}

function doDebugSearch() {
  if (!debugData.value || !debugSearch.value.trim()) { debugSearchResult.value = ''; return }
  const q = normalizeKey(debugSearch.value.trim())
  const { allTableData } = debugData.value
  let html = '<div style="font-weight:600;color:var(--ink);margin-bottom:5px">ค้นหา: "' + esc(q) + '"</div>'
  let found = false
  Object.entries(allTableData).forEach(([ttype, recs]) => {
    const matches = recs.filter(r => getOrderKey(r, ttype) === q)
    if (matches.length) {
      found = true
      html += '<div style="color:var(--success);margin-bottom:2px">✅ พบใน <strong>' + ttype + '</strong>: ' + matches.length + ' records</div>'
      html += '<div style="color:var(--sub2);font-size:10px;margin-bottom:4px">Raw = "' + esc(String(getOrderKeyRaw(matches[0], ttype))) + '" → normalized = "' + esc(q) + '"</div>'
    }
  })
  if (!found) {
    html += '<div style="color:var(--danger)">❌ ไม่พบ Order key นี้ในไฟล์ใดเลย</div>'
    html += '<div style="margin-top:5px;color:var(--sub2);font-size:10px">Keys ที่มี (10 แรก):<br>'
    Object.entries(allTableData).forEach(([ttype, recs]) => {
      const sample = recs.slice(0,20).map(r => getOrderKey(r, ttype)).filter(Boolean).slice(0,10)
      html += '<span style="color:var(--accent)">' + ttype + ':</span> ' + sample.map(esc).join(', ') + '<br>'
    })
    html += '</div>'
  }
  debugSearchResult.value = html
}

// ─────────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────────
onMounted(() => initWorker())
</script>

<template>
  <!-- Header -->
  <header>
    <div class="header-inner">
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
          <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" opacity="0.35"/>
        </svg>
      </div>
      <div class="header-title">
        Excel <span class="header-arrow">→</span> JSON / JSONL <span>Converter</span>
      </div>
      <span id="workerStatus" :class="workerStatus">{{ workerLabel }}</span>
      <div class="badge">SAP PM RAG</div>
    </div>
  </header>

  <div class="container">
    <div class="main-grid">

      <!-- ═══ LEFT COLUMN ═══ -->
      <div class="left-col">

        <!-- File Upload Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-icon">📁</span>
            <h2>เลือกไฟล์ Excel</h2>
            <span class="pill">{{ files.length }} ไฟล์</span>
          </div>

          <!-- Drop Zone -->
          <div class="drop-zone" :class="{ 'drag-over': isDragOver }"
            @click="$refs.fileInput.click()"
            @dragover.prevent="isDragOver = true"
            @dragleave.stop="isDragOver = false"
            @drop.prevent.stop="isDragOver = false; addFiles(Array.from($event.dataTransfer?.files || []))">
            <span class="drop-icon">📊</span>
            <div class="drop-title">ลากไฟล์มาวางที่นี่</div>
            <div class="drop-sub">หรือคลิกเพื่อเลือกไฟล์</div>
            <div class="drop-tags">
              <span class="tag">.xlsx</span>
              <span class="tag">.xls</span>
              <span class="tag">.csv</span>
            </div>
            <input ref="fileInput" type="file" multiple accept=".xlsx,.xls,.csv" style="display:none"
              @change="addFiles(Array.from($event.target.files)); $event.target.value=''">
          </div>

          <!-- File List -->
          <div class="file-list">
            <div v-for="item in files" :key="item.id" class="file-item">
              <span class="file-icon">📗</span>
              <div class="file-info">
                <div class="file-name">{{ item.file.name }}</div>
                <div class="file-meta">{{ fmtSize(item.file.size) }}{{ item.rows ? ' · ' + item.rows.toLocaleString() + ' rows' : '' }}</div>
              </div>
              <span class="file-status" :style="{color: {pending:'var(--sub2)',converting:'var(--warn)',done:'var(--success)',error:'var(--danger)'}[item.status]}">
                {{ {pending:'⏳ รอแปลง',converting:'🔄 กำลังแปลง',done:'✅ สำเร็จ',error:'❌ ผิดพลาด'}[item.status] }}
              </span>
              <button class="file-remove" @click.stop="removeFile(item.id)">✕</button>
            </div>
          </div>

          <!-- Progress -->
          <div v-if="progress.show" class="progress-wrap">
            <div class="progress-bar-bg"><div class="progress-bar" :style="{width: progress.pct+'%'}"></div></div>
            <div class="progress-label">{{ progress.label }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="btn-row">
            <button class="btn btn-primary"  :disabled="converting||merging" @click="convertAll('json')">⚡ แปลงเป็น JSON</button>
            <button class="btn btn-jsonl"    :disabled="converting||merging" @click="convertAll('jsonl')">⚡ แปลงเป็น JSONL</button>
            <button class="btn btn-both"     :disabled="converting||merging" @click="convertAll('both')">⚡ JSON + JSONL</button>
          </div>
          <div class="btn-row" style="padding-top:0">
            <button class="btn btn-merge"        :disabled="converting||merging" @click="mergeAndRag">{{ merging ? '⌛ กำลัง Merge...' : '🔗 Merge &amp; RAG' }}</button>
            <button class="btn btn-ghost"        @click="$refs.fileInput.click()">＋ เพิ่มไฟล์</button>
            <button class="btn btn-danger-ghost" @click="clearAll">🗑 ล้าง</button>
          </div>
        </div>

        <!-- Download Card -->
        <div v-if="showDlCard && downloadItems.length" class="card">
          <div class="card-header">
            <span class="card-icon">⬇️</span>
            <h2>ดาวน์โหลดไฟล์</h2>
            <button class="btn-dl-all" @click="downloadAll">⬇ ดาวน์โหลดทั้งหมด</button>
          </div>
          <div class="download-list">
            <div v-for="item in downloadItems" :key="item.url" class="dl-item">
              <span>{{ item.icon }}</span>
              <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:var(--text2)">{{ item.name }}</span>
              <span :style="{background:item.meta.bg,color:item.meta.color,border:'1px solid '+item.meta.border,fontSize:'10px',fontWeight:'600',padding:'1px 7px',borderRadius:'5px',whiteSpace:'nowrap',fontFamily:'DM Mono,monospace'}">{{ item.meta.label }}</span>
              <span style="color:var(--sub2);font-family:'DM Mono',monospace;font-size:10.5px">{{ item.rows.toLocaleString() }} rows</span>
              <a :href="item.url" :download="item.name">⬇ ดาวน์โหลด</a>
            </div>
          </div>
        </div>

      </div>
      <!-- ═══ end LEFT ═══ -->

      <!-- ═══ RIGHT COLUMN ═══ -->
      <div class="right-col">

        <!-- Stats -->
        <div class="card" style="overflow:hidden">
          <div class="stats-grid">
            <div class="stat"><div class="stat-value blue">{{ files.length }}</div><div class="stat-label">ไฟล์ทั้งหมด</div></div>
            <div class="stat"><div class="stat-value purple">{{ totalRows.toLocaleString() }}</div><div class="stat-label">แถวข้อมูล</div></div>
            <div class="stat"><div class="stat-value green">{{ doneCount }}</div><div class="stat-label">แปลงสำเร็จ</div></div>
          </div>
        </div>

        <!-- Settings -->
        <div class="card">
          <div class="card-header"><span class="card-icon">⚙️</span><h2>ตั้งค่า</h2></div>
          <div class="settings-body">

            <div class="setting-row">
              <div><div class="setting-label">🔎 ตรวจหา Header อัตโนมัติ</div><div class="setting-sub">หาแถว "Order" ใน 10 แถวแรก</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.autoHeader"><div class="toggle-track"></div></label>
            </div>
            <div class="setting-row">
              <div><div class="setting-label">✨ Pretty JSON (indent)</div><div class="setting-sub">จัดรูปแบบ JSON ให้อ่านง่าย</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.prettyJson"><div class="toggle-track"></div></label>
            </div>
            <div class="setting-row">
              <div><div class="setting-label">🕐 Timestamp ในชื่อไฟล์</div><div class="setting-sub">เช่น report_20250223_143000.json</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.addTimestamp"><div class="toggle-track"></div></label>
            </div>
            <div class="setting-row">
              <div><div class="setting-label">🌏 Force ASCII (escape ภาษาไทย)</div><div class="setting-sub">ปิด = เก็บภาษาไทยไว้ตรงๆ</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.forceAscii"><div class="toggle-track"></div></label>
            </div>

            <div class="divider"></div>
            <div class="section-label">JSONL Options</div>

            <div class="info-box cyan">
              📄 <strong style="color:var(--jsonl)">JSONL</strong> = JSON Lines — 1 record ต่อ 1 บรรทัด<br>
              ✅ OpenAI Fine-tuning · Hugging Face Datasets<br>
              ✅ <code>pandas.read_json(lines=True)</code>
            </div>

            <div class="setting-row">
              <div><div class="setting-label">🤖 JSONL สำหรับ OpenAI Fine-tuning</div><div class="setting-sub">เพิ่ม field: system, user, assistant</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.jsonlFinetune"><div class="toggle-track"></div></label>
            </div>

            <div id="finetuneSystemRow" class="setting-row" :style="{opacity: settings.jsonlFinetune ? '1' : '0.45'}">
              <div class="setting-label" style="color:var(--sub);font-size:11.5px;margin-bottom:4px">System Prompt</div>
              <textarea v-model="settings.systemPrompt" rows="2" :disabled="!settings.jsonlFinetune" placeholder="You are a SAP PM expert assistant." style="width:100%"></textarea>
            </div>

            <div class="divider"></div>
            <div class="section-label">RAG Mode</div>

            <div class="setting-row">
              <div><div class="setting-label">🤖 RAG Mode — แปลงเป็น Text Chunks</div><div class="setting-sub">สร้างไฟล์ .txt สำหรับ Embedding</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.ragMode"><div class="toggle-track"></div></label>
            </div>
            <div v-if="settings.ragMode" class="info-box blue" style="font-size:11px">
              ✅ ตรวจ table type อัตโนมัติ (IW38 / IW47 / IW29 / ZPM02 / ZPUCMN / Hours)<br>
              ✅ แปลงแต่ละ row → ประโยค 1 chunk<br>
              ✅ ดาวน์โหลดเป็น <code>.txt</code> พร้อม embed ได้เลย
            </div>

            <div class="divider"></div>
            <div class="section-label">Merge Filter</div>

            <div class="setting-row">
              <div><div class="setting-label">🎯 กรองเฉพาะ Order ที่ครบ</div><div class="setting-sub">ไม่รวม Order ที่มีข้อมูลใน table เดียว</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.filterComplete" @change="_lastRawOrderMap && updateFilterStats(_lastRawOrderMap, applyMergeFilter(_lastRawOrderMap, settings.filterComplete, minTableCount, requiredTables))"><div class="toggle-track"></div></label>
            </div>

            <div :style="{opacity: settings.filterComplete ? '1' : '0.4'}" style="display:flex;flex-direction:column;gap:8px">
              <div>
                <div class="setting-sub" style="margin-bottom:6px">ต้องมีข้อมูลอย่างน้อยกี่ Table</div>
                <div style="display:flex;gap:5px;flex-wrap:wrap">
                  <button v-for="n in [2,3,4,5]" :key="n" class="min-table-btn" :class="{active: minTableCount===n}" @click="setMinTable(n)">{{ n===5 ? 'ครบ 5 tables' : '≥ '+n+' tables' }}</button>
                </div>
              </div>
              <div>
                <div class="setting-sub" style="margin-bottom:5px">ต้องมี Table เหล่านี้ (Required)</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap">
                  <button v-for="tbl in ['IW29','IW38','IW47','ZPM02','ZPUCMN','Hours']" :key="tbl" class="req-table-btn" :class="{active: requiredTables[tbl]}" @click="toggleRequired(tbl)">{{ tbl }}</button>
                </div>
              </div>
              <div v-if="filterStats" style="font-size:11px">
                <div style="font-weight:600;color:var(--warn);margin-bottom:5px">📊 สถิติการกรอง</div>
                <div style="display:grid;grid-template-columns:1fr auto;gap:3px 10px">
                  <div style="color:var(--sub2)">{{ filterStats.isIW29Mode ? 'Notifications ทั้งหมด' : 'Orders ทั้งหมด' }}</div><div style="text-align:right"><strong style="color:var(--ink)">{{ filterStats.rawCount?.toLocaleString() }}</strong></div>
                  <template v-if="filterStats.filterOn">
                    <div style="color:var(--success)">✅ ผ่านการกรอง</div><div style="text-align:right"><strong style="color:var(--success)">{{ filterStats.filteredCount?.toLocaleString() }}</strong></div>
                    <div style="color:var(--danger)">❌ ถูกตัดออก</div><div style="text-align:right"><strong style="color:var(--danger)">{{ filterStats.removed?.toLocaleString() }}</strong></div>
                  </template>
                  <template v-else><div style="color:var(--sub2);grid-column:span 2">Filter ปิดอยู่ — export ทุก {{ filterStats.isIW29Mode ? 'Notification' : 'Order' }}</div></template>
                </div>
              </div>
            </div>

            <div class="divider"></div>
            <div class="section-label">🌐 AI Translation</div>

            <div class="setting-row">
              <div><div class="setting-label">🤖 แปล Description ไทย → อังกฤษ</div><div class="setting-sub">ส่ง field ภาษาไทยจาก IW29 / IW38 ให้ AI แปลก่อน export</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.aiTranslate"><div class="toggle-track"></div></label>
            </div>

            <div :style="{opacity: settings.aiTranslate ? '1' : '0.4'}" style="display:flex;flex-direction:column;gap:6px;padding-left:4px">
              <!-- Mode: Dict → AI Polish -->
              <div class="setting-row" style="background:var(--accent2-lt);border-radius:8px;padding:8px 10px;border:1px solid #DDD6FE">
                <div>
                  <div class="setting-label" style="color:#5B21B6">✨ Dict → AI Polish</div>
                  <div class="setting-sub">หลังแปลด้วย Dict แล้ว → ส่งให้ AI เรียบเรียงประโยคให้เป็นธรรมชาติอีกครั้ง</div>
                </div>
                <label class="toggle"><input type="checkbox" v-model="settings.dictPolish" :disabled="!settings.aiTranslate"><div class="toggle-track"></div></label>
              </div>

              <!-- Mode: ENG → AI Rewrite -->
              <div style="background:#F0FDF4;border-radius:8px;padding:8px 10px;border:1px solid #BBF7D0;display:flex;flex-direction:column;gap:8px">
                <div class="setting-row" style="margin:0">
                  <div>
                    <div class="setting-label" style="color:#166534">✍️ ENG → AI Rewrite</div>
                    <div class="setting-sub">ส่ง text ภาษาอังกฤษ (ที่ไม่มีภาษาไทย) ให้ AI เรียบเรียงประโยคใหม่ด้วย</div>
                  </div>
                  <label class="toggle"><input type="checkbox" v-model="settings.engRewrite" :disabled="!settings.aiTranslate"><div class="toggle-track"></div></label>
                </div>

                <!-- PM Type filter (shown when engRewrite is on) -->
                <div v-if="settings.engRewrite" style="padding-top:4px;border-top:1px solid #BBF7D0">
                  <div class="setting-sub" style="margin-bottom:5px;color:#166534">🏷️ เฉพาะ PM Type</div>
                  <div style="display:flex;gap:5px;flex-wrap:wrap">
                    <button v-for="t in ['PM01','PM06','PM09','PM11','M1','M2']" :key="t"
                      class="req-table-btn" :class="{active: engRewritePmTypes.has(t)}"
                      style="border-color:#86EFAC;color:#166534"
                      :style="engRewritePmTypes.has(t) ? {background:'#166534',color:'#fff',borderColor:'#166534'} : {}"
                      @click="togglePmType(t)">{{ t }}</button>
                    <span style="font-size:10px;color:var(--sub2);align-self:center;margin-left:2px">
                      {{ engRewritePmTypes.size === 0 ? '(ทุก PM Type)' : engRewritePmTypes.size + ' types' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Mode: Bypass Dict → AI ทันที -->
              <div class="setting-row" style="background:#FFF7ED;border-radius:8px;padding:8px 10px;border:1px solid #FED7AA">
                <div>
                  <div class="setting-label" style="color:#C2410C">⚡ Bypass Dict → AI ทันที</div>
                  <div class="setting-sub">ข้ามการแปลด้วย Dict ส่งภาษาไทยทั้งหมดให้ AI โดยตรง (ช้ากว่าแต่แม่นกว่า)</div>
                </div>
                <label class="toggle"><input type="checkbox" v-model="settings.bypassDict" :disabled="!settings.aiTranslate"><div class="toggle-track"></div></label>
              </div>
            </div>

            <div :style="{opacity: settings.aiTranslate ? '1' : '0.4'}" style="display:flex;flex-direction:column;gap:8px">
              <div class="info-box purple">
                🔤 ตรวจจับข้อความไทยอัตโนมัติ → แปลเป็นอังกฤษผ่าน AI<br>
                ✨ <strong style="color:#7C3AED">Dict+Polish</strong>: Dict แปลก่อน → AI เรียบเรียงให้เป็นธรรมชาติ<br>
                ✍️ <strong style="color:#166534">ENG Rewrite</strong>: เฉพาะ PM Type ที่เลือก · กรอง field ที่ไม่มีภาษาไทย<br>
                ⚡ <strong style="color:#C2410C">Bypass Dict</strong>: ข้าม Dict ส่ง Thai ทั้งหมดให้ AI โดยตรง<br>
                ✅ Cache ผลแปล — ไม่เรียก API ซ้ำถ้า text เดิม
              </div>

              <div>
                <div class="setting-sub" style="margin-bottom:5px">🔗 AI API Endpoint</div>
                <div class="api-endpoint-row">
                  <input type="text" v-model="settings.aiApiEndpoint" class="input-field" placeholder="https://your-worker.workers.dev/" style="flex:1;font-size:10.5px">
                </div>
                <div style="font-size:10px;color:var(--sub2);margin-top:3px;font-family:'DM Mono',monospace">Compatible กับ OpenAI Chat Completions format</div>
              </div>

              <div>
                <div class="setting-sub" style="margin-bottom:5px">📋 Fields ที่จะแปล</div>
                <div style="display:flex;flex-wrap:wrap;gap:5px">
                  <button v-for="field in ['IW29::Description','IW29::Description.1','IW38::Description','IW38::Description.1','ZPUCMN::Desc.','Hours::Damage Text','Hours::Cause Text','Hours::Activity Text','IW47::Confirmation text','ZPM02::Description']"
                    :key="field" class="field-check-btn" :class="{on: translateFields.has(field)}"
                    @click="toggleField(field)">{{ field.replace('::',' : ') }}</button>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:8px">
                <div><div class="setting-sub">Batch Size (texts/call)</div></div>
                <span style="margin-left:auto;font-size:11.5px;font-family:'DM Mono',monospace;color:var(--sub);background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:3px 10px">20 ข้อความ</span>
              </div>

              <div style="display:flex;align-items:center;gap:8px">
                <div>
                  <div class="setting-sub">🔄 Auto-Retry เมื่อ API Error</div>
                  <div style="font-size:10px;color:var(--sub2);margin-top:1px">Exponential backoff: 1s → 2s → 4s</div>
                </div>
                <select v-model.number="settings.maxRetries" style="margin-left:auto">
                  <option :value="0">ไม่ retry</option>
                  <option :value="1">1 ครั้ง</option>
                  <option :value="2">2 ครั้ง</option>
                  <option :value="3">3 ครั้ง</option>
                </select>
              </div>

              <!-- Translate Status -->
              <div v-if="translateStatus.show" class="translate-progress">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <span>{{ translateStatus.text }}</span>
                  <span v-if="translateStatus.retryAttempt" class="retry-attempt-tag">🔄 Retry {{ translateStatus.retryAttempt }}/{{ translateStatus.maxRetry }}</span>
                </div>
                <div class="tprog-bar-bg"><div class="tprog-bar" :style="{width: translateStatus.pct+'%'}"></div></div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:3px">
                  <span style="font-size:10px;color:var(--sub2);flex:1">{{ translateStatus.sub }}</span>
                  <span v-if="translateStatus.failedBadge" class="retry-badge">⚠️ {{ translateStatus.failedCount }} batch failed</span>
                </div>
                <button v-if="translateStatus.failedBadge" class="btn-retry"
                  @click="retryFailed(settings.aiApiEndpoint, settings.batchSize, settings.maxRetries).then(msg => msg && showToast(msg))">
                  🔄 Retry ข้อความที่ยังเหลือ ({{ translateStatus.failedCount }} batch)
                </button>
              </div>
            </div>

            <div class="divider"></div>
            <div class="section-label">File Split</div>

            <div class="setting-row">
              <div><div class="setting-label">✂️ แบ่งไฟล์อัตโนมัติ</div><div class="setting-sub">ป้องกันไฟล์ใหญ่เกิน</div></div>
              <label class="toggle"><input type="checkbox" v-model="settings.splitFile"><div class="toggle-track"></div></label>
            </div>
            <div class="setting-row" :style="{opacity: settings.splitFile ? '1' : '0.45', marginTop:'-4px'}">
              <div><div class="setting-sub">Records ต่อไฟล์</div></div>
              <select v-model.number="settings.splitSize" :disabled="!settings.splitFile">
                <option :value="500">500 rows</option>
                <option :value="1000">1,000 rows</option>
                <option :value="2000">2,000 rows</option>
                <option :value="5000">5,000 rows</option>
                <option :value="10000">10,000 rows</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Preview -->
        <div class="card">
          <div class="card-header"><span class="card-icon">🔍</span><h2>ตัวอย่างผลลัพธ์</h2></div>
          <div v-if="preview.html" v-html="preview.html"></div>
          <div v-else><div class="empty-state"><div class="empty-icon">📋</div>แปลงไฟล์เพื่อดูตัวอย่าง</div></div>
        </div>

        <!-- Debug Panel -->
        <div v-if="debugData" class="card">
          <div class="card-header" style="cursor:pointer" @click="debugBodyOpen = !debugBodyOpen">
            <span class="card-icon">🐛</span>
            <h2>Debug — Key Inspector</h2>
            <span class="pill">{{ debugBodyOpen ? 'ซ่อน' : 'แสดง' }}</span>
          </div>
          <div v-if="debugBodyOpen" style="padding:12px 16px 16px">
            <div style="font-size:11px;color:var(--sub);margin-bottom:8px;font-family:'DM Mono',monospace">ตรวจสอบ tableType &amp; Order key ที่ถูกอ่านจากแต่ละไฟล์</div>
            <div v-for="(recs, ttype) in debugData.allTableData" :key="ttype" class="debug-entry">
              <div style="font-size:12px;font-weight:600;margin-bottom:5px">{{ ttype }} — {{ recs.length.toLocaleString() }} records</div>
              <div style="font-size:10.5px;color:var(--sub2);margin-bottom:3px;font-family:'DM Mono',monospace">Sample Order Keys:</div>
              <div style="font-family:'DM Mono',monospace;font-size:11px;line-height:2">
                <span v-for="(r,i) in recs.slice(0,5)" :key="i">
                  <span style="color:var(--warn)">{{ getOrderKeyRaw(r, ttype) }}</span>
                  {{ getOrderKeyRaw(r,ttype) !== getOrderKey(r,ttype) ? ' → ' : '' }}
                  <span v-if="getOrderKeyRaw(r,ttype) !== getOrderKey(r,ttype)" style="color:var(--success)">{{ getOrderKey(r,ttype) }}</span>
                  <span v-if="i<4"> &nbsp;|&nbsp; </span>
                </span>
              </div>
            </div>
            <div style="margin-top:10px">
              <input v-model="debugSearch" type="text" class="input-field" placeholder="ค้นหา Order key เช่น 50043412" style="font-size:11.5px;width:100%" @input="doDebugSearch">
              <div v-if="debugSearchResult" v-html="debugSearchResult" style="margin-top:8px;font-size:11px;font-family:'DM Mono',monospace;color:var(--text)"></div>
            </div>
          </div>
        </div>

      </div>
      <!-- ═══ end RIGHT ═══ -->

    </div>
  </div>

  <!-- ═══ Translation Log — Full Width ═══ -->
  <div v-if="aiLog.length > 0 || logPanelOpen" class="container log-full-wrap">
    <div class="card log-full-card">
      <div class="card-header" style="cursor:pointer" @click="logPanelOpen = !logPanelOpen">
        <span class="card-icon">📋</span>
        <h2>Translation Log</h2>
        <span class="pill" style="background:var(--accent-lt);color:var(--accent)">{{ logStats.total }} รายการ</span>
        <span class="pill" style="margin-left:auto">{{ logPanelOpen ? 'ซ่อน ▲' : 'แสดง ▼' }}</span>
      </div>

      <div v-if="logPanelOpen" class="log-panel">

        <!-- Stats bar -->
        <div class="log-stats-bar">
          <span class="log-stat-chip all" @click="logFilter='all'; logPage=1" :class="{active: logFilter==='all'}">
            ทั้งหมด <strong>{{ logStats.total }}</strong>
          </span>
          <span class="log-stat-chip dict" @click="logFilter='dict'; logPage=1" :class="{active: logFilter==='dict'}">
            📖 Dict <strong>{{ logStats.dict }}</strong>
          </span>
          <span v-if="logStats.dictPolish > 0" class="log-stat-chip dict-polish" @click="logFilter='dict-polish'; logPage=1" :class="{active: logFilter==='dict-polish'}">
            ✨ Polish <strong>{{ logStats.dictPolish }}</strong>
          </span>
          <span class="log-stat-chip ai" @click="logFilter='ai'; logPage=1" :class="{active: logFilter==='ai'}">
            🤖 AI <strong>{{ logStats.ai }}</strong>
          </span>
          <span v-if="logStats.aiRetry > 0" class="log-stat-chip retry" @click="logFilter='ai-retry'; logPage=1" :class="{active: logFilter==='ai-retry'}">
            🔄 Retry <strong>{{ logStats.aiRetry }}</strong>
          </span>
          <span v-if="logStats.engRewrite > 0" class="log-stat-chip eng-rewrite" @click="logFilter='eng-rewrite'; logPage=1" :class="{active: logFilter==='eng-rewrite'}">
            ✍️ ENG Rewrite <strong>{{ logStats.engRewrite }}</strong>
          </span>
          <div style="flex:1"></div>
          <button class="log-btn-dl" @click.stop="downloadLog" title="Export เป็น .tsv">⬇ Export</button>
          <button class="log-btn-clear" @click.stop="clearLog(); logPage=1" title="ล้าง log">🗑</button>
        </div>

        <!-- Search -->
        <div style="padding: 0 12px 8px">
          <input v-model="logSearch" @input="logPage=1" type="text" class="input-field"
            placeholder="🔍 ค้นหาข้อความต้นฉบับหรือคำแปล..." style="width:100%;font-size:11.5px">
        </div>

        <!-- Table -->
        <div class="log-table-wrap">
            <table class="log-table">
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th style="width:42%">ต้นฉบับ (Thai)</th>
                <th>คำแปล (English)</th>
                <th style="width:88px">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredLog.length === 0">
                <td colspan="4" style="text-align:center;color:var(--sub2);padding:18px;font-size:11.5px">ไม่พบรายการที่ตรงกัน</td>
              </tr>
              <tr v-for="(entry, i) in pagedLog" :key="entry.original + entry.source + i"
                :class="['log-row', 'log-row--' + entry.source.replace(/-/g, '_')]">
                <td class="log-no">{{ (logPage - 1) * 50 + i + 1 }}</td>
                <td class="log-original">
                  <span class="log-text-cell" :title="entry.original">{{ entry.original }}</span>
                </td>
                <td class="log-translated">
                  <!-- dict-polish: show dict intermediate step as faded line above -->
                  <span v-if="entry.source === 'dict-polish' && entry.dictStep && entry.dictStep !== entry.translated"
                    class="log-dict-step" :title="'Dict step: ' + entry.dictStep">
                    {{ entry.dictStep }}
                  </span>
                  <span class="log-text-cell" :title="entry.translated">{{ entry.translated }}</span>
                </td>
                <td class="log-source">
                  <span class="log-source-badge" :class="'badge--' + entry.source">
                    {{ entry.source === 'dict' ? '📖' : entry.source === 'ai' ? '🤖' : entry.source === 'dict-polish' ? '✨' : entry.source === 'eng-rewrite' ? '✍️' : '🔄' }}
                    {{ { 'dict': 'dict', 'ai': 'AI', 'ai-retry': 'retry', 'dict-polish': 'polish', 'eng-rewrite': 'ENG' }[entry.source] || entry.source }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalLogPages > 1" class="log-pagination">
          <button :disabled="logPage <= 1" @click="logPage--" class="log-page-btn">‹ ก่อน</button>
          <span style="font-size:11.5px;color:var(--sub)">
            หน้า {{ logPage }} / {{ totalLogPages }}
            <span style="color:var(--sub2)">({{ filteredLog.length }} รายการ)</span>
          </span>
          <button :disabled="logPage >= totalLogPages" @click="logPage++" class="log-page-btn">ถัดไป ›</button>
        </div>

      </div>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast" :class="{ show: toast.show }">{{ toast.msg }}</div>
</template>

<style scoped>
header {
  background: rgba(240,237,232,0.88);
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(0,0,0,0.07);
  position: sticky; top: 0; z-index: 100;
}
.header-inner {
  display: flex; align-items: center; gap: 14px;
  padding: 13px 28px; max-width: 1140px; margin: 0 auto;
}
.logo {
  width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, #1E3A8A 0%, #3730A3 50%, #7C3AED 100%);
  display: grid; place-items: center; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99,102,241,0.35), 0 1px 2px rgba(0,0,0,0.2);
}
.header-title {
  font-family: 'Syne', 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 700; color: #18130F; letter-spacing: -0.4px;
  display: flex; align-items: center; gap: 6px;
}
.header-title span { color: var(--sub); font-weight: 500; }
.header-arrow {
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #EEF3FE, #F3EFFE);
  color: var(--accent); font-size: 13px;
  width: 22px; height: 22px; border-radius: 6px;
  border: 1px solid #DBEAFE; font-style: normal;
}
.badge {
  margin-left: auto;
  background: linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%);
  color: #EEF3FE; font-size: 10px; font-weight: 700;
  padding: 5px 12px; border-radius: 20px; letter-spacing: 1px;
  text-transform: uppercase; font-family: 'Syne', sans-serif;
  box-shadow: 0 2px 8px rgba(79,70,229,0.3);
}
/* ── Translation Log — Full Width ── */
.log-full-wrap {
  padding-top: 0;
  padding-bottom: 28px;
}
.log-full-card {
  width: 100%;
}
.log-panel { padding-bottom: 4px; }

.log-stats-bar {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  padding: 8px 12px 8px; border-bottom: 1px solid var(--border-lt);
}
.log-stat-chip {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; padding: 3px 9px; border-radius: 20px; cursor: pointer;
  border: 1.5px solid transparent; transition: all .15s;
  background: var(--bg2); color: var(--sub);
}
.log-stat-chip:hover { background: var(--hover); }
.log-stat-chip.active.all         { border-color: var(--accent);  background: var(--accent-lt);  color: var(--accent); }
.log-stat-chip.active.dict        { border-color: #059669;        background: #ECFDF5;           color: #065F46; }
.log-stat-chip.active.dict-polish { border-color: #7C3AED;        background: #F5F3FF;           color: #5B21B6; }
.log-stat-chip.active.ai          { border-color: var(--accent2); background: var(--accent2-lt); color: #5B21B6; }
.log-stat-chip.active.retry       { border-color: var(--warn);    background: var(--warn-lt);    color: #92400E; }
.log-stat-chip.active.eng-rewrite { border-color: #059669;        background: #F0FDF4;           color: #166534; }
.log-stat-chip strong { font-weight: 700; }

.log-btn-dl, .log-btn-clear {
  font-size: 11px; padding: 3px 10px; border-radius: 7px; cursor: pointer;
  border: 1.5px solid var(--border); background: var(--surface); color: var(--sub);
  transition: all .15s;
}
.log-btn-dl:hover    { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
.log-btn-clear:hover { background: #FEF2F2; border-color: #FCA5A5; color: var(--danger); }

.log-table-wrap {
  overflow-x: auto; overflow-y: auto;
  max-height: 560px;
  border-top: 1px solid var(--border-lt);
  border-bottom: 1px solid var(--border-lt);
}
.log-table {
  width: 100%; border-collapse: collapse;
  font-size: 12px; font-family: 'DM Mono', monospace;
  table-layout: fixed;
}
.log-table thead tr {
  position: sticky; top: 0; z-index: 2;
  background: var(--bg2);
}
.log-table th {
  text-align: left; font-size: 11px; font-weight: 600;
  color: var(--sub); padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.log-table td { padding: 6px 12px; vertical-align: middle; border-bottom: 1px solid var(--border-lt); }
.log-row:hover td { background: var(--hover); }
.log-row--dict td         { background: rgba(5,150,105,.03); }
.log-row--ai td           { background: rgba(139,92,246,.03); }
.log-row--ai_retry td     { background: rgba(245,158,11,.04); }
.log-row--dict_polish td  { background: rgba(124,58,237,.05); }
.log-row--eng_rewrite td  { background: rgba(5,150,105,.05); }

.log-no { color: var(--sub2); text-align: right; font-size: 10.5px; min-width: 40px; }
.log-original  { }
.log-translated { }
.log-text-cell {
  display: block; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  color: var(--text);
}
.log-dict-step {
  display: block; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  font-size: 10px; color: #9CA3AF;
  font-style: italic; margin-bottom: 2px;
  border-left: 2px solid #DDD6FE; padding-left: 5px;
}
.log-original .log-text-cell  { color: #D97706; }
.log-translated .log-text-cell { color: #1D4ED8; }

.log-source { text-align: center; }
.log-source-badge {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px;
  white-space: nowrap;
}
.badge--dict         { background: #ECFDF5; color: #065F46; border: 1px solid #6EE7B7; }
.badge--ai           { background: var(--accent2-lt); color: #5B21B6; border: 1px solid #C4B5FD; }
.badge--ai-retry     { background: var(--warn-lt); color: #92400E; border: 1px solid #FCD34D; }
.badge--dict-polish  { background: #F5F3FF; color: #5B21B6; border: 1px solid #A78BFA; }
.badge--eng-rewrite  { background: #F0FDF4; color: #166534; border: 1px solid #86EFAC; }

.log-pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; padding: 8px 12px;
}
.log-page-btn {
  font-size: 11.5px; padding: 3px 12px; border-radius: 7px; cursor: pointer;
  border: 1.5px solid var(--border); background: var(--surface); color: var(--sub);
}
.log-page-btn:disabled { opacity: .35; cursor: default; }
.log-page-btn:not(:disabled):hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
</style>
