import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const pinDir = path.join(root, 'public', 'images', 'pinterest');
const articleDir = path.join(root, 'public', 'images', 'articles');
const logoPath = path.join(root, 'public', 'images', 'logo.jpg');
await fs.mkdir(pinDir, { recursive: true });
await fs.mkdir(articleDir, { recursive: true });

const campaigns = [
  {
    slug: 'living-room-furniture-flow',
    source: 'marketing/pinterest/warm-neutral-featured.jpg',
    title: ['LIVING ROOM', 'FURNITURE', 'LAYOUT IDEAS'],
    subtitle: ['Create a room that feels', 'easy to move through.'],
    badge: 'A PRACTICAL ROOM-BY-ROOM GUIDE',
    alt: 'Neutral living room with sofa seating and a coffee table, used for a furniture-flow layout guide.',
    description: 'Plan a comfortable living room layout around your focal point, conversation seating, and clear everyday walking paths. Read Cozivara Living’s measuring-first guide before rearranging your sofa and chairs.',
    board: 'Living Room Ideas',
    keywords: 'living room layout, living room furniture arrangement, furniture flow, living room design, Cozivara Living',
    diagram: false,
  },
  {
    slug: 'curtains-window-treatment-guide',
    source: 'marketing/pinterest/bedroom-featured.jpg',
    title: ['HOW TO CHOOSE', 'CURTAINS &', 'WINDOW TREATMENTS'],
    subtitle: ['Balance privacy, daylight,', 'fabric, and the finished length.'],
    badge: 'MEASURE FIRST • STYLE WITH PURPOSE',
    alt: 'Soft neutral bedroom with full-height curtains beside a window, used for a window-treatment guide.',
    description: 'Choose curtains and window treatments with a clear plan for privacy, daylight, fabric opacity, and measurements. Includes practical layering and care checks for real homes.',
    board: 'Curtain & Window Ideas',
    keywords: 'curtain ideas, window treatments, living room curtains, bedroom curtains, privacy and light control',
    diagram: false,
  },
  {
    slug: 'small-dining-room-layout-guide',
    source: 'marketing/pinterest/organization-source.jpg',
    title: ['SMALL DINING', 'ROOM LAYOUT', 'THAT FEELS OPEN'],
    subtitle: ['Make room for chairs,', 'conversation, and daily flow.'],
    badge: 'SMART SMALL-SPACE PLANNING',
    alt: 'Modern home interior with warm wood flooring, used as the backdrop for a small dining-layout planning graphic.',
    description: 'Make a compact dining area more comfortable with a table sized for your routine, flexible seating, room for chairs to move, and a clear path through the space.',
    board: 'Small Dining Room Ideas',
    keywords: 'small dining room ideas, small dining room layout, compact dining table, small space seating, dining nook',
    diagram: true,
  },
  {
    slug: 'forest-themed-home-decor',
    source: 'marketing/pinterest/indoor-plants-source.jpg',
    title: ['FOREST-INSPIRED', 'HOME DECOR', 'IDEAS'],
    subtitle: ['Bring depth, greenery, and', 'natural texture into your room.'],
    badge: 'PINTEREST TRENDS • HOME DECOR',
    alt: 'A small potted succulent on a pale background, used as an editorial accent for forest-inspired home decor.',
    description: 'Explore the forest-themed home decor look with layered greens, warm wood, botanical patterns, and tactile accents. This practical guide shows how to bring the mood into a real home without overdoing the theme.',
    board: 'Forest & Botanical Home Decor',
    keywords: 'forest-themed home decor, woodland home decor, botanical decor, forest green room, nature-inspired interiors',
    diagram: false,
  },
];

