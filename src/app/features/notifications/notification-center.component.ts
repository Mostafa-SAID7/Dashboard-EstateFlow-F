import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectNotifications, selectUnreadCount } from '../../store/notifications/notifications.selectors';
import { markNotificationAsRead, dismissNotification } from '../../store/notifications/notifications.actions';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
        <!-- Header -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p class="eyebrow mb-2">Stay in the loop</p><h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Notifications</h1><p class="mt-1 text-sm text-[var(--ink-muted)]">Unread: {{ (unreadCount$ | async) || 0 }}</p></div>
          <span class="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--brand)]"><i class="pi pi-bell mr-2"></i>Live updates</span>
        </div>

        <!-- Notification Filters -->
        <div class="dashboard-card flex flex-wrap gap-2">
          <button class="rounded-full bg-[var(--brand-dark)] px-4 py-2 text-xs font-semibold text-white">All</button>
          <button class="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]">Unread</button>
          <button class="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]">Lease expiration</button>
          <button class="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]">Payment overdue</button>
          <button class="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]">Maintenance</button>
        </div>

        <!-- Notifications List -->
        <div class="space-y-4">
          <div *ngFor="let notification of (notifications$ | async)" 
               [ngClass]="{'border-[var(--brand)] bg-[var(--brand-soft)]': !notification.read, 'bg-[var(--surface)]': notification.read}"
               class="surface-card p-5 hover:-translate-y-0.5">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                 <h3 class="text-sm font-bold text-[var(--ink)]">{{ notification.title }}</h3>
                 <p class="mt-2 text-xs leading-5 text-[var(--ink-muted)]">{{ notification.message }}</p>
                 <div class="mt-4 flex items-center gap-3">
                   <span class="text-[10px] text-[var(--ink-muted)]">{{ notification.createdAt | date:'short' }}</span>
                   <span [ngClass]="getTypeClass(notification.type)" class="rounded-full px-2 py-1 text-[10px] font-semibold">
                    {{ notification.type }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button *ngIf="!notification.read" 
                        (click)="markAsRead(notification.id)"
                         class="text-xs font-bold text-[var(--brand)] hover:underline">Mark as read</button>
                <button (click)="dismiss(notification.id)" class="text-xs font-bold text-rose-600 hover:underline">Dismiss</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
          <div *ngIf="(notifications$ | async)?.length === 0" class="dashboard-card py-16 text-center">
          <p class="text-sm text-[var(--ink-muted)]">No notifications</p>
        </div>
        </div>
  `
})
export class NotificationCenterComponent implements OnInit {
  private store = inject(Store);

  notifications$: Observable<any[]>;
  unreadCount$: Observable<number>;

  constructor() {
    this.notifications$ = this.store.select(selectNotifications);
    this.unreadCount$ = this.store.select(selectUnreadCount);
  }

  ngOnInit(): void {
    // Load notifications on init
  }

  markAsRead(notificationId: string): void {
    this.store.dispatch(markNotificationAsRead({ id: notificationId }));
  }

  dismiss(notificationId: string): void {
    this.store.dispatch(dismissNotification({ id: notificationId }));
  }

  getTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'lease-expiration': 'bg-[#f5e0d9] text-[#a95d4e]',
      'payment-overdue': 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-200',
      'maintenance-alert': 'bg-[#f5e8c9] text-[#997219]',
      'occupancy-alert': 'bg-[var(--brand-soft)] text-[var(--brand-dark)] dark:text-[var(--brand)]'
    };
    return classes[type] || 'bg-[var(--surface-muted)] text-[var(--ink-muted)]';
  }
}
