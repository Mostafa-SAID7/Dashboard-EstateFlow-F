# UI Components Reference

Complete guide to all reusable UI components, their usage, and styling.

## Layout Components

### Header Component

**Location**: `src/app/shared/layout/header.component.ts`

**Features**
- Sticky navigation
- Search bar (desktop)
- Notifications bell
- Dark mode toggle
- Profile menu dropdown
- Mobile hamburger menu
- Responsive design

**Usage**
```html
<app-header *ngIf="!isAuthPage"></app-header>
```

**Markup**
```html
<header class="sticky top-0 z-40 border-b border-[var(--line)] 
              bg-[var(--canvas)]/90 backdrop-blur-xl">
  <!-- Header content -->
</header>
```

### Sidebar Component

**Location**: `src/app/shared/layout/sidebar.component.ts`

**Features**
- Fixed/collapsible navigation
- Icon + text menu items
- Active state highlighting
- Mobile slide-in drawer
- Logo and branding

**Usage**
```html
<app-sidebar *ngIf="!isAuthPage"></app-sidebar>
```

### Footer Component

**Location**: `src/app/shared/layout/footer.component.ts`

**Features**
- Copyright information
- Links
- Optional company info

**Usage**
```html
<app-footer></app-footer>
```

## Form Components

### Button Variants

**Primary Button**
```html
<button class="btn-primary">
  <i class="pi pi-check"></i>
  Save Changes
</button>
```
**Styling**: Brand colored, elevated, hover effect
**Use for**: Primary actions (submit, save, create)

**Secondary Button**
```html
<button class="btn-secondary">
  <i class="pi pi-times"></i>
  Cancel
</button>
```
**Styling**: Outlined, subtle hover
**Use for**: Secondary actions (cancel, back, skip)

**Icon Button**
```html
<button class="icon-button" aria-label="Close">
  <i class="pi pi-times"></i>
</button>
```
**Styling**: Minimal, rounded, icon-only
**Use for**: Icons, toolbars, compact spaces

### Input Fields

**Text Input**
```html
<input class="input-field" type="text" 
       placeholder="Search properties..." />
```
**Features**
- Full width by default
- Focus ring
- Placeholder styling
- Rounded corners

**Select Dropdown**
```html
<select class="input-field">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

**Password Input**
```html
<input class="input-field" type="password" 
       placeholder="Enter password" />
```

**Search Input with Icon**
```html
<div class="relative">
  <i class="pi pi-search absolute left-4 top-1/2 
             -translate-y-1/2 text-[var(--ink-muted)]"></i>
  <input class="input-field pl-11" type="search" 
         placeholder="Search..." />
</div>
```

## Card Components

### Surface Card

**Basic Card**
```html
<div class="surface-card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

**Card with Padding**
```html
<div class="surface-card p-6">
  <!-- Content with standard padding -->
</div>
```

**Dashboard Card**
```html
<div class="dashboard-card">
  <div class="flex items-center justify-between">
    <h4>Metric Title</h4>
    <span class="text-2xl font-bold">12,345</span>
  </div>
  <p class="text-sm text-[var(--ink-muted)]">+12.5% from last month</p>
</div>
```

### Status Badge

**Success Badge**
```html
<span class="p-badge p-badge-success">Completed</span>
```

**Warning Badge**
```html
<span class="p-badge p-badge-warning">Pending</span>
```

**Danger Badge**
```html
<span class="p-badge p-badge-danger">Failed</span>
```

**Info Badge**
```html
<span class="p-badge p-badge-info">Active</span>
```

## Navigation

### Active Link

**Markup**
```html
<a [class.nav-active]="isActive">Properties</a>
```

**CSS Class**
```css
.nav-active {
  background: var(--brand-soft);
  color: var(--brand-dark);
  font-weight: 600;
}
```

### Breadcrumb

**Pattern**
```html
<nav class="flex items-center gap-2 text-sm">
  <a class="text-[var(--ink-muted)] hover:text-[var(--ink)]">Dashboard</a>
  <i class="pi pi-chevron-right text-[var(--ink-muted)]"></i>
  <a class="text-[var(--ink-muted)] hover:text-[var(--ink)]">Properties</a>
  <i class="pi pi-chevron-right text-[var(--ink-muted)]"></i>
  <span class="font-semibold text-[var(--ink)]">Details</span>
</nav>
```

## Data Display

### Data Table

**Markup**
```html
<div class="data-table">
  <table class="w-full">
    <thead>
      <tr>
        <th class="bg-[var(--surface-muted)] px-5 py-3 text-left">Name</th>
        <th class="bg-[var(--surface-muted)] px-5 py-3 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--line)]">
        <td class="px-5 py-4">Property Name</td>
        <td class="px-5 py-4">
          <span class="p-badge p-badge-success">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Grid Layout

**Property Cards Grid**
```html
<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div class="surface-card">
    <!-- Card content -->
  </div>
  <!-- More cards -->
</div>
```

### List Item

**Pattern**
```html
<div class="flex items-center justify-between border-b border-[var(--line)] 
            px-5 py-4 transition hover:bg-[var(--surface-soft)]">
  <div class="flex-1 min-w-0">
    <p class="font-semibold text-[var(--ink)]">Item Title</p>
    <p class="text-sm text-[var(--ink-muted)]">Subtitle or description</p>
  </div>
  <button class="icon-button">
    <i class="pi pi-chevron-right"></i>
  </button>
