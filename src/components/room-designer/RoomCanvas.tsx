import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { RoomConfig, PlacedItem, CameraViewPreset } from './types';
import { RoomScene } from './RoomScene';
import { FT_TO_UNITS } from './FurnitureModels';
import {
  Box,
  Layers,
  Eye,
  EyeOff,
  Grid,
  RotateCcw,
  RotateCw,
  Maximize2,
  Compass,
  Scan,
  LayoutGrid,
  HelpCircle,
  X,
  Undo2,
  Redo2,
  Magnet,
  Move
} from 'lucide-react';

export interface RoomCanvasHandle {
  captureSnapshot: () => string | null;
  resetView: () => void;
}

interface RoomCanvasProps {
  room: RoomConfig;
  items: PlacedItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItemPosition: (id: string, newPosFt: [number, number, number]) => void;
  onInvalidMove: () => void;
  onToggleWalls: () => void;
  onToggleGrid: () => void;
  onChangeWallMode: (mode: 'all' | 'cutaway' | 'none') => void;
  gridSnap?: boolean;
  onToggleGridSnap?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

/**
 * Computes camera framing distance to fit the full room inside the frustum
 * with generous margins on both desktop and mobile screens.
 */
export function computeFitDistance(room: RoomConfig, fovDegrees = 40): number {
  const roomW = room.widthFt * FT_TO_UNITS;
  const roomL = room.lengthFt * FT_TO_UNITS;
  const roomH = (room.heightFt || 9) * FT_TO_UNITS;

  const diagRoom = Math.sqrt(roomW * roomW + roomL * roomL + roomH * roomH);
  const fovRad = (fovDegrees * Math.PI) / 180;
  // Margin multiplier 1.35x ensures room never touches viewport borders
  return (diagRoom * 0.5) / Math.sin(fovRad / 2) * 1.35;
}

/**
 * Controller component inside R3F Canvas to animate camera transitions
 * and maintain framing when room dimensions change.
 */
const CameraController: React.FC<{
  viewPreset: CameraViewPreset;
  viewRevision: number;
  room: RoomConfig;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}> = ({ viewPreset, viewRevision, room, controlsRef }) => {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3(0, (room.heightFt * FT_TO_UNITS) * 0.35, 0));
  const isTransitioning = useRef(false);

  const roomW = room.widthFt * FT_TO_UNITS;
  const roomL = room.lengthFt * FT_TO_UNITS;
  const roomH = (room.heightFt || 9) * FT_TO_UNITS;

  const fitDist = computeFitDistance(room, 40);

  useEffect(() => {
    isTransitioning.current = true;
    const centerH = roomH * 0.35;

    switch (viewPreset) {
      case 'top':
        // Straight top-down plan view
        targetCamPos.current.set(0, fitDist * 1.15, 0.001);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'front':
        // Front elevation facing north
        targetCamPos.current.set(0, centerH, fitDist * 0.95);
        targetLookAt.current.set(0, centerH, 0);
        break;
      case 'side':
        // Side elevation facing east
        targetCamPos.current.set(fitDist * 0.95, centerH, 0);
        targetLookAt.current.set(0, centerH, 0);
        break;
      case '3d':
      default:
        // Polished 3D isometric perspective framing the entire room
        targetCamPos.current.set(fitDist * 0.72, fitDist * 0.62 + centerH, fitDist * 0.72);
        targetLookAt.current.set(0, centerH, 0);
        break;
    }
  }, [viewPreset, viewRevision, roomW, roomL, roomH, fitDist]);

  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    camera.position.lerp(targetCamPos.current, Math.min(delta * 6, 1));
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, Math.min(delta * 6, 1));
      controlsRef.current.update();
    }

    if (camera.position.distanceTo(targetCamPos.current) < 0.04) {
      isTransitioning.current = false;
    }
  });

  return null;
};

