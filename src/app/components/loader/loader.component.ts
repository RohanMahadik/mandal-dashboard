import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 1. SLIM TOP ROUTE PROGRESS BAR (Visible during fast route changes) -->
    @if (loading.isTopBarLoading()) {
      <div class="fixed top-0 left-0 right-0 z-[100] h-1.5 overflow-hidden bg-amber-950/20 pointer-events-none">
        <div class="h-full w-full bg-gradient-to-r from-amber-500 via-yellow-300 to-orange-600 animate-top-shimmer"></div>
      </div>
    }

    <!-- 2. ATTRACTIVE CULTURAL FULL-SCREEN LOADER -->
    <div
      class="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[#090d16]/90 backdrop-blur-md transition-all duration-500 select-none px-4"
      [class.opacity-100]="loading.isFullscreenLoading()"
      [class.pointer-events-auto]="loading.isFullscreenLoading()"
      [class.opacity-0]="!loading.isFullscreenLoading()"
      [class.pointer-events-none]="!loading.isFullscreenLoading()"
      [class.scale-100]="loading.isFullscreenLoading()"
      [class.scale-105]="!loading.isFullscreenLoading()"
      aria-live="polite"
      role="status"
    >
      <!-- Background Ambient Glow & Starry Particles -->
      <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-600/30 via-orange-500/20 to-yellow-500/15 blur-3xl pointer-events-none animate-pulse-glow"></div>

      <!-- MAIN LOADER CARD / HUB -->
      <div class="relative flex flex-col items-center max-w-sm w-full z-10 text-center">
        
        <!-- Sacred Emblem & Dual Concentric Rotating Rings -->
        <div class="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-5">
          
          <!-- Outer Rotating Sunburst Mandala Ring -->
          <svg class="absolute inset-0 w-full h-full text-amber-500/40 animate-spin-slow pointer-events-none" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"/>
            <circle cx="100" cy="100" r="82" stroke="url(#goldGrad)" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 12"/>
            <!-- 12 Sacred Ray Points -->
            @for (i of [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]; track i) {
              <line
                [attr.x1]="100 + 82 * Math.cos(i * Math.PI / 180)"
                [attr.y1]="100 + 82 * Math.sin(i * Math.PI / 180)"
                [attr.x2]="100 + 94 * Math.cos(i * Math.PI / 180)"
                [attr.y2]="100 + 94 * Math.sin(i * Math.PI / 180)"
                stroke="#f59e0b"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            }
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="50%" stop-color="#fde047"/>
                <stop offset="100%" stop-color="#ea580c"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- Middle Counter-Rotating Lotus Petal Accent Ring -->
          <svg class="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] text-orange-400/50 animate-spin-reverse pointer-events-none" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="70" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.8"/>
            <circle cx="90" cy="90" r="76" stroke="#fde047" stroke-width="1" stroke-dasharray="2 10" opacity="0.9"/>
          </svg>

          <!-- Pulsing Warm Saffron Aura -->
          <div class="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-600 blur-md opacity-75 animate-pulse"></div>

          <!-- Official Mandal Central Emblem with Gold Border -->
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.6)] ring-2 ring-amber-300/80 overflow-hidden shrink-0 animate-float-slow">
            <img
              src="logo.jpg"
              alt="श्री अष्टविनायक मित्र मंडळ लोगो"
              class="w-full h-full object-cover rounded-full"
            />
          </div>

        </div>

        <!-- Sacred Calligraphy Chant (Shimmer Gold) -->
        <h2 class="text-xl sm:text-2xl font-black font-devanagari tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-orange-400 animate-shimmer-text drop-shadow-md leading-tight">
          {{ loading.primaryMessage() }}
        </h2>

        <!-- Organization Name -->
        <div class="text-xs sm:text-sm font-bold text-amber-200/90 font-devanagari mt-1 tracking-wide">
          श्री अष्टविनायक मित्र मंडळ, जोगेश्वरी (पश्चिम)
        </div>

        <!-- Prominent Cultural Loading Bar with Active Glow -->
        <div class="w-56 sm:w-64 h-2.5 bg-slate-950/90 rounded-full overflow-hidden border border-amber-500/50 my-4 shadow-inner relative">
          <!-- Background track shimmer -->
          <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/20 to-amber-500/10 animate-pulse"></div>
          <!-- Moving active golden loading beam -->
          <div class="animate-cultural-loader h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]"></div>
        </div>

        <!-- Submessage / Dynamic Status Tracker -->
        <div class="flex items-center gap-1.5 text-xs text-amber-300/80 font-devanagari">
          <span>{{ loading.subMessage() }}</span>
          <span class="inline-flex gap-1 text-amber-400 font-bold">
            <span class="animate-bounce delay-75">•</span>
            <span class="animate-bounce delay-150">•</span>
            <span class="animate-bounce delay-300">•</span>
          </span>
        </div>

        <!-- Cultural Tagline -->
        <div class="text-[10px] sm:text-[11px] text-amber-500/70 font-devanagari mt-3 font-semibold tracking-wider">
          ॥ परंपरेचा वारसा आम्ही जपतो ॥
        </div>

      </div>
    </div>
  `
})
export class LoaderComponent {
  readonly loading = inject(LoadingService);
  readonly Math = Math;
}
