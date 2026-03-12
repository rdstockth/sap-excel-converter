import { v } from './tableDetect.js'

export function normalizeKey(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  if (/^\d+$/.test(s)) return String(parseInt(s, 10))
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
  Object.entries(allTableData).forEach(([tableType, recs]) => {
    recs.forEach(record => {
      const key = getOrderKey(record, tableType)
      if (!key) return
      if (!orderMap[key]) orderMap[key] = { IW38: [], IW47: [], ZPM02: [], ZPUCMN: [], Hours: [] }
      if (orderMap[key][tableType] !== undefined) orderMap[key][tableType].push(record)
    })
  })
  return orderMap
}

export function applyMergeFilter(orderMap, filterOn, minTableCount, requiredTables) {
  if (!filterOn) return orderMap
  const result = {}
  Object.entries(orderMap).forEach(([key, td]) => {
    const tableScore = (td.IW38.length > 0) + (td.IW47.length > 0) + (td.ZPM02.length > 0) + (td.ZPUCMN.length > 0) + (td.Hours.length > 0)
    if (tableScore < minTableCount) return
    const reqOk = Object.entries(requiredTables).every(([tbl, req]) => !req || (td[tbl] && td[tbl].length > 0))
    if (!reqOk) return
    result[key] = td
  })
  return result
}

export function getTableScore(td) {
  return (td.IW38.length > 0) + (td.IW47.length > 0) + (td.ZPM02.length > 0) + (td.ZPUCMN.length > 0) + (td.Hours.length > 0)
}
