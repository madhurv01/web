import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SupabaseService } from '../../../core/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardComponent],
  template: `
    <section class="max-w-md mx-auto px-4 py-16">
      <app-card>
        <div class="text-center mb-6">
          <span class="text-3xl">💧</span>
          <h1 class="text-2xl font-bold text-white mt-2">Sign into your account</h1>
          <p class="text-white/50 text-sm mt-1">Citizen login — Amrit Yatra</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">Email</label>
            <input class="input-field" type="email" formControlName="email" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">Password</label>
            <input class="input-field" type="password" formControlName="password" placeholder="••••••••" />
          </div>

          <p class="field-error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <button type="submit" class="btn-primary w-full" [disabled]="loading || form.invalid">
            {{ loading ? 'Signing in…' : 'Login' }}
          </button>
        </form>

        <p class="text-center text-white/50 text-sm mt-6">
          New here? <a routerLink="/register" class="text-teal-300 hover:underline">Create an account</a>
        </p>
        <p class="text-center text-white/40 text-xs mt-2">
          Government official? <a routerLink="/gov-login" class="text-teal-300 hover:underline">Government Login</a>
        </p>
      </app-card>
    </section>
  `,
})
export class LoginComponent {
  loading = false;
  errorMessage: string | null = null;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private supabase: SupabaseService, private router: Router) {}

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = null;
    try {
      const { email, password } = this.form.getRawValue();
      await this.supabase.signIn(email!, password!);
      const profile = this.supabase.currentProfile;
      if (profile?.role === 'government') {
        this.router.navigateByUrl('/gov-dashboard');
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    } catch (e: any) {
      this.errorMessage = e?.message || 'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }
}
