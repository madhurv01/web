import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/supabase.service';
import { friendlyAuthError } from '../../../shared/utils/auth-error';
import { WaterOrbComponent } from '../../../shared/components/water-orb/water-orb.component';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const rpw = control.get('repeatPassword')?.value;
  return pw && rpw && pw !== rpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, WaterOrbComponent],
  template: `
    <section class="auth-bg min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      <div class="relative hidden md:flex items-center justify-center overflow-hidden">
        <div class="auth-bg-overlay"></div>
        <div class="auth-blob auth-blob-1"></div>
        <div class="auth-blob auth-blob-2"></div>
        <div class="relative z-10 text-center px-10">
          <app-water-orb [size]="240" />
          <h2 class="text-2xl font-bold text-white mt-4">Join Amrit Yatra</h2>
          <p class="text-white/70 mt-2 max-w-xs mx-auto">
            Create an account to file complaints, track resolutions and get emergency alerts.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center px-4 py-16">
        @if (registered) {
          <div class="w-full max-w-md glass-card p-8 text-center animate-fade-in-up">
            <span class="text-4xl">📩</span>
            <h1 class="text-2xl font-bold text-white mt-3">Check your email</h1>
            <p class="text-white/60 text-sm mt-2">
              We've sent a confirmation link to your inbox. Confirm your email, then come back and log in.
            </p>
            <a routerLink="/login" class="btn-primary inline-block mt-6">Go to login</a>
          </div>
        } @else {
        <div class="w-full max-w-md glass-card p-6 md:p-8 animate-fade-in-up">
          <div class="text-center mb-6">
            <span class="text-3xl">💧</span>
            <h1 class="text-2xl font-bold text-white mt-2">Create your account</h1>
            <p class="text-white/50 text-sm mt-1">Sign up as a citizen — Amrit Yatra</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">Name</label>
              <input
                class="input-field"
                formControlName="name"
                placeholder="Your full name"
                (blur)="form.get('name')?.markAsTouched()"
              />
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="field-error">Name is required.</p>
              }
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">Email</label>
              <input
                class="input-field"
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                (blur)="form.get('email')?.markAsTouched()"
              />
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="field-error">Enter a valid email address.</p>
              }
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">Password</label>
              <div class="relative">
                <input
                  class="input-field pr-12"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  (blur)="form.get('password')?.markAsTouched()"
                />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 px-3 text-white/50 hover:text-white text-sm"
                  tabindex="-1"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <p class="field-error">At least 8 characters, including a number.</p>
              } @else {
                <p class="text-white/40 text-xs mt-1">At least 8 characters, including a number.</p>
              }
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-1.5">Repeat Password</label>
              <input
                class="input-field"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="repeatPassword"
                placeholder="••••••••"
                (blur)="form.get('repeatPassword')?.markAsTouched()"
              />
              @if (form.errors?.['mismatch'] && form.get('repeatPassword')?.touched) {
                <p class="field-error">Passwords do not match.</p>
              }
            </div>

            @if (errorMessage) {
              <p class="field-error">{{ errorMessage }}</p>
            }

            <button type="submit" class="btn-primary w-full" [disabled]="loading || form.invalid">
              @if (loading) {
                <span class="spinner"></span>
              }
              {{ loading ? 'Creating account…' : 'Register' }}
            </button>
          </form>

          <p class="text-center text-white/50 text-sm mt-6">
            Already have an account? <a routerLink="/login" class="text-teal-300 hover:underline">Login</a>
          </p>
        </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .auth-blob {
        position: absolute;
        border-radius: 9999px;
        filter: blur(60px);
        opacity: 0.35;
        animation: blob-float 12s ease-in-out infinite;
      }
      .auth-blob-1 {
        width: 320px;
        height: 320px;
        background: #2dd4bf;
        top: -60px;
        left: -60px;
      }
      .auth-blob-2 {
        width: 280px;
        height: 280px;
        background: #fbbf24;
        bottom: -60px;
        right: -40px;
        animation-delay: -6s;
      }
      @keyframes blob-float {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        50% {
          transform: translate(30px, -20px) scale(1.08);
        }
      }
    `,
  ],
})
export class RegisterComponent {
  loading = false;
  errorMessage: string | null = null;
  showPassword = false;
  registered = false;

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
      const { session } = await this.supabase.signUp(email!, password!, name!, 'citizen');
      if (session) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.registered = true;
      }
    } catch (e: any) {
      this.errorMessage = friendlyAuthError(e, 'Registration failed. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
