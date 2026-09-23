# SHREE LAXMIFEB — HERO VIDEO PLAN + HERO PROMPT

Reference site the client likes: https://fabricfactory.in
(full-screen video background + dark overlay + centered white serif headline)

---

## PART A — MY RECOMMENDATION (read this first)

**Yes, use that hero style. But do NOT copy the feeling.**

Fabricfactory shows a **handloom** — slow, wooden, traditional, artisanal. That
matches their story (they sell handloom fabric).

Shree Laxmifeb is a **water jet loom unit** — the opposite: high speed, modern,
technical, precision, water. If we use slow handloom-style video, buyers will
think we are a small handloom shop, not a modern manufacturing unit. That kills
our positioning.

**So: keep the LAYOUT, change the ENERGY.**

| | Fabricfactory | Shree Laxmifeb (ours) |
|---|---|---|
| Video subject | Man on wooden handloom | Water jet loom running at full speed |
| Speed | Slow, calm | Fast + slow-motion close-ups mixed |
| Colour grade | Warm brown / sepia | Cool navy + cyan (water) with gold text |
| Feeling | Handmade, heritage | Precision, technology, scale |
| Headline | "Your one stop fabric heaven" | "Woven by Water." |

**Also one important upgrade:** they have ONE static video. We use a **3-clip
cross-fading hero** (clip 1 → clip 2 → clip 3, 6 seconds each, smooth fade).
This alone makes our site look more expensive than theirs.

---

## PART B — WHICH VIDEO TO USE

You said your current video quality is bad. Three options, in order of what I
recommend:

### Option 1 — Shoot your own again (BEST — do this)

Real footage of YOUR unit is worth more than any stock clip. Buyers want to see
YOUR machines. A phone (iPhone / good Android) is enough if you follow this:

**Camera settings**
- 4K, 60fps (so we can slow it down smoothly). If not available: 1080p 60fps.
- Lock exposure and focus (tap and hold on screen) so it does not flicker.
- Wipe the lens. Shoot horizontal (landscape) ONLY.
- Use a tripod or rest the phone on the machine frame. No shaky handheld.

**Lighting (very important — this is why most factory video looks bad)**
- Shoot in the morning, factory lights fully ON.
- Do not shoot against a window (backlight makes everything dark).
- Put one cheap LED work light on the machine area for a clean highlight.
- Clean the machine and the floor first. Remove waste yarn, boxes, dirty cloth.

**SHOT LIST — record 10-15 seconds of each:**

| # | Shot | Why |
|---|---|---|
| 1 | Extreme close-up: the **water jet nozzle firing** the weft across the shed | THIS IS THE HERO SHOT. Most important. |
| 2 | Close-up: the **reed beating up**, fabric forming line by line | Shows the actual weaving |
| 3 | Close-up: **warp threads** in the healds, slight camera slide sideways | Beautiful abstract texture |
| 4 | Macro: **fabric rolling onto the cloth beam** | Product being born |
| 5 | Wide: **long row of looms** running, camera slowly walking down the aisle | Shows scale = credibility |
| 6 | Close-up: **yarn cones / creel**, camera pushing in slowly | Rich texture |
| 7 | Water droplets / water spray on the machine | Sells "water jet" story |
| 8 | Hands checking fabric quality under inspection light | Human trust element |
| 9 | Finished fabric rolls stacked, camera slides across | Ready for delivery |
| 10 | Company board / gate / building exterior | For the About section |

**Rule for every shot:** the camera moves SLOWLY, or does not move at all.
Fast camera movement = amateur. Slow movement = premium.

### Option 2 — Free stock footage (use as filler / until you reshoot)

Honest warning: **there is almost no real "water jet loom" footage on free stock
sites.** Most results are handloom or generic textile machines. Use these only
for secondary sections, never for the main hero.

- Pexels weaving videos: https://www.pexels.com/search/videos/weaving/
- Pexels textile machine videos: https://www.pexels.com/search/videos/textile%20machine/
- Pexels loom clip: https://www.pexels.com/video/loom-machine-used-for-weaving-6701504/
- Pixabay weaving videos: https://pixabay.com/videos/search/weaving/
- Vecteezy loom footage: https://www.vecteezy.com/free-videos/loom

Search these words: `textile factory`, `weaving machine`, `yarn spinning`,
`textile mill`, `fabric production`, `industrial machine close up`, `water drop
slow motion`.

Paid (much better quality, worth it): Artgrid, Envato Elements, Storyblocks.
Search `weaving mill`, `power loom`, `textile manufacturing`.

### Option 3 — No video at all (fallback, always keep this)

The site must still look premium if the video fails to load or the user is on
slow mobile data. So we build a **CSS/SVG animated water jet loom** as the hero
background fallback — cyan jet firing across dark navy, threads moving. This
also becomes the poster image. Never leave a black empty box.

---

## PART C — VIDEO FILE PREPARATION (do this before uploading)

Bad quality is often bad EXPORT, not bad shooting. Follow this exactly:

1. Trim each clip to **6-8 seconds**, the best part only.
2. Crop to 16:9, export at **1920x1080** (do not upload 4K to the web).
3. **Remove the audio track completely** (browsers block sound anyway, and it
   doubles the file size).
