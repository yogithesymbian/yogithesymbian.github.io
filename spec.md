# Portfolio UI Refactor — CrowdStrike-Inspired

Status: implemented locally; browser visual QA and deployment pending
Updated: 23 October 2026

## 1. Objective

Refactor the entire portfolio into a premium, direct, high-contrast experience inspired by CrowdStrike's public marketing site. The result must feel intentionally designed, fast, and easy to scan—not like a generic AI-generated landing page.

This is an adaptation, not a brand clone. Do not copy CrowdStrike logos, proprietary typefaces, illustrations, text, or product graphics.

## 2. Design principles

1. **High contrast:** black, off-white, and signal red form the core palette.
2. **Typography first:** oversized condensed-feeling headlines and short, confident copy establish hierarchy.
3. **Structured density:** organize content with rules, numbered labels, and deliberate alignment rather than floating cards.
4. **Real work first:** project screenshots, measurable outcomes, and specific experience replace decorative graphics.
5. **Clear actions:** each area has one obvious next step. Buttons use square or lightly rounded geometry.
6. **Controlled motion:** subtle entrance and carousel movement only; no ornamental continuous animation except the credential rail.
7. **A single focal object:** as in `yo_utils`, the first viewport needs one highly resolved visual component. For the portfolio this is the dark profile/work console, not a generic decorative graphic.

### Portrait treatment

- The hero portrait uses the optimized transparent cinematic-red cutout (`assets/yogiarifwidodo-photo-red-cinematic-cutout.webp`), derived from the supplied cinematic-red artwork. Its red lighting and intended color grade are part of the composition and already belong to the site’s black/red visual system.
- Render the portrait in its native color treatment. Do not apply grayscale, desaturation, monochrome, opacity washes, blend modes, color overlays, CSS filters, or alternate grey assets.
- Preserve the transparent WebP delivery asset and its PNG fallback. Cropping or containment may respond to layout, but must not obscure the subject or alter the artwork’s color.

## 3. Visual system

### Color tokens

- `--black: #050505` — navigation, profile console, footer, dark panels
- `--ink: #111111` — primary text
- `--paper: #f4f2ed` — warm editorial background
- `--white: #ffffff` — high-contrast surfaces and text
- `--red: #e01b2f` — primary signal and CTA
- `--red-dark: #b70f21` — hover/pressed state
- `--muted: #696969` — secondary text
- `--line: #c9c7c1` — rules and separators

No green gradients, liquid-glass surfaces, pastel glows, or decorative shadows.

### Typography

- Use a system sans stack; do not add a runtime font dependency.
- Display text uses heavy weight, tight tracking, short line-height, and mostly sentence case.
- Eyebrows and metadata use uppercase with wider tracking.
- Body copy stays readable at `16–18px` with a maximum line length near `65ch`.
- Headings must wrap naturally at 320px and 200% zoom.

### Geometry

- Main canvas: maximum `1280px` with responsive gutters.
- Corners: `0–4px` for most components; pills only for true status indicators.
- Cards are differentiated through composition, media, and borders—not identical rounded containers.
- Use 1px rules and occasional red bars to create a technical editorial rhythm.

## 4. Information architecture

### Global navigation

- Black sticky header with `YA/W` wordmark, Work, About, Writing, and a red Contact CTA.
- Desktop navigation stays on one line. Mobile keeps the mark and essential destinations without horizontal overflow.
- Visible keyboard focus and minimum 44px action height.

### Homepage

1. **Hero:** warm editorial field with large name and positioning beside a dark profile/work console containing the original cinematic-red portrait in its native color treatment, verified experience metadata, and controlled red accents. Primary Work CTA, secondary call CTA, availability, and profile links remain immediately visible.
2. **Selected work:** large editorial project modules with authentic screenshots and manual carousel controls.
3. **Impact:** four measurable proof points in a strong white/red band.
4. **Capabilities:** numbered index, no generic icon cards.
5. **Background:** two compact credential rows.
6. **Certifications:** monochrome credential rail; pause on interaction and disable motion when requested.
7. **Writing:** strong article index with dates and summaries.
8. **Footer:** black sign-off with role and back-to-top action.

### Writing index

- Keep the complete article archive.
- Use the same black/red identity, a compact masthead, strong article separators, and a clear route home.
- Titles and summaries remain the main content; avoid decorative thumbnails where none exist.

### Article pages