</div>
```

## Modals & Overlays

### Dialog/Modal

**PrimeNG Dialog**
```html
<p-dialog [(visible)]="displayModal" [header]="'Confirm Action'" 
          [modal]="true" [style]="{width: '50vw'}">
  <p>Are you sure?</p>
  <ng-template pTemplate="footer">
    <button class="btn-secondary" (click)="displayModal=false">
      Cancel
    </button>
    <button class="btn-primary" (click)="confirm()">
      Confirm
    </button>
  </ng-template>
</p-dialog>
```

### Dropdown Menu

**Profile Menu**
```html
<div class="relative">
  <button (click)="toggleMenu()" class="icon-button">
    <i class="pi pi-bars"></i>
  </button>
  <div *ngIf="menuOpen" class="animate-in absolute right-0 top-12 z-50 
              w-56 overflow-hidden rounded-2xl border border-[var(--line)] 
              bg-[var(--surface)] p-2 shadow-xl">
    <a href="#" class="flex items-center gap-3 rounded-xl px-3 py-2.5 
                       text-sm text-[var(--ink)] transition 
                       hover:bg-[var(--surface-muted)]">
      <i class="pi pi-cog"></i> Settings
    </a>
    <button (click)="logout()" class="w-full text-left flex items-center gap-3 
                                     rounded-xl px-3 py-2.5 text-sm text-rose-600 
                                     transition hover:bg-rose-50">
      <i class="pi pi-sign-out"></i> Sign Out
    </button>
  </div>
</div>
```

## Empty States

**Empty State Template**
```html
<div class="flex flex-col items-center justify-center gap-4 py-12 px-4">
  <div class="flex h-16 w-16 items-center justify-center rounded-full 
              bg-[var(--surface-muted)]">
    <i class="pi pi-inbox text-2xl text-[var(--ink-muted)]"></i>
  </div>
  <div class="text-center">
    <h3 class="font-semibold text-[var(--ink)]">No data found</h3>
    <p class="text-sm text-[var(--ink-muted)]">
      Try adjusting your filters or search terms
    </p>
  </div>
  <button class="btn-primary">
    <i class="pi pi-plus"></i> Add New Item
  </button>
</div>
```

## Loading States

**Skeleton Loader**
```html
<div class="animate-pulse space-y-4">
  <div class="h-4 rounded bg-[var(--surface-muted)]"></div>
  <div class="h-4 rounded bg-[var(--surface-muted)]"></div>
  <div class="h-4 w-3/4 rounded bg-[var(--surface-muted)]"></div>
</div>
```

**Loading Spinner**
```html
<div class="flex items-center justify-center">
  <div class="animate-spin">
    <i class="pi pi-spinner text-3xl text-[var(--brand)]"></i>
  </div>
</div>
```

## Alert & Notification

**Success Alert**
```html
<div class="flex items-center gap-3 rounded-lg bg-green-50 p-4 
            border border-green-200 dark:bg-green-950 dark:border-green-900">
  <i class="pi pi-check text-lg text-green-600"></i>
  <p class="text-sm font-medium text-green-800 dark:text-green-100">
    Changes saved successfully
  </p>
</div>
```

**Error Alert**
```html
<div class="flex items-center gap-3 rounded-lg bg-rose-50 p-4 
            border border-rose-200 dark:bg-rose-950 dark:border-rose-900">
  <i class="pi pi-exclamation-triangle text-lg text-rose-600"></i>
  <p class="text-sm font-medium text-rose-800 dark:text-rose-100">
    An error occurred. Please try again.
  </p>
</div>
```

**Warning Alert**
```html
<div class="flex items-center gap-3 rounded-lg bg-yellow-50 p-4 
            border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900">
  <i class="pi pi-info-circle text-lg text-yellow-600"></i>
  <p class="text-sm font-medium text-yellow-800 dark:text-yellow-100">
    Please review before proceeding.
  </p>
</div>
```

## Responsive Patterns

### Mobile-First Design

**Hidden on Mobile**
```html
<div class="hidden md:block">
  <!-- Only visible on tablet+
</div>
```

**Mobile Menu**
```html
<button class="icon-button md:hidden">
  <i class="pi pi-bars"></i>
</button>
```

**Responsive Grid**
```html
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div class="surface-card">Item</div>
</div>
```

### Spacing Responsive

```html
<div class="p-4 sm:p-6 lg:p-8">
  <!-- Padding: 16px mobile, 24px tablet, 32px desktop -->
</div>
```

## Animation Examples

### Fade In
```html
<div class="animate-in">Fades in smoothly</div>
```

### Hover Effects
```html
<button class="btn-primary transition hover:-translate-y-0.5 hover:shadow-lg">
  Hover for lift effect
</button>
```

### Transitions
```html
<div class="bg-[var(--brand)] transition-all duration-300 
            hover:bg-[var(--brand-dark)]">
  Smooth color transition
</div>
```

## Accessibility Checklist

When building components:
- ✅ Add `aria-label` to icon buttons
- ✅ Provide focus indicators (`:focus-visible`)
- ✅ Use semantic HTML (`<button>` not `<div>`)
- ✅ Ensure color contrast ≥ 4.5:1
- ✅ Support keyboard navigation
- ✅ Test with screen readers
- ✅ Avoid color alone for meaning

---

**Last Updated**: September 2024
