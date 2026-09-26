import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../core/models';
import { DashThemeService } from '../../../core/dash-theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <header class="topbar-shell h-16 flex items-center justify-between px-4 md:px-6 backdrop-blur-lg sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <button *ngIf="showSidebarToggle" (click)="toggleSidebar.emit()"
                class="md:hidden topbar-icon p-2 -ml-2">
          <span class="text-xl">☰</span>
        </button>
        <a routerLink="/" class="flex items-center gap-2">
          <span class="text-2xl">💧</span>
          <span class="dash-text font-bold text-lg tracking-tight hidden sm:inline">Amrit Yatra</span>
        </a>
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        <div class="relative" *ngIf="showThemeSwitcher">
          <button (click)="themeMenuOpen = !themeMenuOpen; menuOpen = false" class="topbar-icon p-2 flex items-center gap-1" title="Dashboard theme">
            <span class="text-lg">🎨</span>
          </button>
          <div *ngIf="themeMenuOpen" class="absolute right-0 mt-2 w-56 glass-card py-3 px-3 text-sm z-40">
            <div class="dash-text-muted text-xs uppercase tracking-wide mb-2 px-1">Dashboard Theme</div>
            <button
              *ngFor="let opt of themeService.options"
              (click)="selectTheme(opt.id)"
              class="w-full flex items-center gap-3 px-2 py-2 rounded-lg dash-text hover:opacity-80 transition-opacity"
              [class.dash-soft]="themeService.theme() === opt.id"
            >
              <span class="w-6 h-6 rounded-full flex-shrink-0" [style.background]="opt.swatch"></span>
              <span class="flex-1 text-left">{{ opt.label }}</span>
              <span *ngIf="themeService.theme() === opt.id">✓</span>
            </button>
          </div>
        </div>

        <button class="topbar-icon relative p-2" title="Notifications">
          <span class="text-lg">🔔</span>
          <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
        </button>

        <div class="relative">
          <button (click)="menuOpen = !menuOpen; themeMenuOpen = false" class="flex items-center gap-2 dash-text">
            <span class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-navy-950 font-bold text-sm">
              {{ initials }}
            </span>
            <span class="hidden md:inline text-sm font-medium">{{ profile?.name || 'Account' }}</span>
          </button>
          <div *ngIf="menuOpen"
               class="absolute right-0 mt-2 w-48 glass-card py-2 text-sm z-40">
            <div class="px-4 py-2 dash-text-muted text-xs uppercase tracking-wide">{{ profile?.role }}</div>
            <button (click)="logout.emit()" class="w-full text-left px-4 py-2 dash-text hover:opacity-80">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar-shell {
      background: var(--topbar-bg, rgba(10, 20, 40, 0.8));
      border-bottom: 1px solid var(--topbar-border, rgba(255, 255, 255, 0.1));
    }
    .topbar-icon {
      color: var(--text-muted);
    }
    .topbar-icon:hover {
      color: var(--text-primary);
    }
  `],
})
export class TopbarComponent {
  @Input() profile: Profile | null = null;
  @Input() showSidebarToggle = false;
  @Input() showThemeSwitcher = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  menuOpen = false;
  themeMenuOpen = false;

  constructor(protected themeService: DashThemeService) {}

  selectTheme(id: Parameters<DashThemeService['setTheme']>[0]) {
    this.themeService.setTheme(id);
    this.themeMenuOpen = false;
  }

  get initials(): string {
    const n = this.profile?.name || 'U';
    return n
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
