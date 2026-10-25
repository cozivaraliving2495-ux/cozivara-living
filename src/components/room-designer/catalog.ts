import type {
  CatalogItem,
  WallColorOption,
  FloorMaterialOption,
  OwnedTemplateItem,
  RoomConfig,
  RoomType,
  PlacedItem
} from './types';

export const DEFAULT_ROOM_CONFIG: RoomConfig = {
  widthFt: 12,
  lengthFt: 14,
  heightFt: 9,
  roomType: 'Living Room',
  style: 'Scandinavian',
  wallColor: '#FAF8F5', // Warm White
  wallColorName: 'Warm White',
  floorMaterial: 'light-oak',
  floorColor: '#CDB18B',
  floorName: 'Natural Blonde Oak',
  showWalls: true,
  wallMode: 'cutaway',
  showGrid: true,
};

// 36 thoughtfully curated wall colours across 7 harmonious interior families
export const WALL_COLORS: WallColorOption[] = [
  // --- Family 1: Warm Whites & Ivory ---
  { id: 'pure-white', name: 'Pure White', hex: '#FFFFFF', roughness: 0.9, family: 'Whites & Creams', description: 'Clean, radiant architectural white' },
  { id: 'warm-white', name: 'Warm White', hex: '#FAF8F5', roughness: 0.9, family: 'Whites & Creams', description: 'Soft, welcoming white with gentle undertones' },
  { id: 'alabaster', name: 'Alabaster', hex: '#F7F5F0', roughness: 0.89, family: 'Whites & Creams', description: 'Luminous chalky warm white' },
  { id: 'ivory', name: 'Ivory', hex: '#FDFBF7', roughness: 0.88, family: 'Whites & Creams', description: 'Subtle warm ivory with creamy highlights' },
  { id: 'silk-cream', name: 'Silk Cream', hex: '#F5EFEB', roughness: 0.88, family: 'Whites & Creams', description: 'Classic buttery linen cream' },
  { id: 'clotted-cream', name: 'Clotted Cream', hex: '#F6EEDF', roughness: 0.87, family: 'Whites & Creams', description: 'Rich vanilla pastry cream' },

  // --- Family 2: Beige, Sand & Greige ---
  { id: 'light-beige', name: 'Light Beige', hex: '#EFE8DE', roughness: 0.87, family: 'Beige & Sand', description: 'Muted natural oat and pale flax' },
  { id: 'sand', name: 'Sand', hex: '#E5DACB', roughness: 0.86, family: 'Beige & Sand', description: 'Sun-drenched coastal dune tone' },
  { id: 'oatmeal', name: 'Oatmeal', hex: '#DFD5C6', roughness: 0.86, family: 'Beige & Sand', description: 'Tactile rustic spun grain' },
  { id: 'greige', name: 'Greige', hex: '#DCD6CD', roughness: 0.85, family: 'Beige & Sand', description: 'Balanced blend of warm beige and soft grey' },
  { id: 'warm-taupe', name: 'Warm Taupe', hex: '#C7BBAE', roughness: 0.84, family: 'Beige & Sand', description: 'Earthy taupe with organic grounding' },
  { id: 'mushroom', name: 'Mushroom', hex: '#B8A99A', roughness: 0.83, family: 'Beige & Sand', description: 'Rich woodland earthy neutral' },

  // --- Family 3: Nordic & Architectural Greys ---
  { id: 'scandi-mist', name: 'Scandinavian Mist', hex: '#EAEBE7', roughness: 0.88, family: 'Greys', description: 'Airy Nordic morning fog' },
  { id: 'light-grey', name: 'Light Grey', hex: '#E2E4E1', roughness: 0.85, family: 'Greys', description: 'Subtle modern gallery grey' },
  { id: 'pebble-grey', name: 'Pebble Grey', hex: '#CFCFC8', roughness: 0.84, family: 'Greys', description: 'River-smoothed pale stone' },
  { id: 'slate-fog', name: 'Slate Fog', hex: '#B8BAB7', roughness: 0.83, family: 'Greys', description: 'Mid-tone architect grey' },
  { id: 'mineral-grey', name: 'Mineral Grey', hex: '#8C908E', roughness: 0.82, family: 'Greys', description: 'Deep grounding slate rock' },

  // --- Family 4: Sage, Olive & Forest Greens ---
  { id: 'pale-sage', name: 'Pale Sage', hex: '#D5DDD0', roughness: 0.88, family: 'Greens & Botanical', description: 'Airy silvered tea leaf' },
  { id: 'sage-green', name: 'Sage Green', hex: '#C5CEBE', roughness: 0.88, family: 'Greens & Botanical', description: 'Soft muted herbal sage' },
  { id: 'eucalyptus-green', name: 'Eucalyptus Green', hex: '#6F8370', roughness: 0.82, family: 'Greens & Botanical', description: 'Calming silvery eucalyptus leaf' },
  { id: 'soft-olive', name: 'Soft Olive', hex: '#8A9A7B', roughness: 0.82, family: 'Greens & Botanical', description: 'Signature Cozivara botanical olive' },
  { id: 'cozi-olive-dark', name: 'Cozivara Deep Olive', hex: '#586A4F', roughness: 0.8, family: 'Greens & Botanical', description: 'Organic heritage olive grove' },
  { id: 'deep-forest-green', name: 'Deep Forest Green', hex: '#3D4D3A', roughness: 0.8, family: 'Greens & Botanical', description: 'Moody enveloping evergreen canopy' },
  { id: 'cypress', name: 'Cypress Green', hex: '#2A3628', roughness: 0.78, family: 'Greens & Botanical', description: 'Dark botanical sanctuary shadow' },

  // --- Family 5: Pale & Dusty Blues ---
  { id: 'morning-mist-blue', name: 'Morning Mist Blue', hex: '#D2DBDF', roughness: 0.88, family: 'Blues', description: 'Crisp airy winter morning sky' },
  { id: 'dusty-blue', name: 'Dusty Blue', hex: '#A8B5BD', roughness: 0.85, family: 'Blues', description: 'Muted slate Nordic blue' },
  { id: 'coastal-denim', name: 'Coastal Denim', hex: '#8396A3', roughness: 0.84, family: 'Blues', description: 'Sun-faded seaside blue' },
  { id: 'sea-salt-sky', name: 'Sea Salt Slate', hex: '#5C717F', roughness: 0.82, family: 'Blues', description: 'Atmospheric moody Atlantic slate' },

  // --- Family 6: Terracotta, Clay & Blush ---
  { id: 'blush-beige', name: 'Blush Beige', hex: '#EAD8D0', roughness: 0.88, family: 'Terracotta & Rose', description: 'Delicate powdery warm rose undertone' },
  { id: 'dusty-rose', name: 'Dusty Rose', hex: '#DFC4BD', roughness: 0.86, family: 'Terracotta & Rose', description: 'Romantic faded antique velvet rose' },
  { id: 'desert-clay', name: 'Desert Clay', hex: '#DBB5A0', roughness: 0.85, family: 'Terracotta & Rose', description: 'Soft adobe plaster' },
  { id: 'muted-terracotta', name: 'Muted Terracotta', hex: '#CD9D87', roughness: 0.84, family: 'Terracotta & Rose', description: 'Warm sun-baked clay wash' },
  { id: 'burnt-sienna', name: 'Sun-baked Sienna', hex: '#B2765A', roughness: 0.82, family: 'Terracotta & Rose', description: 'Vibrant Mediterranean artisanal earthenware' },

  // --- Family 7: Deep Espresso & Dark Neutrals ---
  { id: 'smoked-umber', name: 'Smoked Umber', hex: '#634F42', roughness: 0.82, family: 'Dark Neutrals', description: 'Warm roasted chestnut wood' },
  { id: 'charcoal', name: 'Charcoal Noir', hex: '#2B2826', roughness: 0.78, family: 'Dark Neutrals', description: 'Refined deep espresso noir' },
  { id: 'midnight-slate', name: 'Midnight Slate', hex: '#1C1F22', roughness: 0.76, family: 'Dark Neutrals', description: 'Velvety deep midnight accent' },
];

