import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener, signal, Renderer2, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tooltip-wrapper" #container (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .tooltip-wrapper {
      position: relative;
      display: inline-block;
    }
  `]
})
export class TooltipComponent implements OnDestroy {
  @Input() text = '';
  @Input() position: TooltipPosition = 'top';
  @ViewChild('container') container!: ElementRef;

  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  private tooltipElement: HTMLElement | null = null;
  private tooltipTimeout: any;
  
  tooltipPosition = signal({ top: '0px', left: '0px' });
  isVisible = signal(false);

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    
    this.isVisible.set(true);
    this.tooltipTimeout = setTimeout(() => {
      if (this.container) {
        const rect = this.container.nativeElement.getBoundingClientRect();
        const styles = this.calculateFixedPosition(rect);
        this.tooltipPosition.set(styles);
        this.createTooltipElement();
      }
    }, 50); // Small delay to ensure DOM is ready
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    this.isVisible.set(false);
    this.removeTooltipElement();
  }

  private createTooltipElement(): void {
    if (this.tooltipElement) {
      return;
    }

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'app-tooltip-portal');
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'background-color', 'rgb(15, 23, 42)');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '8px');
    this.renderer.setStyle(this.tooltipElement, 'padding', '6px 12px');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '2147483647'); // Maximum z-index (prevents stacking context issues)
    this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    this.renderer.setStyle(this.tooltipElement, 'visibility', 'visible');
    this.renderer.setStyle(this.tooltipElement, 'font-weight', '500');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 10px 15px -3px rgba(0, 0, 0, 0.3)');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'user-select', 'none');
    this.renderer.setStyle(this.tooltipElement, 'will-change', 'transform, opacity');

    const { top, left } = this.tooltipPosition();
    this.renderer.setStyle(this.tooltipElement, 'top', top);
    this.renderer.setStyle(this.tooltipElement, 'left', left);

    const textNode = this.renderer.createText(this.text);
    this.renderer.appendChild(this.tooltipElement, textNode);

    // Add arrow
    const arrow = this.renderer.createElement('div');
    this.renderer.setStyle(arrow, 'position', 'absolute');
    this.renderer.setStyle(arrow, 'width', '8px');
    this.renderer.setStyle(arrow, 'height', '8px');
    this.renderer.setStyle(arrow, 'background-color', 'rgb(15, 23, 42)');
    
    // Set arrow position properties based on tooltip position
    if (this.position === 'right') {
      this.renderer.setStyle(arrow, 'left', '-4px');
      this.renderer.setStyle(arrow, 'top', '50%');
      this.renderer.setStyle(arrow, 'transform', 'translateY(-50%) rotate(45deg)');
    } else if (this.position === 'bottom') {
      this.renderer.setStyle(arrow, 'top', '-4px');
      this.renderer.setStyle(arrow, 'left', '50%');
      this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');
    } else if (this.position === 'left') {
      this.renderer.setStyle(arrow, 'right', '-4px');
      this.renderer.setStyle(arrow, 'top', '50%');
      this.renderer.setStyle(arrow, 'transform', 'translateY(-50%) rotate(45deg)');
    } else {
      // top position (default)
      this.renderer.setStyle(arrow, 'bottom', '-4px');
      this.renderer.setStyle(arrow, 'left', '50%');
      this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');
    }

    this.renderer.appendChild(this.tooltipElement, arrow);
    // Append to body to escape all stacking contexts
    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  private removeTooltipElement(): void {
    if (this.tooltipElement) {
      try {
        this.renderer.removeChild(document.body, this.tooltipElement);
      } catch (e) {
        // Element already removed, ignore error
      }
      this.tooltipElement = null;
    }
  }

  ngOnDestroy(): void {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    this.removeTooltipElement();
  }

  private calculateFixedPosition(rect: DOMRect): { top: string; left: string } {
    const offset = 8;

    switch (this.position) {
      case 'right':
        return {
          top: `${rect.top + rect.height / 2 - 8}px`,
          left: `${rect.right + offset}px`
        };
      case 'bottom':
        return {
          top: `${rect.bottom + offset}px`,
          left: `${rect.left + rect.width / 2 - 30}px`
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2 - 8}px`,
          left: `${rect.left - 70}px`
        };
      case 'top':
      default:
        return {
          top: `${rect.top - 32}px`,
          left: `${rect.left + rect.width / 2 - 30}px`
        };
    }
  }

  getArrowPositionStyle(): string {
    let styles = '';

    switch (this.position) {
      case 'right':
        styles = 'left: -4px; top: 50%; transform: translateY(-50%) rotate(45deg);';
        break;
      case 'bottom':
        styles = 'top: -4px; left: 50%; transform: translateX(-50%) rotate(45deg);';
        break;
      case 'left':
        styles = 'right: -4px; top: 50%; transform: translateY(-50%) rotate(45deg);';
        break;
      case 'top':
      default:
        styles = 'bottom: -4px; left: 50%; transform: translateX(-50%) rotate(45deg);';
    }

    return styles;
  }
}
