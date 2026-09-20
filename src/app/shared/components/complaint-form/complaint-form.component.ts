import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISSUE_OPTIONS } from '../../../core/models';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
      <div>
        <label class="block text-white/80 text-sm font-medium mb-1.5">Full Name</label>
        <input class="input-field" formControlName="name" placeholder="Your full name" />
        <p class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">Name is required.</p>
      </div>

      <div>
        <label class="block text-white/80 text-sm font-medium mb-1.5">Address</label>
        <input class="input-field" formControlName="address" placeholder="Village / Ward / District" />
        <p class="field-error" *ngIf="form.get('address')?.touched && form.get('address')?.invalid">Address is required.</p>
      </div>

      <div>
        <label class="block text-white/80 text-sm font-medium mb-1.5">Phone Number</label>
        <input class="input-field" formControlName="phone" placeholder="10-digit mobile number" />
        <p class="field-error" *ngIf="form.get('phone')?.touched && form.get('phone')?.invalid">
          Enter a valid 10-digit phone number.
        </p>
      </div>

      <div>
        <label class="block text-white/80 text-sm font-medium mb-1.5">Nature of Issue</label>
        <select class="input-field" formControlName="issue" [class.opacity-60]="lockIssue">
          <option value="" disabled>Select Issue</option>
          @for (opt of issueOptions; track opt) {
            <option [value]="opt">{{ opt }}</option>
          }
        </select>
        <p class="field-error" *ngIf="form.get('issue')?.touched && form.get('issue')?.invalid">Please select an issue.</p>
      </div>

      <div>
        <label class="block text-white/80 text-sm font-medium mb-1.5">Complaint Details</label>
        <textarea class="input-field" rows="4" formControlName="details" placeholder="Describe the issue in detail (min. 10 characters)"></textarea>
        <p class="field-error" *ngIf="form.get('details')?.touched && form.get('details')?.invalid">
          Please provide at least 10 characters of detail.
        </p>
      </div>

      <div>
        <label class="block text-white/80 text-sm font-medium mb-1.5">Date of Issue</label>
        <input class="input-field" type="date" formControlName="complaint_date" />
        <p class="field-error" *ngIf="form.get('complaint_date')?.touched && form.get('complaint_date')?.invalid">
          Date is required.
        </p>
      </div>

      <p class="field-error" *ngIf="errorMessage">{{ errorMessage }}</p>

      <button type="submit" class="btn-primary w-full" [disabled]="submitting">
        {{ submitting ? 'Submitting…' : submitLabel }}
      </button>
    </form>
  `,
})
export class ComplaintFormComponent implements OnInit {
  @Input() lockIssue?: string;
  @Input() submitLabel = 'Submit Complaint';
  @Input() submitting = false;
  @Input() errorMessage: string | null = null;

  @Output() formSubmit = new EventEmitter<{
    name: string;
    address: string;
    phone: string;
    issue: string;
    details: string;
    complaint_date: string;
  }>();

  issueOptions = ISSUE_OPTIONS;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    issue: ['', Validators.required],
    details: ['', [Validators.required, Validators.minLength(10)]],
    complaint_date: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.lockIssue) {
      this.form.patchValue({ issue: this.lockIssue });
      this.form.get('issue')?.disable();
    }
    const today = new Date().toISOString().slice(0, 10);
    if (!this.form.get('complaint_date')?.value) {
      this.form.patchValue({ complaint_date: today });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.formSubmit.emit({
      name: value.name!,
      address: value.address!,
      phone: value.phone!,
      issue: value.issue!,
      details: value.details!,
      complaint_date: value.complaint_date!,
    });
  }
}