export const RoomCanvas = forwardRef<RoomCanvasHandle, RoomCanvasProps>(({
  room,
  items,
  selectedId,
  onSelectItem,
  onUpdateItemPosition,
  onInvalidMove,
  onToggleWalls,
  onToggleGrid,
  onChangeWallMode,
}, ref) => {
  const [viewPreset, setViewPreset] = useState<CameraViewPreset>('3d');
  const [viewRevision, setViewRevision] = useState(0);
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isDraggingRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestView = (preset: CameraViewPreset) => {
    setViewPreset(preset);
    setViewRevision((revision) => revision + 1);
  };

  const roomW = room.widthFt * FT_TO_UNITS;
  const roomL = room.lengthFt * FT_TO_UNITS;
  const roomH = (room.heightFt || 9) * FT_TO_UNITS;

  const fitDist = computeFitDistance(room, 40);

  // Expose snapshot capture and reset functions
  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/png');
      }
      return null;
    },
    resetView: () => {
      requestView('3d');
    },
  }));

  useEffect(() => {
    setCanvasMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[680px] bg-[#F7F4EE] rounded-3xl overflow-hidden border border-cozi-border/90 shadow-soft select-none">
      {/* 3D WebGL Canvas */}
      {canvasMounted && (
        <Canvas
          dpr={[1, 1.5]}
          shadows
          fallback={<div role="status" className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-cozi-charcoal">3D preview is unavailable in this browser. The room controls and furniture list are still available.</div>}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          camera={{
            position: [fitDist * 0.72, fitDist * 0.62 + roomH * 0.35, fitDist * 0.72],
            fov: 40,
            near: 0.1,
            far: 150,
          }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
          }}
        >
          <CameraController
            viewPreset={viewPreset}
            viewRevision={viewRevision}
            room={room}
            controlsRef={controlsRef}
          />

          <RoomScene
            room={room}
            items={items}
            selectedId={selectedId}
            onSelectItem={onSelectItem}
            onUpdateItemPosition={onUpdateItemPosition}
            onInvalidMove={onInvalidMove}
            isDraggingRef={isDraggingRef}
            onDraggingChange={setIsDragging}
          />

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2.0}
            maxDistance={fitDist * 3.0}
            maxPolarAngle={Math.PI / 2 - 0.02} // Prevent camera from dipping beneath floor plane
            enabled={!isDragging}
          />
        </Canvas>
      )}

      {/* --- TOP-LEFT VIEWPORT CONTROLS: Working Camera Presets --- */}
      <div
        className="absolute top-4 left-4 right-4 sm:right-auto z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-cozi-border shadow-soft"
        role="group"
        aria-label="Camera Views"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-cozi-charcoal/60 px-1 hidden md:inline">
          Camera
        </span>

        {/* 1. 3D Perspective View (Initial & Primary) */}
        <button
          type="button"
          onClick={() => requestView('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewPreset === '3d'
              ? 'bg-cozi-olive text-white shadow-xs ring-2 ring-cozi-olive/20'
              : 'text-cozi-charcoal/80 hover:bg-cozi-cream/80'
          }`}
          aria-pressed={viewPreset === '3d'}
          title="3D Perspective Isometric Orbit (Initial View)"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>

        {/* 2. Top Plan View */}
        <button
          type="button"
          onClick={() => requestView('top')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewPreset === 'top'
              ? 'bg-cozi-olive text-white shadow-xs ring-2 ring-cozi-olive/20'
              : 'text-cozi-charcoal/80 hover:bg-cozi-cream/80'
          }`}
          aria-pressed={viewPreset === 'top'}
          title="Top Down Floor Plan"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Top Plan</span>
        </button>

        {/* 3. Front Elevation */}
        <button
          type="button"
          onClick={() => requestView('front')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewPreset === 'front'
              ? 'bg-cozi-olive text-white shadow-xs ring-2 ring-cozi-olive/20'
              : 'text-cozi-charcoal/80 hover:bg-cozi-cream/80'
          }`}
          aria-pressed={viewPreset === 'front'}
          title="Front Elevation Wall View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Front</span>
        </button>

        {/* 4. Side Elevation */}
        <button
          type="button"
          onClick={() => requestView('side')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewPreset === 'side'
              ? 'bg-cozi-olive text-white shadow-xs ring-2 ring-cozi-olive/20'
              : 'text-cozi-charcoal/80 hover:bg-cozi-cream/80'
          }`}
          aria-pressed={viewPreset === 'side'}
          title="Side Elevation Profile View"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Side</span>
        </button>

        {/* Fit to View / Center Room */}
        <button
          type="button"
          onClick={() => requestView('3d')}
          className="p-1.5 text-cozi-charcoal/60 hover:text-cozi-olive hover:bg-cozi-cream rounded-lg transition-colors border-l border-cozi-border pl-2 ml-1"
          title="Fit Room & Center View"
          aria-label="Fit Room & Center View"
        >
          <Scan className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* --- TOP-RIGHT VIEWPORT CONTROLS: Wall & Grid Display --- */}
      <div className="absolute top-28 sm:top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-cozi-border shadow-soft">
        <button
          type="button"
          onClick={() => setShowHelp((visible) => !visible)}
          className="p-1.5 rounded-xl text-cozi-charcoal/70 hover:bg-cozi-cream"
          aria-label={showHelp ? 'Hide 3D controls help' : 'Show 3D controls help'}
          aria-expanded={showHelp}
          title="3D controls help"
        >
          {showHelp ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
        </button>
        {/* Wall Cutaway Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            if (room.wallMode === 'cutaway') onChangeWallMode('all');
            else if (room.wallMode === 'all') onChangeWallMode('none');
            else onChangeWallMode('cutaway');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-cozi-charcoal hover:bg-cozi-cream rounded-xl transition-colors"
          title="Toggle Wall Display: Cutaway, All 4 Walls, or Hide Walls"
        >
          {room.wallMode === 'none' ? (
            <EyeOff className="w-3.5 h-3.5 text-cozi-charcoal/50" />
          ) : (
            <Layers className="w-3.5 h-3.5 text-cozi-olive" />
          )}
          <span className="capitalize">{room.wallMode} Walls</span>
        </button>

        {/* Floor Grid Toggle */}
        <button
          type="button"
          onClick={onToggleGrid}
          className={`p-1.5 rounded-xl transition-colors ${
            room.showGrid ? 'bg-cozi-cream text-cozi-olive font-bold' : 'text-cozi-charcoal/60 hover:bg-cozi-cream'
          }`}
          title={room.showGrid ? 'Hide Floor Grid' : 'Show Floor Grid'}
          aria-label="Toggle Floor Grid"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Reset Camera Orbit */}
        <button
          type="button"
          onClick={() => requestView('3d')}
          className="p-1.5 rounded-xl text-cozi-charcoal/70 hover:bg-cozi-cream transition-colors"
          title="Reset Camera View to 3D"
          aria-label="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* --- BOTTOM-LEFT VIEWPORT TIPS & INSTRUCTIONS --- */}
      {showHelp && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 max-w-md bg-white/95 backdrop-blur-xs px-3.5 py-3 rounded-xl border border-cozi-border/80 text-[11px] text-cozi-charcoal/75 shadow-soft" role="note" aria-label="3D view controls help">
          <div className="flex items-start gap-2">
            <Compass className="w-4 h-4 text-cozi-olive shrink-0 mt-0.5" />
            <p><strong>View:</strong> drag empty space to orbit, scroll or pinch to zoom, and use the view buttons above. <strong>Furniture:</strong> click an item to select it, then drag it across the floor. Use the selected item panel to rotate or fine-tune its position.</p>
          </div>
          <button type="button" onClick={() => setShowHelp(false)} className="mt-2 text-cozi-olive font-semibold hover:underline" aria-label="Dismiss 3D view help">Got it</button>
        </div>
      )}

      {/* --- BOTTOM-RIGHT ROOM DIMENSIONS BADGE --- */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-cozi-border/80 text-xs font-semibold text-cozi-charcoal shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-cozi-olive animate-pulse"></span>
        <span>{room.widthFt}'W × {room.lengthFt}'L ({room.widthFt * room.lengthFt} sq ft)</span>
      </div>
    </div>
  );
});

RoomCanvas.displayName = 'RoomCanvas';
