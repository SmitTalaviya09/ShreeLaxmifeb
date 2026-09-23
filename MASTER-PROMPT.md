# SHREE LAXMIFEB — WEBSITE MASTER PROMPT (v2026)

> Copy everything below into Claude / v0 / Cursor / Lovable / any AI builder.
> Fill the `[ ]` blanks with your real data first.

---

## 1. ROLE

You are a senior front-end engineer + motion designer building a **premium, animation-heavy, 2026-modern manufacturing website** for an Indian textile company. The site must feel **classic + luxurious + industrial**, not a cheap template. Every scroll must reveal a new animation. A visitor who knows nothing about weaving must UNDERSTAND how a water jet loom makes fabric, just by watching the site.

## 2. COMPANY BRIEF

- **Company name:** Shree Laxmifeb
- **Tagline:** "Woven by Water. Built for the World." (alt: "Precision Weaving. Pure Water Technology.")
- **Business:** Brand-new **Water Jet Loom fabric manufacturing unit**
- **Location:** [City, e.g. Surat], Gujarat, India
- **Established:** 2026
- **Capacity:** [ ] water jet looms | [ ] meters/day | [ ] lakh meters/month
- **Phone / WhatsApp:** [ ] | **Email:** [ ] | **GST:** [ ]
- **Positioning:** New-generation unit, latest machinery, consistent greige quality, export-ready, on-time delivery.

## 3. WHAT WE MAKE (use this in the Products section)

**Base yarns:** Polyester filament (50D, 75D, 100D, 150D, 300D), Nylon, FDY, POY, DTY

**Fabrics:**

| Fabric | Typical use |
|---|---|
| Polyester Greige / Grey Fabric | Base for dyeing & printing |
| Taffeta | Lining, umbrella, bags |
| Satin / Crepe Satin | Dress material, saree base |
| Chiffon / Georgette | Ethnic wear, dupatta |
| Micro Polyester | Shirting, sportswear |
| Lining Fabric | Garment inner |
| Umbrella & Bag Fabric | Industrial / accessories |
| Curtain & Sofa Fabric | Home furnishing |
| Mattress / Ticking Fabric | Bedding |

**Spec fields to show on every product card:**
Width (58" / 63" / 220 cm) - GSM - Denier - Reed x Pick - Weave type - MOQ - Finish (Greige / Dyed / Printed)

## 4. TECH STACK (must use)

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- **GSAP + ScrollTrigger** (main scroll storytelling)
- **Framer Motion** (component entrance, hover, page transitions)
- **Lenis** smooth scroll (silky, ~1.2 ease)
- **Three.js / React Three Fiber** ONLY for the hero water-jet particle layer (keep under 200KB)
- `next/image` + `next/font` (Cormorant Garamond for headings, Inter/Satoshi for body)
- Fully responsive: 360px to 1920px. Animations degrade gracefully on mobile.
- Respect `prefers-reduced-motion`.

## 5. COLOR SYSTEM (do not change — this is the brand)

```css
--ink:        #0A1A2F;  /* Deep ocean navy - main dark bg */
--ink-soft:   #12283F;  /* Section alt bg */
--jet:        #00B4D8;  /* Water jet cyan - hero accent */
--jet-glow:   #48CAE4;  /* Light water / glow */
--gold:       #C9A227;  /* Classic luxury gold - borders, headings, CTA */
--gold-light: #E5C76B;
--ivory:      #F7F5F0;  /* Light section bg / body text on dark */
--thread:     #8FA3B8;  /* Muted text */
```

**Rule:** Dark navy is the default canvas. Gold = premium/classic feel (thin 1px gold hairlines, gold serif headings, gold underline reveals). Cyan = motion, water, energy, data. Ivory = breathing space. Never use colours outside this set. Gradient allowed: `linear-gradient(135deg,#00B4D8,#0A1A2F)`.

## 6. PAGE STRUCTURE + ANIMATION SPEC (the important part)

### 6.1 Preloader (0-2s)
- Black screen. A single **thread of light** draws itself horizontally left to right.
- Then vertical threads drop and **weave** through it (over/under) forming a small fabric square, which morphs into the Shree Laxmifeb logo.
- Curtain wipes up. Percentage counter 0-100 in gold, bottom-right.

### 6.2 HERO — full-screen looping video background
- **Video:** a real water jet loom running, close-up, slow motion weft insertion. Muted, autoplay, loop, `playsinline`, poster image fallback.
- Overlay: `linear-gradient(180deg, rgba(10,26,47,.85), rgba(10,26,47,.55))` so text stays readable.
- **On top of the video:** a Three.js layer of about 600 tiny cyan water droplets streaming left to right, reacting to mouse position.
- Headline animates in **word by word, mask-reveal from below**:
  - H1: "Woven by Water."
  - Sub: "Shree Laxmifeb — Water Jet Fabric Manufacturing, Est. 2026"
