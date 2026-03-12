// ── SAP Table Type Detection ──
export function detectTableType(records) {
  if (!records || !records.length) return 'unknown'
  const keys = Object.keys(records[0]).map(k => k.toLowerCase())
  const has = (...kws) => kws.every(k => keys.some(key => key.includes(k)))
  if (has('order type') && has('bas. start') && has('total act') && has('revision'))   return 'IW38'
  if (has('confirm') && has('wkctract') && has('act. work'))        return 'IW47'
  if (has('order number') && has('g/r cost') && has('gr/gi'))       return 'ZPM02'
  if (has('mn type') && has('working time') && has('break down'))   return 'ZPUCMN'
  if (has('mo no') && has('damage code') && has('cause code'))      return 'Hours'
  return 'generic'
}

// ── RAG Helpers ──
export const v = val => (val === null || val === undefined || val === '' || val === 'null') ? null : String(val).trim()
export const fmt = (label, val) => v(val) ? label + ': ' + v(val) : null
export const lines = arr => arr.filter(Boolean).join('\n')

export function iw38ToText(r) {
  const status = [v(r['System status']), v(r['User status'])].filter(Boolean).join(' | ')
  const desc1 = v(r['Description']), desc2 = v(r['Description.1'])
  const descText = desc1 && desc2 ? 'Order Description: ' + desc1 + ' | Equipment Description: ' + desc2 : desc1 ? 'Description: ' + desc1 : desc2 ? 'Description: ' + desc2 : null
  return lines(['[IW38] Work Order ' + v(r['Order']) + ' | Type: ' + v(r['Order Type']), descText, fmt('Equipment', r['Equipment']), fmt('Cost Center', r['Cost Center']), fmt('Work Center', r['Main WorkCtr']), fmt('Planned Start', r['Bas. start date']), fmt('Actual Start', r['Actual start']), status ? 'Status: ' + status : null, fmt('Actual Cost (THB)', r['Total act.costs']), fmt('Revision', r['Revision'])])
}

export function iw47ToText(r) {
  const timeRange = (v(r['Act. Start']) && v(r['Act.Finish'])) ? 'Time: ' + v(r['Act. Start']) + ' - ' + v(r['Act.Finish']) : null
  return lines(['[IW47] Confirmation ' + v(r['Confirm.']) + ' | Order: ' + v(r['Order']), fmt('Technician', r['Created By']), fmt('Confirmation Text', r['Confirmation text']), fmt('Equipment', r['Equipment']), fmt('Functional Location', r['Functional Loc.']), fmt('Work Center', r['WkCtrAct']), fmt('Actual Start Date', r['Actl Start']), timeRange, fmt('Actual Work', r['Act. work']), fmt('Unit', r['Un. WkAct']), fmt('Posting Date', r['Postg Date'])])
}

export function zpm02ToText(r) {
  return lines(['[ZPM02] Order ' + v(r['Order Number']) + ' | Type: ' + v(r['Order Type']), fmt('Order Text', r['Order Text']), fmt('Notification', r['Notification No.']), fmt('Equipment', r['Equipment']), fmt('Functional Location', r['Func. Loc.']), fmt('Cost Center', r['Cost Center']), fmt('Material No', r['Mat No']), fmt('Material Description', r['Description']), fmt('Create Date', r['Create']), fmt('G/R Cost (THB)', r['G/R Cost']), fmt('G/I Cost (THB)', r['G/I Cost']), fmt('GR/GI Balance (THB)', r['GR/GI Balance']), fmt('Labour Cost (THB)', r['Labour Cost']), fmt('Action Hour', r['Action Hour'])])
}

