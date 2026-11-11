import { Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';
import { ConfettiBurstComponent } from '../../components/confetti-burst/confetti-burst.component';
import { BestSabhasadShowcaseComponent } from '../../components/best-sabhasad-showcase/best-sabhasad-showcase.component';

@Component({
  selector: 'app-sarvotkrusht-sabhasad',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfettiBurstComponent, BestSabhasadShowcaseComponent],
  template: `
    <div class="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      <!-- Auto-Fires Confetti Burst When Page Opens -->
      <app-confetti-burst #confetti [autoFire]="true"></app-confetti-burst>

      <!-- ================= TOP CELEBRATORY BANNER ================= -->
      <div class="bg-gradient-to-r from-[#7f1d1d] via-[#b91c1c] to-[#d97706] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-amber-400/40">
        <!-- Decorative Radial Glows -->
        <div class="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-yellow-300/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl"></div>

        <div class="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
          <div class="relative shrink-0">
            <img src="logo.jpg" alt="Mandal Logo" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-amber-300 shadow-xl" />
            <span class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-base shadow-md border-2 border-white">
              🏆
            </span>
          </div>

          <div class="flex-1">
            <!-- Navigation Actions -->
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <a
                routerLink="/"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 hover:text-white border border-white/25 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
                title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
              >
                <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
              </a>

              <a
                routerLink="/about"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 hover:text-white border border-amber-300/40 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer"
              >
                <span>👥</span>
                <span>{{ mandalData.t('सर्व सभासद यादी पहा', 'View All Members') }}</span>
              </a>

              <button
                type="button"
                (click)="replayCelebration()"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 border border-yellow-200 text-xs font-black font-devanagari transition shadow-md active:scale-95 cursor-pointer"
              >
                <span [class.animate-bounce]="isCelebrating()">🎉</span>
                <span>{{ mandalData.t('कॉन्फेटी पुन्हा उडवा!', 'Replay Confetti!') }}</span>
              </button>
            </div>

            <div class="flex items-center justify-center sm:justify-start gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <span>✨</span>
              <span>{{ mandalData.t('मंडळ वार्षिक गौरव पुरस्कार • २०२६', 'Mandal Annual Honor Awards • 2026') }}</span>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black font-devanagari mt-1 text-white drop-shadow-sm">
              {{ mandalData.t('सर्वोत्कृष्ट सभासद २०२६', 'Sarvotkrusht Sabhasad 2026') }}
            </h1>

            <div class="text-amber-100 text-xs sm:text-sm font-semibold mt-1 font-devanagari">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ • शिव स्फूर्ती, आदर्श नगर, जोगेश्वरी (पश्चिम), मुंबई - ४०० १०२', 'Shree Ashtavinayak Mitra Mandal • Shiv Sphurti, Adarsh Nagar, Jogeshwari (W), Mumbai - 400102') }}
            </div>

            <p class="text-yellow-200 text-xs sm:text-sm mt-1.5 font-bold font-devanagari">
              {{ mandalData.t('॥ उत्कृष्ट सेवा, शिस्त, नेतृत्व व उत्सवांमधील अखंड योगदानाचा सार्थ सन्मान ॥', '॥ Celebrating Exemplary Service, Leadership & Wholehearted Dedication ॥') }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= MAIN HONORED MEMBERS SHOWCASE ================= -->
      <app-best-sabhasad-showcase
        [showMembersLink]="true"
        (celebrate)="replayCelebration()"
      ></app-best-sabhasad-showcase>

      <!-- ================= AWARD HIGHLIGHTS & APPRECIATION NOTES ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 sm:p-5 flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl shrink-0 border border-rose-200">
            🔱
          </div>
          <div>
            <h3 class="font-black text-slate-900 text-sm font-devanagari">
              {{ mandalData.t('नवरात्र उत्सव २०२६ गौरव', 'Navratri Utsav 2026 Honor') }}
            </h3>
            <p class="text-xs text-slate-600 font-devanagari mt-1 leading-relaxed">
              {{ mandalData.t('श्री. रोहन महाडिक यांनी नवरात्रौत्सवात दाखवलेली तत्परता, वेळेचे नियोजन आणि उत्साही सेवा मंडळासाठी आदर्शवत ठरली.', 'Shri Rohan Mahadik demonstrated outstanding punctuality, coordination, and energetic service throughout Navratri Utsav 2026.') }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 sm:p-5 flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0 border border-amber-200">
            🪔
          </div>
          <div>
            <h3 class="font-black text-slate-900 text-sm font-devanagari">
              {{ mandalData.t('गणेश उत्सव २०२६ गौरव', 'Ganesh Utsav 2026 Honor') }}
            </h3>
            <p class="text-xs text-slate-600 font-devanagari mt-1 leading-relaxed">
              {{ mandalData.t('श्री. अक्षय उजवणे यांनी सार्वजनिक गणेशोत्सवात केलेले शिस्तबद्ध व्यवस्थापन, जबाबदारीची जाणीव व निस्वार्थ योगदान अत्यंत मोलाचे ठरले.', 'Shri Akshay Ujavane stood out for disciplined management, reliability, and selfless dedication throughout Ganesh Utsav 2026.') }}
            </p>
          </div>
        </div>

        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-300 shadow-sm p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
              🎊
            </div>
            <div>
              <h3 class="font-black text-amber-950 text-sm font-devanagari">
                {{ mandalData.t('मंडळ परिवारातर्फे शुभेच्छा', 'Wishes from Mandal Family') }}
              </h3>
              <p class="text-xs text-amber-900/80 font-devanagari mt-1 leading-relaxed">
                {{ mandalData.t('दोन्ही विजेत्या सभासदांचे श्री अष्टविनायक मित्र मंडळ परिवारातर्फे मनःपूर्वक अभिनंदन!', 'Heartfelt congratulations to both winners from the entire Shree Ashtavinayak Mitra Mandal family!') }}
              </p>
            </div>
          </div>

          <button
            type="button"
            (click)="replayCelebration()"
            class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:from-[#c2410c] hover:to-[#b45309] text-white font-black text-xs font-devanagari shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>🥳</span>
            <span>{{ mandalData.t('दोन्ही विजेत्यांचे अभिनंदन करा!', 'Send Congratulations & Confetti!') }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SarvotkrushtSabhasadComponent {
  readonly mandalData = inject(MandalDataService);
  readonly isCelebrating = signal<boolean>(false);

  @ViewChild('confetti') confettiComponent?: ConfettiBurstComponent;

  replayCelebration(): void {
    this.isCelebrating.set(true);
    this.confettiComponent?.triggerBurst();
    setTimeout(() => this.isCelebrating.set(false), 1200);
  }
}

