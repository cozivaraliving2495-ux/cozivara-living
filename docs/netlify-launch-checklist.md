# Netlify launch checklist

## Deploy the site

The repository's `netlify.toml` sets the build command to `npm run build`, the publish directory to `dist`, and Node.js to 20. Connect the GitHub repository in Netlify and confirm the base directory is the repository root. Netlify Forms must be enabled in the site's Forms settings before the contact form can receive messages.

After the first production deploy:

1. **Configured:** Netlify Forms detection is enabled and an email notification is configured for new submissions at `cozivaraliving2495@gmail.com`. It currently applies to any form; `contact` is the only active form.
2. **Still to verify:** Submit one test message from the deployed `/contact` page using an address you control. Confirm it appears under Forms → `contact`, the browser reaches `/contact-success`, and the notification arrives in the inbox (including spam).
3. **Still to verify:** Open `/robots.txt` and `/sitemap-index.xml` on the production domain. `/ads.txt` is expected to be empty until a real AdSense publisher ID is configured.

Local development uses a `mailto:` fallback. A successful local email-draft test does not prove Netlify captured a deployment form submission.

## Search engine setup

- The current production origin is `https://cozivaraliving.netlify.app`. `astro.config.mjs` and the generated `robots.txt` use `PUBLIC_SITE_URL` when supplied and otherwise fall back to that Netlify origin; canonical tags, robots.txt, and the sitemap therefore stay aligned. Set `PUBLIC_SITE_URL` in Netlify if the primary domain changes.
- **Pending:** Add the domain as a property in Google Search Console. If using HTML-tag verification, copy its exact token to `PUBLIC_GOOGLE_SITE_VERIFICATION` in Netlify's environment variables, then redeploy. DNS TXT verification can instead be completed at the domain host.
- **Pending:** Add/verify the current `https://cozivaraliving.netlify.app/` URL-prefix property in Search Console, then submit `https://cozivaraliving.netlify.app/sitemap-index.xml`. A property for an older Netlify subdomain does not represent this current origin.
- The project emits canonical, Open Graph, Twitter, and JSON-LD metadata. Verify a sample production article URL and its featured image after deployment.

## Google Analytics 4

- `netlify.toml` currently configures Measurement ID `G-67MFCBXEKB`. Confirm in GA4 that this ID belongs to the intended Web data stream and update it in Netlify if the stream differs.
- The site validates the ID and loads the Google tag only after a visitor chooses “Allow analytics.” “Only necessary” prevents loading; the choice can be changed from Privacy settings in the footer. Visits without consent, browser tracking protection, and ad blockers will not appear in GA4.
- Verify the tag in Google Analytics Realtime or with Tag Assistant after allowing analytics. Do not expect visitors who decline analytics to appear in GA4.

## Pinterest account and website claim

The Pinterest share buttons link to Pinterest's Pin-creation flow. The header and footer link to the Cozivara Living Pinterest account. The profile URL can be overridden with `PUBLIC_PINTEREST_PROFILE_URL` if the account URL changes.

The Pinterest profile is linked on the site. To claim `cozivaraliving.netlify.app`, obtain the verification value from Pinterest, set it in Netlify, and redeploy:

- `PUBLIC_PINTEREST_VERIFICATION` — the token from Pinterest's HTML-tag verification method. DNS TXT verification is another option and does not require this variable.

The optional verification token is emitted as Pinterest's `p:domain_verify` meta tag. Domain claim verification is separate from linking the public profile.

## AdSense account and consent

AdSense approval is pending and no publisher ID has been provided. Ads remain off and ad placeholders are hidden. Do not publish a sample or someone else's publisher ID.

After Google gives the account its publisher ID, set `PUBLIC_ADSENSE_CLIENT_ID` to the exact `ca-pub-` value in Netlify. The build then emits Google's site-verification meta tag and the matching `pub-` record at `/ads.txt`. Request a site review from the AdSense account. Ads cannot serve until Google marks the site Ready.

Only after approval, set `PUBLIC_ADSENSE_AUTO_ADS=true` if you choose to use Auto ads and redeploy. Before serving ads to regions that require consent, configure Google's certified consent management option in AdSense and keep the Privacy Policy accurate. Auto ads can then choose placements; no per-slot IDs or invented placements are included in this project.

The same client ID can be used for AdSense's publisher verification meta tag; the code does not load the ad script unless Auto ads are explicitly enabled. Google's setup flow may instead provide an exact code snippet; follow the version currently shown in the account.

## Email and privacy

The Netlify contact form collects only the name, email address, subject, and message fields. Review Netlify's data processing and retention terms. The privacy page describes Netlify Forms, local-development behavior, external fonts/images, consent-gated optional analytics, and the optional AdSense state. The site does not currently collect newsletter subscriptions.

## Remaining account-owner tasks

- Confirm the production domain and HTTPS are configured in Netlify/DNS.
- Verify an actual contact form submission and notification delivery.
- Add the site's Search Console verification method and submit the sitemap.
- Confirm the configured GA4 Measurement ID matches the intended property/data stream and verify events in Realtime after opting in.
- Claim the website in the existing Pinterest account using its real verification token if desired.
- Complete AdSense review; add the real publisher ID only when issued. Configure consent and Auto ads only when appropriate.
