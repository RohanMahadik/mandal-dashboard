import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

export interface GratitudeHonoree {
  id: string;
  nameMr: string;
  nameEn: string;
  affectionateTitleMr: string;
  affectionateTitleEn: string;
  roleMr: string;
  roleEn: string;
  badgeMr: string;
  badgeEn: string;
  icon: string;
  photoUrl: string;
  fallbackInitial: string;
  avatarBg: string;
  keyHighlightsMr: { title: string; desc: string; icon: string }[];
  keyHighlightsEn: { title: string; desc: string; icon: string }[];
  specialContributionMr: string;
  specialContributionEn: string;
}

@Component({
  selector: 'app-vishesh-aabhar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      
      <!-- ================= TOP CULTURAL BANNER ================= -->
      <div class="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-amber-600/30">
        <div class="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
          <img src="logo.jpg" alt="Logo" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-amber-400 shadow-xl shrink-0" />
          <div class="flex-1">
            <!-- Navigation Actions -->
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
              <a
                routerLink="/"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 hover:text-white border border-white/20 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
                title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
              >
                <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
              </a>

              <a
                routerLink="/manogat"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/30 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer"
              >
                <span>👑</span>
                <span>{{ mandalData.t('मान्यवरांचे मनोगत', 'Dignitary Messages') }}</span>
              </a>
            </div>

            <div class="flex items-center justify-center sm:justify-start gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>●</span>
              <span>{{ mandalData.t('कृतज्ञता व मनःपूर्वक आदर (स्थापना १९९७)', 'Gratitude & Sincere Appreciation (Est. 1997)') }}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black font-devanagari mt-1 text-white drop-shadow-sm">
              {{ mandalData.t('विशेष आभार व कृतज्ञता दालन', 'Special Gratitude & Acknowledgements') }}
            </h1>
            <div class="text-amber-200 text-xs sm:text-sm font-semibold mt-1 font-devanagari">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ • शिव स्फूर्ती, आदर्श नगर, जोगेश्वरी (पश्चिम), मुंबई - ४०० १०२', 'Shree Ashtavinayak Mitra Mandal • Shiv Sphurti, Adarsh Nagar, Jogeshwari (W), Mumbai - 400102') }}
            </div>
            <p class="text-amber-100 text-xs sm:text-sm mt-1.5 font-bold font-devanagari">
              {{ mandalData.t('॥ ज्यांच्या भक्कम पाठबळावर आणि मार्गदर्शनावर मंडळाचा डोलारा उभा आहे, त्यांना त्रिवार वंदन ॥', '॥ Honoring the Pillars of Support Whose Guidance and Dedication Elevate Our Mandal ॥') }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= OVERVIEW APPRECIATION CARD ================= -->
      <div class="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-2 border-amber-300/80 shadow-md">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="space-y-1.5 text-center md:text-left">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold font-devanagari">
              <span>🙏</span>
              <span>{{ mandalData.t('हृदयस्पर्शी कृतज्ञता व सन्मान', 'Heartfelt Appreciation & Respect') }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-[#991b1b] font-devanagari">
              {{ mandalData.t('मंडळाचे अविभाज्य आधारस्तंभ व मुख्य मार्गदर्शक', 'Integral Pillars & Chief Mentors of the Mandal') }}
            </h2>
            <p class="text-xs sm:text-sm text-slate-700 font-devanagari leading-relaxed max-w-4xl">
              {{ mandalData.t(
                'सार्वजनिक गणेशोत्सव, आदिशक्ती नवरात्रोत्सव आणि वर्षभरातील विविध सामाजिक उपक्रम यशस्वीपणे पार पाडण्यासाठी ज्यांचे वेळोवेळी आर्थिक साहाय्य, कुटुंबप्रमुखासारखे प्रेम आणि काळाच्या पुढे पाहणारे नियोजन लाभले आहे, अशा तीन प्रमुख व्यक्तींचे श्री अष्टविनायक मित्र मंडळ सदैव ऋणी राहील.',
                'Shree Ashtavinayak Mitra Mandal remains eternally indebted to three cornerstone personalities whose timely financial aid, fraternal warmth, and forward-looking strategic vision empower our community festivals and civic initiatives.'
              ) }}
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0 bg-white/90 px-4 py-3 rounded-2xl border border-amber-300 shadow-xs">
            <span class="text-2xl">🎖️</span>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-500 font-devanagari">{{ mandalData.t('विशेष सन्मान', 'Special Honors') }}</div>
              <div class="text-base font-black text-amber-900 font-mono">{{ mandalData.formatNum(honorees.length) }} {{ mandalData.t('महानुभाव', 'Dignitaries') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 3 SPECIAL HONOREE CARDS (GRID) ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
        @for (h of honorees; track h.id; let idx = $index) {
          <div 
            class="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-amber-400 relative"
          >
            <!-- Top Decorative Header Banner (NO text at bottom to prevent overlap) -->
            <div 
              class="h-28 p-4 relative overflow-hidden flex items-start justify-between text-white"
              [style.background]="getHeaderGradient(idx)"
            >
              <!-- Background Number Watermark -->
              <div class="absolute -right-3 -bottom-5 text-7xl font-black opacity-15 select-none font-mono">
                0{{ idx + 1 }}
              </div>

              <!-- Top Category Badge Pill -->
              <span class="relative z-10 px-3 py-1 rounded-full bg-black/30 backdrop-blur-xs text-[11px] font-black tracking-wide border border-white/20 font-devanagari shadow-2xs">
                {{ h.icon }} {{ mandalData.isEnglish() ? h.badgeEn : h.badgeMr }}
              </span>

              <!-- Serial Counter -->
              <span class="relative z-10 w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xs font-mono font-black border border-white/30 shadow-2xs">
                #{{ idx + 1 }}
              </span>
            </div>

            <!-- Profile Portrait & Identity Section (Strictly Structured - NO OVERLAPPING) -->
            <div class="px-5 sm:px-6 relative -mt-14 flex flex-col items-center text-center">
              
              <!-- Portrait Frame -->
              <div class="relative group/pic mb-3">
                <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1.5 bg-white shadow-xl ring-4 ring-amber-400/50 overflow-hidden flex items-center justify-center">
                  @if (h.photoUrl && !photoErrors()[h.id]) {
                    <img 
                      [src]="h.photoUrl" 
                      [alt]="h.nameMr"
                      class="w-full h-full object-cover object-top rounded-2xl transition duration-500 group-hover/pic:scale-105"
                      (error)="onPhotoError(h.id)"
                    />
                  } @else {
                    <div 
                      class="w-full h-full rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-inner font-devanagari relative overflow-hidden"
                      [style.background]="getAvatarGradient(idx)"
                    >
                      <div class="w-14 h-14 rounded-2xl border-2 border-amber-300/40 flex items-center justify-center bg-white/15 backdrop-blur-xs shadow-inner">
                        <span class="text-3xl sm:text-4xl font-black text-amber-200 drop-shadow-md">{{ h.fallbackInitial }}</span>
                      </div>
                      <span class="text-[9.5px] font-bold text-amber-200/90 tracking-wider uppercase mt-1">
                        {{ h.icon }} {{ mandalData.t('मार्गदर्शक', 'Mentor') }}
                      </span>
                    </div>
                  }
                </div>

                <!-- Floating Role Icon Badge -->
                <div class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 border-2 border-white shadow-md flex items-center justify-center text-sm">
                  {{ h.icon }}
                </div>
              </div>

              <!-- Identity & Titles (Strictly below the photo) -->
              <div class="w-full space-y-1.5 pb-4 border-b border-amber-100">
                <div class="text-[10px] sm:text-[10.5px] uppercase font-extrabold tracking-widest text-amber-800 font-devanagari">
                  {{ mandalData.t('परिसराचे आदरस्थान', 'Colony Pride & Pillar') }}
                </div>
                
                <h3 class="text-xl sm:text-2xl font-black text-[#991b1b] font-devanagari leading-tight">
                  {{ mandalData.isEnglish() ? h.nameEn : h.nameMr }}
                </h3>

                <!-- Prominent Affectionate Title Pill -->
                <div class="pt-0.5">
                  <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-300 text-[#78350f] font-black text-xs sm:text-sm font-devanagari shadow-2xs">
                    <span>❤️</span>
                    <span>{{ mandalData.isEnglish() ? h.affectionateTitleEn : h.affectionateTitleMr }}</span>
                  </span>
                </div>

                <div class="text-xs font-bold text-slate-800 font-devanagari pt-1">
                  {{ mandalData.isEnglish() ? h.roleEn : h.roleMr }}
                </div>

                <div class="text-[11px] text-slate-500 font-semibold font-devanagari">
                  📍 {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ, शिव स्फूर्ती, जोगेश्वरी (प)', 'Shree Ashtavinayak Mitra Mandal, Shiv Sphurti, Jogeshwari (W)') }}
                </div>
              </div>

            </div>

            <!-- Card Body Content (Key Highlights & Quote) -->
            <div class="p-5 sm:p-6 pt-4 space-y-4 flex-1 flex flex-col justify-between">
              
              <!-- Core Highlights / Contributions Bullets -->
              <div class="space-y-2.5 flex-1">
                <div class="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 font-devanagari flex items-center gap-1.5">
                  <span>🎖️</span>
                  <span>{{ mandalData.t('विशेष योगदान व कार्य:', 'Key Contribution & Significance:') }}</span>
                </div>
                
                @if (mandalData.isEnglish()) {
                  @for (hl of h.keyHighlightsEn; track hl.title) {
                    <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-50 transition">
                      <span class="text-base shrink-0 mt-0.5">{{ hl.icon }}</span>
                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-black text-slate-900 leading-tight">{{ hl.title }}</div>
                        <div class="text-[11.5px] text-slate-700 leading-relaxed mt-0.5">{{ hl.desc }}</div>
                      </div>
                    </div>
                  }
                } @else {
                  @for (hl of h.keyHighlightsMr; track hl.title) {
                    <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-50 transition">
                      <span class="text-base shrink-0 mt-0.5">{{ hl.icon }}</span>
                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-black text-slate-900 font-devanagari leading-tight">{{ hl.title }}</div>
                        <div class="text-[11.5px] text-slate-700 font-devanagari leading-relaxed mt-0.5">{{ hl.desc }}</div>
                      </div>
                    </div>
                  }
                }
              </div>

              <!-- Dedicated Gratitude Slogan Card -->
              <div class="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 p-3.5 sm:p-4 rounded-2xl border-l-4 border-[#991b1b] shadow-2xs">
                <div class="text-[10px] uppercase font-bold text-red-900 font-devanagari tracking-wide flex items-center gap-1">
                  <span>💬</span>
                  <span>{{ mandalData.t('मंडळातर्फे मनःपूर्वक कृतज्ञता:', 'Gratitude from the Mandal:') }}</span>
                </div>
                <div class="text-xs sm:text-xs font-bold text-slate-900 font-devanagari mt-1 leading-relaxed italic">
                  ❝ {{ mandalData.isEnglish() ? h.specialContributionEn : h.specialContributionMr }} ❞
                </div>
              </div>

            </div>

            <!-- Card Bottom Footer / Respect Tag -->
            <div class="bg-gradient-to-b from-transparent to-amber-50/90 px-5 py-3 border-t border-amber-200/80 flex items-center justify-between text-xs font-devanagari">
              <span class="text-amber-950 font-bold flex items-center gap-1.5">
                <span>🚩</span>
                <span>{{ mandalData.t('अष्टविनायक परिवार ऋणी आहे', 'Ashtavinayak Family is Grateful') }}</span>
              </span>
              <span class="text-amber-800 font-bold text-[11px] bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                {{ h.icon }} {{ mandalData.isEnglish() ? h.badgeEn : h.badgeMr }}
              </span>
            </div>

          </div>
        }
      </div>

      <!-- ================= BOTTOM CULTURAL PLEDGE BANNER ================= -->
      <div class="bg-gradient-to-r from-orange-950 via-amber-900 to-red-950 rounded-3xl p-6 sm:p-8 text-white text-center shadow-lg border border-amber-500/30 space-y-3">
        <div class="text-2xl sm:text-3xl">🙏 🕉️ 🙏</div>
        <h3 class="text-xl sm:text-2xl font-black font-devanagari text-amber-200">
          {{ mandalData.t('॥ सहकार्याची साथ आणि परंपरेचा वारसा ॥', '॥ United in Fellowship, Rooted in Cultural Heritage ॥') }}
        </h3>
        <p class="text-xs sm:text-sm text-amber-100 max-w-3xl mx-auto font-devanagari leading-relaxed">
          {{ mandalData.t(
            'श्री अष्टविनायक मित्र मंडळाच्या गेल्या २८ वर्षांच्या दैदिप्यमान प्रवासात ज्या ज्या हातांनी मदतीचा हात पुढे केला, ज्यांनी मार्गदर्शनाचे दीप प्रज्वलित केले, त्या प्रत्येकाचे योगदान हे मंडळाच्या मंदिरातील एकेका दगडाप्रमाणे मजबूत आहे. सर्व देणगीदार, कार्यकर्ते व हितचिंतकांचे मनःपूर्वक शतशः आभार!',
            'In the glorious 28-year journey of Shree Ashtavinayak Mitra Mandal, every helping hand and guiding beacon serves as an unshakeable foundation stone of our community temple. We extend our deepest, heartfelt gratitude to every donor, volunteer, and well-wisher!'
          ) }}
        </p>

        <!-- Quick Route Actions -->
        <div class="pt-3 flex flex-wrap items-center justify-center gap-3">
          <a
            routerLink="/manogat"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs font-devanagari transition shadow-sm"
          >
            👑 {{ mandalData.t('मान्यवरांचे मनोगत वाचा', 'Read Dignitary Messages') }}
          </a>
          <a
            routerLink="/about"
            class="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-xs font-devanagari border border-white/30 transition shadow-sm"
          >
            📋 {{ mandalData.t('नोंदणीकृत सभासद यादी पहा', 'View Registered Members List') }}
          </a>
          <a
            routerLink="/"
            class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-200 font-bold text-xs font-devanagari border border-amber-400/30 transition shadow-sm"
          >
            🏠 {{ mandalData.t('मुख्यपृष्ठावर जा', 'Return to Home') }}
          </a>
        </div>
      </div>

    </div>
  `
})
export class VisheshAabharComponent {
  readonly mandalData = inject(MandalDataService);

  // Photo error tracking
  readonly photoErrors = signal<{ [key: string]: boolean }>({});

  readonly honorees: GratitudeHonoree[] = [
    {
      id: 'sameer-gawade',
      nameMr: 'श्री. समीर गावडे',
      nameEn: 'Shri. Sameer Gawade',
      affectionateTitleMr: 'मंडळाचे व्हिजनरी नेतृत्व व दिशादर्शक',
      affectionateTitleEn: 'Visionary Strategist & Master Planner',
      roleMr: 'मुख्य नियोजक, मार्गदर्शक व ध्येय समन्वयक',
      roleEn: 'Chief Strategist, Mentor & Inclusive Decision Maker',
      badgeMr: 'व्हिजनरी नेतृत्व',
      badgeEn: 'Visionary Leader',
      icon: '🎯',
      photoUrl: '/Sabhasad/Sameer%20Gawade.jpeg',
      fallbackInitial: 'स',
      avatarBg: '#1e3a8a',
      keyHighlightsMr: [
        {
          icon: '🧭',
          title: 'मंडळाचे परिपूर्ण व शिस्तबद्ध नियोजन',
          desc: 'उत्सवाची पूर्वतयारी, कामांची चोख विभागणी, वेळ व्यवस्थापन आणि प्रत्येक उपक्रमाची रूपरेषा अत्यंत सूक्ष्मपणे आणि अचूकपणे आखणारे कुशल नियोजक.'
        },
        {
          icon: '💡',
          title: 'नवीन विचार, अभिनव संकल्पना व आधुनिक ध्येये (Vision)',
          desc: 'मंडळाला काळाच्या पुढे नेणारे आधुनिक विचार, डिजिटल तंत्रज्ञानाचा वापर, पर्यावरणपूरक उत्सव आणि समाजोपयोगी ध्येये सातत्याने देणारे दूरदृष्टी विचारवंत.'
        },
        {
          icon: '🤝',
          title: 'सर्वांना सोबत घेऊन शांत व योग्य निर्णय',
          desc: 'ज्येष्ठ, तरुण व सर्व घटकांना विश्वासात घेऊन कोणत्याही जटिल प्रसंगात निःपक्षपाती, संतुलित आणि परिपक्व निर्णय घेण्याची अद्वितीय क्षमता.'
        }
      ],
      keyHighlightsEn: [
        {
          icon: '🧭',
          title: 'Flawless Strategy & Meticulous Planning',
          desc: 'Masterfully architecting festival schedules, volunteer responsibilities, logistical timelines, and discipline with exceptional precision.'
        },
        {
          icon: '💡',
          title: 'Innovative Thinking & Progressive Vision',
          desc: 'Infusing modern concepts, digital innovations, eco-friendly celebrations, and high community goals to propel the Mandal into the future.'
        },
        {
          icon: '🤝',
          title: 'Inclusive Leadership & Balanced Decisions',
          desc: 'Bringing everyone together in harmony and rendering wise, composed, and unbiased decisions in every challenging situation.'
        }
      ],
      specialContributionMr: 'समीर गावडेंचे कल्पक व्हिजन, आधुनिक विचार आणि सर्वांना प्रेमाने सोबत घेऊन अचूक निर्णय देण्याची क्षमता यामुळेच मंडळाने यशाची नवी शिखरे गाठली आहेत!',
      specialContributionEn: 'Sameer Gawade\'s visionary foresight, progressive concepts, and inclusive wisdom in uniting everyone have guided our Mandal to soaring heights of success!'
    },
    {
      id: 'anil-kamble',
      nameMr: 'श्री. अनिल कांबळे',
      nameEn: 'Shri. Anil Kamble',
      affectionateTitleMr: 'आमचे आदरणीय "अनिल भाई"',
      affectionateTitleEn: 'Our Beloved "Anil Bhai"',
      roleMr: 'ज्येष्ठ सल्लागार व संकटमोचक आधारस्तंभ',
      roleEn: 'Senior Advisor & Steely Pillar of Financial Support',
      badgeMr: 'आमचे "अनिल भाई"',
      badgeEn: 'Beloved "Anil Bhai"',
      icon: '🤝',
      photoUrl: '/Sabhasad/Anil%20Kamble.jpeg',
      fallbackInitial: 'अ',
      avatarBg: '#b45309',
      keyHighlightsMr: [
        {
          icon: '💰',
          title: 'वेळोवेळी तत्पर आर्थिक सहकार्य',
          desc: 'उत्सवाची तयारी असो किंवा अचानक उद्भवलेली तातडीची गरज, कोणतीही अडचण आल्यास न मागता क्षणाचाही विलंब न करता तत्परतेने आर्थिक मदत उभी करणारे व्यक्तिमत्त्व.'
        },
        {
          icon: '❤️',
          title: 'सख्या मोठ्या भावासारखे प्रेम ("अनिल भाई")',
          desc: 'मंडळातील प्रत्येक लहान-मोठ्या कार्यकर्त्यावर कुटुंबातील सदस्याप्रमाणे माया करणे आणि योग्य मार्गदर्शन देऊन पाठीवर कौतुकाची थाप देणे.'
        },
        {
          icon: '🛡️',
          title: '२५+ वर्षांची अविरत खंबीर साथ',
          desc: 'मंडळाच्या सुरुवातीच्या काळापासून आजतागायत प्रत्येक चढ-उतारात कार्यकर्त्यांच्या पाठीशी अभेद्य ढाल बनून उभे राहणारे मंडळाचे आधारस्तंभ.'
        }
      ],
      keyHighlightsEn: [
        {
          icon: '💰',
          title: 'Instant Financial Support Whenever Needed',
          desc: 'Always at the forefront to provide generous and instantaneous financial backing at crucial moments, ensuring festival planning never halts.'
        },
        {
          icon: '❤️',
          title: 'Fraternal Affection as "Anil Bhai"',
          desc: 'Endearingly addressed as "Anil Bhai" by every youth and elder across the colony, offering genuine elder-brotherly care and warm encouragement.'
        },
        {
          icon: '🛡️',
          title: 'Unwavering 25+ Years of Association',
          desc: 'Standing tall as an unbreakable shield beside our volunteers through every milestone and challenge since the Mandal\'s inception.'
        }
      ],
      specialContributionMr: 'उत्सवात पैशांची कमतरता कधीही भासू न देता, हक्काने कार्यकर्त्यांना ताकद देणारे आमचे आदरणीय अनिल भाई हे श्री अष्टविनायक मित्र मंडळाचा खरा प्राण आहेत!',
      specialContributionEn: 'Ensuring that financial constraints never impede our devotion, our beloved Anil Bhai empowers every volunteer with unconditional brotherly love and strength!'
    },
    {
      id: 'sanjay-kamble',
      nameMr: 'श्री. संजय कांबळे',
      nameEn: 'Shri. Sanjay Kamble',
      affectionateTitleMr: 'सर्वांचे लाडके "काका"',
      affectionateTitleEn: 'Our Beloved "Kaka"',
      roleMr: 'ज्येष्ठ सल्लागार व उत्सवांचे मुख्य पाठीराखे',
      roleEn: 'Senior Advisor & Chief Patron of Mega Festivals',
      badgeMr: 'आमचे लाडके "काका"',
      badgeEn: 'Beloved "Kaka"',
      icon: '🌸',
      photoUrl: '/Sabhasad/Sanjay%20Kamble.jpeg',
      fallbackInitial: 'सं',
      avatarBg: '#0f766e',
      keyHighlightsMr: [
        {
          icon: '🕉️',
          title: 'गणेशोत्सव व नवरात्रोत्सवात भरीव आर्थिक साहाय्य',
          desc: 'मंडळाच्या दोन्ही प्रमुख महाउत्सवांत—सार्वजनिक गणेशोत्सव आणि आदिशक्ती नवरात्रोत्सव—दरवर्षी न चुकता मोठ्या प्रमाणावर मोकळ्या हाताने आर्थिक पाठबळ.'
        },
        {
          icon: '👨‍🦳',
          title: 'आदर्श नगरातील सर्वांचे लाडके "काका"',
          desc: 'शिव स्फूर्ती व आदर्श नगरातील लहान मुलांपासून ज्येष्ठांपर्यंत सर्वजण त्यांना अत्यंत आदराने आणि आपुलकीने "काका" म्हणूनच हाक मारतात.'
        },
        {
          icon: '🌺',
          title: 'उत्सवाच्या परंपरेचे पितृतुल्य संरक्षक',
          desc: 'मंडप, विद्युत रोषणाई, अखंड पूजाविधी आणि महाप्रसादाचा भव्य भंडारा या सर्वांमध्ये त्यांचा पितृतुल्य वावर कार्यकर्त्यांना मोठा धीर देतो.'
        }
      ],
      keyHighlightsEn: [
        {
          icon: '🕉️',
          title: 'Substantial Aid for Ganeshotsav & Navratri',
          desc: 'Magnanimously funding both premier annual festivals—Sarvajanik Ganeshotsav and Navratri—year after year to uphold festival magnificence.'
        },
        {
          icon: '👨‍🦳',
          title: 'Affectionately Known by All as "Kaka"',
          desc: 'Revered with deep affection as "Kaka" by children, youth, mothers, and elders throughout Shiv Sphurti and Adarsh Nagar.'
        },
        {
          icon: '🌺',
          title: 'Fatherly Patron of Sacred Celebrations',
          desc: 'Providing paternal supervision and moral strength across pandal arrangements, lighting, puja ceremonies, and grand community meals.'
        }
      ],
      specialContributionMr: 'गणेशोत्सवाचा गजर असो वा नवरात्रोत्सवाचा जागर, काकांची भरघोस आर्थिक मदत आणि पितृतुल्य आशीर्वाद हीच अष्टविनायक मंडळाची खरी संपत्ती आहे!',
      specialContributionEn: 'Be it the resonance of Ganeshotsav or the divine glow of Navratri, Kaka\'s generous financial benevolence and fatherly blessings form our greatest wealth!'
    }
  ];

  getHeaderGradient(idx: number): string {
    const gradients = [
      'linear-gradient(135deg, #b45309 0%, #d97706 50%, #78350f 100%)',
      'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #115e59 100%)',
      'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #172554 100%)'
    ];
    return gradients[idx % gradients.length];
  }

  getAvatarGradient(idx: number): string {
    const gradients = [
      'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)',
      'linear-gradient(135deg, #115e59 0%, #0f766e 50%, #14b8a6 100%)',
      'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)'
    ];
    return gradients[idx % gradients.length];
  }

  onPhotoError(id: string) {
    this.photoErrors.update(map => ({ ...map, [id]: true }));
  }
}
