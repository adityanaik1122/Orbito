# Tour Filtering System - Visual Guide

## Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TOURS PAGE HEADER                            │
│  🔍 Search: [Search destination...] [Search Button]                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────────┐
│   FILTER SIDEBAR │              MAIN CONTENT AREA                   │
│                  │                                                   │
│  🎚️ Filters      │  Sort By: [Highest Rated ▼]    Found 9 tours   │
│                  │  ─────────────────────────────────────────────   │
│  Price Range     │                                                   │
│  ├─────●────●──┤ │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  £0        £500  │  │  Tour 1  │ │  Tour 2  │ │  Tour 3  │        │
│                  │  │  Image   │ │  Image   │ │  Image   │        │
│  Duration        │  │  £36.50  │ │  £34.80  │ │  £35.00  │        │
│  ☐ Half Day      │  └──────────┘ └──────────┘ └──────────┘        │
│  ☑ Full Day      │                                                   │
│  ☐ Multi-Day     │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│                  │  │  Tour 4  │ │  Tour 5  │ │  Tour 6  │        │
│  Categories      │  │  Image   │ │  Image   │ │  Image   │        │
│  ☑ Adventure     │  │  £109.00 │ │  £89.00  │ │  £95.00  │        │
│  ☐ Food          │  └──────────┘ └──────────┘ └──────────┘        │
│  ☑ Culture       │                                                   │
│  ☐ Sightseeing   │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  ☐ Entertainment │  │  Tour 7  │ │  Tour 8  │ │  Tour 9  │        │
│  ☐ Historical    │  │  Image   │ │  Image   │ │  Image   │        │
│  ☐ Attractions   │  │  £99.00  │ │  £85.00  │ │  £27.00  │        │
│                  │  └──────────┘ └──────────┘ └──────────┘        │
│  [Apply Filters] │                                                   │
│  [Clear All]     │                                                   │
│                  │                                                   │
│  2 filters active│                                                   │
└──────────────────┴──────────────────────────────────────────────────┘
```

## Mobile Layout (Collapsed)

```
┌─────────────────────────────────────────┐
│        TOURS PAGE HEADER                │
│  🔍 [Search destination...] [Search]   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [🎚️ Show Filters (2)]                 │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Sort: [Highest Rated ▼]  Found 9 tours│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │         Tour 1                    │  │
│  │         Image                     │  │
│  │         £36.50                    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │         Tour 2                    │  │
│  │         Image                     │  │
│  │         £34.80                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Mobile Layout (Filters Open)

```
┌─────────────────────────────────────────┐
│ ◀ OVERLAY (tap to close)                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🎚️ Filters              [✕]   │   │
│  │                                 │   │
│  │  Price Range                    │   │
│  │  ├─────●────●──┤                │   │
│  │  £0        £500                 │   │
│  │                                 │   │
│  │  Duration                       │   │
│  │  ☐ ⏰ Half Day (< 4 hours)      │   │
│  │  ☑ ☀️ Full Day (4-8 hours)      │   │
│  │  ☐ 📅 Multi-Day (> 8 hours)     │   │
│  │                                 │   │
│  │  Categories                     │   │
│  │  ☑ 🏔️ Adventure                 │   │
│  │  ☐ 🍽️ Food & Dining             │   │
│  │  ☑ 🎭 Culture                   │   │
│  │  ☐ 🏛️ Sightseeing               │   │
│  │  ☐ 🎪 Entertainment             │   │
│  │  ☐ 🏰 Historical Sites          │   │
│  │  ☐ 🎢 Attractions               │   │
│  │                                 │   │
│  │  [Apply Filters]                │   │
│  │  [Clear All]                    │   │
│  │                                 │   │
│  │  2 filters active               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Filter Components Breakdown

### 1. Price Range Slider
```
Price Range
├─────●────●──┤
£0        £500

- Dual-thumb slider
- Min: £0, Max: £500
- Step: £10
- Real-time value display
- Smooth dragging animation
```

### 2. Duration Checkboxes
```
Duration
☐ ⏰ Half Day (< 4 hours)
☑ ☀️ Full Day (4-8 hours)
☐ 📅 Multi-Day (> 8 hours)

