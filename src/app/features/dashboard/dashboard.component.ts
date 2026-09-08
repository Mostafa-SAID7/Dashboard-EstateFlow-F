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
      <section class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow mb-2">Tuesday, September 08, 2026</p>
          <h1 class="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">Good morning, John <span aria-hidden="true">✦</span></h1>
          <p class="mt-2 text-sm text-[var(--ink-muted)]">Here’s what’s happening with your portfolio today.</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary hidden sm:inline-flex"><i class="pi pi-download text-xs"></i> Export</button>
          <button (click)="navigateTo('/properties')" class="btn-primary"><i class="pi pi-plus text-xs"></i> Add property</button>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <app-kpi-card label="Total properties" [value]="propertyCount()" icon="pi pi-building" [trend]="propertyTrend()" format="number" borderColor="green"></app-kpi-card>
        <app-kpi-card label="Occupancy rate" [value]="occupancyRate()" icon="pi pi-users" [trend]="occupancyTrend()" format="percent" borderColor="blue"></app-kpi-card>
        <app-kpi-card label="Monthly revenue" [value]="totalRevenue()" icon="pi pi-wallet" [trend]="revenueTrend()" format="currency" borderColor="orange"></app-kpi-card>
        <app-kpi-card label="Average ROI" [value]="roi()" icon="pi pi-chart-line" [trend]="roiTrend()" format="percent" borderColor="purple"></app-kpi-card>
      </section>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)]">
        <div class="surface-card p-5 sm:p-6">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-[var(--ink)]">Portfolio performance</h2>
              <p class="mt-1 text-xs text-[var(--ink-muted)]">Revenue generated over the last 7 months</p>
            </div>
            <button class="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]">This year <i class="pi pi-chevron-down text-[9px]"></i></button>
          </div>
          <div class="flex h-56 items-end gap-2 sm:gap-4">
            <div *ngFor="let height of barHeights; let i = index" class="group flex h-full flex-1 flex-col items-center justify-end gap-3">
              <div class="relative w-full max-w-12 rounded-t-xl bg-[var(--brand-soft)] transition-all group-hover:bg-[var(--brand)]" [style.height.%]="height">
                <span class="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[var(--ink-muted)] opacity-0 transition group-hover:opacity-100">{{ revenueBars[i] }}</span>
              </div>
              <span class="text-[10px] font-medium text-[var(--ink-muted)]">{{ months[i] }}</span>
            </div>
          </div>
        </div>

        <div class="surface-card overflow-hidden p-5 sm:p-6">
          <div class="mb-5 flex items-start justify-between">
            <div>
              <h2 class="text-base font-bold text-[var(--ink)]">Occupancy rate</h2>
              <p class="mt-1 text-xs text-[var(--ink-muted)]">Across all properties</p>
            </div>
            <span class="rounded-lg bg-[var(--brand-soft)] px-2 py-1 text-[10px] font-bold text-[var(--brand)]">+4.8%</span>
          </div>
          <div class="flex items-center gap-5">
            <div class="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full" style="background: conic-gradient(var(--brand) 0 72%, var(--surface-muted) 72% 100%)">
              <div class="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--surface)]">
                <span class="text-2xl font-bold text-[var(--ink)]">72%</span>
                <span class="text-[10px] text-[var(--ink-muted)]">Occupied</span>
              </div>
            </div>
            <div class="space-y-3 text-xs">
              <p class="flex items-center gap-2 text-[var(--ink-muted)]"><span class="h-2 w-2 rounded-full bg-[var(--brand)]"></span> Occupied <b class="ml-auto text-[var(--ink)]">72%</b></p>
              <p class="flex items-center gap-2 text-[var(--ink-muted)]"><span class="h-2 w-2 rounded-full bg-[#dfe4df]"></span> Available <b class="ml-auto text-[var(--ink)]">28%</b></p>
              <button (click)="navigateTo('/properties')" class="pt-1 text-xs font-bold text-[var(--brand)] hover:underline">View properties <i class="pi pi-arrow-right ml-1 text-[9px]"></i></button>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div class="surface-card p-5 sm:p-6">
          <div class="mb-5 flex items-center justify-between">
            <div><h2 class="text-base font-bold text-[var(--ink)]">Team collaboration</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">Recent activity from your team</p></div>
            <button class="btn-secondary !rounded-lg !px-3 !py-2 !text-xs"><i class="pi pi-user-plus text-[10px]"></i> Invite</button>
          </div>
          <div class="divide-y divide-[var(--line)]">
            <div *ngFor="let member of teamMembers" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold" [ngClass]="member.color">{{ member.initials }}</span>
              <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-[var(--ink)]">{{ member.name }}</p><p class="truncate text-[11px] text-[var(--ink-muted)]">{{ member.activity }}</p></div>
              <span class="rounded-md px-2 py-1 text-[10px] font-semibold" [ngClass]="member.statusClass">{{ member.status }}</span>
            </div>
          </div>
        </div>

        <div class="surface-card p-5 sm:p-6">
          <div class="mb-5 flex items-center justify-between"><div><h2 class="text-base font-bold text-[var(--ink)]">Upcoming reminders</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">Don’t miss a beat</p></div><button class="icon-button !h-8 !w-8"><i class="pi pi-ellipsis-h"></i></button></div>
          <div class="space-y-4">
            <div class="flex gap-3"><span class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"><i class="pi pi-calendar text-xs"></i></span><div><p class="text-sm font-semibold text-[var(--ink)]">Lease renewal review</p><p class="mt-1 text-[11px] text-[var(--ink-muted)]">Today, 02:00 PM · 4 leases</p></div></div>
            <div class="flex gap-3"><span class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300"><i class="pi pi-file-edit text-xs"></i></span><div><p class="text-sm font-semibold text-[var(--ink)]">Monthly report due</p><p class="mt-1 text-[11px] text-[var(--ink-muted)]">Tomorrow, 09:00 AM</p></div></div>
            <button class="mt-1 w-full rounded-xl bg-[var(--brand-dark)] py-2.5 text-xs font-bold text-white transition hover:bg-[var(--brand)]"><i class="pi pi-plus mr-2 text-[10px]"></i> Add reminder</button>
          </div>
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