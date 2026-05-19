# Migration from PHP SDK

> **Note:** `onofficejs` is an **unofficial** community client. The **official** SDK is [`onoffice/sdk`](https://github.com/onOfficeGmbH/sdk) (PHP, maintained by onOffice GmbH). See [DISCLAIMER.md](../DISCLAIMER.md).

Side-by-side guide for moving from the official PHP SDK to this unofficial JavaScript/TypeScript wrapper.

## Install

```diff
- composer require onoffice/sdk:^0.2.0
+ npm install onofficejs
```

## Client creation

```php
$sdk = new onOfficeSDK();
$sdk->setApiVersion('stable');
```

```typescript
import { OnOfficeClient } from 'onofficejs';

const client = new OnOfficeClient({ apiVersion: 'stable' });
// or: import { onOfficeSDK } from 'onofficejs';
```

## Constants

| PHP | JavaScript |
|---|---|
| `onOfficeSDK::ACTION_ID_READ` | `ActionId.Read` |
| `onOfficeSDK::ACTION_ID_CREATE` | `ActionId.Create` |
| `onOfficeSDK::MODULE_ESTATE` | `Module.Estate` |
| `onOfficeSDK::RELATION_TYPE_BUYER` | `RelationType.Buyer` |

## Estate read

```php
$handle = $sdk->callGeneric(onOfficeSDK::ACTION_ID_READ, 'estate', $params);
$sdk->sendRequests($token, $secret);
$data = $sdk->getResponseArray($handle);
```

```typescript
// Modern
const { data } = await client.estates.read(params);

// Parity
const handle = client.callGeneric(ActionId.Read, Module.Estate, params);
await client.sendRequests(token, secret);
const data = client.getResponse(handle);
```

## Search

```php
$handle = $sdk->call(onOfficeSDK::ACTION_ID_GET, 'estate', '', 'search', ['input' => 'Aachen']);
```

```typescript
await client.estates.search('Aachen');
// or
await client.callAsync(ActionId.Get, 'estate', null, 'search', { input: 'Aachen' });
```

## cURL options → fetch options

```php
$sdk->setApiCurlOptions([CURLOPT_SSL_VERIFYPEER => false]);
```

```typescript
client.setFetchOptions({
  // use Node undici dispatcher / agent for TLS options
});
```

## Errors

PHP stores API errors in `$sdk->getErrors()`. JS throws `OnOfficeApiError` by default:

```typescript
const client = new OnOfficeClient({ throwOnApiError: false });
// then inspect client.getErrors()
```

## Behavioral differences (improvements)

| PHP | JS |
|---|---|
| Sync blocking | Async non-blocking |
| Handle consumed on get | Re-readable by default |
| Silent API errors | Throws by default |
| cURL required | Native fetch |
| No types | Full TypeScript |
