# QA Record — Local Implementation

Date: 25 October 2026  
Environment: local production artifact served over HTTP

## Automated checks

- PHP syntax: passed for blog, public-artifact, and site-check scripts.
- JavaScript syntax: passed for `assets/js/showcase.js`.
- CSS syntax: passed with csstree validator.
- Blog generation: 25 articles generated.
- Public artifact: 76 allowlisted files; private/source paths excluded.
- Internal references: 202 local references verified.
- CSP: inline JSON-LD hash verified against generated response policy.
- AI policy: `Google-Extended` opt-out present; public `llms.txt` absent.
- Security contact: `/.well-known/security.txt` present with future expiry.

## Browser checks

- Chromium console/page errors: none.
- Viewports checked: 320, 390, 768, 1024, and 1440px.
- Horizontal overflow: none at tested viewports.
- Homepage and representative article: exactly one `h1`.
- Mobile menu: open, Escape close, and state reset passed.
- Work archive: open, tab switch, native Escape close, and focus workflow passed.
- Reduced-motion layout: passed.
- Desktop/mobile homepage and writing-index screenshots reviewed.

## Lighthouse mobile

| Category | Score |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

- LCP: 1.9s
- CLS: 0
- Total Blocking Time: 0ms

These are local synthetic results and do not replace post-deployment field monitoring.

## Remaining production gates

- Configure a header-capable CDN/edge or static host so generated `_headers` rules are active in HTTP responses; GitHub Pages alone currently serves only the meta-CSP fallback.
- Verify GitHub/domain MFA, custom-domain verification, registrar lock, auto-renew, and DNSSEC in their respective account dashboards.
- Run production header, TLS, analytics, and crawler verification after deployment.
- Confirm the intended production branch before merging or deploying; the existing workflow trigger remains `old`.
