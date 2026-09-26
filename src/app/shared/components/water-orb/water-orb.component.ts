import { Component, Input } from '@angular/core';

/**
 * A pure CSS/SVG animated water droplet, used in place of an external 3D
 * model asset. Renders identically everywhere (no mesh/material loading,
 * no dependency on a third-party glTF file) and reads as "water" at a
 * glance via shape + gradient + ripple animation rather than needing a
 * real modeled asset.
 */
@Component({
  selector: 'app-water-orb',
  standalone: true,
  template: `
    <div class="water-orb" [style.width.px]="size" [style.height.px]="size">
      <div class="water-orb-ripple r1"></div>
      <div class="water-orb-ripple r2"></div>
      <div class="water-orb-droplet"></div>
      <div class="water-orb-shadow"></div>
    </div>
  `,
  styles: [
    `
      .water-orb {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .water-orb-droplet {
        width: 58%;
        height: 58%;
        position: relative;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: linear-gradient(135deg, #a5f3fc 0%, #2dd4bf 45%, #0e7490 100%);
        box-shadow:
          0 30px 60px -15px rgba(45, 212, 191, 0.55),
          inset -10px -10px 22px rgba(0, 0, 0, 0.2),
          inset 8px 8px 16px rgba(255, 255, 255, 0.3);
        animation: water-orb-bob 4.5s ease-in-out infinite;
      }

      .water-orb-droplet::after {
        content: '';
        position: absolute;
        top: 22%;
        left: 20%;
        width: 26%;
        height: 16%;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        filter: blur(3px);
        transform: rotate(45deg);
      }

      .water-orb-ripple {
        position: absolute;
        inset: 8%;
        border: 2px solid rgba(45, 212, 191, 0.4);
        border-radius: 50%;
        animation: water-orb-ripple 3.5s ease-out infinite;
      }

      .water-orb-ripple.r2 {
        animation-delay: 1.75s;
      }

      .water-orb-shadow {
        position: absolute;
        bottom: 2%;
        left: 50%;
        width: 46%;
        height: 10%;
        background: radial-gradient(ellipse at center, rgba(45, 212, 191, 0.5), transparent 72%);
        border-radius: 50%;
        transform: translateX(-50%);
        animation: water-orb-shadow-pulse 4.5s ease-in-out infinite;
      }

      @keyframes water-orb-bob {
        0%,
        100% {
          transform: rotate(-45deg) translateY(0) scale(1);
        }
        50% {
          transform: rotate(-45deg) translateY(-14px) scale(1.03);
        }
      }

      @keyframes water-orb-ripple {
        0% {
          transform: scale(0.6);
          opacity: 0.55;
        }
        100% {
          transform: scale(1.6);
          opacity: 0;
        }
      }

      @keyframes water-orb-shadow-pulse {
        0%,
        100% {
          transform: translateX(-50%) scale(1);
          opacity: 0.7;
        }
        50% {
          transform: translateX(-50%) scale(0.8);
          opacity: 0.4;
        }
      }
    `,
  ],
})
export class WaterOrbComponent {
  @Input() size = 240;
}
