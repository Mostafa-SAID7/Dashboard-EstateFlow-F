import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonType = 'text' | 'circle' | 'rectangle';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="type === 'text'" [class]="getTextClasses()"></div>
    <div *ngIf="type === 'circle'" [class]="getCircleClasses()"></div>
    <div *ngIf="type === 'rectangle'" [class]="getRectangleClasses()"></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    div {
      background: linear-gradient(
        90deg,
        var(--surface-muted) 25%,
        var(--surface-soft) 50%,
        var(--surface-muted) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class LoadingSkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() count = 1;

  getTextClasses(): string {
    return `h-4 rounded bg-[var(--surface-muted)] animate-pulse`;
  }

  getCircleClasses(): string {
    return `rounded-full bg-[var(--surface-muted)] animate-pulse` + 
           ` h-${this.height} w-${this.height}`;
  }

  getRectangleClasses(): string {
    return `rounded bg-[var(--surface-muted)] animate-pulse`;
  }
}
