import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-3">Amrit Yatra</h1>
        <p class="text-teal-300 text-lg">Flowing Toward Pure Water for All</p>
      </div>

      <div class="glass-card p-8">
        <h2 class="text-2xl font-bold text-teal-300 mb-3">Our Purpose</h2>
        <p class="text-white/70 leading-relaxed">
          Inspired by the <strong class="text-white">Jal Jeevan Mission</strong>, Amrit Yatra is a movement to
          ensure every Indian has access to safe, clean drinking water. We are on a quest to turn the vision of
          <em>Har Ghar Jal</em> into reality, delivering the nectar of life to every home.
        </p>
      </div>

      <div class="glass-card p-8">
        <h2 class="text-2xl font-bold text-teal-300 mb-6">The Challenge</h2>
        <div class="grid sm:grid-cols-3 gap-6 text-center">
          <div class="p-5 rounded-2xl bg-white/5">
            <p class="text-3xl font-bold text-white">70%</p>
            <p class="text-white/60 text-sm mt-2">of India's surface water is polluted</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/5">
            <p class="text-3xl font-bold text-white">37.7M</p>
            <p class="text-white/60 text-sm mt-2">people affected by waterborne diseases yearly</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/5">
            <p class="text-3xl font-bold text-white">60%</p>
            <p class="text-white/60 text-sm mt-2">of rural households lack piped water</p>
          </div>
        </div>
      </div>

      <div class="glass-card p-8">
        <h2 class="text-2xl font-bold text-teal-300 mb-3">Our Work</h2>
        <p class="text-white/70 leading-relaxed">
          We install sustainable water systems, combat pollution with innovative tech, and empower communities to
          preserve their water resources — building a healthier, stronger India, one drop at a time.
        </p>
      </div>
    </section>
  `,
})
export class AboutComponent {}
