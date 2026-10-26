# Cozivara Living audit and fact-check report

Audit date: October 25, 2026
Project: existing Astro site in this repository

## Audit checklist

- [x] Inspected project pages, layouts, shared components, content data, styles, static assets, package scripts, and Astro configuration.
- [x] Checked the working-tree state before editing; preserved the pre-existing Astro, package, and planner work.
- [x] Reviewed route generation, common navigation, metadata, forms, shopping links, ad placeholders, and image paths.
- [x] Fact-checked all six published articles and removed or softened claims that were unsupported or too absolute.
- [x] Re-audited article wording for exaggerated outcomes, prescriptive routines, heading accuracy, and unsupported wellbeing claims.
- [x] Checked current Google publisher guidance; no fixed article word-count threshold is prescribed as a route to AdSense approval.
- [x] Confirmed ad components are placeholders; no live AdSense account or ad delivery is configured in this source tree.
- [x] Reviewed contact-form validation and draft creation; no message is transmitted by the site.
- [x] Checked internal links in generated HTML and ran the production build.
- [x] Inspected the homepage, archive, planner, About, Contact, policy pages, one category, and the plant article in the browser.
- [ ] Full visual QA at desktop, tablet, and narrow mobile sizes remains to be done.
- [ ] Complete end-to-end designer sequence remains incomplete: remove flow was skipped as requested; drag movement and local save/refresh were not verified in this audit.

## Pages and code reviewed

Routes: `/`, `/blog`, all six article routes, all five category routes, `/about`, `/contact`, `/privacy-policy`, `/terms`, and `/design-my-room`.

Shared code and content: `src/layouts/`, `src/components/`, `src/data/posts.ts`, `src/data/categories.ts`, `src/styles/global.css`, `public/`, `astro.config.mjs`, `package.json`, `README.md`, `.env.example`, and the existing planner files under `src/components/room-designer/`.

No Netlify configuration is present in the repository. The project has no lint or automated-test script.

## Article fact-check

