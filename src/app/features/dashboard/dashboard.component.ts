import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { SupabaseService } from '../../core/supabase.service';
import { Complaint, Profile } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">
        Welcome, {{ profile?.name || 'Citizen' }} 👋
      </h1>
      <p class="text-white/60 mb-8">Here's a quick overview of your account.</p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <a routerLink="/complaint" class="glass-card p-6 hover:-translate-y-1 transition-transform block">
          <div class="text-3xl mb-3">📝</div>
          <h3 class="text-white font-semibold mb-1">File Complaint</h3>
          <p class="text-white/50 text-sm">Report a water issue</p>
        </a>
        <a routerLink="/track-complaint" class="glass-card p-6 hover:-translate-y-1 transition-transform block">
          <div class="text-3xl mb-3">🔍</div>
          <h3 class="text-white font-semibold mb-1">Track Complaint</h3>
          <p class="text-white/50 text-sm">Check status by code</p>
        </a>
        <a routerLink="/report-emergency" class="glass-card p-6 hover:-translate-y-1 transition-transform block">
          <div class="text-3xl mb-3">🚨</div>
          <h3 class="text-white font-semibold mb-1">Report Emergency</h3>
          <p class="text-white/50 text-sm">No water supply? Escalate now</p>
        </a>
        <a routerLink="/water-status" class="glass-card p-6 hover:-translate-y-1 transition-transform block">
          <div class="text-3xl mb-3">📈</div>
          <h3 class="text-white font-semibold mb-1">Water Status</h3>
          <p class="text-white/50 text-sm">View aggregate statistics</p>
        </a>
      </div>

      <div class="glass-card p-6">
        <h2 class="text-white font-semibold text-lg mb-4">My Complaints</h2>

        <div *ngIf="loading" class="text-white/50 text-sm">Loading…</div>

        <div *ngIf="!loading && complaints.length === 0" class="text-white/50 text-sm">
          You haven't filed any complaints yet.
        </div>

        <div *ngIf="!loading && complaints.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-white/50 border-b border-white/10">
                <th class="py-2 pr-4">Code</th>
                <th class="py-2 pr-4">Issue</th>
                <th class="py-2 pr-4">Date</th>
                <th class="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of complaints" class="border-b border-white/5 hover:bg-white/5">
                <td class="py-3 pr-4 font-mono text-teal-300">
                  <a [routerLink]="['/view-complaint', c.code]">{{ c.code }}</a>
                </td>
                <td class="py-3 pr-4 text-white">{{ c.issue }}</td>
                <td class="py-3 pr-4 text-white/70">{{ c.complaint_date }}</td>
                <td class="py-3 pr-4"><app-status-badge [status]="c.status || 'Active'"></app-status-badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  profile: Profile | null = null;
  complaints: Complaint[] = [];
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.profile = this.supabase.currentProfile;
    try {
      this.complaints = await this.supabase.getMineForUser();
    } finally {
      this.loading = false;
    }
  }
}
