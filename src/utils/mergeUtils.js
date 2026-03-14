import { v } from './tableDetect.js'

const KNOWN_TABLES = ['IW38', 'IW47', 'ZPM02', 'ZPUCMN', 'Hours']

export function normalizeKey(raw) {
  if (raw === undefined || raw === null) return null
  const s = String(raw).trim()
  if (!s) return null
  if (/^\d+$/.test(s)) return s.replace(/^0+/, '') || '0'
  return s
}

export function getOrderKey(record, tableType) {
  return normalizeKey(getOrderKeyRaw(record, tableType))
}

export function getOrderKeyRaw(record, tableType) {
  switch (tableType) {
    case 'IW38':
    case 'IW47':
    case 'ZPUCMN': return v(record['Order'])
    case 'ZPM02':  return v(record['Order Number'])
    case 'Hours':  return v(record['MO no.'])
    default:
      // Bug 5 fix: generic table — ลองหา key ที่เป็นไปได้แทนที่จะทิ้ง
      return v(record['Order']) || v(record['Order Number']) || v(record['MO no.']) || null
  }
}

export function buildOrderMap(allTableData) {
  const orderMap = {}

  for (const [tableType, recs] of Object.entries(allTableData)) {
    if (!Array.isArray(recs)) continue

    for (const record of recs) {
      if (!record) continue
      const key = getOrderKey(record, tableType)
      if (!key) continue

      if (!orderMap[key]) {
        // Bug 5 fix: initialise เฉพาะ KNOWN_TABLES เป็น array, dynamic tables จะถูกเพิ่มต่อ
        orderMap[key] = Object.fromEntries(KNOWN_TABLES.map(t => [t, []]))
      }

      // Bug 5 fix: ถ้า tableType ไม่อยู่ใน KNOWN_TABLES (เช่น 'generic') ให้สร้าง array ใหม่แทนที่จะทิ้ง
      if (!Array.isArray(orderMap[key][tableType])) {
        orderMap[key][tableType] = []
      }

      orderMap[key][tableType].push(record)
    }
  }

  return orderMap
}

export function applyMergeFilter(orderMap, filterOn, minTableCount, requiredTables) {
  if (!filterOn) return orderMap
  const result = {}
  for (const [key, td] of Object.entries(orderMap)) {
    const tableScore = KNOWN_TABLES.reduce((n, t) => n + (td[t]?.length > 0 ? 1 : 0), 0)
    if (tableScore < minTableCount) continue
    const reqOk = Object.entries(requiredTables || {})
      .every(([tbl, req]) => !req || (td[tbl] && td[tbl].length > 0))
    if (!reqOk) continue
    result[key] = td
  }
  return result
}

export function getTableScore(td) {
  return KNOWN_TABLES.reduce((n, t) => n + (td[t]?.length > 0 ? 1 : 0), 0)
}
