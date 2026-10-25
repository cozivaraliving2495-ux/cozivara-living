import React, { useState } from 'react';
import type {
  RoomConfig,
  CatalogItem,
  RoomType,
  InteriorStyle,
  PlacedItem,
  AIDesignBrief
} from './types';
import {
  FURNITURE_CATALOG,
  WALL_COLORS,
  FLOOR_MATERIALS,
  OWNED_TEMPLATES,
} from './catalog';
import { generateLocalAIDesignBrief } from './storage';
import { isCatalogItemValid } from './placement';
import {
  Plus,
  Search,
  Check,
  Sparkles,
  Home,
  Layers,
  Grid,
  Maximize2,
  Box,
  Palette,
  Info,
  CheckCircle2,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

interface RoomControlsProps {
  room: RoomConfig;
  onUpdateRoom: (updated: Partial<RoomConfig>) => void;
  onChangeRoomType: (newType: RoomType) => void;
  onAddCatalogItem: (item: CatalogItem, isOwned?: boolean) => void;
  selectedId: string | null;
  onReplaceItem: (id: string, item: CatalogItem) => void;
  placedItems: PlacedItem[];
  userIdeaPrompt: string;
  setUserIdeaPrompt: (val: string) => void;
  aiBrief: AIDesignBrief | null;
  setAiBrief: (brief: AIDesignBrief | null) => void;
}

type SidebarTab = 'setup' | 'catalog' | 'owned' | 'ai';

export const RoomControls: React.FC<RoomControlsProps> = ({
  room,
  onUpdateRoom,
  onChangeRoomType,
  onAddCatalogItem,
  selectedId,
  onReplaceItem,
  placedItems,
  userIdeaPrompt,
  setUserIdeaPrompt,
  aiBrief,
  setAiBrief,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('setup');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [ownedCheckedIds, setOwnedCheckedIds] = useState<Set<string>>(new Set());

  // Dimensions & Room Area
  const areaSqFt = room.widthFt * room.lengthFt;

  const categories = ['All', 'Seating', 'Tables', 'Storage', 'Beds', 'Decor & Lighting', 'Office', 'Dining'];

  const filteredCatalog = FURNITURE_CATALOG.filter((item) => {
    if (!isCatalogItemValid(item)) return false;
    const matchesSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      item.merchantName.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleGenerateBrief = () => {
    const brief = generateLocalAIDesignBrief(room, placedItems, userIdeaPrompt);
    setAiBrief(brief);
  };

  const toggleOwnedCheck = (ownedId: string, catalogId: string) => {
    const next = new Set(ownedCheckedIds);
    if (next.has(ownedId)) {
      next.delete(ownedId);
    } else {
      next.add(ownedId);
    }
    setOwnedCheckedIds(next);
  };

  return (
    <div className="bg-white rounded-3xl border border-cozi-border/90 shadow-soft overflow-hidden flex flex-col h-full max-h-[850px]">
      {/* Navigation Tabs */}
      <div className="flex border-b border-cozi-border bg-cozi-cream/40 p-1.5 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('setup')}
          className={`flex-1 py-2 px-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'setup'
              ? 'bg-white text-cozi-charcoal shadow-xs border border-cozi-border/70'
              : 'text-cozi-charcoal/70 hover:text-cozi-charcoal hover:bg-white/50'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-cozi-olive" />
          <span>Room Setup</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 px-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'catalog'
              ? 'bg-white text-cozi-charcoal shadow-xs border border-cozi-border/70'
              : 'text-cozi-charcoal/70 hover:text-cozi-charcoal hover:bg-white/50'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-cozi-olive" />
          <span>Catalog</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('owned')}
          className={`flex-1 py-2 px-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'owned'
              ? 'bg-white text-cozi-charcoal shadow-xs border border-cozi-border/70'
              : 'text-cozi-charcoal/70 hover:text-cozi-charcoal hover:bg-white/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-cozi-olive" />
          <span>Owned</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 px-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'ai'
              ? 'bg-white text-cozi-charcoal shadow-xs border border-cozi-border/70'
              : 'text-cozi-charcoal/70 hover:text-cozi-charcoal hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>AI Ideas</span>
        </button>
      </div>

      {/* Tab Panels Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* ========================================================= */}
        {/* TAB 1: ROOM SETUP */}
        {/* ========================================================= */}
        {activeTab === 'setup' && (
          <div className="space-y-5 text-xs animate-in fade-in duration-150">
            {/* Room Type Selector with Instant 3D Furniture Arrangement Updates */}
            <div className="p-4 bg-cozi-olive-light/50 rounded-2xl border border-cozi-olive/20 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="room-type" className="font-bold text-cozi-charcoal text-xs flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-cozi-olive" />
                  <span>Room Type (Updates 3D Layout)</span>
                </label>
                <span className="text-[10px] text-cozi-olive font-semibold uppercase tracking-wider">
                  Interactive Presets
                </span>
              </div>
              <select
                id="room-type"
                value={room.roomType}
                onChange={(e) => onChangeRoomType(e.target.value as RoomType)}
                className="w-full py-2.5 px-3 bg-white border border-cozi-border rounded-xl text-cozi-charcoal font-semibold text-xs focus:border-cozi-olive focus:outline-hidden shadow-2xs"
              >
                <option value="Living Room">Living Room (Sofa, Coffee Table, TV Unit, Rug, Armchair)</option>
                <option value="Bedroom">Bedroom (Platform Bed, Nightstands, Wardrobe, Rug, Lamp)</option>
                <option value="Home Office">Home Office (Desk, Ergonomic Chair, Bookshelf, Lamp)</option>
                <option value="Dining Room">Dining Room (Dining Table Set, Sideboard, Pendant Light)</option>
              </select>
              <p className="text-[10px] text-cozi-charcoal/70 leading-normal">
                Width and length set the floor size. Choosing another room type replaces its automatic starter furniture; your added items are kept. Wall colour and flooring stay selected.
              </p>
            </div>

            {/* Room Dimensions & Area */}
            <div className="p-4 bg-cozi-bg/70 rounded-2xl border border-cozi-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cozi-charcoal text-xs flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cozi-olive" /> Dimensions & Area
                </span>
                <span className="font-serif font-bold text-cozi-olive text-sm">
                  {areaSqFt} sq ft
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="room-width" className="text-[11px] text-cozi-charcoal/70 block mb-1" title="Room width controls the floor dimension from left to right.">
                    Width: <strong className="text-cozi-charcoal">{room.widthFt} ft</strong>
                  </label>
                  <input
                    id="room-width"
                    type="range"
                    min="8"
                    max="40"
                    step="1"
                    value={room.widthFt}
                    onChange={(e) => onUpdateRoom({ widthFt: parseInt(e.target.value, 10) })}
                    className="w-full accent-cozi-olive cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor="room-length" className="text-[11px] text-cozi-charcoal/70 block mb-1" title="Room length controls the floor dimension from front to back.">
                    Length: <strong className="text-cozi-charcoal">{room.lengthFt} ft</strong>
                  </label>
                  <input
                    id="room-length"
                    type="range"
                    min="8"
                    max="40"
                    step="1"
                    value={room.lengthFt}
                    onChange={(e) => onUpdateRoom({ lengthFt: parseInt(e.target.value, 10) })}
                    className="w-full accent-cozi-olive cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Interior Style Selector */}
            <div>
              <label htmlFor="interior-style" className="font-semibold text-cozi-charcoal text-[11px] block mb-1">
                Interior Style Philosophy
              </label>
              <select
                id="interior-style"
                value={room.style}
                onChange={(e) => onUpdateRoom({ style: e.target.value as InteriorStyle })}
                className="w-full py-2 px-2.5 bg-white border border-cozi-border rounded-xl text-cozi-charcoal focus:border-cozi-olive focus:outline-hidden"
              >
                <option value="Scandinavian">Scandinavian (Light oak, serene minimalism)</option>
                <option value="Minimalist">Minimalist (Clean lines, clutter-free sanctuary)</option>
                <option value="Modern">Modern (Contemporary architecture, bold balance)</option>
                <option value="Contemporary">Contemporary (Curved comfort, relaxed elegance)</option>
                <option value="Industrial">Industrial (Exposed timber & refined metal)</option>
                <option value="Bohemian">Bohemian (Warm terracotta, layered organic botanicals)</option>
              </select>
            </div>

            {/* Curated wall colour palette */}
            <div>
              <span className="font-semibold text-cozi-charcoal text-[11px] block mb-1.5 flex items-center justify-between">
                <span>Wall Colour Palette ({WALL_COLORS.length} Swatches)</span>
                <span className="text-cozi-charcoal/80 font-bold">{room.wallColorName}</span>
              </span>
              <div className="grid grid-cols-6 gap-2 p-2.5 bg-cozi-cream/30 rounded-2xl border border-cozi-border/70">
                {WALL_COLORS.map((w) => {
                  const isSelected = room.wallColor.toLowerCase() === w.hex.toLowerCase();
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => onUpdateRoom({ wallColor: w.hex, wallColorName: w.name })}
                      className={`h-9 rounded-xl border-2 transition-all flex items-center justify-center relative group ${
                        isSelected
                          ? 'border-cozi-olive scale-110 shadow-md ring-2 ring-cozi-olive/30 z-10'
                          : 'border-black/10 hover:scale-105 hover:border-cozi-border'
                      }`}
                      style={{ backgroundColor: w.hex }}
                      title={`${w.name}: ${w.description}`}
                      aria-label={`${w.name} wall colour`}
                      aria-pressed={isSelected}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            w.hex === '#FFFFFF' || w.hex === '#FAF8F5' || w.hex === '#FDFBF7' || w.hex === '#F5EFEB'
                              ? 'text-cozi-charcoal'
                              : 'text-white'
                          }`}
                        />
                      )}
                      {/* Hover Tooltip */}
                      <span className="absolute bottom-full mb-1 hidden group-hover:block bg-cozi-charcoal text-white text-[9px] py-0.5 px-1.5 rounded-md whitespace-nowrap shadow-xs pointer-events-none z-20">
                        {w.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Floor Material Swatches */}
            <div>
              <span className="font-semibold text-cozi-charcoal text-[11px] block mb-1.5 flex items-center justify-between">
                <span>Floor Material</span>
                <span className="text-cozi-charcoal/70 font-normal truncate max-w-[150px]">{room.floorName}</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {FLOOR_MATERIALS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onUpdateRoom({ floorMaterial: f.id, floorColor: f.color, floorName: f.name })}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      room.floorMaterial === f.id
                        ? 'border-cozi-olive bg-cozi-olive-light/40 shadow-xs ring-1 ring-cozi-olive/20'
                        : 'border-cozi-border bg-white hover:bg-cozi-cream/40'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: f.color }}
                    />
                    <span className="text-[11px] font-medium text-cozi-charcoal truncate">
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Cutaway Mode */}
            <div>
              <span className="font-semibold text-cozi-charcoal text-[11px] block mb-1.5">
                Wall Display Mode
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { mode: 'cutaway', label: 'Cutaway' },
                  { mode: 'all', label: 'All 4 Walls' },
                  { mode: 'none', label: 'No Walls' },
                ].map(({ mode, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onUpdateRoom({ wallMode: mode as 'all' | 'cutaway' | 'none', showWalls: mode !== 'none' })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-colors ${
                      room.wallMode === mode
                        ? 'bg-cozi-olive text-white border-cozi-olive'
                        : 'bg-white text-cozi-charcoal border-cozi-border hover:bg-cozi-cream/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FURNITURE CATALOG WITH REAL SHOPPING LINKS */}
        {/* ========================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <p className="text-[11px] text-cozi-charcoal/70 bg-cozi-olive-light/50 border border-cozi-olive/15 rounded-xl p-3">Choose a piece and press <strong>Add</strong> to place a new copy. Select an item in the room to reveal a separate replace action. Models are visual approximations; merchant links may open a listing or search for similar pieces.</p>
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cozi-charcoal/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sofas, desks, lighting, Alibaba, IKEA..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cozi-bg/60 border border-cozi-border rounded-xl text-cozi-charcoal placeholder:text-cozi-charcoal/50 focus:border-cozi-olive focus:outline-hidden"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cozi-charcoal text-white'
                      : 'bg-cozi-cream/70 text-cozi-charcoal/80 hover:bg-cozi-cream'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Items Grid */}
            <div className="space-y-3">
              {filteredCatalog.map((item) => {
                const shopUrl = item.productUrl || item.merchantSearchUrl;
                const isAffiliate = Boolean(item.affiliateUrl);
                const effectiveUrl = item.affiliateUrl || shopUrl;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white hover:bg-cozi-bg/40 border border-cozi-border/80 rounded-2xl flex flex-col gap-2.5 transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl border border-cozi-border/60 shrink-0 flex items-center justify-center shadow-2xs"
                          style={{ backgroundColor: item.defaultColor }}
                        >
                          <Box className="w-5 h-5 text-black/50" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-cozi-charcoal truncate text-xs group-hover:text-cozi-olive transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[9px] font-semibold text-cozi-charcoal/70 bg-cozi-cream px-1.5 py-0.2 rounded-md border border-cozi-border">
                              {item.merchantName}
                            </span>
                          </div>
                          <p className="text-[10px] text-cozi-charcoal/60 mt-0.5">
                            {item.defaultWidthFt}'W × {item.defaultDepthFt}'D × {item.defaultHeightFt}'H • {item.category}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddCatalogItem(item)}
                        className="py-1.5 px-3 bg-cozi-olive hover:bg-cozi-olive-dark text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors shrink-0"
                        title={`Add ${item.name} to 3D room`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {selectedId && (
                      <button
                        type="button"
                        onClick={() => onReplaceItem(selectedId, item)}
                        className="self-start py-1.5 px-3 bg-white hover:bg-amber-50 text-cozi-charcoal border border-amber-300 rounded-xl text-[11px] font-semibold transition-colors"
                        title={`Replace the selected room item with ${item.name}`}
                      >
                        Replace selected item
                      </button>
                    )}

                    {/* Merchant Shop Link */}
                    {effectiveUrl && (
                      <div className="pt-2 border-t border-cozi-border/60 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-cozi-charcoal/60 truncate">
                          Merchant: <strong className="text-cozi-charcoal">{item.merchantName}</strong>
                        </span>
                        <a
                          href={effectiveUrl}
                          target="_blank"
                          rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                          className="text-cozi-olive hover:text-cozi-olive-dark hover:underline font-semibold flex items-center gap-1 shrink-0"
                          title={item.productUrl && item.productUrl !== item.merchantSearchUrl ? `View listing on ${item.merchantName}` : `Browse similar items on ${item.merchantName}`}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Browse Similar</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="text-center py-8 text-cozi-charcoal/60 text-xs">
                  No furniture items found matching "{catalogSearch}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ITEMS ALREADY OWNED */}
        {/* ========================================================= */}
        {activeTab === 'owned' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <p className="text-[11px] text-cozi-charcoal/70 bg-amber-50 border border-amber-200 rounded-xl p-3">These are furniture pieces you already own. Marking an item owned is separate from placing it in the 3D room; use Place to add it to this design.</p>
            <div className="p-3 bg-cozi-cream/60 rounded-2xl border border-cozi-border text-[11px] text-cozi-charcoal/80 flex items-start gap-2">
              <Info className="w-4 h-4 text-cozi-olive shrink-0 mt-0.5" />
              <p>
                Mark pieces you already own. When added to your 3D design, they will be tagged as <strong>Owned</strong> so you can see how your existing pieces harmonize with new items.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-cozi-charcoal/70 bg-cozi-bg border border-cozi-border rounded-xl p-3">Describe your room, style, colours, needs, and pieces you want to include. This tool creates a local text design brief from your room settings; it does not generate images or call an AI service.</p>
              {OWNED_TEMPLATES.map((tmpl) => {
                const catalogItem = FURNITURE_CATALOG.find((c) => c.id === tmpl.catalogId);
                const isChecked = ownedCheckedIds.has(tmpl.id);
                const isPlacedInRoom = placedItems.some((p) => p.catalogId === tmpl.catalogId && p.isOwned);

                return (
                  <div
                    key={tmpl.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isChecked
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-white border-cozi-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOwnedCheck(tmpl.id, tmpl.catalogId)}
                          className="w-4 h-4 accent-cozi-olive rounded cursor-pointer"
                        />
                        <div>
                          <span className="font-semibold text-cozi-charcoal text-xs block">
                            {tmpl.name}
                          </span>
                          <span className="text-[10px] text-cozi-charcoal/60">
                            Category: {tmpl.category}
                          </span>
                        </div>
                      </label>

                      {catalogItem && (
                        <button
                          type="button"
                          onClick={() => {
                            onAddCatalogItem(catalogItem, true);
                            if (!isChecked) toggleOwnedCheck(tmpl.id, tmpl.catalogId);
                          }}
                          className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isPlacedInRoom
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-cozi-cream hover:bg-cozi-border text-cozi-charcoal'
                          }`}
                        >
                          {isPlacedInRoom ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span>In Room</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-cozi-olive" />
                              <span>Place</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AI DESIGN IDEAS */}
        {/* ========================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="space-y-2">
              <label htmlFor="user-idea" className="font-semibold text-cozi-charcoal text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Your Room Vision & Wishlist</span>
              </label>
              <textarea
                id="user-idea"
                rows={3}
                placeholder="e.g., A warm minimalist living room with olive accents, low wooden furniture, lots of sunlight, and a cozy reading corner."
                value={userIdeaPrompt}
                onChange={(e) => setUserIdeaPrompt(e.target.value)}
                className="w-full p-3 bg-cozi-bg/60 border border-cozi-border rounded-2xl text-cozi-charcoal placeholder:text-cozi-charcoal/50 text-xs focus:border-cozi-olive focus:outline-hidden resize-none"
              />
              <button
                type="button"
                onClick={handleGenerateBrief}
                className="w-full py-2.5 px-4 bg-cozi-charcoal hover:bg-black text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Build a Design Brief</span>
              </button>
            </div>

            {/* Generated Brief */}
            {aiBrief && (
              <div className="p-4 bg-cozi-bg/70 rounded-2xl border border-cozi-border/90 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cozi-olive block">
                    Local Design Suggestion
                  </span>
                  <h4 className="font-serif text-base font-bold text-cozi-charcoal mt-0.5">
                    {aiBrief.title}
                  </h4>
                  <p className="text-[11px] text-cozi-charcoal/80 mt-1 leading-relaxed">
                    {aiBrief.conceptSummary}
                  </p>
                </div>

                {/* Spatial Strategy */}
                <div>
                  <h5 className="font-semibold text-cozi-charcoal text-[11px] mb-1.5 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-cozi-olive" /> Spatial Advice ({room.widthFt * room.lengthFt} sq ft)
                  </h5>
                  <ul className="space-y-1 text-[11px] text-cozi-charcoal/80 list-disc pl-4">
                    {aiBrief.spatialStrategy.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Color Palette */}
                <div className="p-2.5 bg-white rounded-xl border border-cozi-border/70 space-y-1">
                  <h5 className="font-semibold text-cozi-charcoal text-[11px] flex items-center gap-1">
                    <Palette className="w-3 h-3 text-cozi-olive" /> Palette & Textures
                  </h5>
                  <p className="text-[10px] text-cozi-charcoal/70">
                    <strong>Primary:</strong> {aiBrief.colorPaletteAdvice.primary} •{' '}
                    <strong>Accent:</strong> {aiBrief.colorPaletteAdvice.accent}
                  </p>
                  <p className="text-[10px] text-cozi-charcoal/75 italic">
                    {aiBrief.colorPaletteAdvice.description}
                  </p>
                </div>

                {/* Lighting and Textures */}
                <div>
                  <h5 className="font-semibold text-cozi-charcoal text-[11px] mb-1">
                    Lighting & Textural Layering
                  </h5>
                  <ul className="space-y-1 text-[11px] text-cozi-charcoal/80 list-disc pl-4">
                    {aiBrief.lightingAndTextureNotes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Finishing Pieces */}
                {aiBrief.suggestedAdditions.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-cozi-charcoal text-[11px] mb-1">
                      Recommended Finishing Touches
                    </h5>
                    <ul className="space-y-1 text-[11px] text-cozi-olive-dark font-medium list-disc pl-4">
                      {aiBrief.suggestedAdditions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
