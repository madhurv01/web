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
        return 'bg-amber-50 text-amber-700 border border-amber-300';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border border-blue-300';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-300';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  }

  get dotClasses(): string {
    switch (this.status) {
      case 'Active':
        return 'bg-amber-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Resolved':
        return 'bg-emerald-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  }
}
