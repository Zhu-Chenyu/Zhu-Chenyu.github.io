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

## Collect analytics from GitHub Pages

GitHub Pages cannot run this backend. Deploy `server.js` to a platform that can run
Node, then point the static site at that backend.

Backend environment variables:

```bash
ADMIN_USER=admin
ADMIN_PASSWORD=<long random password>
ANALYTICS_SALT=<long random secret>
ANALYTICS_ALLOWED_ORIGINS=https://Zhu-Chenyu.github.io
ANALYTICS_DATA_DIR=/path/to/persistent/analytics-data
PORT=3000
TRUST_PROXY=1
```

Use persistent storage for `ANALYTICS_DATA_DIR`; otherwise logs may disappear when
the hosting platform restarts or redeploys the service.

After the backend is live, set the frontend endpoint in `config.yaml`:

```yaml
params:
  analytics:
    endpoint: "https://your-backend.example.com/api/analytics"
```

Then rebuild and push the static site:

```bash
npm run build
git add config.yaml public
git commit -m "Point analytics to deployed backend"
git push
```

The dashboard will be available at:

```text
https://your-backend.example.com/admin/analytics
```

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
ANALYTICS_ALLOWED_ORIGINS=https://Zhu-Chenyu.github.io
ANALYTICS_DATA_DIR=analytics-data
PORT=3000
```

If the server runs behind a trusted reverse proxy that sets `X-Forwarded-For`, set
`TRUST_PROXY=1`; otherwise leave it unset.
