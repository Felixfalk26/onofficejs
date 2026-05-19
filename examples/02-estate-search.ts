/**
 * Estate search autocomplete example
 */
import { OnOfficeClient } from '../src/index.js';

const client = new OnOfficeClient({ apiVersion: 'stable' });

const result = await client.estates.search('Aachen');
console.log(JSON.stringify(result.data, null, 2));
