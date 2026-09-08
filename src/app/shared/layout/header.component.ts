import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--canvas)]/90 backdrop-blur-xl">
      <div class="mx-auto flex h-[5.25rem] w-full max-w-[1720px] items-center gap-3 px-4 sm:px-7 xl:px-10">
        <button (click)="toggleMobileSidebar()" class="icon-button md:hidden" aria-label="Open navigation">
          <i class="pi pi-bars text-lg"></i>
        </button>

        <a routerLink="/dashboard" class="flex shrink-0 items-center gap-2.5 md:hidden">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-dark)] text-white shadow-sm">
            <i class="pi pi-chart-pie text-sm"></i>
          </span>
          <span class="text-sm font-bold tracking-tight text-[var(--ink)]">Estate<span class="text-[var(--brand)]">Flow</span></span>
        </a>

        <div class="relative hidden max-w-[34rem] flex-1 md:block">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--ink-muted)]"></i>
          <input class="input-field h-12 w-full pl-11 pr-20" type="search" placeholder="Search anything..." aria-label="Search" />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[10px] font-semibold text-[var(--ink-muted)]">⌘ F</span>
        </div>

        <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button class="icon-button hidden sm:inline-flex" title="Help" aria-label="Help"><i class="pi pi-question-circle"></i></button>
          <button class="icon-button relative" title="Notifications" aria-label="Notifications">
            <i class="pi pi-bell"></i>
            <span class="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d47568] ring-2 ring-[var(--canvas)]"></span>
          </button>
          <button (click)="toggleDarkMode()" class="icon-button hidden sm:inline-flex" [title]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'" aria-label="Toggle color mode">
            <i [class]="isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
          <div class="mx-2 hidden h-7 w-px bg-[var(--line)] sm:block"></div>
          <div class="relative">
            <button (click)="toggleProfileMenu()" class="flex items-center gap-2 rounded-full p-1.5 transition hover:bg-[var(--surface-muted)]" aria-label="Open profile menu">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7b8ad] text-xs font-bold text-[#673b35]">JD</span>
              <span class="hidden text-left sm:block">
                <span class="block text-xs font-semibold text-[var(--ink)]">Tokot Michael</span>
                <span class="block text-[10px] text-[var(--ink-muted)]">michael20&#64;mail.com</span>
              </span>
            </button>
            <div *ngIf="showProfileMenu()" class="animate-in absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-xl">
              <div class="border-b border-[var(--line)] px-3 pb-3 pt-2">
                <p class="text-sm font-semibold text-[var(--ink)]">{{ userName() }}</p>
                <p class="mt-0.5 text-xs text-[var(--ink-muted)]">admin&#64;estateflow.com</p>
              </div>
              <a href="/settings" class="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"><i class="pi pi-cog text-[var(--ink-muted)]"></i> Settings</a>
              <button (click)="logout()" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30"><i class="pi pi-sign-out"></i> Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);

  showProfileMenu = signal(false);
  isDarkMode = signal(this.getInitialDarkMode());
  userName = signal('John Doe');

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDarkMode());
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    });
  }

  toggleProfileMenu(): void {
    this.showProfileMenu.update(value => !value);
  }

  toggleMobileSidebar(): void {
    this.sidebarService.toggleMobileSidebar();
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private getInitialDarkMode(): boolean {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}