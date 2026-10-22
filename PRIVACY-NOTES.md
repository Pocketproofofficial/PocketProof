# Proof Pocket prototype — privacy notes (v0.2)

This prototype stores receipt fields and compressed receipt images in the browser local storage on the device where it is used. It does not send entries to a Proof Pocket backend; no backend is configured. There is no automatic sync or account system.

The export file includes receipt information and may include receipt images. It is plain JSON and is **not encrypted**. Users should store it securely and transfer it privately. Imports are processed in the browser. Users can delete individual receipts or all records in that browser, but clearing browser data can also remove records.

OCR uses Tesseract.js loaded from a third-party CDN and its language data may also be downloaded. Recognition is intended to run in the browser; verify current dependency behaviour before making production privacy promises. Hosting/CDN providers may process normal technical request data.

Savings amounts are user-entered. A “confirmed by me” label means only that the user marked it so; it is not independent verification by Proof Pocket.

Do not describe this prototype as cloud-backed, end-to-end encrypted, independently verified, or suitable for sensitive receipt data. Before a commercial launch, prepare a reviewed privacy notice, retention/deletion process, data security design, accessibility review, and applicable UK GDPR compliance measures.
