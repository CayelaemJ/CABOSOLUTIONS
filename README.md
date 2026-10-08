# CABO Solutions website

React/Vite company website with Three.js visuals, responsive service and portfolio showcases, and a production Node.js enquiry API.

## Run locally

Use Node.js 22 or newer.

```bash
npm install
npm run dev
```

For the production stack, configure `DATABASE_URL` and run:

```bash
npm run build
npm start
```

The production server binds to `0.0.0.0:$PORT` and serves `dist` plus the enquiry API.

## Railway

Connect the repo to a Railway service. Use build command `npm run build`, start command `npm start`, healthcheck `/api/health`. Attach a Railway PostgreSQL service and configure `DATABASE_URL` as a reference to the database service. Never commit secrets. The enquiries table is initialized on the first request. Do not use the Vite preview server in production.

Optional notification settings: `RESEND_API_KEY`, `MAIL_FROM` (verified sender/domain), `NOTIFY_EMAIL` (CABO inbox), `ADMIN_API_TOKEN` (long random token).

The API **saves** an enquiry to PostgreSQL before acknowledging it. Email notification is optional and does not replace storage. If no database is configured, the form shows a failure and directs visitors to email rather than showing false success.

## Enquiry API

- `POST /api/enquiries` accepts `{name,email,org,service,message}`, validates and stores the enquiry.
- `GET /api/admin/enquiries` returns the last 200 records with `Authorization: Bearer <ADMIN_API_TOKEN>`.
- `PATCH /api/admin/enquiries/:id` accepts `{status:"new"|"contacted"|"in_progress"|"closed"}` with the same token.
- `GET /api/health` checks server availability and indicates whether the DB is configured.

**Security and launch:** Configure a sufficiently random admin API token, database backups, a verified email domain, rate limiting at the edge, and a privacy/POPIA notice before public promotion. The admin endpoints are API-only; a dedicated authenticated CRM interface and user email acknowledgements are future work. These API endpoints do not yet provide complete spam protection.

## Work showcase

The interactive showcase currently shows illustrative concepts, not verified completed client projects. Replace or extend these with consented case studies, screenshots, measurable outcomes, and client approval.
