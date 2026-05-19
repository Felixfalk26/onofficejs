# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-05-19

### Added

- Unofficial / disclaimer documentation (`DISCLAIMER.md`, `NOTICE`, `docs/LEGAL.md`)
- Prominent trademark and affiliation notices in README and LICENSE

### Changed

- Package description and README now clearly state community/unofficial status
- Removed language implying official onOffice endorsement

## [1.0.0] - 2026-05-19

### Added

- Initial TypeScript/JavaScript SDK release
- Async-first `OnOfficeClient` with PHP SDK parity layer
- HMAC v2 signing verified against official PHP test vectors
- Batch request support (`client.batch()`)
- Resource helpers: estates, addresses, calendar, marketplace, searchCriteria
- Query builders: `filter()`, `sort()`, `paginate()`
- `MemoryCacheAdapter` with TTL and LRU eviction
- Structured error hierarchy
- Transport retries, timeouts, injectable `fetch`
- Dual ESM + CommonJS exports
- Comprehensive docs and examples