export function zpucmnToText(r) {
  const timeInfo = [v(r['Working Time(min)']) ? 'Working Time: ' + v(r['Working Time(min)']) + ' min' : null, v(r['Break Down Time(min)']) ? 'Breakdown Time: ' + v(r['Break Down Time(min)']) + ' min' : null, v(r['Response Time(min)']) ? 'Response Time: ' + v(r['Response Time(min)']) + ' min' : null].filter(Boolean).join(' | ')
  return lines(['[ZPUCMN] Order ' + v(r['Order']) + ' | MO Type: ' + v(r['MO Type']), fmt('Notification', r['MN no.']), fmt('MN Type', r['MN Type']), fmt('Description', r['Desc.']), fmt('Equipment', r['Equipment']), fmt('Notification Date', r['Notif. date']), timeInfo || null, fmt('Repair & Maintenance Ext. Cost (THB)', r['Repair & Maint. Ext.']), fmt('Spare Parts Cost (THB)', r['Spare Parts Costs']), fmt('TS Service Cost (THB)', r['TS for MO 912001'])])
}

export function hoursToText(r) {
  const damage = [v(r['Damage Code']), v(r['Damage Text'])].filter(Boolean).join(' - ')
  const cause  = [v(r['Cause Code']),  v(r['Cause Text'])].filter(Boolean).join(' - ')
  const action = [v(r['Activity Code']),v(r['Activity Text'])].filter(Boolean).join(' - ')
  return lines(['[Hours] Work Order ' + v(r['MO no.']) + ' | Type: ' + v(r['MO Type']), fmt('Description', r['Description']), fmt('Notification', r['MN no.']), fmt('Equipment', r['Equipment']), fmt('Functional Location', r['Functional Location']), fmt('Inventory Number', r['Inventory number']), fmt('Cost Center', r['Cost Center']), fmt('Object Part', r['Object Part Text']), damage ? 'Damage: ' + damage : null, cause ? 'Cause: ' + cause : null, action ? 'Action: ' + action : null, fmt('MO Created Date', r['MO Created Date']), fmt('TECO Date', r['MO Teco Da']), fmt('Actual Labor Duration', r['Act. Labor duration']), fmt('Spare Part Cost (THB)', r['Spare Part Cost']), fmt('Consumed SP Cost (THB)', r['Consmpt SP Cost']), fmt('TS Service Cost (THB)', r['TS service Cost']), fmt('Total Cost (THB)', r['Total Cost'])])
}

export function genericToText(r) {
  return Object.entries(r).filter(([, val]) => val !== null && val !== '').map(([key, val]) => key + ': ' + val).join('\n')
}

export function recordToChunk(record, tableType) {
  switch (tableType) {
    case 'IW38':   return iw38ToText(record)
    case 'IW47':   return iw47ToText(record)
    case 'ZPM02':  return zpm02ToText(record)
    case 'ZPUCMN': return zpucmnToText(record)
    case 'Hours':  return hoursToText(record)
    default:       return genericToText(record)
  }
}

export function splitRecordsToRagTexts(records, filename, splitSize, doSplit) {
  const tableType = detectTableType(records)
  const allChunks = records.map((r, i) => {
    const chunk = recordToChunk(r, tableType)
    return chunk ? '--- Record ' + (i + 1) + ' ---\n' + chunk : null
  }).filter(Boolean)
  if (!doSplit || !splitSize || allChunks.length <= splitSize) {
    const header = '# SAP PM RAG Chunks\n# Source: ' + filename + '\n# Table: ' + tableType + '\n# Total: ' + allChunks.length + ' records\n# Generated: ' + new Date().toISOString() + '\n\n'
    return [{ text: header + allChunks.join('\n\n'), suffix: '' }]
  }
  const parts = []; const totalParts = Math.ceil(allChunks.length / splitSize)
  for (let p = 0; p < totalParts; p++) {
    const slice = allChunks.slice(p * splitSize, (p + 1) * splitSize)
    const hdr = '# SAP PM RAG Chunks\n# Source: ' + filename + '\n# Table: ' + tableType + '\n# Part: ' + (p + 1) + '/' + totalParts + '\n# Records in this file: ' + slice.length + '\n# Total records: ' + allChunks.length + '\n# Generated: ' + new Date().toISOString() + '\n\n'
    parts.push({ text: hdr + slice.join('\n\n'), suffix: '_part' + (p + 1) + 'of' + totalParts })
  }
  return parts
}

