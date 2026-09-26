import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintFormComponent } from '../../shared/components/complaint-form/complaint-form.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { SupabaseService } from '../../core/supabase.service';

@Component({
  selector: 'app-report-emergency',
  standalone: true,
  imports: [ComplaintFormComponent, CardComponent, BackButtonComponent],
  template: `
    <section class="max-w-2xl mx-auto px-4 py-12">
      <app-back-button></app-back-button>
      <div class="text-center mb-8">
        <span class="inline-block px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-semibold mb-4">
          🚨 Emergency Reporting
        </span>
        <h1 class="text-3xl font-bold text-white mb-2">Report a No-Water-Supply Emergency</h1>
        <p class="text-white/60">This is escalated for priority attention by local authorities.</p>
      </div>
      <app-card>
        <app-complaint-form
          lockIssue="No Water Supply"
          submitLabel="Report Emergency"
          [submitting]="submitting"
          [errorMessage]="errorMessage"
          (formSubmit)="onSubmit($event)"
        ></app-complaint-form>
      </app-card>
    </section>
  `,
})
export class ReportEmergencyComponent {
  submitting = false;
  errorMessage: string | null = null;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onSubmit(value: any) {
    this.submitting = true;
    this.errorMessage = null;
    try {
      const complaint = await this.supabase.createComplaint({ ...value, issue: 'No Water Supply' });
      this.router.navigate(['/view-complaint', complaint.code]);
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to submit report. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
