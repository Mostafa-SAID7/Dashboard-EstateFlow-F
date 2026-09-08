import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyPhoto } from '../../../models/property.model';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-card">
      <h3 class="mb-4 text-base font-bold text-[var(--ink)]">Photo gallery</h3>

      <!-- Main Photo -->
      <div class="mb-4 h-96 overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
        <img *ngIf="selectedPhoto()"
             [src]="selectedPhoto()!.url"
             alt="Property photo"
             class="h-full w-full object-cover">
        <div *ngIf="!selectedPhoto()"
             class="flex h-full w-full items-center justify-center text-[var(--ink-muted)]">
          <i class="pi pi-image text-4xl"></i>
        </div>
      </div>

      <!-- Thumbnails -->
      <div *ngIf="photos.length > 0" class="grid grid-cols-6 gap-2 mb-4">
        <button *ngFor="let photo of photos"
                (click)="selectPhoto(photo)"
                 class="relative overflow-hidden rounded-xl border-2"
                 [ngClass]="selectedPhoto()?.id === photo.id ? 'border-[var(--brand)]' : 'border-[var(--line)]'">
          <img [src]="photo.url"
               alt="Thumbnail"
               class="w-full h-16 object-cover">
        </button>
      </div>

      <!-- Upload Section -->
       <div class="rounded-2xl border-2 border-dashed border-[var(--line)] p-6 text-center">
        <input type="file"
               #fileInput
               (change)="onFileSelected($event)"
               accept="image/*"
               class="hidden">
        <button (click)="fileInput.click()"
                 class="text-xs font-bold text-[var(--brand)] hover:underline">
           <i class="pi pi-upload mr-2"></i>Upload photo
        </button>
         <p class="mt-2 text-[11px] text-[var(--ink-muted)]">Click to select an image</p>
      </div>

      <!-- Delete Button -->
      <div *ngIf="selectedPhoto()" class="mt-4">
        <button (click)="deletePhoto()"
                 class="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700">
          Delete Selected Photo
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
export class PhotoGalleryComponent implements OnInit {
  @Input() photos: PropertyPhoto[] = [];
  @Output() photoUploaded = new EventEmitter<File>();
  @Output() photoDeleted = new EventEmitter<string>();

  selectedPhoto = signal<PropertyPhoto | null>(null);

  ngOnInit(): void {
    if (this.photos && this.photos.length > 0) {
      this.selectedPhoto.set(this.photos[0] || null);
    }
  }

  selectPhoto(photo: PropertyPhoto): void {
    this.selectedPhoto.set(photo);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoUploaded.emit(input.files[0]);
    }
  }

  deletePhoto(): void {
    const photo = this.selectedPhoto();
    if (photo) {
      this.photoDeleted.emit(photo.id);
    }
  }
}
