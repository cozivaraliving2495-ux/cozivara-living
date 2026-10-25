import React, { useState } from 'react';
import type { RoomConfig, PlacedItem } from './types';
import {
  Download,
  Save,
  RotateCcw,
  Printer,
  Camera,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileSpreadsheet,
  FolderOpen,
  ExternalLink,
  ShieldCheck,
  Tag,
  AlertCircle,
  Maximize2,
  Box
} from 'lucide-react';

interface DesignSummaryProps {
  room: RoomConfig;
  items: PlacedItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onDeleteItem: (id: string) => void;
  onSaveDesign: () => void;
  onRestoreDesign: () => void;
  onResetRoom: () => void;
  onExportJson: () => void;
  onCaptureSnapshot: () => void;
  hasSavedDesign: boolean;
}

export const DesignSummary: React.FC<DesignSummaryProps> = ({
  room,
  items,
  selectedId,
  onSelectItem,
  onDeleteItem,
  onSaveDesign,
  onRestoreDesign,
  onResetRoom,
  onExportJson,
  onCaptureSnapshot,
  hasSavedDesign,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const areaSqFt = room.widthFt * room.lengthFt;
  const ownedCount = items.filter((i) => i.isOwned).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-cozi-border/90 shadow-soft p-4 sm:p-5 space-y-4">
      {/* --- TOP COMPACT SUMMARY: Room Area & Placed Items ONLY --- */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Metric 1: Room Dimensions & Area */}
        <div className="p-3.5 sm:p-4 bg-cozi-bg/70 rounded-2xl border border-cozi-border/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cozi-charcoal/60 block">
              Room Area
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-cozi-charcoal">
                {areaSqFt}
              </span>
              <span className="text-xs text-cozi-charcoal/70 font-medium">sq ft</span>
            </div>
            <span className="text-[11px] text-cozi-charcoal/60 block mt-0.5">
              {room.widthFt}'W × {room.lengthFt}'L • <strong className="text-cozi-charcoal">{room.roomType}</strong>
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-cozi-cream/80 border border-cozi-border flex items-center justify-center text-cozi-olive shrink-0 hidden sm:flex">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Placed Items Count */}
        <div className="p-3.5 sm:p-4 bg-cozi-bg/70 rounded-2xl border border-cozi-border/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cozi-charcoal/60 block">
              Placed Items
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-cozi-charcoal">
                {items.length}
              </span>
              <span className="text-xs text-cozi-charcoal/70 font-medium">pieces</span>
            </div>
            <span className="text-[11px] text-cozi-charcoal/60 block mt-0.5">
              {ownedCount > 0 ? `${ownedCount} owned • ${items.length - ownedCount} in layout` : 'All layout pieces'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-cozi-cream/80 border border-cozi-border flex items-center justify-center text-cozi-olive shrink-0 hidden sm:flex">
            <Box className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* --- ACTION TOOLBAR: SAVE, RESTORE, EXPORT, PRINT, SNAPSHOT --- */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-cozi-border/70">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onSaveDesign}
            className="py-2 px-3.5 bg-cozi-olive hover:bg-cozi-olive-dark text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            title="Save design to browser local storage"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Design</span>
          </button>

          {hasSavedDesign && (
            <button
              type="button"
              onClick={onRestoreDesign}
              className="py-2 px-3 bg-cozi-cream hover:bg-cozi-border text-cozi-charcoal text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-cozi-border"
              title="Restore last saved design"
            >
              <FolderOpen className="w-3.5 h-3.5 text-cozi-olive" />
              <span>Restore</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExportJson}
            className="py-2 px-3 bg-white hover:bg-cozi-cream text-cozi-charcoal text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-cozi-border transition-colors"
            title="Download design data as JSON file"
          >
            <Download className="w-3.5 h-3.5 text-cozi-olive" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onCaptureSnapshot}
            className="py-2 px-3 bg-white hover:bg-cozi-cream text-cozi-charcoal text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-cozi-border transition-colors"
            title="Download high-resolution 3D screenshot"
          >
            <Camera className="w-3.5 h-3.5 text-cozi-olive" />
            <span>3D Snapshot</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2 px-3 bg-white hover:bg-cozi-cream text-cozi-charcoal text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-cozi-border transition-colors"
            title="Print or save summary"
          >
            <Printer className="w-3.5 h-3.5 text-cozi-olive" />
            <span>Print Summary</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="py-2 px-3.5 text-xs font-semibold text-cozi-charcoal hover:bg-cozi-cream rounded-xl border border-cozi-border flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cozi-olive" />
            <span>{isExpanded ? 'Hide Furniture List' : `Furniture List (${items.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onResetRoom}
            className="p-2 text-xs font-medium text-cozi-charcoal/60 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Clear room"
            aria-label="Clear room"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- COLLAPSIBLE ITEMIZED FURNITURE LIST TABLE --- */}
      {isExpanded && (
        <div className="pt-3 border-t border-cozi-border/70 animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-cozi-border bg-cozi-cream/40 text-[11px] font-semibold text-cozi-charcoal/70 uppercase">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Dimensions</th>
                  <th className="py-2.5 px-3 text-center">Merchant</th>
                  <th className="py-2.5 px-3 text-center">Shop Link</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cozi-border/60">
                {items.map((item) => {
                  const shopUrl = item.productUrl || item.merchantSearchUrl;
                  const isAffiliate = Boolean(item.affiliateUrl);
                  const effectiveUrl = item.affiliateUrl || shopUrl;

                  return (
                    <tr
                      key={item.instanceId}
                      onClick={() => onSelectItem(item.instanceId)}
                      className={`cursor-pointer transition-colors ${
                        item.instanceId === selectedId
                          ? 'bg-cozi-olive-light/50 font-medium'
                          : 'hover:bg-cozi-bg/60'
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <span className="text-cozi-charcoal font-semibold block">{item.name}</span>
                          <span className="text-[10px] text-cozi-charcoal/60">{item.category}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-cozi-charcoal/60 font-mono text-[11px]">
                        {item.widthFt.toFixed(1)}' × {item.depthFt.toFixed(1)}' × {item.heightFt.toFixed(1)}'
                      </td>
                      <td className="py-2.5 px-3 text-center text-cozi-charcoal/80 font-medium text-[11px]">
                        {item.merchantName || 'Retailer'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {effectiveUrl ? (
                          <a
                            href={effectiveUrl}
                            target="_blank"
                            rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-cozi-olive hover:text-white text-cozi-charcoal text-[11px] rounded-lg border border-cozi-border font-medium transition-colors shadow-2xs"
                            title={`Browse on ${item.merchantName || 'Merchant'}`}
                          >
                            <span>Browse Similar</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-cozi-charcoal/40 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.instanceId);
                          }}
                          className="p-1 text-cozi-charcoal/40 hover:text-rose-600 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-cozi-charcoal/60">
                      No furniture items placed in the room. Select a Room Type or add items from the catalog to decorate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-[10px] text-cozi-charcoal/60 leading-relaxed italic">
            * 3D models are illustrative layout guides. Retailer buttons open search pages for similar items; they are not product listings or endorsements.
          </div>
        </div>
      )}
    </div>
  );
};