export const FLOOR_MATERIALS: FloorMaterialOption[] = [
  { id: 'light-oak', name: 'Natural Blonde Oak', color: '#D6BA96', roughness: 0.45, textureType: 'wood' },
  { id: 'warm-walnut', name: 'Rich Smoked Walnut', color: '#6A4A33', roughness: 0.4, textureType: 'wood' },
  { id: 'ash-herringbone', name: 'Nordic White Ash', color: '#E4D9C8', roughness: 0.45, textureType: 'wood' },
  { id: 'limestone-tile', name: 'Travertine Stone Tile', color: '#DDD2C1', roughness: 0.5, textureType: 'tile' },
  { id: 'terrazzo-sand', name: 'Warm Sandstone Tile', color: '#C8BEAF', roughness: 0.55, textureType: 'tile' },
  { id: 'berber-carpet', name: 'Cozy Wool Loop Carpet', color: '#E2DBD2', roughness: 0.95, textureType: 'carpet' },
  { id: 'polished-concrete', name: 'Loft Grey Concrete', color: '#9E9E9C', roughness: 0.35, textureType: 'concrete' },
];

export const FURNITURE_CATALOG: CatalogItem[] = [
  // --- SEATING ---
  {
    id: 'sofa-3seat-scandi',
    name: '3-Seater Cloud Sofa',
    category: 'Seating',
    description: 'Generously deep 3-seater sofa with organic curved silhouette, plush foam cushioning, and solid tapered wood feet.',
    defaultWidthFt: 7.2,
    defaultDepthFt: 3.1,
    defaultHeightFt: 2.8,
    merchantName: 'Alibaba',
    productUrl: 'https://www.alibaba.com/trade/search?SearchText=nordic+3+seater+curved+sofa+boucle',
    merchantSearchUrl: 'https://www.alibaba.com/trade/search?SearchText=nordic+3+seater+curved+sofa+boucle',
    defaultColor: '#E6E0D6',
    colorOptions: [
      { name: 'Oatmeal Bouclé', hex: '#E6E0D6' },
      { name: 'Warm Ivory', hex: '#F3EFE9' },
      { name: 'Olive Green', hex: '#58674F' },
      { name: 'Charcoal Linen', hex: '#3C3936' },
      { name: 'Mocha Tan', hex: '#8C7461' },
    ],
    modelType: 'sofa-3seat',
    tags: ['living', 'seating', 'sofa', 'couch', 'scandi'],
  },
  {
    id: 'armchair-nordic',
    name: 'Nordic Accent Armchair',
    category: 'Seating',
    description: 'Sculptural reading armchair featuring an enveloping backrest, textured woven upholstery, and natural ash wood splayed legs.',
    defaultWidthFt: 2.8,
    defaultDepthFt: 2.9,
    defaultHeightFt: 2.9,
    merchantName: 'IKEA',
    productUrl: 'https://www.ikea.com/us/en/search/?q=armchair+wood+legs',
    merchantSearchUrl: 'https://www.ikea.com/us/en/search/?q=armchair+wood+legs',
    defaultColor: '#5E6E53',
    colorOptions: [
      { name: 'Olive Sage', hex: '#5E6E53' },
      { name: 'Sand Bouclé', hex: '#E4DDD2' },
      { name: 'Mustard Amber', hex: '#C29849' },
      { name: 'Slate Grey', hex: '#50565A' },
    ],
    modelType: 'armchair',
    tags: ['living', 'bedroom', 'office', 'chair', 'armchair'],
  },
  {
    id: 'office-chair-ergo',
    name: 'Ergonomic Studio Chair',
    category: 'Office',
    description: 'Modern swivel desk chair with lumbar contouring, breathable cushioned seat, chrome stem, and smooth 5-point caster base.',
    defaultWidthFt: 2.1,
    defaultDepthFt: 2.1,
    defaultHeightFt: 3.2,
    merchantName: 'Amazon Home',
    productUrl: 'https://www.amazon.com/s?k=ergonomic+mesh+office+chair+swivel',
    merchantSearchUrl: 'https://www.amazon.com/s?k=ergonomic+mesh+office+chair+swivel',
    defaultColor: '#363432',
    colorOptions: [
      { name: 'Charcoal Black', hex: '#363432' },
      { name: 'Dove Grey', hex: '#A3A29E' },
      { name: 'Sage Green', hex: '#63705C' },
      { name: 'Cognac Brown', hex: '#7A4F35' },
    ],
    modelType: 'office-chair',
    tags: ['office', 'chair', 'desk', 'workspace', 'seating'],
  },

  // --- TABLES ---
  {
    id: 'coffee-table-oval',
    name: 'Curved Organic Coffee Table',
    category: 'Tables',
    description: 'Low-profile minimalist oval coffee table with chamfered edges, lower storage shelf, and cylindrical solid timber dowel legs.',
    defaultWidthFt: 4.0,
    defaultDepthFt: 2.1,
    defaultHeightFt: 1.4,
    merchantName: 'Alibaba',
    productUrl: 'https://www.alibaba.com/trade/search?SearchText=solid+oak+oval+coffee+table+minimalist',
    merchantSearchUrl: 'https://www.alibaba.com/trade/search?SearchText=solid+oak+oval+coffee+table+minimalist',
    defaultColor: '#C4A484',
    colorOptions: [
      { name: 'Natural Oak', hex: '#C4A484' },
      { name: 'Smoked Walnut', hex: '#5C412E' },
      { name: 'Blonde Ash', hex: '#DFD1BD' },
      { name: 'Ebony Black', hex: '#262423' },
    ],
    modelType: 'coffee-table',
    tags: ['living', 'table', 'coffee table', 'centerpiece'],
  },
  {
    id: 'nightstand-fluted',
    name: 'Fluted Bedside Table',
    category: 'Tables',
    description: 'Compact bedroom nightstand with tambour fluted front drawer, brushed brass knob, and warm timber surface.',
    defaultWidthFt: 1.8,
    defaultDepthFt: 1.6,
    defaultHeightFt: 1.9,
    merchantName: 'Target',
    productUrl: 'https://www.target.com/s?searchTerm=fluted+nightstand',
    merchantSearchUrl: 'https://www.target.com/s?searchTerm=fluted+nightstand',
    defaultColor: '#CDB18B',
    colorOptions: [
      { name: 'Warm Oak', hex: '#CDB18B' },
      { name: 'Smoked Walnut', hex: '#59402D' },
      { name: 'Alabaster White', hex: '#F5F3ED' },
      { name: 'Matte Charcoal', hex: '#2E2D2B' },
    ],
    modelType: 'nightstand',
    tags: ['bedroom', 'nightstand', 'bedside', 'table'],
  },
  {
    id: 'dining-table-set',
    name: 'Solid Timber Dining Set (Table + 4 Chairs)',
    category: 'Dining',
    description: 'Handcrafted solid wood dining table paired with four comfortable curved dining chairs with upholstered seats.',
    defaultWidthFt: 5.4,
    defaultDepthFt: 3.2,
    defaultHeightFt: 2.6,
    merchantName: 'Alibaba',
    productUrl: 'https://www.alibaba.com/trade/search?SearchText=solid+wood+dining+table+and+4+chairs+set',
    merchantSearchUrl: 'https://www.alibaba.com/trade/search?SearchText=solid+wood+dining+table+and+4+chairs+set',
    defaultColor: '#B89772',
    colorOptions: [
      { name: 'Natural Oak', hex: '#B89772' },
      { name: 'Rich Walnut', hex: '#533B29' },
      { name: 'Nordic Ash', hex: '#DAC8B2' },
    ],
    modelType: 'dining-set',
    tags: ['dining', 'table', 'chairs', 'gather', 'dining room'],
  },
  {
    id: 'desk-studio-wood',
    name: 'Minimalist Studio Desk',
    category: 'Office',
    description: 'Clean-lined writing desk with integrated stationery drawer, wire management slot, and architectural steel or wood trestle legs.',
    defaultWidthFt: 4.2,
    defaultDepthFt: 2.2,
    defaultHeightFt: 2.5,
    merchantName: 'IKEA',
    productUrl: 'https://www.ikea.com/us/en/search/?q=desk+wood+drawer',
    merchantSearchUrl: 'https://www.ikea.com/us/en/search/?q=desk+wood+drawer',
    defaultColor: '#C5A989',
    colorOptions: [
      { name: 'Natural Timber', hex: '#C5A989' },
      { name: 'Walnut & Black', hex: '#4B3829' },
      { name: 'Nordic White', hex: '#FAF7F2' },
    ],
    modelType: 'desk',
    tags: ['office', 'desk', 'work', 'study', 'laptop'],
  },

  // --- STORAGE & MEDIA ---
  {
    id: 'tv-unit-slatted',
    name: 'Slatted Media Console',
    category: 'Storage',
    description: 'Wide horizontal media credenza with Japanese slatted sliding doors, cable pass-through, and open center audio shelf.',
    defaultWidthFt: 5.6,
    defaultDepthFt: 1.5,
    defaultHeightFt: 1.8,
    merchantName: 'Target',
    productUrl: 'https://www.target.com/s?searchTerm=slatted+tv+stand',
    merchantSearchUrl: 'https://www.target.com/s?searchTerm=slatted+tv+stand',
    defaultColor: '#B49372',
    colorOptions: [
      { name: 'Natural Oak', hex: '#B49372' },
      { name: 'Smoked Walnut', hex: '#4F3827' },
      { name: 'Matte Charcoal & Oak', hex: '#312E2B' },
    ],
    modelType: 'tv-unit',
    tags: ['living', 'media', 'tv unit', 'storage', 'cabinet'],
  },
  {
    id: 'television-oled',
    name: 'Ultra-Thin Smart TV (55")',
    category: 'Decor & Lighting',
    description: 'Frameless 4K smart television on slim dual architectural feet or floating position above media consoles.',
    defaultWidthFt: 4.1,
    defaultDepthFt: 0.4,
    defaultHeightFt: 2.4,
    merchantName: 'Amazon Home',
    productUrl: 'https://www.amazon.com/s?k=55+inch+4k+smart+tv',
    merchantSearchUrl: 'https://www.amazon.com/s?k=55+inch+4k+smart+tv',
    defaultColor: '#171717',
    colorOptions: [
      { name: 'Obsidian Black', hex: '#171717' },
      { name: 'Brushed Titanium', hex: '#525252' },
    ],
    modelType: 'television',
    tags: ['living', 'tv', 'media', 'screen', 'tech'],
  },
  {
    id: 'bookshelf-tower',
    name: 'Modular Open Bookshelf',
    category: 'Storage',
    description: '5-tier architectural open bookshelf designed for art objects, curated coffee table books, and potted plants.',
    defaultWidthFt: 3.2,
    defaultDepthFt: 1.2,
    defaultHeightFt: 6.2,
    merchantName: 'IKEA',
    productUrl: 'https://www.ikea.com/us/en/search/?q=bookcase+open+shelving',
    merchantSearchUrl: 'https://www.ikea.com/us/en/search/?q=bookcase+open+shelving',
    defaultColor: '#AE8B68',
    colorOptions: [
      { name: 'Warm Timber', hex: '#AE8B68' },
      { name: 'Espresso Walnut', hex: '#483424' },
      { name: 'Sand White', hex: '#F0EBE3' },
    ],
    modelType: 'bookshelf',
    tags: ['living', 'office', 'bedroom', 'storage', 'books', 'shelving'],
  },
  {
    id: 'wardrobe-double',
    name: 'Double-Door Wardrobe',
    category: 'Storage',
    description: 'Full-height Scandinavian wardrobe with dual paneled doors, internal hanging rail, top shelf, and sleek linear brass pull handles.',
    defaultWidthFt: 4.2,
    defaultDepthFt: 2.0,
    defaultHeightFt: 6.8,
    merchantName: 'IKEA',
    productUrl: 'https://www.ikea.com/us/en/search/?q=wardrobe+2+door',
    merchantSearchUrl: 'https://www.ikea.com/us/en/search/?q=wardrobe+2+door',
    defaultColor: '#F0ECE4',
    colorOptions: [
      { name: 'Linen White', hex: '#F0ECE4' },
      { name: 'Natural Oak', hex: '#B89772' },
      { name: 'Smoked Walnut', hex: '#4E3726' },
      { name: 'Olive Gray', hex: '#5E665A' },
    ],
    modelType: 'wardrobe',
    tags: ['bedroom', 'wardrobe', 'storage', 'closet', 'clothes'],
  },

  // --- BEDS ---
  {
    id: 'bed-queen-linen',
    name: 'Queen Platform Bed with Upholstered Headboard',
    category: 'Beds',
    description: 'Low-profile solid wood platform bed frame with a cushioned linen wingback headboard, memory foam mattress, and folded organic duvet.',
    defaultWidthFt: 5.6,
    defaultDepthFt: 6.8,
    defaultHeightFt: 3.6,
    merchantName: 'Alibaba',
    productUrl: 'https://www.alibaba.com/trade/search?SearchText=scandinavian+platform+bed+upholstered+headboard',
    merchantSearchUrl: 'https://www.alibaba.com/trade/search?SearchText=scandinavian+platform+bed+upholstered+headboard',
    defaultColor: '#E2DBD2',
    colorOptions: [
      { name: 'Sand Linen', hex: '#E2DBD2' },
      { name: 'Warm Oatmeal', hex: '#CEC4B4' },
      { name: 'Olive Green Wool', hex: '#52604A' },
      { name: 'Midnight Charcoal', hex: '#2F2E2C' },
    ],
    modelType: 'bed-queen',
    tags: ['bedroom', 'bed', 'queen', 'mattress', 'sleep'],
  },

  // --- DECOR & LIGHTING ---
  {
    id: 'area-rug-woven',
    name: 'Textured Wool Area Rug',
    category: 'Decor & Lighting',
    description: 'Generously sized hand-woven Moroccan/Nordic wool rug with subtle linear geometric grain and soft fringe edges.',
    defaultWidthFt: 8.0,
    defaultDepthFt: 6.0,
    defaultHeightFt: 0.08,
    merchantName: 'Target',
    productUrl: 'https://www.target.com/s?searchTerm=woven+wool+area+rug',
    merchantSearchUrl: 'https://www.target.com/s?searchTerm=woven+wool+area+rug',
    defaultColor: '#EBE5DC',
    colorOptions: [
      { name: 'Natural Cream', hex: '#EBE5DC' },
      { name: 'Earthy Sand', hex: '#D2C2B2' },
      { name: 'Sage Linear', hex: '#C2C9BC' },
      { name: 'Warm Terracotta', hex: '#CD9F87' },
    ],
    modelType: 'area-rug',
    tags: ['living', 'bedroom', 'rug', 'decor', 'floor', 'textile'],
  },
  {
    id: 'plant-fiddle-leaf',
    name: 'Ceramic Planter & Fiddle Leaf Fig',
    category: 'Decor & Lighting',
    description: 'Lush indoor tropical ficus lyrata plant in a hand-thrown ribbed ceramic pot on a tripod wooden plant stand.',
    defaultWidthFt: 1.8,
    defaultDepthFt: 1.8,
    defaultHeightFt: 4.4,
    merchantName: 'Amazon Home',
    productUrl: 'https://www.amazon.com/s?k=fiddle+leaf+fig+ceramic+pot',
    merchantSearchUrl: 'https://www.amazon.com/s?k=fiddle+leaf+fig+ceramic+pot',
    defaultColor: '#3F5B36',
    colorOptions: [
      { name: 'Deep Botanical Green', hex: '#3F5B36' },
      { name: 'Silver Olive Sage', hex: '#586A50' },
    ],
    modelType: 'plant-pot',
    tags: ['living', 'bedroom', 'office', 'plant', 'nature', 'decor'],
  },
  {
    id: 'floor-lamp-arc',
    name: 'Mid-Century Brass Floor Lamp',
    category: 'Decor & Lighting',
    description: 'Gracefully curved brass arched stem anchored by a heavy white marble base, finished with an ivory linen drum lampshade.',
    defaultWidthFt: 1.8,
    defaultDepthFt: 2.2,
    defaultHeightFt: 5.6,
    merchantName: 'Alibaba',
    productUrl: 'https://www.alibaba.com/trade/search?SearchText=brass+arc+floor+lamp+marble+base',
    merchantSearchUrl: 'https://www.alibaba.com/trade/search?SearchText=brass+arc+floor+lamp+marble+base',
    defaultColor: '#C4A25C',
    colorOptions: [
      { name: 'Warm Brushed Brass', hex: '#C4A25C' },
      { name: 'Matte Black Metal', hex: '#2A2928' },
      { name: 'Polished Nickel', hex: '#B8BAC0' },
    ],
    modelType: 'floor-lamp',
    tags: ['living', 'bedroom', 'lighting', 'lamp', 'illumination'],
  },
  {
    id: 'ceiling-light-pendant',
    name: 'Wabi-Sabi Paper Pendant Light',
    category: 'Decor & Lighting',
    description: 'Floating organic washi paper and wire pendant chandelier casting warm, diffused ambient luminescence across the entire room.',
    defaultWidthFt: 2.2,
    defaultDepthFt: 2.2,
    defaultHeightFt: 2.4,
    merchantName: 'Alibaba',
    productUrl: 'https://www.alibaba.com/trade/search?SearchText=wabi+sabi+paper+pendant+lamp',
    merchantSearchUrl: 'https://www.alibaba.com/trade/search?SearchText=wabi+sabi+paper+pendant+lamp',
    defaultColor: '#F7F3EB',
    colorOptions: [
      { name: 'Ivory Washi Paper', hex: '#F7F3EB' },
      { name: 'Amber Smoked Glass', hex: '#B88F5B' },
      { name: 'Black Wire Geometric', hex: '#262423' },
    ],
    modelType: 'ceiling-light',
    tags: ['living', 'dining', 'bedroom', 'lighting', 'chandelier', 'pendant'],
  },
];

