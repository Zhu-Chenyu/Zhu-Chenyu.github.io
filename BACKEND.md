# Backend analytics

This site is still built by Hugo, but `server.js` can serve the generated `public/`
directory and collect basic privacy-preserving page-view analytics.

## Run locally

```bash
npm run build
ADMIN_PASSWORD=replace-this npm start
```

Open `http://localhost:3000/admin/analytics` and sign in with:

- user: `admin` unless `ADMIN_USER` is set
- password: the value of `ADMIN_PASSWORD`

## Data collected

The analytics endpoint records page path, timestamp, referrer without query string,
language, viewport bucket, browser/OS/device category, and a salted hash of the
visitor's IP network prefix. It does not set cookies, request location, store raw
IP addresses, or build a browser fingerprint.

Runtime data is stored in `analytics-data/events.jsonl`, which is ignored by git.

## Deployment notes

Set these environment variables before exposing the server:

```bash
ADMIN_USER=admin
ADMIN_PASSWORD=<long random password>
ANALYTICS_SALT=<long random secret>
PORT=3000
```

If the server runs behind a trusted reverse proxy that sets `X-Forwarded-For`, set
`TRUST_PROXY=1`; otherwise leave it unset.
