import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="flex border-b border-[var(--line)]">
        <button 
          *ngFor="let tab of tabs"
          (click)="selectTab(tab.id)"
          [disabled]="tab.disabled"
          [class]="getTabClasses(tab.id)"
          class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition 
                  border-b-2 -mb-px disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="tab.icon" [class]="'pi ' + tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
      <div class="pt-4">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      this.tabChange.emit(tabId);
    }
  }

  getTabClasses(tabId: string): string {
    const isActive = this.activeTab === tabId;
    return `${isActive ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]' 
                       : 'border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'}`;
  }
}