export const OWNED_TEMPLATES: OwnedTemplateItem[] = [
  { id: 'owned-sofa', name: 'Existing Living Room Sofa', category: 'Seating', catalogId: 'sofa-3seat-scandi',  iconName: 'sofa' },
  { id: 'owned-tv', name: 'Existing Smart Television', category: 'Decor & Lighting', catalogId: 'television-oled',  iconName: 'tv' },
  { id: 'owned-bed', name: 'Existing Bedroom Bed & Mattress', category: 'Beds', catalogId: 'bed-queen-linen',  iconName: 'bed' },
  { id: 'owned-desk', name: 'Existing Study / Work Desk', category: 'Office', catalogId: 'desk-studio-wood',  iconName: 'desk' },
  { id: 'owned-office-chair', name: 'Existing Office Swivel Chair', category: 'Office', catalogId: 'office-chair-ergo',  iconName: 'chair' },
  { id: 'owned-dining', name: 'Existing Dining Table Set', category: 'Dining', catalogId: 'dining-table-set',  iconName: 'dining' },
  { id: 'owned-rug', name: 'Existing Wool Area Rug', category: 'Decor & Lighting', catalogId: 'area-rug-woven',  iconName: 'rug' },
  { id: 'owned-plants', name: 'Existing Houseplants & Pots', category: 'Decor & Lighting', catalogId: 'plant-fiddle-leaf',  iconName: 'plant' },
];

