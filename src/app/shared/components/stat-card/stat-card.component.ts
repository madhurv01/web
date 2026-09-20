import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div class="absolute inset-0 opacity-20 bg-gradient-to-br" [class]="gradient"></div>
      <div class="relative flex items-center justify-between">
        <div>
          <p class="text-white/60 text-sm font-medium">{{ label }}</p>
          <p class="text-3xl font-bold text-white mt-1">{{ value }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br"
             [class]="gradient">
          <span>{{ icon }}</span>
        </div>
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() icon = '📊';
  @Input() gradient = 'from-teal-500 to-cyan-500';
}
