import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"></i>
      <input 
        type="search"
        [placeholder]="placeholder"
        [value]="searchTerm"
        (input)="onSearch($event)"
        class="input-field pl-11 pr-4 w-full h-12">
      <button 
        *ngIf="searchTerm"
        (click)="clearSearch()"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] 
               hover:text-[var(--ink)] transition"
        aria-label="Clear search">
        <i class="pi pi-times"></i>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Search...';
  @Output() search = new EventEmitter<string>();

  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.search.emit(term);
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search.emit('');
  }
}
