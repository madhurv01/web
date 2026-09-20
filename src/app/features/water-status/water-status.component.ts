import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { SupabaseService } from '../../core/supabase.service';
import { PublicStats } from '../../core/models';

@Component({
  selector: 'app-water-status',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <section class="max-w-5xl mx-auto px-4 py-16">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">Water Status Overview</h1>
        <p class="text-white/60">Aggregate complaint statistics across the portal.</p>
      </div>

      <div *ngIf="loading" class="text-center text-white/60">Loading statistics…</div>

      <div *ngIf="!loading && stats" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card label="Total Complaints" [value]="stats.total_complaints" icon="📋" gradient="from-teal-500 to-cyan-500"></app-stat-card>
        <app-stat-card label="Active" [value]="stats.active_count" icon="⏳" gradient="from-amber-500 to-orange-500"></app-stat-card>
        <app-stat-card label="Resolved" [value]="stats.resolved_count" icon="✅" gradient="from-green-500 to-emerald-500"></app-stat-card>
        <app-stat-card label="No Water Supply" [value]="stats.no_water_supply_count" icon="🚱" gradient="from-red-500 to-rose-500"></app-stat-card>
      </div>

      <div *ngIf="!loading && !stats" class="text-center text-white/60">
        Statistics are temporarily unavailable. Please check back later.
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
