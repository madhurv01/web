import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { SupabaseService } from '../../core/supabase.service';
import { Complaint } from '../../core/models';

@Component({
  selector: 'app-view-complaint',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, StatusBadgeComponent, BackButtonComponent],
  template: `
    <section class="max-w-2xl mx-auto px-4 py-12">
      <app-back-button fallbackRoute="/track-complaint"></app-back-button>
      <div *ngIf="loading" class="space-y-3">
        <div class="skeleton h-8 w-1/2 mx-auto"></div>
        <div class="skeleton h-40 w-full"></div>
      </div>

      <div *ngIf="!loading && !complaint" class="text-center">
        <app-card [narrow]="true">
          <p class="text-white/70">No complaint found with this code.</p>
          <a routerLink="/track-complaint" class="btn-secondary mt-4 inline-flex">Try Another Code</a>
        </app-card>
      </div>

      <div *ngIf="!loading && complaint">
        <div class="text-center mb-6">
          <span class="text-3xl">✅</span>
          <h1 class="text-2xl font-bold text-white mt-2">Complaint Submitted</h1>
          <p class="text-white/60 mt-1">Save this code to track your complaint anytime.</p>
        </div>

        <app-card>
          <div class="text-center mb-6">
            <p class="text-white/50 text-sm uppercase tracking-wide mb-1">Complaint Code</p>
            <p class="text-4xl font-mono font-bold text-teal-300 tracking-widest">{{ complaint.code }}</p>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-white/10 pb-2" *ngIf="complaint.name">
              <span class="text-white/50">Name</span><span class="text-white">{{ complaint.name }}</span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-2" *ngIf="complaint.address">
              <span class="text-white/50">Address</span><span class="text-white">{{ complaint.address }}</span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-2" *ngIf="complaint.phone">
              <span class="text-white/50">Phone</span><span class="text-white">{{ complaint.phone }}</span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-2">
              <span class="text-white/50">Issue</span><span class="text-white">{{ complaint.issue }}</span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-2" *ngIf="complaint.details">
              <span class="text-white/50">Details</span><span class="text-white text-right max-w-xs">{{ complaint.details }}</span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-2">
              <span class="text-white/50">Date</span><span class="text-white">{{ complaint.complaint_date }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-white/50">Status</span>
              <app-status-badge [status]="complaint.status || 'Active'"></app-status-badge>
            </div>
          </div>
        </app-card>

        <div class="text-center mt-6">
          <a routerLink="/" class="btn-secondary">Back to Home</a>
        </div>
      </div>
    </section>
  `,
})
export class ViewComplaintComponent implements OnInit {
  complaint: Complaint | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private supabase: SupabaseService) {}

  async ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (!code) {
      this.loading = false;
      return;
    }
    try {
      // Try direct owner/gov select by code first (richer data), fall back to public RPC.
      const { data } = await this.supabase.client
        .from('amrit_complaints')
        .select('*')
        .eq('code', code)
        .maybeSingle();

      if (data) {
        this.complaint = data as Complaint;
      } else {
        this.complaint = await this.supabase.getComplaintByCode(code);
      }
    } catch {
      try {
        this.complaint = await this.supabase.getComplaintByCode(code);
      } catch {
        this.complaint = null;
      }
    } finally {
      this.loading = false;
    }
  }
}
