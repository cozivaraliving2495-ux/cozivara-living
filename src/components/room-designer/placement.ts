import type { PlacedItem, CatalogItem, RoomConfig } from './types';

export type PlacementResult =
  | { position: [number, number, number]; rotationY: number; success: true }
  | { position: null; rotationY: number; success: false; message: string };

interface Footprint {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function isCatalogItemValid(item: CatalogItem): boolean {
  return Boolean(
    item.id.trim() && item.name.trim() && item.modelType.trim() &&
    Number.isFinite(item.defaultWidthFt) && item.defaultWidthFt > 0 && item.defaultWidthFt <= 40 &&
    Number.isFinite(item.defaultDepthFt) && item.defaultDepthFt > 0 && item.defaultDepthFt <= 40 &&
    Number.isFinite(item.defaultHeightFt) && item.defaultHeightFt > 0 && item.defaultHeightFt <= 40 &&
    /^#[0-9a-f]{6}$/i.test(item.defaultColor)
  );
}

export function catalogItemFromPlacedItem(item: PlacedItem): CatalogItem {
  return {
    id: item.catalogId,
    name: item.name,
    category: item.category,
    description: '',
    defaultWidthFt: item.widthFt,
    defaultDepthFt: item.depthFt,
    defaultHeightFt: item.heightFt,
    merchantName: item.merchantName || 'Retailer',
    merchantSearchUrl: item.merchantSearchUrl,
    productUrl: item.productUrl,
    affiliateUrl: item.affiliateUrl,
    productImageUrl: item.productImageUrl,
    defaultColor: item.color,
    colorOptions: [],
    modelType: item.modelType,
    tags: [],
  };
}

/**
 * Calculates conservative bounding footprint on XZ plane accounting for rotation.
 */
export function getBoundingFootprint(
  x: number,
  z: number,
  widthFt: number,
  depthFt: number,
  rotY: number,
  padding = 0.2
): Footprint {
  const cos = Math.abs(Math.cos(rotY));
  const sin = Math.abs(Math.sin(rotY));

  const effectiveHalfW = (cos * widthFt + sin * depthFt) / 2 + padding;
  const effectiveHalfD = (sin * widthFt + cos * depthFt) / 2 + padding;

  return {
    minX: x - effectiveHalfW,
    maxX: x + effectiveHalfW,
    minZ: z - effectiveHalfD,
    maxZ: z + effectiveHalfD,
  };
}

/**
 * Checks if a footprint intersects another footprint.
 */
function footprintsIntersect(a: Footprint, b: Footprint): boolean {
  return !(
    a.maxX <= b.minX ||
    a.minX >= b.maxX ||
    a.maxZ <= b.minZ ||
    a.minZ >= b.maxZ
  );
}

/**
 * Checks if footprint is strictly inside room walls.
 */
function isInsideRoom(
  x: number,
  z: number,
  widthFt: number,
  depthFt: number,
  rotY: number,
  roomW: number,
  roomL: number,
  wallMargin = 0.35
): boolean {
  const cos = Math.abs(Math.cos(rotY));
  const sin = Math.abs(Math.sin(rotY));

  const halfW = (cos * widthFt + sin * depthFt) / 2;
  const halfD = (sin * widthFt + cos * depthFt) / 2;

  const maxAllowedX = roomW / 2 - halfW - wallMargin;
  const maxAllowedZ = roomL / 2 - halfD - wallMargin;

  return Math.abs(x) <= maxAllowedX && Math.abs(z) <= maxAllowedZ;
}

/**
 * Tests whether candidate position collides with existing solid furniture.
 */
export function isPositionValid(
  x: number,
  z: number,
  widthFt: number,
  depthFt: number,
  rotY: number,
  existingItems: PlacedItem[],
  roomW: number,
  roomL: number,
  ignoreInstanceId?: string,
  isRugOrCeilingLight = false
): boolean {
  if (
    ![x, z, widthFt, depthFt, rotY, roomW, roomL].every(Number.isFinite) ||
    widthFt <= 0 || depthFt <= 0 || roomW <= 0 || roomL <= 0
  ) return false;

  if (!isInsideRoom(x, z, widthFt, depthFt, rotY, roomW, roomL)) {
    return false;
  }

  // Rugs and ceiling lights can overlap floor items
  if (isRugOrCeilingLight) {
    return true;
  }

  const candidateBox = getBoundingFootprint(x, z, widthFt, depthFt, rotY, 0.25);

  for (const item of existingItems) {
    if (item.instanceId === ignoreInstanceId) continue;
    // Area rugs and ceiling lights don't block floor furniture
    if (item.modelType === 'area-rug' || item.modelType === 'ceiling-light') continue;

    const itemBox = getBoundingFootprint(
      item.position[0],
      item.position[2],
      item.widthFt,
      item.depthFt,
      item.rotationY,
      0.25
    );

    if (footprintsIntersect(candidateBox, itemBox)) {
      return false;
    }
  }

  return true;
}

/**
 * Intelligent Solver to find the best non-overlapping, rule-based position
 * for a new or duplicated furniture item.
 */
export function calculateSmartPlacement(
  catalogItem: CatalogItem,
  existingItems: PlacedItem[],
  room: RoomConfig,
  preferredPos?: [number, number, number],
  preferredRotY?: number,
  ignoreInstanceId?: string
): PlacementResult {
  if (
    !isCatalogItemValid(catalogItem) ||
    !Number.isFinite(room.widthFt) || !Number.isFinite(room.lengthFt) ||
    room.widthFt <= 0 || room.lengthFt <= 0
  ) {
    return {
      position: null,
      rotationY: 0,
      success: false,
      message: 'This furniture item or room size has invalid dimensions.',
    };
  }

  const roomW = room.widthFt;
  const roomL = room.lengthFt;
  const isRug = catalogItem.modelType === 'area-rug';
  const isCeiling = catalogItem.modelType === 'ceiling-light';
  const isSpecial = isRug || isCeiling;

  const w = catalogItem.defaultWidthFt;
  const d = catalogItem.defaultDepthFt;

  // 1. If explicit preferred position is given (e.g. from replace or click), check it first
  if (preferredPos) {
    const rot = preferredRotY ?? 0;
    if (isPositionValid(preferredPos[0], preferredPos[2], w, d, rot, existingItems, roomW, roomL, ignoreInstanceId, isSpecial)) {
      return { position: preferredPos, rotationY: rot, success: true };
    }
  }

  // 2. Identify existing landmarks in the room
  const existingSofa = existingItems.find(i => i.modelType === 'sofa-3seat');
  const existingBed = existingItems.find(i => i.modelType === 'bed-queen');
  const existingDesk = existingItems.find(i => i.modelType === 'desk');
  const existingTv = existingItems.find(i => i.modelType === 'tv-unit');
  const existingDining = existingItems.find(i => i.modelType === 'dining-set');

  // Candidate anchor proposals based on category and room type
  const candidates: Array<{ x: number; z: number; rot: number }> = [];

  switch (catalogItem.modelType) {
    case 'sofa-3seat': {
      if (existingTv) {
        // Place facing TV at comfortable viewing distance
        const facingZ = existingTv.position[2] > 0 ? existingTv.position[2] - 6.5 : existingTv.position[2] + 6.5;
        candidates.push({ x: existingTv.position[0], z: facingZ, rot: existingTv.position[2] > 0 ? Math.PI : 0 });
      }
      // Wall anchors
      candidates.push(
        { x: 0, z: roomL * 0.28, rot: 0 },
        { x: 0, z: -roomL * 0.28, rot: Math.PI },
        { x: roomW * 0.28, z: 0, rot: -Math.PI / 2 }
      );
      break;
    }

    case 'coffee-table': {
      if (existingSofa) {
        // In front of sofa with 1.4ft clearance
        const dir = Math.cos(existingSofa.rotationY) >= 0 ? -1 : 1;
        candidates.push({
          x: existingSofa.position[0],
          z: existingSofa.position[2] + dir * (existingSofa.depthFt / 2 + d / 2 + 1.2),
          rot: existingSofa.rotationY,
        });
      }
      candidates.push({ x: 0, z: 0.2, rot: 0 });
      break;
    }

    case 'armchair': {
      if (existingSofa) {
        // Flanking sofa at 45 degree conversation angle
        candidates.push(
          { x: existingSofa.position[0] - (existingSofa.widthFt / 2 + w / 2 + 1.2), z: existingSofa.position[2] - 1.2, rot: Math.PI / 4 },
          { x: existingSofa.position[0] + (existingSofa.widthFt / 2 + w / 2 + 1.2), z: existingSofa.position[2] - 1.2, rot: -Math.PI / 4 }
        );
      }
      candidates.push(
        { x: -roomW * 0.3, z: roomL * 0.1, rot: Math.PI / 4 },
        { x: roomW * 0.3, z: roomL * 0.1, rot: -Math.PI / 4 }
      );
      break;
    }

    case 'tv-unit': {
      // Wall-backed locations
      candidates.push(
        { x: 0, z: -roomL / 2 + d / 2 + 0.35, rot: Math.PI },
        { x: 0, z: roomL / 2 - d / 2 - 0.35, rot: 0 },
        { x: roomW / 2 - w / 2 - 0.35, z: 0, rot: -Math.PI / 2 }
      );
      break;
    }

    case 'bed-queen': {
      // Centered against back wall
      candidates.push(
        { x: 0, z: -roomL / 2 + d / 2 + 0.35, rot: 0 },
        { x: 0, z: roomL / 2 - d / 2 - 0.35, rot: Math.PI }
      );
      break;
    }

    case 'nightstand': {
      if (existingBed) {
        // Left side of bed
        candidates.push({
          x: existingBed.position[0] - (existingBed.widthFt / 2 + w / 2 + 0.4),
          z: existingBed.position[2] - existingBed.depthFt * 0.15,
          rot: existingBed.rotationY,
        });
        // Right side of bed
        candidates.push({
          x: existingBed.position[0] + (existingBed.widthFt / 2 + w / 2 + 0.4),
          z: existingBed.position[2] - existingBed.depthFt * 0.15,
          rot: existingBed.rotationY,
        });
      }
      candidates.push(
        { x: -roomW * 0.32, z: -roomL * 0.3, rot: 0 },
        { x: roomW * 0.32, z: -roomL * 0.3, rot: 0 }
      );
      break;
    }

    case 'desk': {
      candidates.push(
        { x: 0, z: -roomL / 2 + d / 2 + 0.4, rot: 0 },
        { x: -roomW / 2 + w / 2 + 0.4, z: 0, rot: Math.PI / 2 },
        { x: roomW / 2 - w / 2 - 0.4, z: 0, rot: -Math.PI / 2 }
      );
      break;
    }

    case 'office-chair': {
      if (existingDesk) {
        // Placed comfortably at the desk
        candidates.push({
          x: existingDesk.position[0],
          z: existingDesk.position[2] + (existingDesk.depthFt / 2 + d / 2 + 0.4),
          rot: existingDesk.rotationY,
        });
      }
      candidates.push({ x: 0, z: 0, rot: 0 });
      break;
    }

    case 'bookshelf': {
      candidates.push(
        { x: -roomW / 2 + w / 2 + 0.35, z: roomL * 0.2, rot: Math.PI / 2 },
        { x: roomW / 2 - w / 2 - 0.35, z: roomL * 0.2, rot: -Math.PI / 2 },
        { x: 0, z: -roomL / 2 + d / 2 + 0.35, rot: 0 }
      );
      break;
    }

    case 'wardrobe': {
      candidates.push(
        { x: -roomW / 2 + w / 2 + 0.35, z: roomL * 0.25, rot: Math.PI / 2 },
        { x: roomW / 2 - w / 2 - 0.35, z: roomL * 0.25, rot: -Math.PI / 2 }
      );
      break;
    }

    case 'dining-set': {
      candidates.push({ x: 0, z: 0, rot: 0 });
      break;
    }

    case 'plant-pot': {
      // Corners of the room where plants thrive and don't impede flow
      candidates.push(
        { x: -roomW / 2 + w / 2 + 0.6, z: -roomL / 2 + d / 2 + 0.6, rot: 0 },
        { x: roomW / 2 - w / 2 - 0.6, z: -roomL / 2 + d / 2 + 0.6, rot: 0 },
        { x: -roomW / 2 + w / 2 + 0.6, z: roomL / 2 - d / 2 - 0.6, rot: 0 },
        { x: roomW / 2 - w / 2 - 0.6, z: roomL / 2 - d / 2 - 0.6, rot: 0 }
      );
      break;
    }

    case 'floor-lamp': {
      if (existingSofa) {
        candidates.push(
          { x: existingSofa.position[0] + (existingSofa.widthFt / 2 + w / 2 + 0.6), z: existingSofa.position[2] + 0.4, rot: -Math.PI / 4 },
          { x: existingSofa.position[0] - (existingSofa.widthFt / 2 + w / 2 + 0.6), z: existingSofa.position[2] + 0.4, rot: Math.PI / 4 }
        );
      } else if (existingBed) {
        candidates.push({
          x: existingBed.position[0] + (existingBed.widthFt / 2 + 2.0),
          z: existingBed.position[2] + existingBed.depthFt * 0.4,
          rot: -Math.PI / 3,
        });
      }
      candidates.push(
        { x: roomW * 0.32, z: roomL * 0.28, rot: -Math.PI / 4 },
        { x: -roomW * 0.32, z: roomL * 0.28, rot: Math.PI / 4 }
      );
      break;
    }

    case 'area-rug': {
      candidates.push({ x: 0, z: 0.3, rot: 0 });
      break;
    }

    case 'ceiling-light': {
      candidates.push({ x: 0, z: 0, rot: 0 });
      break;
    }

    default: {
      candidates.push({ x: 0, z: 0, rot: 0 });
      break;
    }
  }

  // 3. Test primary candidate proposals
  for (const c of candidates) {
    if (isPositionValid(c.x, c.z, w, d, c.rot, existingItems, roomW, roomL, ignoreInstanceId, isSpecial)) {
      const heightY = isCeiling ? Math.max(0, room.heightFt - catalogItem.defaultHeightFt) : isRug ? 0.006 : 0;
      return { position: [c.x, heightY, c.z], rotationY: c.rot, success: true };
    }
  }

  // 4. Spiral search around first preferred candidate to find nearest open floor clearance
  const anchorX = candidates[0]?.x ?? 0;
  const anchorZ = candidates[0]?.z ?? 0;
  const anchorRot = candidates[0]?.rot ?? 0;

  const maxRadius = Math.max(roomW, roomL) / 2;
  const radiusStep = 0.5; // ft
  const angleStep = Math.PI / 8; // 22.5 deg

  for (let r = 0.8; r <= maxRadius; r += radiusStep) {
    for (let theta = 0; theta < Math.PI * 2; theta += angleStep) {
      const testX = anchorX + Math.cos(theta) * r;
      const testZ = anchorZ + Math.sin(theta) * r;

      if (isPositionValid(testX, testZ, w, d, anchorRot, existingItems, roomW, roomL, ignoreInstanceId, isSpecial)) {
        const heightY = isCeiling ? Math.max(0, room.heightFt - catalogItem.defaultHeightFt) : isRug ? 0.006 : 0;
        return { position: [testX, heightY, testZ], rotationY: anchorRot, success: true };
      }
    }
  }

  // 5. Grid sweep across entire room perimeter as secondary fallback
  const stepX = 1.0;
  const stepZ = 1.0;
  const limitX = roomW / 2 - w / 2 - 0.4;
  const limitZ = roomL / 2 - d / 2 - 0.4;

  for (let gx = -limitX; gx <= limitX; gx += stepX) {
    for (let gz = -limitZ; gz <= limitZ; gz += stepZ) {
      if (isPositionValid(gx, gz, w, d, 0, existingItems, roomW, roomL, ignoreInstanceId, isSpecial)) {
        const heightY = isCeiling ? Math.max(0, room.heightFt - catalogItem.defaultHeightFt) : isRug ? 0.006 : 0;
        return { position: [gx, heightY, gz], rotationY: 0, success: true };
      }
    }
  }

  // No safe position was found. Never return an overlapping center fallback.
  return {
    position: null,
    rotationY: 0,
    success: false,
    message: 'There is no clear space for this item. Move or remove furniture, then try again.',
  };
}

/**
 * Calculates replacement position:
 * Keeps the original position and rotation if the replacement fits;
 * otherwise adjusts to the nearest non-colliding position.
 */
export function calculateReplacementPlacement(
  newCatalogItem: CatalogItem,
  itemToReplace: PlacedItem,
  existingItems: PlacedItem[],
  room: RoomConfig
): PlacementResult {
  return calculateSmartPlacement(
    newCatalogItem,
    existingItems,
    room,
    itemToReplace.position,
    itemToReplace.rotationY,
    itemToReplace.instanceId
  );
}

/**
 * Calculates a valid position for a duplicated item:
 * Finds an adjacent, non-overlapping location next to the original.
 */
export function calculateDuplicatePlacement(
  originalItem: PlacedItem,
  existingItems: PlacedItem[],
  room: RoomConfig
): PlacementResult {
  const catItem = catalogItemFromPlacedItem(originalItem);

  const shiftDist = Math.max(originalItem.widthFt, originalItem.depthFt) + 0.6;
  const candidateOffsets = [
    [shiftDist, 0],
    [-shiftDist, 0],
    [0, shiftDist],
    [0, -shiftDist],
    [shiftDist * 0.7, shiftDist * 0.7],
    [-shiftDist * 0.7, shiftDist * 0.7],
  ];

  for (const [dx, dz] of candidateOffsets) {
    const testX = originalItem.position[0] + dx;
    const testZ = originalItem.position[2] + dz;

    if (isPositionValid(testX, testZ, originalItem.widthFt, originalItem.depthFt, originalItem.rotationY, existingItems, room.widthFt, room.lengthFt)) {
      return {
        position: [testX, originalItem.position[1], testZ],
        rotationY: originalItem.rotationY,
        success: true,
      };
    }
  }

  // Fallback to general solver
  return calculateSmartPlacement(catItem, existingItems, room);
}