/**
 * Intelligent Room Configuration System:
 * Generates an optimized, collision-aware furniture layout dynamically fitted
 * to the specified room dimensions for any RoomType.
 */
export function generateRoomPresetItems(
  roomType: RoomType,
  widthFt: number,
  lengthFt: number
): PlacedItem[] {
  const halfW = widthFt / 2;
  const halfL = lengthFt / 2;

  let presetDefs: Array<{ catalogId: string; pos: [number, number, number]; rotY: number }>;

  switch (roomType) {
    case 'Bedroom':
      presetDefs = [
        // Bed centered against rear wall with clearance
        { catalogId: 'bed-queen-linen', pos: [0, 0, -halfL * 0.35], rotY: 0 },
        // Flanked bedside nightstands
        { catalogId: 'nightstand-fluted', pos: [-halfW * 0.62, 0, -halfL * 0.48], rotY: 0 },
        { catalogId: 'nightstand-fluted', pos: [halfW * 0.62, 0, -halfL * 0.48], rotY: 0 },
        // Wardrobe on side wall
        { catalogId: 'wardrobe-double', pos: [-halfW * 0.68, 0, halfL * 0.45], rotY: Math.PI / 2 },
        // Soft area rug under bed
        { catalogId: 'area-rug-woven', pos: [0, 0, halfL * 0.12], rotY: Math.PI / 2 },
        // Accent floor lamp & plant
        { catalogId: 'floor-lamp-arc', pos: [halfW * 0.65, 0, halfL * 0.48], rotY: -Math.PI / 3 },
        { catalogId: 'plant-fiddle-leaf', pos: [halfW * 0.68, 0, -halfL * 0.55], rotY: 0 },
      ];
      break;

    case 'Home Office':
      presetDefs = [
        // Desk centered with good sightline
        { catalogId: 'desk-studio-wood', pos: [0, 0, -halfL * 0.3], rotY: 0 },
        // Ergonomic office chair behind desk
        { catalogId: 'office-chair-ergo', pos: [0, 0, -halfL * 0.08], rotY: 0 },
        // Bookshelf tower on left wall
        { catalogId: 'bookshelf-tower', pos: [-halfW * 0.68, 0, halfL * 0.3], rotY: Math.PI / 2 },
        // Wool rug grounding the work area
        { catalogId: 'area-rug-woven', pos: [0, 0, -halfL * 0.1], rotY: 0 },
        // Architectural floor lamp & botanical plant
        { catalogId: 'floor-lamp-arc', pos: [halfW * 0.65, 0, halfL * 0.4], rotY: -Math.PI / 3 },
        { catalogId: 'plant-fiddle-leaf', pos: [halfW * 0.68, 0, -halfL * 0.5], rotY: 0 },
      ];
      break;

    case 'Dining Room':
      presetDefs = [
        // Central Dining Table & 4 Chairs
        { catalogId: 'dining-table-set', pos: [0, 0, 0], rotY: 0 },
        // Low slatted sideboard / credenza on back wall
        { catalogId: 'tv-unit-slatted', pos: [0, 0, -halfL * 0.68], rotY: Math.PI },
        // Dining area rug centered underneath table
        { catalogId: 'area-rug-woven', pos: [0, 0, 0], rotY: 0 },
        // Warm ceiling pendant light directly above table
        { catalogId: 'ceiling-light-pendant', pos: [0, 6.2, 0], rotY: 0 },
        // Botanical plant in corner
        { catalogId: 'plant-fiddle-leaf', pos: [-halfW * 0.68, 0, halfL * 0.55], rotY: 0 },
      ];
      break;

    case 'Living Room':
    default:
      presetDefs = [
        // Area rug grounding center
        { catalogId: 'area-rug-woven', pos: [0, 0, halfL * 0.08], rotY: 0 },
        // Main 3-seater sofa facing south/center
        { catalogId: 'sofa-3seat-scandi', pos: [0, 0, halfL * 0.42], rotY: 0 },
        // Oval coffee table
        { catalogId: 'coffee-table-oval', pos: [0, 0, halfL * 0.06], rotY: 0 },
        // Media console against north wall
        { catalogId: 'tv-unit-slatted', pos: [0, 0, -halfL * 0.68], rotY: Math.PI },
        // 4K Television
        { catalogId: 'television-oled', pos: [0, 1.8, -halfL * 0.68], rotY: Math.PI },
        // Reading armchair angled on left
        { catalogId: 'armchair-nordic', pos: [-halfW * 0.62, 0, halfL * 0.08], rotY: Math.PI / 4 },
        // Brass floor lamp & plant
        { catalogId: 'floor-lamp-arc', pos: [halfW * 0.68, 0, halfL * 0.45], rotY: -Math.PI / 4 },
        { catalogId: 'plant-fiddle-leaf', pos: [-halfW * 0.68, 0, -halfL * 0.58], rotY: 0 },
      ];
      break;
  }

  const now = Date.now();
  return presetDefs.map((entry, index) => {
    const cat = FURNITURE_CATALOG.find((c) => c.id === entry.catalogId);
    return {
      instanceId: `preset-${roomType.toLowerCase().replace(/\s+/g, '-')}-${now}-${index}`,
      catalogId: entry.catalogId,
      name: cat?.name || 'Furniture Piece',
      category: cat?.category || 'Seating',
      modelType: cat?.modelType || 'sofa-3seat',
      widthFt: cat?.defaultWidthFt || 3,
      depthFt: cat?.defaultDepthFt || 3,
      heightFt: cat?.defaultHeightFt || 3,
      position: entry.pos,
      rotationY: entry.rotY,
      color: cat?.defaultColor || '#D4C5B9',
      merchantName: cat?.merchantName || 'Retailer',
      merchantSearchUrl: cat?.merchantSearchUrl,
      productUrl: cat?.productUrl,
      affiliateUrl: cat?.affiliateUrl,
      productImageUrl: cat?.productImageUrl,
      isOwned: false,
      isManual: false, // Mark as automatic preset layout
    };
  });
}

