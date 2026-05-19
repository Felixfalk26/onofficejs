# Legal FAQ

This document supplements [DISCLAIMER.md](../DISCLAIMER.md). It is informational, **not legal advice**.

## Is it legal to build this library?

**Building a third-party API client is explicitly contemplated by onOffice.** Their API documentation recommends using the official PHP SDK *or* **your own implementation in other languages** ([source](https://apidoc.onoffice.de/erste-schritte/#Using_the_API_with_the_SDK_Software_Development_Kit)).

Public API documentation also describes how to call the API **without the SDK** via cURL, including HMAC calculation examples.

## Did we copy onOffice’s code?

**No.** All code in this repository was written from scratch in TypeScript.

- We did **not** port, translate, or redistribute the official PHP SDK.
- We implemented the **publicly documented** JSON + HMAC v2 protocol.
- Test vectors were used to verify compatibility — a standard engineering practice.

The official PHP SDK ([MIT license](https://github.com/onOfficeGmbH/sdk/blob/master/LICENSE)) allows reuse of the SDK itself, but we chose an independent implementation to avoid licensing entanglement and to target JavaScript runtimes.

## Can I use the name “onofficejs”?

The package name indicates **what API it connects to** (nominative use). We:

- Mark the project as **unofficial** in README, npm description, and docs
- Do **not** use onOffice logos or brand assets
- Do **not** claim endorsement by onOffice GmbH

If onOffice GmbH requests a name change, we will comply promptly.

## What license applies?

| Component | License / terms |
|---|---|
| **onofficejs source code** | [MIT](../LICENSE) — this repo |
| **onOffice API service** | Your onOffice customer / API module agreement |
| **Data returned by API** | Your responsibility (GDPR, retention, etc.) |
| **onOffice trademarks** | Owned by onOffice GmbH — not licensed by this project |

## Do I need onOffice permission to use this library?

You need:

1. A valid **onOffice enterprise** account with the **paid API module**
2. Your own **API user, token, and secret** created in onOffice enterprise
3. Compliance with **onOffice’s terms** that apply to your API usage and data

This npm package is just a tool — it does not substitute for an onOffice license.

## Who provides support?

| Topic | Contact |
|---|---|
| onOffice API errors, rights, billing | [apisupport@onoffice.de](mailto:apisupport@onoffice.de) |
| Official PHP SDK | [onOfficeGmbH/sdk](https://github.com/onOfficeGmbH/sdk) |
| This unofficial JS library | [GitHub Issues](https://github.com/Felixfalk26/onofficejs/issues) |

## What if onOffice changes the API?

onOffice may change endpoints, fields, or authentication without notice. This community library may lag behind. Monitor [apidoc.onoffice.de](https://apidoc.onoffice.de/) and pin API version (`stable` vs `latest`) in production.

## Recommended attribution in your app

If you ship a product using onofficejs, consider adding to your about/docs page:

> Uses the onOffice API. onOffice is a trademark of onOffice GmbH. This product is not affiliated with or endorsed by onOffice GmbH.
