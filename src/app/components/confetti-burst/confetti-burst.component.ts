import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  effect,
  inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  gravity: number;
  drag: number;
  alpha: number;
  decay: number;
  wobble: number;
  wobbleSpeed: number;
}

@Component({
  selector: 'app-confetti-burst',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas
      #confettiCanvas
      class="pointer-events-none fixed inset-0 z-[9999] w-full h-full transition-opacity duration-500"
      [class.opacity-0]="!isActive()"
      [class.opacity-100]="isActive()"
      aria-hidden="true"
    ></canvas>
  `
})
export class ConfettiBurstComponent implements AfterViewInit, OnDestroy {
  @ViewChild('confettiCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() autoFire = true;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly loadingService = inject(LoadingService);
  readonly isActive = signal<boolean>(false);
  private readonly viewReady = signal<boolean>(false);
  private hasAutoFired = false;

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private animationFrameId: number | null = null;
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private resizeHandler: (() => void) | null = null;
  private canvasWidth = 0;
  private canvasHeight = 0;

  private readonly festivePalette = [
    '#f97316', // Saffron Orange
    '#eab308', // Marigold Gold
    '#fbbf24', // Bright Gold
    '#ef4444', // Kumkum Crimson
    '#ec4899', // Gulal Pink
    '#10b981', // Emerald Green
    '#3b82f6', // Royal Blue
    '#a855f7', // Festive Violet
    '#fde047', // Shimmer Yellow
    '#ffffff'  // Crisp White Sparkle
  ];

  constructor() {
    // Wait for both view initialization and splash screen dismissal before firing initial confetti
    effect(() => {
      if (
        this.autoFire &&
        !this.hasAutoFired &&
        this.viewReady() &&
        !this.loadingService.isFullscreenLoading()
      ) {
        this.hasAutoFired = true;
        const t = setTimeout(() => this.triggerBurst(), 160);
        this.timeouts.push(t);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.resizeCanvas();
    this.resizeHandler = () => this.resizeCanvas();
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.viewReady.set(true);
  }

  ngOnDestroy(): void {
    this.clearScheduledBursts();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (isPlatformBrowser(this.platformId) && this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  /**
   * Fires a multi-wave celebratory confetti show across the viewport.
   */
  public triggerBurst(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.clearScheduledBursts();
    this.resizeCanvas();

    const w = this.canvasWidth || window.innerWidth;
    const h = this.canvasHeight || window.innerHeight;
    const isMobile = w < 640;
    const scaleCount = isMobile ? 0.65 : 1;

    // Wave 1: Simultaneous left + right corner cannons & top celebration shower
    this.spawnCannon(w * 0.08, h * 0.72, -Math.PI / 3.1, Math.round(52 * scaleCount), isMobile ? 13 : 17);
    this.spawnCannon(w * 0.92, h * 0.72, -Math.PI + Math.PI / 3.1, Math.round(52 * scaleCount), isMobile ? 13 : 17);
    this.spawnShower(w * 0.5, h * 0.06, w * 0.85, Math.round(45 * scaleCount));

    // Wave 2: Dual mid-screen golden celebration bursts
    this.timeouts.push(
      setTimeout(() => {
        const cw = this.canvasWidth || window.innerWidth;
        const ch = this.canvasHeight || window.innerHeight;
        this.spawnRadialBurst(cw * 0.28, ch * 0.28, Math.round(36 * scaleCount));
        this.spawnRadialBurst(cw * 0.72, ch * 0.28, Math.round(36 * scaleCount));
      }, 420)
    );

    // Wave 3: Overhead falling marigold & gold ribbon confetti shower
    this.timeouts.push(
      setTimeout(() => {
        const cw = this.canvasWidth || window.innerWidth;
        this.spawnShower(cw * 0.5, -10, cw * 0.95, Math.round(60 * scaleCount));
      }, 950)
    );

    this.startLoop();
  }

  private clearScheduledBursts(): void {
    for (const id of this.timeouts) {
      clearTimeout(id);
    }
    this.timeouts = [];
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !isPlatformBrowser(this.platformId)) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;

    canvas.width = Math.floor(this.canvasWidth * dpr);
    canvas.height = Math.floor(this.canvasHeight * dpr);

    const context = canvas.getContext('2d');
    if (context) {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx = context;
    }
  }

  private createParticle(
    x: number,
    y: number,
    vx: number,
    vy: number,
    options?: { decay?: number; gravity?: number }
  ): ConfettiParticle {
    const rand = Math.random();
    const shape: 'rect' | 'circle' | 'star' =
      rand < 0.62 ? 'rect' : rand < 0.84 ? 'circle' : 'star';

    const color =
      this.festivePalette[Math.floor(Math.random() * this.festivePalette.length)];

    return {
      x,
      y,
      vx,
      vy,
      width: shape === 'rect' ? 7 + Math.random() * 6 : 5 + Math.random() * 4,
      height: shape === 'rect' ? 10 + Math.random() * 7 : 5 + Math.random() * 4,
      color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.22,
      tiltAngle: Math.random() * Math.PI * 2,
      tiltSpeed: 0.08 + Math.random() * 0.14,
      shape,
      gravity: options?.gravity ?? 0.26 + Math.random() * 0.1,
      drag: 0.982,
      alpha: 1,
      decay: options?.decay ?? 0.0055 + Math.random() * 0.004,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.06 + Math.random() * 0.06
    };
  }

  private spawnCannon(
    originX: number,
    originY: number,
    baseAngle: number,
    count: number,
    maxSpeed: number
  ): void {
    const spread = 0.68;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const speed = maxSpeed * (0.45 + Math.random() * 0.65);
      this.particles.push(
        this.createParticle(
          originX,
          originY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        )
      );
    }
  }

  private spawnRadialBurst(originX: number, originY: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      this.particles.push(
        this.createParticle(
          originX,
          originY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 2.5,
          { gravity: 0.22 }
        )
      );
    }
  }

  private spawnShower(
    centerX: number,
    y: number,
    spanWidth: number,
    count: number
  ): void {
    for (let i = 0; i < count; i++) {
      const x = centerX + (Math.random() - 0.5) * spanWidth;
      const vx = (Math.random() - 0.5) * 3.5;
      const vy = 1.5 + Math.random() * 4;
      this.particles.push(
        this.createParticle(x, y, vx, vy, {
          gravity: 0.14 + Math.random() * 0.08,
          decay: 0.0045 + Math.random() * 0.003
        })
      );
    }
  }

  private startLoop(): void {
    this.isActive.set(true);
    if (this.animationFrameId !== null) return;

    const tick = () => {
      if (!this.ctx) {
        this.animationFrameId = null;
        return;
      }

      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      const alive: ConfettiParticle[] = [];
      for (const p of this.particles) {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.85;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.tiltAngle += p.tiltSpeed;

        // Fade smoothly as particles finish falling or lose lifetime
        if (p.y > this.canvasHeight * 0.72) {
          p.alpha -= p.decay * 1.9;
        } else {
          p.alpha -= p.decay * 0.65;
        }

        if (p.alpha <= 0.02 || p.y > this.canvasHeight + 40) {
          continue;
        }

        alive.push(p);
        this.drawParticle(ctx, p);
      }

      this.particles = alive;

      if (this.particles.length > 0) {
        this.animationFrameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.animationFrameId = null;
        this.isActive.set(false);
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private drawParticle(ctx: CanvasRenderingContext2D, p: ConfettiParticle): void {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    // Pseudo-3D flutter along X axis
    const scaleX = Math.cos(p.tiltAngle);
    ctx.scale(Math.abs(scaleX) < 0.15 ? 0.15 : scaleX, 1);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    } else if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      this.drawStar(ctx, 0, 0, 4, p.width * 0.65, p.width * 0.28);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.closePath();
  }
}
