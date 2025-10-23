# Data Dashboard

A small React + Vite dashboard that shows data synchronization sources (CMD, IFAST, SAP), Master Data controls, and an IHP calculator.

This project includes two styling modes:

* **Plain CSS theme (default)** — a self-contained, modern theme in `src/index.css` that works without Tailwind. This is the recommended option if you want a quick, stable setup.
* **Tailwind (optional)** — the project can be configured to use Tailwind CSS; notes and troubleshooting are included below.

---

## Prerequisites

* Node.js (>=16 recommended; tested with Node 23 on macOS)
* npm (bundled with Node)
* A terminal (macOS/Linux) or PowerShell (Windows)

## Quick start (recommended — plain CSS theme)

These commands assume you are in a parent folder where you want the project directory to live.

```bash
# 1. Clone or copy the project into a folder (example: finance-dashboard)
# If you received the project as a zip, unzip it and open the folder.
cd /path/to/finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server (Vite)
npm run dev

# 4. Open the URL printed by Vite (usually http://localhost:5173)
```

The app uses the **plain CSS theme** by default: `src/index.css`. If everything is set up correctly you should see a styled dashboard with cards, buttons, and a modal.

---

## Files you will care about

* `src/App.jsx` — main React component (dashboard layout and behavior)
* `src/index.css` — default theme (plain CSS). If Tailwind is not fully configured this CSS provides the visual styling.
* `package.json` — scripts and dependencies
* `tailwind.config.cjs`, `postcss.config.cjs` — optional, only used when Tailwind is enabled

---

## If you want to enable Tailwind CSS (optional)

> Note: Tailwind requires a working install of the CLI and PostCSS adapter. Some environments may need `@tailwindcss/cli` or `@tailwindcss/postcss`. If you are happy with the plain CSS theme, you can skip this.

### Install Tailwind packages (local dev deps)

```bash
# inside project folder
npm install -D tailwindcss @tailwindcss/cli @tailwindcss/postcss postcss autoprefixer --legacy-peer-deps
```

If you encounter problems with `npx` or the `tailwindcss` binary, try using the CLI package directly:

```bash
# run the CLI via node (if installed as @tailwindcss/cli)
node ./node_modules/@tailwindcss/cli/bin/tailwindcss init -p
```

### Confirm and build Tailwind CSS

Add or confirm `postcss.config.cjs` contains:

```js
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
```

Then, to generate a standalone CSS file:

```bash
# build once
npx --package @tailwindcss/cli tailwindcss -i ./src/index.css -o ./dist/tailwind.css --minify

# or use local binary when available
./node_modules/.bin/tailwindcss -i ./src/index.css -o ./dist/tailwind.css --minify
```

To watch for changes:

```bash
npx --package @tailwindcss/cli tailwindcss -i ./src/index.css -o ./dist/tailwind.css --watch
```

> If `@apply` or utilities like `from-*` cause errors, follow Tailwind docs: use `@layer components { ... }` for `@apply` or avoid applying gradient stop helpers. The repo includes a plain-CSS fallback to avoid these issues.

---

## Troubleshooting (macOS common issues)

### `npx` / `tailwindcss` not found

* If `npx tailwindcss` or `./node_modules/.bin/tailwindcss` fails, ensure packages were installed locally and check `node_modules/.bin`:

```bash
ls -la node_modules/.bin | grep tailwind || true
```

* If global install was used and binary not found, verify `npm bin -g` and ensure that path is in your `$PATH`.

### Path with spaces

* Your project path should avoid spaces (e.g. `Price Calculator`). Some tools/scripts are brittle with spaces. If you see strange errors, move the project to a path without spaces, e.g. `~/projects/finance-dashboard`.

### PostCSS plugin error

If you see an error about using Tailwind directly as a PostCSS plugin, install `@tailwindcss/postcss` and update `postcss.config.cjs` (see above).

---

## Scripts (package.json)

The `package.json` includes the typical scripts used during development:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:css": "tailwindcss -i ./src/index.css -o ./dist/tailwind.css --minify"
  }
}
```

`build:css` requires the Tailwind CLI to be present; if you use the plain CSS theme you do not need it.

---

## Recommended workflow

* For fastest setup: use the plain CSS theme and run `npm run dev`.
* If you want Tailwind utilities: enable Tailwind as described above and use `build:css` or `watch` alongside `vite`.

---

## Contributing / Notes

* The dashboard component is intentionally lightweight and easy to extend. Replace the placeholders (download logic, API calls) with your real endpoints.
* If you want, I can convert the current semantic CSS classes into Tailwind utilities once Tailwind is working on your machine.

---

## License

MIT — feel free to reuse and modify.

---

If you want, I can also:

* Add a `Makefile` or single `setup.sh` script to run the recommended install steps,
* Commit the README into the project canvas for you, or
* Provide a Windows PowerShell variant of the setup commands.

Which of those would you like next?
