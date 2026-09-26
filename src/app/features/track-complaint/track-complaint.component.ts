import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { SupabaseService } from '../../core/supabase.service';
import { Complaint } from '../../core/models';

@Component({
  selector: 'app-track-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, StatusBadgeComponent, BackButtonComponent],
  template: `
    <section class="max-w-2xl mx-auto px-4 py-16">
      <app-back-button></app-back-button>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold dash-text mb-2">Track Your Complaint</h1>
        <p class="dash-text-muted">Enter your 6-character complaint code to check its status.</p>
      </div>

      <app-card>
        <div class="flex gap-2">
          <input
            class="input-field uppercase tracking-widest text-center font-mono"
            [(ngModel)]="code"
            (keyup.enter)="track()"
            maxlength="6"
            placeholder="X7Y8Z9"
          />
          <button class="btn-primary whitespace-nowrap" (click)="track()" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span>
            }
            {{ loading ? 'Searching…' : 'Track' }}
          </button>
        </div>

        <div class="mt-6" *ngIf="searched">
          <div *ngIf="!result" class="empty-state">
            <span class="text-4xl mb-3">🔍</span>
            <p>No complaint found with this code. Double-check and try again.</p>
          </div>

          <div *ngIf="result" class="space-y-3 text-sm animate-fade-in-up">
            <div class="flex justify-between border-b dash-border pb-2">
              <span class="dash-text-muted">Code</span><span class="dash-text font-mono">{{ result.code }}</span>
            </div>
            <div class="flex justify-between border-b dash-border pb-2">
              <span class="dash-text-muted">Issue</span><span class="dash-text">{{ result.issue }}</span>
            </div>
            <div class="flex justify-between border-b dash-border pb-2">
              <span class="dash-text-muted">Date</span><span class="dash-text">{{ result.complaint_date }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="dash-text-muted">Status</span>
              <app-status-badge [status]="result.status || 'Active'"></app-status-badge>
            </div>
          </div>
        </div>
      </app-card>
    </section>
  `,
})
export class TrackComplaintComponent {
  code = '';
  loading = false;
  searched = false;
  result: Complaint | null = null;

  constructor(private supabase: SupabaseService) {}

  async track() {
    if (!this.code.trim()) return;
    this.loading = true;
    this.searched = false;
    try {
      this.result = await this.supabase.getComplaintByCode(this.code.trim().toUpperCase());
    } catch {
      this.result = null;
    } finally {
      this.loading = false;
      this.searched = true;
    }
  }
}
