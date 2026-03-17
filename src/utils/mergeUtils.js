import { v } from './tableDetect.js'

const KNOWN_TABLES = ['IW38', 'IW47', 'IW29', 'ZPM02', 'ZPUCMN', 'Hours']

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
    case 'IW29':
    case 'ZPUCMN': return v(record['Order'])
    case 'ZPM02':  return v(record['Order Number'])
    case 'Hours':  return v(record['MO no.'])
    default:
      // Bug 5 fix: generic table — ลองหา key ที่เป็นไปได้แทนที่จะทิ้ง
      return v(record['Order']) || v(record['Order Number']) || v(record['MO no.']) || null
  }
}

// IW29-mode: key by Notification number, link other tables via Order field
function buildNotificationMap(allTableData) {
  const notifMap = {}

  // Step 1: index IW29 records by Notification number
  for (const record of allTableData['IW29']) {
    if (!record) continue
    const notifKey = normalizeKey(v(record['Notification']))
    if (!notifKey) continue
    if (!notifMap[notifKey]) {
      notifMap[notifKey] = Object.fromEntries(KNOWN_TABLES.map(t => [t, []]))
    }
    notifMap[notifKey]['IW29'].push(record)
  }

  // Step 2: build reverse lookup  orderKey → Set<notifKey>  from IW29.Order
  const orderToNotifs = {}
  for (const [notifKey, td] of Object.entries(notifMap)) {
    for (const r of td['IW29']) {
      const orderKey = normalizeKey(v(r['Order']))
      if (!orderKey) continue
      if (!orderToNotifs[orderKey]) orderToNotifs[orderKey] = new Set()
      orderToNotifs[orderKey].add(notifKey)
    }
  }

  // Step 3: distribute IW38 / IW47 / ZPM02 / ZPUCMN / Hours into notification buckets
  for (const [tableType, recs] of Object.entries(allTableData)) {
    if (tableType === 'IW29' || !Array.isArray(recs)) continue
    for (const record of recs) {
      if (!record) continue
      const orderKey = getOrderKey(record, tableType)
      if (!orderKey) continue
      const notifKeys = orderToNotifs[orderKey]
      if (notifKeys && notifKeys.size) {
        for (const nk of notifKeys) {
          if (!Array.isArray(notifMap[nk][tableType])) notifMap[nk][tableType] = []
          notifMap[nk][tableType].push(record)
        }
      } else {
        // orphan order: ไม่มี IW29 notification — เก็บไว้ใน bucket พิเศษ
        const orphanKey = 'ORDER:' + orderKey
        if (!notifMap[orphanKey]) {
          notifMap[orphanKey] = Object.fromEntries(KNOWN_TABLES.map(t => [t, []]))
        }
        if (!Array.isArray(notifMap[orphanKey][tableType])) notifMap[orphanKey][tableType] = []
        notifMap[orphanKey][tableType].push(record)
      }
    }
  }

  return notifMap
}

export function buildOrderMap(allTableData) {
  // IW29-mode: ถ้ามีข้อมูล IW29 ให้ใช้ Notification เป็น primary key
  if (Array.isArray(allTableData['IW29']) && allTableData['IW29'].length > 0) {
    return buildNotificationMap(allTableData)
  }

  // Order-mode: logic เดิม
  const orderMap = {}
  for (const [tableType, recs] of Object.entries(allTableData)) {
    if (!Array.isArray(recs)) continue
    for (const record of recs) {
      if (!record) continue
      const key = getOrderKey(record, tableType)
      if (!key) continue
      if (!orderMap[key]) {
        orderMap[key] = Object.fromEntries(KNOWN_TABLES.map(t => [t, []]))
      }
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
