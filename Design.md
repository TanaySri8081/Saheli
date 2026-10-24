# Saheli — Design System & UI Specification (Design.md)

**Design System Name:** Warm Editorial Healthcare  
**Stitch Project ID:** `2276645037607231820`  
**Aesthetic Philosophy:** Bridges **Editorial Warmth** and **Contemporary Clinical Usability**. Tailored for young women and menstruators navigating cycle tracking, reproductive health, hormonal nutrition, and accessible healthcare resources. The interface deliberately avoids clinical sterility and patronizing pastels in favor of an informed, literary, and emotionally safe atmosphere.

---

## 1. Brand Pillars & Design Principles

1. **Dignified & Literary:** Generous typographic contrast, calm proportions, and deliberate narrative pacing elevate reproductive health information to an authoritative yet humane level.
2. **Organic & Tactile Restraint:** Soft rounded contours evoke natural bodily curves without descending into juvenile, bubbly caricatures.
3. **Accessibility as Care:** Readability-first layout, voice-enabled triggers, large touch targets (minimum 48x48px), and strict WCAG AAA / AA contrast ratios.
4. **Culturally Resonant:** Grounded in everyday Indian contexts—earthy clay tones, *katori* bowls, *ghar ke nuskhe*, warm herbal teas, and bilingual typography.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Complete Theme Token Definitions
The palette balances grounding botanical and mineral tones with reassuring clinical contrast. Dark Plum and Deep Sage anchor core actions, while Warm Ivory eliminates screen glare.

```css
/* Surface & Background */
--color-background: #fff7fa;
--color-surface: #fff7fa;
--color-surface-dim: #e5d6df;
--color-surface-bright: #fff7fa;
--color-surface-container-lowest: #ffffff;
--color-surface-container-low: #ffeff9;
--color-surface-container: #f9eaf3;
--color-surface-container-high: #f3e4ed;
--color-surface-container-highest: #eddee8;
--color-on-surface: #211920;
--color-on-surface-variant: #4c444b;
--color-outline: #7e747b;
--color-outline-variant: #cfc3cb;

/* Brand Primary (Deep Plum) */
--color-primary: #482e47;
--color-primary-container: #60445f;
--color-on-primary: #ffffff;
--color-on-primary-container: #d8b3d4;
--color-primary-fixed: #fdd7f8;
--color-primary-fixed-dim: #e0bbdc;
--color-on-primary-fixed: #2a132b;
--color-on-primary-fixed-variant: #593e58;

/* Wellness & Nutrition (Deep Sage) */
--color-secondary: #44664d;
--color-secondary-container: #c5eccc;
--color-on-secondary: #ffffff;
--color-on-secondary-container: #4a6c53;
--color-secondary-fixed: #c5eccc;
--color-secondary-fixed-dim: #aad0b1;
--color-on-secondary-fixed: #00210e;
--color-on-secondary-fixed-variant: #2c4e36;

/* Cycle Flow & Alerts (Soft Coral / Terracotta) */
--color-tertiary: #562a23;
--color-tertiary-container: #724038;
--color-on-tertiary: #ffffff;
--color-on-tertiary-container: #f2aea3;
--color-tertiary-fixed: #ffdad4;
--color-tertiary-fixed-dim: #fbb6aa;
--color-on-tertiary-fixed: #350f0a;
--color-on-tertiary-fixed-variant: #6a3932;

/* Feedback & Clinical Urgency */
--color-error: #ba1a1a;
--color-error-container: #ffdad6;
--color-on-error: #ffffff;
--color-on-error-container: #93000a;
```

### 2.2 Semantic Usage Rules
- **Period Flow & Menstruation:** Always represented using Soft Coral / Terracotta (`#ffdad4`, `#724038`). Never use jarring bright red.
- **Follicular & Luteal Phases:** Represented using Deep Plum accents (`#60445f`, `#f3e4ed`).
- **Fertile & Ovulation Windows:** Highlighted using Soft Sage (`#c5eccc`, `#44664d`).
- **Urgent Triage & Red Flags:** Crimson Alert container (`#ffdad6`, text `#ba1a1a`).

---

## 3. Typography Architecture

### 3.1 Font Families
- **Editorial Headlines & Display:** `Newsreader` (Google Fonts, serif with optical italics). Delivers literary authority and compassionate gravitas.
- **UI Controls, Body & Data:** `Plus Jakarta Sans` (Google Fonts, clean humanist sans). Provides open counters and legibility on mobile screens.
- **Iconography:** `Material Symbols Outlined` (Google Fonts).

### 3.2 Typographic Hierarchy & Scale

| Token Name | Font Family | Size | Weight | Line Height | Tracking | Primary Usage |
|------------|-------------|------|--------|-------------|----------|---------------|
| `display-lg` | Newsreader | 3.5rem (56px) | 400 | 4.25rem | -0.02em | Hero splash statements |
| `display-lg-mobile`| Newsreader | 2.25rem (36px) | 400 | 2.75rem | -0.015em | Mobile page titles |
| `headline-lg` | Newsreader | 2.5rem (40px) | 500 | 3.125rem | -0.01em | Primary section headers |
| `headline-lg-mobile`| Newsreader | 1.75rem (28px)| 500 | 2.25rem | -0.01em | Mobile section hero headings |
| `headline-md` | Newsreader | 2.0rem (32px) | 500 | 2.5rem | Normal | Major module cards |
| `headline-sm` | Newsreader | 1.5rem (24px) | 600 | 2.0rem | Normal | Article titles, card headings |
| `title-lg` | Plus Jakarta Sans | 1.25rem (20px) | 600 | 1.75rem | Normal | Group headers, modal titles |
| `title-md` | Plus Jakarta Sans | 1.125rem (18px)| 600 | 1.625rem | Normal | Subheadings, card titles |
| `body-lg` | Plus Jakarta Sans | 1.125rem (18px)| 400 | 1.875rem | Normal | Long-form reading paragraphs |
| `body-md` | Plus Jakarta Sans | 1.0rem (16px) | 400 | 1.625rem | Normal | Standard body descriptions |
| `body-sm` | Plus Jakarta Sans | 0.875rem (14px)| 400 | 1.375rem | Normal | Secondary details, metadata |
| `label-lg` | Plus Jakarta Sans | 0.9375rem (15px)| 600 | 1.25rem | 0.01em | Primary button labels |
| `label-md` | Plus Jakarta Sans | 0.8125rem (13px)| 600 | 1.125rem | 0.02em | Interactive chips, tabs |
| `label-sm` | Plus Jakarta Sans | 0.75rem (12px) | 600 | 1.0rem | 0.03em | Badges, tags, captions |

