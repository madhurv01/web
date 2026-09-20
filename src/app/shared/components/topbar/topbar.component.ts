import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../core/models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <header class="h-16 flex items-center justify-between px-4 md:px-6 bg-navy-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <button *ngIf="showSidebarToggle" (click)="toggleSidebar.emit()"
                class="md:hidden text-white/80 hover:text-white p-2 -ml-2">
          <span class="text-xl">☰</span>
        </button>
        <a routerLink="/" class="flex items-center gap-2">
          <span class="text-2xl">💧</span>
          <span class="text-white font-bold text-lg tracking-tight hidden sm:inline">Amrit Yatra</span>
        </a>
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        <button class="text-white/70 hover:text-white relative p-2" title="Notifications">
          <span class="text-lg">🔔</span>
          <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
        </button>

        <div class="relative">
          <button (click)="menuOpen = !menuOpen" class="flex items-center gap-2 text-white/90 hover:text-white">
            <span class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-navy-950 font-bold text-sm">
              {{ initials }}
            </span>
            <span class="hidden md:inline text-sm font-medium">{{ profile?.name || 'Account' }}</span>
          </button>
          <div *ngIf="menuOpen"
               class="absolute right-0 mt-2 w-48 glass-card !bg-navy-900 py-2 text-sm z-40">
            <div class="px-4 py-2 text-white/50 text-xs uppercase tracking-wide">{{ profile?.role }}</div>
            <button (click)="logout.emit()" class="w-full text-left px-4 py-2 text-white/90 hover:bg-white/10">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() profile: Profile | null = null;
  @Input() showSidebarToggle = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  menuOpen = false;

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
