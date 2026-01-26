# Tech Debt: Top-Placed Legends Don't Use Field Config Pattern

**Date**: 2026-01-26
**Status**: Documented - Working Workaround in Place
**Priority**: Medium
**Impact**: Maintenance, Code Quality

---

## Summary

Top-placed legends use a workaround (SeriesVisibilityChangedEvent + direct uPlot manipulation) instead of the standard Grafana field config pattern that bottom-placed legends use. This creates inconsistency and bypasses Grafana's standard data processing pipeline.

## Current Behavior

### ✅ Bottom-Placed Legends (Working Correctly)
1. User clicks legend item
2. VizLegend calls `usePanelContext().onToggleSeriesVisibility()`
3. PanelStateWrapper's handler updates field config (`custom.hideFrom.viz`)
4. Field config change triggers data reprocessing
5. Hidden fields are filtered during data preparation
6. Series visibility persists across panel refreshes

**Flow:**
```
Legend Click → PanelContext → PanelStateWrapper → Field Config → Data Reprocessing → Hidden Series Filtered
```

### ⚠️ Top-Placed Legends (Workaround in Place)
1. User clicks legend item
2. VizLegend calls `usePanelContext().onToggleSeriesVisibility()`
3. **Problem**: Context points to PanelChrome's default handler (not PanelStateWrapper's)
4. **Workaround**: PanelChrome publishes SeriesVisibilityChangedEvent
5. GraphNG subscribes to event and directly manipulates uPlot via `plot.setSeries()`
6. Works but bypasses field config - visibility doesn't persist

**Flow:**
```
Legend Click → PanelContext → PanelChrome Default Handler → Event Bus → GraphNG → Direct uPlot Manipulation
```

## Root Cause

When legends are placed at **top**:
1. VizLayout creates legend React element with hooks already evaluated
2. Legend element is passed via event bus (SetHeaderLegendEvent) to PanelChrome header
3. PanelChrome renders the element in header, but **hooks DON'T re-evaluate**
4. `usePanelContext()` in VizLegend returns **OLD context** (from VizLayout) not VizPanel's context
5. VizPanel's `onToggleSeriesVisibility` handler (which updates field config) is not accessible

When legends are at **bottom**:
1. VizLayout renders legend as direct child
2. VizLegend's `usePanelContext()` correctly finds VizPanel's context
3. Clicks call VizPanel's handler → updates field config → data reprocesses → works perfectly

## Files Involved

- `packages/grafana-ui/src/components/VizLayout/VizLayout.tsx` - Passes legend element via event bus for top placement
- `packages/grafana-ui/src/components/PanelChrome/PanelChrome.tsx` - Provides default onToggleSeriesVisibility handler
- `packages/grafana-ui/src/components/PanelChrome/PanelEvents.ts` - Defines SeriesVisibilityChangedEvent workaround
- `public/app/core/components/GraphNG/GraphNG.tsx` - Subscribes to events and manipulates uPlot directly
- `public/app/features/dashboard/dashgrid/PanelStateWrapper.tsx` - Provides proper field config handler

## Attempted Fix (2026-01-26) - Failed

**Approach**: Pass legend props instead of React elements through event bus

**Changes Made**:
1. Created `LegendPropsData` interface in PanelEvents.ts
2. Modified VizLayout to extract legend props from element
3. Modified PanelChrome to create fresh VizLegend instance from props
4. Removed SeriesVisibilityChangedEvent workaround

**Why It Failed**:
The prop extraction logic in VizLayout didn't work correctly:
```typescript
const vizLegendElement = legend.props.children;
if (vizLegendElement && React.isValidElement(vizLegendElement)) {
  const { items, thresholdItems, ... } = vizLegendElement.props;
  // This resulted in legendProps being null
}
```

**Result**: Legends didn't render at all (legendProps was null)

**Commit**: `b17c1f9c185` (reverted in `3c8ad225b3c`)

## Proper Fix for Future

### Implementation Approach

Instead of passing legend React element via event bus, pass legend **props/data** and let PanelChrome create fresh legend instance in header. This ensures hooks evaluate in correct context.

### Steps

1. **Define proper interface in PanelEvents.ts**:
```typescript
export interface LegendPropsData {
  items: Array<VizLegendItem>;
  thresholdItems?: Array<VizLegendItem>;
  mappingItems?: Array<VizLegendItem>;
  placement: LegendPlacement;
  displayMode: LegendDisplayMode;
  sortBy?: string;
  sortDesc?: boolean;
  seriesVisibilityChangeBehavior?: SeriesVisibilityChangeBehavior;
  isSortable?: boolean;
  readonly?: boolean;
}

export interface SetHeaderLegendEventPayload {
  panelId: string;
  legendProps: LegendPropsData | null;  // Changed from ReactNode
}
```

2. **Fix VizLayout prop extraction** (the critical part):
```typescript
// Option A: Extract from PlotLegend component before VizLayout.Legend wraps it
// Option B: Pass props directly to VizLayout instead of legend element
// Option C: Use ref to access props after mount

// Need to debug: Log legend structure to understand correct extraction path
console.log('Legend structure:', {
  legend,
  props: legend?.props,
  children: legend?.props?.children,
});
```

3. **Update PanelChrome to create fresh instance**:
```typescript
const effectiveHeaderLegend = React.useMemo(() => {
  if (!headerLegendProps) return null;

  // Creates new instance in PanelChrome's context
  return <VizLegend {...headerLegendProps} />;
}, [headerLegendProps]);
```

4. **Remove workaround code**:
   - Remove `SeriesVisibilityChangedEvent` from PanelEvents.ts
   - Remove event subscription from GraphNG.tsx
   - Remove default handler from PanelChrome.tsx

### Testing Approach

**Before implementing, add debug logging**:
```typescript
// In VizLayout useEffect
console.log('[DEBUG] Legend structure:', {
  legendType: legend?.type,
  legendProps: legend?.props,
  children: legend?.props?.children,
  childrenType: legend?.props?.children?.type,
  childrenProps: legend?.props?.children?.props,
});
```

**Testing checklist**:
1. ✅ Verify legends render at all (don't break rendering)
2. ✅ Verify top-placed legends show in header
3. ✅ Verify bottom-placed legends still work
4. ✅ Click legend item - verify series hides
5. ✅ Refresh panel - verify series stays hidden (field config persisted)
6. ✅ Test isolate mode (single click)
7. ✅ Test toggle mode (ctrl/cmd-click)
8. ✅ Check panel JSON - verify `custom.hideFrom.viz` is set
9. ✅ Check console for errors

## Why This Matters

1. **Consistency**: Top and bottom legends should use same mechanism
2. **Persistence**: Field config changes persist in panel JSON, event-based doesn't
3. **Maintainability**: Standard Grafana pattern is easier to maintain
4. **Architecture**: Using field config is the "Grafana way" - bypassing it is technical debt

## Current Impact

- **Low**: Workaround functions correctly for end users
- **Medium**: Code maintenance - two different patterns for same functionality
- **Medium**: Future Grafana upgrades might break the workaround

## Recommendations

1. **Short term**: Keep current workaround, it works fine
2. **Medium term**: When modifying legend code for other reasons, fix this properly
3. **Before major Grafana upgrade**: Fix to avoid breakage from uPlot API changes

## References

- Original issue context: `LEGEND_HEADER_FIX_NEXT_SESSION.md` (deleted)
- Commit with working workaround: `45637d57c21`
- Failed fix attempt: `b17c1f9c185` (reverted)
- Revert commit: `3c8ad225b3c`

---

**Next Action**: None required immediately. Address when convenient or before next Grafana version upgrade.
