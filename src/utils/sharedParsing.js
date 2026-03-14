// sharedParsing.js — Pure parsing logic shared between excelWorker.js and excelHelpers.js
// ไม่มี import ใดๆ เพื่อให้ใช้ได้ทั้งใน Web Worker และ main thread

export const DATE_FMT = {
  14:1,15:1,16:1,17:1,20:1,21:1,22:1,27:1,28:1,29:1,30:1,31:1,
  32:1,33:1,34:1,35:1,36:1,45:1,46:1,47:1,50:1,51:1,52:1,53:1,
  54:1,55:1,56:1,57:1,58:1
}

export function isDateFormat(fmt) {
  if (fmt === undefined || fmt === null) return false
  const n = parseInt(fmt)
  if (!isNaN(n) && String(fmt).trim() === String(n)) return !!DATE_FMT[n] || n >= 164
  const clean = String(fmt).replace(/"[^"]*"/g, '').replace(/\[[^\]]*\]/g, '').toLowerCase()
  return /[ymd]/.test(clean)
}

export function serialToISO(serial) {
  let n = Math.floor(serial)
  if (n < 1 || n > 2958465) return null
  if (n === 60) return '1900-02-29'
  if (n > 60) n--
  n--
  let y = 1900
  const leap = yr => (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0
  while (true) {
    const diy = leap(y) ? 366 : 365
    if (n < diy) break
    n -= diy; y++
  }
  const dim = [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let mo = 0
  while (mo < 11 && n >= dim[mo]) { n -= dim[mo]; mo++ }
  return y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(n + 1).padStart(2, '0')
}

export function parseDMY(str) {
  const m = String(str).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (!m) return null
  const dd = parseInt(m[1]), mo = parseInt(m[2])
  const yy = m[3].length === 2 ? (parseInt(m[3]) >= 50 ? 1900 : 2000) + parseInt(m[3]) : parseInt(m[3])
  if (mo < 1 || mo > 12 || dd < 1 || dd > 31 || yy < 1900 || yy > 2100) return null
  return yy + '-' + String(mo).padStart(2, '0') + '-' + String(dd).padStart(2, '0')
}

/**
 * แปลง raw cell grid (array of rows ของ cell objects) → array of row objects พร้อม header
 * ใช้ร่วมกันได้ใน Worker และ main thread
 */
export function processGrid(grid, autoHeader) {
  const processed = grid.map(row =>
    row.map(cell => {
      if (cell === null) return null
      const { v, w: wRaw, t, z } = cell
      const w = wRaw != null ? String(wRaw).trim() : ''
      let raw = null
      const looksLikeDate =
        t === 'n' && v >= 1 && v <= 2958465 &&
        Math.floor(v) === v && /[\/\-]/.test(w) && !/^[\d,]+(\.\d+)?$/.test(w)
      if (looksLikeDate || (t === 'n' && isDateFormat(z))) {
        raw = serialToISO(v) || null
      } else if (t === 'n') {
        raw = /e[+\-]/i.test(w) ? String(Math.round(v)) : (w || String(v))
      } else if (t === 's') {
        raw = parseDMY(w) || (w || String(v).trim())
      } else {
        raw = w || String(v).trim()
      }
      return raw === '' || raw == null ? null : raw
    })
  )

  let hi = 0
  if (autoHeader) {
    for (let i = 0; i < Math.min(10, processed.length); i++) {
      if (processed[i]?.some(x => String(x || '').toLowerCase().includes('order'))) {
        hi = i; break
      }
    }
  }

  const rawHeaders = processed[hi] || []
  const headerCount = {}
  const headers = rawHeaders.map(h => {
    if (!h) return h
    const key = String(h)
    if (headerCount[key] === undefined) { headerCount[key] = 0; return key }
    else { headerCount[key]++; return key + '.' + headerCount[key] }
  })

  return processed.slice(hi + 1).map(row => {
    const obj = {}
    headers.forEach((h, i) => {
      if (!h) return
      const val = row[i]
      obj[String(h)] = (val === null || val === 'NaN' || val === 'nan') ? null : val
    })
    return obj
  }).filter(r => Object.values(r).some(v => v !== null))
}