- Multiple selection (OR logic)
- Icon + descriptive text
- Hover effects
- Keyboard accessible
```

### 3. Category Checkboxes
```
Categories
☑ 🏔️ Adventure
☐ 🍽️ Food & Dining
☑ 🎭 Culture
☐ 🏛️ Sightseeing
☐ 🎪 Entertainment
☐ 🏰 Historical Sites
☐ 🎢 Attractions

- Multiple selection (OR logic)
- Emoji icons for visual appeal
- Scrollable if many categories
- Clear visual feedback
```

### 4. Action Buttons
```
┌─────────────────────┐
│   Apply Filters     │  ← Primary action
└─────────────────────┘
┌─────────────────────┐
│     Clear All       │  ← Secondary action
└─────────────────────┘

2 filters active        ← Status indicator
```

## Color Scheme

```css
Primary Color:    #3B82F6 (Blue)
Secondary:        #6B7280 (Gray)
Success:          #10B981 (Green)
Background:       #F9FAFB (Light Gray)
Text:             #111827 (Dark Gray)
Border:           #E5E7EB (Light Border)
```

## Interactive States

### Checkbox States
```
☐ Unchecked (default)
☑ Checked (primary color)
☐ Hover (border highlight)
☐ Focus (ring outline)
☐ Disabled (grayed out)
```

### Slider States
```
Default:  ├─────●────●──┤
Hover:    ├─────●────●──┤ (thumb grows)
Dragging: ├─────●────●──┤ (active thumb highlighted)
Focus:    ├─────●────●──┤ (ring outline)
```

### Button States
```
Default:  [Apply Filters]
Hover:    [Apply Filters] (darker)
Active:   [Apply Filters] (pressed effect)
Loading:  [⟳ Applying...]
```

## Responsive Breakpoints

```
Mobile:   < 768px  (Slide-out sidebar)
Tablet:   768-1024px (Collapsible sidebar)
Desktop:  > 1024px (Always visible sidebar)
```

## Animation Timings

```
Sidebar slide:     300ms ease-in-out
Overlay fade:      200ms ease-in
Checkbox toggle:   150ms ease
Slider drag:       0ms (instant)
Button hover:      200ms ease
```

## Accessibility Features

✅ Keyboard Navigation
- Tab through all filters
- Space to toggle checkboxes
- Arrow keys for slider
- Enter to apply filters

✅ Screen Reader Support
- ARIA labels on all inputs
- Role attributes
- Live regions for updates
- Descriptive button text

✅ Visual Indicators
- Focus rings
- Hover states
- Active states
- Loading states

✅ Color Contrast
- WCAG AA compliant
- 4.5:1 text contrast
- 3:1 UI component contrast

## User Flow

```
1. User lands on Tours page
   ↓
2. Sees all tours displayed
   ↓
3. Clicks "Show Filters" (mobile) or uses sidebar (desktop)
   ↓
4. Adjusts price slider
   ↓
5. Selects duration(s)
   ↓
6. Selects category(ies)
   ↓
7. Clicks "Apply Filters"
   ↓
8. Tours update to match criteria
   ↓
9. Can adjust sort order
   ↓
10. Can clear filters to start over
```

## Filter Logic Examples

### Example 1: Single Category
```
User selects: Culture
Result: Shows only Cultural tours
```

### Example 2: Multiple Categories (OR)
```
User selects: Adventure + Culture
Result: Shows tours that are EITHER Adventure OR Culture
```

### Example 3: Multiple Durations (OR)
```
User selects: Half-day + Full-day
Result: Shows tours that are < 8 hours
```

### Example 4: Combined Filters (AND)
```
User selects:
- Price: £30-£100
- Duration: Full-day
- Category: Culture

Result: Shows tours that match ALL three:
- Price between £30-£100 AND
- Duration 4-8 hours AND
- Category is Culture
```

## API Query Examples

### Simple Filter
```
GET /api/tours?categories=Adventure
```

### Multiple Categories
```
GET /api/tours?categories=Adventure,Culture
```

### Price + Duration
```
GET /api/tours?minPrice=50&maxPrice=150&durations=full-day
```

### Full Filter Set
```
GET /api/tours?
  categories=Adventure,Culture&
  durations=full-day,multi-day&
  minPrice=30&
  maxPrice=200&
  sortBy=rating
```

## Performance Metrics

Target Performance:
- Filter sidebar open: < 100ms
- Apply filters (API call): < 500ms
- Tour cards render: < 200ms
- Smooth 60fps animations
- No layout shift (CLS < 0.1)
