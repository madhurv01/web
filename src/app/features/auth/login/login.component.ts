import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/supabase.service';
import { friendlyAuthError } from '../../../shared/utils/auth-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="auth-bg min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      <!-- Decorative / 3D side -->
      <div class="relative hidden md:flex items-center justify-center overflow-hidden">
        <div class="auth-bg-overlay"></div>
        <div class="auth-blob auth-blob-1"></div>
        <div class="auth-blob auth-blob-2"></div>
        <div class="relative z-10 text-center px-10">
          <model-viewer
            src="https://modelviewer.dev/shared-assets/models/sphere.glb"
            environment-image="neutral"
            exposure="1.1"
            shadow-intensity="1"
            class="water-droplet-model"
            alt="Rotating water droplet"
            auto-rotate
            camera-controls
            disable-zoom
            rotation-per-second="18deg"
            style="width: 280px; height: 280px; margin: 0 auto;"
          ></model-viewer>
          <h2 class="text-2xl font-bold text-white mt-4">Welcome back to Amrit Yatra</h2>
          <p class="text-white/70 mt-2 max-w-xs mx-auto">
            Track water complaints, report emergencies and stay informed — all in one place.
          </p>
        </div>
      </div>

      <!-- Form side -->
      <div class="flex items-center justify-center px-4 py-16">
        <div class="w-full max-w-md glass-card p-6 md:p-8 animate-fade-in-up">
          <div class="text-center mb-6">
            <span class="text-3xl">💧</span>
            <h1 class="text-2xl font-bold text-white mt-2">Sign into your account</h1>
            <p class="text-white/50 text-sm mt-1">Citizen login — Amrit Yatra</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
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
                <p class="field-error">Password is required.</p>
              }
            </div>

            @if (errorMessage) {
              <p class="field-error">{{ errorMessage }}</p>
            }

            <button type="submit" class="btn-primary w-full" [disabled]="loading || form.invalid">
              @if (loading) {
                <span class="spinner"></span>
              }
              {{ loading ? 'Signing in…' : 'Login' }}
            </button>
          </form>

          <p class="text-center text-white/50 text-sm mt-6">
            New here? <a routerLink="/register" class="text-teal-300 hover:underline">Create an account</a>
          </p>
          <p class="text-center text-white/40 text-xs mt-2">
            Government official? <a routerLink="/gov-login" class="text-teal-300 hover:underline">Government Login</a>
          </p>
        </div>
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
export class LoginComponent {
  loading = false;
  errorMessage: string | null = null;
  showPassword = false;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private supabase: SupabaseService, private router: Router) {}

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
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
      this.errorMessage = friendlyAuthError(e, 'Login failed. Please check your credentials.');
    } finally {
      this.loading = false;
    }
  }
}
