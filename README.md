# Shree Laxmifeb — Website

Water jet loom fabric manufacturing unit, Surat, Gujarat. Est. 2026.

---

## How to open it

**Easiest:** double-click `index.html`.

**Better (recommended):** run a local server so the video behaves
exactly like the live site. From this folder:

```bash
node serve.js
```

Then open http://localhost:5173 — press Ctrl+C to stop it.

No build step. No `npm install`. Plain HTML, CSS and JavaScript.

---

## Files

```
index.html               all page markup
assets/css/style.css     all styling (colour tokens at the top)
assets/js/main.js        all animation and interaction
assets/video/            ← put your video files here
assets/img/              ← put your photos here
MASTER-PROMPT.md         the full site brief
HERO-VIDEO-PLAN.md       how to shoot and prepare the video
```

---

## ⚠️ THINGS YOU MUST CHANGE BEFORE GOING LIVE

Already done: phone (`+91 72018 05575`), WhatsApp, unit address (Bansari
Textile Park, Pipodara), and GST number (`24AFWFS5330L1ZE`) are real and live
across the site.

Still placeholders — search `index.html` for these and replace every one:

| Find | Replace with |
|---|---|
| `info@shreelaxmifeb.com` | your real email, if this isn't it |
| `www.shreelaxmifeb.com` | your real domain (appears in canonical/OG tags and the JSON-LD block) |
| `48` (Water Jet Looms) | your real loom count, if different |
| `65000` (Meters Per Day) | your real daily capacity, if different |

The loom count and capacity numbers appear in the hero stats, the products
trust-strip, and the About timeline — update all three so they match.

---

## 📷 About the photos and video currently on the site

The site now runs on **real footage and real photographs**, not drawings.
They came from **Pexels**, which licenses them free for commercial use with no
attribution required. So you are legally safe using them today.

**But read this before you launch:**

| Media | Safe to keep? |
|---|---|
| The 12 fabric close-ups (`fab-*.jpg`) | ✅ Fine long term. Generic fabric textures — nobody can tell whose cloth it is. Still, your own fabric photos will sell better. |
| Hero videos (`hero-*.mp4`, `Video-15083.mp4`) | ⚠️ **Replace these.** They show *somebody else's* factory. Presenting them as your own floor misleads buyers, and a buyer who visits your unit and sees different machines will not trust you again. |

Treat the hero footage as a **temporary stand-in so the site is not empty
while you arrange a proper shoot.** Fabric photos can stay.

The `inf-*.jpg` factory-floor photos and `process-bg.jpg` are **no longer used
anywhere on the page** (the sections that showed them were removed) — safe to
delete from `assets/img/` if you want to tidy up, or leave them for later.

## Replacing the media with your own

Keep the **same filenames** and nothing else needs changing — just overwrite
the files.

**Video** (`assets/video/`)

| File | What it should show |
|---|---|
| `hero-1-weave.mp4` | Close-up of the water jet nozzle firing the weft ← most important |
| `hero-2-powerloom.mp4` | Reed beating up / machine running |
| `hero-3-aisle.mp4` | Wide shot down your row of looms |
| `Video-15083.mp4` | A fourth hero clip in the rotation — replace or remove |
| `process-film.mp4` | Longer film for the "Watch The Loom" button |

**Photos** (`assets/img/`) — just the `fab-*.jpg` fabric shots are in active
use now.

`HERO-VIDEO-PLAN.md` has the full shot list and camera settings.

**Preparing a video** — these commands turn a phone clip into a web-ready file
(ffmpeg is already installed on this machine):

```bash
# 8-second hero clip, 1080p, no audio, ~1-3 MB
ffmpeg -y -ss 0 -i myclip.mp4 -t 8 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25" \
  -c:v libx264 -crf 30 -preset slow -an -pix_fmt yuv420p -movflags +faststart \
  assets/video/hero-1-weave.mp4

# matching poster image
ffmpeg -y -ss 0.5 -i assets/video/hero-1-weave.mp4 -vframes 1 -q:v 4 \
  assets/img/hero-1-weave-poster.jpg
```

