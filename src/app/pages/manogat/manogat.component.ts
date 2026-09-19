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
                      @if (current.photoUrl && current.id === 'president') {
                        <img
                          [src]="current.photoUrl"
                          [alt]="current.nameMr + ' - ' + current.designationMr"
                          class="w-full h-full object-cover rounded-2xl transition duration-500 group-hover:scale-105"
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
      tabLabelMr: 'अध्यक्षांचे मनोगत',
      tabLabelEn: "President's Message",
      badgeMr: '🚩 मंडळ अध्यक्ष',
      badgeEn: 'Mandal President',
      icon: '🚩',
      nameMr: 'श्री. बाळासाहेब यादव',
      nameEn: 'Shri. Balasaheb Yadav',
      designationMr: 'अध्यक्ष, श्री अष्टविनायक मित्र मंडळ',
      designationEn: 'President, Shree Ashtavinayak Mitra Mandal',
      organizationMr: 'रजि. न. १९२३ जी.वी.वी.एस.डी (स्थापना १९९७)',
      organizationEn: 'Reg. No. 1923 GBVSD (Est. 1997)',
      areaMr: 'शिव स्फूर्ती, आदर्श नगर, जोगेश्वरी (प), मुंबई',
      areaEn: 'Shiv Sphurti, Adarsh Nagar, Jogeshwari (W), Mumbai',
      photoUrl: '/Sabhasad/Balasaheb%20Yadav.jpg',
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
        '<b>विघ्नहर्ता गणराया आणि आई जगदंबा आपणा सर्वांना उदंड आरोग्य, सुख-समृद्धी आणि भरभराट देवो, हीच श्रींच्या चरणी नम्र प्रार्थना!</b>'
      ],
      paragraphsEn: [
        'Respected elders, mothers, sisters, dear youth members, and children of Shiv Sphurti and Adarsh Nagar,',
        'What began in <b>1997</b> with humble devotion and a handful of dedicated youth has today completed <b>28 glorious years</b> of uninterrupted cultural and social service. As the President of Shree Ashtavinayak Mitra Mandal, my heart fills with profound gratitude seeing how our small gathering has blossomed into a cherished community family.',
        'Our Mandal stands on the unshakeable pillars of transparency, collective harmony, and selfless service. Across Ganeshotsav, Navratri, and Dr. B. R. Ambedkar Jayanti, we have consistently upheld absolute financial integrity with digital receipts, audited balance sheets, and reinvesting surplus reserves into free medical checkups, educational scholarships, and local welfare.',
        'The overwhelming generosity of our mothers donating sarees, donors contributing Bhandara provisions, and our youth volunteering day and night proves that faith binds us together beyond words. Let us pledge to safeguard and nurture this sacred heritage for generations to come.',
        '<b>May Lord Vighnaharta and Mother Jagdamba bless each family with peace, abundant health, and enduring prosperity!</b>'
      ],
      signatureName: 'B. Yadav',
      signTitleMr: 'अध्यक्ष, श्री अष्टविनायक मित्र मंडळ',
      signTitleEn: 'President, Shree Ashtavinayak Mitra Mandal'
    },
    {
      id: 'mentor',
      tabLabelMr: 'ज्येष्ठ मार्गदर्शक',
      tabLabelEn: 'Senior Mentor',
      badgeMr: '🏛️ संस्थापक सल्लागार',
      badgeEn: 'Founding Advisor',
      icon: '🏛️',
      nameMr: 'श्री. रामकृष्ण पांडुरंग सावंत',
      nameEn: 'Shri. Ramkrishna P. Sawant',
      designationMr: 'संस्थापक सदस्य व ज्येष्ठ सल्लागार',
      designationEn: 'Founding Trustee & Senior Mentor',
      organizationMr: 'शिव स्फूर्ती रहिवासी मंडळ, आदर्श नगर',
      organizationEn: 'Shiv Sphurti Residents Welfare, Adarsh Nagar',
      areaMr: 'जोगेश्वरी (पश्चिम), मुंबई-४००१०२',
      areaEn: 'Jogeshwari (West), Mumbai-400102',
      photoUrl: '',
      avatarBg: '#047857',
      initial: 'रा',
      tenureMr: '१९९७ पासून अविरत मार्गदर्शन (२८ वर्षे)',
      tenureEn: 'Guiding Force Since 1997 (28 Years)',
      greetingMr: '॥ परंपरेचा पाया मजबूत, नव्या पिढीचे विचार जागृत ॥',
      greetingEn: '॥ Rooted in Heritage, Inspiring the New Generation ॥',
      leadQuoteMr: '१९९७ साली ज्या पिढीने खांद्याला खांदा लावून आदर्श नगरमध्ये गणपती बाप्पाची स्थापना केली, त्या प्रेरणेचा वटवृक्ष आज संपूर्ण जोगेश्वरीत अभिमानाने उभा आहे.',
      leadQuoteEn: 'The sacred flame lit in 1997 by our founding youth in Adarsh Nagar stands today as a majestic beacon of unity across Jogeshwari West.',
      paragraphsMr: [
        'आमच्या काळात साधनसामग्री मर्यादित होती, पण उत्साह आणि निष्ठा अथांग होती. शिव स्फूर्ती इमारतीच्या प्रांगणात आम्ही सर्व जाती-धर्माच्या शेजाऱ्यांनी मिळून जेव्हा पहिल्यांदा "गणपती बाप्पा मोरया" असा गजर केला, तेव्हापासून आजतागायत या परिसराची एकजूट कधीही खंडित झाली नाही.',
        'आजची तरुण पिढी ज्या आत्मीयतेने आणि तंत्रज्ञानाचा वापर करून डिजिटल हिशोब, ऑनलाइन पावत्या आणि शिस्तबद्ध नियोजन करत आहे, ते पाहून आमचे मन भरून येते. मंडळाचे अध्यक्ष बाळासाहेब यादव आणि त्यांच्या सर्व सहकाऱ्यांनी जुन्या आदर्शांना नवी आधुनिक जोड दिली आहे.',
        'माझे सर्व तरुणांना एकच सांगणे आहे: उत्सव मोठा करा, पण त्यातली भक्ती, शिस्त, वडीलधाऱ्यांचा आदर आणि गरिबांना मदत करण्याची वृत्ती कधीही ढळू देऊ नका. अष्टविनायक मंडळाला माझ्या मनःपूर्वक शुभेच्छा व आशीर्वाद!'
      ],
      paragraphsEn: [
        'In 1997, our physical resources were modest, but our devotion and mutual trust were boundless. When all neighbors in Shiv Sphurti first chanted "Ganpati Bappa Morya" together, an unbreakable bond of brotherhood was forged.',
        'Seeing today’s young brigade adopt modern digital systems, computer receipts, transparent balance sheets, and punctual discipline warms my heart. President Balasaheb Yadav and the executive committee have skillfully bridged timeless cultural values with contemporary excellence.',
        'My blessing to the youth is simple: celebrate grandly, but always preserve humility, reverence for elders, safety for all, and a helping hand for underprivileged students.'
      ],
      signatureName: 'R. P. Sawant',
      signTitleMr: 'संस्थापक सल्लागार व ज्येष्ठ मार्गदर्शक',
      signTitleEn: 'Founding Advisor & Senior Mentor'
    },
    {
      id: 'corporator',
      tabLabelMr: 'स्थानिक लोकप्रतिनिधी',
      tabLabelEn: 'Local Representative',
      badgeMr: '⚖️ समाजसेवक व लोकप्रतिनिधी',
      badgeEn: 'Community Leader & Ex-Corporator',
      icon: '⚖️',
      nameMr: 'ॲड. सुहास रमेश देसाई',
      nameEn: 'Adv. Suhas Ramesh Desai',
      designationMr: 'माजी नगरसेवक व ज्येष्ठ समाजसेवक (प्रभाग क्र. ६४)',
      designationEn: 'Ex-Corporator & Senior Social Worker (Ward 64)',
      organizationMr: 'जोगेश्वरी पश्चिम जनसेवा प्रतिष्ठान',
      organizationEn: 'Jogeshwari West Public Welfare Trust',
      areaMr: 'आदर्श नगर व जोगेश्वरी पश्चिम',
      areaEn: 'Adarsh Nagar & Jogeshwari West',
      photoUrl: '',
      avatarBg: '#1d4ed8',
      initial: 'सु',
      tenureMr: '२५+ वर्षे जनसेवा व विकासकामे',
      tenureEn: '25+ Years of Dedicated Public Service',
      greetingMr: '॥ सेवा हीच ईश्वरभक्ती, जनशक्ती हीच खरी ताकद ॥',
      greetingEn: '॥ Public Service is Divine Worship ॥',
      leadQuoteMr: 'श्री अष्टविनायक मित्र मंडळाने नेहमीच उत्सवाला केवळ मिरवणुकीपुरते मर्यादित न ठेवता सामाजिक प्रबोधन आणि नागरिकांच्या सेवेचे भक्कम अधिष्ठान दिले आहे.',
      leadQuoteEn: 'Shree Ashtavinayak Mitra Mandal has elevated traditional festivities into a powerhouse of community upliftment and civic discipline.',
      paragraphsMr: [
        'जोगेश्वरी पश्चिमेतील शेकडो मंडळांमध्ये श्री अष्टविनायक मित्र मंडळ हे आपल्या कडक शिस्तीसाठी, ध्वनीप्रदूषण नियमांच्या काटेकोर पालनासाठी आणि पारदर्शक कारभारासाठी विशेष गौरविले जाते.',
        'मंडळाच्या वतीने राबविले जाणारे भव्य रक्तदान शिबिर, गरजू शालेय विद्यार्थ्यांना वह्या-पुस्तके वाटप, ज्येष्ठ नागरिकांसाठी आरोग्य तपासणी आणि पर्यावरणपूरक उत्सव साजरे करण्याचे धोरण हे इतरांसाठी आदर्शवत आहे.',
        'एक लोकप्रतिनिधी म्हणून या मंडळाच्या प्रत्येक विधायक कार्यात पाठीशी उभे राहताना मला मनस्वी समाधान लाभते. येत्या काळातही आपल्या आदर्श नगर परिसरातील सर्व लोकोपयोगी कामांसाठी माझे संपूर्ण सहकार्य सदैव तत्पर राहील.'
      ],
      paragraphsEn: [
        'Among numerous mandals across Jogeshwari West, Shree Ashtavinayak Mitra Mandal stands out for exemplary civic discipline, zero noise violations, and crystal-clear administration.',
        'Their regular mega blood donation drives, distribution of books and stationery to needy students, senior citizen health checkups, and eco-friendly immersions set a gold standard in civic responsibility.',
        'As a local representative, it is an honor to support their public endeavors. I reiterate my steadfast commitment to work shoulder-to-shoulder with the Mandal for continuous neighborhood progress.'
      ],
      signatureName: 'Adv. S. R. Desai',
      signTitleMr: 'माजी नगरसेवक व ज्येष्ठ विधीज्ञ',
      signTitleEn: 'Ex-Corporator & Advocate High Court'
    },
    {
      id: 'police',
      tabLabelMr: 'सुरक्षा सल्लागार',
      tabLabelEn: 'Safety Advisor',
      badgeMr: '🛡️ पोलीस निरीक्षक (से.नि.)',
      badgeEn: 'Sr. Inspector (Retd.)',
      icon: '🛡️',
      nameMr: 'श्री. विलास नारायण मोहिते',
      nameEn: 'Shri. Vilas Narayan Mohite',
      designationMr: 'वरिष्ठ पोलीस निरीक्षक (से.नि.) व सुरक्षा सल्लागार',
      designationEn: 'Sr. Police Inspector (Retd.) & Safety Advisor',
      organizationMr: 'मुंबई पोलीस दल (सेवानिवृत्त)',
      organizationEn: 'Mumbai Police (Retd.)',
      areaMr: 'जोगेश्वरी (पश्चिम), मुंबई',
      areaEn: 'Jogeshwari (West), Mumbai',
      photoUrl: '',
      avatarBg: '#334155',
      initial: 'वि',
      tenureMr: '३४ वर्षे पोलीस सेवा (राष्ट्रपती पदक सन्मानित)',
      tenureEn: '34 Years Mumbai Police (Presidential Medalist)',
      greetingMr: '॥ शिस्तबद्ध उत्सव, सुरक्षित समाज, शांततामय जोगेश्वरी ॥',
      greetingEn: '॥ Disciplined Festivity, Safe Neighborhood ॥',
      leadQuoteMr: 'गणेशोत्सव व नवरात्रौत्सवात महिला भगिनी आणि लहान मुलांची सुरक्षितता ही अष्टविनायक मंडळाच्या स्वयंसेवकांची पहिली प्राथमिकता राहिली आहे.',
      leadQuoteEn: 'Ensuring total safety for women, children, and senior citizens has always been the hallmark of Ashtavinayak Mandal’s volunteer force.',
      paragraphsMr: [
        'माझ्या ३४ वर्षांच्या पोलीस सेवेत मी शेकडो उत्सव मंडळे जवळून पाहिली आहेत. परंतु, श्री अष्टविनायक मित्र मंडळाच्या कार्यकर्त्यांमध्ये असलेली शिस्त, शांतता आणि कायदा-सुव्यवस्थेबद्दलचा आदर खरोखर वाखाणण्याजोगा आहे.',
        'उत्सवाच्या १० दिवसांत मंडप परिसरात सीसीटीव्ही निगराणी, अग्निशामक साधनांची सज्जता, २४ तास स्वयंसेवकांचा पहारा आणि गर्दीचे चोख व्यवस्थापन यामुळे येथे कधीही कोणताही अनुचित प्रकार घडलेला नाही.',
        'विशेषतः रात्रीच्या आरतीच्या वेळी आणि विसर्जन मिरवणुकीत महिला भगिनी निर्भयपणे सहभागी होऊ शकतात, हेच या मंडळाच्या सुसंस्कृत वातावरणाचे सर्वात मोठे प्रमाणपत्र आहे.'
      ],
      paragraphsEn: [
        'In my 34 years in the Mumbai Police force, I have monitored hundreds of community celebrations. The voluntary discipline and respect for public order exhibited by Ashtavinayak Mandal are exemplary.',
        'Equipped with 24x7 CCTV monitoring, functional fire extinguishers, well-trained youth volunteers, and seamless crowd routing, the mandal maintains a spotless zero-incident record.',
        'That women and children participate fearlessly in late-night aartis and immersion rallies testifies to the safe and respectful environment cultivated here.'
      ],
      signatureName: 'V. N. Mohite',
      signTitleMr: 'वरिष्ठ पोलीस निरीक्षक (से.नि.)',
      signTitleEn: 'Sr. Police Inspector (Retd.)'
    },
    {
      id: 'mahila',
      tabLabelMr: 'महिला प्रतिनिधी',
      tabLabelEn: 'Women Representative',
      badgeMr: '🌸 महिला मंडळ अध्यक्षा',
      badgeEn: 'Women Wing Head',
      icon: '🌸',
      nameMr: 'सौ. सुनंदा शांताराम गुरव',
      nameEn: 'Smt. Sunanda Shantaram Gurav',
      designationMr: 'अध्यक्षा, शिव स्फूर्ती महिला बचत गट व समाजसेविका',
      designationEn: 'President, Mahila Bachat Gat & Social Activist',
      organizationMr: 'आदर्श नगर महिला विकास समिती',
      organizationEn: 'Adarsh Nagar Women Welfare Committee',
      areaMr: 'शिव स्फूर्ती, जोगेश्वरी (पश्चिम)',
      areaEn: 'Shiv Sphurti, Jogeshwari (West)',
      photoUrl: '',
      avatarBg: '#be185d',
      initial: 'सु',
      tenureMr: '२०+ वर्षे महिला सक्षमीकरण व सामाजिक कार्य',
      tenureEn: '20+ Years in Women Empowerment',
      greetingMr: '॥ नारी शक्तीचा सन्मान, संस्कृतीचा जागर ॥',
      greetingEn: '॥ Honoring Womanhood & Cultural Devotion ॥',
      leadQuoteMr: 'मंडळाच्या प्रत्येक कार्यात महिलांची सक्रिय भागीदारी आणि सन्मान हे आमच्या शिव स्फूर्ती परिवाराचे सर्वात सुंदर वैभव आहे.',
      leadQuoteEn: 'Active involvement and dignified respect for women in every mandal endeavor is the crown jewel of our community.',
      paragraphsMr: [
        'नवरात्रौत्सवातील नऊ दिवसांचा अखंड जागर असो किंवा महाप्रसादाचा भव्य भंडारा असो, आमच्या परिसरातील सर्व माता-भगिनी एकत्र येऊन अन्नदानाचा सोहळा यशस्वी करतात. शेकडो भाविकांना गरम, सात्त्विक महाप्रसाद वाढताना मिळणारा आनंद अवर्णनीय असतो.',
        'मंडळाने महिलांसाठी हळदी-कुंकू, पारंपरिक रांगोळी स्पर्धा, आरोग्य तपासणी शिबिरे आणि स्वयंसिद्धा महिलांचे कौतुक असे अनेक प्रेरणादायी उपक्रम सुरू ठेवले आहेत.',
        'अष्टविनायक मंडळ हे आम्हा सर्व महिलांसाठी केवळ गणेशोत्सव मंडळ नसून एक आधारवड आहे. गणपती बाप्पा आणि आई जगदंबेच्या आशीर्वादाने हे मंडळ असेच प्रगतीपथावर राहो!'
      ],
      paragraphsEn: [
        'Whether it is the nine auspicious nights of Navratri or the grand community Bhandara, mothers and sisters across Adarsh Nagar assemble with unmatched devotion to prepare and serve wholesome Maha-Prasad.',
        'The Mandal regularly hosts Haldi-Kunku, traditional rangoli exhibitions, women healthcare camps, and felicitates women self-help entrepreneurs, inspiring everyone.',
        'To all of us, Shree Ashtavinayak Mitra Mandal is not merely an event organizer, but our extended family providing encouragement and community strength.'
      ],
      signatureName: 'S. S. Gurav',
      signTitleMr: 'अध्यक्षा, महिला बचत गट',
      signTitleEn: 'President, Women Welfare Group'
    },
    {
      id: 'patron',
      tabLabelMr: 'प्रतिष्ठित देणगीदार',
      tabLabelEn: 'Prominent Patron',
      badgeMr: '💼 उद्योजक व देणगीदार',
      badgeEn: 'Industrialist & Patron',
      icon: '💼',
      nameMr: 'श्री. संजय अनंत वर्तक',
      nameEn: 'Shri. Sanjay Anant Vartak',
      designationMr: 'व्यवस्थापकीय संचालक, वर्तक ग्रुप व मुख्य देणगीदार',
      designationEn: 'Managing Director, Vartak Group & Chief Patron',
      organizationMr: 'जोगेश्वरी व्यापारी व उद्योजक कल्याणकारी संघटना',
      organizationEn: 'Jogeshwari Traders & Industrialists Association',
      areaMr: 'जोगेश्वरी (पश्चिम), मुंबई',
      areaEn: 'Jogeshwari (West), Mumbai',
      photoUrl: '',
      avatarBg: '#b45309',
      initial: 'सं',
      tenureMr: '१५+ वर्षे मंडळ मुख्य हितचिंतक',
      tenureEn: '15+ Years Chief Patron & Sponsor',
      greetingMr: '॥ दातृत्व हीच खरी समृद्धी, पारदर्शकता हाच विश्वास ॥',
      greetingEn: '॥ Philanthropy with Total Transparency ॥',
      leadQuoteMr: 'मंडळाचे पारदर्शक आर्थिक व्यवहार, संगणकीय पावत्या आणि प्रत्येक रुपयाचा अचूक हिशोब पाहिल्यावर देणगीदारांचा विश्वास द्विगुणित होतो.',
      leadQuoteEn: 'Experiencing the mandal’s transparent accounts, instant computer receipts, and audited books inspires immense trust among donors.',
      paragraphsMr: [
        'एक स्थानिक उद्योजक म्हणून मी मुंबईतील अनेक सामाजिक व धार्मिक संस्थांना जवळून पाहिले आहे. परंतु, श्री अष्टविनायक मित्र मंडळाने जी हिशोबाची पारदर्शकता ठेवली आहे, ती खरोखर अद्वितीय आहे.',
        'इथे दिलेला प्रत्येक रुपया हा खरोखरच समाजोपयोगी कामासाठी, गरजूंच्या मदतीसाठी आणि उत्सवाच्या पवित्र कार्यासाठीच वापरला जातो, याची खात्री प्रत्येक देणगीदाराला असते.',
        'मंडळाच्या सर्व पदाधिकाऱ्यांचे मी मनापासून कौतुक करतो आणि सर्व स्थानिक व्यावसायिक बांधवांना आवाहन करतो की त्यांनी अष्टविनायक मंडळाच्या लोकोपयोगी उपक्रमांना सढळ हाताने सहकार्य करावे.'
      ],
      paragraphsEn: [
        'As an entrepreneur, I interact with multiple organizations across Mumbai. The financial integrity and technological transparency modeled by Shree Ashtavinayak Mitra Mandal are truly commendable.',
        'Every donor is confident that every rupee contributed is judiciously channeled into public welfare, educational assistance, and authentic spiritual celebration.',
        'I salute the selfless team under President Mangesh Kadam and urge all business owners and residents to generously support this model institution.'
      ],
      signatureName: 'S. A. Vartak',
      signTitleMr: 'मुख्य देणगीदार व उद्योगपती',
      signTitleEn: 'Managing Director & Chief Patron'
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
