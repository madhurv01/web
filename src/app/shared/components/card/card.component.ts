import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="glass-card p-6 md:p-8" [class.max-w-lg]="narrow" [class.mx-auto]="narrow">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() narrow = false;
}
