import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { SupabaseService } from '../../core/supabase.service';
import { PublicStats } from '../../core/models';

@Component({
  selector: 'app-water-status',
  standalone: true,
  imports: [CommonModule, StatCardComponent, BackButtonComponent],
  template: `
    <section class="max-w-5xl mx-auto px-4 py-16">
      <app-back-button></app-back-button>
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">Water Status Overview</h1>
        <p class="text-white/60">Aggregate complaint statistics across the portal.</p>
      </div>

      <div *ngIf="loading" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="skeleton h-32"></div>
        <div class="skeleton h-32"></div>
        <div class="skeleton h-32"></div>
        <div class="skeleton h-32"></div>
      </div>

      <div *ngIf="!loading && stats" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 0ms">
          <app-stat-card label="Total Complaints" [value]="stats.total_complaints" icon="📋" gradient="from-teal-500 to-cyan-500"></app-stat-card>
        </div>
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 60ms">
          <app-stat-card label="Active" [value]="stats.active_count" icon="⏳" gradient="from-amber-500 to-orange-500"></app-stat-card>
        </div>
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 120ms">
          <app-stat-card label="Resolved" [value]="stats.resolved_count" icon="✅" gradient="from-green-500 to-emerald-500"></app-stat-card>
        </div>
        <div class="animate-fade-in-up hover-lift" style="animation-delay: 180ms">
          <app-stat-card label="No Water Supply" [value]="stats.no_water_supply_count" icon="🚱" gradient="from-red-500 to-rose-500"></app-stat-card>
        </div>
      </div>

      <div *ngIf="!loading && !stats" class="empty-state">
        <span class="text-4xl mb-3">📉</span>
        <p>Statistics are temporarily unavailable. Please check back later.</p>
      </div>
    </section>
  `,
})
export class WaterStatusComponent implements OnInit {
  stats: PublicStats | null = null;
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      this.stats = (await this.supabase.getPublicStats()) as PublicStats;
    } catch {
      this.stats = null;
    } finally {
      this.loading = false;
    }
  }
}
