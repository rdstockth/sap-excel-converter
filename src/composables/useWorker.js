import { ref, onUnmounted } from 'vue'
import { extractCellGrid, parseExcelBuffer } from '../utils/excelHelpers.js'
import ExcelWorkerClass from '../workers/excelWorker.js?worker'

const STATUS = {
  INIT: 'init',
  READY: 'ready',
  BUSY: 'busy',
  ERROR: 'error'
}

export function useWorker() {
  const workerStatus = ref(STATUS.INIT)
  const workerLabel = ref('⏳ Worker Init')

  let xlsxWorker = null
  let workerReady = false
  let workerInitPromise = null

  const workerCallbacks = new Map()
  let workerIdCounter = 0

  function setStatus(cls, text) {
    workerStatus.value = cls
    workerLabel.value = text
  }

  const setReady = () => setStatus(STATUS.READY, '⚡ Worker Ready')
  const setBusy = () => setStatus(STATUS.BUSY, '⚙️ Parsing...')
  const setError = () => setStatus(STATUS.ERROR, '⚠️ Fallback Mode')

  function initWorker() {
    if (workerInitPromise) return workerInitPromise

    workerInitPromise = new Promise((resolve) => {
      try {
        xlsxWorker = new ExcelWorkerClass()

        xlsxWorker.onmessage = e => {
          const msg = e.data

          if (msg.cmd === 'ready') {
            workerReady = true
            setReady()
            resolve()
            return
          }

          if (msg.cmd === 'done') {
            const cb = workerCallbacks.get(msg.id)
            if (cb) {
              workerCallbacks.delete(msg.id)
              clearTimeout(cb.timeout)
              cb.resolve(msg.records)
            }

            if (!workerCallbacks.size) setReady()
          }

          if (msg.cmd === 'error') {
            const cb = workerCallbacks.get(msg.id)
            if (cb) {
              workerCallbacks.delete(msg.id)
              clearTimeout(cb.timeout)
              cb.reject(new Error(msg.message))
            }

            if (!workerCallbacks.size) setReady()
          }
        }

        xlsxWorker.onerror = err => {
          console.error('Worker error:', err)

          workerReady = false
          setError()

          workerCallbacks.forEach(cb => {
            clearTimeout(cb.timeout)
            cb.reject(new Error('Worker crashed'))
          })
          workerCallbacks.clear()

          xlsxWorker?.terminate()
          xlsxWorker = null
          workerInitPromise = null

          setTimeout(() => initWorker(), 500)
        }

      } catch (e) {
        console.warn('Web Worker not supported:', e)
        setStatus(STATUS.ERROR, '⚠️ No Worker')
        resolve()
      }
    })

    return workerInitPromise
  }

  async function readExcel(file, autoHeader) {
    await initWorker()

    // fallback main thread
    if (!workerReady || !xlsxWorker) {
      setBusy()

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = e => {
          try {
            const result = parseExcelBuffer(e.target.result, autoHeader)
            setReady()
            resolve(result)
          } catch (err) {
            setError()
            reject(err)
          }
        }

        reader.onerror = () => {
          setError()
          reject(new Error('File read error'))
        }

        reader.readAsArrayBuffer(file)
      })
    }

    setBusy()
    const id = ++workerIdCounter

    let grid
    try {
      grid = await extractCellGrid(file)
    } catch (err) {
      setReady()
      throw err
    }

    return new Promise((resolve, reject) => {

      const timeout = setTimeout(() => {
        workerCallbacks.delete(id)
        reject(new Error('Worker timeout'))
      }, 30000)

      workerCallbacks.set(id, { resolve, reject, timeout })

      try {
        xlsxWorker.postMessage({
          cmd: 'process',
          id,
          grid,
          autoHeader
        })
      } catch (err) {
        clearTimeout(timeout)
        workerCallbacks.delete(id)
        setReady()
        reject(err)
      }

    })
  }

  onUnmounted(() => {
    xlsxWorker?.terminate()
    xlsxWorker = null
    workerReady = false
    workerCallbacks.clear()
  })

  return {
    workerStatus,
    workerLabel,
    initWorker,
    readExcel
  }
}
