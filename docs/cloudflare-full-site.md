# CABO Solutions — full website and enquiry/admin backend on Cloudflare

The actual `CayelaemJ/CABOSOLUTIONS` repository contains a Vite frontend and a Node `server.mjs` backend serving contact forms, authenticated enquiry administration, Zoho/SMTP/Resend notifications and Postgres. The original Cloudflare static preview did **not** migrate the complete enquiry backend.

This branch adds a Cloudflare Container/Worker candidate built from the same source. It retains the existing server, its security middleware and the original Vite UI, rather than proxying API traffic to Render. The new Node runtime disables ad-hoc `CREATE TABLE` operations on incoming requests (`CABO_DISABLE_RUNTIME_DDL=true`) and verifies the existing `public.cabo_enquiries` table before accessing records.

The Worker release is disabled until the Postgres secret, admin API token, rate-limit evaluation and real notification tests have passed; it requires a CABO-owned canonical hostname. Do not reuse secrets from NewChanges or Learning Hub. Zoho setup is disabled until expressly approved. This is a source-controlled migration candidate, not a live Container or production traffic cutover. Workers Paid and a Docker image build are required.

Verified: two unit gate tests and Wrangler dry-run Worker bundling with container rollout disabled. CircleCI's branch-scoped job checks the full real Vite site and deployable backend Worker bundle; it does not perform production deployment.

Remaining: separate DB role and schema ownership audit, credentialed admin API E2E, email provider delivery, global rate limiting (current rate limiter is process-local), enquiry form browser checks, origin/CSRF review, TLS and production DNS, standby/rollback verification. Keep the current production and Render services untouched.
