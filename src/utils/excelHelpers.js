import * as XLSX from 'xlsx'
import { isDateFormat, serialToISO, parseDMY, processGrid } from './sharedParsing.js'

// re-export ให้โค้ดเก่าที่ import จาก excelHelpers ยังใช้ได้
export { isDateFormat, serialToISO, parseDMY }

function decodeCsvBuffer(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  // SAP CSV จาก Windows มักเป็น Windows-874 ส่วนไฟล์ใหม่อาจเป็น UTF-8
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch (_) {
    return new TextDecoder('windows-874').decode(bytes)
  }
}

function readWorkbook(buffer, fileName = '') {
  if (/\.csv$/i.test(fileName)) {
    const text = decodeCsvBuffer(buffer)
    // SAP Thailand exports dates as DD/MM/YYYY. dateNF prevents ambiguous dates
    // such as 04/03/2026 from being interpreted as April 3.
    return XLSX.read(text, {
      type: 'string',
      cellDates: false,
      dateNF: 'dd/mm/yyyy'
    })
  }
  return XLSX.read(buffer, { type: 'array', cellDates: false })
}

function workbookToGrid(wb) {
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rng = XLSX.utils.decode_range(ws?.['!ref'] || 'A1')
  const grid = []
  for (let r = rng.s.r; r <= rng.e.r; r++) {
    const row = []
    for (let c = rng.s.c; c <= rng.e.c; c++) {
      const cell = ws?.[XLSX.utils.encode_cell({ r, c })]
      if (!cell || cell.v == null || cell.v === '') { row.push(null); continue }
      row.push({
        v: cell.v,
        w: cell.w != null ? String(cell.w) : '',
        t: cell.t,
        z: cell.z != null ? cell.z : null
      })
    }
    grid.push(row)
  }
  return grid
}

// ── Extract cell grid from XLSX workbook ──
export function extractCellGrid(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        resolve(workbookToGrid(readWorkbook(e.target.result, file.name)))
      } catch (err) { reject(err) }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsArrayBuffer(file)
  })
}

// ── Fallback main-thread parse (uses shared processGrid) ──
export function parseExcelBuffer(buffer, autoHeader, fileName = '') {
  const wb = readWorkbook(buffer, fileName)
  return processGrid(workbookToGrid(wb), autoHeader)
}
