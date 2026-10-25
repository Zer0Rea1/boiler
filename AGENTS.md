# Repository Guidelines

## Project Structure & Module Organization
Boiler is a Shopify Liquid theme with Tailwind CSS v4 and vanilla JavaScript.
- `layout/` contains the storefront and password page shells.
- `sections/` contains configurable theme sections; `snippets/` holds reusable Liquid fragments.
- `templates/` maps page types to JSON section layouts or Liquid templates.
- `assets/` contains browser scripts and generated `tailwind.css`.
- `src/tailwind.css` defines Tailwind imports, scan paths, and shared component styles.
- `config/` holds theme settings; `locales/` holds translation strings.

## Build, Test, and Development Commands
Run commands from the repository root. Install dependencies with `npm ci`; Shopify commands also require Shopify CLI and access to a development store.
- `npm run dev`: start the Tailwind watcher and Shopify development server together.
- `npm run watch`: rebuild CSS as source files change.
- `npm run build`: generate minified `assets/tailwind.css`.
- `npm run shopify:check`: validate the theme using `.theme-check.yml`.
- `npm run shopify:dev`: preview the theme without starting the CSS watcher.
- `npm run shopify:pull` / `npm run shopify:push`: synchronize files with a store. Confirm the target theme before running either command.

## Coding Style & Naming Conventions
Use two-space indentation, matching existing Liquid, JSON, CSS, and JavaScript. Use kebab-case filenames such as `main-product.liquid`, camelCase JavaScript variables and methods, and PascalCase classes. Keep reusable markup in snippets and configurable content in section schemas. Prefer existing Tailwind utilities and `.btn` styles. Edit `src/tailwind.css` and rebuild; do not hand-edit generated CSS. No dedicated formatter or JavaScript linter is configured.

## Testing Guidelines
No automated test framework, test script, or coverage threshold is configured; `sections/test-section.liquid` is a theme section. Before submitting, run `npm run build` and `npm run shopify:check`. Preview affected pages at desktop and mobile widths. For product or cart changes, verify variant selection, add-to-cart, quantity updates, removal, empty states, and keyboard interaction.

## Commit & Pull Request Guidelines
History currently contains one commit, `Initial commit: Boiler theme blank canvas with Tailwind CSS`; no broader convention is established. Use concise, imperative subjects describing the change. Pull requests should explain the purpose, list validation performed, link related issues when applicable, and include screenshots for visual changes. Include rebuilt CSS when styles change. Keep credentials, `.env` files, and `.shopify/` state out of commits.
