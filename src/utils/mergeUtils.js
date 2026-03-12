import { v } from './tableDetect.js'

const TABLES = ['IW38', 'IW47', 'ZPM02', 'ZPUCMN', 'Hours']

export function normalizeKey(raw) {
  if (raw === undefined || raw === null) return null
  const s = String(raw).trim()
  if (!s) return null
  if (/^\d+$/.test(s)) return s.replace(/^0+/, '') || '0'
  return s
}

export function getOrderKey(record, tableType) {
  let raw
  switch (tableType) {
    case 'IW38':   raw = v(record['Order']); break
    case 'IW47':   raw = v(record['Order']); break
    case 'ZPM02':  raw = v(record['Order Number']); break
    case 'ZPUCMN': raw = v(record['Order']); break
    case 'Hours':  raw = v(record['MO no.']); break
    default: raw = v(record['Order']) || v(record['Order Number']) || v(record['MO no.']) || null
  }
  return normalizeKey(raw)
}

export function getOrderKeyRaw(record, tableType) {
  switch (tableType) {
    case 'IW38': case 'IW47': case 'ZPUCMN': return v(record['Order'])
    case 'ZPM02': return v(record['Order Number'])
    case 'Hours': return v(record['MO no.'])
    default: return v(record['Order']) || v(record['Order Number']) || v(record['MO no.']) || null
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
      orderMap[key] ??= Object.fromEntries(TABLES.map(t => [t, []]))
      if (orderMap[key][tableType] !== undefined) orderMap[key][tableType].push(record)
    }
  }
  return orderMap
}

export function applyMergeFilter(orderMap, filterOn, minTableCount, requiredTables) {
  if (!filterOn) return orderMap
  const result = {}
  for (const [key, td] of Object.entries(orderMap)) {
    const tableScore = TABLES.reduce((n, t) => n + (td[t]?.length > 0), 0)
    if (tableScore < minTableCount) continue
    const reqOk = Object.entries(requiredTables || {}).every(([tbl, req]) => !req || (td[tbl] && td[tbl].length > 0))
    if (!reqOk) continue
    result[key] = td
  }
  return result
}

export function getTableScore(td) {
  return TABLES.reduce((n, t) => n + (td[t]?.length > 0), 0)
}
