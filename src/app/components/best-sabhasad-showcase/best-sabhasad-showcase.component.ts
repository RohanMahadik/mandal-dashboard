import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

export interface BestSabhasadHonoree {
  id: string;
  festivalMr: string;
  festivalEn: string;
  festivalIcon: string;
  awardMr: string;
  awardEn: string;
  nameMr: string;
  nameEn: string;
  initial: string;
  subtitleMr: string;
  subtitleEn: string;
  photoPath: string;
  cardTheme: 'navratri' | 'ganesh';
}

@Component({
  selector: 'app-best-sabhasad-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      class="relative overflow-hidden rounded-2xl border-2 border-amber-300/90 bg-gradient-to-br from-[#fffaf0] via-[#fff3d6] to-[#ffe8c2] shadow-lg p-3.5 sm:p-5 md:p-6 animate-fade-in"
      [attr.aria-label]="mandalData.t('सर्वोत्कृष्ट सभासद २०२६ सन्मान', 'Best Sabhasad Awards 2026')"
    >
      <!-- Subtle Decorative Background Mandalas / Confetti Accents -->
      <div class="pointer-events-none absolute -top-14 -right-14 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl"></div>
      <div class="pointer-events-none absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-red-500/10 blur-2xl"></div>

      <!-- Festive Top Shimmer Accent Bar -->
      <div class="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#991b1b] via-[#f97316] to-[#991b1b]"></div>

      <!-- Section Header -->
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 text-white shadow-md border-2 border-white flex items-center justify-center text-2xl shrink-0 animate-float-slow">
            🏆
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#991b1b] text-amber-200 text-[10px] sm:text-[11px] font-black tracking-wide uppercase shadow-2xs mb-1">
              <span>✨</span>
              <span>{{ mandalData.t('मंडळ विशेष सन्मान सोहळा • २०२६', 'Mandal Special Honor • 2026') }}</span>
            </div>
            <h2 class="text-lg sm:text-2xl font-black font-devanagari text-[#7f1d1d] leading-tight">
              {{ mandalData.t('सर्वोत्कृष्ट सभासद २०२६', 'Sarvotkrusht Sabhasad 2026') }}
            </h2>
            <p class="text-[11px] sm:text-xs text-amber-900/80 font-devanagari font-semibold mt-0.5">
              {{ mandalData.t('गणेशोत्सव व नवरात्रौत्सव २०२६ मधील उल्लेखनीय कार्य व निस्वार्थ सहभागाबद्दल विशेष गौरव', 'Honoring exemplary dedication, leadership & selfless service in Utsav 2026') }}
            </p>
          </div>
        </div>

        <!-- Celebrate Again + Sabhasad List Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="onCelebrateClick()"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#eab308] hover:from-[#c2410c] hover:to-[#ca8a04] text-white font-black text-xs font-devanagari shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-amber-200"
          >
            <span class="text-sm" [class.animate-bounce]="justCelebrated()">🎉</span>
            <span>{{ mandalData.t('अभिनंदन / पुन्हा सेलिब्रेट करा', 'Celebrate!') }}</span>
          </button>

          @if (showMembersLink) {
            <a
              routerLink="/about"
              class="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-[#991b1b] border border-amber-300 font-bold text-xs font-devanagari shadow-xs transition cursor-pointer"
            >
              <span>👥</span>
              <span>{{ mandalData.t('सर्व सभासद', 'All Members') }}</span>
            </a>
          }
        </div>
      </div>

      <!-- 2 Winner Spotlight Cards Grid -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        @for (winner of winners; track winner.id) {
          <article
            class="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border-2 flex flex-col sm:flex-row items-center sm:items-stretch p-4 sm:p-4.5 gap-4"
            [ngClass]="
              winner.cardTheme === 'navratri'
                ? 'border-rose-300/90 hover:border-rose-500 bg-gradient-to-br from-white via-rose-50/40 to-amber-50/60'
                : 'border-amber-300/90 hover:border-orange-500 bg-gradient-to-br from-white via-amber-50/45 to-orange-50/60'
            "
          >
            <!-- Top Corner Crown Ribbon -->
            <div
              class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black font-devanagari shadow-xs border flex items-center gap-1"
              [ngClass]="
                winner.cardTheme === 'navratri'
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              "
            >
              <span>👑</span>
              <span>{{ mandalData.t('विजेता २०२६', 'Winner 2026') }}</span>
            </div>

            <!-- Portrait Photo Frame -->
            <div class="relative shrink-0 flex flex-col items-center justify-center pt-1 sm:pt-0">
              <!-- Outer Festive Aura Ring -->
              <div
                class="p-1 rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-[1.03]"
                [ngClass]="
                  winner.cardTheme === 'navratri'
                    ? 'bg-gradient-to-tr from-[#991b1b] via-[#e11d48] to-[#fbbf24]'
                    : 'bg-gradient-to-tr from-[#c2410c] via-[#f97316] to-[#facc15]'
                "
              >
                <div class="w-28 h-32 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-xl overflow-hidden bg-slate-900 relative flex items-center justify-center border-2 border-white">
                  <!-- Initial Fallback Behind Image -->
                  <span class="absolute inset-0 flex items-center justify-center font-devanagari font-black text-3xl text-amber-200 select-none">
                    {{ winner.initial }}
                  </span>

                  @if (!erroredPhotos()[winner.id]) {
                    <img
                      [src]="winner.photoPath"
                      [alt]="mandalData.isEnglish() ? winner.nameEn : winner.nameMr"
                      (error)="onPhotoError($event, winner.id)"
                      loading="eager"
                      class="relative z-10 w-full h-full object-cover object-top"
                    />
                  }
                </div>
              </div>

              <!-- Small Trophy Badge Overlapping Bottom Center of Photo -->
              <div
                class="-mt-3 relative z-20 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-md border border-white flex items-center gap-1"
                [ngClass]="
                  winner.cardTheme === 'navratri'
                    ? 'bg-gradient-to-r from-[#991b1b] to-[#be123c]'
                    : 'bg-gradient-to-r from-[#ea580c] to-[#d97706]'
                "
              >
                <span>🏅</span>
                <span>{{ mandalData.t('सर्वोत्कृष्ट', 'Best') }}</span>
              </div>
            </div>

            <!-- Honoree Details -->
            <div class="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-center space-y-1.5 sm:pr-6">
              <!-- Festival Category Pill -->
              <div class="flex justify-center sm:justify-start">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black font-devanagari shadow-2xs border"
                  [ngClass]="
                    winner.cardTheme === 'navratri'
                      ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white border-rose-400'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300'
                  "
                >
                  <span>{{ winner.festivalIcon }}</span>
                  <span>{{ mandalData.isEnglish() ? winner.festivalEn : winner.festivalMr }}</span>
                </span>
              </div>

              <!-- Award Name -->
              <div class="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 font-devanagari">
                {{ mandalData.isEnglish() ? winner.awardEn : winner.awardMr }}
              </div>

              <!-- Winner Full Name -->
              <h3 class="text-xl sm:text-2xl font-black font-devanagari text-slate-900 leading-snug tracking-tight">
                {{ mandalData.isEnglish() ? winner.nameEn : winner.nameMr }}
              </h3>

              <!-- Dual Script Helper -->
              <div class="text-xs font-semibold text-slate-500">
                {{ mandalData.isEnglish() ? winner.nameMr : winner.nameEn }}
              </div>

              <!-- Appreciative Citation -->
              <p class="text-xs font-devanagari text-slate-700 leading-relaxed pt-0.5">
                {{ mandalData.isEnglish() ? winner.subtitleEn : winner.subtitleMr }}
              </p>

              <!-- Festive Bottom Strip -->
              <div class="pt-1.5 flex items-center justify-center sm:justify-start gap-2 text-[11px] font-bold text-amber-800 font-devanagari">
                <span>🎊 {{ mandalData.t('हार्दिक अभिनंदन व पुढील कार्यास शुभेच्छा!', 'Heartiest Congratulations!') }}</span>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class BestSabhasadShowcaseComponent {
  readonly mandalData = inject(MandalDataService);

  @Input() showMembersLink = true;
  @Output() celebrate = new EventEmitter<void>();

  readonly justCelebrated = signal<boolean>(false);
  readonly erroredPhotos = signal<Record<string, boolean>>({});

  readonly winners: BestSabhasadHonoree[] = [
    {
      id: 'navratri-2026-rohan',
      festivalMr: 'नवरात्र उत्सव २०२६',
      festivalEn: 'Navratri Utsav 2026',
      festivalIcon: '🔱',
      awardMr: 'सर्वोत्कृष्ट सभासद सन्मान',
      awardEn: 'Best Sabhasad Award',
      nameMr: 'श्री. रोहन महाडिक',
      nameEn: 'Shri Rohan Mahadik',
      initial: 'रो',
      subtitleMr: 'नवरात्रौत्सवातील उत्कृष्ट नियोजन, अखंड कार्यतत्परता व मंडळाप्रती समर्पित सेवेबद्दल विशेष गौरव.',
      subtitleEn: 'Honored for outstanding organization, round-the-clock dedication, and committed service during Navratri Utsav 2026.',
      photoPath: '/Sabhasad/Rohan%20Mahadik.jpeg',
      cardTheme: 'navratri'
    },
    {
      id: 'ganesh-2026-akshay',
      festivalMr: 'गणेश उत्सव २०२६',
      festivalEn: 'Ganesh Utsav 2026',
      festivalIcon: '🪔',
      awardMr: 'सर्वोत्कृष्ट सभासद सन्मान',
      awardEn: 'Best Sabhasad Award',
      nameMr: 'श्री. अक्षय उजवणे',
      nameEn: 'Shri Akshay Ujavane',
      initial: 'अ',
      subtitleMr: 'सार्वजनिक गणेशोत्सवातील शिस्तबद्ध व्यवस्थापन, उत्साही पुढाकार व निस्वार्थ योगदानाबद्दल विशेष गौरव.',
      subtitleEn: 'Honored for disciplined management, energetic leadership, and selfless contribution during Ganesh Utsav 2026.',
      photoPath: '/Sabhasad/Akshay%20Ujawne.jpeg',
      cardTheme: 'ganesh'
    }
  ];

  onCelebrateClick(): void {
    this.justCelebrated.set(true);
    this.celebrate.emit();
    setTimeout(() => this.justCelebrated.set(false), 1200);
  }

  onPhotoError(event: Event, winnerId: string): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;

    if (!img.dataset['retried']) {
      img.dataset['retried'] = '1';
      if (img.src.includes('/Sabhasad/')) {
        img.src = img.src.replace('/Sabhasad/', '/sabhasad/');
        return;
      }
    }

    this.erroredPhotos.update(curr => ({ ...curr, [winnerId]: true }));
  }
}
