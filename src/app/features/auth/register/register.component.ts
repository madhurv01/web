import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SupabaseService } from '../../../core/supabase.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const rpw = control.get('repeatPassword')?.value;
  return pw && rpw && pw !== rpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardComponent],
  template: `
    <section class="max-w-md mx-auto px-4 py-16">
      <app-card>
        <div class="text-center mb-6">
          <span class="text-3xl">💧</span>
          <h1 class="text-2xl font-bold text-white mt-2">Create your account</h1>
          <p class="text-white/50 text-sm mt-1">Sign up as a citizen — Amrit Yatra</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">Name</label>
            <input class="input-field" formControlName="name" placeholder="Your full name" />
          </div>
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">Email</label>
            <input class="input-field" type="email" formControlName="email" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">Password</label>
            <input class="input-field" type="password" formControlName="password" placeholder="••••••••" />
            <p class="text-white/40 text-xs mt-1">At least 8 characters, including a number.</p>
          </div>
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">Repeat Password</label>
            <input class="input-field" type="password" formControlName="repeatPassword" placeholder="••••••••" />
            <p class="field-error" *ngIf="form.errors?.['mismatch'] && form.get('repeatPassword')?.touched">
              Passwords do not match.
            </p>
          </div>

          <p class="field-error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <button type="submit" class="btn-primary w-full" [disabled]="loading || form.invalid">
            {{ loading ? 'Creating account…' : 'Register' }}
          </button>
        </form>

        <p class="text-center text-white/50 text-sm mt-6">
          Already have an account? <a routerLink="/login" class="text-teal-300 hover:underline">Login</a>
        </p>
      </app-card>
    </section>
  `,
})
export class RegisterComponent {
  loading = false;
  errorMessage: string | null = null;

  private fb = inject(FormBuilder);

  form = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/)]],
      repeatPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  constructor(private supabase: SupabaseService, private router: Router) {}

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    try {
      const { name, email, password } = this.form.getRawValue();
      await this.supabase.signUp(email!, password!, name!, 'citizen');
      this.router.navigateByUrl('/dashboard');
    } catch (e: any) {
      this.errorMessage = e?.message || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
