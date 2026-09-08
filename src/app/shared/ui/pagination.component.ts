import { Component, Input, Output, EventEmitter, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-4 py-4">
      <p class="text-sm text-[var(--ink-muted)]">
        Showing <span class="font-semibold">{{ from() }}</span> to 
        <span class="font-semibold">{{ to() }}</span> of 
        <span class="font-semibold">{{ total }}</span> results
      </p>
      
      <div class="flex items-center gap-1">
        <button 
          (click)="previousPage()"
          [disabled]="currentPage === 1"
          class="icon-button disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="pi pi-chevron-left"></i>
        </button>
        
        <button 
          *ngFor="let page of pages()"
          (click)="goToPage(page)"
          [class]="page === currentPage ? 'btn-primary' : 'btn-secondary'"
          class="w-10 h-10 flex items-center justify-center text-xs">
          {{ page }}
        </button>
        
        <button 
          (click)="nextPage()"
          [disabled]="currentPage === totalPages()"
          class="icon-button disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.total / this.pageSize));
  from = computed(() => (this.currentPage - 1) * this.pageSize + 1);
  to = computed(() => Math.min(this.currentPage * this.pageSize, this.total));
  pages = computed(() => this.generatePages());

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  private generatePages(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    const totalPages = this.totalPages();

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (this.currentPage > 3) pages.push(-1);
      
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(totalPages - 1, this.currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (this.currentPage < totalPages - 2) pages.push(-1);
      
      pages.push(totalPages);
    }

    return pages;
  }
}
