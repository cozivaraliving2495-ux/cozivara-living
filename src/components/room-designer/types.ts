export type RoomType = 'Living Room' | 'Bedroom' | 'Home Office' | 'Dining Room';

export type InteriorStyle =
  | 'Modern'
  | 'Minimalist'
  | 'Scandinavian'
  | 'Contemporary'
  | 'Industrial'
  | 'Bohemian';

export type FurnitureCategory =
  | 'Seating'
  | 'Tables'
  | 'Storage'
  | 'Beds'
  | 'Decor & Lighting'
  | 'Office'
  | 'Dining';

export type CameraViewPreset = '3d' | 'top' | 'front' | 'side';

export interface WallColorOption {
  id: string;
  name: string;
  hex: string;
  roughness: number;
  family?: string;
  description?: string;
}

export interface FloorMaterialOption {
  id: string;
  name: string;
  color: string;
  roughness: number;
  textureType: 'wood' | 'tile' | 'concrete' | 'carpet';
}

export interface RoomConfig {
  widthFt: number;   // X-axis (feet)
  lengthFt: number;  // Z-axis (feet)
  heightFt: number;  // Y-axis (feet)
  roomType: RoomType;
  style: InteriorStyle;
  wallColor: string; // hex
  wallColorName: string;
  floorMaterial: string; // id
  floorColor: string; // hex
  floorName: string;
  showWalls: boolean;
  wallMode: 'all' | 'cutaway' | 'none';
  showGrid: boolean;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  description: string;
  defaultWidthFt: number;   // X
  defaultDepthFt: number;   // Z
  defaultHeightFt: number;  // Y
  merchantName: string; // e.g. Alibaba, IKEA, Target, Amazon Home
  merchantSearchUrl?: string; // fallback search
  productUrl?: string; // verified product link
  affiliateUrl?: string; // affiliate tracking link if configured
  productImageUrl?: string; // real product preview image when available
  defaultColor: string;
  colorOptions: { name: string; hex: string }[];
  modelType: string;
  tags: string[];
}

export interface PlacedItem {
  instanceId: string;
  catalogId: string;
  name: string;
  category: FurnitureCategory;
  modelType: string;
  // Dimensions in feet
  widthFt: number;
  depthFt: number;
  heightFt: number;
  // Position in feet relative to room center (0, 0, 0 on floor)
  position: [number, number, number]; // [x, y, z] in feet
  rotationY: number; // in radians
  color: string;
  merchantName?: string;
  merchantSearchUrl?: string;
  productUrl?: string;
  affiliateUrl?: string;
  productImageUrl?: string;
  isOwned: boolean;
  isManual?: boolean; // true if added manually by user, false if from starter preset
  customName?: string;
}

export interface OwnedTemplateItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  catalogId: string;
  iconName: string;
}

export interface SavedDesignData {
  version: string;
  savedAt: string;
  name: string;
  roomConfig: RoomConfig;
  items: PlacedItem[];
  userIdeaPrompt?: string;
}

export interface AIDesignBrief {
  title: string;
  conceptSummary: string;
  spatialStrategy: string[];
  colorPaletteAdvice: {
    primary: string;
    secondary: string;
    accent: string;
    description: string;
  };
  lightingAndTextureNotes: string[];
  suggestedAdditions: string[];
  isLocalFallback: boolean;
}
