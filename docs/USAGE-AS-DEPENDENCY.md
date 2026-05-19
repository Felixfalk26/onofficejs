# Using onofficejs in your project

## npm (recommended after publish)

```bash
npm install onofficejs
```

```typescript
import { OnOfficeClient } from 'onofficejs';

const client = new OnOfficeClient({
  token: process.env.ONOFFICE_TOKEN,
  secret: process.env.ONOFFICE_SECRET,
});
```

## GitHub dependency (works today)

Add to `package.json`:

```json
{
  "dependencies": {
    "onofficejs": "github:onofficejs/onofficejs"
  }
}
```

Then:

```bash
npm install
```

## Local path dependency (monorepo / dev)

```json
{
  "dependencies": {
    "onofficejs": "file:../onofficejs"
  }
}
```

## npm link (active development)

```bash
# In the onofficejs repo
npm install && npm run build
npm link

# In your app
npm link onofficejs
```

## TypeScript

Types are bundled — set `"moduleResolution": "node16"` or `"bundler"` in your `tsconfig.json`.

## Environment variables

```bash
ONOFFICE_TOKEN=your-token
ONOFFICE_SECRET=your-secret
```

## ESM vs CJS

- ESM: `import { OnOfficeClient } from 'onofficejs'`
- CJS: `const { OnOfficeClient } = require('onofficejs')`
