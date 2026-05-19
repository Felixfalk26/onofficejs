# Publish to GitHub

Run these commands **once** after cloning, from the repo root.

## 1. Authenticate GitHub CLI

```powershell
gh auth login
```

Choose: GitHub.com → HTTPS → Login with browser (or paste a token).

## 2. Create public repo and push

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