| Article | URL | Claims checked and sources | Outcome and remaining uncertainty |
| --- | --- | --- | --- |
| 10 Small Space Decor Ideas for a More Open Apartment | `/blog/10-small-space-decor-ideas-to-maximize-your-apartment` | Checked claims about mirrors, walking clearances, shelving, sconces, and fixed apartment dimensions. | **OPINION / INSPIRATION.** Reworded the mirror heading to avoid promising doubled daylight; advice is framed around layout and preference. No product specifications are endorsed. |
| How to Create a Cozy Bedroom Sanctuary on a Budget | `/blog/how-to-create-a-cozy-bedroom-sanctuary-on-a-budget` | Checked claims about evening lighting, bedding materials, rug sizes, fragrance, acoustics, and sleep/health effects. | **OPINION / INSPIRATION.** Removed unsupported physiological and health claims. Rug sizes are examples, not rules; lighting and bedding advice is framed as preference. No expert review is claimed. |
| Minimalist Home Organization Hacks for a Clutter-Free Space | `/blog/minimalist-home-organization-hacks-for-a-clutter-free-space` | Checked psychology and productivity language, fixed routines, and prescriptive organizing claims. | **OPINION / INSPIRATION.** Reframed the nightly reset as an optional short tidy and removed unsupported emotional/productivity outcomes. No research-backed outcome is claimed. |
| Warm Neutral Living Room Aesthetics: Color & Texture Guide | `/blog/warm-neutral-living-room-aesthetics-color-and-texture-guide` | Checked the 60/30/10 palette convention and named paint colors. Official product pages: [Benjamin Moore Swiss Coffee](https://www.benjaminmoore.com/en-us/paint-colors/color/OC-45/swiss-coffee) and [Sherwin-Williams Accessible Beige](https://www.sherwin-williams.com/en-us/color/color-family/neutral-paint-colors/SW7036-accessible-beige). | **OPINION / INSPIRATION.** The ratio is labeled an optional decorating guideline; color preferences are described as subjective. The named paint colors link to their official product pages. |
| Japandi Living Room Elements for Tranquil Spaces | `/blog/5-japandi-living-room-elements-for-tranquil-spaces` | Checked design claims and the Akari light history reference against the [Noguchi Museum Akari collection](https://shop.noguchi.org/collections/akari-light-sculptures). Removed a claim that the style lowers heart rate and a universal bulb-temperature rule. | **OPINION / INSPIRATION.** Primarily subjective styling guidance. The cited Akari reference supports the specific Akari discussion; cultural and historical statements beyond that are not presented as expert-reviewed. |
| 7 Indoor Plants for Neutral Home Interiors | `/blog/indoor-plants-that-elevate-neutral-home-interiors` | Checked Ficus Audrey against [North Carolina State Extension](https://plants.ces.ncsu.edu/plants/ficus-benghalensis/), ZZ plant against [UF/IFAS](https://gardeningsolutions.ifas.ufl.edu/plants/houseplants/zz-plant/), rubber plant against [Clemson Cooperative Extension](https://hgic.clemson.edu/factsheet/rubber-plant/), pothos against [Penn State Extension](https://extension.psu.edu/pothos-as-a-houseplant), Monstera against [UConn Extension](https://homegarden.cahnr.uconn.edu/factsheets/monstera-deliciosa/), air-cleaning claims against a [peer-reviewed review indexed by PubMed](https://pubmed.ncbi.nlm.nih.gov/31695112/), and pet safety against [UGA Cooperative Extension](https://extension.uga.edu/publications/detail.html?number=C1245&title=keep-your-pets-safe-around-plants). | **PARTIALLY VERIFIED.** Specific plant care is linked to extension sources where available. The olive-tree advice remains general and asks readers to check conditions and local guidance. |

## Repairs made

- Removed fictitious subscriber counts, placeholder ad/verification identifiers, fake submission-success states, unsupported author credentials, and unsupported affiliate or product-price claims.
- Contact is configured for Netlify Forms in production and uses an email-draft fallback on localhost. Netlify form capture and notification delivery still require the account-side settings in `docs/netlify-launch-checklist.md`. Newsletter signup states that it is unavailable and links to an email draft.
- Contact fields now set sensible length limits and browser autocomplete, show the selected subject as readable text in the email draft, and explain that the visitor must send the draft. Direct email remains available if no email app opens.
- Article edits remove overpromises (for example, mirrors “doubling” natural light), pseudo-scientific psychology or sleep language, mandatory decor ratios, and one-size-fits-all routines. Table-of-contents labels now match edited headings.
- Retailer buttons are identified as search links for similar items. Prices and “best” product assertions were removed.
- Corrected related-article filtering and metadata that previously implied modified dates or search capability not supported by the site.
- Updated privacy and terms copy to describe the current local-storage, external-resource, email-draft, and retailer-link behavior.
- Corrected several designer TypeScript issues: mesh scaling was attached to geometry elements, and the palette description field did not match its declared type. Planner catalog and UI price fields were removed; existing placement and room-state logic was preserved.
- Replaced the inaccurate README with the current route map, scripts, and feature behavior.

## AdSense and contact findings

Google does not publish a minimum article word count that guarantees AdSense approval. Its publisher guidance focuses on original, useful content, site readiness, and policy compliance; adding filler to reach an arbitrary length would not address those criteria. The six posts are primarily home-decor inspiration. Their suggestions are labeled or worded as preferences, and factual plant-care or product-color statements link to relevant sources. The site still needs a human editorial review for originality, author transparency, and completeness before an application; no source audit can guarantee acceptance.

AdSense is off unless a valid publisher ID and explicit Auto Ads setting are provided. Without approval credentials, this build has no live ad script and no visible placeholder ads. A valid ID generates Google's verification meta tag and an `ads.txt` record.

The Contact page is a Netlify Forms HTML form with required name, valid email, subject, message, length limits, and a honeypot. Netlify form detection and an email notification recipient still need to be enabled in the account. Localhost opens an email draft instead. No test message was transmitted.

## Netlify launch preparation (October 25, 2026)

- Added `netlify.toml` for Astro's `npm run build` and `dist` output.
- Added a custom no-index contact success route and excluded it from the sitemap.
- Added optional Google Search Console, Pinterest site-claim, and AdSense environment-variable hooks; unset values do not emit placeholder verification tokens or IDs.
- The Pinterest profile remains unlinked because no account exists yet. Existing article Pin buttons still open Pinterest's save flow.
- Added build-generated `/ads.txt`; it is empty until a real AdSense publisher ID is configured.
- Moved font loading from CSS `@import` into preconnected head links, and applied the existing Playfair Display font with tabular number styling to planner metrics and dimensions.
- The planner entry imports the React Three Fiber application as a separate lazy-loaded chunk. The small entry chunk is 2.71 kB (1.53 kB gzip); the 3D code is still 952.16 kB minified (254.10 kB gzip), loaded only on the planner route. This is not a Netlify storage limit issue, but the browser still downloads the 3D chunk when opening the planner.
- Netlify account-side items still required: connect the site/domain, enable Forms detection, set a notification address, add Search Console verification, create/claim Pinterest if desired, and apply for AdSense. Configure consent controls before enabling advertising in regions where required.
- `npm run build`: **passed**, 19 routes; `npx tsc --noEmit`: **passed**.
- Static output checks: **passed** for contact form detection markup, success route, no-index sitemap exclusion, production canonical, default-off AdSense, no placeholder Pinterest verification, and lazy planner chunk output.
- Responsive browser and deployed Netlify submission tests remain pending; this local build cannot verify account processing or email notifications.

## Validation results

- `npm run build`: **passed**, 18 static pages generated.
- `tsc --noEmit`: **passed** after planner type fixes.
- Astro's `astro check`: **not run**; Astro prompted to install the missing `@astrojs/check` package. No dependency was installed.
- `git diff --check`: **passed**; Git emitted line-ending conversion notices on modified files.
- Generated HTML route scan: **passed**, 20 distinct internal paths checked across 18 generated pages, no missing targets.
- Browser inspection: homepage, article archive, planner, About, Contact, Privacy Policy, Terms, Small Spaces category, and plant article opened successfully. Contact form fields and email-draft button were visible; the form was not submitted.
- Existing planner state showed 12 × 14 ft, 168 sq ft, and 8 placed items. The room was not changed during this audit. The deletion flow was skipped as requested. The production bundle warns that the planner chunk is approximately 946 kB minified (252 kB gzip).

## Remaining checks

- Test the planner's drag, save-and-refresh, and removal behavior in a disposable fresh room; do not use a browser profile containing a saved design for destructive tests.
- Review responsive layouts and keyboard behavior at narrow mobile and tablet widths.
- Add `@astrojs/check` and an explicit lint/test setup if the site owner wants those checks available in the project.
- Confirm hosting-provider privacy behavior and add deployment configuration for the provider selected by the site owner.
