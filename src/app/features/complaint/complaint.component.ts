import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintFormComponent } from '../../shared/components/complaint-form/complaint-form.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { SupabaseService } from '../../core/supabase.service';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [ComplaintFormComponent, CardComponent, BackButtonComponent],
  template: `
    <section class="max-w-2xl mx-auto px-4 py-12">
      <app-back-button></app-back-button>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold dash-text mb-2">File a Water Sanitation Complaint</h1>
        <p class="dash-text-muted">Tell us what's wrong — we'll route it to your local authority.</p>
      </div>
      <app-card>
        <app-complaint-form
          [submitting]="submitting"
          [errorMessage]="errorMessage"
          submitLabel="Submit Complaint"
          (formSubmit)="onSubmit($event)"
        ></app-complaint-form>
      </app-card>
    </section>
  `,
})
export class ComplaintComponent {
  submitting = false;
  errorMessage: string | null = null;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onSubmit(value: any) {
    this.submitting = true;
    this.errorMessage = null;
    try {
      const complaint = await this.supabase.createComplaint(value);
      this.router.navigate(['/view-complaint', complaint.code]);
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to submit complaint. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
