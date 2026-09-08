import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'maintenance' | 'occupancy' | 'payment' | 'lease' | 'other';
  icon: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-card">
      <h3 class="mb-6 text-base font-bold text-[var(--ink)]">Activity timeline</h3>

      <div *ngIf="events.length === 0" class="text-center py-8">
        <p class="text-sm text-[var(--ink-muted)]">No activity recorded</p>
      </div>

      <div *ngIf="events.length > 0" class="space-y-6">
        <div *ngFor="let event of events; let last = last" class="flex gap-4">
          <!-- Timeline dot and line -->
          <div class="flex flex-col items-center">
             <div class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                 [ngClass]="getEventColorClass(event.type)">
              {{ event.icon }}
            </div>
             <div *ngIf="!last" class="mt-2 h-12 w-0.5 bg-[var(--line)]"></div>
          </div>

          <!-- Event content -->
          <div class="flex-1 pt-1">
             <h4 class="text-sm font-semibold text-[var(--ink)]">{{ event.title }}</h4>
             <p class="mt-1 text-xs text-[var(--ink-muted)]">{{ event.description }}</p>
             <p class="mt-2 text-[10px] text-[var(--ink-muted)]">
              {{ event.timestamp | date: 'short' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];

  getEventColorClass(type: string): string {
    const colorMap = {
       maintenance: 'bg-[#f5e8c9] text-[#997219]',
       occupancy: 'bg-[var(--brand-soft)] text-[var(--brand)]',
       payment: 'bg-[#dceee7] text-[var(--brand)]',
       lease: 'bg-[#f5e0d9] text-[#b56855]',
       other: 'bg-[var(--surface-muted)] text-[var(--ink-muted)]'
    };
    return colorMap[type as keyof typeof colorMap] || colorMap.other;
  }
}
