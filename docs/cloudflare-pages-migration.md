# Cloudflare Pages transition — CABO Solutions

**Status: staged only. No Cloudflare deployment or domain cutover verified.**

## Website build
- Repository: `CayelaemJ/CABOSOLUTIONS`
- Cloudflare Pages project (proposed): `cabo-solutions-cloudflare`
- Git production branch: `main` after this change is reviewed and merged
- Node version: 22
- Build command: `npm run build`
- Build output: `dist` (Vite)
- Root directory: `/`

The existing `npm start` / `server.mjs` is **not** compatible with Pages
as a long-running server. Cloudflare will serve built React assets directly.

## Transitional backend routing
`functions/api/[[path]].js` proxies only:
- `GET /api/health`
- `POST /api/enquiries`
- `GET /api/admin/enquiries`
- `PATCH /api/admin/enquiries/:id`

The fixed upstream is the existing
`https://cabo-solutions-site.onrender.com` service. It continues to store
enquiries in its current PostgreSQL database and handle Zoho/email notifications.
No credentials, database schema, or historical enquiry records are migrated.
Unexpected API routes, methods and upstream redirects are blocked. Responses
are not cached and no browser cookies are forwarded.

**Important: the transitional API can still experience Render cold starts.**
Static pages will not, but a full zero-sleep migration requires porting the
server-side enquiry/API functionality to Cloudflare Workers + a selected
persistent database, verifying record reconciliation, mail delivery, admin
authorization, distributed rate limiting, and POPIA controls.

The `/zoho-setup` administrator route is intentionally not proxied. Keep
using the existing Render setup endpoint during this stage if needed.

## Blocker to automatic deployment
The first Cloudflare Pages GitHub creation call failed on October 28, 2026 with
Cloudflare error `8000011`: Git installation authorization rejected.
In the Cloudflare dashboard, use Workers & Pages → Create application → Pages
→ Connect to Git to authorize the **Cloudflare Workers and Pages** GitHub app
for `CayelaemJ/CABOSOLUTIONS`. Cloudflare's instructions:
https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/

Do not create a separate Direct Upload project if Git-driven deployments are
desired, because Cloudflare does not let a Direct Upload project become a
Git-integrated project later.

## Release gates before changing traffic or stopping Render
1. Cloudflare GitHub authorization works and the Pages build succeeds.
2. Verify static assets, mobile layout, SPA navigation and HTTPS at the Pages preview URL.
3. Run `node --test tests/cloudflare-pages-proxy.test.mjs`.
4. Test a synthetic enquiry and verify its **actual persisted record** and
   mail provider behavior against the existing backend; do not submit real PII as tests.
5. Verify unauthorized admin calls remain 401, authorized admin access remains
   functional, and rate-limiting behavior at the proxy boundary is reviewed.
6. Review rate-limit fairness: Render's in-process limiter may see Cloudflare
   egress as the peer IP and group multiple visitors into one rate-limit bucket.
   Install a safe, distributed edge limit or replace the backend before broad rollout.
7. Keep the Render service and DNS unchanged until sign-off and rollback is tested.
8. For final cutover, migrate/preserve the full enquiry history and replace the
   transitional proxy with a Cloudflare-native backend after a security review.

This stage is meant to remove cold starts for **website assets**, not falsely
claim that the backend is already Cloudflare-native.

## Cloudflare edge preview deployed — October 28, 2026

Cloudflare Worker script: `cabo-solutions-edge-preview`
Cloudflare account Workers subdomain: `cabo-solutions-za.workers.dev`
Expected preview URL:
`https://cabo-solutions-edge-preview.cabo-solutions-za.workers.dev/`

Cloudflare API confirmed a successful Worker upload, deployment at 100%,
and the `workers.dev` route enabled. The Worker implementation is tracked in
`cloudflare/edge-preview.js` with the synthetic regression tests in
`tests/cloudflare-edge-preview.test.mjs`.

**Independent browser/HTTP smoke testing has not yet succeeded.**
The external URL checker could not access this new workers.dev host, so
do not claim live functional validation of the page or enquiry form.

Architecture of this isolated, temporary preview:
- Cloudflare Worker serves an edge-cached version of public site content
  from the existing Render origin (5-minute HTML, 1-day static asset cache).
- Anonymous `GET /` and static assets are allowlisted.
- Only `POST /api/enquiries` and `GET /api/health` are forwarded uncached.
- `/zoho-setup`, `/api/admin/*`, cookies and incoming credentials are not
  available through the preview; admin functions remain on Render.
- This is **not** a fully static Pages deployment and does **not**
  eliminate all Render cold starts. Uncached visits to a new Cloudflare
  location or enquiry requests can still wake Render.

Release caution: this Worker is public but isolated to `workers.dev`.
No application domains or DNS were switched. Treat it as a temporary
compatibility trial; once the Cloudflare Git integration is authorized,
deploy the actual Vite-built `dist` assets onto Pages and migrate
the enquiry backend in a separate, data-preserving step.

## Follow-up smoke checks — October 28, 2026

GitHub Actions verification workflow run
`https://github.com/CayelaemJ/CABOSOLUTIONS/actions/runs/40699318126`
independently retrieved the Cloudflare preview over HTTPS, confirmed HTTP 200
and the CABO Solutions HTML, and passed its Worker/Pages unit tests and Vite
build. This replaces the earlier uncertainty about the **public homepage HTTP**
availability; only frontend rendering and API persistence remained untested.

Desktop/mobile Chromium checks were then added in
`cloudflare/tests/edge-preview.browser.spec.mjs`, with a dedicated remote
Playwright configuration. They are gated to this migration PR's branch and
do not submit real enquiries. Their outcome is not claimed until CI finishes.

This does not change the Pages GitHub authorization blocker or constitute
complete backend/data migration.

## Primary migration path changed: Direct Upload (28 October 2026)

**Do not spend more time repairing the Cloudflare GitHub App.** Cloudflare
already accepted an API-created, standalone **Direct Upload** Pages project:
`cabo-solutions-static` (future `cabo-solutions-static.pages.dev`).

The repository's `.github/workflows/cloudflare-pages-direct-upload.yml`
now builds the real Vite `dist` and saves a downloadable artifact; once a
`CLOUDFLARE_API_TOKEN` GitHub Actions repository secret with **Account >
Cloudflare Pages > Edit** permission is configured, Wrangler can publish the
same artifact automatically on `main` pushes without linking GitHub to
Cloudflare's Git integration. The account ID is a public configuration ID
and is already committed to the workflow, not a secret.

**Important:** At the last API inventory, the Pages project was created but
had no successful deployment. Its `*.pages.dev` hostname is not verified
as an actual running website. The edge Worker remains the only live CABO
Solutions Cloudflare preview. The enquiry API still uses Render.

One-time user-side credential setup is needed:
1. Cloudflare dashboard → My Profile → API Tokens → Create Token.
2. Grant least-privilege Cloudflare Pages Edit for only this account.
3. GitHub repo → Settings → Secrets and variables → Actions → New repository
   secret: `CLOUDFLARE_API_TOKEN`. Never paste the token into chat, commits
   or build logs.
4. Run the workflow from the main branch (after PR approval and merge).

This workaround is fully separate from the Cloudflare Workers and Pages
GitHub *App installation* that was returning error 8000011.

Note: A Direct Upload Pages project cannot later be switched into a
Git-integrated Pages project. That is intentional under this workaround.
