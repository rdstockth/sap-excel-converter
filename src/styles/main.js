:root {
  --bg:        #F0EDE8;
  --surface:   #FFFFFF;
  --card:      #FFFFFF;
  --card2:     #FAFAF8;
  --border:    #E2DDD6;
  --border2:   #CCC8BF;
  --accent:    #2563EB;
  --accent-lt: #EEF3FE;
  --accent2:   #7C3AED;
  --accent2-lt:#F3EFFE;
  --jsonl:     #0891B2;
  --jsonl-lt:  #ECFBFD;
  --success:   #16A34A;
  --success-lt:#F0FDF4;
  --danger:    #DC2626;
  --danger-lt: #FEF2F2;
  --warn:      #D97706;
  --warn-lt:   #FFFBEB;
  --text:      #1A1714;
  --text2:     #44403C;
  --sub:       #78716C;
  --sub2:      #A8A29E;
  --ink:       #18130F;
  --radius-card: 18px;
  --radius-btn: 10px;
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 12px 36px rgba(0,0,0,0.06);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', 'Noto Sans Thai', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed; inset: 0;
  background-image:
    radial-gradient(ellipse 80% 60% at 10% 0%, rgba(37,99,235,0.07) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 90% 100%, rgba(124,58,237,0.06) 0%, transparent 55%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(8,145,178,0.03) 0%, transparent 60%);
  pointer-events: none; z-index: 0;
}

body::after {
  content: '';
  position: fixed; inset: 0;
  background-image: linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none; z-index: 0; opacity: 0.5;
}

.container { max-width: 1140px; margin: 0 auto; padding: 0 28px; position: relative; z-index: 1; }