function esc(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function pinSvg(campaign) {
  const title = campaign.title.map((line, index) => `<text x="500" y="${820 + index * 82}" text-anchor="middle" class="title">${esc(line)}</text>`).join('');
  const subtitle = campaign.subtitle.map((line, index) => `<text x="500" y="${1120 + index * 43}" text-anchor="middle" class="subtitle">${esc(line)}</text>`).join('');
  const diagram = campaign.diagram ? `
    <g transform="translate(295 500)">
      <rect x="0" y="0" width="410" height="190" rx="24" fill="#f8f4eb" fill-opacity=".94"/>
      <text x="205" y="42" text-anchor="middle" class="diagram-label">TEST THE TABLE FOOTPRINT</text>
      <rect x="130" y="72" width="150" height="76" rx="10" fill="#a67f57"/>
      <circle cx="92" cy="110" r="20" fill="#68745d"/><circle cx="318" cy="110" r="20" fill="#68745d"/>
      <circle cx="205" cy="58" r="20" fill="#68745d"/><circle cx="205" cy="162" r="20" fill="#68745d"/>
      <path d="M45 175h320" stroke="#b7aa96" stroke-width="2" stroke-dasharray="7 8"/>
    </g>` : '';

  return Buffer.from(`<svg width="1000" height="1500" viewBox="0 0 1000 1500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151911" stop-opacity="0"/><stop offset=".39" stop-color="#151911" stop-opacity=".18"/><stop offset="1" stop-color="#151911" stop-opacity=".88"/></linearGradient>
      <style>
        .brand { font: 700 27px Georgia,serif; letter-spacing: 1px; fill: #283126; }
        .brand-small { font: 500 14px Arial,sans-serif; letter-spacing: 5px; fill: #68745d; }
        .badge { font: 700 17px Arial,sans-serif; letter-spacing: 2.5px; fill: #f7f1e5; }
        .title { font: 700 62px Georgia,serif; letter-spacing: 1px; fill: #fffdf8; }
        .subtitle { font: 400 27px Arial,sans-serif; fill: #f6f1e8; }
        .cta { font: 700 17px Arial,sans-serif; letter-spacing: 1.25px; fill: #fffdf8; }
        .diagram-label { font: 700 15px Arial,sans-serif; letter-spacing: 1.5px; fill: #46523f; }
      </style>
    </defs>
    <rect width="1000" height="1500" fill="url(#shade)"/>
    <rect x="48" y="45" width="904" height="164" rx="28" fill="#fbf7ef" fill-opacity=".96"/>
    <circle cx="132" cy="127" r="63" fill="#e9dfce"/>
    ${diagram}
    <text x="222" y="122" class="brand">COZIVARA LIVING</text>
    <text x="223" y="153" class="brand-small">BEAUTIFUL SPACES. BETTER LIVING.</text>
    <text x="500" y="735" text-anchor="middle" class="badge">${esc(campaign.badge)}</text>
    <path d="M395 760h210" stroke="#d8c4a4" stroke-width="3"/>
    ${title}
    ${subtitle}
    <rect x="134" y="1260" width="732" height="80" rx="40" fill="#66745c"/>
    <text x="500" y="1310" text-anchor="middle" class="cta">READ THE GUIDE  •  COZIVARALIVING.NETLIFY.APP</text>
    <rect x="22" y="22" width="956" height="1456" rx="32" fill="none" stroke="#fffaf1" stroke-opacity=".72" stroke-width="3"/>
  </svg>`);
}

for (const campaign of campaigns) {
  const source = path.join(root, campaign.source);
  const articleImage = path.join(articleDir, `${campaign.slug}.webp`);
  const pinImage = path.join(pinDir, `${campaign.slug}.jpg`);
  await sharp(source).resize({ width: 1400, height: 1800, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(articleImage);

  const background = await sharp(source).resize({ width: 1000, height: 1500, fit: 'cover', position: 'attention' }).composite([{ input: pinSvg(campaign) }]).jpeg({ quality: 89, mozjpeg: true }).toBuffer();
  const logoOverlay = await sharp(logoPath).resize(116, 116, { fit: 'cover' }).composite([{ input: Buffer.from('<svg width="116" height="116"><circle cx="58" cy="58" r="56" fill="none" stroke="#a99476" stroke-width="4"/></svg>') }]).png().toBuffer();
  await sharp(background).composite([{ input: logoOverlay, left: 74, top: 69 }]).jpeg({ quality: 90, mozjpeg: true }).toFile(pinImage);

  const articleSlug = campaign.slug === 'living-room-furniture-flow' ? 'how-to-arrange-living-room-furniture-for-better-flow' : campaign.slug === 'curtains-window-treatment-guide' ? 'how-to-choose-curtains-and-window-treatments' : campaign.slug === 'small-dining-room-layout-guide' ? 'small-dining-room-layout-ideas-that-feel-open' : 'forest-inspired-home-decor';
  const siteLink = `https://cozivaraliving.netlify.app/blog/${articleSlug}/`;
  const title = campaign.title.join(' ').replaceAll('&', 'and').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  const description = `${campaign.description}\n\nExplore more practical home styling ideas from Cozivara Living.`;
  await fs.writeFile(path.join(root, 'marketing', 'pinterest', `${campaign.slug}-copy.txt`),
    `PIN TITLE\n${title}\n\nDESCRIPTION\n${description}\n\nDESTINATION LINK\n${siteLink}\n\nSUGGESTED BOARD\n${campaign.board}\n\nALT TEXT\n${campaign.alt}\n\nKEYWORDS\n${campaign.keywords}\n\nIMAGE\npublic/images/pinterest/${campaign.slug}.jpg (1000 × 1500 px)\n`, 'utf8');
}
