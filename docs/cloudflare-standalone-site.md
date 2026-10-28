# CABO Solutions: standalone Cloudflare static deployment

## Current staging Worker (28 Oct 2026)
- `https://cabo-solutions-static-preview.cabo-solutions-za.workers.dev/`
- Worker script `cabo-solutions-static-preview` in connected Cloudflare account
- Deployed at 100% on Cloudflare as a `workers.dev` staging URL, no production DNS changes.
- Actual compiled Vite HTML, JS, CSS and public images are gzipped and contained in the Worker, **not fetched from Render** on asset visits.
- Fixed `POST /api/enquiries` and `GET /api/health` still call the existing Render backend; no database, SMTP or Zoho migration occurred.
- `/api/admin/*` and `/zoho-setup` are intentionally inaccessible from this Worker.
- Staging has `X-Robots-Tag: noindex` to avoid duplicate public pages.

## Build provenance
Trusted GitHub workflow `.github/workflows/cloudflare-pages-direct-upload.yml` built static assets from main commit `1c293519a8d711e9f53e0ec5b27de5422221fc9d`, then generated Worker code using `scripts/cloudflare/make-edge-asset-bundle.mjs` and `scripts/cloudflare/build-site-worker.mjs`.
`cf-cabo-build-artifacts/generated/cabo-site.worker.js` is the compiled browser-only bundle with no backend secrets; it was uploaded through connected Cloudflare API without the broken GitHub App.
- No token stored in GitHub repository source.
- Enquiry API still depends on Render free-tier wake-up time; the **public website static load no longer does**.
- Worker packaging and API allowlist tests passed in CI on PR #25.
- The independent desktop/mobile and actual CDN-asset smoke suite is in `.github/workflows/cloudflare-standalone-live-check.yml`, which must pass before cutover.

## Migration release conditions
1. Verify desktop, mobile, form UX, navigation, browser console and all images on the staging Worker.
2. Send only synthetic enquiry test data and verify actual record persistence, email and rate-limit behavior.
3. Plan cloud-native authenticated admin/backend and data migration, preserving all existing records.
4. Define a verified cutover and rollback procedure for the company domain.
5. Keep the original Render service until backend transition or explicit approval.

**NewChanges is explicitly excluded and remains on Render.**
