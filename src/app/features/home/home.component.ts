import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="auth-bg relative overflow-hidden">
      <div class="auth-bg-overlay"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/5"></div>
      <div class="max-w-6xl mx-auto px-4 py-24 md:py-32 relative grid md:grid-cols-2 gap-10 items-center">
        <div class="text-center md:text-left animate-fade-in-up">
          <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-300 text-sm font-medium mb-6">
            Ministry of Jal Shakti · Government of India
          </span>
          <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Har Ghar <span class="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">Jal</span>
          </h1>
          <p class="text-lg md:text-xl text-white/70 max-w-2xl mx-auto md:mx-0 mb-10">
            Ensuring safe and sustainable water supply to every household. Register a complaint, track its
            resolution, and help us build a healthier India — one drop at a time.
          </p>
          <div class="flex flex-wrap justify-center md:justify-start gap-4">
            <a routerLink="/complaint" class="btn-primary">Register a Complaint</a>
            <a routerLink="/track-complaint" class="btn-secondary">Track My Complaint</a>
          </div>
          <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <a routerLink="/login" class="text-white/70 hover:text-white text-sm underline underline-offset-4">Citizen Login</a>
            <a routerLink="/gov-login" class="text-white/70 hover:text-white text-sm underline underline-offset-4">Government Login</a>
          </div>
        </div>
        <div class="hidden md:flex justify-center animate-fade-in-up" style="animation-delay: 120ms">
          <model-viewer
            src="https://modelviewer.dev/shared-assets/models/sphere.glb"
            environment-image="neutral"
            exposure="1.1"
            shadow-intensity="1"
            class="water-droplet-model"
            alt="Rotating 3D model representing a drop of water"
            auto-rotate
            camera-controls
            disable-zoom
            rotation-per-second="14deg"
            style="width: 380px; height: 380px;"
          ></model-viewer>
        </div>
      </div>
    </section>

    <section class="py-16 border-t border-white/10">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <p class="text-4xl font-bold text-teal-300 mb-1">10M+</p>
          <p class="text-white/60 text-sm">Households Connected</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-teal-300 mb-1">95%</p>
          <p class="text-white/60 text-sm">Resolution Rate</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-teal-300 mb-1">24/7</p>
          <p class="text-white/60 text-sm">Support Available</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-teal-300 mb-1">500+</p>
          <p class="text-white/60 text-sm">Districts Covered</p>
        </div>
      </div>
    </section>

    <section class="py-16 border-t border-white/10">
      <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 0ms">
          <div class="text-3xl mb-3">📝</div>
          <h3 class="text-white font-semibold text-lg mb-2">File a Complaint</h3>
          <p class="text-white/60 text-sm">Report water supply issues in minutes — no login required.</p>
        </div>
        <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 80ms">
          <div class="text-3xl mb-3">🔍</div>
          <h3 class="text-white font-semibold text-lg mb-2">Track Progress</h3>
          <p class="text-white/60 text-sm">Use your complaint code to check status anytime, anywhere.</p>
        </div>
        <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 160ms">
          <div class="text-3xl mb-3">🚨</div>
          <h3 class="text-white font-semibold text-lg mb-2">Report Emergencies</h3>
          <p class="text-white/60 text-sm">Escalate urgent no-water situations directly to authorities.</p>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {}
