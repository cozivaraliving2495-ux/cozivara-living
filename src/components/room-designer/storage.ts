import type { RoomConfig, PlacedItem, SavedDesignData, AIDesignBrief } from './types';
import { DEFAULT_ROOM_CONFIG, FLOOR_MATERIALS, FURNITURE_CATALOG } from './catalog';
import { isPositionValid } from './placement';

const STORAGE_KEY = 'cozivara_room_design_v1';

export interface SavedDesignLoadResult {
  data: SavedDesignData;
  warnings: string[];
}

export function saveDesignToStorage(data: SavedDesignData): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
  } catch (e) {
    console.error('Failed to save design to localStorage:', e);
  }
  return false;
}

function sanitizeSavedDesign(parsed: unknown): SavedDesignLoadResult | null {
  if (!parsed || typeof parsed !== 'object') return null;
  const source = parsed as Partial<SavedDesignData>;
  if (!source.roomConfig || !Array.isArray(source.items)) return null;

  const warnings: string[] = [];
  const rawRoom = source.roomConfig as Partial<RoomConfig>;
  const roomTypeValues = ['Living Room', 'Bedroom', 'Home Office', 'Dining Room'];
  const styleValues = ['Modern', 'Minimalist', 'Scandinavian', 'Contemporary', 'Industrial', 'Bohemian'];
  const validWallColor = typeof rawRoom.wallColor === 'string' && /^#[0-9a-f]{6}$/i.test(rawRoom.wallColor);
  const floor = FLOOR_MATERIALS.find((entry) => entry.id === rawRoom.floorMaterial);
  const roomConfig: RoomConfig = {
    ...DEFAULT_ROOM_CONFIG,
    ...rawRoom,
    widthFt: Number.isFinite(rawRoom.widthFt) ? Math.max(8, Math.min(40, rawRoom.widthFt!)) : DEFAULT_ROOM_CONFIG.widthFt,
    lengthFt: Number.isFinite(rawRoom.lengthFt) ? Math.max(8, Math.min(40, rawRoom.lengthFt!)) : DEFAULT_ROOM_CONFIG.lengthFt,
    heightFt: Number.isFinite(rawRoom.heightFt) ? Math.max(7, Math.min(20, rawRoom.heightFt!)) : DEFAULT_ROOM_CONFIG.heightFt,
    roomType: roomTypeValues.includes(rawRoom.roomType || '') ? rawRoom.roomType! : DEFAULT_ROOM_CONFIG.roomType,
    style: styleValues.includes(rawRoom.style || '') ? rawRoom.style! : DEFAULT_ROOM_CONFIG.style,
    wallColor: validWallColor ? rawRoom.wallColor! : DEFAULT_ROOM_CONFIG.wallColor,
    wallColorName: typeof rawRoom.wallColorName === 'string' ? rawRoom.wallColorName.slice(0, 80) : DEFAULT_ROOM_CONFIG.wallColorName,
    floorMaterial: floor?.id || DEFAULT_ROOM_CONFIG.floorMaterial,
    floorColor: floor?.color || DEFAULT_ROOM_CONFIG.floorColor,
    floorName: floor?.name || DEFAULT_ROOM_CONFIG.floorName,
    showWalls: typeof rawRoom.showWalls === 'boolean' ? rawRoom.showWalls : DEFAULT_ROOM_CONFIG.showWalls,
    showGrid: typeof rawRoom.showGrid === 'boolean' ? rawRoom.showGrid : DEFAULT_ROOM_CONFIG.showGrid,
    wallMode: rawRoom.wallMode === 'all' || rawRoom.wallMode === 'none' ? rawRoom.wallMode : 'cutaway',
  };
  if (!validWallColor || !floor || !roomTypeValues.includes(rawRoom.roomType || '') || !styleValues.includes(rawRoom.style || '')) {
    warnings.push('Some saved room settings were invalid and have been restored to safe defaults.');
  }

  const usedIds = new Set<string>();
  const items: PlacedItem[] = [];
  let skipped = 0;
  let repairedIds = 0;
  for (const rawItem of source.items) {
    if (!rawItem || typeof rawItem !== 'object') {
      skipped += 1;
      continue;
    }
    const item = rawItem as PlacedItem;
    const catalog = FURNITURE_CATALOG.find((entry) => entry.id === item.catalogId);
    if (!catalog || !Array.isArray(item.position) || item.position.length !== 3 ||
        !item.position.every(Number.isFinite) || !Number.isFinite(item.rotationY)) {
      skipped += 1;
      continue;
    }
    const widthFt = Number.isFinite(item.widthFt) && item.widthFt > 0 ? Math.min(item.widthFt, 40) : catalog.defaultWidthFt;
    const depthFt = Number.isFinite(item.depthFt) && item.depthFt > 0 ? Math.min(item.depthFt, 40) : catalog.defaultDepthFt;
    const heightFt = Number.isFinite(item.heightFt) && item.heightFt > 0 ? Math.min(item.heightFt, 40) : catalog.defaultHeightFt;
    const isSpecial = catalog.modelType === 'area-rug' || catalog.modelType === 'ceiling-light';
    if (item.position[1] < 0 || item.position[1] + heightFt > roomConfig.heightFt + 0.05 ||
        !isPositionValid(item.position[0], item.position[2], widthFt, depthFt, item.rotationY, items, roomConfig.widthFt, roomConfig.lengthFt, undefined, isSpecial)) {
      skipped += 1;
      continue;
    }

    let instanceId = typeof item.instanceId === 'string' && item.instanceId.trim() ? item.instanceId : `restored-${items.length + 1}`;
    if (usedIds.has(instanceId)) {
      repairedIds += 1;
      let suffix = 2;
      const baseId = instanceId;
      while (usedIds.has(`${baseId}-${suffix}`)) suffix += 1;
      instanceId = `${baseId}-${suffix}`;
    }
    usedIds.add(instanceId);
    items.push({
      ...item,
      instanceId,
      catalogId: catalog.id,
      name: typeof item.name === 'string' && item.name.trim() ? item.name.slice(0, 120) : catalog.name,
      category: catalog.category,
      modelType: catalog.modelType,
      widthFt,
      depthFt,
      heightFt,
      rotationY: item.rotationY,
      color: typeof item.color === 'string' && /^#[0-9a-f]{6}$/i.test(item.color) ? item.color : catalog.defaultColor,
      merchantName: catalog.merchantName,
      merchantSearchUrl: catalog.merchantSearchUrl,
      productUrl: catalog.productUrl,
      affiliateUrl: catalog.affiliateUrl,
      productImageUrl: catalog.productImageUrl,
      isOwned: Boolean(item.isOwned),
      isManual: Boolean(item.isManual),
    });
  }
  if (skipped) warnings.push(`${skipped} invalid or out-of-room furniture item(s) were skipped.`);
  if (repairedIds) warnings.push(`${repairedIds} duplicate furniture ID(s) were repaired.`);

  return {
    data: {
      version: '1.0',
      savedAt: typeof source.savedAt === 'string' ? source.savedAt : new Date(0).toISOString(),
      name: typeof source.name === 'string' ? source.name.slice(0, 120) : `${roomConfig.style} ${roomConfig.roomType}`,
      roomConfig,
      items,
      userIdeaPrompt: typeof source.userIdeaPrompt === 'string' ? source.userIdeaPrompt.slice(0, 1000) : undefined,
    },
    warnings,
  };
}