- Reading column around `720px` inside a wider page shell.
- Dark masthead/back link, large title, red metadata, warm-paper article body.
- Consistent styles for headings, links, blockquotes, code, tables, and images.
- Long technical content must remain comfortable at mobile widths.

### Project showcase dialog

- Full-height dark drawer with red active states.
- Preserve Projects, Clients, and Open Source tabs, keyboard behavior, Escape close, focus return, and native dialog semantics.
- Project cards use square geometry and image-first composition.

## 5. Interaction

- Interaction motion: `140–220ms`; entrance motion: `300–450ms`.
- Animate only transform and opacity where possible.
- No carousel autoplay.
- Preserve touch, trackpad, keyboard, and button navigation.
- Under `prefers-reduced-motion: reduce`, stop the credential rail and remove smooth scrolling/entrance movement.
- Hover behavior must have a keyboard-focus equivalent.

## 6. Responsive rules

- Validate at 320px, 768px, 1024px, and 1440px.
- Hero becomes one column below 900px; portrait becomes a contained identity image and never overlaps copy.
- Impact grid changes from four columns to two and then a compact mobile layout.
- Capability and background grids collapse without hiding metadata.
- Dialog project/client grids become single-column on narrow screens.
- No horizontal page overflow at 320px or 200% zoom.

## 7. Accessibility and performance

- Target WCAG 2.2 AA contrast.
- Use visible `:focus-visible` indicators with at least 3:1 contrast.
- Main actions should be at least 44px high; all controls at least 24×24px.
- Retain semantic heading order, landmarks, alternative text, and dialog labels.
- Keep the static HTML/CSS/vanilla-JS stack and add no runtime dependency.
- Preserve responsive images, lazy loading below the fold, and the transparent WebP portrait delivery asset; its cinematic-red grade must remain unmodified.
- The page must remain usable with JavaScript unavailable except for the showcase dialog and enhanced carousel controls.

## 8. Content and legal boundaries

- Keep all claims grounded in existing portfolio content.
- Do not invent customers, testimonials, awards, or impact figures.
- Do not expose the raw credential PDF because it contains personal information.
- Do not use CrowdStrike's name in visible portfolio marketing copy or copy their brand assets.

## 9. SEO and analytics

- Preserve Google Analytics, canonical URLs, JSON-LD, `robots.txt`, `sitemap.xml`, and existing article metadata.
- Keep one canonical host: `https://yogiarifwidodo.my.id`.
- Preserve descriptive titles and summaries for all writing pages.
- Favicon/social-preview work remains a separate asset task: use a `YA/W` favicon and dedicated `1200×630` portfolio preview when implemented; until then, it does not block the UI refactor.

## 10. Acceptance criteria

- Homepage, writing index, every article, showcase drawer, and footer share one coherent black/red system.
- The result is recognizably Yogi's portfolio, not a CrowdStrike replica or generic cybersecurity template.
- All existing links, project data, articles, analytics, and CV downloads continue to work.
- Keyboard navigation and reduced-motion behavior remain functional.
- No new console errors, broken local asset references, invalid internal links, or horizontal overflow in target viewports.
- Selected Work titles wrap only at word boundaries; no project name may leave a dangling character on its own line.
- Client marks retain their supplied brand colors on a neutral high-contrast surface; no grayscale filter is applied.
- Static-site checks pass.

## 11. Reference analysis

Patterns adapted from CrowdStrike's public pages:

- dark masthead and signal-red CTA hierarchy;
- oversized typographic hero;
- modular black/white section alternation;
- editorial rules and compact uppercase metadata;
- image-led feature blocks and direct action labels;
- dense resource indexes that remain easy to scan.

Official references:

- [CrowdStrike homepage](https://www.crowdstrike.com/)
- [Falcon Platform](https://www.crowdstrike.com/en-us/platform/)
- [Resource Center](https://www.crowdstrike.com/en-us/resources/)

## 12. Implementation notes

- Repository is static HTML, CSS, and vanilla JavaScript.
- `assets/css/site.css` is the shared design layer for the complete site.
- `assets/js/showcase.js` owns carousel and showcase dialog behavior and remains framework-free.
- `assets/yogiarifwidodo-photo-red-cinematic-cutout.webp` is the optimized transparent cinematic-red hero delivery asset and must be displayed without colour manipulation. Keep `assets/yogiarifwidodo-photo-red-cinematic-cutout.png` as the lossless source artwork and `assets/yogiarifwidodo-photo.png` as the fallback source.
