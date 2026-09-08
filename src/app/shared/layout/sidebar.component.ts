import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUnreadCount } from '../../store/notifications/notifications.selectors';
import { SidebarService } from '../../services/sidebar.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside [ngClass]="{
      'w-64': !isCollapsed(),
      'w-[4.75rem]': isCollapsed(),
      'translate-x-0': isMobileSidebarOpen(),
      '-translate-x-full': !isMobileSidebarOpen()
      }" class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--line)] bg-[var(--surface)] transition-all duration-300 md:sticky md:top-[5.25rem] md:h-[calc(100vh-5.25rem)] md:translate-x-0">
      <div class="hidden h-[5.25rem] shrink-0 items-center gap-3 px-5 md:flex" [class.justify-center]="isCollapsed()">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-dark)] text-white shadow-sm"><i class="pi pi-chart-pie text-sm"></i></span>
        <span *ngIf="!isCollapsed()" class="font-display text-sm font-bold tracking-tight text-[var(--ink)]">Estate<span class="text-[var(--brand)]">Flow</span></span>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 py-7">
        <p *ngIf="!isCollapsed()" class="eyebrow mb-3 px-3">Workspace</p>
        <a *ngFor="let item of navItems" [routerLink]="item.route" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }" (click)="closeMobileSidebar()" class="group relative mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]" [class.justify-center]="isCollapsed()">
          <i [class]="getIconClass(item.icon) + ' w-5 text-center text-base'"></i>
          <span *ngIf="!isCollapsed()" class="truncate">{{ item.label }}</span>
          <span *ngIf="item.badge && !isCollapsed()" class="ml-auto rounded-md bg-[var(--brand-dark)] px-1.5 py-0.5 text-[10px] font-bold text-white">{{ unreadCount$ | async }}</span>
          <span *ngIf="isCollapsed()" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[var(--ink)] px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">{{ item.label }}</span>
        </a>

        <p *ngIf="!isCollapsed()" class="eyebrow mb-3 mt-8 px-3">Manage</p>
        <a *ngFor="let item of secondaryItems" [routerLink]="item.route" routerLinkActive="nav-active" class="group relative mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]" [class.justify-center]="isCollapsed()">
          <i [class]="getIconClass(item.icon) + ' w-5 text-center text-base'"></i>
          <span *ngIf="!isCollapsed()" class="truncate">{{ item.label }}</span>
          <span *ngIf="isCollapsed()" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[var(--ink)] px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">{{ item.label }}</span>
        </a>
      </nav>

      <div class="border-t border-[var(--line)] p-4">
        <div *ngIf="!isCollapsed()" class="mb-3 rounded-2xl bg-[var(--brand-dark)] p-4 text-white">
          <div class="mb-3 flex items-center justify-between"><i class="pi pi-sparkles text-sm text-emerald-200"></i><span class="text-[9px] font-bold uppercase tracking-widest text-emerald-200">Pro plan</span></div>
          <p class="text-xs font-medium leading-5 text-emerald-50">Unlock advanced portfolio insights.</p>
          <button class="mt-3 text-xs font-bold text-white underline decoration-emerald-300 underline-offset-4">Upgrade now</button>
        </div>
        <button (click)="toggleSidebar()" class="hidden w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] md:flex" [class.justify-center]="isCollapsed()">
          <i [class]="isCollapsed() ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
          <span *ngIf="!isCollapsed()">Collapse menu</span>
        </button>
      </div>
    </aside>
    <div *ngIf="isMobileSidebarOpen()" (click)="closeMobileSidebar()" class="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"></div>
  `
})
export class SidebarComponent {
  private store = inject(Store);
  private sidebarService = inject(SidebarService);
  isCollapsed = this.sidebarService.isSidebarCollapsed;
  isMobileSidebarOpen = this.sidebarService.isMobileSidebarOpen;
  unreadCount$ = this.store.select(selectUnreadCount);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Properties', route: '/properties', icon: 'properties' },
    { label: 'Tenants', route: '/tenants', icon: 'tenants' },
    { label: 'Map view', route: '/map', icon: 'map' }
  ];
  secondaryItems: NavItem[] = [
    { label: 'Financials', route: '/financial-analytics', icon: 'financial' },
    { label: 'Work orders', route: '/work-orders', icon: 'work-orders' },
    { label: 'Reports', route: '/reporting', icon: 'reports' },
    { label: 'Notifications', route: '/notifications', icon: 'notifications', badge: true }
  ];

  toggleSidebar(): void {
    this.sidebarService.toggleSidebarCollapse(!this.isCollapsed());
  }

  closeMobileSidebar(): void {
    this.sidebarService.closeMobileSidebar();
  }

  getIconClass(icon: string): string {
    const icons: Record<string, string> = {
      dashboard: 'pi pi-th-large',
      properties: 'pi pi-building',
      tenants: 'pi pi-users',
      map: 'pi pi-map-marker',
      financial: 'pi pi-chart-line',
      'work-orders': 'pi pi-wrench',
      reports: 'pi pi-file',
      notifications: 'pi pi-bell'
    };
    return icons[icon] ?? 'pi pi-circle';
  }
}