# ADR-0002: Serve Umami analytics first-party through a Nitro proxy

**Status:** Accepted
**Date:** 2026-09-30 (recorded 2026-10-02)
**Deciders:** BogDev maintainer

## Context

The blog measured visits with Plausible. It moved to a self-hosted Umami (#183) to keep visitor data on its own server. Analytics scripts and endpoints on a separate analytics domain are blocked by most content blockers, which undercounts a technical audience heavily. The privacy page promises no cookies without a session and no third-party trackers.

## Decision

The tracker (`/bd.js`) and its collect endpoint (`/api/bd`) are served from the site itself. `server/middleware/umami.ts` proxies exactly those two paths to Umami's internal address (`NUXT_UMAMI_URL`), passing the visitor IP in `x-real-ip` so Umami can resolve the country. The tracker only reports visits whose host matches `NUXT_PUBLIC_SITE_URL`, so local and preview builds send nothing. Outbound link clicks are an `outbound-link` event.

## Options considered

### A. First-party proxy in Nitro (chosen)
| Dimension | Assessment |
| --- | --- |
| Complexity | Low: one middleware, two exact paths |
| Cost | A few requests through the frontend container |
| Privacy | Data stays on the server; no third-party domain |
| Accuracy | Not caught by domain-based blockers |

### B. Load the tracker from the Umami domain
**Pros:** no code in the frontend. **Cons:** blocked by most blockers; exposes a separate analytics domain.

### C. Keep Plausible (hosted)
**Pros:** no infrastructure. **Cons:** data on a third party, paid, and the same blocking problem.

### D. Server-side analytics only (logs)
**Pros:** nothing in the browser. **Cons:** no client events (outbound clicks), harder to separate bots, more custom work.

## Trade-offs

Counting visits more accurately means routing tracker traffic through the frontend container and trusting `X-Forwarded-For` for the visitor IP. The paths are matched exactly, so the proxy cannot be used to reach anything else on Umami.

## Consequences

- The visitor IP is only correct while Traefik rewrites `X-Forwarded-For`; a CDN in front would require reading its own client-IP header. The comment and newsletter rate limits depend on the same value.
- `/bd.js` and `/api/bd` must match Umami's `TRACKER_SCRIPT_NAME` and `COLLECT_API_ENDPOINT`.
- The Content Security Policy needs no analytics domain: everything is `'self'`.
