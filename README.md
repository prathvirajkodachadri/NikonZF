# ZF Field Companion — Nikon Zf Settings Guide

A retro editorial, paper-feel web app that turns any Nikon Zf shooting situation into a small dial map and a clear set of recommended settings. Built with Vite + React 19 + TypeScript + Tailwind CSS 4.

The project lives entirely in the `nikon-zf-settings-guide/` folder.

## Stack

- React 19 + React DOM 19
- TypeScript 5 (strict)
- Vite 7 (with `vite-plugin-singlefile` → one self-contained `dist/index.html`)
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Hash-based client-side routing (`#/`, `#/rules`, `#/diagnoser`)

## Pages

| Route        | File                          | What it does                                                          |
| ------------ | ----------------------------- | --------------------------------------------------------------------- |
| `#/`         | `src/pages/Guide.tsx`         | 6-step "Build Your Shot" wizard + Camera Control Map + AF-area legend |
| `#/rules`    | `src/pages/Rules.tsx`         | Four short exposure rules + setting-order reference                   |
| `#/diagnoser`| `src/pages/Diagnoser.tsx`     | Pick a scene → get required settings → tick symptoms → get a fix list  |

## Install and run

```bash
cd nikon-zf-settings-guide
npm install
npm run dev        # http://localhost:5173 (or whichever port Vite picks)
```

## Build for production

```bash
cd nikon-zf-settings-guide
npm run build      # produces a single dist/index.html with inlined JS + CSS
npm run preview    # serves dist/ locally
```

The production build is **one self-contained `dist/index.html` plus an `images/` folder** (thanks to `vite-plugin-singlefile`). Drop it on any static host (GitHub Pages, Netlify, S3, etc.) and it works.

## Project structure

```
nikon-zf-settings-guide/
├── index.html              # Vite entry HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── images/             # 24-120-lens, 40mm-lens, hero-camera-70s, zf-body, zf-top-diagram
└── src/
    ├── main.tsx            # React 19 createRoot bootstrap
    ├── Root.tsx            # Hash-based router
    ├── index.css           # @import "tailwindcss"
    ├── lib/
    │   └── data.ts         # Scenes, mods, focus-set + base-preset logic
    ├── components/
    │   ├── Shell.tsx       # Site shell, header, footer, grain, motion, fonts
    │   ├── ZfDiagram.tsx   # Top-view SVG camera with hot-spot callouts
    │   └── AfIcon.tsx      # Inline-SVG AF-area mode glyphs (12 symbols)
    ├── pages/
    │   ├── Guide.tsx       # 6-step settings builder + camera map band
    │   ├── Rules.tsx       # Four exposure rules
    │   └── Diagnoser.tsx   # Pick scene → required settings → symptom → fix
    └── utils/
        └── cn.ts           # clsx + tailwind-merge
```

## Design tokens

Defined inline in `Shell.tsx` and `ZfDiagram.tsx`:

| Token  | Hex      | Role                          |
| ------ | -------- | ----------------------------- |
| Navy   | `#00365A`| Cold, structural, primary CTA |
| Orange | `#C64F0E`| Warm accent, photo badges     |
| Mustard| `#F4B23C`| Mid-warm highlight            |
| Beige  | `#D7BB83`| Mid-cool warm                 |
| Char   | `#2F3133`| Borders, ink                  |
| Paper  | `#FAF8F3`| Default background            |
| Cream  | `#F3EDE1`| Section band background       |

## Type-safe building blocks

- `getBase(scene)` returns a `BasePreset` (aperture / shutter / ISO / focal / focus / WB / video / tip) per scene name.
- `getFocusSet(scene, mode, motion, subject, cameraMove)` returns the focus-type, AF-area, subject-detection, VR and electronic-VR recommendations, with a `why` line. The rules enforce Nikon's pairing constraints (Pinpoint → photo + AF-S only, Dynamic-area / 3D → photo + AF-C only, Subject-tracking → video only, etc.).
- A scene list of 60+ situations drives both `Guide` and `Diagnoser`.

## Animations

- `[data-reveal]` elements fade in via `IntersectionObserver` on first view.
- `.dialg` (dial glyphs) rotate 20° on hover.
- `.popg` scales 1.12× on hover.
- `.floaty` / `.floaty2` decorative blobs animate `translateY` in the background.
- `prefers-reduced-motion` disables every animation and transition.
