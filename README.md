# WuWa Calculator

Damage calculator and build helper for Wuthering Waves, with an attribute comparator and an Echo comparator.
Live: https://nfekted.github.io/wutheringCalculator/

## Stack

- Angular 22 (standalone components, signals, lazy routes)
- Tailwind CSS v4; every color and font is a token in `src/theme.css` (light and dark themes)
- `@angular/cdk` dialogs, `@jsverse/transloco` (English and Portuguese)
- Data stays in the browser (IndexedDB, via `idb`); there is no backend

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Dev server at http://localhost:4200 |
| `npm run build` | Production build into `dist/` |
| `npm run buildPages` | Production build into `docs/` (GitHub Pages) |

Run `npm run buildPages` and commit `docs/` to publish. Routes use the hash (`/#/faq`), so reloading works on GitHub Pages.

## Structure

- `src/app/core/damage-engine.ts`: pure damage formulas, no Angular
- `src/app/data/characters/*.json`: one file per character (multipliers, scaling, names)
- `src/app/shared/`: models, services (storage, settings, theme) and UI primitives
- `src/assets/i18n/`: translations, split by scope (`home`, `faq`, `char`)

## Adding a character

1. Add `src/app/data/characters/<id>.json` following `character-data.model.ts`.
2. Register it in `src/app/data/characters/index.ts`.
3. Add the portrait and skill icons under `src/assets/img/` and the description under `char.characters.<id>` in the `char` translations.
