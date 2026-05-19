# Disclaimer

**Read this before using onofficejs.**

## Unofficial — not affiliated with onOffice

**onofficejs** is an **unofficial**, community-maintained JavaScript/TypeScript client library.

It is **not** created, affiliated with, endorsed by, or supported by **onOffice GmbH** (formerly onOffice Software AG) or any of its subsidiaries.

- For the **official** PHP SDK, see [github.com/onOfficeGmbH/sdk](https://github.com/onOfficeGmbH/sdk).
- For **official API support**, contact [apisupport@onoffice.de](mailto:apisupport@onoffice.de) or use the [onOffice API documentation](https://apidoc.onoffice.de/).

**onOffice** and **onOffice enterprise** are trademarks of onOffice GmbH. This project uses those names only to describe compatibility with the onOffice API (nominative fair use). No trademark ownership is claimed.

## What this project is

onofficejs is a **thin HTTP client wrapper** around the publicly documented onOffice JSON API. It:

- Signs requests (HMAC v2) the same way described in [onOffice API docs](https://apidoc.onoffice.de/)
- Sends JSON payloads to `api.onoffice.de`
- Parses JSON responses

It does **not** include onOffice software, data, logos, or proprietary code.

## Legal basis for building a client

Based on publicly available information:

1. **Custom clients are explicitly allowed.** The onOffice API documentation states that for production use they recommend their PHP SDK *or* **“your own implementation in other languages”** ([First steps / API connection](https://apidoc.onoffice.de/erste-schritte/)).

2. **The official PHP SDK is MIT-licensed.** That license permits studying behavior and building compatible clients. **This repository does not copy the PHP SDK source code** — it is an independent implementation written from scratch, validated against public API documentation and published test vectors.

3. **API access is governed by your onOffice contract.** The onOffice API is a **paid enterprise module**. You must:
   - Hold a valid onOffice enterprise license with API access
   - Create your own API user, token, and secret
   - Comply with onOffice’s terms, data-protection rules, and rate/usage policies that apply to your account

   This library does not grant API access and cannot bypass onOffice licensing.

4. **This library’s license (MIT)** applies only to **onofficejs source code** in this repository — not to onOffice API data, services, or trademarks.

## No warranty

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND. See [LICENSE](./LICENSE).

The authors are not responsible for:

- API outages, breaking changes, or deprecations by onOffice
- Data loss, compliance violations, or misuse of API credentials
- Disputes between you and onOffice GmbH

## Your responsibilities

When using onofficejs you agree to:

- Keep API tokens and secrets confidential
- Respect GDPR and applicable data-protection law when processing address/estate data
- Follow onOffice API documentation and any terms in your onOffice customer agreement
- Not misrepresent this library as an official onOffice product

## Questions about onOffice terms

This project **cannot** provide legal advice. For questions about:

- **API licensing / enterprise module** → your onOffice account manager or [apidoc.onoffice.de](https://apidoc.onoffice.de/)
- **This open-source library** → [GitHub Issues](https://github.com/Felixfalk26/onofficejs/issues)

---

*Last updated: 2026-05-19*
