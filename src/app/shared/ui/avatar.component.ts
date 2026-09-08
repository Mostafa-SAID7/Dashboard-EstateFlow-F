import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="getContainerClasses()">
      <img *ngIf="src" [src]="src" [alt]="initials" class="w-full h-full object-cover">
      <span *ngIf="!src" class="flex items-center justify-center w-full h-full font-semibold">
        {{ initials }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() name = '';
  @Input() size: AvatarSize = 'md';
  @Input() color?: string;

  get initials(): string {
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getContainerClasses(): string {
    let classes = 'rounded-full flex items-center justify-center font-bold overflow-hidden ';

    switch (this.size) {
      case 'xs':
        classes += 'w-6 h-6 text-xs ';
        break;
      case 'sm':
        classes += 'w-8 h-8 text-sm ';
        break;
      case 'lg':
        classes += 'w-12 h-12 text-lg ';
        break;
      case 'xl':
        classes += 'w-16 h-16 text-2xl ';
        break;
      case 'md':
      default:
        classes += 'w-10 h-10 text-base ';
    }

    classes += this.color || 'bg-[var(--brand-soft)] text-[var(--brand-dark)]';

    return classes;
  }
}
