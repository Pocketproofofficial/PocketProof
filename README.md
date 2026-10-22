# Proof Pocket PWA starter

A phone-friendly Progressive Web App prototype for Proof Pocket. It is designed to be deployed as a static site (for example, GitHub Pages or Cloudflare Pages) and installed from the browser on iPhone/Android where supported.

## Included
- Responsive receipt dashboard and search/filter.
- Receipt photo selection/camera input, manual fields, and best-effort browser OCR via Tesseract.js CDN.
- Local-only receipt storage in browser `localStorage`, including a compressed photo, savings tracking, return/warranty marker, delete, and JSON export.
- PWA manifest and service worker for caching the app shell.

## Important limitations
- **This is a prototype, not a finished commercial service.** It has not been security-audited or tested on every device.
- Data is stored only in the current browser on the current device. There is no account, cloud sync, shared backup, database, or recovery if browser data is cleared. Large receipt collections may fill browser storage.
- OCR depends on an internet connection to load Tesseract.js and its language data the first time, and can misread amounts. Review extracted text.
- The app shell can work offline after it has loaded, but OCR requires network access. The external font and OCR library are not bundled.
- No Stripe/payment, £3 subscription, customer billing, authentication, or App Store / Play Store publishing is connected. Do not collect payments from users until these are deliberately implemented and tested.
- No automated reminders, retailer integrations, verified savings calculations, or tax/legal claims are included.

## Deploy using GitHub (no paid domain required)
1. Sign in to GitHub and create a **new repository** named `proof-pocket` (Public is simplest for GitHub Pages; private repo Pages availability depends on plan/settings). Do not upload secrets, API keys, or personal receipts.
2. Extract this ZIP on your computer.
3. Open the new repository and choose **Add file → Upload files**. Upload the *contents* of this folder (so `index.html` is at repository root), then commit.
4. Open **Settings → Pages**. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
5. Wait for GitHub Pages to publish and open the URL shown on the Pages settings screen. It will normally look like `https://YOUR-USERNAME.github.io/proof-pocket/`.
6. Test adding and exporting a dummy receipt before using real data. On iPhone, open the published site in Safari → Share → Add to Home Screen. On Android, open in Chrome and use Install app / Add to Home screen if offered.

GitHub Pages is suitable for a static prototype. If you later need sign-in, private cloud receipt storage and payments, we will add and configure backend services. Never put private service keys in browser JavaScript.

## Local test
A service worker requires localhost or HTTPS; simply opening the file directly will not test install/offline behaviour. If Python is installed, from this folder run `python -m http.server 8000`, then visit `http://localhost:8000`.
