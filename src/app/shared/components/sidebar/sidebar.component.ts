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
      class="sidebar-shell h-full flex flex-col transition-all duration-300 shadow-2xl"
      [class.w-64]="!collapsed"
      [class.w-20]="collapsed"
    >
      <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        @for (item of items; track item.link) {
          <a
            [routerLink]="item.link"
            routerLinkActive="sidebar-link-active"
            class="sidebar-link flex items-center gap-3 px-3 py-3 rounded-xl transition-colors border-l-4 border-transparent"
          >
            <span class="text-xl w-6 text-center">{{ item.icon }}</span>
            <span *ngIf="!collapsed" class="text-sm font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>
      <button
        (click)="toggle()"
        class="sidebar-collapse-btn m-2 p-2 rounded-lg text-sm hidden md:block"
      >
        {{ collapsed ? '»' : '« Collapse' }}
      </button>
    </aside>
  `,
  styles: [`
    .sidebar-shell {
      background: var(--sidebar-bg, #0a1428);
      border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    .sidebar-link {
      color: var(--sidebar-text-muted, rgba(255, 255, 255, 0.6));
    }
    .sidebar-link:hover {
      color: var(--sidebar-text, #ffffff);
      background: rgba(255, 255, 255, 0.08);
    }
    .sidebar-link-active {
      color: var(--sidebar-text, #ffffff) !important;
      background: var(--sidebar-active-bg, rgba(255, 255, 255, 0.15)) !important;
      border-left-color: var(--accent, #2dd4bf) !important;
    }
    .sidebar-collapse-btn {
      color: var(--sidebar-text-muted, rgba(255, 255, 255, 0.5));
    }
    .sidebar-collapse-btn:hover {
      color: var(--sidebar-text, #ffffff);
      background: rgba(255, 255, 255, 0.08);
    }
  `],
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
        { label: 'Water News', icon: '📰', link: '/news' },
      ];
    }
    return [
      { label: 'Dashboard', icon: '🏠', link: '/dashboard' },
      { label: 'File Complaint', icon: '📝', link: '/complaint' },
      { label: 'Track Complaint', icon: '🔍', link: '/track-complaint' },
      { label: 'Report Emergency', icon: '🚨', link: '/report-emergency' },
      { label: 'Water Status', icon: '📈', link: '/water-status' },
      { label: 'Water News', icon: '📰', link: '/news' },
    ];
  }
}
