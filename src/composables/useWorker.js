import { ref, onUnmounted } from 'vue'
import { extractCellGrid, parseExcelBuffer } from '../utils/excelHelpers.js'
import ExcelWorkerClass from '../workers/excelWorker.js?worker'

export function useWorker() {
  const workerStatus = ref('init') // 'init'|'ready'|'busy'|'error'
  const workerLabel  = ref('⏳ Worker Init')

  let xlsxWorker = null
  let workerReady = false
  const workerCallbacks = {}
  let workerIdCounter = 0

  function setStatus(cls, text) { workerStatus.value = cls; workerLabel.value = text }

  function initWorker() {
    try {
      xlsxWorker = new ExcelWorkerClass()
      xlsxWorker.onmessage = e => {
        const msg = e.data
        if (msg.cmd === 'ready') {
          workerReady = true; setStatus('ready', '⚡ Worker Ready')
        } else if (msg.cmd === 'done') {
          const cb = workerCallbacks[msg.id]
          if (cb) { delete workerCallbacks[msg.id]; cb.resolve(msg.records) }
          if (!Object.keys(workerCallbacks).length) setStatus('ready', '⚡ Worker Ready')
        } else if (msg.cmd === 'error') {
          const cb = workerCallbacks[msg.id]
          if (cb) { delete workerCallbacks[msg.id]; cb.reject(new Error(msg.message)) }
          if (!Object.keys(workerCallbacks).length) setStatus('ready', '⚡ Worker Ready')
        }
      }
      xlsxWorker.onerror = err => {
        console.error('Worker error:', err); workerReady = false; setStatus('error', '⚠️ Fallback Mode')
        Object.values(workerCallbacks).forEach(cb => cb.reject(new Error('Worker crashed')))
        Object.keys(workerCallbacks).forEach(k => delete workerCallbacks[k])
      }
    } catch (e) { setStatus('error', '⚠️ No Worker'); console.warn('Web Worker not supported:', e) }
  }

  async function readExcel(file, autoHeader) {
    if (!workerReady || !xlsxWorker) {
      // Fallback: main thread
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => { try { resolve(parseExcelBuffer(e.target.result, autoHeader)) } catch(err) { reject(err) } }
        reader.onerror = () => reject(new Error('File read error'))
        reader.readAsArrayBuffer(file)
      })
    }
    setStatus('busy', '⚙️ Parsing...')
    const id = ++workerIdCounter
    return new Promise(async (resolve, reject) => {
      workerCallbacks[id] = { resolve, reject }
      try {
        const grid = await extractCellGrid(file)
        xlsxWorker.postMessage({ cmd: 'process', id, grid, autoHeader })
      } catch (err) { delete workerCallbacks[id]; reject(err) }
    })
  }

  onUnmounted(() => { xlsxWorker?.terminate() })

  return { workerStatus, workerLabel, initWorker, readExcel }
}
