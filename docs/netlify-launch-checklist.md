# Netlify launch checklist

## Deploy the site

The repository's `netlify.toml` sets the build command to `npm run build`, the publish directory to `dist`, and Node.js to 20. Connect the GitHub repository in Netlify and confirm the base directory is the repository root. Netlify Forms must be enabled in the site's Forms settings before the contact form can receive messages.

After the first production deploy:

1. **Configured:** Netlify Forms detection is enabled and an email notification is configured for new submissions at `cozivaraliving2495@gmail.com`. It currently applies to any form; `contact` is the only active form.
2. **Still to verify:** Submit one test message from the deployed `/contact` page using an address you control. Confirm it appears under Forms → `contact`, the browser reaches `/contact-success`, and the notification arrives in the inbox (including spam).
3. **Still to verify:** Open `/robots.txt` and `/sitemap-index.xml` on the production domain. `/ads.txt` is expected to be empty until a real AdSense publisher ID is configured.

Local development uses a `mailto:` fallback. A successful local email-draft test does not prove Netlify captured a deployment form submission.

## Search engine setup

- `astro.config.mjs` declares `https://cozivaraliving.com` as the canonical site origin and the sitemap integration generates a sitemap at build time. Confirm this is the final domain before launch; change the configured origin if the production domain differs.
- **Pending:** Add the domain as a property in Google Search Console. If using HTML-tag verification, copy its exact token to `PUBLIC_GOOGLE_SITE_VERIFICATION` in Netlify's environment variables, then redeploy. DNS TXT verification can instead be completed at the domain host.
- **Pending:** Submit `https://cozivaraliving.com/sitemap-index.xml` in Search Console after the domain resolves over HTTPS.
- The project emits canonical, Open Graph, Twitter, and JSON-LD metadata. Verify a sample production article URL and its featured image after deployment.

## Pinterest account and website claim

The Pinterest share buttons link to Pinterest's Pin-creation flow. The header and footer link to the Cozivara Living Pinterest account. The profile URL can be overridden with `PUBLIC_PINTEREST_PROFILE_URL` if the account URL changes.

The Pinterest profile is linked on the site. To claim `cozivaraliving.com`, obtain the verification value from Pinterest, set it in Netlify, and redeploy:

- `PUBLIC_PINTEREST_VERIFICATION` — the token from Pinterest's HTML-tag verification method. DNS TXT verification is another option and does not require this variable.

The optional verification token is emitted as Pinterest's `p:domain_verify` meta tag. Domain claim verification is separate from linking the public profile.

## AdSense account and consent

AdSense approval is pending and no publisher ID has been provided. Ads remain off and ad placeholders are hidden. Do not publish a sample or someone else's publisher ID.

After Google gives the account its publisher ID, set `PUBLIC_ADSENSE_CLIENT_ID` to the exact `ca-pub-` value in Netlify. The build then emits Google's site-verification meta tag and the matching `pub-` record at `/ads.txt`. Request a site review from the AdSense account. Ads cannot serve until Google marks the site Ready.

Only after approval, set `PUBLIC_ADSENSE_AUTO_ADS=true` if you choose to use Auto ads and redeploy. Before serving ads to regions that require consent, configure Google's certified consent management option in AdSense and keep the Privacy Policy accurate. Auto ads can then choose placements; no per-slot IDs or invented placements are included in this project.

The same client ID can be used for AdSense's publisher verification meta tag; the code does not load the ad script unless Auto ads are explicitly enabled. Google's setup flow may instead provide an exact code snippet; follow the version currently shown in the account.

## Email and privacy

The Netlify contact form collects only the name, email address, subject, and message fields. Configure the form's notification recipient in Netlify and review Netlify's data processing and retention terms. The privacy page describes Netlify Forms, local-development behavior, external fonts/images, and the optional AdSense state. The site does not currently collect newsletter subscriptions.

## Remaining account-owner tasks

- Confirm the production domain and HTTPS are configured in Netlify/DNS.
- Verify an actual contact form submission and notification delivery.
- Add the site's Search Console verification method and submit the sitemap.
- Claim the website in the existing Pinterest account using its real verification token if desired.
- Complete AdSense review; add the real publisher ID only when issued. Configure consent and Auto ads only when appropriate.
