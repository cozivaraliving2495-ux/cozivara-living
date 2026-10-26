import React, { lazy, Suspense } from 'react';

const RoomDesigner = lazy(() =>
  import('./room-designer/RoomDesigner').then((module) => ({ default: module.RoomDesigner })),
);

class PlannerLoadBoundary extends React.Component<
  React.PropsWithChildren,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('The 3D room planner could not start.', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 text-center">
          <div role="alert" className="rounded-3xl border border-cozi-border bg-white px-8 py-10 shadow-soft">
            <h1 className="font-serif text-xl font-bold text-cozi-charcoal">The room planner could not load</h1>
            <p className="mt-2 text-sm text-cozi-charcoal/65">Please check your connection and try loading the planner again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-cozi-olive px-5 py-2.5 text-sm font-semibold text-white hover:bg-cozi-olive-dark"
            >
              Try again
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export function RoomDesignerEntry() {
  return (
    <PlannerLoadBoundary>
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
    </PlannerLoadBoundary>
  );
}
