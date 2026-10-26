import React from 'react';
import type { PlacedItem, RoomConfig } from './types';
import { FURNITURE_CATALOG } from './catalog';
import {
  RotateCw,
  RotateCcw,
  Copy,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize,
  Palette,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Tag,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SelectedInspectorProps {
  item: PlacedItem;
  room: RoomConfig;
  onUpdateItem: (updated: PlacedItem) => void;
  onDuplicateItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onDeselect: () => void;
}

export const SelectedInspector: React.FC<SelectedInspectorProps> = ({
  item,
  room,
  onUpdateItem,
  onDuplicateItem,
  onDeleteItem,
  onDeselect,
}) => {
  const catalogEntry = FURNITURE_CATALOG.find((c) => c.id === item.catalogId);

  // Position Step Nudge (0.5 ft step)
  const nudge = (dxFt: number, dzFt: number) => {
    const halfW = room.widthFt / 2 - item.widthFt / 2 - 0.2;
    const halfL = room.lengthFt / 2 - item.depthFt / 2 - 0.2;

    const newX = Math.max(-halfW, Math.min(halfW, item.position[0] + dxFt));
    const newZ = Math.max(-halfL, Math.min(halfL, item.position[2] + dzFt));

    onUpdateItem({
      ...item,
      position: [newX, item.position[1], newZ],
    });
  };

  // 45° rotation snap
  const rotateStep = (radians: number) => {
    let newRot = item.rotationY + radians;
    while (newRot < 0) newRot += Math.PI * 2;
    while (newRot >= Math.PI * 2) newRot -= Math.PI * 2;
    onUpdateItem({
      ...item,
      rotationY: newRot,
    });
  };

  const toggleOwned = () => {
    onUpdateItem({
      ...item,
      isOwned: !item.isOwned,
    });
  };

  const currentDeg = Math.round((item.rotationY * 180) / Math.PI) % 360;
  const merchantName = item.merchantName || catalogEntry?.merchantName || 'Retailer';
  const shopUrl = item.productUrl || catalogEntry?.productUrl || item.merchantSearchUrl || catalogEntry?.merchantSearchUrl;
  const isAffiliate = Boolean(item.affiliateUrl || catalogEntry?.affiliateUrl);
  const effectiveUrl = item.affiliateUrl || catalogEntry?.affiliateUrl || shopUrl;
  const hasSpecificProductUrl = Boolean(
    (item.productUrl || catalogEntry?.productUrl) &&
    (item.productUrl || catalogEntry?.productUrl) !== (item.merchantSearchUrl || catalogEntry?.merchantSearchUrl)
  );

  return (
    <div className="bg-white rounded-3xl border border-cozi-border shadow-hover p-4 sm:p-5 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-cozi-border/70">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cozi-olive-light text-cozi-olive-dark">
              {item.category}
            </span>

            {item.isOwned && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Already Owned
              </span>
            )}

            <span className="text-[10px] font-medium text-cozi-charcoal/60 bg-cozi-cream/70 px-2 py-0.5 rounded-full border border-cozi-border/60">
              Merchant: {merchantName}
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-cozi-charcoal mt-1.5">
            {item.name}
          </h3>

        </div>

        <button
          type="button"
          onClick={onDeselect}
          className="p-1.5 rounded-xl text-cozi-charcoal/50 hover:text-cozi-charcoal hover:bg-cozi-cream/70 transition-colors"
          title="Deselect item"
          aria-label="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
        {/* Real Merchant Shopping Link Card */}
        {effectiveUrl && (
          <div className="p-3 bg-cozi-cream/50 rounded-2xl border border-cozi-border flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-semibold text-cozi-charcoal text-xs block flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-cozi-olive shrink-0" />
                <span>Shop on {merchantName}</span>
              </span>
              <span className="text-[10px] text-cozi-charcoal/60 truncate block mt-0.5">
                {hasSpecificProductUrl ? 'Merchant product listing' : 'Browse similar items'}
              </span>
            </div>
            <a
              href={effectiveUrl}
              target="_blank"
              rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
              className="py-1.5 px-3 bg-cozi-charcoal hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
                <span>{hasSpecificProductUrl ? 'View Listing' : 'Browse Similar'}</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </a>
          </div>
        )}

        {/* Ownership Toggle */}
        <div className="flex items-center justify-between p-3 bg-cozi-bg/60 rounded-2xl border border-cozi-border/70">
          <div>
            <label htmlFor="owned-toggle" className="font-semibold text-cozi-charcoal block cursor-pointer">
              Mark as Already Owned
            </label>
            <span className="text-[10px] text-cozi-charcoal/60">
              Tag as an existing piece you already own
            </span>
          </div>
          <input
            id="owned-toggle"
            type="checkbox"
            checked={item.isOwned}
            onChange={toggleOwned}
            className="w-4 h-4 accent-cozi-olive rounded cursor-pointer"
          />
        </div>

        {/* Nudge Position & Rotation Controls */}
        <div className="grid grid-cols-2 gap-3">
          {/* Position Nudge Arrows */}
          <div className="bg-cozi-bg/60 p-3 rounded-2xl border border-cozi-border/70">
            <span className="font-semibold text-cozi-charcoal block text-[11px] mb-1.5">
              Move Position (ft)
            </span>
            <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
              <div></div>
              <button
                type="button"
                onClick={() => nudge(0, -0.5)}
                className="p-1.5 bg-white hover:bg-cozi-cream rounded-lg border border-cozi-border flex items-center justify-center transition-colors shadow-2xs"
                title="Move North / Forward"
                aria-label="Move North"
              >
                <ArrowUp className="w-3.5 h-3.5 text-cozi-charcoal" />
              </button>
              <div></div>
              <button
                type="button"
                onClick={() => nudge(-0.5, 0)}
                className="p-1.5 bg-white hover:bg-cozi-cream rounded-lg border border-cozi-border flex items-center justify-center transition-colors shadow-2xs"
                title="Move West / Left"
                aria-label="Move West"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-cozi-charcoal" />
              </button>
              <div className="flex items-center justify-center text-[10px] text-cozi-charcoal/60 font-numeric">
                0.5'
              </div>
              <button
                type="button"
                onClick={() => nudge(0.5, 0)}
                className="p-1.5 bg-white hover:bg-cozi-cream rounded-lg border border-cozi-border flex items-center justify-center transition-colors shadow-2xs"
                title="Move East / Right"
                aria-label="Move East"
              >
                <ArrowRight className="w-3.5 h-3.5 text-cozi-charcoal" />
              </button>
              <div></div>
              <button
                type="button"
                onClick={() => nudge(0, 0.5)}
                className="p-1.5 bg-white hover:bg-cozi-cream rounded-lg border border-cozi-border flex items-center justify-center transition-colors shadow-2xs"
                title="Move South / Backward"
                aria-label="Move South"
              >
                <ArrowDown className="w-3.5 h-3.5 text-cozi-charcoal" />
              </button>
              <div></div>
            </div>
            <div className="text-center text-[10px] text-cozi-charcoal/60 mt-1 font-numeric">
              X: {item.position[0].toFixed(1)}' | Z: {item.position[2].toFixed(1)}'
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="bg-cozi-bg/60 p-3 rounded-2xl border border-cozi-border/70 flex flex-col justify-between">
            <span className="font-semibold text-cozi-charcoal block text-[11px] mb-1.5">
              Rotation ({currentDeg}°)
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => rotateStep(-Math.PI / 4)}
                className="px-2.5 py-1.5 bg-white hover:bg-cozi-cream rounded-xl border border-cozi-border flex items-center gap-1 transition-colors shadow-2xs font-semibold"
                title="Rotate -45°"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cozi-charcoal" />
                <span>-45°</span>
              </button>
              <button
                type="button"
                onClick={() => rotateStep(Math.PI / 4)}
                className="px-2.5 py-1.5 bg-white hover:bg-cozi-cream rounded-xl border border-cozi-border flex items-center gap-1 transition-colors shadow-2xs font-semibold"
                title="Rotate +45°"
              >
                <RotateCw className="w-3.5 h-3.5 text-cozi-charcoal" />
                <span>+45°</span>
              </button>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI * 2}
              step="0.05"
              value={item.rotationY}
              onChange={(e) => onUpdateItem({ ...item, rotationY: parseFloat(e.target.value) })}
              className="w-full accent-cozi-olive mt-2 cursor-pointer"
              aria-label="Rotate Angle"
            />
          </div>
        </div>

        {/* Dimension Sliders (Width, Depth, Height) */}
        <div className="bg-cozi-bg/40 p-3 rounded-2xl border border-cozi-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-cozi-charcoal">
            <span className="flex items-center gap-1">
              <Maximize className="w-3 h-3 text-cozi-olive" /> Dimensions (W × D × H)
            </span>
            <span className="font-numeric text-cozi-charcoal/70">
              {item.widthFt.toFixed(1)}' × {item.depthFt.toFixed(1)}' × {item.heightFt.toFixed(1)}'
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cozi-charcoal/70">Width</span>
              <span className="font-numeric">{item.widthFt.toFixed(1)} ft</span>
            </div>
            <input
              type="range"
              min={(catalogEntry?.defaultWidthFt || 2) * 0.6}
              max={(catalogEntry?.defaultWidthFt || 2) * 1.5}
              step="0.1"
              value={item.widthFt}
              onChange={(e) => onUpdateItem({ ...item, widthFt: parseFloat(e.target.value) })}
              className="w-full accent-cozi-olive cursor-pointer"
              aria-label="Adjust Width"
            />

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cozi-charcoal/70">Depth</span>
              <span className="font-numeric">{item.depthFt.toFixed(1)} ft</span>
            </div>
            <input
              type="range"
              min={(catalogEntry?.defaultDepthFt || 2) * 0.6}
              max={(catalogEntry?.defaultDepthFt || 2) * 1.5}
              step="0.1"
              value={item.depthFt}
              onChange={(e) => onUpdateItem({ ...item, depthFt: parseFloat(e.target.value) })}
              className="w-full accent-cozi-olive cursor-pointer"
              aria-label="Adjust Depth"
            />
          </div>
        </div>

        {/* Color / Fabric Swatches */}
        {catalogEntry && catalogEntry.colorOptions && catalogEntry.colorOptions.length > 0 && (
          <div>
            <span className="font-semibold text-cozi-charcoal block text-[11px] mb-1.5 flex items-center gap-1">
              <Palette className="w-3 h-3 text-cozi-olive" /> Color & Material Finish
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {catalogEntry.colorOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => onUpdateItem({ ...item, color: opt.hex })}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                    item.color === opt.hex ? 'border-cozi-olive scale-110 shadow-xs' : 'border-cozi-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: opt.hex }}
                  title={opt.name}
                >
                  {item.color === opt.hex && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions: Duplicate & Delete */}
        <div className="flex items-center gap-2 pt-2 border-t border-cozi-border/70">
          <button
            type="button"
            onClick={() => onDuplicateItem(item.instanceId)}
            className="flex-1 py-2 px-3 bg-cozi-cream/80 hover:bg-cozi-cream text-cozi-charcoal rounded-xl border border-cozi-border font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-cozi-olive" />
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteItem(item.instanceId)}
            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200/60 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Delete this item"
            aria-label="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
