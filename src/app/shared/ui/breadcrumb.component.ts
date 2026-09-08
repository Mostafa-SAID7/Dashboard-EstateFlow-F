import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="flex items-center gap-1 text-sm">
      <a *ngFor="let item of items; let last = last"
         [routerLink]="item.path"
         [class]="getItemClasses(item)"
         class="transition">
        {{ item.label }}
      </a>
      <i *ngIf="!last" class="pi pi-chevron-right text-[var(--ink-muted)] mx-1"></i>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];

  getItemClasses(item: BreadcrumbItem): string {
    if (item.active) {
      return 'font-semibold text-[var(--ink)]';
    }
    return 'text-[var(--ink-muted)] hover:text-[var(--ink)]';
  }
}
