# Styling & UI Guide

## Overview

The Real Estate Platform uses a comprehensive design system built on **Tailwind CSS** with **PrimeNG** components. All styling is clean, maintainable, and follows a consistent visual language.

## Design System

### Color Palette

**Light Mode (Default)**
```
--canvas:           #f4f5f3   (Background)
--surface:          #ffffff   (Cards, containers)
--surface-muted:    #f7f8f6   (Secondary surfaces)
--surface-soft:     #fbfcfb   (Hover states)
--ink:              #121916   (Primary text)
--ink-muted:        #89938d   (Secondary text)
--line:             #e9ece9   (Borders)
--brand:            #18865f   (Primary brand)
--brand-dark:       #07563e   (Dark brand)
--brand-soft:       #e4f3ec   (Brand background)
--accent:           #f3d8cf   (Accents)
--ring:             rgba(22, 130, 94, 0.2)  (Focus rings)
```

**Dark Mode**
- Automatic inversion of light colors
- Enabled with `class="dark"` on `<html>` element
- Persisted to localStorage

### Typography

**Font Families**
```
Sans-serif:  DM Sans (default body text)
Display:     Manrope (headings, large text)
Fallback:    system-ui, ui-sans-serif
```

**Font Sizes & Weights**
- Body: 14px (0.875rem) - Regular (400)
- Small: 12px (0.75rem) - Regular (400)
- Eyebrow: 10px (0.625rem) - Bold (700), Uppercase
- Headings: 24px (1.5rem) - Bold (700)

### Spacing Scale

Based on 4px units:
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 12px (0.75rem)
- lg: 16px (1rem)
- xl: 20px (1.25rem)
- 2xl: 24px (1.5rem)

### Border Radius

- sm: 4px (0.25rem)
- md: 8px (0.5rem)
- lg: 12px (0.75rem)
- xl: 16px (1rem)
- 2xl: 20px (1.25rem) - Cards
- full: 9999px - Pills/circles

### Shadow System

**Elevation Shadows**
```
sm:  0 1px 2px 0 rgba(25, 43, 35, 0.04)      (Subtle)
md:  0 6px 18px -8px rgba(25, 43, 35, 0.16)  (Small elements)
lg:  0 16px 35px -16px rgba(25, 43, 35, 0.22) (Cards)
xl:  0 24px 50px -22px rgba(25, 43, 35, 0.28) (Modals)
```

## Component Styles

### Reusable Component Classes

**Surface Cards**
```html
<div class="surface-card">
  <!-- Content with rounded corners, border, shadow -->
</div>
```
- Used for: Dashboard cards, property listings, data containers
- Includes: Border, rounded corners, subtle shadow, transitions

**Buttons**
```html
<!-- Primary Action -->
<button class="btn-primary">Primary Action</button>

<!-- Secondary Action -->
<button class="btn-secondary">Secondary Action</button>
```

**Input Fields**
```html
<input class="input-field" type="text" placeholder="Search..." />
```
- Rounded: Full pill shape
- States: Default, focused (with ring), disabled

**Icon Buttons**
```html
<button class="icon-button">
  <i class="pi pi-search"></i>
</button>
```
- Circular, minimal background
- Hover effect: Background highlight

**Navigation Active State**
```html
<a class="nav-active">Active Link</a>
```
- Soft brand background
- Bold text, brand color

**Data Table**
```html
<div class="data-table">
  <!-- Table content -->
</div>
```

### PrimeNG Component Styling

All PrimeNG components are styled using Tailwind through the `@layer components` directive:

**Buttons**
- `.p-button` - Rounded, with transitions
- `.p-button-primary` - Brand colored
- `.p-button-secondary` - Outlined
- `.p-button-danger` - Red background
- `.p-button-warning` - Orange background

**Inputs**
- `.p-inputtext` - Standard text input
- `.p-select` - Dropdown selector
- `.p-dropdown` - Advanced dropdown
- `.p-textarea` - Text area

**Form Elements**
- `.p-checkbox` - Styled checkbox
- `.p-password` - Password input with toggle
- `.p-inputnumber` - Number input

**Data Components**
- `.p-datatable` - Data table with styling
- `.p-badge` - Status badges

**Dialogs & Overlays**
- `.p-dialog` - Modal dialog
- `.p-card` - Card container

## Layout System

### Grid Structure
- Max width: 1720px (main container)
- Inner max width: 1500px (content area)
- Padding: Responsive (4px mobile, 28px tablet, 40px desktop)

