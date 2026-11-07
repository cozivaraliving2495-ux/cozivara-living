import type { BlogPost } from './posts';

const AUTHOR: BlogPost['author'] = {
  name: 'Cozivara Living',
  role: 'Publisher',
  avatar: '/images/logo.jpg',
  bio: 'Cozivara Living publishes home styling ideas and practical inspiration for everyday spaces.',
};

const LIFESTYLE = {
  category: 'Lifestyle',
  categorySlug: 'lifestyle',
  categoryBadgeBg: 'bg-[#F2ECE6]',
  categoryBadgeText: 'text-[#6C5345]',
  author: AUTHOR,
};

export const FEATURED_POSTS: BlogPost[] = [
  {
    ...LIFESTYLE,
    slug: 'forest-green-terracotta-sapphire-room-palette',
    title: 'Forest Green, Terracotta & Sapphire: A Room Color Guide',
    excerpt: 'Build a confident, livable room palette with forest green, burnt terracotta, sapphire, and a calm neutral base. Includes proportions, sample colors, and easy renter-friendly accents.',
    publishDate: 'Nov 8, 2026',
    readTime: '7 min read',
    featuredImage: '/images/articles/forest-green-terracotta-sapphire.webp',
    pinImage: '/images/pinterest/forest-green-terracotta-sapphire-pin.jpg',
    imageAlt: 'A forest-green chair, leafy plants, and bold terracotta and blue wall colors in a modern living room.',
    imageCredit: {
      name: 'Fujiphilm',
      photoUrl: 'https://unsplash.com/photos/colorful-living-room-with-geometric-wall-design-and-plants-IGTzLb0QMvA/',
    },
    pinterestDescription: 'Try a room palette of forest green, burnt terracotta, sapphire blue, and warm ivory. See how to balance bold color with wood, textiles, and light in this practical living-room guide.',
    headings: [
      { depth: 2, slug: 'start-with-a-warm-neutral-base', text: 'Start With a Warm Neutral Base' },
      { depth: 2, slug: 'choose-one-dominant-deep-color', text: 'Choose One Dominant Deep Color' },
      { depth: 2, slug: 'bring-in-terracotta-for-warmth', text: 'Bring In Terracotta for Warmth' },
      { depth: 2, slug: 'use-sapphire-and-plum-as-small-accents', text: 'Use Sapphire and Plum as Small Accents' },
      { depth: 2, slug: 'balance-color-with-material-and-light', text: 'Balance Color With Materials and Light' },
      { depth: 2, slug: 'test-the-palette-before-you-commit', text: 'Test the Palette Before You Commit' },
      { depth: 2, slug: 'a-simple-color-shopping-checklist', text: 'A Simple Color Shopping Checklist' },
    ],
    contentHtml: `
      <p>Deep colors can make a living room feel personal and layered, but several saturated shades need a little structure. A useful starting point is to choose one main color, one warm supporting color, and one smaller accent, then give them room to breathe with a light neutral. This guide adapts a jewel-and-earth palette of forest green, terracotta, sapphire, plum, charcoal, and warm ivory for everyday homes.</p>
      <p>There is good reason to look beyond cool gray. A 2026 survey of interior design professionals by <a href="https://www.fixr.com/articles/interior-design-color-trends" target="_blank" rel="noopener noreferrer">Fixr's Interior Design Color Trends report</a> found restorative greens, nature-inspired neutrals, and deep browns among the colors designers expect to see. Treat that survey as a snapshot of professional opinion, not a guarantee that a particular color will suit every home.</p>

      <h2 id="start-with-a-warm-neutral-base">Start With a Warm Neutral Base</h2>
      <p>Try warm ivory (<code>#F3EEE5</code>) on the largest surfaces: walls, ceiling, or a large rug. It softens the contrast between dark upholstery and warm accents, and it gives art and wood finishes a calmer backdrop. If you already have white walls, oak floors, or a beige sofa, those can serve as the neutral; there is no need to repaint simply to follow a palette.</p>
      <p>In a small or north-facing room, keep more of the wall area light and add deep color through a sofa, curtains, cushions, or a single painted feature. A dark room can still be beautiful, but test how the color reads in the actual light before painting every wall.</p>

      <h2 id="choose-one-dominant-deep-color">Choose One Dominant Deep Color</h2>
      <p>Forest green (<code>#174A3C</code>) works well as an anchor because it relates naturally to plants, wood, and garden views. Use it on one substantial element, such as an upholstered sofa, a pair of curtains, a bookcase, or one feature wall. If green is not your favorite, let plum (<code>#71364A</code>) or midnight sapphire (<code>#203B64</code>) take that role instead.</p>
      <p>Pick one of those deep shades to lead. Putting green, plum, sapphire, charcoal, and terracotta on equally large surfaces can make the room feel busy and darker than expected. If you want several of them, reserve the others for smaller details.</p>

      <h2 id="bring-in-terracotta-for-warmth">Bring In Terracotta for Warmth</h2>
      <p>Burnt terracotta (<code>#C45E3D</code>) adds an earthy counterpoint to green and blue. Bring it in with a cushion, a ceramic lamp, a throw, an artwork detail, or a small side table. Repeating the shade in two places usually feels more intentional than scattering many unrelated warm colors around the room.</p>
      <p>For a stronger look, use terracotta on a wall or a larger textile and let the other colors stay quieter. For a softer look, choose a muted clay or rust instead of a bright orange-red. Paint names vary by maker, so use the hex values here only as screen references; compare real paint cards and fabric samples in your home.</p>

      <h2 id="use-sapphire-and-plum-as-small-accents">Use Sapphire and Plum as Small Accents</h2>
      <p>Sapphire, plum, and charcoal can add depth without taking over. Try one in a patterned cushion, a framed print, a lampshade, or a small painted cabinet. Charcoal (<code>#2B2C2E</code>) is useful for a narrow line of contrast in a frame, table leg, or hardware; it need not become another dominant surface.</p>
      <p>A practical proportion to test is roughly 60% warm neutral, 30% of one main color, and 10% supporting accents. It is a planning guide rather than a rule. If the room looks too colorful, reduce the accent area first; if it feels flat, add texture before introducing a fourth strong shade.</p>

      <h2 id="balance-color-with-material-and-light">Balance Color With Materials and Light</h2>
      <p>Color is only one part of the room. Pair deep green with warm wood, terracotta with linen or matte pottery, and sapphire with a natural fiber rug or pale oak. A mix of smooth, soft, and woven surfaces keeps the scheme from looking like a row of paint chips.</p>
      <p>Notice the light in the room at different times of day. A color that looks calm in morning daylight can appear much warmer or darker under an evening bulb. Use lamps where people read or gather, and check that any dimmer and bulb are compatible with the fixture.</p>

      <h2 id="test-the-palette-before-you-commit">Test the Palette Before You Commit</h2>
      <p>Make a small board from paint cards, fabric swatches, a wood sample, and one photo of your existing floor or sofa. View it beside the room's fixed finishes. If painting, sample a generous patch on more than one wall and look at it in daylight and at night. For removable accents, try a pillow or throw before buying a full set.</p>
      <p>Renters can get the same feeling with art, freestanding furniture, textiles, and lamps. Check the lease before using peel-and-stick products or changing wall finishes, and test removable materials on an inconspicuous area according to the maker's instructions.</p>

      <h2 id="a-simple-color-shopping-checklist">A Simple Color Shopping Checklist</h2>
      <ul>
        <li>Keep the largest surfaces warm and neutral unless the room has enough light for a deeper scheme.</li>
        <li>Choose one dominant shade: forest green, plum, or sapphire.</li>
        <li>Add terracotta through one or two repeatable accents.</li>
        <li>Use charcoal and the remaining jewel tones in small details.</li>
        <li>Compare real samples beside the floor, upholstery, and window light before buying.</li>
      </ul>
      <p>The strongest palette is the one that works with the things you already own and the way you use the room. Start with one bold piece, repeat its color thoughtfully, and let the rest of the space support it.</p>
    `,
  },
  {
    ...LIFESTYLE,
    slug: 'neodeco-living-room-ideas-2026',
    title: 'NeoDeco Living Room Ideas: Geometric Decor With a Modern Edge',
    excerpt: 'Make the 2026 NeoDeco look feel livable with fan and arch shapes, warm metals, sculptural lighting, and a restrained color plan—without turning your room into a set.',
    publishDate: 'Nov 8, 2026',
    readTime: '7 min read',
    featuredImage: '/images/articles/neodeco-terracotta-room.webp',
    pinImage: '/images/pinterest/neodeco-living-room-pin.jpg',
    imageAlt: 'A cozy terracotta-toned room with a geometric rug, warm lamp, and simple framed graphic art.',
    imageCredit: {
      name: 'Olivier Amyot',
      photoUrl: 'https://unsplash.com/photos/a-cozy-room-with-terracotta-walls-and-a-glowing-lamp-JXDT1jwNPMk',
    },
    pinterestDescription: 'Explore NeoDeco living-room ideas for 2026: curved silhouettes, fan and arch shapes, warm metal accents, sculptural lighting, and a simple way to balance bold details.',
    headings: [
      { depth: 2, slug: 'what-neodeco-means-for-a-living-room', text: 'What NeoDeco Means for a Living Room' },
      { depth: 2, slug: 'begin-with-one-geometric-motif', text: 'Begin With One Geometric Motif' },
      { depth: 2, slug: 'add-metal-with-a-light-touch', text: 'Add Metal With a Light Touch' },
      { depth: 2, slug: 'choose-curves-and-comfortable-shapes', text: 'Choose Curves and Comfortable Shapes' },
      { depth: 2, slug: 'keep-the-color-plan-edited', text: 'Keep the Color Plan Edited' },
      { depth: 2, slug: 'make-the-look-work-in-a-rental', text: 'Make the Look Work in a Rental' },
      { depth: 2, slug: 'a-neodeco-living-room-checklist', text: 'A NeoDeco Living Room Checklist' },
    ],
    contentHtml: `
      <p>NeoDeco is a modern take on Art Deco: graphic geometry, rounded silhouettes, expressive materials, and a little shine. Pinterest included NeoDeco among its 2026 home trends, describing a renewed interest in details such as geometric forms, chrome or brass, pendant lighting, and vintage-inspired pieces. Pinterest's <a href="https://business.pinterest.com/en-gb/pdf/pinterest-predicts/2026-trend-report/" target="_blank" rel="noopener noreferrer">Predicts 2026 report</a> is based on platform search activity; it points to inspiration people are exploring, not a guarantee of what every home should look like.</p>
      <p>The easiest way to use the idea is to borrow one or two details rather than recreate a period interior. A geometric rug, a curved chair, or a warm metal lamp can give a familiar living room a more considered focal point.</p>

      <h2 id="what-neodeco-means-for-a-living-room">What NeoDeco Means for a Living Room</h2>
      <p>Think of NeoDeco as a set of visual cues, not a shopping list. Fan shapes, arches, stepped forms, graphic lines, polished metal, and jewel-like color can all suggest the style. They do not need to appear together. Modern materials and simpler furniture help keep the room comfortable rather than theatrical.</p>
      <p>Start by looking at the pieces already in the room. A rounded mirror, a patterned rug, a sculptural table, or a bold art print may already provide the Deco note. Let one of those be the starting point, then add only what makes the room more useful or more personal.</p>

      <h2 id="begin-with-one-geometric-motif">Begin With One Geometric Motif</h2>
      <p>Choose one shape to repeat: a fan, an arch, a stepped curve, or a clean geometric line. It could appear in a rug and a piece of art, or in a mirror and a lamp. Repeating a shape in two places creates a connection; using it on every surface can make the scheme feel overly themed.</p>
      <p>If your sofa or rug already has a strong pattern, keep nearby textiles calmer. A plain cushion in a related color can make the pattern stand out without adding another competing motif.</p>

      <h2 id="add-metal-with-a-light-touch">Add Metal With a Light Touch</h2>
      <p>Brass brings warmth, while chrome reads cooler and more reflective. Pick one finish as the lead for a lamp, mirror frame, cabinet pull, or small table. Existing hardware does not have to match perfectly; repeating a similar finish in a couple of visible places is usually enough to make it feel deliberate.</p>
      <p>Before buying, check the item's size and care needs. A reflective table can show fingerprints, and a metal finish may look different beside warm bulbs than it does under daylight. Borrow a sample or view the item in the room if possible.</p>

      <h2 id="choose-curves-and-comfortable-shapes">Choose Curves and Comfortable Shapes</h2>
      <p>A curved chair, oval coffee table, or rounded lamp shade can soften the straight lines of a modern room. Keep clearances practical: measure the table, door swings, and walking route, and make sure a new chair can be used without blocking a path. A dramatic silhouette should still fit the way people sit and move.</p>
      <p>For a smaller room, try a mirror or framed print with an arch shape instead of adding a large statement chair. Wall art can suggest the style without taking up floor space.</p>

      <h2 id="keep-the-color-plan-edited">Keep the Color Plan Edited</h2>
      <p>Warm neutrals, wood, and charcoal can ground a NeoDeco room. Then add one deeper color, such as forest green, oxblood, sapphire, or terracotta. Use a second accent in a smaller area if it already appears in the art or rug. The result can be colorful without making each item compete for attention.</p>
      <p>Try the palette with small pieces first. Cushions, a lampshade, a print, or a ceramic object are easier to move than a painted wall or a large sofa. If the room feels too busy, remove one pattern or accent color before adding more decor.</p>

      <h2 id="make-the-look-work-in-a-rental">Make the Look Work in a Rental</h2>
      <p>Use freestanding lamps, removable artwork, cushions, and a compact side table to create the look without permanent changes. Check the lease before changing paint or installing wall-mounted fixtures. In a narrow apartment, keep the main walkway open and avoid a table or chair that catches people as they pass.</p>
      <p>For a modest update, select one strong detail and support it with comfortable basics: a neutral sofa, useful lighting, a textured rug, and a small piece of geometric art. That gives the room a clear point of view while leaving space for everyday life.</p>

      <h2 id="a-neodeco-living-room-checklist">A NeoDeco Living Room Checklist</h2>
      <ul>
        <li>Choose one geometric shape or pattern to repeat.</li>
        <li>Pick brass or chrome as the main metal accent.</li>
        <li>Add one curved or sculptural piece that remains comfortable to use.</li>
        <li>Keep large furniture practical and leave the walking route clear.</li>
        <li>Use one main color and test small accents before making permanent changes.</li>
      </ul>
      <p>NeoDeco works best as a personal edit of Deco-inspired shapes and materials. Keep the details that make the room feel warm and functional, and skip the ones that only add clutter.</p>
    `,
  },
];
