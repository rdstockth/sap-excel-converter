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
        console.error('Worker error:', err)
        workerReady = false
        setStatus('error', '⚠️ Fallback Mode')

        // Reject all pending callbacks
        Object.values(workerCallbacks).forEach(cb => cb.reject(new Error('Worker crashed')))
        Object.keys(workerCallbacks).forEach(k => delete workerCallbacks[k])

        // FIX 1: Auto-reinitialize worker after crash so it can recover
        xlsxWorker = null
        setTimeout(() => initWorker(), 500)
      }
    } catch (e) {
      setStatus('error', '⚠️ No Worker')
      console.warn('Web Worker not supported:', e)
    }
  }

  async function readExcel(file, autoHeader) {
    // Fallback: main thread
    if (!workerReady || !xlsxWorker) {
      // FIX 2: Show busy/ready status in fallback path too
      setStatus('busy', '⚙️ Parsing...')
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          try {
            const result = parseExcelBuffer(e.target.result, autoHeader)
            setStatus('ready', '⚡ Worker Ready')
            resolve(result)
          } catch (err) {
            setStatus('error', '⚠️ Fallback Mode')
            reject(err)
          }
        }
        reader.onerror = () => {
          setStatus('error', '⚠️ Fallback Mode')
          reject(new Error('File read error'))
        }
        reader.readAsArrayBuffer(file)
      })
    }

    setStatus('busy', '⚙️ Parsing...')
    const id = ++workerIdCounter

    // FIX 3: Extract grid outside the Promise to properly handle errors
    // and reset status if extractCellGrid fails
    let grid
    try {
      grid = await extractCellGrid(file)
    } catch (err) {
      setStatus('ready', '⚡ Worker Ready')
      throw err
    }

    // FIX 4: Don't use async executor in new Promise (anti-pattern that swallows errors)
    return new Promise((resolve, reject) => {
      workerCallbacks[id] = { resolve, reject }
      try {
        xlsxWorker.postMessage({ cmd: 'process', id, grid, autoHeader })
      } catch (err) {
        delete workerCallbacks[id]
        setStatus('ready', '⚡ Worker Ready')
        reject(err)
      }
    })
  }

  onUnmounted(() => { xlsxWorker?.terminate() })

  return { workerStatus, workerLabel, initWorker, readExcel }
}