---

## 4. Spacing, Fluid Grid & Layout

### 4.1 Spacing Scale
- `space-xs`: `0.25rem` (4px)
- `space-sm`: `0.5rem` (8px)
- `space-md`: `1.0rem` (16px)
- `space-lg`: `1.5rem` (24px)
- `space-xl`: `2.5rem` (40px)
- `space-2xl`: `4.0rem` (64px)

### 4.2 Margins & Gutters
- **Mobile (< 640px):**
  - Outer Canvas Margin: `margin-mobile` = `1.25rem` (20px)
  - Column Gutters: `gutter-mobile` = `1.0rem` (16px)
  - Reading container width: Max `100%`
- **Tablet / Desktop (640px+):**
  - Outer Margin: `margin` = `2.5rem` (40px)
  - Container Constraint: Centered max-width of `430px` (mobile viewport emulation) or `768px` for multi-column desktop reading.

---

## 5. Elevation, Depth & Border Radii

### 5.1 Corner Radii Guidelines
- `sm`: `0.25rem` (4px) — Small pill tags, tooltips.
- `DEFAULT`: `0.5rem` (8px) — Standard inputs, buttons, timeline bars.
- `md`: `0.75rem` (12px) — Inner sub-cards, selector blocks.
- `lg`: `1.0rem` (16px) — Primary cards, calendar containers, article blocks.
- `xl`: `1.5rem` (24px) — Hero panels, bottom action sheets, notification previews.
- `full`: `9999px` — Chips, pill tags, round buttons, avatars.

### 5.2 Layered Depth Without Heavy Drop Shadows
- **Base Canvas (Level 0):** `#fff7fa` (Warm Ivory, flat matte).
- **Sub-surface Panel (Level 1):** `#f9eaf3` or `#ffeff9` with border `1px solid #cfc3cb/40`.
- **Card Surface (Level 2):** `#ffffff` with a delicate ambient shadow:
  ```css
  box-shadow: 0 4px 20px -2px rgba(96, 68, 95, 0.05), 0 2px 6px -1px rgba(96, 68, 95, 0.02);
  ```
- **Modal / Floating Sheet (Level 3):** `#ffffff` with plum-tinted bloom:
  ```css
  box-shadow: 0 16px 36px -4px rgba(72, 46, 71, 0.16), 0 6px 12px -2px rgba(72, 46, 71, 0.06);
  ```
- **Backdrop Scrim:** `rgba(48, 43, 48, 0.45)` with `backdrop-filter: blur(8px)`.

---

## 6. Key UI Component Specifications

### 6.1 Buttons
- **Primary Action:** Solid Deep Plum (`bg-primary` / `#482e47`, text `#ffffff`). Height `48px`, padding `0 24px`, radius `rounded-lg` (8px). On active: `scale-[0.98]`.
- **Secondary Action:** Pale Sage (`bg-secondary-container` / `#c5eccc`, text `#2c4e36`).
- **Tertiary / Ghost:** Transparent surface with `text-primary`, underline on hover.
- **Voice Assistant FAB:** Floating pill at bottom-right (`bg-surface-container-highest`, text `#482e47`), contains microphone icon and bilingual label *"बोलें / Speak"*.

### 6.2 Chips & Tag Selectors
- **Default / Unselected:** `bg-surface-container` (`#f9eaf3`), text `#4c444b`, radius `rounded-full`, height `36px`, horizontal padding `14px`.
- **Selected State:** Shifts to `bg-primary-container` (`#60445f`) with `text-on-primary` (`#ffffff`) and a checkmark icon.

### 6.3 Stepped Pain Intensity Scale (0–10)
- Grid of 11 stepped buttons labeled `0` to `10`.
- Visual styling shifts dynamically based on severity:
  - `0–3`: Sage Green accent (`#c5eccc` / `#44664d`) — Mild / Manageable.
  - `4–6`: Coral Terracotta accent (`#ffdad4` / `#724038`) — Moderate / Demands rest.
  - `7–10`: Crimson Alert accent (`#ffdad6` / `#ba1a1a`) — Severe / Clinical advice required.

### 6.4 Interactive Menstrual Calendar
- 7-column grid layout with 40x40px touch targets.
- Menstrual flow: Solid coral circle with dark coral day number.
- Predicted future flow: Dashed coral ring with inner dot.
- Ovulation & fertile window: Pale sage background.
- Current active day: Double plum border ring with subtle pulse animation.

### 6.5 Audio Player Capsule
- Pill container featuring a circular play/pause button, animated progress scrubber, and duration tag (`5m 12s`).
- Supports bilingual Hindi/English spoken speech synthesis.
