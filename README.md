# Proof Pocket PWA v0.2 — improved prototype

A phone-friendly Progressive Web App prototype for Proof Pocket. This release improves data portability and makes savings labels more honest. It is still a prototype, not a finished or audited commercial service.

## Improved in v0.2
- Receipt photo selection/camera input and best-effort browser OCR via Tesseract.js; review and correct all extracted fields. OCR requires internet access to load the library/language data.
- Clear savings labels: entered savings are not called independently verified. A user may mark that they personally confirmed a saving, but the app does not verify it independently.
- Export and import a JSON backup to manually move receipts between browsers/devices. Transfer the export privately and keep it secure: it may contain purchase details and receipt photos. Import supports merging new receipts or replacing the current set.
- Duplicate receipt warning based on shop, date and total.
- Delete individual receipts or all data in the current browser, with confirmation.
- Offline app-shell caching and responsive layout.

## Still not included
- **No automatic cloud sync or account system.** Export/import is a manual transfer, not syncing. A secure backend, authentication, access controls, backup/recovery and security testing are required for automatic sync.
- **No independent savings verification.** Retailer price checks, refunds and cashback require reliable retailer/partner APIs, evidence handling and/or agreements. Do not advertise these as automated until they are actually integrated and tested.
- No connected payments, paywall, Stripe, subscriptions, customer billing, or store publication. Payments should only be configured by an eligible adult account holder who accepts the legal and financial obligations.
- No independent security audit or full cross-device/browser test. Do not use sensitive receipts as test data.

## Deploy on GitHub Pages
1. Unzip this folder on your computer.
2. Open your existing GitHub repository and choose **Add file → Upload files**.
3. Upload the contents of this folder, replacing the older app files. Ensure `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, and the `icons` folder are at the repository root.
4. Commit the changes and wait for GitHub Pages to update. On each device, close and reopen the app; if it still shows the old version, fully close the browser/PWA and reload the site to refresh the cached app.
5. Test using dummy receipts first.

## Privacy and data safety
This prototype stores receipt metadata and compressed images in the current browser's local storage. It does not have a Proof Pocket server. Browser data can be lost when site data is cleared, and browser storage limits can be reached. The export file is not encrypted; store and transfer it privately. The OCR script and language data are loaded from a third-party CDN, although recognition is intended to run in the browser. Review the current dependencies and privacy behaviour before public commercial use.

Before a public launch, obtain an appropriate privacy/legal review, create a real privacy policy and support contact, test deletion and recovery, audit security, and confirm applicable UK data-protection requirements.