4. Colour grade: slightly cooler, add contrast, lift the blacks a little toward
   navy. Do not oversaturate.
5. Compress:
   - MP4 (H.264), CRF 26-28, target **under 4 MB** for the hero
   - Also export a WebM (VP9) version for smaller size
   - Free tool: HandBrake, or online: freeconvert.com/video-compressor
6. Export **one poster JPG** (a still frame from the video), under 200 KB. This
   is what loads first — it must look good on its own.

**Command if you have ffmpeg (fastest way):**

```bash
# hero clip -> compressed 1080p mp4, no audio, under ~4MB
ffmpeg -i input.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 27 -preset slow -an -movflags +faststart hero.mp4

# webm version
ffmpeg -i hero.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an hero.webm

# poster frame from 2 seconds in
ffmpeg -i hero.mp4 -ss 00:00:02 -vframes 1 -q:v 3 hero-poster.jpg
```

---

## PART D — THE HERO PROMPT (copy this into your AI builder)

> Build the hero section for **Shree Laxmifeb**, a water jet loom fabric
> manufacturing unit in Gujarat, India. Reference the layout of
> fabricfactory.in — full-bleed video background, dark overlay, centered white
> serif headline — but make it feel modern, technical and premium instead of
> traditional.
>
> **Structure:**
> - `<section>` at `100dvh`, `position: relative`, `overflow: hidden`.
> - Background: a **3-clip cross-fading video stack**. Three `<video>` elements
>   absolutely positioned, `object-fit: cover`, `muted autoplay loop playsinline
>   preload="metadata"`, each with a `poster`. Only clip 1 has `preload="auto"`.
>   Cross-fade opacity 0 → 1 over 1.5s every 6 seconds, looping 1→2→3→1.
>   Clips: (1) water jet nozzle firing the weft, (2) reed beating up close-up,
>   (3) wide aisle of looms running.
> - Overlay: `linear-gradient(180deg, rgba(10,26,47,.55) 0%, rgba(10,26,47,.80) 55%, rgba(10,26,47,.95) 100%)`
>   plus a very subtle cyan radial glow behind the headline so the text always
>   stays readable on any frame.
> - A `<canvas>` particle layer above the overlay: ~500 tiny cyan (#00B4D8)
>   droplets drifting left → right at varying speed, 8-25% opacity, gently
>   repelled by the mouse cursor. Pause the loop when the tab is hidden.
> - A faint animated woven-thread SVG grid at 4% opacity over everything.
>
> **Content, centered, max-width 1100px:**
> - Small gold eyebrow, letter-spaced 0.3em, uppercase, fades in first:
>   `EST. 2026 · SURAT, GUJARAT · WATER JET WEAVING`
> - H1 in Cormorant Garamond, clamp(3rem, 8vw, 7rem), white, weight 300:
>   **"Woven by Water."** — animate word by word with a mask reveal from below
>   (`clip-path: inset(100% 0 0 0)` → `inset(0)`, 0.9s `expo.out`, stagger 0.12).
> - A 1px gold hairline that draws from 0 to 180px width under the headline.
> - Sub-line in Inter, #8FA3B8, max-width 640px: "High-speed water jet looms
>   weaving polyester greige, taffeta, satin and chiffon — consistent quality,
>   export-ready, delivered on time."
> - Two CTAs: `Explore Our Fabrics` (solid gold #C9A227, dark navy text, fills
>   from left on hover) and `Watch The Loom` (ghost, 1px gold border, a small
>   play triangle that pulses; opens a modal video player with custom gold
>   controls).
> - Bottom strip, above the fold edge: four count-up stats separated by thin gold
>   dividers — `[ ] Water Jet Looms` / `[ ] Meters Per Day` / `50D–300D Yarn
>   Range` / `99% On-Time Delivery`. Numbers count up on load over 2s.
> - Scroll cue at bottom center: an animated water droplet that falls and creates
>   an expanding ripple ring, looping.
>
> **Colours:** navy #0A1A2F, cyan #00B4D8, gold #C9A227, ivory #F7F5F0, muted
> #8FA3B8. Nothing else.
>
> **Rules:**
> - If the videos fail to load or the connection is slow, fall back to an
>   animated CSS/SVG water jet loom background (cyan jet firing across dark navy
>   with moving warp threads) — the hero must NEVER be an empty black box.
> - Honour `prefers-reduced-motion`: freeze on the poster image, no particles, no
>   cross-fade, text fades in only.
> - The poster image must be the LCP element, not the video. LCP under 2.5s.
> - On mobile (<768px): load only ONE video (or the poster only on slow
>   connections), reduce particles to 120, H1 to clamp(2.2rem, 11vw, 3.5rem),
>   CTAs stack full-width.
> - Give complete React/Next.js + Tailwind + GSAP code, fully working.

---

## PART E — WHAT I NEED FROM YOU NEXT

1. Your current video files — send them, I will tell you which parts are usable.
2. City name (Surat?), number of looms, meters/day capacity.
3. Phone / WhatsApp number and email.
4. Do you have a logo? If not, I will design a text-based gold wordmark.
