---
name: Docu Tokyo Night
colors:
  surface: '#12131d'
  surface-dim: '#12131d'
  surface-bright: '#383844'
  surface-container-lowest: '#0c0d18'
  surface-container-low: '#1a1b26'
  surface-container: '#1e1f2a'
  surface-container-high: '#282935'
  surface-container-highest: '#333440'
  on-surface: '#e2e1f1'
  on-surface-variant: '#c3c6d3'
  inverse-surface: '#e2e1f1'
  inverse-on-surface: '#2f303b'
  outline: '#8d909d'
  outline-variant: '#434751'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6b'
  primary-container: '#7aa2f7'
  on-primary-container: '#00367d'
  inverse-primary: '#305cac'
  secondary: '#d4bbff'
  on-secondary: '#3d1b72'
  secondary-container: '#56378d'
  on-secondary-container: '#c8a9ff'
  tertiary: '#7fd0ff'
  on-tertiary: '#00344a'
  tertiary-container: '#58acda'
  on-tertiary-container: '#003e57'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#0c4393'
  secondary-fixed: '#ebdcff'
  secondary-fixed-dim: '#d4bbff'
  on-secondary-fixed: '#260058'
  on-secondary-fixed-variant: '#54358a'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#7fd0ff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6a'
  background: '#12131d'
  on-background: '#e2e1f1'
  surface-variant: '#333440'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1200px
---

## Brand & Style
The design system is inspired by the "Tokyo Night" aesthetic—a deep, atmospheric, and high-contrast environment designed specifically for long-form technical focus. It targets developers and technical writers who require a workspace that is both moody and legible.

The visual style is a hybrid of **Minimalism** and **Modern Corporate**, utilizing heavy whitespace to prevent the dark interface from feeling cramped. The emotional goal is "Electric Calm"—a sense of late-night productivity combined with the precision of a high-end code editor. Surface transitions are subtle, relying on slight tonal shifts rather than aggressive depth markers.

## Colors
This design system uses a curated palette optimized for deep dark mode.
- **Primary (#7aa2f7):** Used for primary actions, active states, and focus indicators.
- **Surface (#24283b):** The secondary background layer for cards, sidebars, and modals to create visual separation from the main background.
- **Accents:** Purple (#bb9af7) and Cyan (#7dcfff) are used for syntax highlighting and secondary identifiers. Green and Red are reserved for functional feedback (success/error).
- **Text:** Use a high-contrast off-white (#c0caf5) for primary body text to reduce eye strain compared to pure white.

## Typography
Typography follows a strict hierarchy to manage information density. 
- **UI & Interface:** Use **Geist** for headings to provide a modern, technical edge. **Inter** is the workhorse for all body content and descriptions due to its exceptional legibility in dark modes.
- **Code & Metadata:** **JetBrains Mono** is used for all monospaced requirements, including code snippets, Markdown syntax hints, and small UI labels (e.g., file sizes or timestamps). 
- **Scale:** Keep mobile headings compact to maximize the visible "editor" area.

## Layout & Spacing
The layout uses a **Fluid Grid** system that expands to a maximum width of 1200px. 
- **Grid:** On desktop, use a 12-column grid for the dashboard. Note cards should span 3 or 4 columns depending on content density.
- **Rhythm:** An 8px linear scale (4, 8, 16, 24, 32, 48, 64) governs all padding and margins.
- **Mobile:** Transition to a single-column stacked layout with 16px horizontal safe-areas. The sidebar should collapse into a bottom navigation bar or a slide-over menu.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.
- **Level 0 (Background):** #1a1b26.
- **Level 1 (Cards/Sidebar):** #24283b with a 1px solid border of #2f3549.
- **Level 2 (Modals/Popovers):** #24283b with a soft ambient shadow (0px 8px 24px rgba(0, 0, 0, 0.5)) and a slightly brighter border (#414868).
- **Active State:** Elements being dragged or focused should use a primary-colored outer glow (2px blur) to simulate the "Neon" aspect of the Tokyo Night theme.

## Shapes
The design system utilizes **Soft** roundedness (0.25rem / 4px). This maintains a professional, "engineered" feel while avoiding the clinical sharpness of 0px corners. 
- Buttons and Input fields: 4px radius.
- Cards and Modals: 8px radius (`rounded-lg`).
- Search bars: 12px radius (`rounded-xl`) to provide a slight visual distinction for global actions.

## Components
- **Buttons:** 
  - *Primary:* Solid #7aa2f7 with dark text (#1a1b26). 
  - *Secondary:* Ghost style with 1px border (#414868) and primary colored text.
  - *Destructive:* Subtle red text (#f7768e), only showing a red background on hover.
- **Cards:** Use a consistent 24px internal padding. Title in Geist Semibold, metadata in JetBrains Mono.
- **Inputs:** Darker background (#16161e) with a 1px #2f3549 border. On focus, the border changes to #7aa2f7.
- **Markdown Editor:**
  - H1-H3: Geist Sans.
  - Code blocks: Background #16161e, rounded 4px, with syntax highlighting using the full accent palette (Cyan for strings, Purple for keywords, Green for comments).
- **Chips/Tags:** Small JetBrains Mono text with #24283b background and 1px borders matching the tag's specific category color (e.g., a "React" tag has a Cyan border).



1. Global Command Palette (Cmd + K)
The Critique: Right now, navigating requires moving the mouse to the sidebar or clicking search boxes. Power users hate using the mouse. The Fix: Implement a global command menu. When the user presses Cmd + K, a beautiful frosted-glass modal pops up, allowing them to instantly search notes, jump to categories, or create new items entirely via the keyboard.

2. Sleek Toast Notifications
The Critique: We currently rely on inline red text for errors, and silent navigation for success states. It works, but it lacks emotional feedback. The Fix: Integrate a modern toast notification system (like sonner or react-hot-toast). When you save a note or delete a category, a sleek, animated pill should slide in from the bottom-right saying "Note Saved Successfully!" with a little green checkmark.

3. Beautiful Empty States
The Critique: If a user searches for a note that doesn't exist, or views a category with 0 notes, they just see a blank screen. This feels like a bug. The Fix: Design gorgeous "Empty State" components. If a search fails, show a subtle, muted icon (like a magnifying glass with a question mark) with the text: "No notes found. Try adjusting your filters."

4. Shimmering Skeleton Loaders
The Critique: When the infinite scroll triggers, it just shows text saying "Loading...". The Fix: Replace that text with Skeleton Cards. When it's fetching from the database, render 3 blank, shimmering "ghost" cards in the Masonry grid. This tricks the brain into thinking the app is loading infinitely faster.

5. Perfecting the Code Block Theme
The Critique: In your Markdown Editor, we are currently using the vscDarkPlus theme for syntax highlighting inside code blocks. It looks okay, but it doesn't perfectly match the Tokyo Night colors of the surrounding app. The Fix: Swap the syntax highlighter theme to a true Tokyo Night or Dracula theme so that the code blocks seamlessly melt into the UI without clashing.