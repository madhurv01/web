import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { SupabaseService } from '../../core/supabase.service';
import { Complaint, ComplaintStatus } from '../../core/models';

@Component({
  selector: 'app-gov-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, StatusBadgeComponent],
  template: `
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold dash-text mb-1">Panchayat Dashboard</h1>
      <p class="dash-text-muted mb-8">Manage and resolve citizen-reported water complaints.</p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 0ms">
          <app-stat-card label="Total Complaints" [value]="complaints.length" icon="📋" gradient="from-teal-500 to-cyan-500"></app-stat-card>
        </div>
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 60ms">
          <app-stat-card label="Active" [value]="countByStatus('Active')" icon="⏳" gradient="from-amber-500 to-orange-500"></app-stat-card>
        </div>
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 120ms">
          <app-stat-card label="Resolved" [value]="countByStatus('Resolved')" icon="✅" gradient="from-green-500 to-emerald-500"></app-stat-card>
        </div>
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 180ms">
          <app-stat-card label="No Water Supply" [value]="countNoWater()" icon="🚱" gradient="from-red-500 to-rose-500"></app-stat-card>
        </div>
      </div>

      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="dash-text font-semibold text-lg">All Complaints</h2>
          <button class="dash-code text-sm hover:underline transition-colors" (click)="load()" [disabled]="loading">
            {{ loading ? 'Refreshing…' : 'Refresh' }}
          </button>
        </div>

        <div *ngIf="loading" class="space-y-2">
          <div class="skeleton h-10 w-full"></div>
          <div class="skeleton h-10 w-full"></div>
          <div class="skeleton h-10 w-full"></div>
          <div class="skeleton h-10 w-full"></div>
        </div>
        <div *ngIf="errorMessage" class="field-error">{{ errorMessage }}</div>

        <div *ngIf="!loading && complaints.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left dash-text-muted border-b dash-border uppercase text-xs tracking-wide">
                <th class="py-2 pr-4">Code</th>
                <th class="py-2 pr-4">Name</th>
                <th class="py-2 pr-4">Phone</th>
                <th class="py-2 pr-4">Issue</th>
                <th class="py-2 pr-4">Date</th>
                <th class="py-2 pr-4">Status</th>
                <th class="py-2 pr-4">Update</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let c of complaints; let i = index"
                class="border-b dash-border dash-row-hover transition-colors animate-fade-in-up"
                [style.animation-delay.ms]="i * 30"
              >
                <td class="py-3 pr-4 font-mono dash-code">{{ c.code }}</td>
                <td class="py-3 pr-4 dash-text">{{ c.name }}</td>
                <td class="py-3 pr-4 dash-text">{{ c.phone }}</td>
                <td class="py-3 pr-4 dash-text">{{ c.issue }}</td>
                <td class="py-3 pr-4 dash-text">{{ c.complaint_date }}</td>
                <td class="py-3 pr-4"><app-status-badge [status]="c.status || 'Active'"></app-status-badge></td>
                <td class="py-3 pr-4">
                  <select
                    class="dash-soft border dash-border dash-text text-xs rounded-lg px-2 py-1.5 transition-all focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400"
                    [ngModel]="c.status"
                    (ngModelChange)="updateStatus(c, $event)"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!loading && complaints.length === 0" class="empty-state !py-10">
          <span class="text-4xl mb-3">📭</span>
          <p>No complaints found.</p>
        </div>
      </div>
    </div>
  `,
})
export class GovDashboardComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.loading = true;
    this.errorMessage = null;
    try {
      this.complaints = await this.supabase.getAllForGov();
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to load complaints.';
    } finally {
      this.loading = false;
    }
  }

  countByStatus(status: ComplaintStatus): number {
    return this.complaints.filter((c) => c.status === status).length;
  }

  countNoWater(): number {
    return this.complaints.filter((c) => c.issue === 'No Water Supply').length;
  }

  async updateStatus(c: Complaint, status: ComplaintStatus) {
    const prev = c.status;
    c.status = status;
    try {
      await this.supabase.updateStatus(c.id!, status);
    } catch (e: any) {
      c.status = prev;
      this.errorMessage = e?.message || 'Failed to update status.';
    }
  }
}
