import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SupabaseService } from '../../../core/supabase.service';
import { Profile } from '../../../core/models';
import { routeAnimation } from '../../animations/route.animations';
import { DashThemeService } from '../../../core/dash-theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, NgIf, TopbarComponent, SidebarComponent],
  animations: [routeAnimation],
  template: `
    <div class="min-h-screen flex flex-col" [attr.data-dash-theme]="themeService.theme()">
      <app-topbar
        [profile]="profile"
        [showSidebarToggle]="true"
        [showThemeSwitcher]="true"
        (toggleSidebar)="mobileOpen = !mobileOpen"
        (logout)="onLogout()"
      ></app-topbar>
      <div class="flex flex-1 min-h-0">
        <div class="hidden md:block">
          <app-sidebar [role]="profile?.role || 'citizen'" [(collapsed)]="collapsed"></app-sidebar>
        </div>
        <div
          *ngIf="mobileOpen"
          class="fixed inset-0 z-40 md:hidden"
        >
          <div class="absolute inset-0 bg-black/60" (click)="mobileOpen = false"></div>
          <div class="relative w-64 h-full">
            <app-sidebar [role]="profile?.role || 'citizen'"></app-sidebar>
          </div>
        </div>
        <main class="flex-1 min-w-0 overflow-y-auto p-4 md:p-8" [@routeAnimation]="o.isActivated ? o.activatedRoute : ''">
          <router-outlet #o="outlet" />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  profile: Profile | null = null;
  collapsed = false;
  mobileOpen = false;
  private sub?: Subscription;

  constructor(private supabase: SupabaseService, private router: Router, protected themeService: DashThemeService) {}

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
