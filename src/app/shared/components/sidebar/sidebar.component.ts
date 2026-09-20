import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../../core/models';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside
      class="bg-navy-950/95 border-r border-white/10 h-full flex flex-col transition-all duration-300"
      [class.w-64]="!collapsed"
      [class.w-20]="collapsed"
    >
      <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        @for (item of items; track item.link) {
          <a
            [routerLink]="item.link"
            routerLinkActive="bg-gradient-to-r from-teal-500/25 to-cyan-500/10 text-white border-l-4 border-teal-400"
            class="flex items-center gap-3 px-3 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors border-l-4 border-transparent"
          >
            <span class="text-xl w-6 text-center">{{ item.icon }}</span>
            <span *ngIf="!collapsed" class="text-sm font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>
      <button
        (click)="toggle()"
        class="m-2 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 text-sm hidden md:block"
      >
        {{ collapsed ? '»' : '« Collapse' }}
      </button>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() role: UserRole = 'citizen';
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  toggle() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  get items(): NavItem[] {
    if (this.role === 'government') {
      return [
        { label: 'Dashboard', icon: '🏛️', link: '/gov-dashboard' },
        { label: 'Complaints', icon: '📋', link: '/gov-dashboard/complaints' },
        { label: 'Track a Complaint', icon: '🔍', link: '/track-complaint' },
        { label: 'Water Status', icon: '📈', link: '/water-status' },
      ];
    }
    return [
      { label: 'Dashboard', icon: '🏠', link: '/dashboard' },
      { label: 'File Complaint', icon: '📝', link: '/complaint' },
      { label: 'Track Complaint', icon: '🔍', link: '/track-complaint' },
      { label: 'Report Emergency', icon: '🚨', link: '/report-emergency' },
      { label: 'Water Status', icon: '📈', link: '/water-status' },
    ];
  }
}
