import { Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Reusable in-page "Back" control. Uses browser Location.back() when there is
 * history to go back to; otherwise navigates to fallbackRoute so deep-linked
 * pages never leave the user stuck or bounce them out of the app.
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="goBack()"
      class="group inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-4 transition-all duration-200 hover:-translate-x-0.5"
    >
      <span
        class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 group-hover:bg-white/15 group-hover:border-white/25"
        >←</span
      >
      @if (label) {
        <span>{{ label }}</span>
      }
    </button>
  `,
})
export class BackButtonComponent {
  @Input() label = 'Back';
  @Input() fallbackRoute = '/';

  private location = inject(Location);
  private router = inject(Router);

  goBack(): void {
    // window.history.length > 1 means there is somewhere within the app (or
    // referrer) to go back to; otherwise fall back to a safe in-app route.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.fallbackRoute);
    }
  }
}
