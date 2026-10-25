import React, { useState, useEffect, useRef } from 'react';
import type {
  RoomConfig,
  PlacedItem,
  CatalogItem,
  SavedDesignData,
  AIDesignBrief,
  RoomType
} from './types';
import {
  DEFAULT_ROOM_CONFIG,
  FURNITURE_CATALOG,
  generateRoomPresetItems
} from './catalog';
import {
  saveDesignToStorage,
  loadDesignFromStorage,
  downloadDesignJson
} from './storage';
import { RoomCanvas, type RoomCanvasHandle } from './RoomCanvas';
import {
  calculateDuplicatePlacement,
  calculateReplacementPlacement,
  calculateSmartPlacement,
  catalogItemFromPlacedItem,
  isCatalogItemValid,
  isPositionValid,
} from './placement';
import { RoomControls } from './RoomControls';
import { SelectedInspector } from './SelectedInspector';
import { DesignSummary } from './DesignSummary';
import {
  Sparkles,
  Check,
  AlertCircle,
  X,
  Home
} from 'lucide-react';

function createInstanceId(existingItems: PlacedItem[]): string {
  const existingIds = new Set(existingItems.map((item) => item.instanceId));
  let id = '';
  do {
    const token = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    id = `item-${token}`;
  } while (existingIds.has(id));
  return id;
}

function fitPresetItems(
  presetItems: PlacedItem[],
  room: RoomConfig,
  reservedItems: PlacedItem[] = []
): { items: PlacedItem[]; omitted: number } {
  const items = [...reservedItems];
  let omitted = 0;
  for (const item of presetItems) {
    const catalogItem = FURNITURE_CATALOG.find((entry) => entry.id === item.catalogId);
    if (!catalogItem) {
      omitted += 1;
      continue;
    }
    const placement = calculateSmartPlacement(catalogItem, items, room, item.position, item.rotationY);
    if (!placement.success) {
      omitted += 1;
      continue;
    }
    items.push({ ...item, position: placement.position, rotationY: placement.rotationY });
  }
  return { items, omitted };
}