- Two CTAs: `Explore Fabrics` (gold fill) and `Watch The Loom` (ghost, opens video modal).
- Bottom: live counter strip — Looms / Meters per Day / Yarn Types / On-time % — numbers count up on load.
- Scroll cue: an animated **water droplet falling and rippling**.

### 6.3 ⭐ THE HOW-IT-WORKS SECTION (centrepiece — spend most effort here)

A **pinned, scroll-driven SVG animation of a water jet loom**. As the user scrolls, the machine builds itself and starts weaving, step by step. Left side = animation, right side = step text that swaps. On mobile: stacked, animation on top.

**Scroll steps (GSAP ScrollTrigger timeline, pin for about 500vh):**

1. **YARN CREEL** — Cones of polyester yarn fade in, rotating slowly. Threads pull out of each cone as glowing lines.
2. **WARPING & SIZING** — Hundreds of parallel warp threads travel right and wind onto a **rotating warp beam**. Beam rotation tied to scroll progress.
3. **DRAWING-IN / HEALDS** — Warp threads pass through heald eyes and the reed. Threads snap into the comb with a stagger.
4. **SHEDDING** — Heald frames move **up and down**, splitting the warp into a V-shaped opening (the shed). Must loop smoothly.
5. **💧 WATER JET INSERTION (the money shot)** — A **cyan water jet fires from the left nozzle**, carrying the weft yarn across the shed at high speed.
   - Draw the jet as a stretched cyan streak + particle spray + slight motion blur.
   - Small droplets fly off, with a subtle ripple/impact at the far end.
   - Slow motion on the first pass, then it speeds up to real speed.
   - Caption overlay: "Water travels at 600+ m/min — no shuttle, no friction, no yarn damage."
6. **BEAT-UP (REED)** — The reed slams forward, pushing the weft thread tight into the fabric. Sharp fast easing (`power4.in`), tiny screen shake.
7. **TAKE-UP** — Finished fabric rolls onto the cloth beam. A woven texture pattern fills in progressively.
8. **INSPECTION & PACKING** — Fabric passes under an inspection light bar (a sweeping light gradient), then rolls stack up and get wrapped.

**Also add:** a small always-visible **speed/progress HUD** in the corner (RPM, picks/min, meters woven) whose numbers change with scroll — it makes the section feel like a live machine dashboard.

### 6.4 About / Our Story
- Split layout. Left: image with **clip-path reveal** on scroll.
- Right: a gold hairline divider draws itself, then text fades up line by line.
- Vertical timeline: 2026 Founded → Machines Installed → First Production → Export Ready. Each node pulses cyan as it enters view.

### 6.5 Products / Fabrics
- Filter chips (All / Greige / Satin / Chiffon / Lining / Home Furnishing) with a **layout-animated** gold pill that slides between active chips.
- Cards in a masonry/bento grid. On hover: image zooms to 1.08, a **woven-thread overlay pattern** slides across, the spec table slides up from the bottom, and a gold border draws around the card.
- Click opens a modal with fabric detail, a 360-degree fabric swatch, and a "Request Sample" button.

### 6.6 Machinery / Infrastructure
- Horizontal scroll gallery (GSAP horizontal ScrollTrigger) of machine photos: Water Jet Looms / Warping / Sizing / Inspection / Packing.
- Each slide has a spec badge and subtle image parallax.
- One inline **muted background video** of the shop floor running behind the section.

### 6.7 Quality & Process
- Four orbiting circular badges: Yarn Testing / In-loom Monitoring / 4-Point Inspection / Final Audit.
- Animated SVG progress rings that fill on scroll.

### 6.8 Why Water Jet? (comparison)
Animated comparison bars — Water Jet vs Air Jet vs Rapier vs Shuttle across: Speed, Fabric smoothness, Power cost, Suitability for filament yarn. Bars grow from 0 with stagger; the water jet bar is gold and grows last and longest.

### 6.9 Sustainability
Water recycling loop animation: droplets flow in a closed circular path through filter icons and back to the loom. Text: "Closed-loop water treatment — [X]% water recycled."

### 6.10 Clients / Industries Served
Infinite logo marquee that pauses on hover.

### 6.11 Testimonials
Card stack that swipes/rotates, with a subtle 3D tilt on mouse move.

