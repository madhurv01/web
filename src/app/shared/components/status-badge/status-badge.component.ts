import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" [ngClass]="classes">
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dotClasses"></span>
      {{ status }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status = 'Active';

  get classes(): string {
    switch (this.status) {
      case 'Active':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'In Progress':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Resolved':
        return 'bg-green-500/15 text-green-400 border border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/15 text-red-400 border border-red-500/30';
      default:
        return 'bg-white/10 text-white border border-white/20';
    }
  }

  get dotClasses(): string {
    switch (this.status) {
      case 'Active':
        return 'bg-amber-400';
      case 'In Progress':
        return 'bg-blue-400';
      case 'Resolved':
        return 'bg-green-400';
      case 'Rejected':
        return 'bg-red-400';
      default:
        return 'bg-white';
    }
  }
}
