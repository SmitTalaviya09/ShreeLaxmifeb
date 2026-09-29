# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/lead-gen website for **Shree Laxmifeb**, a water jet loom fabric manufacturer in Surat, Gujarat (est. 2026). B2B: sells greige fabric in bulk (MOQ thousands of metres) to processors, traders and garment exporters — not a retail/e-commerce site. There is no cart or per-metre checkout anywhere; the entire commercial flow is "browse fabrics → enquiry form → human replies with a quote."

Plain HTML/CSS/JS. No framework, no build step, no `package.json`, no bundler, no npm install.

## Commands

```bash
node serve.js          # local dev server at http://localhost:5173 (Ctrl+C to stop)
node serve.js 5174      # same, on a different port
```

There is no lint, test, or build tooling in this repo — none is configured. Verify changes by loading the page in a browser (or driving headless Chrome via CDP) and checking visually; there is no automated test suite to run.

## File map

```
index.html               all markup — one long single-page document
assets/css/style.css     all styling; colour tokens live in :root at the top
assets/js/main.js        all behaviour — a single IIFE, see "main.js structure" below
serve.js                 the dev server (plain Node http, no dependencies)
google-sheet-sync.gs     Google Apps Script source — NOT auto-deployed (see below)
README.md                owner-facing setup/maintenance guide (placeholders, hosting, etc.)
MASTER-PROMPT.md         original site brief (historical — describes the initial ask, not necessarily current state)
HERO-VIDEO-PLAN.md       shot list / camera settings for the hero footage
```

Third-party JS (GSAP, ScrollTrigger, Lenis) loads via CDN `<script>` tags at the bottom of `index.html`, before `main.js`. `main.js` assumes `gsap`, `ScrollTrigger`, and `Lenis` already exist as globals — there's no module system or bundling.

## Architecture

### `main.js` structure
Single IIFE with numbered `/* == N. NAME == */` section comments. Each feature is a `function` defined in the IIFE's scope, and the **boot sequence at the very bottom** is the actual call order — read that first to see what runs and in what order:

```js
preloader(); heroIntro();
nav(); loomCanvas(); droplets(); heroVideos();
products(quickView());   // quickView() must be built first — products() wires clicks to it
rings(); timeline(); reveals();
form();                  // builds the fabric <select> options AND the custom dropdown UI
modal();
```

`REDUCED` (a `prefers-reduced-motion` check) is computed once at the top and gates most animation — check it before adding new motion.

### `FABRICS` is the single source of truth
Defined once in `main.js` (search `const FABRICS`) as an array of `{n, f, tag, d, s, c, img}` objects. Three separate UI pieces are all *generated* from this one array, not hand-maintained in parallel:
- the product grid (`products()`)
- the fabric quick-view popup (`quickView()`)
- the enquiry form's "Fabric Type" dropdown (`form()` — options are built from `FABRICS.map(...)`, not hard-coded in the HTML)

This matters because the quick-view's "Request a Sample" button matches fabrics **by name string** against the dropdown's option text to preselect it — if you ever add a fabric name that doesn't round-trip cleanly through both places, that match silently fails. Since the dropdown is now generated from the same array, this can't drift out of sync anymore (it used to, before the dropdown was hardcoded — that was a real bug fixed during development).

`img` can be a single filename or an array of filenames; the quick-view only shows a thumbnail strip when there are 2+.

### Custom `<select>` pattern
Native `<select>` dropdown option lists cannot be restyled with CSS (the open list is the browser's own UI). The Fabric Type field uses a recurring pattern for this: a **real, functional `<select>` stays in the DOM** (visually hidden via `.csel-native`) as the actual source of truth for the form value, while a button (`.csel-btn`) + styled `<ul>` (`.csel-list`) provide the visible UI, driven by `customSelect()` in `main.js`. The two stay in sync in both directions — clicking a custom option updates the real `<select>` and dispatches a `change` event on it; and setting the real `<select>`'s value programmatically (e.g. quick-view's "Request a Sample" button) is picked up by a `change` listener that updates the custom UI. This means form validation, `FormData` on submit, and any other code can keep treating `#fType` as an ordinary `<select>`.

### Design system: dark bookends, light middle
The page runs light (ivory/paper) throughout, with dark used only as a deliberate bookend at the very top (hero) and bottom (footer) — see the comment block above `.sec-light` in `style.css` for the reasoning. Two light background tones alternate section-to-section for rhythm: `--ivory` (#FAF7F0) and `--paper` (#EDEAE4).

Colour tokens (`:root` in `style.css`):
```
--ink #1B1815  --ink-soft #24201C  --ink-line #3A322A  --ink-deep #120F0D   (dark theme — hero/footer/nav only)
--copper #C1622D  --copper-glow #E08A52                                    (motion/progress accent)
--gold #D4AF37  --gold-light #F0D888                                       (the premium accent, used everywhere)
--ivory #FAF7F0  --paper #EDEAE4                                           (light backgrounds)
--thread #B3A99C                                                           (muted text — dark sections ONLY, fails contrast on light backgrounds)
--fs-label/-small/-body-sm/-body/-lead                                     (type scale — use these, not one-off font-size values)
```
`--thread` and `var(--gold-light)` read fine on dark backgrounds but fail WCAG contrast on light ones — light-section text uses hard-coded darker equivalents instead (`#6B6255` for muted text, `#8A6A12` for gold-on-light). If you're styling new text on a light-background section, don't reach for `--thread`.

`backdrop-filter` placed directly on `.nav` (rather than on `.nav::before`) will break the mobile nav drawer — `backdrop-filter` makes an element the containing block for its own `position:fixed` descendants, and the drawer is one. See the comment above `.nav::before` in `style.css` if touching nav blur/scroll-stuck styling.

### Form submission: two independent channels
1. **Netlify Forms** — `<form data-netlify="true" name="enquiry">` with a hidden honeypot field. The submit handler in `main.js` does an AJAX POST to `/` (Netlify's documented pattern for JS-driven form submission). Only works once actually deployed on Netlify — locally this POST has nowhere real to go, so the success UI still shows (for demo purposes) but nothing is delivered.
2. **Google Sheet logging (optional, additive)** — `SHEET_ENDPOINT` near the top of `form()` in `main.js` points at a deployed Google Apps Script Web App. The actual Apps Script source lives in `google-sheet-sync.gs` at the repo root, **but that file is not itself deployed anywhere** — it's the reference copy; the real, running version lives inside Google's own Apps Script editor (in the site owner's Google account) and has to be manually kept in sync by copy-pasting. Editing `google-sheet-sync.gs` in this repo does nothing to production until someone pastes the change into Apps Script **and** redeploys it as a "new version" (Apps Script does not auto-redeploy on save — this tripped up setup once already and is the most common cause of "the Sheet stays empty").

Both channels fire independently in the submit handler; either can be absent (`SHEET_ENDPOINT` empty-string) without breaking the other.

### No build-time asset pipeline
Video/image files are referenced directly by filename in `index.html` and `main.js`; there's no hashing, no image optimization step, nothing to run after adding a file besides updating the reference. `ffmpeg` is **not** installed on this machine (a past version of this README incorrectly claimed it was) — if a task needs video re-encoding or poster-frame extraction, check for `ffmpeg` before assuming it's available, or say so rather than silently skipping poster generation.

### Current known gaps
A few placeholders are still pending real data (domain name in the canonical/OG/JSON-LD tags, loom-count/capacity numbers in three places) — see README.md's "THINGS YOU MUST CHANGE BEFORE GOING LIVE" table for the current exact list rather than duplicating it here, since it changes as the owner fills things in.
