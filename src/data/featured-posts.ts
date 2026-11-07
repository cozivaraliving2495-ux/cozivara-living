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
    slug: 'sage-green-cream-beige-living-room-color-ideas',
    title: 'Sage Green and Cream Living Room Ideas: A Warm 5-Color Palette',
    excerpt: 'Bring together sage green, cream beige, warm brown, soft grey, and terracotta for a calm living room. This practical guide shows where to use each shade, how to layer textures, and how to test the palette at home.',
    publishDate: 'Nov 8, 2026',
    readTime: '7 min read',
    featuredImage: 'https://images.pexels.com/photos/38899471/pexels-photo-38899471.jpeg?auto=compress&cs=tinysrgb&w=1400',
    pinImage: '/images/pinterest/sage-green-cream-beige-room-palette-pin.jpg',
    imageAlt: 'A bright living room with a cream-beige sofa and leafy green plant, a calm starting point for sage, warm brown, soft grey, and terracotta accents.',
    imageCredit: {
      name: 'IRINA',
      photoUrl: 'https://www.pexels.com/photo/elegant-modern-living-room-with-beige-sofa-38899471/',
    },
    pinterestDescription: 'Save this sage green and cream living-room palette: pair soft sage walls with a cream-beige sofa, warm brown wood, soft grey textiles, and small terracotta accents. Get practical room ideas and easy ways to test the colors before decorating.',
    headings: [
      { depth: 2, slug: 'why-sage-and-cream-work-together', text: 'Why Sage and Cream Work Together' },
      { depth: 2, slug: 'give-each-of-the-five-colors-a-role', text: 'Give Each of the Five Colors a Role' },
      { depth: 2, slug: 'three-ways-to-use-the-palette', text: 'Three Ways to Use the Palette' },
      { depth: 2, slug: 'add-texture-without-making-the-room-busy', text: 'Add Texture Without Making the Room Busy' },
      { depth: 2, slug: 'adapt-the-colors-to-your-room-and-light', text: 'Adapt the Colors to Your Room and Light' },
      { depth: 2, slug: 'test-the-palette-before-you-buy', text: 'Test the Palette Before You Buy' },
      { depth: 2, slug: 'a-five-color-room-planning-checklist', text: 'A Five-Color Room Planning Checklist' },
    ],
    contentHtml: `
      <p>The reference palette pairs sage green with cream beige, warm brown, soft grey, and terracotta. Together they can make a living room feel calm and sun-warmed without relying on one flat neutral. The trick is to give each color a job: let the light neutrals carry the room, use sage as the main color, and repeat the two warmer accents in smaller, intentional touches.</p>
      <p>Think of the color values below as screen references, not exact paint formulas. Paint, fabric, wood, and daylight all shift how a color looks. Use real samples beside your sofa and floor before making a permanent change.</p>

      <h2 id="why-sage-and-cream-work-together">Why Sage and Cream Work Together</h2>
      <p>Sage is a softened green that can sit comfortably beside natural wood, plants, and warm white. Cream beige keeps the room bright and makes the green feel gentle rather than stark. Warm brown adds visual weight through furniture and wood finishes, while soft grey gives you a quieter option for rugs, curtains, or upholstery. Terracotta adds a small, earthy spark that stops the palette from feeling too cool or uniform.</p>
      <p>These shades are flexible, but their undertones matter. A sage with a strong blue cast may feel cooler next to a yellow cream; a very orange terracotta can overpower a muted green. Compare samples together in the actual room, and choose versions that share a similar level of softness.</p>

      <h2 id="give-each-of-the-five-colors-a-role">Give Each of the Five Colors a Role</h2>
      <ul>
        <li><strong>Sage green — <code>#6B7652</code>:</strong> use it on one feature wall, a sofa, cushions, or a throw. If the room is small or dim, keep sage to movable accents or one wall.</li>
        <li><strong>Cream beige — <code>#EFD7B6</code>:</strong> make this the broad, light foundation with upholstery, curtains, a rug, or existing wall color.</li>
        <li><strong>Warm brown — <code>#A66D42</code>:</strong> bring it in with wood furniture, a frame, a woven basket, or a leather detail. Existing wood floors may already provide enough.</li>
        <li><strong>Soft grey — <code>#B9B6B2</code>:</strong> use a little in a cushion, rug pattern, or lampshade to connect cooler finishes without introducing a strong contrast.</li>
        <li><strong>Terracotta — <code>#C8794B</code>:</strong> reserve it for a pot, ceramic object, artwork, or one or two cushions. Small repeats feel warm without competing with the green.</li>
      </ul>
      <p>A useful first mock-up is about 60% cream beige, 25% sage, 10% warm brown, and 5% terracotta. Treat soft grey as a supporting neutral that can replace or share part of the cream area, rather than a fixed extra slice. These proportions are a starting point, not a design rule; the floor, existing furniture, and natural light may already supply some of the colors.</p>

      <h2 id="three-ways-to-use-the-palette">Three Ways to Use the Palette</h2>
      <p><strong>For an airy room:</strong> keep the walls and largest upholstery cream beige. Use sage in a pair of cushions and a plant pot, warm brown in the coffee table, and a small terracotta object on a shelf. Add soft grey through a subtle rug pattern if the room needs a cooler note.</p>
      <p><strong>For a cozier room:</strong> put sage on one wall or in a substantial upholstered piece, then balance it with light curtains and a pale rug. Let a warm-brown side table or wood frame repeat the room’s existing timber, and add terracotta in just one spot near eye level.</p>
      <p><strong>For a renter-friendly refresh:</strong> leave the walls as they are and start with a sage throw, cream cushion covers, a brown wood tray, a grey rug, and a terracotta planter. These pieces can move with you, and you can change the balance without painting.</p>

      <h2 id="add-texture-without-making-the-room-busy">Add Texture Without Making the Room Busy</h2>
      <p>Let material create variety when the colors are close in value. Combine a smooth wall with linen or cotton, a woven rug, matte pottery, and visible wood grain. The surfaces catch light differently, so the room feels layered even when the palette stays restrained.</p>
      <p>Repeat each accent at least once if it appears isolated: a terracotta cushion can relate to a small ceramic piece, and a soft-grey rug thread can echo a grey lampshade. Avoid buying a matching set of every color. A few repeated details look more natural than placing all five shades in equal amounts.</p>

      <h2 id="adapt-the-colors-to-your-room-and-light">Adapt the Colors to Your Room and Light</h2>
      <p>In a north-facing or shaded room, use more cream beige and lighter wood so the green does not make the space feel darker. In a bright room, a deeper sage wall or sofa can feel balanced, while sheer curtains help soften direct light. Soft grey can cool a sunny room, but too much may make a low-light space feel flat.</p>
      <p>Check how the palette looks in the morning and under your evening lamps. Warm bulbs can make cream and terracotta appear more golden; cooler daylight may make sage and grey look bluer. If a wall color changes more than you like, keep it to a smaller area and use textiles for the remaining accents.</p>

      <h2 id="test-the-palette-before-you-buy">Test the Palette Before You Buy</h2>
      <p>Gather paint cards, fabric swatches, and a wood sample—or borrow similar items from your home. Put them beside the floor, sofa, curtains, and trim, then view them from across the room. If you are considering paint, test a sample on more than one wall and observe it at different times of day. Follow the paint maker’s preparation instructions and check your lease before changing a rental.</p>
      <p>For furniture and textiles, check dimensions and cleaning directions as well as color. A beautiful cushion or rug still needs to work with the way your household uses the room. Make one change at a time so you can see which part of the palette is doing the most for the space.</p>

      <h2 id="a-five-color-room-planning-checklist">A Five-Color Room Planning Checklist</h2>
      <ul>
        <li>Choose which existing pieces already count as cream beige or warm brown.</li>
        <li>Pick one main sage element and keep other large surfaces lighter.</li>
        <li>Use terracotta sparingly and repeat it once for a connected look.</li>
        <li>Add soft grey only where the room needs a cooler supporting neutral.</li>
        <li>Compare real samples in daylight and lamplight before buying or painting.</li>
      </ul>
      <p>Sage, cream, warm brown, soft grey, and terracotta work best when the room still feels like yours. Start with the pieces you own, add one color at a time, and keep the combination that makes the space comfortable in both daylight and daily use.</p>
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
