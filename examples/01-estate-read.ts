/**
 * Estate read example — filtered property list
 *
 * Usage:
 *   ONOFFICE_TOKEN=xxx ONOFFICE_SECRET=yyy npm run example:estate-read
 */
import { OnOfficeClient, filter, sort, paginate } from '../src/index.js';

const client = new OnOfficeClient({
  apiVersion: 'stable',
});

const result = await client.estates.read(
  paginate(10, 0, {
    data: ['Id', 'kaufpreis', 'lage'],
    sortby: sort({ kaufpreis: 'ASC', warmmiete: 'ASC' }),
    filter: filter().gt('kaufpreis', 300_000).eq('status', 1).build(),
  }),
);

console.log(JSON.stringify(result.data.records, null, 2));

// Low-level parity with PHP SDK:
// const handle = client.callGeneric(ActionId.Read, Module.Estate, { ... });
// await client.sendRequests();
// console.log(client.getResponse(handle));
