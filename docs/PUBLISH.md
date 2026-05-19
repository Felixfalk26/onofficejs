# Publish to GitHub

Run these commands **once** after cloning, from the repo root.

## 1. Authenticate GitHub CLI

```powershell
gh auth login
```

Choose: GitHub.com → HTTPS → Login with browser (or paste a token).

## 2. Log in as felixfalk26

Create a **Granular Access Token** at [npmjs.com/settings/felixfalk26/tokens](https://www.npmjs.com/settings/felixfalk26/tokens) with:

- **Read and write** package access
- **Bypass 2FA for automation** enabled (required for CI / non-interactive publish)

Then publish:

```powershell
cd c:\Users\Shadow\Documents\onofficejs\onofficejs
npm login
npm whoami   # should print: felixfalk26
npm publish
```

Or use a one-time `.npmrc` (do not commit):

```
//registry.npmjs.org/:_authToken=YOUR_TOKEN
```

## 3. Create public repo and push (GitHub — already done)

```powershell
cd c:\Users\Shadow\Documents\onofficejs\onofficejs
gh repo create onofficejs --public --source=. --remote=origin --push --description "TypeScript/JavaScript SDK for the onOffice API"
```

If the repo already exists:

```powershell
git remote add origin https://github.com/Felixfalk26/onofficejs.git
git push -u origin main
```

## 3. Use in another project

**From GitHub:**

```bash
npm install github:Felixfalk26/onofficejs
```

**From npm (after `npm publish`):**

```bash
npm publish --access public
npm install onofficejs
```

See [docs/USAGE-AS-DEPENDENCY.md](./docs/USAGE-AS-DEPENDENCY.md).
