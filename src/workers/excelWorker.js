// Web Worker: date conversion + header detection + record building
// Import shared logic จาก sharedParsing — ใช้โค้ดเดียวกับ main thread ทุกประการ
import { processGrid } from '../utils/sharedParsing.js'

self.postMessage({ cmd: 'ready' })

self.onmessage = function(e) {
  const msg = e.data
  if (msg.cmd === 'process') {
    try {
      const records = processGrid(msg.grid, msg.autoHeader)
      self.postMessage({ cmd: 'done', id: msg.id, records })
    } catch (err) {
      self.postMessage({ cmd: 'error', id: msg.id, message: String(err) })
    }
  }
}
