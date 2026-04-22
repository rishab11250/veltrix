# 🎨 Frontend Theme System — Veltrix

## 🧠 Theme Philosophy

Veltrix follows a **dark, premium fintech design language** focused on:

* clarity over decoration
* strong visual hierarchy
* minimal cognitive load
* professional trust

The UI should feel:

> “Simple enough for a small business owner, powerful enough for a financial dashboard”

---

# 🌑 1. Color System

## 🎯 Base Colors

| Token        | Value   | Usage              |
| ------------ | ------- | ------------------ |
| bg-primary   | #0F0F0F | Main background    |
| bg-secondary | #1A1A1A | Cards, panels      |
| bg-tertiary  | #202020 | Elevated surfaces  |
| border       | #2A2A2A | Dividers, outlines |

---

## 🎨 Accent Colors

| Token   | Value   | Usage               |
| ------- | ------- | ------------------- |
| primary | #4F46E5 | Buttons, highlights |
| success | #22C55E | Paid, positive      |
| warning | #F59E0B | Pending             |
| danger  | #EF4444 | Overdue             |

---

## 📝 Text Colors

| Token          | Value   | Usage     |
| -------------- | ------- | --------- |
| text-primary   | #E5E7EB | Main text |
| text-secondary | #9CA3AF | Labels    |
| text-muted     | #6B7280 | Metadata  |

---

# 🔠 2. Typography

## Font Family

* Primary: **Inter**
* Fallback: system-ui, sans-serif

## Scale

| Type       | Size    | Weight |
| ---------- | ------- | ------ |
| Heading XL | 28–32px | 600    |
| Heading L  | 22–24px | 600    |
| Heading M  | 18–20px | 500    |
| Body       | 14–16px | 400    |
| Caption    | 12–13px | 400    |

## Rules

* Numbers (₹, $, totals) → **bold & larger**
* Labels → smaller + muted
* Avoid long paragraphs

---

# 📐 3. Spacing System

Use **8px grid system**

| Token | Value |
| ----- | ----- |
| xs    | 8px   |
| sm    | 12px  |
| md    | 16px  |
| lg    | 24px  |
| xl    | 32px  |
| 2xl   | 48px  |

## Rules

* Card padding: **20–24px**
* Section gap: **32px+**
* Consistency is mandatory

---

# 🧱 4. Layout System

## Container

* Max width: 1440px
* Center aligned

## Sidebar

* Width: 220–240px
* Fixed position

## Topbar

* Height: ~70px

## Grid

* Use 12-column layout
* Maintain equal gutters

---

# 🧩 5. Component Styling

## 🟦 Cards

* Background: bg-secondary
* Border: 1px solid border
* Radius: 16px
* Padding: 20–24px

### Variants:

* Primary card → important metrics
* Secondary card → supporting info

---

## 🔘 Buttons

### Primary

* Background: primary
* Text: white
* Radius: 12px
* Hover: slight brightness + glow

### Secondary

* Background: transparent
* Border: 1px solid border

---

## 📥 Inputs

* Background: bg-tertiary
* Border: 1px solid border
* Radius: 10px
* Focus: border → primary

---

## 📊 Tables

* Minimal borders
* Row hover highlight
* Status badges:

  * Paid → green
  * Pending → yellow
  * Overdue → red

---

## 📌 Sidebar

* Default: muted text
* Active:

  * accent color OR
  * highlighted background
* Hover: subtle bg change

---

# 📊 6. Data Visualization

## Charts

* Smooth curves
* Minimal grid lines
* Use:

  * primary for main data
  * muted for secondary

## Rules

* Charts must feel **premium**
* Avoid default chart styles

---

# 🎯 7. Visual Hierarchy Rules

Every screen must follow:

1. **Primary focus**

   * Large numbers / key data

2. **Secondary info**

   * Labels, categories

3. **Tertiary info**

   * timestamps, metadata

👉 If everything looks equal → design is wrong

---

# ✨ 8. Effects & Interactions

## Hover

* Slight elevation
* Soft glow (very subtle)

## Transitions

* Duration: 150–250ms
* Ease: ease-in-out

## Shadows

* Minimal, not heavy

---

# 🧠 9. UX Guidelines

* No clutter
* Clear actions
* Instant readability
* Avoid complex flows

## Must Have States

* Loading (skeletons)
* Empty states
* Error states

---

# 🎮 10. Micro Enhancements

Add subtle delight:

* Revenue growth indicator
* “You earned ₹X this week”
* Progress bars

Keep it:
→ minimal
→ professional

---

# ⚠️ 11. What to Avoid

❌ Too many colors
❌ Overlapping elements
❌ Heavy shadows
❌ Crowded layouts
❌ Tiny unreadable text

---

# 🚀 Final Principle

> “If a user cannot understand the screen in 5 seconds, the design fails.”

---

# 🧩 Dev Notes

* Use Tailwind tokens for consistency
* Store theme values centrally
* Avoid hardcoded colors
* Reuse components strictly

---

# ✅ Outcome

Following this theme ensures:

* Consistent UI
* Production-level polish
* Alignment with fintech SaaS standards