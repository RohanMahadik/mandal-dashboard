import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

interface ContactPerson {
  nameMr: string;
  nameEn: string;
  roleMr: string;
  roleEn: string;
  phone: string;
  rawPhone: string; // for tel: and wa.me
  badgeMr: string;
  badgeEn: string;
  avatarBg: string;
}

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 pb-10 animate-fade-in font-devanagari">
      
      <!-- ================= HERO HEADER BANNER ================= -->
      <div class="bg-gradient-to-r from-amber-700 via-orange-700 to-rose-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        
        <!-- Decorative Vector Watermark -->
        <div class="absolute -right-6 -bottom-10 opacity-15 pointer-events-none select-none text-9xl">
          🕉️
        </div>

        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1.5 max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/30 backdrop-blur-md rounded-full text-xs font-bold text-amber-200 border border-amber-300/40">
              <span>🤝</span>
              <span>{{ mandalData.t('मंडळ संपर्क व सहकार्य केंद्र', 'Mandal Support & Connect Center') }}</span>
              <span>•</span>
              <span>{{ mandalData.t('स्थापना वर्ष १९९७', 'Est. 1997') }}</span>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
              {{ mandalData.t('महत्त्वाचे संपर्क व सहकार्य कक्ष', 'Important Contacts & Support Hub') }}
            </h1>

            <p class="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-normal font-sans">
              {{ mandalData.t(
                'उत्सवातील देणगी, अन्नदान महाप्रसाद, प्रायोजकत्व जाहिराती आणि मंडळाच्या समाजोपयोगी उपक्रमांसाठी खालील अधिकृत विभाग प्रमुखांशी थेट संपर्क साधा.',
                'Connect directly with our authorized department leads for festival donations, Mahaprasad grains, sponsorship banners, and media queries.'
              ) }}
            </p>
          </div>

          <!-- Quick Navigation Back to Dashboard -->
          <a
            routerLink="/"
            class="self-start md:self-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl border border-white/30 backdrop-blur-md transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>←</span>
            <span>{{ mandalData.t('मुख्य डॅशबोर्ड', 'Back to Dashboard') }}</span>
          </a>
        </div>

      </div>

      <!-- ================= 4 ORGANIZED CONTACT SECTIONS ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- ================= SECTION 1: DONATION & CONTRIBUTION DESK ================= -->
        <div class="bg-white rounded-3xl shadow-sm border-2 border-emerald-200 p-5 sm:p-6 space-y-5 flex flex-col justify-between hover:border-emerald-400 transition">
          
          <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  🪙
                </div>
                <div>
                  <span class="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    {{ mandalData.t('विभाग १: अधिकृत देणगी व पावती', 'Section 1: Official Donations & Tax Receipt') }}
                  </span>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {{ mandalData.t('देणगी व देणगीदार मदत संपर्क', 'Donation & Contribution Desk') }}
                  </h2>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                {{ mandalData.t('८०जी सवलत', '80G Verified') }}
              </span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed font-sans">
              {{ mandalData.t(
                'श्री अष्टविनायक मित्र मंडळाच्या गणेशोत्सव, नवरात्र व डॉ. आंबेडकर जयंती उत्सवासाठी देणगी थेट बँक खाते किंवा UPI द्वारे सुरक्षितपणे पाठवा. पावतीसाठी संपर्क करा.',
                'Make secure festival contributions directly via Official UPI or Bank NEFT/RTGS with verified computerized receipts.'
              ) }}
            </p>

            <!-- Bank & UPI Fast-Action Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              <!-- UPI ID Box -->
              <div class="bg-emerald-50/70 border border-emerald-300/80 rounded-2xl p-3.5 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                    <span>📲</span>
                    <span>{{ mandalData.t('अधिकृत UPI आयडी', 'Official UPI ID') }}</span>
                  </span>
                  <span class="text-[10px] text-emerald-700 font-bold">BHIM / GPay</span>
                </div>
                <div class="flex items-center justify-between gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200">
                  <code class="text-xs font-mono font-bold text-slate-900 truncate">ashtavinayak.jogeshwari&#64;upi</code>
                  <button
                    (click)="copyText('ashtavinayak.jogeshwari@upi', 'upi')"
                    class="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition cursor-pointer"
                    title="Copy UPI"
                  >
                    {{ copiedKey() === 'upi' ? '✓' : '📋' }}
                  </button>
                </div>
                @if (copiedKey() === 'upi') {
                  <span class="text-[10px] text-emerald-700 font-bold block animate-fade-in">✓ {{ mandalData.t('UPI आयडी कॉपी झाली!', 'UPI Copied!') }}</span>
                }
              </div>

              <!-- Bank Account Box -->
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-700">
                <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                  <span class="font-bold text-slate-900">{{ mandalData.t('बँक ऑफ महाराष्ट्र', 'Bank of Maharashtra') }}</span>
                  <span class="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold">{{ mandalData.t('चालू खाते', 'Current') }}</span>
                </div>
                <div class="font-mono text-[11px] text-slate-800">
                  A/C: <span class="font-bold">60234567890</span>
                </div>
                <div class="font-mono text-[11px] text-slate-600">
                  IFSC: <span class="font-bold">MAHB0000123</span>
                </div>
              </div>

            </div>

            <!-- Coordinator Cards -->
            <div class="space-y-2.5 pt-2">
              <span class="text-xs font-bold text-slate-800 block">
                {{ mandalData.t('देणगी व पावती समन्वय अधिकारी:', 'Donation & Receipt Coordinators:') }}
              </span>

              @for (p of donationCoordinators; track p.rawPhone) {
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0" [style.backgroundColor]="p.avatarBg">
                      {{ mandalData.isEnglish() ? p.nameEn.charAt(0) : (p.nameMr.charAt(4) || p.nameMr.charAt(0)) }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900 leading-snug">
                        {{ mandalData.isEnglish() ? p.nameEn : p.nameMr }}
                      </div>
                      <div class="text-[11px] text-emerald-700 font-semibold">
                        {{ mandalData.isEnglish() ? p.roleEn : p.roleMr }}
                      </div>
                      <div class="text-[11px] font-mono text-slate-600 font-bold">
                        {{ mandalData.formatPhone(p.phone) }}
                      </div>
                    </div>
                  </div>

                  <!-- Quick Action Buttons -->
                  <div class="flex items-center gap-2 self-end sm:self-center">
                    <a
                      [href]="'tel:' + p.rawPhone"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition active:scale-95"
                    >
                      <span>📞</span>
                      <span>{{ mandalData.t('कॉल', 'Call') }}</span>
                    </a>
                    <a
                      [href]="'https://wa.me/' + p.rawPhone + '?text=' + encodeMessage('जय गणेश! मला मंडळाच्या उत्सवासाठी वर्गणी/देणगी द्यायची आहे.')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-sans">
            <span>🛡️</span>
            <span>{{ mandalData.t('सर्व पावत्या अधिकृत 80G आयकर सवलतीस पात्र आहेत.', 'All donations receive official 80G tax exemption receipts.') }}</span>
          </div>

        </div>

        <!-- ================= SECTION 2: BHANDARA / MAHAPRASAD TEAM ================= -->
        <div class="bg-white rounded-3xl shadow-sm border-2 border-amber-200 p-5 sm:p-6 space-y-5 flex flex-col justify-between hover:border-amber-400 transition">
          
          <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  🍲
                </div>
                <div>
                  <span class="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    {{ mandalData.t('विभाग २: महाप्रसाद व अन्नदान', 'Section 2: Mahaprasad & Food Grain Offerings') }}
                  </span>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {{ mandalData.t('भंडारा / महाप्रसाद व्यवस्थापन', 'Bhandara / Mahaprasad Team') }}
                  </h2>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                {{ mandalData.t('अन्नदान सेवा', 'Annadaan') }}
              </span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed font-sans">
              {{ mandalData.t(
                'गणेशोत्सव व नवरात्रोत्सवाच्या महाप्रसाद भंडारासाठी अन्नधान्य, तेल, तूप, साखर व किराणा साहित्य अर्पण करू इच्छिणाऱ्या भाविकांनी खालील प्रमुखांशी संपर्क साधावा.',
                'Devotees wishing to contribute food grains, oil, sugar, spices, or grocery provisions for the Grand Festive Bhandara may contact our team.'
              ) }}
            </p>

            <!-- Accepted Items Pills -->
            <div class="space-y-2 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
              <div class="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <span>🌾</span>
                <span>{{ mandalData.t('स्वीकारले जाणारे प्रमुख साहित्य:', 'Key Accepted Provisions:') }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                @for (item of groceryItems; track item) {
                  <span class="px-2.5 py-1 bg-white border border-amber-200 text-slate-800 text-[11px] font-bold rounded-lg shadow-2xs">
                    {{ item }}
                  </span>
                }
              </div>
            </div>

            <!-- Coordinator Cards -->
            <div class="space-y-2.5 pt-2">
              <span class="text-xs font-bold text-slate-800 block">
                {{ mandalData.t('भंडारा व्यवस्थापन प्रमुख:', 'Bhandara Management In-Charges:') }}
              </span>

              @for (p of bhandaraCoordinators; track p.rawPhone) {
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0" [style.backgroundColor]="p.avatarBg">
                      {{ mandalData.isEnglish() ? p.nameEn.charAt(0) : (p.nameMr.charAt(4) || p.nameMr.charAt(0)) }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900 leading-snug">
                        {{ mandalData.isEnglish() ? p.nameEn : p.nameMr }}
                      </div>
                      <div class="text-[11px] text-amber-700 font-semibold">
                        {{ mandalData.isEnglish() ? p.roleEn : p.roleMr }}
                      </div>
                      <div class="text-[11px] font-mono text-slate-600 font-bold">
                        {{ mandalData.formatPhone(p.phone) }}
                      </div>
                    </div>
                  </div>

                  <!-- Quick Action Buttons -->
                  <div class="flex items-center gap-2 self-end sm:self-center">
                    <a
                      [href]="'tel:' + p.rawPhone"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition active:scale-95"
                    >
                      <span>📞</span>
                      <span>{{ mandalData.t('कॉल', 'Call') }}</span>
                    </a>
                    <a
                      [href]="'https://wa.me/' + p.rawPhone + '?text=' + encodeMessage('जय गणेश! मला महाप्रसाद भंडाऱ्यासाठी अन्नधान्य/किराणा साहित्य अर्पण करायचे आहे.')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-sans">
            <span>📍</span>
            <span>{{ mandalData.t('साहित्य संकलन स्थळ: श्री अष्टविनायक कार्यालय, शिव स्फूर्ती प्रांगण, जोगेश्वरी (प).', 'Collection Point: Mandal Office, Shiv Sphurti Compound, Jogeshwari (W).') }}</span>
          </div>

        </div>

        <!-- ================= SECTION 3: SPONSORSHIP & ADVERTISING ================= -->
        <div class="bg-white rounded-3xl shadow-sm border-2 border-blue-200 p-5 sm:p-6 space-y-5 flex flex-col justify-between hover:border-blue-400 transition">
          
          <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  📢
                </div>
                <div>
                  <span class="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">
                    {{ mandalData.t('विभाग ३: व्यावसायिक प्रायोजकत्व व जाहिराती', 'Section 3: Commercial Sponsorships & Display Ads') }}
                  </span>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {{ mandalData.t('जाहिरात व प्रायोजक संपर्क', 'Sponsorship & Advertising') }}
                  </h2>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-blue-100 text-blue-900 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                {{ mandalData.t('ब्रँडिंग संधी', 'High Visibility') }}
              </span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed font-sans">
              {{ mandalData.t(
                'उत्सव मंडप प्रवेशद्वार कमानी, मुख्य स्टेज बॅकड्रॉप, भव्य LED स्क्रीन व्हिडिओ जाहिराती आणि डिजिटल स्मरणिकेतील प्रायोजकत्वासाठी संपर्क साधा.',
                'Promote your brand to 50,000+ devotees via Main Welcome Arches, Stage Backdrops, High-Definition LED Display Ads, and Souvenir pages.'
              ) }}
            </p>

            <!-- Sponsorship Slots Pills -->
            <div class="grid grid-cols-2 gap-2 bg-blue-50/50 p-3 rounded-2xl border border-blue-200 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-slate-800">
                <span>🚩</span>
                <span>{{ mandalData.t('भव्य मुख्य कमान बॅनर', 'Main Arch Banner') }}</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold text-slate-800">
                <span>🖥️</span>
                <span>{{ mandalData.t('LED स्क्रीन डिजिटल जाहिरात', 'LED Screen Ads') }}</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold text-slate-800">
                <span>🎪</span>
                <span>{{ mandalData.t('स्टेज बॅकड्रॉप ब्रँडिंग', 'Stage Backdrop') }}</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold text-slate-800">
                <span>📖</span>
                <span>{{ mandalData.t('रंगीत वार्षिक स्मरणिका पान', 'Annual Souvenir Page') }}</span>
              </div>
            </div>

            <!-- Coordinator Cards -->
            <div class="space-y-2.5 pt-2">
              <span class="text-xs font-bold text-slate-800 block">
                {{ mandalData.t('जाहिरात व प्रायोजक प्रमुख:', 'Sponsorship & Branding Leads:') }}
              </span>

              @for (p of sponsorCoordinators; track p.rawPhone) {
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0" [style.backgroundColor]="p.avatarBg">
                      {{ mandalData.isEnglish() ? p.nameEn.charAt(0) : (p.nameMr.charAt(4) || p.nameMr.charAt(0)) }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900 leading-snug">
                        {{ mandalData.isEnglish() ? p.nameEn : p.nameMr }}
                      </div>
                      <div class="text-[11px] text-blue-700 font-semibold">
                        {{ mandalData.isEnglish() ? p.roleEn : p.roleMr }}
                      </div>
                      <div class="text-[11px] font-mono text-slate-600 font-bold">
                        {{ mandalData.formatPhone(p.phone) }}
                      </div>
                    </div>
                  </div>

                  <!-- Quick Action Buttons -->
                  <div class="flex items-center gap-2 self-end sm:self-center">
                    <a
                      [href]="'tel:' + p.rawPhone"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition active:scale-95"
                    >
                      <span>📞</span>
                      <span>{{ mandalData.t('कॉल', 'Call') }}</span>
                    </a>
                    <a
                      [href]="'https://wa.me/' + p.rawPhone + '?text=' + encodeMessage('जय गणेश! मला श्री अष्टविनायक मित्र मंडळाच्या उत्सवात जाहिरात/प्रायोजकत्व घ्यायचे आहे.')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-sans">
            <span>📑</span>
            <span>{{ mandalData.t('अधिकृत दरपत्रक व कमान आकारमाप WhatsApp वर त्वरित पाठवले जाईल.', 'Official rate card and banner dimensions provided instantly on WhatsApp.') }}</span>
          </div>

        </div>

        <!-- ================= SECTION 4: SOCIAL MEDIA & PR TEAM ================= -->
        <div class="bg-white rounded-3xl shadow-sm border-2 border-purple-200 p-5 sm:p-6 space-y-5 flex flex-col justify-between hover:border-purple-400 transition">
          
          <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  📱
                </div>
                <div>
                  <span class="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">
                    {{ mandalData.t('विभाग ४: जनसंपर्क व डिजिटल प्रसिद्धी', 'Section 4: Public Relations & Social Media Cell') }}
                  </span>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {{ mandalData.t('सोशल मीडिया व प्रसिद्धी कक्ष', 'Social Media & PR Team') }}
                  </h2>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-purple-100 text-purple-900 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                {{ mandalData.t('डिजिटल कक्ष', 'Media Cell') }}
              </span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed font-sans">
              {{ mandalData.t(
                'दैनंदिन आरतीचे थेट प्रक्षेपण, उत्सव छायाचित्रे, सांस्कृतिक कार्यक्रमांचे अपडेट्स आणि अधिकृत प्रेस नोटसाठी आमचे डिजिटल चॅनेल फॉलो करा.',
                'Follow our official social media handles for Live Daily Aarti telecasts, festival photos, cultural competitions, and media releases.'
              ) }}
            </p>

            <!-- Social Media Channels Fast Action Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              
              <!-- Instagram -->
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-xs hover:scale-105 transition cursor-pointer"
              >
                <span class="text-base">📸</span>
                <span class="text-[11px] font-sans">Instagram</span>
                <span class="text-[9px] opacity-80 truncate w-full">&#64;ashtavinayak</span>
              </a>

              <!-- WhatsApp Community -->
              <a
                href="https://wa.me/919820144552?text=जय%20गणेश!%20मला%20मंडळाच्या%20ग्रुपमध्ये%20समाविष्ट%20करा"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-2xl bg-[#25D366] text-white font-bold text-xs flex flex-col items-center gap-1 shadow-xs hover:scale-105 transition cursor-pointer"
              >
                <span class="text-base">💬</span>
                <span class="text-[11px] font-sans">WhatsApp</span>
                <span class="text-[9px] opacity-80">{{ mandalData.t('ग्रुप जॉईन', 'Join Group') }}</span>
              </a>

              <!-- YouTube Live -->
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-xs hover:scale-105 transition cursor-pointer"
              >
                <span class="text-base">▶️</span>
                <span class="text-[11px] font-sans">YouTube</span>
                <span class="text-[9px] opacity-80">{{ mandalData.t('थेट आरती', 'Live Aarti') }}</span>
              </a>

              <!-- Facebook -->
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-2xl bg-[#1877F2] text-white font-bold text-xs flex flex-col items-center gap-1 shadow-xs hover:scale-105 transition cursor-pointer"
              >
                <span class="text-base">👥</span>
                <span class="text-[11px] font-sans">Facebook</span>
                <span class="text-[9px] opacity-80">Ashtavinayak</span>
              </a>

            </div>

            <!-- Coordinator Cards -->
            <div class="space-y-2.5 pt-2">
              <span class="text-xs font-bold text-slate-800 block">
                {{ mandalData.t('सोशल मीडिया व प्रसिद्धी प्रमुख:', 'Social Media & PR Coordinators:') }}
              </span>

              @for (p of prCoordinators; track p.rawPhone) {
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0" [style.backgroundColor]="p.avatarBg">
                      {{ mandalData.isEnglish() ? p.nameEn.charAt(0) : (p.nameMr.charAt(4) || p.nameMr.charAt(0)) }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-900 leading-snug">
                        {{ mandalData.isEnglish() ? p.nameEn : p.nameMr }}
                      </div>
                      <div class="text-[11px] text-purple-700 font-semibold">
                        {{ mandalData.isEnglish() ? p.roleEn : p.roleMr }}
                      </div>
                      <div class="text-[11px] font-mono text-slate-600 font-bold">
                        {{ mandalData.formatPhone(p.phone) }}
                      </div>
                    </div>
                  </div>

                  <!-- Quick Action Buttons -->
                  <div class="flex items-center gap-2 self-end sm:self-center">
                    <a
                      [href]="'tel:' + p.rawPhone"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition active:scale-95"
                    >
                      <span>📞</span>
                      <span>{{ mandalData.t('कॉल', 'Call') }}</span>
                    </a>
                    <a
                      [href]="'https://wa.me/' + p.rawPhone + '?text=' + encodeMessage('जय गणेश! मला मंडळाच्या प्रसिद्धी व सोशल मीडिया संदर्भात संपर्क करायचा आहे.')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-sans">
            <span>📡</span>
            <span>{{ mandalData.t('उत्सवातील सर्व थेट प्रक्षेपण YouTube व Facebook पेजवर HD दर्जात उपलब्ध असते.', 'All festive proceedings are streamed live in Full HD on YouTube and Facebook.') }}</span>
          </div>

        </div>

      </div>

    </div>
  `
})
export class ConnectComponent {
  readonly mandalData = inject(MandalDataService);
  readonly copiedKey = signal<string | null>(null);

  // Grocery items for Mahaprasad
  readonly groceryItems = [
    'बासमती तांदूळ (Basmati Rice)',
    'खाद्यतेल (Cooking Oil)',
    'साखर (Sugar)',
    'तूर व मूग डाळ (Pulses)',
    'साजूक तूप (Pure Ghee)',
    'गरम मसाले व हळद (Spices)',
    'गव्हाचे पीठ (Wheat Flour)',
    'सुकामेवा व काजू-बदाम (Dry Fruits)'
  ];

  // 1. Donation Desk Coordinators
  readonly donationCoordinators: ContactPerson[] = [
    {
      nameMr: 'श्री. गजानन वि. कांबळे',
      nameEn: 'Shri. Gajanan V. Kamble',
      roleMr: 'खजिनदार (मुख्य देणगी व हिशोब)',
      roleEn: 'Treasurer (Head of Donations)',
      phone: '+91 98201 44552',
      rawPhone: '919820144552',
      badgeMr: 'खजिनदार',
      badgeEn: 'Treasurer',
      avatarBg: '#059669'
    },
    {
      nameMr: 'श्री. राजेश एस. कदम',
      nameEn: 'Shri. Rajesh S. Kadam',
      roleMr: 'हिशोब तपासणीस (पावती समन्वयक)',
      roleEn: 'Accounts Auditor (Receipts)',
      phone: '+91 98690 77150',
      rawPhone: '919869077150',
      badgeMr: 'पावती कक्ष',
      badgeEn: 'Receipts',
      avatarBg: '#047857'
    }
  ];

  // 2. Bhandara / Mahaprasad Team Coordinators
  readonly bhandaraCoordinators: ContactPerson[] = [
    {
      nameMr: 'श्री. सचिन डी. पवार',
      nameEn: 'Shri. Sachin D. Pawar',
      roleMr: 'महाप्रसाद भंडारा प्रमुख',
      roleEn: 'Mahaprasad & Food Grain Head',
      phone: '+91 98331 22910',
      rawPhone: '919833122910',
      badgeMr: 'महाप्रसाद प्रमुख',
      badgeEn: 'Bhandara Head',
      avatarBg: '#d97706'
    },
    {
      nameMr: 'श्री. अमोल आर. सावंत',
      nameEn: 'Shri. Amol R. Sawant',
      roleMr: 'किराणा साहित्य संकलन प्रतिनिधी',
      roleEn: 'Grocery & Grain Logistics',
      phone: '+91 98192 33412',
      rawPhone: '919819233412',
      badgeMr: 'संकलन प्रतिनिधी',
      badgeEn: 'Logistics',
      avatarBg: '#b45309'
    }
  ];

  // 3. Sponsorship & Advertising Coordinators
  readonly sponsorCoordinators: ContactPerson[] = [
    {
      nameMr: 'श्री. विलास एम. पाटील',
      nameEn: 'Shri. Vilas M. Patil',
      roleMr: 'जाहिरात व प्रायोजकत्व प्रमुख',
      roleEn: 'Advertising & Sponsorship Head',
      phone: '+91 98214 88392',
      rawPhone: '919821488392',
      badgeMr: 'जाहिरात प्रमुख',
      badgeEn: 'Ads Head',
      avatarBg: '#2563eb'
    },
    {
      nameMr: 'श्री. सुधीर जी. देसाई',
      nameEn: 'Shri. Sudhir G. Desai',
      roleMr: 'व्यावसायिक संपर्क प्रतिनिधी',
      roleEn: 'Commercial PR & Vendor Liaison',
      phone: '+91 98205 66723',
      rawPhone: '919820566723',
      badgeMr: 'जनसंपर्क',
      badgeEn: 'Liaison',
      avatarBg: '#1d4ed8'
    }
  ];

  // 4. Social Media & PR Team Coordinators
  readonly prCoordinators: ContactPerson[] = [
    {
      nameMr: 'श्री. आदित्य व्ही. कदम',
      nameEn: 'Shri. Aditya V. Kadam',
      roleMr: 'सोशल मीडिया व डिजिटल प्रसिद्धी प्रमुख',
      roleEn: 'Social Media & Digital Media Lead',
      phone: '+91 98700 11234',
      rawPhone: '919870011234',
      badgeMr: 'डिजिटल प्रमुख',
      badgeEn: 'Digital Lead',
      avatarBg: '#7c3aed'
    },
    {
      nameMr: 'श्री. प्रथमेश एस. मोरे',
      nameEn: 'Shri. Prathamesh S. More',
      roleMr: 'लाईव्ह प्रक्षेपण व प्रसिद्धी प्रतिनिधी',
      roleEn: 'Live Streaming & Media Coordinator',
      phone: '+91 98675 44321',
      rawPhone: '919867544321',
      badgeMr: 'लाईव्ह प्रतिनिधी',
      badgeEn: 'Live Stream',
      avatarBg: '#6d28d9'
    }
  ];

  encodeMessage(msg: string): string {
    return encodeURIComponent(msg);
  }

  copyText(text: string, key: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copiedKey.set(key);
        setTimeout(() => this.copiedKey.set(null), 3000);
      });
    }
  }
}