// ── Merged RAG chunk ──
export function mergedOrderToChunk(orderKey, tableData) {
  const sections = []
  sections.push('════════════════════════════════')
  sections.push('Work Order: ' + orderKey)
  sections.push('════════════════════════════════')
  if (tableData.IW38 && tableData.IW38.length) {
    const r = tableData.IW38[0]
    const status = [v(r['System status']), v(r['User status'])].filter(Boolean).join(' | ')
    const desc1 = v(r['Description']), desc2 = v(r['Description.1'])
    const descText = desc1 && desc2 ? desc1 + ' | ' + desc2 : (desc1 || desc2 || null)
    sections.push('\n[Work Order Info - IW38]')
    if (descText) sections.push('Description: ' + descText)
    if (v(r['Order Type']))       sections.push('Order Type: '   + v(r['Order Type']))
    if (v(r['Equipment']))        sections.push('Equipment: '    + v(r['Equipment']))
    if (v(r['Cost Center']))      sections.push('Cost Center: '  + v(r['Cost Center']))
    if (v(r['Main WorkCtr']))     sections.push('Work Center: '  + v(r['Main WorkCtr']))
    if (v(r['Bas. start date']))  sections.push('Planned Start: '+ v(r['Bas. start date']))
    if (v(r['Actual start']))     sections.push('Actual Start: ' + v(r['Actual start']))
    if (status) sections.push('Status: ' + status)
    if (v(r['Total act.costs']))  sections.push('Total Actual Cost (IW38): ' + v(r['Total act.costs']) + ' THB')
    if (v(r['Revision']))         sections.push('Revision: ' + v(r['Revision']))
  }
  if (tableData.Hours && tableData.Hours.length) {
    sections.push('\n[Work Detail - Hours]')
    tableData.Hours.forEach((r, i) => {
      const damage = [v(r['Damage Code']), v(r['Damage Text'])].filter(Boolean).join(' - ')
      const cause  = [v(r['Cause Code']),  v(r['Cause Text'])].filter(Boolean).join(' - ')
      const action = [v(r['Activity Code']),v(r['Activity Text'])].filter(Boolean).join(' - ')
      if (tableData.Hours.length > 1) sections.push('  Item ' + (i + 1) + ':')
      if (v(r['Functional Location'])) sections.push('  Functional Location: ' + v(r['Functional Location']))
      if (v(r['Object Part Text']))    sections.push('  Object Part: ' + v(r['Object Part Text']))
      if (damage) sections.push('  Damage: ' + damage)
      if (cause)  sections.push('  Cause: '  + cause)
      if (action) sections.push('  Action: ' + action)
      if (v(r['Act. Labor duration'])) sections.push('  Labor Duration: ' + v(r['Act. Labor duration']) + ' ' + (v(r['Act. Labor Unit']) || 'H'))
      if (v(r['Total Cost']))          sections.push('  Total Cost: ' + v(r['Total Cost']) + ' THB')
    })
  }
  if (tableData.ZPUCMN && tableData.ZPUCMN.length) {
    sections.push('\n[Notification & Time Analysis - ZPUCMN]')
    tableData.ZPUCMN.forEach((r, i) => {
      if (tableData.ZPUCMN.length > 1) sections.push('  Item ' + (i + 1) + ':')
      if (v(r['MN no.']))                  sections.push('  Notification: '      + v(r['MN no.']))
      if (v(r['Desc.']))                   sections.push('  Description: '       + v(r['Desc.']))
      if (v(r['Notif. date']))             sections.push('  Notification Date: ' + v(r['Notif. date']))
      if (v(r['Working Time(min)']))       sections.push('  Working Time: '      + v(r['Working Time(min)']) + ' min')
      if (v(r['Break Down Time(min)']))    sections.push('  Breakdown Time: '    + v(r['Break Down Time(min)']) + ' min')
      if (v(r['Response Time(min)']))      sections.push('  Response Time: '     + v(r['Response Time(min)']) + ' min')
      if (v(r['Spare Parts Costs']))       sections.push('  Spare Parts Cost: '  + v(r['Spare Parts Costs']) + ' THB')
      if (v(r['Repair & Maint. Ext.']))    sections.push('  Repair & Maint. Ext: '+ v(r['Repair & Maint. Ext.']) + ' THB')
    })
  }
  if (tableData.IW47 && tableData.IW47.length) {
    sections.push('\n[Confirmations - IW47] (' + tableData.IW47.length + ' records)')
    tableData.IW47.forEach((r, i) => {
      sections.push('  Confirmation ' + (i + 1) + ': ' + (v(r['Confirm.']) || '-'))
      if (v(r['Created By']))          sections.push('    Technician: ' + v(r['Created By']))
      if (v(r['Confirmation text']))   sections.push('    Note: '       + v(r['Confirmation text']))
      if (v(r['Actl Start']))          sections.push('    Date: '       + v(r['Actl Start']))
      const timeRange = (v(r['Act. Start']) && v(r['Act.Finish'])) ? v(r['Act. Start']) + ' - ' + v(r['Act.Finish']) : null
      if (timeRange) sections.push('    Time: ' + timeRange)
      if (v(r['Act. work'])) sections.push('    Work: ' + v(r['Act. work']) + ' ' + (v(r['Un. WkAct']) || 'H'))
    })
  }
  if (tableData.ZPM02 && tableData.ZPM02.length) {
    sections.push('\n[Materials & Costs - ZPM02] (' + tableData.ZPM02.length + ' records)')
    let totalGR = 0, totalGI = 0
    tableData.ZPM02.forEach((r, i) => {
      sections.push('  Item ' + (i + 1) + ': ' + (v(r['Description']) || '-'))
      if (v(r['Mat No']))       sections.push('    Material No: '  + v(r['Mat No']))
      if (v(r['G/R Cost']))     sections.push('    G/R Cost: '     + v(r['G/R Cost']) + ' THB')
      if (v(r['G/I Cost']))     sections.push('    G/I Cost: '     + v(r['G/I Cost']) + ' THB')
      if (v(r['GR/GI Balance'])) sections.push('    Balance: '    + v(r['GR/GI Balance']) + ' THB')
      if (v(r['Labour Cost']))  sections.push('    Labour Cost: '  + v(r['Labour Cost']) + ' THB')
      totalGR += parseFloat(String(r['G/R Cost'] ?? '').replace(/,/g,'')) || 0
      totalGI += parseFloat(String(r['G/I Cost'] ?? '').replace(/,/g,'')) || 0
    })
    sections.push('  ── Total G/R Cost: ' + totalGR.toLocaleString('en', {minimumFractionDigits:2}) + ' THB')
    sections.push('  ── Total G/I Cost: ' + totalGI.toLocaleString('en', {minimumFractionDigits:2}) + ' THB')
  }
  return sections.join('\n')
}

export function splitMergedRagTexts(chunks, tableNames, orderCount, splitSize, doSplit) {
  if (!doSplit || !splitSize || chunks.length <= splitSize) {
    const header = '# SAP PM Merged RAG Chunks\n# Tables: ' + tableNames + '\n# Total Orders: ' + orderCount + '\n# Generated: ' + new Date().toISOString() + '\n# Note: Each chunk = 1 Work Order\n\n'
    return [{ text: header + chunks.join('\n\n'), suffix: '' }]
  }
  const parts = [], totalParts = Math.ceil(chunks.length / splitSize)
  for (let p = 0; p < totalParts; p++) {
    const slice = chunks.slice(p * splitSize, (p + 1) * splitSize)
    const hdr = '# SAP PM Merged RAG Chunks\n# Tables: ' + tableNames + '\n# Part: ' + (p + 1) + '/' + totalParts + '\n# Orders in this file: ' + slice.length + '\n# Total orders: ' + orderCount + '\n# Generated: ' + new Date().toISOString() + '\n# Note: Each chunk = 1 Work Order\n\n'
    parts.push({ text: hdr + slice.join('\n\n'), suffix: '_part' + (p + 1) + 'of' + totalParts })
  }
  return parts
}
