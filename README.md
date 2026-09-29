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
google-sheet-sync.gs     paste into Google Apps Script to log enquiries to a Sheet
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

The form is already wired up for **Netlify Forms** — free, no backend, no
API key. The `<form data-netlify="true" name="enquiry">` in `index.html` and
the submit handler in `assets/js/main.js` are ready to go. All you have to do:

1. Deploy the site to Netlify (drag this folder onto https://app.netlify.com/drop,
   or connect the repo — either way).
2. In the Netlify dashboard: **Site settings → Forms → Form notifications →
   Add notification → Email notification**. Add your email.
3. Submit the form once on the live site and confirm the email arrives.

That's it — every enquiry now lands in Netlify's Forms dashboard and emails
you automatically. There's a hidden honeypot field (`bot-field`) already in
the form for basic spam filtering, at no extra cost.

**Only works once deployed on Netlify** — Netlify's build step is what
detects the form and creates the endpoint. On `node serve.js` or a plain
file-open, the request has nowhere real to go, so the success message still
shows (for demo purposes) but nothing is actually delivered.

**Not using Netlify?** Swap the fetch in `main.js`'s submit handler for
[Web3Forms](https://web3forms.com) (free, works on any host, just needs an
access key emailed to you) or [Formspree](https://formspree.io) (free up to
50 submissions/month) instead — both use the same "POST some form data,
get emailed" shape.

---

## Also logging every enquiry into a Google Sheet

Optional, on top of the email notification above — free, no limits, no extra
account beyond your own Google account. `google-sheet-sync.gs` in this folder
has the full script and step-by-step setup instructions as comments at the
top of the file. Short version:

1. Create a blank Google Sheet (or use one you already made). Copy its ID out
   of the URL — `https://docs.google.com/spreadsheets/d/THIS_PART/edit`.
2. In Apps Script (from script.google.com, or Drive → New → Google Apps
   Script — it does **not** need to be opened from inside the Sheet itself),
   paste in `google-sheet-sync.gs`, then paste that ID into `SHEET_ID` near
   the top of the file.
3. Deploy it as a Web App (**Execute as: Me**, **Who has access: Anyone**).
4. Copy the URL it gives you (ends in `/exec`).
5. Open `assets/js/main.js`, find `const SHEET_ENDPOINT = ''` near the top of
   the `form()` function, and paste the URL between the quotes.

Every submission now lands as a new row — timestamp, name, company, phone,
email, fabric type, quantity, message — alongside the Netlify email
notification, not instead of it.

**Important gotcha:** editing the code in the Apps Script editor does **not**
update what's actually live. After any change (including pasting in
`SHEET_ID` or `RECAPTCHA_SECRET_KEY`), go to **Deploy → Manage deployments →
pencil icon → Version: "New version" → Deploy** to push it to the same URL.
Skipping this step is the most common reason the Sheet stays empty even
though everything "looks" set up correctly.

---

## Stopping fake entries from reaching the Sheet

The Sheet endpoint's URL lives in plain text in `assets/js/main.js` — visible
to anyone who views the page source, so on its own it has no protection
against someone scripting direct POSTs to it. Right now the only guard is a
**required-field check** built into `google-sheet-sync.gs` — any submission
missing name/company/phone/fabric/quantity is rejected outright.

Google reCAPTCHA v3 (free, invisible) would add real bot-filtering on top of
that, but it requires a one-time Google authorization step for the Apps
Script to be allowed to call an external service — this tripped up the setup
once already, so it's not currently wired in. Worth revisiting once traffic
picks up enough to justify it: the Apps Script side needs a
`UrlFetchApp.fetch()` call to `https://www.google.com/recaptcha/api/siteverify`,
and the **first** time that code runs (via the `test()` function pattern,
not `doPost` directly), Google will prompt an authorization popup that must
be accepted — that's the step to get right on a second attempt.

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

**To show several photos of one fabric:** make `img` a list instead of a single
name. Clicking the fabric opens it large, and a row of thumbnails appears under
the main photo so buyers can flip between shots:

```js
img: ['fab-taffeta.jpg', 'fab-taffeta-2.jpg', 'fab-taffeta-roll.jpg']
```

One photo works exactly as before — the thumbnail strip only appears when there
are two or more. Worth shooting per fabric: a flat close-up of the weave, the
fabric draped (so buyers can judge the fall), and a full roll.

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
