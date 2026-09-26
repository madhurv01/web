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
      <h1 class="text-2xl md:text-3xl font-bold dash-text mb-1">
        Welcome, {{ profile?.name || 'Citizen' }} 👋
      </h1>
      <p class="dash-text-muted mb-8">Here's a quick overview of your account.</p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <a routerLink="/complaint" class="glass-card p-6 hover-lift block animate-fade-in-up" style="animation-delay: 0ms">
          <div class="text-3xl mb-3">📝</div>
          <h3 class="dash-text font-semibold mb-1">File Complaint</h3>
          <p class="dash-text-muted text-sm">Report a water issue</p>
        </a>
        <a routerLink="/track-complaint" class="glass-card p-6 hover-lift block animate-fade-in-up" style="animation-delay: 60ms">
          <div class="text-3xl mb-3">🔍</div>
          <h3 class="dash-text font-semibold mb-1">Track Complaint</h3>
          <p class="dash-text-muted text-sm">Check status by code</p>
        </a>
        <a routerLink="/report-emergency" class="glass-card p-6 hover-lift block animate-fade-in-up" style="animation-delay: 120ms">
          <div class="text-3xl mb-3">🚨</div>
          <h3 class="dash-text font-semibold mb-1">Report Emergency</h3>
          <p class="dash-text-muted text-sm">No water supply? Escalate now</p>
        </a>
        <a routerLink="/water-status" class="glass-card p-6 hover-lift block animate-fade-in-up" style="animation-delay: 180ms">
          <div class="text-3xl mb-3">📈</div>
          <h3 class="dash-text font-semibold mb-1">Water Status</h3>
          <p class="dash-text-muted text-sm">View aggregate statistics</p>
        </a>
      </div>

      <div class="glass-card p-6">
        <h2 class="dash-text font-semibold text-lg mb-4">My Complaints</h2>

        <div *ngIf="loading" class="space-y-2">
          <div class="skeleton h-10 w-full"></div>
          <div class="skeleton h-10 w-full"></div>
          <div class="skeleton h-10 w-full"></div>
        </div>

        <div *ngIf="!loading && complaints.length === 0" class="empty-state !py-10">
          <span class="text-4xl mb-3">💧</span>
          <p>You haven't filed any complaints yet.</p>
          <a routerLink="/complaint" class="btn-secondary mt-4">File your first complaint</a>
        </div>

        <div *ngIf="!loading && complaints.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left dash-text-muted border-b dash-border">
                <th class="py-2 pr-4">Code</th>
                <th class="py-2 pr-4">Issue</th>
                <th class="py-2 pr-4">Date</th>
                <th class="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let c of complaints; let i = index"
                class="border-b dash-border dash-row-hover transition-colors animate-fade-in-up"
                [style.animation-delay.ms]="i * 40"
              >
                <td class="py-3 pr-4 font-mono dash-code">
                  <a [routerLink]="['/view-complaint', c.code]" class="hover:underline">{{ c.code }}</a>
                </td>
                <td class="py-3 pr-4 dash-text">{{ c.issue }}</td>
                <td class="py-3 pr-4 dash-text">{{ c.complaint_date }}</td>
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
