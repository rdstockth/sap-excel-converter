import * as XLSX from 'xlsx'
import { isDateFormat, serialToISO, parseDMY, processGrid } from './sharedParsing.js'

// re-export ให้โค้ดเก่าที่ import จาก excelHelpers ยังใช้ได้
export { isDateFormat, serialToISO, parseDMY }

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

// ── Fallback main-thread parse (uses shared processGrid) ──
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
      row.push({ v: cell.v, w: cell.w != null ? String(cell.w) : '', t: cell.t, z: cell.z != null ? cell.z : null })
    }
    grid.push(row)
  }
  // ใช้ processGrid จาก sharedParsing — logic เดียวกับ Worker เสมอ
  return processGrid(grid, autoHeader)
}
