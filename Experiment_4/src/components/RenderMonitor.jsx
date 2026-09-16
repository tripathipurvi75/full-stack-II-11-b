import React, { useCallback, useSyncExternalStore } from 'react'

/*
 * Lightweight module-level store for the re-render monitor.
 *
 * The monitor only tracks ONE thing: how many calendar/post card
 * components re-rendered during the latest user activity. It is kept
 * as a plain external store (rather than React context/state) so that
 * it can be reset synchronously, immediately before an activity's
 * state update is dispatched, from anywhere in the app.
 */
let snapshot = { count: 0, mode: 'Optimized' }
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

// useSyncExternalStore requires getSnapshot to return the same reference
// when nothing has changed, so we only create a new object when the
// underlying count/mode actually changes.
function getSnapshot() {
  return snapshot
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Resets the "cards re-rendered" counter to 0. Call this immediately
 * before any user activity that may cause calendar/post cards to update. */
export function resetCardCounter() {
  snapshot = { ...snapshot, count: 0 }
  notify()
}

/** Records that calendar/post card components re-rendered. */
export function bumpCardRenderCount(amount = 1) {
  const inc = typeof amount === 'number' ? amount : 1
  snapshot = { ...snapshot, count: snapshot.count + inc }
  notify()
}

/** Sets the current Optimized / Non-Optimized mode without resetting the counter. */
export function setGlobalRenderMode(mode) {
  snapshot = { ...snapshot, mode }
  notify()
}

// Kept for backward compatibility with existing call sites. The monitor
// no longer needs a React context/provider since it's a simple module
// level store, so this is just a passthrough.
export function RenderMonitorProvider({ children }) {
  return children
}

// Kept for backward compatibility. Container-level renders (page, grid,
// filter bar) are intentionally NOT counted — only actual post/event
// card renders count toward "Cards Re-rendered", per spec.
export function useRenderCount() {
  // no-op
}

// Used by CalendarView's eventContent renderer — this fires exactly
// once per calendar/post card that FullCalendar actually renders.
export function useBumpRenderCountFn() {
  return useCallback((amount = 1) => {
    bumpCardRenderCount(amount)
  }, [])
}

// Kept for backward compatibility; the simplified monitor no longer
// displays a "last action" field.
export function useSetLastAction() {
  return useCallback(() => {}, [])
}

export function useSetRenderMode() {
  return useCallback((mode) => {
    setGlobalRenderMode(mode)
  }, [])
}

export function useResetRenderCounters() {
  return useCallback(() => {
    resetCardCounter()
  }, [])
}

export function RenderMonitor() {
  const { count, mode } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const isOptimized = mode === 'Optimized'

  return (
    <div
      className={`render-monitor-badge ${isOptimized ? 'render-monitor-badge-opt' : 'render-monitor-badge-nonopt'}`}
      data-testid="render-monitor"
    >
      <button
        type="button"
        className="render-monitor-reset-btn"
        onClick={() => resetCardCounter()}
        title="Reset render count"
        aria-label="Reset render count"
        data-testid="btn-reset-counter"
      >
        <span className="render-monitor-icon" aria-hidden="true">🔄</span>
      </button>
      <div className="render-monitor-info">
        <span className="render-monitor-metric-label">Cards Re-rendered</span>
        <span className="render-monitor-metric-value" data-testid="count-cards-rerendered">{count}</span>
      </div>
      <span className={`render-monitor-pill ${isOptimized ? 'render-monitor-pill-opt' : 'render-monitor-pill-nonopt'}`}>
        {isOptimized ? 'Optimized ✓' : 'Non-Optimized'}
      </span>
    </div>
  )
}