### Responsive Breakpoints

```
sm:  640px   (tablets)
md:  768px   (small desktop)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
```

### Header

**Fixed sticky header**
- Height: 5.25rem (84px)
- Backdrop blur for depth
- Contains: Logo, search, notifications, profile menu
- Mobile: Hamburger menu, hidden search
- Desktop: Full search, theme toggle

### Sidebar

**Collapsible navigation**
- Width: 280px (expanded)
- Slides in/out on mobile
- Fixed on desktop
- Smooth transitions

### Main Content

**Flexible layout**
- Responsive padding
- Max width container
- Router outlet for pages
- Proper overflow handling

## Dark Mode

### Implementation

**Automatic Detection**
```typescript
// Light mode (default)
document.documentElement.classList.remove('dark');

// Dark mode
document.documentElement.classList.add('dark');
```

**Persistence**
```typescript
localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
```

**User Preference**
```typescript
window.matchMedia('(prefers-color-scheme: dark)').matches
```

### CSS Variables in Dark Mode

All colors automatically invert via CSS variables:
```css
.dark {
  --brand: #54c79a;      /* Lighter in dark mode */
  --surface: #18201c;    /* Darker in dark mode */
  /* ... etc */
}
```

## Animation & Transitions

### Built-in Animations

**Fade In**
```html
<div class="animate-in">Fades in on mount</div>
```

**Keyframes**
- `fadeIn`: 0.35s ease-out
- `slideInFromTop`: 0.2s ease-out

### Transition Classes

- `transition` - Default 150ms ease
- `duration-300` - 300ms duration
- `hover:translate-y-0.5` - Subtle lift on hover

## Accessibility

### Focus States

**Default Focus Styling**
```css
button:focus-visible,
a:focus-visible {
  outline: none;
  ring: 2px var(--brand);
  ring-offset: 2px var(--canvas);
}
```

### ARIA Labels

**All interactive elements have labels**
```html
<button aria-label="Open navigation">Menu</button>
<input aria-label="Search" />
```

### Color Contrast

- Minimum 4.5:1 for text
- 3:1 for large text
- Visual indicators beyond color alone

### Keyboard Navigation

- Tab order follows document flow
- Focus visible on all interactive elements
- Escape key closes modals/menus

## Customization

### Updating Theme Colors

**In `src/styles.css`:**
```css
:root {
  --brand: #18865f;  /* Change primary brand color */
  --accent: #f3d8cf; /* Change accent color */
}
```

### Extending Tailwind

**In `tailwind.config.js`:**
```javascript
theme: {
  extend: {
    colors: { /* Add custom colors */ },
    spacing: { /* Add custom spacing */ },
  }
}
```

### Adding Custom Component Classes

**In `src/styles.css` @layer components:**
```css
.my-custom-class {
  @apply rounded-lg border border-[var(--line)] p-4;
}
```

## Best Practices

### ✅ Do

- Use Tailwind utility classes for styling
- Use CSS variables for colors (enables dark mode)
- Keep inline styles minimal
- Use component classes for repeated patterns
- Ensure sufficient color contrast
- Provide ARIA labels on interactive elements
- Test in dark mode
- Use semantic HTML

### ❌ Don't

- Use inline `style` attributes
- Hardcode hex colors (use CSS variables)
- Create new color names outside the system
- Forget focus states
- Use color alone for meaning
- Write CSS without Tailwind
- Skip accessibility features

## File Organization

```
src/
├── styles.css                 # Global styles, theme, components
├── app/
│   ├── app.component.html    # Main layout template
│   ├── app.component.css     # (empty - use Tailwind)
│   └── shared/
│       ├── layout/           # Header, sidebar, footer
│       │   ├── header.component.ts
│       │   ├── sidebar.component.ts
│       │   └── footer.component.ts
│       └── ui/               # UI wrappers, utilities
│           └── primeng-wrapper.ts
└── environments/             # Theme configuration
```

## Performance Considerations

### CSS Optimization

- Tailwind purges unused classes
- CSS file: ~42.58 kB (development)
- ~6.84 kB (compressed)

### Bundle Impact

- No additional CSS framework
- PrimeNG UI components: ~200 kB (shared across app)
- Tailwind: Built into main CSS

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PrimeNG Component Library](https://primeng.org/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Dark Mode Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

**Last Updated**: September 2024
**Tailwind Version**: 3.4.19
**PrimeNG Version**: 18.0.0