// Starter rooms metadata
export const STARTER_ROOMS: Record<string, {
  name: string;
  config: Partial<RoomConfig>;
}> = {
  'living-room': {
    name: 'Serene Japandi Living Room',
    config: {
      roomType: 'Living Room',
      style: 'Scandinavian',
      wallColor: '#FAF8F5',
      wallColorName: 'Warm White',
      floorMaterial: 'light-oak',
      floorColor: '#D6BA96',
    },
  },
  'cozy-bedroom': {
    name: 'Warm Minimalist Bedroom',
    config: {
      roomType: 'Bedroom',
      style: 'Minimalist',
      wallColor: '#FAF7F0',
      wallColorName: 'Ivory',
      floorMaterial: 'warm-walnut',
      floorColor: '#6A4A33',
    },
  },
  'home-office': {
    name: 'Productive Scandinavian Studio',
    config: {
      roomType: 'Home Office',
      style: 'Modern',
      wallColor: '#C5CEBE',
      wallColorName: 'Sage Green',
      floorMaterial: 'ash-herringbone',
      floorColor: '#E4D9C8',
    },
  },
  'dining-room': {
    name: 'Warm Contemporary Dining Room',
    config: {
      roomType: 'Dining Room',
      style: 'Contemporary',
      wallColor: '#E5DACB',
      wallColorName: 'Sand',
      floorMaterial: 'light-oak',
      floorColor: '#D6BA96',
    },
  },
};
