---
name: Vitality Flow
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#404943'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#707973'
  outline-variant: '#bfc9c1'
  surface-tint: '#2c694e'
  primary: '#0f5238'
  on-primary: '#ffffff'
  primary-container: '#2d6a4f'
  on-primary-container: '#a8e7c5'
  inverse-primary: '#95d4b3'
  secondary: '#895100'
  on-secondary: '#ffffff'
  secondary-container: '#fd9d1a'
  on-secondary-container: '#663b00'
  tertiary: '#274f3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f6754'
  on-tertiary-container: '#b8e3cb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f0ce'
  primary-fixed-dim: '#95d4b3'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#0e5138'
  secondary-fixed: '#ffdcbc'
  secondary-fixed-dim: '#ffb86b'
  on-secondary-fixed: '#2c1700'
  on-secondary-fixed-variant: '#683d00'
  tertiary-fixed: '#c1ecd4'
  tertiary-fixed-dim: '#a5d0b9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#274e3d'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1200px
  gutter: 20px
---

## Brand & Style

The design system is built on the philosophy of "Active Wellness." It positions the product as a supportive health companion rather than a mere utility. The visual language balances professional nutritional authority with an approachable, energetic spirit tailored for the Vietnamese market.

The style is **Modern Corporate** with a **Tactile** edge. It utilizes generous whitespace, vibrant accent colors, and soft geometric shapes to create a sense of freshness and transparency. The emotional response should be one of motivation and trust—reminding the user that healthy eating is an achievable, premium experience.

Key principles:
- **Luminosity:** Use the off-white background to let food photography pop.
- **Vigor:** Use energetic orange accents to drive action and appetite.
- **Clarity:** Maintain high legibility and structured information density.

## Colors

The palette is rooted in nature and vitality. 

- **Primary (Emerald Green):** Used for main actions, brand presence, and representing fresh ingredients.
- **Secondary (Sunset Orange):** Reserved for highlights, notifications, "Add to Cart" actions, and elements meant to stimulate appetite.
- **Tertiary (Deep Forest):** Primarily for high-contrast typography and deep structural elements.
- **Neutral & Surface:** A clean, off-white base (#FAFAFA) prevents the interface from feeling sterile, while pure white (#FFFFFF) is used for elevated cards and input fields to create subtle depth.

## Typography

The design system exclusively uses **Be Vietnam Pro**. This ensures perfect rendering of Vietnamese diacritics while maintaining a contemporary aesthetic.

- **Headlines:** Use Bold (700) or ExtraBold (800) weights with tighter letter-spacing for a confident, editorial look.
- **Body Text:** Use Regular (400) weight with a generous line height (1.6) to ensure long descriptions of ingredients and nutritional info are easy to digest.
- **Labels:** Use Medium (500) or SemiBold (600) for UI small-print, buttons, and navigation items to maintain hierarchy without excessive scale.

## Layout & Spacing

The design system employs a **Fluid Grid** model with a soft 4px baseline shift. 

- **Desktop:** 12-column grid with a 1200px max-width container. 24px margins.
- **Tablet:** 8-column grid with 20px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing should follow a strict scale. Use `lg` (24px) for padding within sections and `md` (16px) for internal component spacing. Vertical rhythm is maintained by ensuring all heights and margins are multiples of 4px.

## Elevation & Depth

This design system uses **Tonal Layering** combined with **Ambient Shadows** to create a premium, tactile feel.

- **Level 0 (Base):** The off-white background (#FAFAFA).
- **Level 1 (Cards):** Pure white surface (#FFFFFF) with a very soft, diffused shadow: `0px 4px 20px rgba(27, 67, 50, 0.06)`. Note the slight green tint in the shadow to keep it organic.
- **Level 2 (Interactive):** Elements like hovered cards or active buttons use a more pronounced shadow: `0px 8px 30px rgba(27, 67, 50, 0.12)`.
- **Level 3 (Overlays):** Modals and dropdowns use a crisp border (1px solid #EDF2F0) plus a deep shadow for maximum separation.

## Shapes

The shape language is defined by **Rounded (0.5rem / 8px)** as the base, scaling up to **12px (rounded-lg)** for primary containers like meal cards and selection menus.

- **Small Components (Checkboxes, Tags):** 4px - 8px radius.
- **Standard Components (Buttons, Inputs):** 12px radius for a friendly, modern touch.
- **Large Components (Cards, Modals):** 16px - 24px radius to emphasize a "soft container" look.
- **Avatars/Special Tags:** Full pill-shape for distinct visual identification.

## Components

### Buttons
- **Primary:** Emerald Green fill with White text. 12px border radius.
- **Secondary:** Sunset Orange fill for high-priority conversion (e.g., "Checkout").
- **Ghost:** Transparent fill with Emerald Green border (1px) for secondary actions like "View Details."

### Input Fields
- Use a white surface with a 1px border (#E2E8F0). On focus, the border transitions to Emerald Green with a soft 4px outer glow.

### Cards (Meal Items)
- White background, 12px radius, Level 1 shadow. 
- Image should take the top 60% of the card with a subtle bottom-to-top gradient overlay to ensure legibility of calorie/macro labels placed over the image.

### Chips/Badges (Nutritional Info)
- Use "Pill" shapes. 
- For "High Protein" or "Keto," use soft-tinted backgrounds (e.g., 10% opacity of the Emerald Green) with dark green text.

### Selection (Checkboxes/Radios)
- Custom-styled Emerald Green circles/squares. When selected, they should feel "filled" and sturdy, signifying a commitment to a health choice.

### Progress Indicators
- Use for "Meal Plan Completion" or "Daily Calorie Tracking." Utilize a thick, rounded stroke (8px) in Emerald Green, with a light grey track.