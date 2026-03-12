// Web Worker: date conversion + header detection + record building
// Pure JS — no XLSX needed (main thread sends raw cell grid)

var _FMT = {14:1,15:1,16:1,17:1,20:1,21:1,22:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,45:1,46:1,47:1,50:1,51:1,52:1,53:1,54:1,55:1,56:1,57:1,58:1}

function _idf(f) {
  if (f == null) return false
  var n = parseInt(f)
  if (!isNaN(n) && String(f).trim() === String(n)) return !!_FMT[n] || n >= 164
  return /[ymd]/.test(String(f).replace(/"[^"]*"/g,'').replace(/\[[^\]]*\]/g,'').toLowerCase())
}

function _s2iso(s) {
  var n = Math.floor(s)
  if (n < 1 || n > 2958465) return null
  if (n === 60) return '1900-02-29'
  if (n > 60) n--
  n--
  var y = 1900, lp = function(yr) { return (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0 }
  while (true) { var d = lp(y) ? 366 : 365; if (n < d) break; n -= d; y++ }
  var dm = [31, lp(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], m = 0
  while (m < 11 && n >= dm[m]) { n -= dm[m]; m++ }
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(n + 1).padStart(2, '0')
}

function _pdmy(str) {
  var x = String(str).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (!x) return null
  var d = parseInt(x[1]), m = parseInt(x[2])
  var y = x[3].length === 2 ? (parseInt(x[3]) >= 50 ? 1900 : 2000) + parseInt(x[3]) : parseInt(x[3])
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return null
  return y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0')
}

function _processGrid(grid, autoHeader) {
  var processed = grid.map(function(row) {
    return row.map(function(cell) {
      if (cell === null) return null
      var v = cell.v, w = cell.w != null ? String(cell.w).trim() : '', t = cell.t, z = cell.z
      var raw = null
      var isDate = t === 'n' && v >= 1 && v <= 2958465 && Math.floor(v) === v && /[\/-]/.test(w) && !/^[\d,]+(\.\d+)?$/.test(w)
      if (isDate || (t === 'n' && _idf(z))) { raw = _s2iso(v) || null }
      else if (t === 'n') { raw = /e[+\-]/i.test(w) ? String(Math.round(v)) : (w || String(v)) }
      else if (t === 's') { raw = _pdmy(w) || (w || String(v).trim()) }
      else { raw = w || String(v).trim() }
      return raw === '' || raw == null ? null : raw
    })
  })

  var hi = 0
  if (autoHeader) {
    for (var i = 0; i < Math.min(10, processed.length); i++) {
      if (processed[i] && processed[i].some(function(x) { return String(x || '').toLowerCase().includes('order') })) {
        hi = i; break
      }
    }
  }

  var rh = processed[hi] || [], hc = {}
  var headers = rh.map(function(h) {
    if (!h) return h
    var k = String(h)
    if (hc[k] === undefined) { hc[k] = 0; return k } else { hc[k]++; return k + '.' + hc[k] }
  })

  return processed.slice(hi + 1).map(function(row) {
    var o = {}
    headers.forEach(function(h, i) {
      if (!h) return
      var val = row[i]
      o[String(h)] = (val === null || val === 'NaN' || val === 'nan') ? null : val
    })
    return o
  }).filter(function(r) { return Object.values(r).some(function(v) { return v !== null }) })
}

self.postMessage({ cmd: 'ready' })

self.onmessage = function(e) {
  var msg = e.data
  if (msg.cmd === 'process') {
    try {
      var records = _processGrid(msg.grid, msg.autoHeader)
      self.postMessage({ cmd: 'done', id: msg.id, records: records })
    } catch (err) {
      self.postMessage({ cmd: 'error', id: msg.id, message: String(err) })
    }
  }
}