export const RoomDesigner: React.FC = () => {
  const [room, setRoom] = useState<RoomConfig>(DEFAULT_ROOM_CONFIG);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSavedDesign, setHasSavedDesign] = useState<boolean>(false);
  const [userIdeaPrompt, setUserIdeaPrompt] = useState<string>('');
  const [aiBrief, setAiBrief] = useState<AIDesignBrief | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'warn' } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingRoomType, setPendingRoomType] = useState<RoomType | null>(null);

  const canvasRef = useRef<RoomCanvasHandle>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Initial load: check for saved design or load default Living Room layout
  useEffect(() => {
    const saved = loadDesignFromStorage();
    if (saved) {
      setHasSavedDesign(true);
      setRoom({
        ...DEFAULT_ROOM_CONFIG,
        ...saved.data.roomConfig,
      });
      setItems(saved.data.items);
      if (saved.data.userIdeaPrompt) setUserIdeaPrompt(saved.data.userIdeaPrompt);
      showToast(saved.warnings.join(' ') || 'Restored your saved room design', saved.warnings.length ? 'warn' : 'info');
    } else {
      // Initialize with dynamic living room preset
      const initialItems = generateRoomPresetItems('Living Room', DEFAULT_ROOM_CONFIG.widthFt, DEFAULT_ROOM_CONFIG.lengthFt);
      const fitted = fitPresetItems(initialItems, DEFAULT_ROOM_CONFIG);
      setItems(fitted.items);
      if (fitted.omitted) showToast(`${fitted.omitted} starter item(s) did not fit and were left out.`, 'warn');
    }
  }, []);

  // Keyboard shortcuts: Delete/Backspace to delete selected, Escape to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'Escape') {
        setSelectedId(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        handleDeleteItem(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, items]);

  /**
   * HIGH PRIORITY: Changing Room Type updates the actual 3D layout!
   * - Replaces automatic starter furniture with the new RoomType preset.
   * - Preserves user manually added furniture.
   * - Adapts positions to current room dimensions.
   */
  const handleRoomTypeChange = (newRoomType: RoomType) => {
    if (newRoomType === room.roomType) return;
    const hasCustomizedItems = items.some((item) => item.isManual === true);
    if (hasCustomizedItems) {
      setPendingRoomType(newRoomType);
      return;
    }
    applyRoomTypeChange(newRoomType);
  };

  const applyRoomTypeChange = (newRoomType: RoomType) => {
    const nextRoom = { ...room, roomType: newRoomType };
    const manualUserItems = items.filter((item) => item.isManual === true);
    const nextManualItems: PlacedItem[] = [];
    let manualPlacementWarnings = 0;
    for (const item of manualUserItems) {
      const placement = calculateSmartPlacement(catalogItemFromPlacedItem(item), nextManualItems, nextRoom, item.position, item.rotationY);
      if (placement.success) {
        nextManualItems.push({ ...item, position: placement.position, rotationY: placement.rotationY });
      } else {
        nextManualItems.push(item);
        manualPlacementWarnings += 1;
      }
    }
    const fitted = fitPresetItems(
      generateRoomPresetItems(newRoomType, room.widthFt, room.lengthFt),
      nextRoom,
      nextManualItems
    );
    setRoom(nextRoom);
    setItems(fitted.items);
    setSelectedId(null);
    showToast(manualPlacementWarnings || fitted.omitted
      ? `Switched to ${newRoomType}; kept your added furniture. ${manualPlacementWarnings + fitted.omitted} item(s) may need adjustment or could not fit.`
      : manualUserItems.length
        ? `Switched to ${newRoomType}; your added furniture was kept.`
        : `Switched to the ${newRoomType} starter layout.`, manualPlacementWarnings || fitted.omitted ? 'warn' : 'success');
  };

  const handleUpdateRoom = (updated: Partial<RoomConfig>) => {
    const nextRoom = { ...room, ...updated };
    if (!Number.isFinite(nextRoom.widthFt) || !Number.isFinite(nextRoom.lengthFt)) {
      showToast('Room dimensions must be valid numbers.', 'warn');
      return;
    }
    nextRoom.widthFt = Math.max(8, Math.min(40, nextRoom.widthFt));
    nextRoom.lengthFt = Math.max(8, Math.min(40, nextRoom.lengthFt));

    if (nextRoom.widthFt !== room.widthFt || nextRoom.lengthFt !== room.lengthFt) {
      const repositioned: PlacedItem[] = [];
      for (const item of items) {
        const placement = calculateSmartPlacement(
          catalogItemFromPlacedItem(item), repositioned, nextRoom, item.position, item.rotationY
        );
        if (!placement.success) {
          showToast(`Room size unchanged: ${item.name} does not fit. Move or remove furniture first.`, 'warn');
          return;
        }
        repositioned.push({ ...item, position: placement.position, rotationY: placement.rotationY });
      }
      setItems(repositioned);
    }
    setRoom(nextRoom);
  };

  const handleAddCatalogItem = (catItem: CatalogItem, isOwned = false) => {
    if (!isCatalogItemValid(catItem)) {
      showToast('This catalog item has invalid dimensions or product data.', 'warn');
      return;
    }
    const placement = calculateSmartPlacement(catItem, items, room);
    if (!placement.success) {
      showToast(placement.message, 'warn');
      return;
    }
    const uniqueId = createInstanceId(items);

    const newItem: PlacedItem = {
      instanceId: uniqueId,
      catalogId: catItem.id,
      name: catItem.name,
      category: catItem.category,
      modelType: catItem.modelType,
      widthFt: catItem.defaultWidthFt,
      depthFt: catItem.defaultDepthFt,
      heightFt: catItem.defaultHeightFt,
      position: placement.position,
      rotationY: placement.rotationY,
      color: catItem.defaultColor,
      merchantName: catItem.merchantName,
      merchantSearchUrl: catItem.merchantSearchUrl,
      productUrl: catItem.productUrl,
      affiliateUrl: catItem.affiliateUrl,
      productImageUrl: catItem.productImageUrl,
      isOwned,
      isManual: true, // Marked as manually placed piece
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedId(uniqueId);
    showToast(`Added ${catItem.name} in an available position`);
  };

  const handleUpdateItemPosition = (id: string, newPosFt: [number, number, number]) => {
    const currentItem = items.find((item) => item.instanceId === id);
    if (!currentItem || !newPosFt.every(Number.isFinite) || newPosFt[1] < 0 || newPosFt[1] > room.heightFt) return;
    const isSpecial = currentItem.modelType === 'area-rug' || currentItem.modelType === 'ceiling-light';
    if (!isPositionValid(
      newPosFt[0], newPosFt[2], currentItem.widthFt, currentItem.depthFt,
      currentItem.rotationY, items, room.widthFt, room.lengthFt, id, isSpecial
    )) return;
    setItems((prev) =>
      prev.map((item) => (item.instanceId === id ? { ...item, position: newPosFt, isManual: true } : item))
    );
  };

  const handleUpdateItem = (updated: PlacedItem) => {
    if (
      !updated.position.every(Number.isFinite) || !Number.isFinite(updated.rotationY) ||
      ![updated.widthFt, updated.depthFt, updated.heightFt].every((value) => Number.isFinite(value) && value > 0) ||
      updated.position[1] < 0 || updated.position[1] + updated.heightFt > room.heightFt + 0.05
    ) {
      showToast('Furniture dimensions and position must be valid for this room.', 'warn');
      return;
    }
    const isSpecial = updated.modelType === 'area-rug' || updated.modelType === 'ceiling-light';
    const previous = items.find((item) => item.instanceId === updated.instanceId);
    if (!previous) return;
    const layoutChanged = previous.widthFt !== updated.widthFt ||
      previous.depthFt !== updated.depthFt ||
      previous.rotationY !== updated.rotationY ||
      previous.position.some((value, index) => value !== updated.position[index]);
    if (layoutChanged && !isPositionValid(
      updated.position[0], updated.position[2], updated.widthFt, updated.depthFt,
      updated.rotationY, items, room.widthFt, room.lengthFt, updated.instanceId, isSpecial
    )) {
      showToast('That transform would overlap another item or extend outside the room.', 'warn');
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.instanceId === updated.instanceId ? { ...updated, isManual: true } : item))
    );
  };

  const handleDuplicateItem = (id: string) => {
    const original = items.find((i) => i.instanceId === id);
    if (!original) return;

    const uniqueId = createInstanceId(items);
    const placement = calculateDuplicatePlacement(original, items, room);
    if (!placement.success) {
      showToast(placement.message || 'There is no free space to duplicate this item.', 'warn');
      return;
    }

    const duplicate: PlacedItem = {
      ...original,
      instanceId: uniqueId,
      name: `${original.name} (Copy)`,
      position: placement.position,
      rotationY: placement.rotationY,
      isManual: true,
    };

    setItems((prev) => [...prev, duplicate]);
    setSelectedId(uniqueId);
    showToast(`Duplicated ${original.name}`);
  };

  const handleReplaceItem = (id: string, catItem: CatalogItem) => {
    const original = items.find((item) => item.instanceId === id);
    if (!original) return;
    const placement = calculateReplacementPlacement(catItem, original, items, room);
    if (!placement.success) {
      showToast(placement.message || 'This replacement does not fit. Choose a smaller item or move the current one.', 'warn');
      return;
    }
    const replacement: PlacedItem = {
      ...original,
      catalogId: catItem.id,
      name: catItem.name,
      category: catItem.category,
      modelType: catItem.modelType,
      widthFt: catItem.defaultWidthFt,
      depthFt: catItem.defaultDepthFt,
      heightFt: catItem.defaultHeightFt,
      position: placement.position,
      rotationY: placement.rotationY,
      color: catItem.defaultColor,
      merchantName: catItem.merchantName,
      merchantSearchUrl: catItem.merchantSearchUrl,
      productUrl: catItem.productUrl,
      affiliateUrl: catItem.affiliateUrl,
      productImageUrl: catItem.productImageUrl,
      isManual: true,
    };
    setItems((prev) => prev.map((item) => item.instanceId === id ? replacement : item));
    showToast(`Replaced with ${catItem.name}`);
  };

  const handleDeleteItem = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteItem = () => {
    const id = pendingDeleteId;
    if (!id) return;
    const target = items.find((i) => i.instanceId === id);
    setItems((prev) => prev.filter((i) => i.instanceId !== id));
    if (selectedId === id) setSelectedId(null);
    setPendingDeleteId(null);
    if (target) {
      showToast(`Removed ${target.name}`);
    }
  };

  const handleSaveDesign = () => {
    const designData: SavedDesignData = {
      version: '1.0',
      savedAt: new Date().toISOString(),
      name: `${room.style} ${room.roomType}`,
      roomConfig: room,
      items,
      userIdeaPrompt,
    };
    if (!saveDesignToStorage(designData)) {
      showToast('Could not save this design in browser storage. Check storage permissions or available space.', 'warn');
      return;
    }
    setHasSavedDesign(true);
    showToast('Design saved in this browser.');
  };

  const handleRestoreDesign = () => {
    const saved = loadDesignFromStorage();
    if (saved) {
      setRoom({
        ...DEFAULT_ROOM_CONFIG,
        ...saved.data.roomConfig,
      });
      setItems(saved.data.items);
      if (saved.data.userIdeaPrompt) setUserIdeaPrompt(saved.data.userIdeaPrompt);
      setSelectedId(null);
      showToast(saved.warnings.join(' ') || 'Loaded your saved design from browser storage', saved.warnings.length ? 'warn' : 'success');
    } else {
      showToast('No saved design found in storage', 'warn');
    }
  };

  const handleResetRoom = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmResetRoom = () => {
    setItems([]);
    setSelectedId(null);
    setIsResetConfirmOpen(false);
    showToast('Room cleared to empty state');
  };

  const handleExportJson = () => {
    const designData: SavedDesignData = {
      version: '1.0',
      savedAt: new Date().toISOString(),
      name: `${room.style} ${room.roomType}`,
      roomConfig: room,
      items,
      userIdeaPrompt,
    };
    downloadDesignJson(designData);
    showToast('Downloaded design configuration JSON');
  };

  const handleCaptureSnapshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.captureSnapshot();
      if (dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `cozivara-room-${room.roomType.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('3D Viewport snapshot captured & downloaded!');
        return;
      }
    }
    showToast('Snapshot capture is ready upon rendering', 'info');
  };

  const selectedItem = items.find((i) => i.instanceId === selectedId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-cozi-charcoal text-white px-4 py-3 rounded-2xl shadow-hover border border-white/10 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'warn' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-cozi-border shadow-hover space-y-4">
            <h3 className="font-serif text-xl font-bold text-cozi-charcoal">
              Reset Room Design?
            </h3>
            <p className="text-xs text-cozi-charcoal/70 leading-relaxed">
              This will remove all placed furniture pieces from your 3D room. If you want to keep your current arrangement, click <strong>Save Design</strong> first.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-cozi-charcoal hover:bg-cozi-cream/70 border border-cozi-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResetRoom}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                Yes, Clear All Items
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-item-title">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-cozi-border shadow-hover space-y-4">
            <h3 id="delete-item-title" className="font-serif text-xl font-bold text-cozi-charcoal">Remove this furniture?</h3>
            <p className="text-sm text-cozi-charcoal/70">{items.find((item) => item.instanceId === pendingDeleteId)?.name} will be removed from the current room design.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPendingDeleteId(null)} className="py-2 px-4 rounded-xl text-xs font-semibold border border-cozi-border">Keep item</button>
              <button type="button" onClick={confirmDeleteItem} className="py-2 px-4 rounded-xl text-xs font-semibold bg-rose-600 text-white">Remove item</button>
            </div>
          </div>
        </div>
      )}

      {pendingRoomType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" role="alertdialog" aria-modal="true" aria-labelledby="room-change-title">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-cozi-border shadow-hover space-y-4">
            <h3 id="room-change-title" className="font-serif text-xl font-bold text-cozi-charcoal">Replace the starter layout?</h3>
            <p className="text-sm text-cozi-charcoal/70">Changing room type replaces the automatic starter furniture. Furniture you added manually stays in the room. Continue with {pendingRoomType}?</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPendingRoomType(null)} className="py-2 px-4 rounded-xl text-xs font-semibold border border-cozi-border">Keep current layout</button>
              <button type="button" onClick={() => { const next = pendingRoomType; setPendingRoomType(null); applyRoomTypeChange(next); }} className="py-2 px-4 rounded-xl text-xs font-semibold bg-cozi-olive text-white">Change room type</button>
            </div>
          </div>
        </div>
      )}


      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-cozi-border/70">
        <div>
          <div className="flex items-center gap-2 text-xs text-cozi-charcoal/60 mb-1">
            <a href="/" className="hover:text-cozi-olive transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </a>
            <span>/</span>
            <span className="text-cozi-charcoal font-medium">3D Room Planner</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-cozi-charcoal">
            Design My Room <span className="text-cozi-olive font-normal text-xl sm:text-2xl">in 3D</span>
          </h1>
          <p className="text-xs sm:text-sm text-cozi-charcoal/70 mt-1 max-w-2xl leading-relaxed">
            Arrange furniture approximations, explore 36 wall colours and flooring, and plan your space in interactive 3D.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-cozi-olive bg-cozi-olive-light px-3.5 py-1.5 rounded-full border border-cozi-olive/20 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-cozi-olive" />
            Interactive 3D Interior Studio
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Sidebar Controls (Room Setup, Catalog, Owned, AI) */}
        <div className="lg:col-span-5 xl:col-span-4 h-full">
          <RoomControls
            room={room}
            onUpdateRoom={handleUpdateRoom}
            onChangeRoomType={handleRoomTypeChange}
            onAddCatalogItem={handleAddCatalogItem}
            selectedId={selectedId}
            onReplaceItem={handleReplaceItem}
            placedItems={items}
            userIdeaPrompt={userIdeaPrompt}
            setUserIdeaPrompt={setUserIdeaPrompt}
            aiBrief={aiBrief}
            setAiBrief={setAiBrief}
          />
        </div>

        {/* RIGHT COLUMN: 3D Viewport, Selected Inspector & Compact Design Summary */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Top Live Statistics Bar & Summary Toolbar (Room Area & Placed Items ONLY) */}
          <DesignSummary
            room={room}
            items={items}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            onDeleteItem={handleDeleteItem}
            onSaveDesign={handleSaveDesign}
            onRestoreDesign={handleRestoreDesign}
            onResetRoom={handleResetRoom}
            onExportJson={handleExportJson}
            onCaptureSnapshot={handleCaptureSnapshot}
            hasSavedDesign={hasSavedDesign}
          />

          {/* 3D Canvas Viewport */}
          <div className="w-full">
            <RoomCanvas
              ref={canvasRef}
              room={room}
              items={items}
              selectedId={selectedId}
              onSelectItem={setSelectedId}
              onUpdateItemPosition={handleUpdateItemPosition}
              onInvalidMove={() => showToast('That position overlaps furniture or crosses the room boundary.', 'warn')}
              onToggleWalls={() => handleUpdateRoom({ showWalls: !room.showWalls })}
              onToggleGrid={() => handleUpdateRoom({ showGrid: !room.showGrid })}
              onChangeWallMode={(mode) => handleUpdateRoom({ wallMode: mode, showWalls: mode !== 'none' })}
            />
          </div>

          {/* Selected Item Inspector Panel */}
          {selectedItem && (
            <SelectedInspector
              item={selectedItem}
              room={room}
              onUpdateItem={handleUpdateItem}
              onDuplicateItem={handleDuplicateItem}
              onDeleteItem={handleDeleteItem}
              onDeselect={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
