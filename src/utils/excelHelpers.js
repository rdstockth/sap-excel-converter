import * as XLSX from 'xlsx'

// ── Date helpers ──
const DATE_FMT = {14:1,15:1,16:1,17:1,20:1,21:1,22:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,45:1,46:1,47:1,50:1,51:1,52:1,53:1,54:1,55:1,56:1,57:1,58:1}

export function isDateFormat(fmt) {
  if (fmt === undefined || fmt === null) return false
  var n = parseInt(fmt)
  if (!isNaN(n) && String(fmt).trim() === String(n)) return !!DATE_FMT[n] || n >= 164
  var clean = String(fmt).replace(/"[^"]*"/g,'').replace(/\[[^\]]*\]/g,'').toLowerCase()
  return /[ymd]/.test(clean)
}

export function serialToISO(serial) {
  var n = Math.floor(serial)
  if (n < 1 || n > 2958465) return null
  if (n === 60) return '1900-02-29'
  if (n > 60) n -= 1; n -= 1
  var y = 1900, leap = yr => (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0
  while (true) { var diy = leap(y) ? 366 : 365; if (n < diy) break; n -= diy; y++ }
  var dim = [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], mo = 0
  while (mo < 11 && n >= dim[mo]) { n -= dim[mo]; mo++ }
  return y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(n + 1).padStart(2, '0')
}

export function parseDMY(str) {
  var m = String(str).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (!m) return null
  var dd = parseInt(m[1]), mo = parseInt(m[2])
  var yy = m[3].length === 2 ? (parseInt(m[3]) >= 50 ? 1900 : 2000) + parseInt(m[3]) : parseInt(m[3])
  if (mo < 1 || mo > 12 || dd < 1 || dd > 31 || yy < 1900 || yy > 2100) return null
  return yy + '-' + String(mo).padStart(2, '0') + '-' + String(dd).padStart(2, '0')
}

// ── Extract cell grid from XLSX workbook ──
export function extractCellGrid(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: false })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rng = XLSX.utils.decode_range(ws['!ref'] || 'A1')
        const grid = []
        for (let r = rng.s.r; r <= rng.e.r; r++) {
          const row = []
          for (let c = rng.s.c; c <= rng.e.c; c++) {
            const cell = ws[XLSX.utils.encode_cell({ r, c })]
            if (!cell || cell.v == null || cell.v === '') { row.push(null); continue }
            row.push({ v: cell.v, w: cell.w != null ? String(cell.w) : '', t: cell.t, z: cell.z != null ? cell.z : null })
          }
          grid.push(row)
        }
        resolve(grid)
      } catch (err) { reject(err) }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsArrayBuffer(file)
  })
}

// ── Fallback main-thread parse ──
export function parseExcelBuffer(buffer, autoHeader) {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: false })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  const grid = []
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row = []
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (!cell || cell.v === undefined || cell.v === null || cell.v === '') { row.push(null); continue }
      let raw = null
      const wStr = cell.w !== undefined ? String(cell.w).trim() : ''
      const looksLikeDate = cell.t === 'n' && cell.v >= 1 && cell.v <= 2958465 && Math.floor(cell.v) === cell.v && /[\/-]/.test(wStr) && !/^[\d,]+(\.\d+)?$/.test(wStr)
      if (looksLikeDate || (cell.t === 'n' && isDateFormat(cell.z))) { raw = serialToISO(cell.v) || null }
      else if (cell.t === 'n') { raw = /e[+\-]/i.test(wStr) ? String(Math.round(cell.v)) : (wStr !== '' ? wStr : String(cell.v)) }
      else if (cell.t === 's') { raw = parseDMY(wStr) || (wStr !== '' ? wStr : String(cell.v).trim()) }
      else { raw = wStr !== '' ? wStr : String(cell.v).trim() }
      row.push(raw === '' || raw === null ? null : raw)
    }
    grid.push(row)
  }
  let headerRowIdx = 0
  if (autoHeader) {
    for (let i = 0; i < Math.min(10, grid.length); i++) {
      if (grid[i] && grid[i].some(x => String(x || '').toLowerCase().includes('order'))) { headerRowIdx = i; break }
    }
  }
  const rawHeaders = grid[headerRowIdx] || []
  const headerCount = {}
  const headers = rawHeaders.map(h => {
    if (!h) return h
    const key = String(h)
    if (headerCount[key] === undefined) { headerCount[key] = 0; return key }
    else { headerCount[key]++; return key + '.' + headerCount[key] }
  })
  return grid.slice(headerRowIdx + 1).map(row => {
    const obj = {}
    headers.forEach((h, i) => { if (!h) return; const val = row[i]; obj[String(h)] = (val === null || val === 'NaN' || val === 'nan') ? null : val })
    return obj
  }).filter(r => Object.values(r).some(v => v !== null))
}
