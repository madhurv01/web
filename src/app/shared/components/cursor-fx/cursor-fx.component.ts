import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

/**
 * Global custom cursor: a small dot that tracks the mouse instantly and a
 * trailing ring that eases toward it. Grows/brightens over interactive
 * elements. Automatically disabled on touch/coarse-pointer devices so it
 * never interferes with mobile UX, and is fully pointer-events:none so it
 * can never block clicks.
 */
@Component({
  selector: 'app-cursor-fx',
  standalone: true,
  template: `
    @if (enabled) {
      <div #dot class="cursor-fx-dot" [class.cursor-fx-active]="hovering"></div>
      <div #ring class="cursor-fx-ring" [class.cursor-fx-active]="hovering"></div>
    }
  `,
  styles: [
    `
      :host {
        pointer-events: none;
      }
      .cursor-fx-dot,
      .cursor-fx-ring {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
        border-radius: 9999px;
        will-change: transform;
        transform: translate(-50%, -50%);
      }
      .cursor-fx-dot {
        width: 8px;
        height: 8px;
        background: #2dd4bf;
        transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
      }
      .cursor-fx-ring {
        width: 32px;
        height: 32px;
        border: 1.5px solid rgba(45, 212, 191, 0.55);
        transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease;
      }
      .cursor-fx-dot.cursor-fx-active {
        width: 12px;
        height: 12px;
        background: #fbbf24;
      }
      .cursor-fx-ring.cursor-fx-active {
        width: 52px;
        height: 52px;
        border-color: rgba(251, 191, 36, 0.6);
        background: rgba(251, 191, 36, 0.08);
      }
    `,
  ],
})
export class CursorFxComponent implements OnInit, OnDestroy {
  @ViewChild('dot') dotRef?: ElementRef<HTMLDivElement>;
  @ViewChild('ring') ringRef?: ElementRef<HTMLDivElement>;

  enabled = false;
  hovering = false;

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private rafId: number | null = null;

  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    this.enabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (this.enabled) {
      document.documentElement.classList.add('has-custom-cursor');
      this.mouseX = this.ringX = window.innerWidth / 2;
      this.mouseY = this.ringY = window.innerHeight / 2;
      this.loop();
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    document.documentElement.classList.remove('has-custom-cursor');
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.enabled) return;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    const target = e.target as HTMLElement | null;
    this.hovering = !!target?.closest('button, a, input, textarea, select, [role="button"], .cursor-hover');
  }

  private loop = (): void => {
    // Lerp the ring toward the cursor for a soft trailing feel; the dot
    // tracks instantly for responsiveness.
    this.ringX += (this.mouseX - this.ringX) * 0.18;
    this.ringY += (this.mouseY - this.ringY) * 0.18;

    if (this.dotRef) {
      this.dotRef.nativeElement.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) translate(-50%, -50%)`;
    }
    if (this.ringRef) {
      this.ringRef.nativeElement.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}
