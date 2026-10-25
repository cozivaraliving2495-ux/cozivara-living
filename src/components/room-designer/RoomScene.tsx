import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import type { RoomConfig, PlacedItem } from './types';
import { FurnitureModel, FT_TO_UNITS } from './FurnitureModels';
import { isPositionValid } from './placement';
import { FLOOR_MATERIALS } from './catalog';

interface RoomSceneProps {
  room: RoomConfig;
  items: PlacedItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItemPosition: (id: string, newPosFt: [number, number, number]) => void;
  onInvalidMove: () => void;
  isDraggingRef: React.MutableRefObject<boolean>;
  gridSnap?: boolean;
  onDraggingChange?: (dragging: boolean) => void;
}

function createFloorTexture(color: string, type: string, widthFt: number, lengthFt: number): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (type === 'wood') {
    for (let y = 0; y < canvas.height; y += 64) {
      context.fillStyle = 'rgba(74, 53, 35, 0.12)';
      context.fillRect(0, y, canvas.width, 2);
      context.fillStyle = 'rgba(255, 255, 255, 0.12)';
      context.fillRect(0, y + 3, canvas.width, 1);
      for (let x = 16; x < canvas.width; x += 83) {
        context.fillStyle = 'rgba(74, 53, 35, 0.08)';
        context.fillRect(x + ((y / 64) % 2) * 31, y + 4, 1, 55);
      }
    }
  } else if (type === 'tile') {
    context.strokeStyle = 'rgba(79, 68, 55, 0.16)';
    context.lineWidth = 3;
    for (let position = 0; position <= 512; position += 128) {
      context.beginPath(); context.moveTo(position, 0); context.lineTo(position, 512); context.stroke();
      context.beginPath(); context.moveTo(0, position); context.lineTo(512, position); context.stroke();
    }
  } else if (type === 'concrete') {
    for (let i = 0; i < 600; i += 1) {
      const x = (i * 73) % 512;
      const y = (i * 191) % 512;
      context.fillStyle = i % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(54,54,54,0.06)';
      context.fillRect(x, y, i % 3 === 0 ? 2 : 1, 1);
    }
  } else if (type === 'carpet') {
    for (let y = 0; y < 512; y += 5) {
      for (let x = (y % 2) * 2; x < 512; x += 5) {
        context.fillStyle = (x + y) % 3 ? 'rgba(95,78,63,0.07)' : 'rgba(255,255,255,0.1)';
        context.fillRect(x, y, 1, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(Math.max(1, widthFt / 5), Math.max(1, lengthFt / 5));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export const RoomScene: React.FC<RoomSceneProps> = ({
  room,
  items,
  selectedId,
  onSelectItem,
  onUpdateItemPosition,
  onInvalidMove,
  isDraggingRef,
  gridSnap = true,
  onDraggingChange,
}) => {
  const { raycaster, camera } = useThree();
  const floorPlaneRef = useRef<THREE.Mesh>(null);
  const dragOffset = useRef<[number, number]>([0, 0]);
  const draggedId = useRef<string | null>(null);
  const lastInvalidMoveNotice = useRef(0);

  // Dimensions in Three.js coordinates
  const roomW = room.widthFt * FT_TO_UNITS;
  const roomL = room.lengthFt * FT_TO_UNITS;
  const roomH = (room.heightFt || 9) * FT_TO_UNITS;
  const wallThickness = 0.12; // ~5 inches architectural wall thickness
  const baseboardH = 0.08;

  // Materials
  const selectedFloor = FLOOR_MATERIALS.find((floor) => floor.id === room.floorMaterial) || FLOOR_MATERIALS[0];
  const floorTexture = useMemo(
    () => createFloorTexture(room.floorColor || selectedFloor.color, selectedFloor.textureType, room.widthFt, room.lengthFt),
    [room.floorColor, selectedFloor.color, selectedFloor.textureType, room.widthFt, room.lengthFt]
  );
  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    map: floorTexture,
    roughness: selectedFloor.roughness,
    metalness: 0,
  }), [floorTexture, selectedFloor.roughness]);

  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(room.wallColor || '#F5F2EB'),
    roughness: 0.9,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }), [room.wallColor]);

  const baseboardMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFFFF'),
    roughness: 0.4,
  }), []);

  useEffect(() => () => floorTexture?.dispose(), [floorTexture]);
  useEffect(() => () => floorMat.dispose(), [floorMat]);
  useEffect(() => () => wallMat.dispose(), [wallMat]);

  // Half dimensions
  const halfW = roomW / 2;
  const halfL = roomL / 2;

  // Listen to window pointerup to safely release drag if pointer leaves canvas
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
      draggedId.current = null;
      onDraggingChange?.(false);
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDraggingRef, onDraggingChange]);

  // Pointer down on a furniture item initiates smooth floor drag
  const handleItemPointerDown = (item: PlacedItem, e: ThreeEvent<PointerEvent>) => {
    isDraggingRef.current = true;
    onDraggingChange?.(true);
    draggedId.current = item.instanceId;
    onSelectItem(item.instanceId);

    const intersect = e.point;
    if (intersect) {
      const intersectXFt = intersect.x / FT_TO_UNITS;
      const intersectZFt = intersect.z / FT_TO_UNITS;
      dragOffset.current = [
        intersectXFt - item.position[0],
        intersectZFt - item.position[2],
      ];
    }
  };

  // Drag interaction on the floor plane
  const handleFloorPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // If clicking directly on empty floor, deselect
    if (e.intersections.length > 0 && e.intersections[0].object === floorPlaneRef.current) {
      onSelectItem(null);
    }
  };

  const handleFloorPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDraggingRef.current || !draggedId.current) return;

    const currentItem = items.find((i) => i.instanceId === draggedId.current);
    if (!currentItem) return;

    // Raycast on floor plane
    const intersect = e.point;
    if (intersect) {
      // Convert intersection point back to feet relative to room center
      let posXFt = intersect.x / FT_TO_UNITS - dragOffset.current[0];
      let posZFt = intersect.z / FT_TO_UNITS - dragOffset.current[1];

      // Optional 0.5 ft modular grid snap
      if (gridSnap) {
        posXFt = Math.round(posXFt * 2) / 2;
        posZFt = Math.round(posZFt * 2) / 2;
      }

      // Conservative effective footprint accounting for rotation
      const cos = Math.abs(Math.cos(currentItem.rotationY));
      const sin = Math.abs(Math.sin(currentItem.rotationY));
      const halfItemWFt = (cos * currentItem.widthFt + sin * currentItem.depthFt) / 2;
      const halfItemDFt = (sin * currentItem.widthFt + cos * currentItem.depthFt) / 2;

      // Clamp strictly within room interior boundaries (with 0.25ft margin)
      const maxClampX = room.widthFt / 2 - halfItemWFt - 0.25;
      const maxClampZ = room.lengthFt / 2 - halfItemDFt - 0.25;

      const clampedX = Math.max(-maxClampX, Math.min(maxClampX, posXFt));
      const clampedZ = Math.max(-maxClampZ, Math.min(maxClampZ, posZFt));

      const isSpecial = currentItem.modelType === 'area-rug' || currentItem.modelType === 'ceiling-light';
      if (isPositionValid(clampedX, clampedZ, currentItem.widthFt, currentItem.depthFt, currentItem.rotationY, items, room.widthFt, room.lengthFt, currentItem.instanceId, isSpecial)) {
        onUpdateItemPosition(draggedId.current, [clampedX, currentItem.position[1], clampedZ]);
      } else if (Date.now() - lastInvalidMoveNotice.current > 1200) {
        lastInvalidMoveNotice.current = Date.now();
        onInvalidMove();
      }
    }
  };

  const handleFloorPointerUp = () => {
    isDraggingRef.current = false;
    draggedId.current = null;
    onDraggingChange?.(false);
  };

  // Wall visibility flags based on mode
  const showBackWall = room.showWalls && room.wallMode !== 'none';
  const showLeftWall = room.showWalls && room.wallMode !== 'none';
  const showRightWall = room.showWalls && (room.wallMode === 'all');
  const showFrontWall = room.showWalls && (room.wallMode === 'all');

  return (
    <group onPointerUp={handleFloorPointerUp}>
      {/* --- STUDIO LIGHTING SYSTEM --- */}
      {/* Warm Ambient Fill */}
      <ambientLight color="#FFF8F0" intensity={0.65} />

      {/* Primary Key Directional Sunlight casting soft shadows */}
      <directionalLight
        position={[roomW * 0.9, roomH * 1.8, roomL * 1.1]}
        color="#FFFDF7"
        intensity={0.9}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-roomW}
        shadow-camera-right={roomW}
        shadow-camera-top={roomL}
        shadow-camera-bottom={-roomL}
        shadow-bias={-0.0005}
      />

      {/* Gentle Fill Light from opposite direction */}
      <directionalLight
        position={[-roomW * 0.8, roomH * 1.2, -roomL * 0.8]}
        color="#EEF2EC"
        intensity={0.35}
      />

      {/* Soft Center Ceiling Luminescence */}
      <pointLight
        position={[0, roomH * 0.9, 0]}
        color="#FFF4E0"
        intensity={0.4}
        distance={roomW * 2}
      />

      {/* --- ROOM FLOOR --- */}
      <mesh
        ref={floorPlaneRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={floorMat}
        onPointerDown={handleFloorPointerDown}
        onPointerMove={handleFloorPointerMove}
      >
        <planeGeometry args={[roomW, roomL]} />
      </mesh>

      {/* Optional Spatial Grid overlay */}
      {room.showGrid && (
        <gridHelper
          args={[
            Math.max(roomW, roomL),
            Math.round(Math.max(room.widthFt, room.lengthFt)),
            '#485540',
            '#C4A484'
          ]}
          position={[0, 0.002, 0]}
        />
      )}

      {/* Outer Floor Sub-base / Foundation */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[roomW + wallThickness * 2, 0.1, roomL + wallThickness * 2]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.9} />
      </mesh>

      {/* --- ARCHITECTURAL WALLS & BASEBOARDS --- */}

      {/* Back Wall (North: -Z) */}
      {showBackWall && (
        <group position={[0, roomH / 2, -halfL - wallThickness / 2]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={[roomW + wallThickness * 2, roomH, wallThickness]} />
          </mesh>
          {/* Baseboard */}
          <mesh position={[0, -roomH / 2 + baseboardH / 2, wallThickness / 2 + 0.005]} material={baseboardMat}>
            <boxGeometry args={[roomW, baseboardH, 0.015]} />
          </mesh>
        </group>
      )}

      {/* Left Wall (West: -X) */}
      {showLeftWall && (
        <group position={[-halfW - wallThickness / 2, roomH / 2, 0]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={[wallThickness, roomH, roomL]} />
          </mesh>
          {/* Baseboard */}
          <mesh position={[wallThickness / 2 + 0.005, -roomH / 2 + baseboardH / 2, 0]} material={baseboardMat}>
            <boxGeometry args={[0.015, baseboardH, roomL]} />
          </mesh>
        </group>
      )}

      {/* Right Wall (East: +X) */}
      {showRightWall ? (
        <group position={[halfW + wallThickness / 2, roomH / 2, 0]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={[wallThickness, roomH, roomL]} />
          </mesh>
          {/* Baseboard */}
          <mesh position={[-wallThickness / 2 - 0.005, -roomH / 2 + baseboardH / 2, 0]} material={baseboardMat}>
            <boxGeometry args={[0.015, baseboardH, roomL]} />
          </mesh>
        </group>
      ) : room.wallMode === 'cutaway' && room.showWalls ? (
        /* Low Cutaway Knee Wall */
        <group position={[halfW + wallThickness / 2, 0.2, 0]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={[wallThickness, 0.4, roomL]} />
          </mesh>
        </group>
      ) : null}

      {/* Front Wall (South: +Z) */}
      {showFrontWall ? (
        <group position={[0, roomH / 2, halfL + wallThickness / 2]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={[roomW + wallThickness * 2, roomH, wallThickness]} />
          </mesh>
          {/* Baseboard */}
          <mesh position={[0, -roomH / 2 + baseboardH / 2, -wallThickness / 2 - 0.005]} material={baseboardMat}>
            <boxGeometry args={[roomW, baseboardH, 0.015]} />
          </mesh>
        </group>
      ) : room.wallMode === 'cutaway' && room.showWalls ? (
        /* Low Cutaway Knee Wall */
        <group position={[0, 0.2, halfL + wallThickness / 2]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={[roomW + wallThickness * 2, 0.4, wallThickness]} />
          </mesh>
        </group>
      ) : null}

      {/* --- PLACED FURNITURE ITEMS --- */}
      {items.map((item) => (
        <FurnitureModel
          key={item.instanceId}
          item={item}
          isSelected={item.instanceId === selectedId}
          onSelect={() => onSelectItem(item.instanceId)}
          onPointerDown={(e) => handleItemPointerDown(item, e)}
        />
      ))}
    </group>
  );
};
