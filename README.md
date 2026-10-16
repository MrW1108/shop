# Wayfarer Supply

A responsive, bilingual React storefront prototype for travel, commute, and everyday gear. Built with React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui primitives, Radix UI, and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Production build and preview:

```bash
npm run build
npm run preview
```

`npm run build` runs the TypeScript project build before creating the Vite production bundle. `npm run typecheck` is available for a standalone TypeScript check.

## Included

- English and Simplified Chinese interface; English is the default.
- Ten mock products across five categories, with combined text search and category filters.
- Product detail dialog, quantity selection, cart drawer, quantity edits, removal, and subtotal.
- Cart and language preference saved in local storage when available.
- Responsive desktop/mobile layouts, neon styling, and reduced-motion support.

## Demo limitations

- Product data is local mock data; there is no backend, account, inventory, or real checkout.
- Product photos load from Unsplash. If a photo is unavailable, the colored image stage remains as a fallback.
- Storage is best-effort. The app remains usable for the current session when browser storage is blocked.
