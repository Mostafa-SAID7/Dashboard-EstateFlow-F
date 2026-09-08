import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button.component';
import { InputComponent } from '../../shared/ui/input.component';
import { SelectComponent, type SelectOption } from '../../shared/ui/select.component';
import { TooltipComponent } from '../../shared/ui/tooltip.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow mb-2">Preferences</p>
          <h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Settings</h1>
          <p class="mt-1 text-sm text-[var(--ink-muted)]">Manage your account and application preferences.</p>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="dashboard-card">
        <div class="border-b border-[var(--line)] pb-4 mb-6">
          <h2 class="text-lg font-bold text-[var(--ink)]">Account settings</h2>
          <p class="text-sm text-[var(--ink-muted)] mt-1">Update your profile information</p>
        </div>
        <form [formGroup]="accountForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-input
              type="text"
              label="First name"
              placeholder="John"
              formControlName="firstName">
            </app-input>
            <app-input
              type="text"
              label="Last name"
              placeholder="Doe"
              formControlName="lastName">
            </app-input>
          </div>
          <app-input
            type="email"
            label="Email address"
            placeholder="john@example.com"
            formControlName="email">
          </app-input>
          <app-input
            type="tel"
            label="Phone number"
            placeholder="+1 (555) 123-4567"
            formControlName="phone">
          </app-input>
          <div class="flex gap-3 pt-4 border-t border-[var(--line)]">
            <app-button
              variant="primary"
              size="md"
              label="Save changes"
              (click)="saveAccountSettings()">
            </app-button>
            <app-button
              variant="secondary"
              size="md"
              label="Cancel"
              (click)="resetAccountForm()">
            </app-button>
          </div>
        </form>
      </div>

      <!-- Notification Preferences -->
      <div class="dashboard-card">
        <div class="border-b border-[var(--line)] pb-4 mb-6">
          <h2 class="text-lg font-bold text-[var(--ink)]">Notification preferences</h2>
          <p class="text-sm text-[var(--ink-muted)] mt-1">Control how and when you receive notifications</p>
        </div>
        <div class="space-y-4">
          <label class="flex items-center justify-between p-4 rounded-xl border border-[var(--line)] hover:bg-[var(--surface-muted)] cursor-pointer transition">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                [(ngModel)]="emailNotifications"
                class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
              <div>
                <p class="text-sm font-medium text-[var(--ink)]">Email notifications</p>
                <p class="text-xs text-[var(--ink-muted)]">Receive updates via email</p>
              </div>
            </div>
            <app-tooltip text="Control email notification settings" position="left">
              <i class="pi pi-info-circle text-[var(--ink-muted)]"></i>
            </app-tooltip>
          </label>

          <label class="flex items-center justify-between p-4 rounded-xl border border-[var(--line)] hover:bg-[var(--surface-muted)] cursor-pointer transition">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                [(ngModel)]="propertyAlerts"
                class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
              <div>
                <p class="text-sm font-medium text-[var(--ink)]">Property alerts</p>
                <p class="text-xs text-[var(--ink-muted)]">Get notified about property updates</p>
              </div>
            </div>
            <app-tooltip text="Property status changes and maintenance alerts" position="left">
              <i class="pi pi-info-circle text-[var(--ink-muted)]"></i>
            </app-tooltip>
          </label>

          <label class="flex items-center justify-between p-4 rounded-xl border border-[var(--line)] hover:bg-[var(--surface-muted)] cursor-pointer transition">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                [(ngModel)]="tenantNotifications"
                class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
              <div>
                <p class="text-sm font-medium text-[var(--ink)]">Tenant notifications</p>
                <p class="text-xs text-[var(--ink-muted)]">Updates about tenant applications and inquiries</p>
              </div>
            </div>
            <app-tooltip text="New tenant applications and inquiries" position="left">
              <i class="pi pi-info-circle text-[var(--ink-muted)]"></i>
            </app-tooltip>
          </label>

          <div class="flex gap-3 pt-4 border-t border-[var(--line)]">
            <app-button
              variant="primary"
              size="md"
              label="Save preferences"
              (click)="saveNotificationPreferences()">
            </app-button>
          </div>
        </div>
      </div>

      <!-- Appearance Settings -->
      <div class="dashboard-card">
        <div class="border-b border-[var(--line)] pb-4 mb-6">
          <h2 class="text-lg font-bold text-[var(--ink)]">Appearance</h2>
          <p class="text-sm text-[var(--ink-muted)] mt-1">Customize how the application looks</p>
        </div>
        <form [formGroup]="appearanceForm" class="space-y-4">
          <app-select
            label="Theme"
            [options]="themeOptions"
            formControlName="theme"
            placeholder="Select theme">
          </app-select>
          <app-select
            label="Language"
            [options]="languageOptions"
            formControlName="language"
            placeholder="Select language">
          </app-select>
          <div class="flex gap-3 pt-4 border-t border-[var(--line)]">
            <app-button
              variant="primary"
              size="md"
              label="Save appearance"
              (click)="saveAppearanceSettings()">
            </app-button>
          </div>
        </form>
      </div>

      <!-- Privacy & Security -->
      <div class="dashboard-card">
        <div class="border-b border-[var(--line)] pb-4 mb-6">
          <h2 class="text-lg font-bold text-[var(--ink)]">Privacy & security</h2>
          <p class="text-sm text-[var(--ink-muted)] mt-1">Manage your security settings</p>
        </div>
        <div class="space-y-4">
          <div class="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)]">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium text-[var(--ink)]">Change password</p>
                <p class="text-xs text-[var(--ink-muted)] mt-1">Update your login password</p>
              </div>
              <app-button
                variant="secondary"
                size="sm"
                label="Change"
                (click)="changePassword()">
              </app-button>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)]">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium text-[var(--ink)]">Two-factor authentication</p>
                <p class="text-xs text-[var(--ink-muted)] mt-1">Add an extra layer of security</p>
              </div>
              <app-button
                variant="secondary"
                size="sm"
                label="{{ twoFactorEnabled() ? 'Disable' : 'Enable' }}"
                (click)="toggleTwoFactor()">
              </app-button>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)]">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium text-[var(--ink)]">Active sessions</p>
                <p class="text-xs text-[var(--ink-muted)] mt-1">Manage your logged-in devices</p>
              </div>
              <app-button
                variant="secondary"
                size="sm"
                label="Manage"
                (click)="manageSessions()">
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="dashboard-card border border-rose-200 dark:border-rose-900/30">
        <div class="border-b border-rose-200 dark:border-rose-900/30 pb-4 mb-6">
          <h2 class="text-lg font-bold text-rose-600">Danger zone</h2>
          <p class="text-sm text-rose-600/70 mt-1">Irreversible actions</p>
        </div>
        <div class="space-y-3">
          <div class="p-4 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium text-rose-900 dark:text-rose-200">Delete account</p>
                <p class="text-xs text-rose-900/70 dark:text-rose-200/70 mt-1">Permanently remove your account and all data</p>
              </div>
              <app-button
                variant="danger"
                size="sm"
                label="Delete"
                (click)="deleteAccount()">
              </app-button>
            </div>
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
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals
  emailNotifications = signal(true);
  propertyAlerts = signal(true);
  tenantNotifications = signal(false);
  twoFactorEnabled = signal(false);

  // Forms
  accountForm: FormGroup;
  appearanceForm: FormGroup;

  // Options
  themeOptions: SelectOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  languageOptions: SelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'ar', label: 'Arabic' }
  ];

  constructor() {
    this.accountForm = this.fb.group({
      firstName: ['John', Validators.required],
      lastName: ['Doe', Validators.required],
      email: ['john.doe@example.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567', Validators.required]
    });

    this.appearanceForm = this.fb.group({
      theme: ['system', Validators.required],
      language: ['en', Validators.required]
    });
  }

  saveAccountSettings(): void {
    if (this.accountForm.valid) {
      console.log('Saving account settings:', this.accountForm.value);
      // API call would go here
    }
  }

  resetAccountForm(): void {
    this.accountForm.reset({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    });
  }

  saveNotificationPreferences(): void {
    console.log('Saving notification preferences:', {
      emailNotifications: this.emailNotifications(),
      propertyAlerts: this.propertyAlerts(),
      tenantNotifications: this.tenantNotifications()
    });
  }

  saveAppearanceSettings(): void {
    if (this.appearanceForm.valid) {
      console.log('Saving appearance settings:', this.appearanceForm.value);
    }
  }

  changePassword(): void {
    console.log('Opening change password dialog');
  }

  toggleTwoFactor(): void {
    this.twoFactorEnabled.update(v => !v);
    console.log('Two-factor authentication:', this.twoFactorEnabled() ? 'enabled' : 'disabled');
  }

  manageSessions(): void {
    console.log('Opening active sessions dialog');
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
    }
  }
}
