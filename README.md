# SAP PM Excel → JSON / JSONL Converter

> Vue 3 + Vite · Cloudflare Pages · SAP PM RAG Tool

แปลงไฟล์ Excel (IW38 / IW47 / ZPM02 / ZPUCMN / Hours) เป็น JSON, JSONL, หรือ RAG Text Chunks
พร้อมระบบ AI Translation (ไทย → อังกฤษ) และ Merge หลาย Table ตาม Order Number

---

## Features

- **Excel → JSON / JSONL / RAG** — รองรับ `.xlsx`, `.xls`, `.csv`
- **Web Worker** — parse Excel แบบ non-blocking (UI ไม่ค้าง)
- **SAP Table Detection** — รู้จัก IW38, IW47, ZPM02, ZPUCMN, Hours อัตโนมัติ
- **Merge & RAG** — รวมหลาย Table ตาม Order Number → RAG chunks
- **Merge Filter** — กรอง Order ที่ครบ N tables / required tables
- **AI Translation** — Thai → English ด้วย Dictionary + Fuzzy NLP + AI API
- **Auto-Retry** — Exponential backoff (1s → 2s → 4s) + Manual retry button
- **File Split** — แบ่งไฟล์ใหญ่อัตโนมัติ
- **JSONL Fine-tune** — OpenAI Chat format สำหรับ fine-tuning

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | Vue 3 (Composition API + `<script setup>`) |
| Build Tool | Vite 5 |
| Excel Parsing | SheetJS (xlsx) |
| Hosting | Cloudflare Pages |
| Source Control | GitHub |

---

## Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/sap-excel-converter.git
cd sap-excel-converter

# 2. Install
npm install

# 3. Dev server
npm run dev
# → http://localhost:5173

# 4. Build
npm run build
# → /dist
```

---

## Deploy to Cloudflare Pages

### Method 1: Cloudflare Dashboard (Recommended)

1. Push code to GitHub
2. Go to **Cloudflare Dashboard** → **Pages** → **Create a project**
3. Connect your GitHub repository
4. Set build settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `20` |

5. Click **Save and Deploy**

### Method 2: Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=sap-excel-converter
```

---

## GitHub Setup

```bash
# Initialize git
git init
git add .
git commit -m "feat: initial Vue+Vite setup"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sap-excel-converter.git
git branch -M main
git push -u origin main
```

---

## Project Structure

```
sap-excel-converter/
├── src/
│   ├── App.vue                    # Main application (single-page)
│   ├── main.js                    # Vue app entry point
│   ├── styles/
│   │   └── main.css               # Global CSS variables & components
│   ├── composables/
│   │   ├── useWorker.js           # Web Worker management
│   │   └── useTranslate.js        # AI Translation + retry logic
│   ├── utils/
│   │   ├── excelHelpers.js        # XLSX parsing, date conversion
│   │   ├── tableDetect.js         # SAP table type + RAG formatters
│   │   ├── mergeUtils.js          # Order key normalization + merge filter
│   │   └── translateDict.js       # Thai maintenance dictionary + NLP engine
│   └── workers/
│       └── excelWorker.js         # Web Worker (pure JS, no XLSX)
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── wrangler.toml                  # Cloudflare Pages config
└── package.json
```

---

## AI Translation API

The app uses an OpenAI-compatible Chat Completions API endpoint.

**Default endpoint:** `https://thaillm.setthapong-pasavet.workers.dev/`

You can replace this with:
- Your own Cloudflare Worker
- OpenAI API: `https://api.openai.com/v1/chat/completions`
- Any other OpenAI-compatible endpoint

**Translation pipeline:**
1. **Dictionary pass** — instant, no API call (~500 Thai maintenance terms)
2. **Fuzzy matching** — Levenshtein distance ≥80% similarity
3. **Grammar assembler** — natural English from tagged tokens
4. **AI pass** — remaining texts sent to API in batches
5. **Auto-retry** — exponential backoff on failure
6. **Manual retry** — retry failed batches after completion

---

## Environment Variables

No environment variables required. All settings are configured in the UI.

---

## License

MIT
