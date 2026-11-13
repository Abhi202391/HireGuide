---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system projects clarity, momentum, and composed authority. Built specifically for high-stakes career management and interview preparation on mobile devices, it rejects visual clutter in favor of high-signal utility. The interface acts as an executive command center: structured, crisp, and tactfully rewarding.

The aesthetic blends **Modern Corporate** structure with **Precision Minimalism**:
- **Structured Cadence**: High-contrast, clean-edged containers and disciplined horizontal alignment create an immediate sense of organization and control.
- **Strategic Micro-Delights**: Purposeful color pings celebrate progression (e.g., advancing to an interview round or securing an offer) without crossing into gamified frivolity.
- **Mobile-First Ergonomics**: Interactive targets conform to thumb-reach zones, persistent action sheets, and tight information density tailored for scanning complex pipeline states on the go.

## Colors

The palette balances deep authoritative anchors with vibrant, semantically charged accents:

- **Primary (`#4F46E5` - Electric Indigo)**: Reserved for primary conversion vectors, active pipeline states, and key navigational indicators. Provides high legibility against pure white and subtle gray backdrops.
- **Secondary (`#1E293B` - Deep Slate)**: Grounding tone for primary typography, structural icons, and deep navigation chrome.
- **Tertiary (`#10B981` - Mint/Emerald)**: Semantic indicator for offers received, completed coaching drills, and positive feedback milestones.
- **Warning/Progress Accent (`#F59E0B` - Warm Amber)**: Reserved specifically for active interview stages, upcoming prep sessions, and urgent action items.
- **Neutrals & Canvas**:
  - `#FFFFFF`: Pure white surface for foreground cards, search inputs, and modal sheets.
  - `#F8FAFC`: Crisp slate canvas background providing contrast against foreground containers.
  - `#E2E8F0`: Subtle structural divider lines and unselected filter pill borders.
  - `#64748B`: Mid-tone slate for supporting metadata, subheadings, and secondary labels.

## Typography

Typography pairs **Plus Jakarta Sans** for headlines with **Inter** for UI controls, metrics, and content bodies.

- **Plus Jakarta Sans**: Injected into top-tier navigation, page titles, and modal headers to deliver modern geometric warmth and executive polish.
- **Inter**: Governs application cards, stage metadata, transcript coaching notes, and form inputs. Its optical legibility ensures zero ambiguity in high-density job application cards.
- **Numeric & Metric Display**: Salary ranges, interview dates, and match scores utilize tabular figures (`tnum`) in Inter medium or semi-bold weights for rapid vertical scanning.

## Layout & Spacing

The layout is built upon an 8pt base grid with a 4pt sub-grid for tight mobile component grouping:

- **Mobile Viewport (<= 640px)**: Single-column flow with a strict horizontal page margin of `1rem` (16px). Kanban views convert into horizontal snap-scrolling card lanes or tabbed status stages to preserve thumb accessibility.
- **Tablet / Expanded Viewport (> 640px)**: 12-column fluid grid with `1.5rem` margins and `1rem` gutters. Kanban boards reveal multi-column swimlanes.
- **Vertical Rhythm**: Section groupings use `space-xl` (32px), internal card sections use `space-md` (16px), and tightly paired label-data sets use `space-xs` (4px) to maintain cohesive semantic grouping.

## Elevation & Depth

Visual hierarchy relies on crisp borders coupled with ambient, low-opacity indigo/slate drop shadows to prevent visual mud:

- **Base Level (Canvas)**: Background tint at `#F8FAFC`. Zero elevation.
- **Level 1 (Cards, Kanban Tiles, Search Bars)**: `#FFFFFF` fill with a crisp hairline stroke (`1px solid #E2E8F0`) and an ambient shadow: `0 1px 3px rgba(30, 41, 59, 0.05), 0 1px 2px rgba(30, 41, 59, 0.03)`.
- **Level 2 (Active Dragged Cards, Floating Search, Dropdowns)**: Elevated foreground with `0 4px 6px -1px rgba(30, 41, 59, 0.08), 0 2px 4px -2px rgba(30, 41, 59, 0.04)` and a softened `#CBD5E1` border.
- **Level 3 (Bottom Navigation Bar, Bottom Sheets, Modals)**: Fixed mobile interaction layers using `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)` with a top border stroke of `1px solid #E2E8F0`.

## Shapes

The design uses standard **Level 2 Roundedness** (8px base radius), balancing crisp modern geometry with welcoming touch-targets:

- **Primary Cards & Containers**: `0.5rem` (8px) border radius for standard application cards, stage groupings, and interview feedback summaries.
- **Interactive Badges & Filter Pills**: Full pill geometry (`9999px`) to immediately denote filterability, interactive tags, and application statuses.
- **Modal Sheets & Overlays**: `1rem` (16px) top radius (`rounded-lg`) on mobile drawer bottoms for seamless thumb docking.

## Components

### Buttons
- **Primary**: Solid `#4F46E5` background, `#FFFFFF` text, `0.5rem` radius, minimum 44px height for mobile tap ergonomics. Subtle scale feedback (`scale(0.98)`) on press.
- **Secondary**: `#FFFFFF` background with `1px solid #E2E8F0`, `#1E293B` text. Active state brings an indigo-tinted surface (`#EEF2FF`).
- **Destructive / Reject**: `#FEF2F2` background with `#DC2626` text and crisp `#FEE2E2` outline.

### Status Badge Chips
High-contrast rounded pill shapes (`border-radius: 9999px`) with semantic color pairs:
- **Offer Received**: `#ECFDF5` background, `#065F46` text, `1px solid #A7F3D0`.
- **Interview Scheduled**: `#FFFBEB` background, `#92400E` text, `1px solid #FDE68A`.
- **Applied / Screening**: `#EEF2FF` background, `#3730A3` text, `1px solid #C7D2FE`.
- **Archived / Inactive**: `#F1F5F9` background, `#475569` text, `1px solid #CBD5E1`.

### Kanban Column Cards
- Surface: `#FFFFFF` bounded by `1px solid #E2E8F0`.
- Internal Layout: Top-row company avatar (24x24 rounded) + Job Title (`headline-sm`), mid-row salary and location metadata (`body-sm`), bottom row containing status badge chip + interview date countdown.
- Gestures: Long-press lifts card to Level 2 elevation with a 2-degree tilt for tactile repositioning.

### Search & Filter Pills
- Search Bar: Height 48px, `#FFFFFF` background, inset search icon in `#64748B`, full-width pill or `0.5rem` roundedness with `1px solid #CBD5E1`.
- Filter Pills: Horizontal scrolling group with snapping. Unselected state is white with `#64748B` text; selected state is `#1E293B` fill with `#FFFFFF` text.

### Form Inputs & Coaching Prompts
- Text fields utilize a 44px target with `#F8FAFC` fill transitioning to `#FFFFFF` and a 2px `#4F46E5` ring on focus.
- Coaching feedback cards utilize an emerald or amber vertical accent border (3px left stroke) paired with clean list bullet points for actionable interview tips.