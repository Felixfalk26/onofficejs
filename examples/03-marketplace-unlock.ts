/**
 * Marketplace unlock provider example (iframe flow)
 */
import { OnOfficeClient } from '../src/index.js';

const client = new OnOfficeClient({ apiVersion: 'stable' });

const result = await client.marketplace.unlockProvider({
  parameterCacheId: process.env.ONOFFICE_PARAMETER_CACHE_ID ?? '<from iframe url>',
  extendedclaim: process.env.ONOFFICE_EXTENDED_CLAIM ?? '<apiClaim from iframe url>',
});

console.log(JSON.stringify(result.data, null, 2));