Keep every hero clip **under 4 MB** or the page gets slow on mobile data.

If a video file is ever missing, the hero falls back to the animated water jet
loom canvas automatically — it never shows an empty black box.

---

## Making the enquiry form actually send

Right now the form validates and shows a success state but does not deliver
anywhere. Cheapest working option:

1. Sign up free at https://formspree.io and create a form.
2. Copy your endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. Open `assets/js/main.js`, find `CONNECT YOUR BACKEND HERE`, uncomment the
   `fetch(...)` block and paste your endpoint.

Test it once and check the mail arrives before you announce the site.

---

## Editing the fabric list

All products live in one array in `assets/js/main.js` — search for `const FABRICS`.
Each entry:

```js
{ n: 'Taffeta',              // name shown on the card
  f: 'lining',               // filter group: greige | apparel | lining | home | industrial
  tag: 'Lining',             // badge on the swatch
  d: 'Crisp, tightly woven…',// one-line description
  s: { Width: '58"', GSM: '58 – 75', Denier: '50D × 50D', MOQ: '3,000 m' },
  c: ['#2E5C6E', '#4E8FA3'],  // fallback thread colours if the photo fails to load
  img: 'fab-taffeta.jpg' }    // the photo, from assets/img/
```

Add, remove or reorder freely — the grid and filters update automatically.

**To swap a fabric photo:** just overwrite `assets/img/fab-taffeta.jpg` with your
own picture, keeping the filename. Or point `img:` at a new file you added.

---

## The woven background texture

The **Fabrics** section (`.sec-light`) sits on a generated plain weave
(`assets/img/weave-tile.svg`) so the page reads as textile immediately. It is a
seamless tile blended in `overlay` mode, which adds thread grain without
changing the background tone, so text contrast is unaffected.

To change how strong it looks, edit `.sec-light::before` in `assets/css/style.css`:

- `opacity` &mdash; higher = more visible weave (currently `.62`)
- `background-size` &mdash; smaller = finer thread (currently `46px`)

To use a photo of **your own** fabric instead, replace `weave-tile.svg`. A flat,
evenly lit close-up works best.

The rest of the page (About, Quality, Testimonials, Contact) runs on two flat
warm tones — `--ivory` and `--paper` in the colour block below — with the dark
theme kept only for the hero and footer as bookends.

---

## Colours

All in `assets/css/style.css` at the very top under `:root`:

```
--ink          #1B1815   warm charcoal, the main canvas
--ink-soft     #24201C   panels, cards, alternate dark blocks
--ink-line     #3A322A   hairline borders on dark sections
--ink-deep     #120F0D   deepest shade — hero backdrop, footer
--copper       #C1622D   motion, progress, the water-jet accent
--copper-glow  #E08A52   copper highlight state
--gold         #D4AF37   hairlines, headings, buttons — the premium feel
--gold-light   #F0D888   gold highlight state
--ivory        #FAF7F0   the page's main light background
--paper        #EDEAE4   alternate light background, for chapter rhythm
--thread       #B3A99C   muted body text (dark sections only)
```

Change these and the whole site re-themes.

---

## Hosting

Any static host works, all free or near-free:

- **Netlify** — drag this folder onto https://app.netlify.com/drop. Live in 30 seconds.
- **Cloudflare Pages** / **Vercel** — same idea, connect a folder or repo.
- **Hostinger / GoDaddy / any cPanel** — upload the whole folder into `public_html`.

Then point your domain at it and enable HTTPS (free on all of the above).

---

## Before launch checklist

- [ ] Every placeholder above replaced with real data
- [ ] Form tested end to end, mail received
- [ ] WhatsApp and Call buttons tested on a real phone
- [ ] Hero videos (`hero-*.mp4`, `Video-15083.mp4`) replaced with footage of YOUR unit
- [ ] `assets/img/og-image.jpg` created (1200×630) — this is what shows when the
      link is shared on WhatsApp
- [ ] Checked on a real phone, not just a resized desktop window
- [ ] Google Search Console + Google Business Profile set up
