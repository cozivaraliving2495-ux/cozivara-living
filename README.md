# Cozivara Living 🌿

> **"Make room for beautiful living"**  
> *A high-converting, ultra-fast, aesthetic Home Decor & Lifestyle blogging platform built with Astro.js, Tailwind CSS, and Pinterest-driven growth architecture.*

---

## 🎨 Brand Identity & Design System

- **Warm Organic Neutral Palette**:
  - Background Light: `#FAF7F2` (Warm Ivory / Off-White)
  - Primary Text / Dark Neutral: `#2B2523` (Warm Deep Charcoal)
  - Accent / Botanical Green: `#5E6E53` (Muted Olive Green)
  - Hover Accent: `#485540`
  - Soft Taupe / Secondary Accent: `#C4A484` & `#D4C5B9`
  - Card Background: `#FFFFFF` (Pure White with `#EBE5DF` border)
  - Footer Background: `#222820` (Dark Olive Slate)
- **Typography**:
  - Headings: Serif (`Playfair Display`, Google Fonts)
  - Body: Modern Sans-Serif (`Plus Jakarta Sans`, Google Fonts)

---

## 📬 Official Contact & Support
- **Official Email**: `cozivaraliving2495@gmail.com`
- **Response Time**: 24–48 hours for brand partnerships, media inquiries, or general home decor feedback.
- **Pinterest Profile**: `@CozivaraLiving`

---

## 🚀 Key Features

1. **Pixel-Perfect Home Page (`src/pages/index.astro`)**:
   - Announcement Top Bar with tagline: "Make room for beautiful living"
   - Sticky Header with brand logo, category navigation, social icons (Pinterest, Instagram, Search), and mobile drawer
   - High-impact Hero section with natural photo grading and primary "Explore Ideas →" CTA
   - 5-Column Circular Category grid with hover zoom & directional indicators
   - 4-Column responsive post grid featuring top Pinterest trends:
     1. *10 Small Space Decor Ideas to Maximize Your Apartment*
     2. *How to Create a Cozy Bedroom Sanctuary on a Budget*
     3. *Minimalist Home Organization Hacks for a Clutter-Free Space*
     4. *Warm Neutral Living Room Aesthetics: Color & Texture Guide*
   - Newsletter capture banner with botanical branch art and email submission state
   - Full dark-themed footer with quick links, categories, direct contact email, and legal disclosures

2. **Pinterest-Optimized Architecture**:
   - Floating / sticky **Save to Pinterest** hover button on all post cards and featured images
   - Dedicated 2:3 vertical Pin card callout in article layout
   - Automatic pre-filled Pinterest sharing parameters (`url`, `media`, `description`)
   - Rich Pin meta tags (`og:type="article"`, `article:published_time`, `article:author`)
   - Pinterest domain verification tag (`p:domain_verify`)

3. **Google AdSense Ready**:
   - Modular `<AdSlot position="top" | "in-article" | "sidebar" | "bottom" />` components
   - Compliant "Advertisement" labeling as mandated by Google AdSense policies
   - Clean preview/placeholder mode for layout inspection without invalid ad impressions
   - Non-blocking asynchronous script loader with error handling

4. **SEO & Google E-E-A-T Excellence**:
   - Comprehensive OpenGraph and Twitter Card metadata
   - Automated JSON-LD structured data: `WebSite`, `Organization`, `BlogPosting`, `BreadcrumbList`
   - Canonical URLs, XML Sitemap generation via `@astrojs/sitemap`, and `robots.txt`
   - Real Author bios, editorial standards disclosure, and affiliate transparency statements

5. **Fast Client-Side Instant Search**:
   - Interactive search modal accessible via top bar, nav icon, or `Cmd+K` / `Ctrl+K`
   - Instant search across article titles, categories, and excerpts with quick suggested filters

---

## 📁 Project Structure

```
cozivara-living/
├── public/
│   ├── images/
│   │   ├── logo.jpg               # Clean emblem logo
│   │   ├── logo-3d.jpg            # 3D emblem logo
│   │   └── mockup-reference.jpg   # Mockup design reference
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AdSlot.astro           # Google AdSense component
│   │   ├── AnnouncementBar.astro  # Top announcement banner
│   │   ├── CategoryGrid.astro     # 5 circular category items
│   │   ├── Footer.astro           # Complete brand footer
│   │   ├── Header.astro           # Sticky nav with mobile drawer
│   │   ├── HeroSection.astro      # Hero banner
│   │   ├── NewsletterBox.astro    # Email subscription section
│   │   ├── PinterestSaveButton.astro # Interactive Pinterest save button
│   │   ├── PostCard.astro         # Modular post card with badges
│   │   ├── SearchModal.astro      # Client-side instant search modal
│   │   ├── SocialShare.astro      # Pinterest, Facebook, X, & link copy
│   │   └── TableOfContents.astro  # Auto-generated article TOC
│   ├── data/
│   │   ├── categories.ts          # Category definitions & styling
│   │   └── posts.ts               # Blog post content & metadata
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Root layout with SEO & AdSense
│   │   └── BlogPostLayout.astro   # Single article template
│   ├── pages/
│   │   ├── index.astro            # Homepage matching mockup
│   │   ├── about.astro            # E-E-A-T About & Team page
│   │   ├── contact.astro          # Contact form & press inquiries
│   │   ├── privacy-policy.astro   # AdSense & GDPR compliant policy
│   │   ├── terms.astro            # Terms of service
│   │   ├── blog/
│   │   │   ├── index.astro        # All stories archive & filter
│   │   │   └── [...slug].astro    # Dynamic single article pages
│   │   └── category/
│   │       └── [category].astro   # Dynamic category archive pages
│   └── styles/
│       └── global.css             # Typography, fonts & custom styling
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

---

## 🛠️ Development & Deployment

### Install Dependencies:
```bash
npm install
```

### Run Local Development Server:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Preview Built Site:
```bash
npm run preview
```