/* ── Cards ── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card); overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow .3s, border-color .3s;
}
.card:hover { box-shadow: var(--shadow-md); border-color: var(--border2); }

.card-header {
  padding: 14px 20px 13px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(180deg, #FDFCFB 0%, var(--card2) 100%);
}
.card-header h2 {
  font-size: 13px; font-weight: 600; color: var(--text2);
  font-family: 'Syne', sans-serif; letter-spacing: -0.1px;
}
.card-icon { font-size: 15px; }
.pill {
  margin-left: auto;
  background: var(--bg); border: 1px solid var(--border2);
  color: var(--sub); font-size: 11px; padding: 3px 10px;
  border-radius: 20px; font-family: 'DM Mono', monospace;
}

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--radius-btn);
  font-size: 12.5px; font-weight: 600;
  cursor: pointer; border: 1px solid transparent;
  transition: all .2s cubic-bezier(.4,0,.2,1);
  font-family: 'DM Sans', 'Noto Sans Thai', sans-serif;
  letter-spacing: -0.1px; position: relative; overflow: hidden;
}
.btn:disabled { opacity: .45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.btn-primary {
  background: linear-gradient(135deg, #2563EB 0%, #1D55D4 100%);
  color: white; border-color: #2563EB;
  box-shadow: 0 2px 4px rgba(37,99,235,0.25), 0 4px 12px rgba(37,99,235,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1D55D4 0%, #1746BB 100%);
  box-shadow: 0 4px 8px rgba(37,99,235,0.35), 0 8px 20px rgba(37,99,235,0.25);
  transform: translateY(-2px);
}

.btn-jsonl {
  background: linear-gradient(135deg, #0891B2 0%, #0779A0 100%);
  color: white; border-color: #0891B2;
  box-shadow: 0 2px 4px rgba(8,145,178,0.25), 0 4px 12px rgba(8,145,178,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
}
.btn-jsonl:hover:not(:disabled) {
  background: linear-gradient(135deg, #0779A0 0%, #066890 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(8,145,178,0.35), 0 8px 20px rgba(8,145,178,0.25);
}

.btn-both {
  background: linear-gradient(135deg, #7C3AED 0%, #6D2FDE 100%);
  color: white; border-color: #7C3AED;
  box-shadow: 0 2px 4px rgba(124,58,237,0.25), 0 4px 12px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
}
.btn-both:hover:not(:disabled) {
  background: linear-gradient(135deg, #6D2FDE 0%, #5E23CF 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(124,58,237,0.35), 0 8px 20px rgba(124,58,237,0.25);
}

.btn-ghost {
  background: var(--surface); color: var(--text2);
  border-color: var(--border2);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.btn-ghost:hover:not(:disabled) {
  border-color: var(--border2); background: var(--card2);
  color: var(--ink); box-shadow: 0 2px 6px rgba(0,0,0,0.09);
  transform: translateY(-1px);
}

.btn-danger-ghost {
  background: var(--surface); color: var(--sub);
  border-color: var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.btn-danger-ghost:hover:not(:disabled) { background: var(--danger-lt); color: var(--danger); border-color: #FECACA; transform: translateY(-1px); }

.btn-merge {
  background: linear-gradient(135deg, #D97706 0%, #C86D00 100%);
  color: white; border-color: #D97706;
  box-shadow: 0 2px 4px rgba(217,119,6,0.25), 0 4px 12px rgba(217,119,6,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
}
.btn-merge:hover:not(:disabled) {
  background: linear-gradient(135deg, #C86D00 0%, #B45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(217,119,6,0.35), 0 8px 20px rgba(217,119,6,0.25);
}
.btn-merge:disabled { opacity: .5; cursor: not-allowed; transform: none; }

/* ── Toggle ── */
.toggle { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-track {
  position: absolute; inset: 0;
  background: var(--border2); border-radius: 99px;
  transition: background .25s; cursor: pointer;
}
.toggle-track::after {
  content: ''; position: absolute;
  left: 3px; top: 3px; width: 16px; height: 16px;
  border-radius: 50%; background: white;
  transition: transform .25s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle input:checked + .toggle-track { background: var(--accent); }
.toggle input:checked + .toggle-track::after { transform: translateX(18px); }

/* ── Input / Select ── */
.input-field {
  width: 100%; padding: 8px 12px;
  background: var(--bg); border: 1px solid var(--border2);
  border-radius: 8px; font-size: 12.5px; color: var(--ink);
  font-family: 'DM Sans', 'Noto Sans Thai', sans-serif;
  transition: border-color .2s, box-shadow .2s;
  outline: none;
}
.input-field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

select {
  padding: 5px 10px; border-radius: 7px; font-size: 11.5px;
  border: 1px solid var(--border2); background: var(--bg);
  color: var(--text2); font-family: 'DM Sans', sans-serif;
  cursor: pointer; outline: none;
}
select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

textarea {
  width: 100%; padding: 8px 10px;
  background: var(--bg); border: 1px solid var(--border2);
  border-radius: 8px; font-size: 12px; color: var(--ink);
  font-family: 'DM Mono', monospace; resize: vertical;
  transition: border-color .2s; outline: none;
}
textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

/* ── Settings body ── */
.settings-body { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 12px; }
.setting-row { display: flex; align-items: center; gap: 12px; justify-content: space-between; }
.setting-label { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.setting-sub { font-size: 11px; color: var(--sub2); margin-top: 2px; }
.section-label {
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--sub);
  font-family: 'Syne', sans-serif;
}
.divider { height: 1px; background: var(--border); margin: 2px 0; }

/* ── Info boxes ── */
.info-box {
  padding: 10px 13px; border-radius: 10px;
  font-size: 11.5px; line-height: 1.75; color: var(--text2);
}
.info-box code {
  background: rgba(0,0,0,0.06); padding: 1px 5px;
  border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10.5px;
}
.info-box.blue  { background: var(--accent-lt);  border: 1px solid #BFDBFE; }
.info-box.purple{ background: var(--accent2-lt); border: 1px solid #DDD6FE; }
.info-box.cyan  { background: var(--jsonl-lt);   border: 1px solid #BAE6FD; }

/* ── Drop-down list ── */
.download-list { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 8px; }
.dl-item {
  display: flex; align-items: center; gap: 9px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 10px; padding: 9px 13px;
  transition: border-color .2s, background .2s;
}
.dl-item:hover { border-color: var(--border2); background: #EDE9E3; }
.dl-item a {
  margin-left: auto; flex-shrink: 0;
  background: var(--accent-lt); color: var(--accent);
  border: 1px solid #BFDBFE; padding: 4px 10px;
  border-radius: 7px; font-size: 11px; font-weight: 600;
  text-decoration: none; transition: all .15s;
  font-family: 'DM Sans', sans-serif;
}
.dl-item a:hover { background: var(--accent); color: white; border-color: var(--accent); }
.btn-dl-all {
  margin-left: auto; background: var(--accent-lt); color: var(--accent);
  border: 1px solid #BFDBFE; padding: 5px 12px; border-radius: 8px;
  font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all .15s;
  font-family: 'DM Sans', sans-serif;
}
.btn-dl-all:hover { background: var(--accent); color: white; }

/* ── Preview ── */
.preview-body { padding: 14px 16px; }
.preview-body pre {
  font-family: 'DM Mono', monospace; font-size: 10.5px;
  background: var(--bg); padding: 12px; border-radius: 8px;
  border: 1px solid var(--border); overflow-x: auto;
  white-space: pre-wrap; word-break: break-word;
  max-height: 260px; overflow-y: auto;
  color: var(--text);
}
.empty-state { padding: 36px 24px; text-align: center; color: var(--sub2); font-size: 13px; }
.empty-icon { font-size: 32px; margin-bottom: 8px; }

/* ── Stats ── */
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; }
.stat { text-align: center; padding: 20px 12px; background: var(--card2); border-right: 1px solid var(--border); }
.stat:last-child { border-right: none; }
.stat-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; line-height: 1.1; letter-spacing: -1px; }
.stat-value.blue   { color: var(--accent); }
.stat-value.purple { color: var(--accent2); }
.stat-value.green  { color: var(--success); }
.stat-label { font-size: 10.5px; color: var(--sub); margin-top: 4px; font-weight: 500; }

/* ── Debug ── */
.debug-entry {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 9px; padding: 10px 12px; margin-bottom: 8px;
}

/* ── Field check buttons ── */
.field-check-btn {
  padding: 3px 9px; border-radius: 6px; font-size: 10.5px; font-weight: 500;
  cursor: pointer; border: 1px solid var(--border2);
  background: var(--bg); color: var(--sub);
  font-family: 'DM Mono', monospace; transition: all .15s;
}
.field-check-btn.on {
  background: var(--accent2-lt); color: var(--accent2);
  border-color: #C4B5FD; font-weight: 600;
}
.field-check-btn:hover:not(.on) { border-color: var(--accent2); color: var(--accent2); }

/* ── Min table / req table buttons ── */
.min-table-btn, .req-table-btn {
  padding: 4px 10px; border-radius: 7px; font-size: 11px; font-weight: 500;
  cursor: pointer; border: 1px solid var(--border2);
  background: var(--bg); color: var(--sub);
  font-family: 'DM Mono', monospace; transition: all .15s;
  text-align: center; line-height: 1.5;
}
.min-table-btn.active { background: var(--warn-lt); color: var(--warn); border-color: #FDE68A; font-weight: 600; }
.req-table-btn.active { background: var(--accent-lt); color: var(--accent); border-color: #BFDBFE; font-weight: 600; }
.min-table-btn:hover:not(.active), .req-table-btn:hover:not(.active) { border-color: var(--border2); color: var(--ink); background: white; }

/* ── Translate progress ── */
.translate-progress {
  background: var(--accent2-lt); border: 1px solid #DDD6FE;
  border-radius: 10px; padding: 11px 13px;
  font-size: 11px; color: var(--text2); line-height: 1.8;
  font-family: 'DM Mono', monospace;
}
.tprog-bar-bg {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 99px; height: 6px; overflow: hidden; margin: 6px 0 4px;
}
.tprog-bar {
  height: 100%; background: linear-gradient(90deg, #7C3AED, #2563EB);
  border-radius: 99px; transition: width .4s ease;
}
.retry-attempt-tag {
  display: inline-block; background: #FEF2F2; border: 1px solid #FECACA;
  color: var(--danger); font-size: 9.5px; font-weight: 700;
  padding: 1px 6px; border-radius: 4px; margin-left: 4px;
  font-family: 'DM Mono', monospace; vertical-align: middle;
  animation: pulse-retry .6s ease-in-out infinite alternate;
}
@keyframes pulse-retry { from { opacity: 1; } to { opacity: 0.5; } }

.retry-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--danger-lt); border: 1px solid #FECACA;
  color: var(--danger); font-size: 10px; font-weight: 700;
  padding: 2px 8px; border-radius: 5px; font-family: 'DM Mono', monospace;
}
.btn-retry {
  display: flex; align-items: center; gap: 5px; justify-content: center;
  background: linear-gradient(135deg, #DC2626 0%, #C21A1A 100%);
  color: white; border: none; border-radius: 8px;
  font-size: 11.5px; font-weight: 600; padding: 7px 14px;
  cursor: pointer; transition: all .2s; margin-top: 8px; width: 100%;
  font-family: 'DM Sans', 'Noto Sans Thai', sans-serif;
  box-shadow: 0 2px 6px rgba(220,38,38,0.3);
}
.btn-retry:hover:not(:disabled) { background: linear-gradient(135deg, #C21A1A 0%, #A81515 100%); transform: translateY(-1px); }
.btn-retry:disabled { opacity: .45; cursor: not-allowed; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(80px);
  background: var(--ink); color: white; padding: 11px 22px;
  border-radius: 12px; font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.15);
  z-index: 9999; transition: transform .35s cubic-bezier(.34,1.56,.64,1), opacity .35s;
  opacity: 0; white-space: nowrap; max-width: 90vw;
  font-family: 'DM Sans', 'Noto Sans Thai', sans-serif;
}
.toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

/* ── Progress bar ── */
.progress-wrap { margin: 0 18px 16px; }
.progress-bar-bg {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 99px; height: 8px; overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
}
.progress-bar {
  height: 100%; border-radius: 99px; width: 0%;
  background: linear-gradient(90deg, var(--accent), #6D28D9);
  transition: width .4s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 0 8px rgba(37,99,235,0.4);
}
.progress-label { font-size: 11px; color: var(--sub); margin-top: 6px; font-family: 'DM Mono', monospace; }

/* ── File list ── */
.file-list { padding: 0 18px 14px; display: flex; flex-direction: column; gap: 7px; }
.file-item {
  display: flex; align-items: center; gap: 11px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 11px; padding: 10px 14px;
  animation: slideIn .2s cubic-bezier(.34,1.56,.64,1);
  transition: border-color .2s, background .2s, box-shadow .2s;
}
@keyframes slideIn { from{opacity:0;transform:translateY(-8px) scale(0.98)} to{opacity:1;transform:none} }
.file-item:hover { border-color: var(--border2); background: #EDE9E3; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.file-icon { font-size: 22px; flex-shrink: 0; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--ink); }
.file-meta { font-size: 10.5px; color: var(--sub2); font-family: 'DM Mono', monospace; margin-top: 2px; }
.file-status { font-size: 11.5px; font-weight: 600; white-space: nowrap; }
.file-remove {
  background: none; border: none; color: var(--sub2); cursor: pointer;
  font-size: 14px; padding: 4px 7px; border-radius: 6px; transition: all .15s; line-height: 1;
}
.file-remove:hover { background: var(--danger-lt); color: var(--danger); transform: scale(1.1); }

/* ── Drop zone ── */
.drop-zone {
  margin: 18px; border-radius: 14px;
  border: 2px dashed var(--border2);
  padding: 44px 24px;
  text-align: center; cursor: pointer;
  transition: all .3s cubic-bezier(.4,0,.2,1);
  background: linear-gradient(145deg, #FAFAF8, var(--bg));
  position: relative; overflow: hidden;
}
.drop-zone.drag-over { border-color: var(--accent); border-style: solid; transform: scale(1.005); }
.drop-icon {
  font-size: 42px; margin-bottom: 12px; display: block;
  animation: float 3.5s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12));
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.drop-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 5px; font-family: 'Syne', sans-serif; }
.drop-sub { font-size: 12.5px; color: var(--sub); }
.drop-tags { display: flex; gap: 6px; justify-content: center; margin-top: 14px; }
.tag {
  background: rgba(255,255,255,0.9); border: 1px solid var(--border2);
  padding: 4px 10px; border-radius: 7px;
  font-size: 11px; font-family: 'DM Mono', monospace; color: var(--accent);
  font-weight: 500;
}

/* ── Layout ── */
.main-grid {
  display: grid; grid-template-columns: 1fr 368px; gap: 22px;
  padding: 30px 0 56px; align-items: start;
}
@media (max-width: 800px) { .main-grid { grid-template-columns: 1fr; } }
.left-col { display: flex; flex-direction: column; gap: 18px; }
.right-col { display: flex; flex-direction: column; gap: 18px; }

.btn-row { display: flex; gap: 8px; padding: 0 18px 18px; flex-wrap: wrap; }

/* ── Worker status (header) ── */
#workerStatus {
  font-size: 10.5px; font-family: 'DM Mono', monospace;
  padding: 4px 10px; border-radius: 8px;
  border: 1px solid var(--border2); background: var(--bg);
  color: var(--sub);
}
#workerStatus.ready { color: var(--success); background: var(--success-lt); border-color: #BBF7D0; }
#workerStatus.busy  { color: var(--warn);    background: var(--warn-lt);    border-color: #FDE68A; }
#workerStatus.error { color: var(--danger);  background: var(--danger-lt);  border-color: #FECACA; }

.api-endpoint-row { display: flex; align-items: center; gap: 6px; }
.api-endpoint-row .input-field { font-size: 11px; padding: 6px 10px; }

#finetuneSystemRow { opacity: 0.45; flex-direction: column; align-items: flex-start; gap: 5px; }
