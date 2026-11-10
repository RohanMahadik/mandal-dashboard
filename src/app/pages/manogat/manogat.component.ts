import { Component, inject, signal, computed, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

export interface DignitaryMessage {
  id: string;
  tabLabelMr: string;
  tabLabelEn: string;
  badgeMr: string;
  badgeEn: string;
  icon: string;
  nameMr: string;
  nameEn: string;
  designationMr: string;
  designationEn: string;
  organizationMr: string;
  organizationEn: string;
  areaMr: string;
  areaEn: string;
  photoUrl: string;
  avatarBg: string;
  initial: string;
  tenureMr: string;
  tenureEn: string;
  leadQuoteMr: string;
  leadQuoteEn: string;
  greetingMr: string;
  greetingEn: string;
  paragraphsMr: string[];
  paragraphsEn: string[];
  signatureName: string;
  signTitleMr: string;
  signTitleEn: string;
}

@Component({
  selector: 'app-manogat',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      <!-- Top Cultural Banner -->
      <div class="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden border border-amber-600/30">
        <div class="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
          <img src="logo.jpg" alt="Logo" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-amber-400 shadow-xl shrink-0" />
          <div class="flex-1">
            <!-- Back to Dashboard Button -->
            <a
              routerLink="/"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 hover:text-white border border-white/20 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
              title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
            >
              <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
            </a>

            <div class="flex items-center justify-center sm:justify-start gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>●</span>
              <span>{{ mandalData.t('संस्थेचे विचार व संदेश (स्थापना १९९७)', 'Mandal Vision & Dignitary Messages (Est. 1997)') }}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black font-devanagari mt-1 text-white drop-shadow-sm">
              {{ mandalData.t('मनोगत व शुभेच्छा संदेश', "Reflections & Good Wishes") }}
            </h1>
            <div class="text-amber-200 text-xs sm:text-sm font-semibold mt-1 font-devanagari">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ • शिव स्फूर्ती, आदर्श नगर, जोगेश्वरी (पश्चिम), मुंबई - ४०० १०२', 'Shree Ashtavinayak Mitra Mandal • Shiv Sphurti, Adarsh Nagar, Jogeshwari (W), Mumbai - 400102') }}
            </div>
            <p class="text-amber-100 text-xs sm:text-sm mt-1.5 font-bold font-devanagari">
              {{ mandalData.t('॥ परंपरेचा वारसा आम्ही जपतो, विघ्नहर्ताचा गजर आम्ही करतो ॥', '॥ Preserving Cultural Heritage & Devotion to Lord Ganesha ॥') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Dignitary Quick Selector Ribbon (अध्यक्ष + ५ सन्माननीय मान्यवर) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        @for (d of dignitaries; track d.id; let idx = $index) {
          <button
            (click)="goToSlide(idx)"
            class="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer text-left shadow-2xs hover:shadow-md"
            [ngClass]="currentSlideIndex() === idx
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-500 ring-2 ring-amber-400/50 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'"
            [title]="mandalData.isEnglish() ? d.nameEn : d.nameMr"
          >
            <img
              [src]="d.photoUrl"
              [alt]="d.nameMr"
              class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover object-top border border-amber-300 shadow-2xs shrink-0"
            />
            <div class="min-w-0 flex-1">
              <div class="text-[11px] sm:text-xs font-black font-devanagari truncate" [ngClass]="currentSlideIndex() === idx ? 'text-amber-950 font-bold' : 'text-slate-800'">
                {{ mandalData.isEnglish() ? d.tabLabelEn : d.tabLabelMr }}
              </div>
              <div class="text-[9.5px] sm:text-[10px] text-amber-800 font-semibold truncate font-devanagari">
                {{ d.icon }} {{ mandalData.isEnglish() ? d.badgeEn : d.badgeMr }}
              </div>
            </div>
          </button>
        }
      </div>

      <!-- Mobile Navigation Bar (Arrows & Counter Shown Above Slider on Mobile) -->
      <div class="flex sm:hidden items-center justify-between bg-white rounded-2xl p-2.5 px-3.5 border-2 border-amber-300 shadow-sm">
        <div class="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <span class="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-700 to-amber-700 text-white font-mono text-xs font-black shadow-2xs shrink-0">
            {{ mandalData.formatNum(currentSlideIndex() + 1) }} / {{ mandalData.formatNum(dignitaries.length) }}
          </span>
          <span class="font-devanagari font-black text-xs text-slate-900 truncate">
            {{ dignitaries[currentSlideIndex()].icon }} {{ mandalData.isEnglish() ? dignitaries[currentSlideIndex()].tabLabelEn : dignitaries[currentSlideIndex()].tabLabelMr }}
          </span>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            (click)="prevSlide()"
            class="w-9 h-9 rounded-xl bg-slate-100 active:bg-amber-100 text-slate-800 active:text-amber-900 border border-slate-300 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95"
            [title]="mandalData.t('मागील संदेश', 'Previous Message')"
            aria-label="Previous Slide"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>

          <button
            (click)="nextSlide()"
            class="w-9 h-9 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 text-white active:scale-95 flex items-center justify-center transition cursor-pointer shadow-xs"
            [title]="mandalData.t('पुढील संदेश', 'Next Message')"
            aria-label="Next Slide"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <!-- ================= SWIPER SLIDER VIEWPORT ================= -->
      <div
        class="relative overflow-hidden rounded-3xl border-2 border-amber-300/80 shadow-md bg-white select-none group"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
        (mousedown)="onMouseDown($event)"
        (mouseup)="onMouseUp($event)"
        (mouseenter)="pauseAutoSlide()"
        (mouseleave)="resumeAutoSlide()"
      >
        <!-- Top Animated Gold Progress Bar -->
        <div class="w-full bg-amber-100 h-1.5 relative overflow-hidden">
          <div
            class="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 h-full transition-all duration-500 ease-out"
            [style.width.%]="((currentSlideIndex() + 1) / dignitaries.length) * 100"
          ></div>
        </div>

        <!-- Floating Left Arrow (Desktop / Tablet) -->
        <button
          (click)="prevSlide()"
          class="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-amber-900 hover:text-red-700 border-2 border-amber-300 shadow-xl items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
          [title]="mandalData.t('मागील संदेश', 'Previous Message')"
          aria-label="Previous Message"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <!-- Floating Right Arrow (Desktop / Tablet) -->
        <button
          (click)="nextSlide()"
          class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-amber-900 hover:text-red-700 border-2 border-amber-300 shadow-xl items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
          [title]="mandalData.t('पुढील संदेश', 'Next Message')"
          aria-label="Next Message"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>

        <!-- Swiper Slides Horizontal Flex Track -->
        <div
          class="flex transition-transform duration-500 ease-out will-change-transform"
          [style.transform]="'translateX(-' + (currentSlideIndex() * 100) + '%)'"
        >
          @for (current of dignitaries; track current.id; let idx = $index) {
            <div class="min-w-full w-full shrink-0 p-4 sm:p-7 md:p-9 space-y-6 sm:space-y-8">
              
              <!-- Top Sacred Inscription / Slogan -->
              <div class="text-center border-b border-amber-200/80 pb-4 sm:pb-5">
                <div class="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-300 text-amber-950 font-black text-xs sm:text-sm font-devanagari shadow-2xs">
                  <span>{{ current.icon }}</span>
                  <span>{{ mandalData.isEnglish() ? current.greetingEn : current.greetingMr }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                
                <!-- LEFT COLUMN: Dignified Person Profile Card (4 Columns) -->
                <div class="lg:col-span-4 flex flex-col items-center text-center bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50 p-5 sm:p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4">
                  
                  <!-- Portrait Frame with Cultural Ring -->
                  <div class="relative group">
                    <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-2 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-xl ring-4 ring-amber-400/40 overflow-hidden flex items-center justify-center">
                      @if (current.photoUrl) {
                        <img
                          [src]="current.photoUrl"
                          [alt]="current.nameMr + ' - ' + current.designationMr"
                          class="w-full h-full object-cover object-top rounded-2xl transition duration-500 group-hover:scale-105"
                        />
                      } @else {
                        <div
                          class="w-full h-full rounded-2xl flex flex-col items-center justify-center text-white font-black text-4xl shadow-inner font-devanagari"
                          [style.backgroundColor]="current.avatarBg"
                        >
                          <span>{{ current.initial }}</span>
                          <span class="text-xs font-normal opacity-70 tracking-widest mt-1">{{ current.icon }}</span>
                        </div>
                      }
                    </div>
                    
                    <!-- Floating Role Pill -->
                    <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-red-700 to-amber-800 text-white font-black text-[11px] sm:text-xs shadow-md border border-amber-300 whitespace-nowrap font-devanagari">
                      {{ mandalData.isEnglish() ? current.badgeEn : current.badgeMr }}
                    </div>
                  </div>

                  <!-- Identity & Details -->
                  <div class="pt-3 space-y-1.5 w-full">
                    <div class="text-[10.5px] uppercase font-extrabold tracking-wider text-amber-800 font-sans">
                      {{ mandalData.t('सन्माननीय मान्यवर', 'Respected Dignitary') }}
                    </div>
                    <h3 class="text-lg sm:text-xl font-black text-[#991b1b] font-devanagari leading-snug">
                      {{ mandalData.isEnglish() ? current.nameEn : current.nameMr }}
                    </h3>
                    <div class="text-xs font-bold text-slate-800 font-devanagari">
                      {{ mandalData.isEnglish() ? current.designationEn : current.designationMr }}
                    </div>
                    <div class="text-[11px] text-slate-600 font-semibold font-devanagari">
                      {{ mandalData.isEnglish() ? current.organizationEn : current.organizationMr }}
                    </div>
                    <div class="text-xs text-slate-500 font-medium font-devanagari">
                      📍 {{ mandalData.isEnglish() ? current.areaEn : current.areaMr }}
                    </div>
                  </div>

                  <!-- Tenure / Service Badge -->
                  <div class="px-3.5 py-2 rounded-2xl bg-amber-100 text-[#78350f] border border-amber-300 text-xs font-bold font-devanagari w-full shadow-2xs">
                    🏆 {{ mandalData.isEnglish() ? current.tenureEn : current.tenureMr }}
                  </div>

                  <!-- Mandal Cultural Motto -->
                  <div class="w-full pt-1">
                    <span class="inline-block px-3 py-1 rounded-xl bg-amber-200/70 text-[#78350f] font-bold text-[11px] font-devanagari">
                      {{ mandalData.t('॥ सामूहिक श्रद्धा | सामूहिक सेवा ॥', '॥ Collective Faith & Service ॥') }}
                    </span>
                  </div>

                </div>

                <!-- RIGHT COLUMN: Inspiring Address / Speech Content (8 Columns) -->
                <div class="lg:col-span-8 space-y-5">
                  
                  <!-- Message Heading -->
                  <div class="border-b border-amber-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 flex-wrap">
                      <span class="text-3xl text-amber-600 leading-none">❝</span>
                      <h2 class="text-xl sm:text-2xl font-black text-[#991b1b] font-devanagari">
                        {{ mandalData.isEnglish() ? current.tabLabelEn : current.tabLabelMr }}
                      </h2>
                      <span class="text-slate-400 font-bold hidden sm:inline">•</span>
                      <span class="text-xs sm:text-sm font-black text-[#78350f] font-devanagari bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">
                        {{ mandalData.isEnglish() ? current.nameEn : current.nameMr }}
                      </span>
                    </div>

                    <span class="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-devanagari self-start sm:self-auto border border-amber-200">
                      {{ mandalData.t('॥ मंगलमूर्ती मोरया ॥', '॥ Mangalmurti Morya ॥') }}
                    </span>
                  </div>

                  <!-- Lead Quote Highlight Card -->
                  <div class="bg-amber-50/90 border-l-4 border-[#991b1b] p-4 rounded-r-2xl font-bold text-slate-900 leading-normal text-sm sm:text-base font-devanagari shadow-2xs">
                    {{ mandalData.isEnglish() ? current.leadQuoteEn : current.leadQuoteMr }}
                  </div>

                  <!-- Speech Paragraphs -->
                  <div class="space-y-4 text-xs sm:text-sm text-slate-800 font-devanagari leading-relaxed text-justify">
                    @if (mandalData.isEnglish()) {
                      @for (p of current.paragraphsEn; track p) {
                        <p [innerHTML]="p"></p>
                      }
                    } @else {
                      @for (p of current.paragraphsMr; track p) {
                        <p [innerHTML]="p"></p>
                      }
                    }
                  </div>

                  <!-- Formal Signature Block -->
                  <div class="pt-6 border-t-2 border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-devanagari">
                    <div>
                      <div class="font-bold text-slate-700 text-xs">
                        {{ mandalData.isEnglish() ? 'With warmest regards & best wishes,' : 'सस्नेह मनःपूर्वक शुभेच्छा,' }}
                      </div>
                      <!-- Signature Script -->
                      <div class="italic font-serif text-slate-600 text-base h-7 flex items-center">
                        {{ current.signatureName }}
                      </div>
                      <div class="text-[#991b1b] font-black text-base mt-0.5">
                        {{ mandalData.isEnglish() ? current.nameEn : current.nameMr }}
                      </div>
                      <div class="text-slate-800 font-bold text-xs">
                        {{ mandalData.isEnglish() ? current.signTitleEn : current.signTitleMr }}
                      </div>
                      <div class="text-slate-500 text-[11px]">
                        {{ mandalData.isEnglish() ? current.organizationEn : current.organizationMr }}
                      </div>
                    </div>

                    <div class="text-left sm:text-right shrink-0">
                      <span class="inline-block px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border border-amber-300 text-[#78350f] font-bold text-xs sm:text-sm shadow-2xs">
                        {{ mandalData.t('॥ परंपरेचा वारसा आम्ही जपतो ॥', '॥ Preserving Heritage & Cultural Devotion ॥') }}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          }
        </div>

        <!-- Bottom Slider Navigation Bar & Pagination -->
        <div class="bg-gradient-to-b from-transparent to-amber-50/70 border-t border-amber-200/80 px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <!-- Prev Button -->
          <button
            (click)="prevSlide()"
            class="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-amber-50 active:scale-95 text-slate-700 hover:text-amber-900 border border-amber-200 font-bold text-xs font-devanagari flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            <span>{{ mandalData.t('मागील मान्यवर', 'Previous Dignitary') }}</span>
          </button>

          <!-- Dot Pagination Indicators & Slide Counter -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              @for (d of dignitaries; track d.id; let idx = $index) {
                <button
                  (click)="goToSlide(idx)"
                  class="transition-all duration-300 rounded-full cursor-pointer"
                  [ngClass]="currentSlideIndex() === idx
                    ? 'w-8 h-2.5 bg-gradient-to-r from-red-600 to-amber-600 shadow-sm'
                    : 'w-2.5 h-2.5 bg-amber-300/80 hover:bg-amber-400'"
                  [attr.aria-label]="'Go to slide ' + (idx + 1)"
                  [title]="mandalData.isEnglish() ? d.tabLabelEn : d.tabLabelMr"
                ></button>
              }
            </div>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-950 font-mono text-[11px] font-bold">
              {{ mandalData.formatNum(currentSlideIndex() + 1) }} / {{ mandalData.formatNum(dignitaries.length) }}
            </span>
          </div>

          <!-- Next Button -->
          <button
            (click)="nextSlide()"
            class="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 active:scale-95 text-white font-bold text-xs font-devanagari flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <span>{{ mandalData.t('पुढील मान्यवर', 'Next Dignitary') }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

    </div>
  `
})
export class ManogatComponent implements OnInit, OnDestroy {
  readonly mandalData = inject(MandalDataService);

  // Swiper Slide State (Default: 0 - President)
  readonly currentSlideIndex = signal<number>(0);

  // Backward compatibility tab state
  readonly selectedTabId = computed(() => this.dignitaries[this.currentSlideIndex()]?.id || 'president');

  readonly dignitaries: DignitaryMessage[] = [
    {
      id: 'president',
      tabLabelMr: 'श्री. बाळासाहेब यादव',
      tabLabelEn: 'Shri. Balasaheb Yadav',
      badgeMr: '👑 अध्यक्ष • अष्टविनायक मंडळ',
      badgeEn: 'President • Ashtavinayak Mandal',
      icon: '👑',
      nameMr: 'श्री. बाळासाहेब यादव',
      nameEn: 'Shri. Balasaheb Yadav',
      designationMr: 'अध्यक्ष, श्री अष्टविनायक मित्र मंडळ (रजि.)',
      designationEn: 'President, Shree Ashtavinayak Mitra Mandal (Regd.)',
      organizationMr: 'श्री अष्टविनायक मित्र मंडळ, जोगेश्वरी (पश्चिम)',
      organizationEn: 'Shree Ashtavinayak Mitra Mandal, Jogeshwari (West)',
      areaMr: 'शिव स्फूर्ती, आदर्श नगर, जोगेश्वरी (प), मुंबई',
      areaEn: 'Shiv Sphurti, Adarsh Nagar, Jogeshwari (W), Mumbai',
      photoUrl: '/Manogat/Balasaheb%20Yadav.jpg',
      avatarBg: '#991b1b',
      initial: 'बा',
      tenureMr: '२८+ वर्षे अविरत सांस्कृतिक व सामाजिक सेवा',
      tenureEn: '28+ Years Continuous Cultural & Social Service',
      greetingMr: '॥ सस्नेह जय गणेश आणि आदिशक्ती जगदंबेचा जयजयकार ॥',
      greetingEn: '॥ Warmest Greetings & Jai Ganesh to All Devotees ॥',
      leadQuoteMr: 'मी, श्री. बाळासाहेब यादव (अध्यक्ष, श्री अष्टविनायक मित्र मंडळ), शिव स्फूर्ती व आदर्श नगर परिसरातील सर्व आदरणीय नागरिक, माता-भगिनी, तरुण सहकारी आणि समस्त भाविकांचे अधिकृत पोर्टलवर मनःपूर्वक सहर्ष स्वागत करतो.',
      leadQuoteEn: 'I, Shri. Balasaheb Yadav (President, Shree Ashtavinayak Mitra Mandal), extend my warmest greetings and heartfelt welcome to all respected elders, mothers, sisters, youth members, and devotees visiting our official digital portal.',
      paragraphsMr: [
        'शिव स्फूर्ती आणि आदर्श नगर परिसरातील सर्व आदरणीय ज्येष्ठ नागरिक, माता-भगिनी, तरुण सहकारी आणि लाडक्या बालमित्रांनो,',
        'सन <b>१९९७</b> साली एका लहानशा मंडपात आणि मोजक्या निष्ठावंत सहकाऱ्यांच्या साथीने लावलेले हे रोपटे आज तब्बल <b>२८ वर्षांनंतर</b> एका भव्य वटवृक्षात रूपांतरित झाले आहे, याचा मला मंडळाचा अध्यक्ष म्हणून सार्थ अभिमान आणि मनस्वी आनंद वाटतो. आमच्या मंडळाची मूळ ताकद ही केवळ उत्सवाचा डामडौल नसून आपल्या सोसायटीतील प्रत्येक कुटुंबाचा परस्पर विश्वास, आत्मीयता आणि "आपलेच मंडळ" ही उत्स्फूर्त भावना आहे.',
        'गेल्या पाव शतकाहून अधिक काळात आम्ही केवळ सार्वजनिक गणेशोत्सवच नव्हे, तर नऊ दिवसांचा भक्तीमय नवरात्रोत्सव आणि महामानव भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती अत्यंत उत्साहात आणि सामाजिक बांधिलकी जपत साजरी केली आहे. उत्सवातील प्रत्येक रुपयाचा पारदर्शक हिशोब ठेवणे, कम्प्युटराइज्ड पावत्या देणे आणि शिल्लक गंगाजळीचा विनियोग मोफत आरोग्य शिबिरे, गरजू विद्यार्थ्यांचे शिक्षण आणि सामाजिक कार्यासाठी करणे ही आपली सुसंस्कृत परंपरा राहिली आहे.',
        'यंदाही महिला भगिनींनी नवरात्रीत मोठ्या भक्तिभावाने अर्पण केलेल्या साड्या, अन्नदानासाठी भरभरून मिळालेले धान्य-साहित्य आणि तरुण मुलांचे अहोरात्र श्रम हे आपल्या ऐक्याचे जिवंत प्रतीक आहेत. आपण सर्वजण असाच एकोपा जपत पुढील पिढीकडे हा सांस्कृतिक वारसा अभिमानाने सोपवूया.',
        'मंडळाच्या या अधिकृत डिजिटल पोर्टलद्वारे आपण जमा-खर्च, वर्गणीदार, पावती व सर्व छायाचित्रे पारदर्शकपणे पाहू शकता. आपल्या सर्वांचे सहकार्य, आशीर्वाद आणि बाप्पाची कृपा अशीच निरंतर लाभो, हीच श्री गजाननाच्या व आदिशक्तीच्या चरणी नम्र प्रार्थना!'
      ],
      paragraphsEn: [
        'Respected elders, mothers, sisters, young companions, and beloved children of Shiv Sphurti and Adarsh Nagar,',
        'In the year <b>1997</b>, with just a small pandal and a handful of dedicated associates, we planted a seed that has today blossomed over <b>28 glorious years</b> into a magnificent banyan tree. As President, I feel profound pride and gratitude. The true strength of our Mandal has never been mere pageantry; it is the mutual trust, affection, and spontaneous feeling of "our own family" shared by every household in our colony.',
        'Across more than a quarter-century, we have celebrated not only Sarvajanik Ganeshotsav, but also nine divine nights of Navratri and the birth anniversary of Bharat Ratna Dr. Babasaheb Ambedkar with immense fervor and civic responsibility. Auditing every single rupee transparently, issuing computerized receipts, and utilizing surplus funds for medical relief and children\'s education has been our cultural hallmark.',
        'The sarees lovingly offered by our sisters during Navratri, the overwhelming donations for community meals, and the tireless day-and-night toil of our youth reflect the vibrant soul of our unity. Together, let us preserve this timeless heritage and pass it proudly to upcoming generations.',
        'Through this official digital portal, every member can independently review our income, expenses, vouchers, and celebrations with complete transparency. May the divine grace of Lord Ganesha and Goddess Jagdamba keep showering upon all our families!'
      ],
      signatureName: 'Balasaheb Yadav',
      signTitleMr: 'अध्यक्ष, श्री अष्टविनायक मित्र मंडळ',
      signTitleEn: 'President, Shree Ashtavinayak Mitra Mandal'
    },
    {
      id: 'vaibhav-dalvi',
      tabLabelMr: 'श्री. वैभव दळवी',
      tabLabelEn: 'Shri. Vaibhav Dalvi',
      badgeMr: '🚩 संस्थापक/अध्यक्ष • शिवसेना (UBT)',
      badgeEn: 'Founder & President • Shivsena (UBT)',
      icon: '🚩',
      nameMr: 'श्री. वैभव दळवी',
      nameEn: 'Shri. Vaibhav Dalvi',
      designationMr: 'संस्थापक/अध्यक्ष - साईपरिवार फाउंडेशन | शिवसेना (UBT)',
      designationEn: 'Founder/President - Sai Parivar Foundation | Shivsena (UBT)',
      organizationMr: 'साईपरिवार फाउंडेशन, जोगेश्वरी (पश्चिम)',
      organizationEn: 'Sai Parivar Foundation, Jogeshwari (West)',
      areaMr: 'जोगेश्वरी (पश्चिम), मुंबई',
      areaEn: 'Jogeshwari (West), Mumbai',
      photoUrl: '/Manogat/Vaibhav%20Dalvi.png',
      avatarBg: '#ea580c',
      initial: 'वै',
      tenureMr: 'कार्यकुशल नेतृत्व व अविरत जनसेवा',
      tenureEn: 'Dynamic Leadership & Dedicated Social Service',
      greetingMr: '॥ जय गणेश, जय महाराष्ट्र व सस्नेह सदिच्छा ॥',
      greetingEn: '॥ Jai Ganesh, Jai Maharashtra & Warm Greetings ॥',
      leadQuoteMr: 'श्री अष्टविनायक मित्र मंडळाने शिव स्फूर्ती व आदर्श नगर परिसरात भक्ती, संस्कृती आणि युवकांच्या विधायक समाजकार्याचा एक आदर्श दीपस्तंभ उभा केला आहे.',
      leadQuoteEn: 'Shree Ashtavinayak Mitra Mandal has established an exemplary benchmark of devotion, cultural heritage, and youth-led community service across Shiv Sphurti and Adarsh Nagar.',
      paragraphsMr: [
        'जोगेश्वरी पश्चिम परिसरातील सार्वजनिक उत्सव आणि सामाजिक चळवळींचा विचार करताना <b>श्री अष्टविनायक मित्र मंडळ</b> हे नेहमीच अग्रभागी राहिले आहे. मंडळाचे कार्यकर्ते केवळ उत्सवापुरते एकत्र येत नाहीत, तर वर्षभर गोरगरीब, गरजू नागरिकांच्या मदतीसाठी आणि समाजोपयोगी उपक्रमांसाठी तत्परतेने धावून येतात.',
        'साईपरिवार फाउंडेशनच्या माध्यमातून आणि शिवसेना (UBT) परिवाराच्या जनसेवेतून आम्ही नेहमीच अष्टविनायक मंडळाच्या सामाजिक कार्याचे जवळून साक्षीदार राहिलो आहोत. रक्तदान शिबिरे, सर्वसमावेशक आरोग्य शिबिरे, गुणवंत विद्यार्थ्यांचे कौतुक आणि परिसरातील युवकांना एकत्र आणून विधायक दिशा देण्याचे कार्य या मंडळाने अविरतपणे चालवले आहे.',
        'उत्सवातील शिस्त, पारदर्शक हिशोब, सर्वधर्मीय बंधुभाव आणि लोकसहभागाची परंपरा ही या मंडळाची खरी ताकद आहे. अशा निष्ठावंत कार्यकर्त्यांच्या पाठीशी उभे राहणे हे आमचे कर्तव्य आहे. श्री अष्टविनायक मित्र मंडळाच्या सर्व भावी उपक्रमांना साईपरिवार आणि शिवसेना (UBT) परिवाराच्या वतीने मनःपूर्वक सदिच्छा व हार्दिक शुभेच्छा!'
      ],
      paragraphsEn: [
        'When reflecting upon the vibrant community festivals and social initiatives of Jogeshwari West, <b>Shree Ashtavinayak Mitra Mandal</b> has consistently led from the front. Its dedicated cadre does not assemble solely for celebration, but remains on call throughout the year to aid the underprivileged and serve community needs.',
        'Through the Sai Parivar Foundation and the public service ethos of Shivsena (UBT), we have closely witnessed the Mandal\'s multifaceted social endeavors—from mega blood donation drives and free medical camps to student felicitations and positively channeling youth energy.',
        'Unwavering civic discipline, audited financial transparency, and warm brotherhood form the bedrock of this Mandal. On behalf of Sai Parivar Foundation and Shivsena (UBT), I extend our sincerest blessings and wholehearted support to Shree Ashtavinayak Mitra Mandal!'
      ],
      signatureName: 'Vaibhav Dalvi',
      signTitleMr: 'संस्थापक/अध्यक्ष, साईपरिवार फाउंडेशन (शिवसेना UBT)',
      signTitleEn: 'Founder/President, Sai Parivar Foundation (Shivsena UBT)'
    },
    {
      id: 'divya-singh',
      tabLabelMr: 'सौ. दिव्या अवनीश सिंह',
      tabLabelEn: 'Smt. Divya Avneesh Singh',
      badgeMr: '🏛️ नगरसेविका • प्रभाग क्र. ६१',
      badgeEn: 'Corporator • Ward No. 61',
      icon: '🏛️',
      nameMr: 'सौ. दिव्या अवनीश सिंह',
      nameEn: 'Smt. Divya Avneesh Singh',
      designationMr: 'नगरसेविका, प्रभाग (वॉर्ड) - ६१, जोगेश्वरी (पश्चिम)',
      designationEn: 'Municipal Corporator, Ward - 61, Jogeshwari (West)',
      organizationMr: 'बृहन्मुंबई महानगरपालिका (BMC)',
      organizationEn: 'Municipal Corporation of Greater Mumbai',
      areaMr: 'प्रभाग क्र. ६१, जोगेश्वरी (पश्चिम), मुंबई',
      areaEn: 'Ward 61, Jogeshwari (West), Mumbai',
      photoUrl: '/Manogat/Divya%20avneesh%20singh.png',
      avatarBg: '#be185d',
      initial: 'दि',
      tenureMr: 'प्रभाग ६१ जनसेवक, विकासकामे व महिला सक्षमीकरण',
      tenureEn: 'Ward 61 Public Service, Development & Women Welfare',
      greetingMr: '॥ गणपती बाप्पा मोरया, आदिशक्ती जगदंबेचा जयजयकार ॥',
      greetingEn: '॥ Ganpati Bappa Morya & Jai Mata Di ॥',
      leadQuoteMr: 'प्रभाग ६१ ची लोकप्रतिनिधी म्हणून श्री अष्टविनायक मित्र मंडळाच्या धार्मिक, सांस्कृतिक व महिला सक्षमीकरणाच्या उपक्रमांचे मला नेहमीच मनापासून कौतुक वाटते.',
      leadQuoteEn: 'As the elected representative of Ward 61, I take immense pride in the cultural vibrancy, civic responsibility, and women empowerment initiatives of Shree Ashtavinayak Mitra Mandal.',
      paragraphsMr: [
        'आपल्या प्रभाग क्र. ६१ मधील <b>श्री अष्टविनायक मित्र मंडळ (शिव स्फूर्ती, आदर्श नगर)</b> हे संपूर्ण जोगेश्वरीचे भूषण आहे. गेल्या २८ वर्षांपासून हे मंडळ गणेशोत्सव आणि नवरात्रोत्सव केवळ धार्मिक विधी म्हणून नव्हे, तर परिसरातील प्रत्येक कुटुंबाला एकत्र बांधणारा एक भव्य कौटुंबिक स्नेहमेळावा म्हणून साजरा करत आहे.',
        'विशेषतः नवरात्रोत्सवामध्ये महिला भगिनींचा होणारा सन्मान, अन्नदानाचा भव्य भंडारा, पारंपारिक दांडिया-गरबा आणि महिला बचत गटांना दिलेले प्रोत्साहन हे या मंडळाचे खास वैशिष्ट्य आहे. सुरक्षित वातावरण आणि चोख शिस्तीमुळे रात्रीच्या आरती व कार्यक्रमांत माता-भगिनी निर्भयपणे सहभागी होतात, हे मंडळाच्या सुसंस्कृत वातावरणाचे प्रतीक आहे.',
        'प्रभागातील रस्ते, पथदिवे, पाणीपुरवठा आणि स्वच्छता यांसारख्या नागरी सुविधांचे प्रश्न सोडवताना अष्टविनायक मंडळाचे पदाधिकारी नेहमीच प्रशासनाशी समन्वय साधून सक्रिय सहकार्य करतात. लोकप्रतिनिधी या नात्याने या मंडळाच्या प्रत्येक विधायक कार्याला माझे संपूर्ण पाठबळ सदैव राहील!'
      ],
      paragraphsEn: [
        'Located in our Ward 61, <b>Shree Ashtavinayak Mitra Mandal (Shiv Sphurti, Adarsh Nagar)</b> is a shining emblem of community pride. For 28 glorious years, this Mandal has transformed Ganeshotsav and Navratri into grand festivals of family bonding, collective harmony, and civic camaraderie.',
        'Particularly praiseworthy is the Mandal’s heartfelt respect for women: the auspicious Navratri celebrations, community Bhandaras, traditional Garba, and constant encouragement for local women self-help initiatives. The spotless safety and respectful atmosphere allow mothers and sisters to participate with utmost joy and assurance.',
        'Whenever municipal and civic enhancements—roads, illumination, sanitation, or water supply—are addressed in our ward, Ashtavinayak Mandal’s youth and leadership proactively collaborate with civic authorities. As their Corporator, my full administrative and personal support will always stand with this noble Mandal!'
      ],
      signatureName: 'Divya A. Singh',
      signTitleMr: 'नगरसेविका, प्रभाग (वॉर्ड) क्र. ६१',
      signTitleEn: 'Municipal Corporator, Ward No. 61'
    },
    {
      id: 'haroon-khan',
      tabLabelMr: 'मा. श्री. हारून खान (आमदार)',
      tabLabelEn: 'Hon. Shri. Haroon Khan (MLA)',
      badgeMr: '⚖️ आमदार • १६४-वर्सोवा विधानसभा',
      badgeEn: 'Member of Legislative Assembly • 164-Versova',
      icon: '⚖️',
      nameMr: 'मा. श्री. हारून खान',
      nameEn: 'Hon. Shri. Haroon Khan',
      designationMr: 'आमदार (MLA) - १६४, वर्सोवा विधानसभा मतदारसंघ',
      designationEn: 'Member of Legislative Assembly (MLA) - 164, Versova Constituency',
      organizationMr: 'महाराष्ट्र राज्य विधानसभा',
      organizationEn: 'Maharashtra Legislative Assembly',
      areaMr: '१६४ - वर्सोवा विधानसभा मतदारसंघ, मुंबई',
      areaEn: '164 - Versova Constituency, Mumbai',
      photoUrl: '/Manogat/Haroon%20khan.png',
      avatarBg: '#047857',
      initial: 'हा',
      tenureMr: 'वर्सोवा विधानसभा जनसेवक व सर्वसमावेशक विकास',
      tenureEn: 'People\'s Representative & Inclusive Development, Versova',
      greetingMr: '॥ समस्त नागरिकांना सस्नेह जय हिंद व मनःपूर्वक सदिच्छा ॥',
      greetingEn: '॥ Warmest Greetings & Sincere Best Wishes to All ॥',
      leadQuoteMr: 'वर्सोवा विधानसभा मतदारसंघातील श्री अष्टविनायक मित्र मंडळ हे सामाजिक ऐक्य, सर्वधर्मसमभाव आणि शिस्तप्रिय उत्सवाचे एक उत्तम व प्रेरक उदाहरण आहे.',
      leadQuoteEn: 'Shree Ashtavinayak Mitra Mandal in Versova Constituency is an inspiring beacon of social harmony, communal brotherhood, and disciplined celebrations.',
      paragraphsMr: [
        'वर्सोवा विधानसभा मतदारसंघातील (१६४) जोगेश्वरी पश्चिम भागातील <b>श्री अष्टविनायक मित्र मंडळ</b> गेल्या पाव शतकाहून अधिक काळ सामाजिक व सांस्कृतिक एकतेची ज्योत तेवत ठेवत आहे. सार्वजनिक गणेशोत्सव, आदिशक्तीचा नवरात्रोत्सव आणि भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती या तिन्ही उत्सवांत सर्व समाजातील लोक खांद्याला खांदा लावून सहभागी होतात, हे या मतदारसंघाचे खरे सामर्थ्य आहे.',
        'मंडळाने तंत्रज्ञानाचा अंगीकार करून संपूर्ण संगणकीय हिशोब, डिजिटल पावत्या आणि पारदर्शक ताळेबंद जनतेसमोर मांडला आहे, ही आजच्या काळातील एक अत्यंत आदर्श आणि कौतुकास्पद पद्धत आहे. मंडळाचे कार्यकर्ते रक्तदान, परिसर स्वच्छता, वृक्षारोपण आणि जनकल्याणकारी कामात नेहमीच पुढे असतात.',
        'आपल्या मतदारसंघातील या जुन्या व नामांकित संस्थेला माझे आमदार म्हणून सर्वतोपरी सहकार्य राहील. अष्टविनायक मित्र मंडळाच्या माध्यमातून आपल्या जोगेश्वरी परिसराची शांतता, सामाजिक बंधुभाव आणि विकास असाच उत्तरोत्तर बहरत राहो, हीच माझी मनःपूर्वक सदिच्छा!'
      ],
      paragraphsEn: [
        'Representing the 164 - Versova Assembly Constituency, it brings me great satisfaction to witness <b>Shree Ashtavinayak Mitra Mandal</b> upholding the torch of communal brotherhood and cultural unity in Jogeshwari West for over two and a half decades. Across Ganeshotsav, Navratri, and Dr. B. R. Ambedkar Jayanti, citizens from all walks of life celebrate together as one unified family.',
        'The Mandal’s progressive adoption of digital accounting, instant online receipts, and publicly audited balance sheets sets a gold standard for transparent NGO administration. Moreover, their active involvement in blood donation drives, cleanliness missions, and local civic assistance reflects genuine commitment to public welfare.',
        'As the Member of Legislative Assembly, I extend my unconditional cooperation to this respected organization. May Shree Ashtavinayak Mitra Mandal continue to foster peace, inclusive harmony, and all-round prosperity in our beloved Jogeshwari!'
      ],
      signatureName: 'Haroon Khan',
      signTitleMr: 'आमदार (MLA), १६४ - वर्सोवा विधानसभा',
      signTitleEn: 'Member of Legislative Assembly, 164 - Versova'
    },
    {
      id: 'avneesh-singh',
      tabLabelMr: 'श्री. अवनीश सिंह',
      tabLabelEn: 'Shri. Avneesh Singh',
      badgeMr: '🇮🇳 अध्यक्ष • उत्तर भारतीय प्रकोष्ठ',
      badgeEn: 'President • North Indian Cell',
      icon: '🇮🇳',
      nameMr: 'श्री. अवनीश सिंह',
      nameEn: 'Shri. Avneesh Singh',
      designationMr: 'अध्यक्ष - उत्तर भारतीय प्रकोष्ठ (मुंबई काँग्रेस)',
      designationEn: 'President - North Indian Cell (Mumbai Congress)',
      organizationMr: 'मुंबई प्रदेश काँग्रेस कमिटी (MRCC)',
      organizationEn: 'Mumbai Regional Congress Committee',
      areaMr: 'जोगेश्वरी व मुंबई शहर',
      areaEn: 'Jogeshwari & Greater Mumbai',
      photoUrl: '/Manogat/Avneesh%20Singh.png',
      avatarBg: '#1d4ed8',
      initial: 'अ',
      tenureMr: 'सर्वसमावेशक सामाजिक बांधिलकी व जनसेवा',
      tenureEn: 'Inclusive Social Commitment & Public Service',
      greetingMr: '॥ जय गणेश, सस्नेह जय हिंद व मनःपूर्वक मंगलकामना ॥',
      greetingEn: '॥ Jai Ganesh, Jai Hind & Heartfelt Best Wishes ॥',
      leadQuoteMr: 'श्री अष्टविनायक मित्र मंडळाने मराठी, उत्तर भारतीय व सर्व प्रांतांतील नागरिकांना एकाच कुटुंबाप्रमाणे प्रेमाच्या धाग्यात बांधून ठेवले आहे.',
      leadQuoteEn: 'Shree Ashtavinayak Mitra Mandal has bound together Marathi, North Indian, and diverse communities into one united, loving family.',
      paragraphsMr: [
        'मुंबई हे विविधतेत एकतेचे वैश्विक प्रतीक आहे. जोगेश्वरी पश्चिमेतील शिव स्फूर्ती आणि आदर्श नगर परिसरातील <b>श्री अष्टविनायक मित्र मंडळ</b> या एकात्मतेचे सजीव दर्शन घडवते. येथे मराठी भाषिक असो वा उत्तर भारतीय बांधव, सर्वजण एकत्र येऊन मोठ्या भक्तीभावाने आणि उत्साहाने सण साजरे करतात.',
        'मंडळाच्या वतीने नऊ दिवसांचा नवरात्रोत्सव, अखंड गरबा-दांडिया, अष्टमीचे पवित्र हवन आणि महाप्रसादाचा भव्य भंडारा ज्या आत्मीयतेने आयोजित केला जातो, त्यामुळे परिसरातील प्रत्येक कुटुंबाला हे मंडळ आपलेच वाटते. सण-उत्सवाच्या निमित्ताने आपापसातील स्नेह व बंधुभाव वृद्धिंगत करण्याचे मोठे कार्य हे मंडळ करत आहे.',
        'मंडळाचे पदाधिकारी, निष्ठावंत कार्यकर्ते आणि उत्साही युवा पिढीचे नियोजन अतिशय प्रशंसनीय आहे. उत्तर भारतीय प्रकोष्ठ आणि माझ्या वैयक्तिक वतीने श्री अष्टविनायक मित्र मंडळाला आणि परिसरातील समस्त भाविकांना उदंड प्रगती व सुख-समृद्धीसाठी हार्दिक मंगलमय सदिच्छा!'
      ],
      paragraphsEn: [
        'Mumbai is renowned worldwide as a tapestry of unity in diversity. <b>Shree Ashtavinayak Mitra Mandal</b> in Shiv Sphurti and Adarsh Nagar personifies this beautiful cultural integration, where Marathi and North Indian families join hands with equal enthusiasm to celebrate every festival.',
        'The devotion with which the Mandal organizes the nine nights of Navratri, traditional Garba, Ashtami Havan, and the grand community Maha-Prasad instills a heartwarming sense of belonging in every household. It bridges communities and enriches social brotherhood.',
        'The dedicated leadership and dynamic youth committee deserve highest accolades for their selfless teamwork and flawless execution. On behalf of the North Indian Cell and personally, I wish Shree Ashtavinayak Mitra Mandal ever-growing success, unity, and prosperity!'
      ],
      signatureName: 'Avneesh Singh',
      signTitleMr: 'अध्यक्ष, उत्तर भारतीय प्रकोष्ठ (मुंबई काँग्रेस)',
      signTitleEn: 'President, North Indian Cell (Mumbai Congress)'
    },
    {
      id: 'sanjay-pandey',
      tabLabelMr: 'श्री. संजय पांडे',
      tabLabelEn: 'Shri. Sanjay Pandey',
      badgeMr: '🌿 प्रदेशाध्यक्ष • भाजपा उत्तर भारतीय मोर्चा | जलमित्र',
      badgeEn: 'State President • BJP Uttar Bhartiya Morcha | Water Warrior',
      icon: '🌿',
      nameMr: 'श्री. संजय पांडे',
      nameEn: 'Shri. Sanjay Pandey',
      designationMr: 'अध्यक्ष - भाजपा महाराष्ट्र उत्तर भारतीय मोर्चा | माजी प्रदेश सचिव, भाजपा महाराष्ट्र | माजी राष्ट्रीय उपाध्यक्ष, BJYM',
      designationEn: 'President @Bjp4Maharashtra Uttar Bhartiya Morcha | Fmr Secretary of BJP Maha | Fmr National VP @BJYM | Politician, Philanthropist, Water Warrior',
      organizationMr: 'भारतीय जनता पार्टी (महाराष्ट्र)',
      organizationEn: 'Bharatiya Janata Party (Maharashtra)',
      areaMr: 'महाराष्ट्र राज्य व मुंबई',
      areaEn: 'Maharashtra State & Mumbai',
      photoUrl: '/Manogat/Sanjay%20Pandey.png',
      avatarBg: '#b45309',
      initial: 'सं',
      tenureMr: 'जलमित्र (Water Warrior), पर्यावरण संवर्धन व समाजकार्य',
      tenureEn: 'Water Warrior, Philanthropist & Environmental Activism',
      greetingMr: '॥ राष्ट्राय स्वाहा, इदं न मम | सेवा हीच ईश्वरभक्ती ॥',
      greetingEn: '॥ Dedicated to the Nation | Service to Humanity is Divine Worship ॥',
      leadQuoteMr: 'श्री अष्टविनायक मित्र मंडळाने उत्सवाच्या माध्यमातून पर्यावरण रक्षण, जलसंवर्धन आणि सुसंस्कृत समाजाची यशस्वी उभारणी केली आहे.',
      leadQuoteEn: 'Shree Ashtavinayak Mitra Mandal has harnessed community celebrations to champion environmental conservation, water preservation, and cultural values.',
      paragraphsMr: [
        'धार्मिक उत्सव हे केवळ डामडौलाचे प्रदर्शन नसून ते समाजाला विधायक दिशा देणारे आणि राष्ट्रउभारणीत हातभार लावणारे माध्यम असतात, हे <b>श्री अष्टविनायक मित्र मंडळाने</b> आपल्या अविरत कार्यावरून दाखवून दिले आहे. गेली २८ वर्षे आदर्श नगर, जोगेश्वरी भागात संस्कृती, परंपरा आणि लोककल्याण जपण्याचे मोठे कार्य हे मंडळ करत आहे.',
        'एक जलमित्र (Water Warrior) आणि पर्यावरण कार्यकर्ता म्हणून मला विशेष अभिमान वाटतो की हे मंडळ पर्यावरणपूरक मूर्तींची स्थापना, निर्माल्य व्यवस्थापन, उत्सवात पाण्याचा काटकसरीने वापर आणि वृक्षारोपणासारख्या गंभीर मुद्यांवर समाजात सक्रिय जनजागृती करते. मंडळाचा प्रत्येक उपक्रम सामाजिक उत्तरदायित्वाची जाणीव ठेवून राबवला जातो.',
        'हिशोबाची १००% पारदर्शकता, तरुणांना दिलेली शिस्त आणि सर्वसमावेशक सेवाभाव याबद्दल अष्टविनायक मंडळाचे पदाधिकारी व स्वयंसेवकांचे मनःपूर्वक अभिनंदन. विघ्नहर्ता गणराया आणि आदिशक्ती जगदंबेच्या आशीर्वादाने मंडळाची ही जनसेवा अशीच अखंड चालू राहो, हीच ईश्वरचरणी विनम्र प्रार्थना!'
      ],
      paragraphsEn: [
        'Cultural festivals are not mere celebrations; they are potent platforms for social transformation, youth character-building, and nation-building. <b>Shree Ashtavinayak Mitra Mandal</b> has exemplified this truth through 28 years of consistent grassroots work in Adarsh Nagar, Jogeshwari West.',
        'As a Water Warrior and environmental philanthropist, it gladdens my heart to see this Mandal champion eco-friendly idols, Nirmalya composting, responsible water conservation, and tree plantation drives during festivals. Every initiative is executed with keen ecological and civic consciousness.',
        'Total financial transparency, exemplary youth discipline, and selfless devotion define this organization. I heartily congratulate the office-bearers and volunteers. May Lord Vighnaharta and Mother Jagdamba bless Shree Ashtavinayak Mitra Mandal with boundless strength to serve society for decades to come!'
      ],
      signatureName: 'Sanjay Pandey',
      signTitleMr: 'अध्यक्ष, भाजपा महाराष्ट्र उत्तर भारतीय मोर्चा व जलमित्र',
      signTitleEn: 'President, BJP Maharashtra Uttar Bhartiya Morcha & Water Warrior'
    }
  ];

  readonly activeDignitary = computed(() => {
    return this.dignitaries[this.currentSlideIndex()] || this.dignitaries[0];
  });

  nextSlide() {
    this.currentSlideIndex.update(idx => (idx + 1) % this.dignitaries.length);
  }

  prevSlide() {
    this.currentSlideIndex.update(idx => (idx - 1 + this.dignitaries.length) % this.dignitaries.length);
  }

  goToSlide(idx: number) {
    if (idx >= 0 && idx < this.dignitaries.length) {
      this.currentSlideIndex.set(idx);
    }
  }

  selectTab(id: string) {
    const idx = this.dignitaries.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.goToSlide(idx);
    }
  }

  // Touch Gesture Handlers for Mobile & Tablet Swiping
  private touchStartX = 0;
  private touchStartY = 0;
  private isSwiping = false;

  // Auto-Sliding (5.5s interval with pause on hover/interaction)
  readonly isAutoSlidePaused = signal<boolean>(false);
  private autoSlideTimer: any = null;
  private touchResumeTimer: any = null;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      if (!this.isAutoSlidePaused()) {
        this.nextSlide();
      }
    }, 5500);
  }

  stopAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
    if (this.touchResumeTimer) {
      clearTimeout(this.touchResumeTimer);
      this.touchResumeTimer = null;
    }
  }

  pauseAutoSlide() {
    this.isAutoSlidePaused.set(true);
  }

  resumeAutoSlide() {
    this.isMouseDown = false;
    this.isAutoSlidePaused.set(false);
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.isSwiping = true;
    this.pauseAutoSlide();
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.isSwiping || e.changedTouches.length === 0) return;
    this.isSwiping = false;
    const deltaX = e.changedTouches[0].clientX - this.touchStartX;
    const deltaY = e.changedTouches[0].clientY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    // Resume auto-slide after 4 seconds of inactivity
    if (this.touchResumeTimer) clearTimeout(this.touchResumeTimer);
    this.touchResumeTimer = setTimeout(() => {
      this.resumeAutoSlide();
    }, 4000);
  }

  // Mouse Drag Support
  private mouseStartX = 0;
  private mouseStartY = 0;
  private isMouseDown = false;

  onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.mouseStartX = e.clientX;
    this.mouseStartY = e.clientY;
    this.isMouseDown = true;
    this.pauseAutoSlide();
  }

  onMouseUp(e: MouseEvent) {
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    const deltaX = e.clientX - this.mouseStartX;
    const deltaY = e.clientY - this.mouseStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  onMouseLeave() {
    this.isMouseDown = false;
    this.resumeAutoSlide();
  }

  // Keyboard Arrow Navigation
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      this.nextSlide();
    } else if (e.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }
}
