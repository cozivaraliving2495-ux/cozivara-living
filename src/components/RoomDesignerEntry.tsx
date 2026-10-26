import React, { lazy, Suspense } from 'react';

const RoomDesigner = lazy(() =>
  import('./room-designer/RoomDesigner').then((module) => ({ default: module.RoomDesigner })),
);

export function RoomDesignerEntry() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 text-center">
          <div role="status" aria-live="polite" className="rounded-3xl border border-cozi-border bg-white px-8 py-10 shadow-soft">
            <span className="font-serif text-xl font-bold text-cozi-charcoal">Preparing your room planner</span>
            <p className="mt-2 text-sm text-cozi-charcoal/65">Loading the interactive 3D workspace…</p>
          </div>
        </div>
      }
    >
      <RoomDesigner />
    </Suspense>
  );
}