export function loadDesignFromStorage(): SavedDesignLoadResult | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return sanitizeSavedDesign(JSON.parse(raw));
    }
  } catch (e) {
    console.error('Failed to parse saved design:', e);
  }
  return null;
}

export function clearSavedDesignFromStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to remove design from localStorage:', e);
  }
}

export function downloadDesignJson(data: SavedDesignData): void {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = (data.name || 'cozivara-room-design').toLowerCase().replace(/[^a-z0-9]/g, '-');
    a.download = `${sanitizedTitle}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Failed to download JSON design:', e);
  }
}

export function parseImportedJson(jsonString: string): SavedDesignData {
  const parsed = JSON.parse(jsonString);
  if (!parsed.roomConfig || !Array.isArray(parsed.items)) {
    throw new Error('Invalid Cozivara design file schema');
  }
  return parsed as SavedDesignData;
}

export function captureCanvasPng(canvas: HTMLCanvasElement, filename = 'cozivara-room-3d.png'): void {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error('Failed to capture canvas screenshot:', e);
  }
}

/**
 * Intelligent Local AI Design Brief Generator
 * Synthesizes room dimensions, square footage, style, floor & wall palette,
 * placed furniture, and user wishlist into a structured interior architectural brief.
 */
export function generateLocalAIDesignBrief(
  room: RoomConfig,
  items: PlacedItem[],
  userPrompt?: string
): AIDesignBrief {
  const sqFt = room.widthFt * room.lengthFt;
  const isCompact = sqFt < 150;
  const isSpacious = sqFt > 250;

  // Spatial strategies based on size and room type
  const spatialStrategy: string[] = [];
  if (isCompact) {
    spatialStrategy.push(
      `At ${sqFt} sq ft, prioritize low-slung, floating, or leggy furniture to maximize visible floor area and maintain visual breathability.`,
      `Keep pathways at least 2.5 to 3 feet wide between major pieces like the sofa and coffee table.`,
      `Leverage vertical wall volume for storage (such as tall open bookshelves) rather than deep wide consoles.`
    );
  } else if (isSpacious) {
    spatialStrategy.push(
      `Generous ${sqFt} sq ft floor plate allows intentional zoning: anchor the primary conversational cluster with an oversized area rug.`,
      `Position key seating at least 10–12 inches off perimeter walls for an editorial, floating layout rather than wall-hugging furniture.`,
      `Introduce secondary functional moments, such as a cozy reading corner with an armchair and arched brass floor lamp.`
    );
  } else {
    spatialStrategy.push(
      `Balanced ${sqFt} sq ft proportions accommodate both essential living zones and dedicated functional circulation paths.`,
      `Ensure focal alignment towards primary natural light sources or the architectural media focal wall.`,
      `Maintain a 3-foot clearance perimeter around entrances and wardrobe access doors.`
    );
  }

  // Room type specific note
  if (room.roomType === 'Living Room') {
    spatialStrategy.push(
      `Living Room ergonomics: position coffee table 14–18 inches from the sofa front for effortless reach without impeding legroom.`
    );
  } else if (room.roomType === 'Bedroom') {
    spatialStrategy.push(
      `Bedroom ergonomics: flank the bed with 24–30 inches of walking clearance on both sides for balanced sanctuary aesthetics.`
    );
  } else if (room.roomType === 'Home Office') {
    spatialStrategy.push(
      `Office ergonomics: position desk perpendicular to windows to eliminate screen glare while maintaining mood-lifting indirect sunlight.`
    );
  } else if (room.roomType === 'Dining Room') {
    spatialStrategy.push(
      `Dining ergonomics: ensure minimum 36 inches between dining table edge and wall to pull chairs back comfortably.`
    );
  }

  // Color harmony advice
  const colorMap: Record<string, { primary: string; secondary: string; accent: string; description: string }> = {
    Scandinavian: {
      primary: 'Warm Linen & Blonde Wood',
      secondary: 'Muted Sage & Sand Wool',
      accent: 'Cozivara Olive & Matte Charcoal',
      description: 'Ground the space in light natural timber tones, tactile ivory bouclé textiles, and organic sage greens that invoke Nordic tranquility.',
    },
    Minimalist: {
      primary: 'Alabaster White & Concrete',
      secondary: 'Warm Oatmeal & Smoked Walnut',
      accent: 'Brushed Brass & Deep Espresso',
      description: 'Restrained tone-on-tone palette focusing on textural variety—ribbed wood, nubby linen, and smooth stone—to create warmth without visual noise.',
    },
    Modern: {
      primary: 'Soft Cream & Charcoal Noir',
      secondary: 'Caramel Leather & Smoked Glass',
      accent: 'Brushed Titanium & Olive',
      description: 'Confident contrasts with clean architectural lines, warm dark wood grounding, and sculptural silhouettes.',
    },
    Contemporary: {
      primary: 'Ivory & Warm Taupe',
      secondary: 'Muted Earth & Linen',
      accent: 'Satin Brass & Dark Bronze',
      description: 'Fluid curves, velvety tactile upholstery, and curated neutral balance suited for relaxed luxury.',
    },
    Industrial: {
      primary: 'Loft Grey & Smoked Timber',
      secondary: 'Woven Jute & Raw Canvas',
      accent: 'Matte Black Steel & Cognac Leather',
      description: 'Exposed structural honesty balanced with warm textile layers, soft down lighting, and lush organic plants to soften hard surfaces.',
    },
    Bohemian: {
      primary: 'Dune Sand & Warm Terracotta',
      secondary: 'Natural Rattan & Fringed Wool',
      accent: 'Deep Forest Botanical & Ochre',
      description: 'Layered organic textures, handcrafted woven ceramics, warm earthy pigment washes, and leafy fiddle-leaf figs.',
    },
  };

  const palette = colorMap[room.style] || colorMap['Scandinavian'];

  // Lighting & texture recommendations
  const lightingAndTextureNotes = [
    `Tri-level illumination: pair high diffused ceiling ambient light with an arched floor task lamp and warm bedside/accent table lighting (2700K warm white).`,
    `Tactile layering: balance smooth architectural surfaces (walls & wood floors) with high-pile wool rugs, linen drapery, and ceramic planters.`,
    `Biophilic touch: place tall indoor foliage like Fiddle Leaf Figs in unglazed stoneware pots to breathe natural organic movement into room corners.`,
  ];

  // Missing furniture suggestions
  const placedCategories = new Set(items.map(i => i.category));
  const suggestedAdditions: string[] = [];
  if (!placedCategories.has('Decor & Lighting')) {
    suggestedAdditions.push('Add an Area Rug and Floor Lamp to anchor the room seating cluster and add warm illumination.');
  }
  if (!items.some(i => i.modelType === 'plant-pot')) {
    suggestedAdditions.push('Introduce a Fiddle Leaf Fig plant pot to soften room geometry and elevate organic tranquility.');
  }
  if (room.roomType === 'Living Room' && !items.some(i => i.modelType === 'coffee-table')) {
    suggestedAdditions.push('Include an organic wooden coffee table to complete the central conversational zone.');
  }
  if (room.roomType === 'Bedroom' && !items.some(i => i.modelType === 'nightstand')) {
    suggestedAdditions.push('Pair the bed with matching fluted nightstands for functional symmetry.');
  }
  if (room.roomType === 'Dining Room' && !items.some(i => i.modelType === 'ceiling-light')) {
    suggestedAdditions.push('Hang a warm pendant chandelier above the dining table to create an intimate gathering focal point.');
  }

  const promptTitle = userPrompt && userPrompt.trim().length > 0
    ? `Concept: "${userPrompt.slice(0, 45)}${userPrompt.length > 45 ? '...' : ''}"`
    : `${room.style} ${room.roomType} Curation`;

  return {
    title: promptTitle,
    conceptSummary: userPrompt && userPrompt.trim()
      ? `A custom ${room.style.toLowerCase()} concept tailored around your vision: "${userPrompt.trim()}". Designed for ${room.widthFt}' × ${room.lengthFt}' (${sqFt} sq ft) with ${room.wallColorName} walls and ${room.floorName} flooring.`
      : `An editorial, thoughtfully proportioned ${room.style.toLowerCase()} design concept crafted for a ${room.widthFt}' × ${room.lengthFt}' (${sqFt} sq ft) space with ${room.wallColorName} walls and ${room.floorName} floors.`,
    spatialStrategy,
    colorPaletteAdvice: palette,
    lightingAndTextureNotes,
    suggestedAdditions,
    isLocalFallback: true,
  };
}