### 6.12 Contact / Enquiry
- Split: left = form (Name, Company, Phone, Fabric Type, Quantity, Message), right = map + address.
- Inputs have a **gold underline that draws** on focus, with floating labels.
- The submit button fills with a **rising water animation** on hover; success shows a droplet-ripple confirmation.
- Sticky WhatsApp + Call floating buttons (bottom-right, gentle bounce).

### 6.13 Footer
Dark navy, gold hairline top border, a large ghost wordmark "SHREE LAXMIFEB" behind the content, quick links, GST/address, social icons.

## 7. GLOBAL MOTION RULES

- Page transitions: navy curtain wipe + logo thread mark.
- Custom cursor: small cyan dot + gold ring; grows and reads "VIEW" over cards.
- Every section heading: **mask reveal from bottom**, `clip-path: inset(100% 0 0 0)` to `inset(0)`, 0.8s `power3.out`, stagger 0.06.
- Images: parallax plus/minus 12%, plus a scale 1.1 to 1 reveal.
- Gold scroll-progress bar at the top, tied to Lenis.
- Section backgrounds: a faint animated **woven grid / thread pattern** at 4% opacity, drifting slowly.
- Numbers always count up when they enter view.
- Easing: `power3.out` for entrances, `power4.in` for impacts, `expo.out` for reveals.

## 8. VIDEO REQUIREMENTS

- Hero background video: 1920x1080, H.264 MP4 + WebM, **under 4 MB**, 10-15s loop, muted.
- Lazy-load all non-hero videos with `preload="none"` + poster.
- Provide a "Watch Full Process" modal player with custom gold controls.
- If a real machine video is not available yet, generate the same scene as a **CSS/SVG/Canvas animated background** using the loom animation from section 6.3, so the site never looks empty.

## 9. PERFORMANCE & SEO (non-negotiable)

- Lighthouse: Performance 85+, Accessibility 95+ (with animations on).
- LCP under 2.5s. The hero video must not block LCP — the poster image is the LCP element.
- Semantic HTML, alt text on every image, keyboard navigable, visible focus rings.
- Meta title: "Shree Laxmifeb | Water Jet Loom Fabric Manufacturer in [City], Gujarat"
- Meta description + OG image + JSON-LD `Organization` and `Product` schema.
- Target keywords: water jet fabric manufacturer, polyester greige fabric supplier Surat, taffeta manufacturer India, water jet loom weaving unit.
- Multi-language ready (English + Hindi + Gujarati toggle).

## 10. DELIVERABLE

Give me the **complete, production-ready code** — full folder structure, every component file, all GSAP timelines written out (not placeholder comments), a Tailwind config with the colour tokens above, and sample content already filled in so I can run `npm install && npm run dev` and immediately see the finished animated site. Use royalty-free placeholder images/videos where assets are missing, and clearly mark every place I must swap in my own photos.

**Build in this order and show each part in full:**
1. Project setup + Tailwind theme + fonts + Lenis + layout
2. Preloader + Navbar + custom cursor
3. Hero with video + water particles
4. ⭐ The scroll-driven water jet loom animation (section 6.3) — most detail here
5. Remaining sections in order
6. Contact form + footer + SEO/metadata

---

## QUICK SHORT VERSION (if the tool has a small input box)

> Build a premium 2026 animated Next.js 15 + Tailwind + GSAP ScrollTrigger + Framer Motion + Lenis website for **Shree Laxmifeb**, a new **water jet loom fabric manufacturing unit** in Gujarat, India (polyester greige, taffeta, satin, chiffon, lining, home-furnishing fabrics). Colours: deep navy #0A1A2F, water-jet cyan #00B4D8, classic gold #C9A227, ivory #F7F5F0 — dark, luxurious, industrial. Full-screen looping loom video hero with cyan water-droplet particles and a word-by-word mask-reveal headline. The centrepiece is a **pinned scroll-driven SVG animation of a water jet loom**: yarn creel, warp beam, healds, shedding, then **a cyan water jet firing the weft across the shed with droplet spray**, reed beat-up, fabric rolling onto the cloth beam, inspection and packing — with step text and a live RPM/meters HUD. Then: about with timeline, filterable fabric product grid with spec tables on hover, horizontal-scroll machinery gallery, "Why Water Jet?" animated comparison bars, closed-loop water recycling animation, client marquee, testimonials, enquiry form with gold underline focus and a water-fill submit button, sticky WhatsApp/Call, dark footer. Custom cursor, page-transition curtain, parallax, count-up stats, `prefers-reduced-motion` support, fully responsive, Lighthouse 85+, SEO metadata + JSON-LD. Give complete runnable code.
