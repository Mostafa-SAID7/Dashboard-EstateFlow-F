import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { KpiCardComponent } from './components/kpi-card.component';
import { AlertListComponent, Alert } from './components/alert-list.component';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, AlertListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
      <section class="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p class="eyebrow mb-2">Tuesday, September 08, 2026</p>
          <h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)] sm:text-[2.15rem]">Dashboard</h1>
          <p class="mt-1 text-sm text-[var(--ink-muted)]">Plan, prioritize, and accomplish with ease.</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary hidden sm:inline-flex"><i class="pi pi-upload text-xs"></i> Import data</button>
          <button (click)="navigateTo('/properties')" class="btn-primary"><i class="pi pi-plus text-xs"></i> Add project</button>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <app-kpi-card label="Total projects" [value]="propertyCount()" icon="pi pi-folder" [trend]="propertyTrend()" format="number" borderColor="green"></app-kpi-card>
        <app-kpi-card label="Ended projects" [value]="10" icon="pi pi-check" [trend]="occupancyTrend()" format="number" borderColor="blue"></app-kpi-card>
        <app-kpi-card label="Running projects" [value]="12" icon="pi pi-spinner" [trend]="revenueTrend()" format="number" borderColor="orange"></app-kpi-card>
        <app-kpi-card label="Pending project" [value]="2" icon="pi pi-clock" [trend]="roiTrend()" format="number" borderColor="purple"></app-kpi-card>
      </section>

      <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <div class="dashboard-card">
          <div class="mb-6 flex items-center justify-between">
            <div><h2 class="text-base font-bold text-[var(--ink)]">Project analytics</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">Projects completed across the week</p></div>
            <button class="flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]">This week <i class="pi pi-chevron-down text-[9px]"></i></button>
          </div>
          <div class="flex h-52 items-end gap-3 border-b border-[var(--line)] pb-0 sm:gap-6">
            <div *ngFor="let height of barHeights; let i = index" class="group flex h-full flex-1 flex-col items-center justify-end gap-3">
              <span class="text-[10px] font-bold text-[var(--brand)] opacity-0 transition group-hover:opacity-100">{{ revenueBars[i] }}</span>
              <div class="relative w-full max-w-10 rounded-t-full transition-all group-hover:brightness-110" [ngClass]="i === 3 ? 'bg-[var(--brand-dark)]' : i === 2 ? 'bg-[#69c59d]' : i % 2 === 0 ? 'bg-[var(--surface-muted)] [background-image:repeating-linear-gradient(135deg,transparent,transparent_4px,var(--ink-muted)_5px,var(--ink-muted)_6px)]' : 'bg-[var(--brand)]'" [style.height.%]="height"></div>
              <span class="text-[10px] font-medium text-[var(--ink-muted)]">{{ months[i] }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="mb-5 flex items-start justify-between">
            <div><h2 class="text-base font-bold text-[var(--ink)]">Project progress</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">Overall completion</p></div>
            <button class="icon-button !h-8 !w-8"><i class="pi pi-ellipsis-h"></i></button>
          </div>
          <div class="flex items-center justify-center py-1">
            <div class="relative flex h-40 w-40 items-center justify-center rounded-full" style="background: conic-gradient(from 210deg, var(--brand-dark) 0 41%, var(--surface-muted) 41% 75%, transparent 75% 100%)">
              <div class="absolute inset-[1.15rem] rounded-full border-[11px] border-[var(--surface)] bg-[var(--surface)]"></div>
              <div class="relative text-center"><span class="font-display text-3xl font-bold text-[var(--ink)]">41%</span><span class="block text-[10px] text-[var(--ink-muted)]">Project ended</span></div>
            </div>
          </div>
          <div class="mt-5 flex justify-center gap-4 text-[10px] text-[var(--ink-muted)]">
            <span class="flex items-center gap-1.5"><i class="pi pi-circle-fill text-[8px] text-[var(--brand)]"></i> Completed</span>
            <span class="flex items-center gap-1.5"><i class="pi pi-circle-fill text-[8px] text-[var(--brand-dark)]"></i> In progress</span>
            <span class="flex items-center gap-1.5"><i class="pi pi-circle-fill text-[8px] text-[var(--ink-muted)]"></i> Pending</span>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,.7fr)_minmax(260px,.55fr)]">
        <div class="dashboard-card">
          <div class="mb-5 flex items-center justify-between"><div><h2 class="text-base font-bold text-[var(--ink)]">Team collaboration</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">What your team is working on</p></div><button class="btn-secondary !px-3 !py-2 !text-xs"><i class="pi pi-user-plus text-[10px]"></i> Add member</button></div>
          <div class="divide-y divide-[var(--line)]">
            <div *ngFor="let member of teamMembers" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold" [ngClass]="member.color">{{ member.initials }}</span>
              <div class="min-w-0 flex-1"><p class="truncate text-xs font-semibold text-[var(--ink)]">{{ member.name }}</p><p class="truncate text-[10px] text-[var(--ink-muted)]">{{ member.activity }}</p></div>
              <span class="rounded-full px-2 py-1 text-[9px] font-semibold" [ngClass]="member.statusClass">{{ member.status }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="mb-5 flex items-center justify-between"><div><h2 class="text-base font-bold text-[var(--ink)]">Reminders</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">Don't miss a beat</p></div><button class="icon-button !h-8 !w-8"><i class="pi pi-ellipsis-h"></i></button></div>
          <div class="space-y-4">
            <div class="flex gap-3"><span class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5e0d9] text-[#b56855]"><i class="pi pi-calendar text-xs"></i></span><div><p class="text-xs font-semibold text-[var(--ink)]">Meeting with Arc Company</p><p class="mt-1 text-[10px] text-[var(--ink-muted)]">Today, 02:00 PM · 04:00 PM</p></div></div>
            <div class="flex gap-3"><span class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]"><i class="pi pi-file-edit text-xs"></i></span><div><p class="text-xs font-semibold text-[var(--ink)]">Monthly report due</p><p class="mt-1 text-[10px] text-[var(--ink-muted)]">Tomorrow, 09:00 AM</p></div></div>
            <button class="mt-1 w-full rounded-full bg-[var(--brand-dark)] py-2.5 text-xs font-bold text-white transition hover:bg-[var(--brand)]"><i class="pi pi-plus mr-2 text-[10px]"></i> Add reminder</button>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="mb-4 flex items-center justify-between"><h2 class="text-base font-bold text-[var(--ink)]">Project</h2><button (click)="navigateTo('/properties')" class="rounded-full border border-[var(--line)] px-2.5 py-1 text-[10px] font-semibold text-[var(--ink-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]">+ New</button></div>
          <div class="space-y-3">
            <div *ngFor="let project of projects" class="flex items-center gap-2.5"><span class="flex h-7 w-7 items-center justify-center rounded-lg text-xs" [ngClass]="project.color"><i [class]="project.icon"></i></span><div class="min-w-0"><p class="truncate text-[11px] font-semibold text-[var(--ink)]">{{ project.name }}</p><p class="text-[9px] text-[var(--ink-muted)]">Due date: {{ project.due }}</p></div></div>
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded-[1.25rem] bg-[var(--brand-dark)] p-6 text-white shadow-[0_18px_38px_-25px_var(--brand-dark)] sm:p-7">
        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p class="eyebrow !text-emerald-200">Portfolio snapshot</p><h2 class="mt-2 font-display text-2xl font-bold tracking-tight">Keep your projects moving forward.</h2><p class="mt-1 max-w-xl text-sm text-emerald-100/75">You have 12 active projects and 4 team members collaborating today.</p></div>
          <button (click)="navigateTo('/reporting')" class="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[var(--brand-dark)] transition hover:bg-emerald-50">View reports <i class="pi pi-arrow-right text-[10px]"></i></button>
        </div>
      </section>

      <app-alert-list [alerts]="alerts()" (alertDismissed)="dismissAlert($event)"></app-alert-list>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  properties = signal<Property[]>([]);
  alerts = signal<Alert[]>([]);
  propertyTrend = signal(2.5);
  occupancyTrend = signal(1.2);
  revenueTrend = signal(3.8);
  roiTrend = signal(2.1);

  months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  barHeights = [42, 58, 51, 72, 64, 82, 96];
  revenueBars = ['$32k', '$44k', '$38k', '$56k', '$49k', '$63k', '$72k'];
  teamMembers = [
    { name: 'Alexandra Deff', initials: 'AD', activity: 'Updated Downtown Heights lease', status: 'Completed', color: 'bg-[#f3c4b6] text-[#713c32]', statusClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' },
    { name: 'Edwin Adenike', initials: 'EA', activity: 'Added a new property document', status: 'In progress', color: 'bg-[#c8e0b4] text-[#3b5f32]', statusClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' },
    { name: 'Isaac Owatemilurin', initials: 'IO', activity: 'Reviewed maintenance request', status: 'Pending', color: 'bg-[#b9d1ed] text-[#345376]', statusClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' },
    { name: 'David Oshodi', initials: 'DO', activity: 'Exported portfolio report', status: 'Completed', color: 'bg-[#e9c6e2] text-[#704667]', statusClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' }
  ];
  projects = [
    { name: 'Develop API Endpoints', due: 'Nov 26, 2024', icon: 'pi pi-bolt', color: 'bg-[#d8ddfb] text-[#4452b9]' },
    { name: 'Onboarding Flow', due: 'Nov 30, 2024', icon: 'pi pi-globe', color: 'bg-[#cfe8e4] text-[#2e8c7c]' },
    { name: 'Build Dashboard', due: 'Nov 30, 2024', icon: 'pi pi-chart-bar', color: 'bg-[#f0dcae] text-[#a7781b]' },
    { name: 'Optimize Page Load', due: 'Dec 05, 2024', icon: 'pi pi-bolt', color: 'bg-[#f4d1b4] text-[#c4773d]' },
    { name: 'Cross-Browser Testing', due: 'Dec 06, 2024', icon: 'pi pi-share-alt', color: 'bg-[#dfd0ef] text-[#7f56ad]' }
  ];

  propertyCount = computed(() => this.properties().length || 24);
  occupancyRate = computed(() => this.properties().length ? this.properties().reduce((sum, property) => sum + (property.occupancyRate || 0), 0) / this.properties().length : 72.3);
  totalRevenue = computed(() => this.properties().length ? this.properties().reduce((sum, property) => sum + (property.monthlyRevenue || 0), 0) : 184600);
  roi = computed(() => this.properties().length ? this.properties().reduce((sum, property) => sum + (property.roi || 0), 0) / this.properties().length : 18.6);

  ngOnInit(): void {
    this.store.select(state => (state as any).properties?.items || []).subscribe(properties => {
      this.properties.set(properties);
      this.generateAlerts(properties);
    });
  }

  private generateAlerts(properties: Property[]): void {
    this.alerts.set(properties.filter(property => property.status === 'inactive').slice(0, 5).map(property => ({
      id: `status-${property.id}`, type: 'occupancy', severity: 'critical', title: 'Inactive Property',
      message: 'This property is currently inactive', propertyId: property.id,
      propertyAddress: `${property.address?.street}, ${property.address?.city}`, timestamp: new Date()
    })));
  }

  dismissAlert(alertId: string): void {
    this.alerts.update(alerts => alerts.filter(alert => alert.id !== alertId));
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}