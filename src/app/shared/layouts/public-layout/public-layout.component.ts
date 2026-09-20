import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { SupabaseService } from '../../../core/supabase.service';
import { Profile } from '../../../core/models';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TopbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-navy-950 via-[#0d1b3a] to-[#0a2438] text-white">
      <app-topbar [profile]="profile" (logout)="onLogout()"></app-topbar>
      <main class="flex-1">
        <router-outlet />
      </main>
      <footer class="border-t border-white/10 py-8 px-4 text-center text-white/50 text-sm">
        <div class="flex flex-wrap justify-center gap-6 mb-3">
          <a routerLink="/" class="hover:text-white">Home</a>
          <a routerLink="/about" class="hover:text-white">About</a>
          <a routerLink="/track-complaint" class="hover:text-white">Track Complaint</a>
          <a routerLink="/water-status" class="hover:text-white">Water Status</a>
        </div>
        © 2026 Amrit Yatra, Government of India — Ministry of Jal Shakti
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  profile: Profile | null = null;
  private sub?: Subscription;

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit(): void {
    this.profile = this.supabase.currentProfile;
    this.sub = this.supabase.profile$.subscribe((p) => (this.profile = p));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async onLogout() {
    await this.supabase.signOut();
    this.router.navigateByUrl('/');
  }
}
