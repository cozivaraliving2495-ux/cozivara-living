import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { PlacedItem } from './types';

interface FurnitureModelProps {
  item: PlacedItem;
  isSelected: boolean;
  onSelect: () => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

// Convert feet to Three.js units (1 foot = 0.3048 units/meters, or 1 ft = 0.3m for pleasant proportions)
export const FT_TO_UNITS = 0.3048;

/**
 * Procedural 3D Furniture Models using Three.js Primitives
 * Accurately scaled to real-world feet converted to 3D units.
 */
export const FurnitureModel: React.FC<FurnitureModelProps> = ({ item, isSelected, onSelect, onPointerDown }) => {
  const w = item.widthFt * FT_TO_UNITS;
  const d = item.depthFt * FT_TO_UNITS;
  const h = item.heightFt * FT_TO_UNITS;

  const color = item.color || '#D4C5B9';

  const woodColor = '#8A6A4B';
  const darkWoodColor = '#4A3525';
  const metalColor = '#2B2B2B';
  const brassColor = '#C5A059';

  // Materials
  const mainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.8,
    metalness: 0.05,
  }), [color]);

  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(woodColor),
    roughness: 0.6,
    metalness: 0.1,
  }), []);

  const darkWoodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(darkWoodColor),
    roughness: 0.7,
  }), []);

  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(metalColor),
    roughness: 0.4,
    metalness: 0.8,
  }), []);

  const brassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(brassColor),
    roughness: 0.3,
    metalness: 0.85,
  }), []);

  // Selection outline / highlight material
  const highlightMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#5E6E53',
    wireframe: true,
  }), []);

  const renderGeometry = () => {
    switch (item.modelType) {
      case 'sofa-3seat': {
        const seatH = h * 0.45;
        const cushionW = (w - 0.15) / 3;
        const armW = w * 0.12;
        const backD = d * 0.25;

        return (
          <group>
            {/* Base Plinth / Frame */}
            <mesh position={[0, h * 0.1, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[w, h * 0.1, d]} />
            </mesh>
            {/* 4 Wooden Feet */}
            {[[-w * 0.44, -d * 0.4], [w * 0.44, -d * 0.4], [-w * 0.44, d * 0.4], [w * 0.44, d * 0.4]].map(([x, z], i) => (
              <mesh key={i} position={[x, h * 0.05, z]} castShadow material={woodMat}>
                <cylinderGeometry args={[0.025, 0.018, h * 0.1, 8]} />
              </mesh>
            ))}
            {/* 3 Seat Cushions */}
            {[-cushionW, 0, cushionW].map((cx, i) => (
              <mesh key={i} position={[cx, h * 0.28, d * 0.08]} castShadow receiveShadow material={mainMat}>
                <boxGeometry args={[cushionW * 0.94, seatH * 0.4, d * 0.7]} />
              </mesh>
            ))}
            {/* Backrest */}
            <mesh position={[0, h * 0.62, -d * 0.38]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w * 0.96, h * 0.55, backD]} />
            </mesh>
            {/* 3 Back Pillows */}
            {[-cushionW, 0, cushionW].map((cx, i) => (
              <mesh key={i} position={[cx, h * 0.62, -d * 0.22]} rotation={[-0.1, 0, 0]} castShadow material={mainMat}>
                <boxGeometry args={[cushionW * 0.9, h * 0.42, backD * 0.7]} />
              </mesh>
            ))}
            {/* Left & Right Armrests */}
            <mesh position={[-w / 2 + armW / 2, h * 0.45, 0]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[armW, h * 0.5, d * 0.95]} />
            </mesh>
            <mesh position={[w / 2 - armW / 2, h * 0.45, 0]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[armW, h * 0.5, d * 0.95]} />
            </mesh>
            {/* 2 Accent Cushions */}
            <mesh position={[-w * 0.32, h * 0.45, -d * 0.1]} rotation={[0.2, 0.3, 0]} castShadow>
              <boxGeometry args={[0.18, 0.18, 0.08]} />
              <meshStandardMaterial color="#5E6E53" roughness={0.7} />
            </mesh>
            <mesh position={[w * 0.32, h * 0.45, -d * 0.1]} rotation={[0.2, -0.3, 0]} castShadow>
              <boxGeometry args={[0.18, 0.18, 0.08]} />
              <meshStandardMaterial color="#C4A484" roughness={0.7} />
            </mesh>
          </group>
        );
      }

      case 'armchair': {
        const legH = h * 0.28;
        return (
          <group>
            {/* Splayed Wooden Legs */}
            {[
              [-w * 0.35, legH / 2, -d * 0.35, 0.15, -0.15],
              [w * 0.35, legH / 2, -d * 0.35, 0.15, 0.15],
              [-w * 0.35, legH / 2, d * 0.35, -0.15, -0.15],
              [w * 0.35, legH / 2, d * 0.35, -0.15, 0.15],
            ].map(([x, y, z, rx, rz], i) => (
              <mesh key={i} position={[x, y, z]} rotation={[rx, 0, rz]} castShadow material={woodMat}>
                <cylinderGeometry args={[0.022, 0.015, legH, 8]} />
              </mesh>
            ))}
            {/* Seat Base Cushion */}
            <mesh position={[0, legH + h * 0.12, 0]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w * 0.85, h * 0.22, d * 0.8]} />
            </mesh>
            {/* Curved Enveloping Backrest */}
            <mesh position={[0, h * 0.65, -d * 0.28]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w * 0.85, h * 0.52, d * 0.25]} />
            </mesh>
            {/* Curved Side Arms */}
            <mesh position={[-w * 0.4, h * 0.52, 0]} castShadow material={mainMat}>
              <boxGeometry args={[w * 0.15, h * 0.35, d * 0.7]} />
            </mesh>
            <mesh position={[w * 0.4, h * 0.52, 0]} castShadow material={mainMat}>
              <boxGeometry args={[w * 0.15, h * 0.35, d * 0.7]} />
            </mesh>
          </group>
        );
      }

      case 'coffee-table': {
        const topH = 0.035;
        const legH = h - topH;
        return (
          <group>
            {/* Oval / Rounded Tabletop */}
            <mesh position={[0, h - topH / 2, 0]} castShadow receiveShadow material={woodMat} scale={[1, 1, d / w]}>
              <cylinderGeometry args={[w * 0.45, w * 0.45, topH, 32]} />
            </mesh>
            {/* Lower Shelf */}
            <mesh position={[0, h * 0.35, 0]} castShadow receiveShadow material={darkWoodMat} scale={[1, 1, d / w]}>
              <cylinderGeometry args={[w * 0.38, w * 0.38, 0.02, 32]} />
            </mesh>
            {/* 4 Cylindrical Timber Legs */}
            {[
              [-w * 0.32, -d * 0.28],
              [w * 0.32, -d * 0.28],
              [-w * 0.32, d * 0.28],
              [w * 0.32, d * 0.28],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, legH / 2, z]} castShadow material={woodMat}>
                <cylinderGeometry args={[0.025, 0.02, legH, 16]} />
              </mesh>
            ))}
            {/* Coffee Table Books & Ceramic Mug Accessory */}
            <mesh position={[w * 0.15, h + 0.015, -d * 0.05]} castShadow>
              <boxGeometry args={[0.22, 0.03, 0.16]} />
              <meshStandardMaterial color="#FAF7F2" roughness={0.3} />
            </mesh>
            <mesh position={[-w * 0.18, h + 0.04, d * 0.05]} castShadow>
              <cylinderGeometry args={[0.035, 0.03, 0.07, 16]} />
              <meshStandardMaterial color="#5E6E53" roughness={0.5} />
            </mesh>
          </group>
        );
      }

      case 'tv-unit': {
        const bodyH = h * 0.75;
        const legH = h * 0.25;
        return (
          <group>
            {/* Main Cabinet Body */}
            <mesh position={[0, legH + bodyH / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[w, bodyH, d]} />
            </mesh>
            {/* Open Center Compartment */}
            <mesh position={[0, legH + bodyH * 0.5, d * 0.05]} material={darkWoodMat}>
              <boxGeometry args={[w * 0.35, bodyH * 0.6, d * 0.95]} />
            </mesh>
            {/* Slatted Front Door Lines (Left and Right) */}
            {[-w * 0.32, w * 0.32].map((x, i) => (
              <mesh key={i} position={[x, legH + bodyH / 2, d * 0.51]} material={darkWoodMat}>
                <boxGeometry args={[w * 0.28, bodyH * 0.85, 0.01]} />
              </mesh>
            ))}
            {/* 4 Metal Legs */}
            {[
              [-w * 0.44, -d * 0.38],
              [w * 0.44, -d * 0.38],
              [-w * 0.44, d * 0.38],
              [w * 0.44, d * 0.38],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, legH / 2, z]} castShadow material={metalMat}>
                <cylinderGeometry args={[0.018, 0.012, legH, 8]} />
              </mesh>
            ))}
          </group>
        );
      }

      case 'television': {
        const standH = h * 0.18;
        const screenH = h * 0.82;
        return (
          <group>
            {/* Base Stand */}
            <mesh position={[0, standH * 0.1, 0]} castShadow material={metalMat}>
              <boxGeometry args={[w * 0.45, 0.012, d * 0.8]} />
            </mesh>
            <mesh position={[0, standH / 2, 0]} castShadow material={metalMat}>
              <boxGeometry args={[0.08, standH, 0.04]} />
            </mesh>
            {/* Screen Outer Frame */}
            <mesh position={[0, standH + screenH / 2, 0]} castShadow material={metalMat}>
              <boxGeometry args={[w, screenH, 0.025]} />
            </mesh>
            {/* Dark Gloss Screen Surface */}
            <mesh position={[0, standH + screenH / 2, 0.014]}>
              <planeGeometry args={[w * 0.97, screenH * 0.95]} />
              <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Ambient Power Indicator */}
            <mesh position={[0, standH + 0.02, 0.015]}>
              <sphereGeometry args={[0.005, 8, 8]} />
              <meshBasicMaterial color="#5E6E53" />
            </mesh>
          </group>
        );
      }

      case 'bookshelf': {
        const shelfCount = 5;
        const sideThick = 0.035;
        return (
          <group>
            {/* Left & Right Upright Panels */}
            <mesh position={[-w / 2 + sideThick / 2, h / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[sideThick, h, d]} />
            </mesh>
            <mesh position={[w / 2 - sideThick / 2, h / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[sideThick, h, d]} />
            </mesh>
            {/* Back Panel */}
            <mesh position={[0, h / 2, -d / 2 + 0.01]} receiveShadow material={darkWoodMat}>
              <boxGeometry args={[w, h, 0.015]} />
            </mesh>
            {/* Horizontal Shelves */}
            {Array.from({ length: shelfCount }).map((_, i) => {
              const y = (h / (shelfCount + 1)) * (i + 1);
              return (
                <group key={i}>
                  <mesh position={[0, y, 0]} castShadow receiveShadow material={woodMat}>
                    <boxGeometry args={[w - sideThick * 2, 0.03, d]} />
                  </mesh>
                  {/* Decorative Books on Shelves */}
                  {i % 2 === 0 && (
                    <mesh position={[-w * 0.22, y + 0.1, 0]} castShadow>
                      <boxGeometry args={[0.18, 0.16, d * 0.5]} />
                      <meshStandardMaterial color={i === 0 ? '#5E6E53' : '#C4A484'} roughness={0.6} />
                    </mesh>
                  )}
                  {i % 2 === 1 && (
                    <mesh position={[w * 0.2, y + 0.08, 0]} castShadow>
                      <cylinderGeometry args={[0.05, 0.06, 0.12, 16]} />
                      <meshStandardMaterial color="#FAF7F2" roughness={0.3} />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        );
      }

      case 'area-rug': {
        return (
          <group>
            <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial color={color} roughness={0.95} />
            </mesh>
            {/* Subtle Outer Border / Fringe */}
            <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[Math.min(w, d) * 0.44, Math.min(w, d) * 0.46, 32]} />
              <meshBasicMaterial color="#FAF7F2" opacity={0.6} transparent />
            </mesh>
          </group>
        );
      }

      case 'plant-pot': {
        const potH = h * 0.32;
        const potR = Math.min(w, d) * 0.35;
        const standH = h * 0.15;
        return (
          <group>
            {/* Wooden Plant Stand */}
            {[-0.1, 0.1].map((x, i) => (
              <mesh key={i} position={[x, standH / 2, 0]} castShadow material={woodMat}>
                <boxGeometry args={[0.02, standH, potR * 2.2]} />
              </mesh>
            ))}
            {/* Ceramic Pot */}
            <mesh position={[0, standH + potH / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[potR * 0.95, potR * 0.75, potH, 24]} />
              <meshStandardMaterial color="#FAF7F2" roughness={0.4} />
            </mesh>
            {/* Dark Soil */}
            <mesh position={[0, standH + potH - 0.01, 0]}>
              <cylinderGeometry args={[potR * 0.9, potR * 0.9, 0.02, 16]} />
              <meshStandardMaterial color="#30261C" roughness={0.9} />
            </mesh>
            {/* Central Stem */}
            <mesh position={[0, standH + potH + (h - standH - potH) / 2, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.025, h - standH - potH, 8]} />
              <meshStandardMaterial color="#4A5839" roughness={0.6} />
            </mesh>
            {/* Lush Tiered Ficus Leaves */}
            {[
              [0, standH + potH + 0.15, 0.18, 0.4, 0.2],
              [0.16, standH + potH + 0.28, 0, 0.2, 0.8],
              [-0.16, standH + potH + 0.38, 0.05, -0.3, -0.7],
              [0, standH + potH + 0.52, -0.18, -0.4, 3.14],
              [0.15, standH + potH + 0.65, 0.12, 0.3, 0.5],
              [-0.12, standH + potH + 0.78, -0.1, -0.2, -2.5],
              [0, standH + potH + 0.9, 0, 0, 0],
            ].map(([lx, ly, lz, rx, ry], i) => (
              <mesh key={i} position={[lx, ly, lz]} rotation={[rx, ry, 0]} castShadow scale={[1, 0.15, 1.8]}>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color="#3F5B36" roughness={0.5} />
              </mesh>
            ))}
          </group>
        );
      }

      case 'floor-lamp': {
        const baseH = 0.035;
        const stemH = h * 0.8;
        const shadeH = h * 0.22;
        const shadeR = Math.min(w, d) * 0.45;
        return (
          <group>
            {/* Heavy Marble / Brass Base */}
            <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow material={brassMat}>
              <cylinderGeometry args={[shadeR * 0.8, shadeR * 0.8, baseH, 24]} />
            </mesh>
            {/* Slender Arched Stem */}
            <mesh position={[0, stemH / 2, 0]} castShadow material={brassMat}>
              <cylinderGeometry args={[0.012, 0.015, stemH, 12]} />
            </mesh>
            {/* Linen Drum Lampshade */}
            <mesh position={[0, h - shadeH / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[shadeR * 0.85, shadeR, shadeH, 32, 1, true]} />
              <meshStandardMaterial color="#FFF9ED" roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Warm Diffused Light Bulb & Glow */}
            <mesh position={[0, h - shadeH / 2, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#FFEBBA" />
            </mesh>
            <pointLight position={[0, h - shadeH / 2, 0]} color="#FFE1A8" intensity={0.8} distance={3.5} />
          </group>
        );
      }

      case 'ceiling-light': {
        const shadeR = Math.min(w, d) * 0.48;
        const shadeH = h * 0.6;
        const cordLen = h * 0.4;
        return (
          <group>
            {/* Suspension Cord */}
            <mesh position={[0, h - cordLen / 2, 0]} material={metalMat}>
              <cylinderGeometry args={[0.005, 0.005, cordLen, 8]} />
            </mesh>
            {/* Wabi-Sabi Paper / Lantern Chandelier */}
            <mesh position={[0, shadeH / 2, 0]} castShadow scale={[1, shadeH / (shadeR * 2), 1]}>
              <sphereGeometry args={[shadeR, 24, 24]} />
              <meshStandardMaterial color="#FAF5EB" roughness={0.9} transparent opacity={0.92} />
            </mesh>
            <pointLight position={[0, shadeH / 2, 0]} color="#FFE5B4" intensity={1.2} distance={5} />
          </group>
        );
      }

      case 'bed-queen': {
        const frameH = h * 0.28;
        const headH = h;
        const mattressH = h * 0.22;
        return (
          <group>
            {/* Wooden Base Platform */}
            <mesh position={[0, frameH / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[w, frameH, d]} />
            </mesh>
            {/* Padded Fabric Headboard */}
            <mesh position={[0, headH / 2, -d / 2 + 0.08]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w * 1.02, headH, 0.16]} />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, frameH + mattressH / 2, 0.06]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.92, mattressH, d * 0.88]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
            </mesh>
            {/* Folded Organic Duvet */}
            <mesh position={[0, frameH + mattressH + 0.02, d * 0.1]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w * 0.94, 0.06, d * 0.62]} />
            </mesh>
            {/* 2 Plush Sleeping Pillows */}
            {[-w * 0.24, w * 0.24].map((px, i) => (
              <mesh key={i} position={[px, frameH + mattressH + 0.06, -d * 0.26]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[w * 0.38, 0.1, 0.3]} />
                <meshStandardMaterial color="#FAF7F2" roughness={0.6} />
              </mesh>
            ))}
          </group>
        );
      }

      case 'nightstand': {
        const bodyH = h * 0.75;
        const legH = h * 0.25;
        return (
          <group>
            {/* Nightstand Body with Fluted Detail */}
            <mesh position={[0, legH + bodyH / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[w, bodyH, d]} />
            </mesh>
            {/* Brass Round Pull Knob */}
            <mesh position={[0, legH + bodyH * 0.55, d / 2 + 0.015]} material={brassMat}>
              <sphereGeometry args={[0.015, 12, 12]} />
            </mesh>
            {/* 4 Tapered Feet */}
            {[
              [-w * 0.38, -d * 0.38],
              [w * 0.38, -d * 0.38],
              [-w * 0.38, d * 0.38],
              [w * 0.38, d * 0.38],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, legH / 2, z]} castShadow material={woodMat}>
                <cylinderGeometry args={[0.02, 0.012, legH, 8]} />
              </mesh>
            ))}
            {/* Small Table Lamp on Top */}
            <mesh position={[0, h + 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.16, 16]} />
              <meshStandardMaterial color="#FAF7F2" roughness={0.3} />
            </mesh>
          </group>
        );
      }

      case 'wardrobe': {
        const doorW = (w - 0.08) / 2;
        return (
          <group>
            {/* Main Cabinet Shell */}
            <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w, h, d]} />
            </mesh>
            {/* Dual Paneled Doors */}
            {[-doorW / 2 - 0.01, doorW / 2 + 0.01].map((dx, i) => (
              <mesh key={i} position={[dx, h / 2, d / 2 + 0.01]} material={mainMat}>
                <boxGeometry args={[doorW * 0.96, h * 0.94, 0.015]} />
              </mesh>
            ))}
            {/* Vertical Sleek Brass Handles */}
            {[-0.04, 0.04].map((hx, i) => (
              <mesh key={i} position={[hx, h * 0.48, d / 2 + 0.03]} material={brassMat}>
                <cylinderGeometry args={[0.008, 0.008, 0.25, 8]} />
              </mesh>
            ))}
            {/* Plinth Base */}
            <mesh position={[0, 0.05, 0]} material={darkWoodMat}>
              <boxGeometry args={[w * 1.01, 0.1, d * 1.01]} />
            </mesh>
          </group>
        );
      }

      case 'desk': {
        const topThick = 0.04;
        const legH = h - topThick;
        return (
          <group>
            {/* Solid Desktop Surface */}
            <mesh position={[0, h - topThick / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[w, topThick, d]} />
            </mesh>
            {/* Integrated Right Drawer Unit */}
            <mesh position={[w * 0.32, h - 0.25, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[w * 0.28, 0.4, d * 0.88]} />
            </mesh>
            {/* Brass Drawer Pull */}
            <mesh position={[w * 0.32, h - 0.25, d * 0.45]} material={brassMat}>
              <boxGeometry args={[0.08, 0.015, 0.02]} />
            </mesh>
            {/* Modern Metal Trestle Legs (Left Side & Rear) */}
            <mesh position={[-w * 0.42, legH / 2, 0]} castShadow material={metalMat}>
              <boxGeometry args={[0.03, legH, d * 0.85]} />
            </mesh>
            <mesh position={[w * 0.42, (h - 0.45) / 2, 0]} castShadow material={metalMat}>
              <boxGeometry args={[0.03, h - 0.45, d * 0.85]} />
            </mesh>
            {/* Minimalist Laptop on Desk */}
            <mesh position={[-w * 0.1, h + 0.01, 0]} castShadow>
              <boxGeometry args={[0.28, 0.012, 0.2]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-w * 0.1, h + 0.09, -0.09]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.28, 0.18, 0.01]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.1} />
            </mesh>
          </group>
        );
      }

      case 'office-chair': {
        const starR = Math.min(w, d) * 0.45;
        const stemH = h * 0.38;
        return (
          <group>
            {/* 5-Point Star Swivel Base */}
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / 5;
              const bx = Math.sin(angle) * (starR / 2);
              const bz = Math.cos(angle) * (starR / 2);
              return (
                <group key={i}>
                  <mesh position={[bx, 0.03, bz]} rotation={[0, -angle, 0]} material={metalMat}>
                    <boxGeometry args={[0.03, 0.02, starR]} />
                  </mesh>
                  {/* Wheel Caster */}
                  <mesh position={[Math.sin(angle) * starR, 0.02, Math.cos(angle) * starR]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshStandardMaterial color="#111111" />
                  </mesh>
                </group>
              );
            })}
            {/* Chrome Hydraulic Cylinder */}
            <mesh position={[0, stemH / 2, 0]} material={metalMat}>
              <cylinderGeometry args={[0.025, 0.025, stemH, 16]} />
            </mesh>
            {/* Contoured Ergonomic Seat Cushion */}
            <mesh position={[0, stemH + 0.04, 0]} castShadow receiveShadow material={mainMat}>
              <boxGeometry args={[w * 0.85, 0.08, d * 0.8]} />
            </mesh>
            {/* Curved Mesh Backrest */}
            <mesh position={[0, stemH + h * 0.32, -d * 0.32]} rotation={[0.1, 0, 0]} castShadow material={mainMat}>
              <boxGeometry args={[w * 0.8, h * 0.55, 0.06]} />
            </mesh>
            {/* Loop Armrests */}
            {[-w * 0.42, w * 0.42].map((ax, i) => (
              <mesh key={i} position={[ax, stemH + 0.2, 0]} material={metalMat}>
                <boxGeometry args={[0.03, 0.22, d * 0.5]} />
              </mesh>
            ))}
          </group>
        );
      }

      case 'dining-set': {
        const tableW = w * 0.72;
        const tableD = d * 0.58;
        const tableH = h;
        const legH = tableH - 0.04;
        const chairH = tableH * 0.9;
        const chairSeatH = tableH * 0.52;

        return (
          <group>
            {/* Dining Table Surface */}
            <mesh position={[0, tableH - 0.02, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[tableW, 0.04, tableD]} />
            </mesh>
            {/* 4 Sturdy Table Legs */}
            {[
              [-tableW * 0.44, -tableD * 0.44],
              [tableW * 0.44, -tableD * 0.44],
              [-tableW * 0.44, tableD * 0.44],
              [tableW * 0.44, tableD * 0.44],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, legH / 2, z]} castShadow material={woodMat}>
                <boxGeometry args={[0.045, legH, 0.045]} />
              </mesh>
            ))}
            {/* Center Ceramic Bowl Table Accent */}
            <mesh position={[0, tableH + 0.03, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.08, 0.06, 16]} />
              <meshStandardMaterial color="#FAF7F2" roughness={0.3} />
            </mesh>

            {/* 4 Surrounding Chairs (2 North, 2 South) */}
            {[
              [-tableW * 0.25, -tableD * 0.7, 0],
              [tableW * 0.25, -tableD * 0.7, 0],
              [-tableW * 0.25, tableD * 0.7, Math.PI],
              [tableW * 0.25, tableD * 0.7, Math.PI],
            ].map(([cx, cz, crot], i) => (
              <group key={i} position={[cx, 0, cz]} rotation={[0, crot, 0]}>
                {/* Chair Seat */}
                <mesh position={[0, chairSeatH, 0]} castShadow material={woodMat}>
                  <boxGeometry args={[0.26, 0.025, 0.26]} />
                </mesh>
                {/* Chair Backrest */}
                <mesh position={[0, chairH * 0.78, -0.12]} castShadow material={woodMat}>
                  <boxGeometry args={[0.26, chairH * 0.42, 0.02]} />
                </mesh>
                {/* Chair Legs */}
                {[[-0.11, -0.11], [0.11, -0.11], [-0.11, 0.11], [0.11, 0.11]].map(([lx, lz], j) => (
                  <mesh key={j} position={[lx, chairSeatH / 2, lz]} castShadow material={woodMat}>
                    <cylinderGeometry args={[0.012, 0.01, chairSeatH, 8]} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        );
      }

      default: {
        // Fallback clean styled modular prism
        return (
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={mainMat}>
            <boxGeometry args={[w, h, d]} />
          </mesh>
        );
      }
    }
  };

  // Convert position from feet to units
  const posX = item.position[0] * FT_TO_UNITS;
  const posY = item.position[1] * FT_TO_UNITS;
  const posZ = item.position[2] * FT_TO_UNITS;

  // Architectural corner bracket dimensions
  const hw = w / 2 + 0.04;
  const hd = d / 2 + 0.04;
  const arm = Math.min(0.2, Math.min(w, d) * 0.35);
  const thick = 0.014;

  return (
    <group
      position={[posX, posY, posZ]}
      rotation={[0, item.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        if (onPointerDown) onPointerDown(e);
      }}
    >
      {renderGeometry()}

      {/* Elegant Non-Intrusive Architectural Selection Indicator */}
      {isSelected && (
        <group position={[0, 0.006, 0]}>
          {/* Soft Floor Perimeter Halo */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w + 0.12, d + 0.12]} />
            <meshBasicMaterial color="#5E6E53" transparent opacity={0.16} depthWrite={false} />
          </mesh>

          {/* 4 Sleek Floor Corner L-Brackets */}
          {/* Top-Left Corner (-X, -Z) */}
          <mesh position={[-hw + arm / 2, 0.002, -hd]}>
            <boxGeometry args={[arm, thick, thick]} />
            <meshBasicMaterial color="#485540" />
          </mesh>
          <mesh position={[-hw, 0.002, -hd + arm / 2]}>
            <boxGeometry args={[thick, thick, arm]} />
            <meshBasicMaterial color="#485540" />
          </mesh>

          {/* Top-Right Corner (+X, -Z) */}
          <mesh position={[hw - arm / 2, 0.002, -hd]}>
            <boxGeometry args={[arm, thick, thick]} />
            <meshBasicMaterial color="#485540" />
          </mesh>
          <mesh position={[hw, 0.002, -hd + arm / 2]}>
            <boxGeometry args={[thick, thick, arm]} />
            <meshBasicMaterial color="#485540" />
          </mesh>

          {/* Bottom-Left Corner (-X, +Z) */}
          <mesh position={[-hw + arm / 2, 0.002, hd]}>
            <boxGeometry args={[arm, thick, thick]} />
            <meshBasicMaterial color="#485540" />
          </mesh>
          <mesh position={[-hw, 0.002, hd - arm / 2]}>
            <boxGeometry args={[thick, thick, arm]} />
            <meshBasicMaterial color="#485540" />
          </mesh>

          {/* Bottom-Right Corner (+X, +Z) */}
          <mesh position={[hw - arm / 2, 0.002, hd]}>
            <boxGeometry args={[arm, thick, thick]} />
            <meshBasicMaterial color="#485540" />
          </mesh>
          <mesh position={[hw, 0.002, hd - arm / 2]}>
            <boxGeometry args={[thick, thick, arm]} />
            <meshBasicMaterial color="#485540" />
          </mesh>

          {/* Forward Facing Notch / Orientation Pip */}
          <mesh position={[0, 0.003, hd + 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#485540" />
          </mesh>
        </group>
      )}
    </group>
  );
};
