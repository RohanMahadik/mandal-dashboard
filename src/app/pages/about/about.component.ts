import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';
import { SabhasadMember, CommitteeMember } from '../../models/mandal.models';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 pb-10 animate-fade-in">
      
      <!-- Top Banner -->
      <div class="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-5">
          <img src="logo.jpg" alt="Logo" class="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400 shadow-lg shrink-0" />
          <div class="flex-1">
            <!-- Back to Dashboard Button -->
            <a
              routerLink="/"
              class="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 hover:text-white border border-white/20 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
              title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
            >
              <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
            </a>

            <div class="flex items-center justify-center sm:justify-start gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span>●</span>
              <span>{{ mandalData.t('संस्था परिचय व अधिकृत सभासद नोंदवही (स्थापना १९९७)', 'Organization Overview & Official Members Registry (Est. 1997)') }}</span>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ – जोगेश्वरी (पश्चिम)', 'Shree Ashtavinayak Mitra Mandal – Jogeshwari (West)') }}
            </h1>
            <div class="text-amber-200 text-xs md:text-sm font-semibold mt-0.5">
              {{ mandalData.t('शिव स्फुर्ति बिल्डिंग, आदर्श नगर, जोगेश्वरी - (प), मुंबई-४००१०२', 'Shiv Sphurti Bldg, Adarsh Nagar, Jogeshwari (W), Mumbai-400102') }}
            </div>
            <p class="text-amber-100 text-xs mt-1 font-bold">
              {{ mandalData.t('॥ परंपरेचा वारसा आम्ही जपतो, विघ्नहर्ताचा गजर आम्ही करतो ॥', '॥ Preserving Heritage & Cultural Devotion to Lord Ganesha ॥') }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= 1. मंडळाची माहिती (INTRODUCTORY SECTION) ================= -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 space-y-6">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black font-devanagari">
            <span>🚩</span>
            <span>{{ mandalData.t('संस्था परिचय व गौरवशाली इतिहास', 'Organization Profile & Historic Heritage') }}</span>
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-devanagari">
            {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ – जोगेश्वरी (पश्चिम)', 'Shree Ashtavinayak Mitra Mandal – Jogeshwari (West)') }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 font-devanagari leading-relaxed">
            {{ mandalData.t('सन १९९७ मध्ये स्थापन झालेले आमचे मंडळ जोगेश्वरी (पश्चिम) परिसरातील आदर्श नगर व शिव स्फूर्ती भागातील सामाजिक, सांस्कृतिक आणि धार्मिक एकात्मतेचे एक प्रमुख केंद्र आहे. गेल्या २९ वर्षांपासून अविरतपणे लोकसेवेचा वसा जपत भव्य सार्वजनिक गणेशोत्सव, शारदीय नवरात्रोत्सव आणि विविध लोकोपयोगी उपक्रम यशस्वीरीत्या साजरे केले जात आहेत.', 'Established in 1997, our Mandal serves as a premier cultural and social hub in Jogeshwari (West), fostering community unity across Adarsh Nagar and Shiv Sphurti. Over 29 glorious years, we have upheld an unbroken tradition of community service, grand Ganeshotsav, Navratri celebrations, and welfare drives.') }}
          </p>
        </div>

        <!-- 4 Thematic Information Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          
          <!-- Card 1: स्थापना व वारसा -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-white border border-amber-200 shadow-xs flex flex-col justify-between space-y-2.5">
            <div>
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-sm mb-2.5">
                🏛️
              </div>
              <h3 class="font-black text-slate-900 font-devanagari text-sm sm:text-base">
                {{ mandalData.t('स्थापना व वारसा (१९९७)', 'Foundation & Heritage (1997)') }}
              </h3>
              <p class="text-xs text-slate-600 font-devanagari leading-relaxed mt-1">
                {{ mandalData.t('शिव स्फूर्ती व आदर्श नगर भागातील मोजक्या तरुणांच्या प्रेरणेतून सन १९९७ मध्ये स्थापना. आज तब्बल २९ वर्षांचा गौरवशाली अखंड प्रवास.', 'Founded in 1997 by visionary local youth; today proudly completing 29 years of cultural heritage.') }}
              </p>
            </div>
            <span class="text-[11px] font-bold text-amber-800 font-devanagari pt-2 border-t border-amber-100 flex items-center gap-1">
              <span>✓</span>
              <span>{{ mandalData.t('रजि. न. १९२३ जी.वी.वी.एस.डी', 'Reg. No. 1923 GBVSD') }}</span>
            </span>
          </div>

          <!-- Card 2: धार्मिक व उत्सव प्रवास -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-50/90 to-white border border-red-200 shadow-xs flex flex-col justify-between space-y-2.5">
            <div>
              <div class="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl shadow-sm mb-2.5">
                🪔
              </div>
              <h3 class="font-black text-slate-900 font-devanagari text-sm sm:text-base">
                {{ mandalData.t('गणेशोत्सव व नवरात्रोत्सव', 'Ganeshotsav & Navratri') }}
              </h3>
              <p class="text-xs text-slate-600 font-devanagari leading-relaxed mt-1">
                {{ mandalData.t('भव्य सार्वजनिक गणेशोत्सव, ९ दिवसांचा भक्तिमय नवरात्रोत्सव, अखंड महाप्रसाद (भंडारा) आणि डॉ. बाबासाहेब आंबेडकर जयंतीचा अखंड उत्साह.', 'Grand public Ganeshotsav, 9-day Navratri devotion, continuous Mahaprasad, and Dr. Ambedkar Jayanti.') }}
              </p>
            </div>
            <span class="text-[11px] font-bold text-red-800 font-devanagari pt-2 border-t border-red-100 flex items-center gap-1">
              <span>✓</span>
              <span>{{ mandalData.t('परंपरेचा पवित्र वारसा', 'Sacred Cultural Tradition') }}</span>
            </span>
          </div>

          <!-- Card 3: समाजासाठी योगदान -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-white border border-emerald-200 shadow-xs flex flex-col justify-between space-y-2.5">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-sm mb-2.5">
                🤝
              </div>
              <h3 class="font-black text-slate-900 font-devanagari text-sm sm:text-base">
                {{ mandalData.t('समाजासाठी योगदान', 'Community Contribution') }}
              </h3>
              <p class="text-xs text-slate-600 font-devanagari leading-relaxed mt-1">
                {{ mandalData.t('रक्तदान शिबिरे, मोफत आरोग्य तपासणी, गरजू विद्यार्थ्यांना शैक्षणिक मदत आणि माता-भगिनींसाठी खेळ पैठणीचा कार्यक्रम.', 'Blood donation camps, health drives, student scholarships, and women empowerment events.') }}
              </p>
            </div>
            <span class="text-[11px] font-bold text-emerald-800 font-devanagari pt-2 border-t border-emerald-100 flex items-center gap-1">
              <span>✓</span>
              <span>{{ mandalData.t('अविरत समाजसेवा', 'Unbroken Public Service') }}</span>
            </span>
          </div>

          <!-- Card 4: पारदर्शक व्यवस्थापन -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-white border border-blue-200 shadow-xs flex flex-col justify-between space-y-2.5">
            <div>
              <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-sm mb-2.5">
                📊
              </div>
              <h3 class="font-black text-slate-900 font-devanagari text-sm sm:text-base">
                {{ mandalData.t('पारदर्शक हिशोब व पावत्या', 'Transparency & Receipts') }}
              </h3>
              <p class="text-xs text-slate-600 font-devanagari leading-relaxed mt-1">
                {{ mandalData.t('प्रत्येक वर्गणीदाराला संगणकीय अधिकृत पावती, ८०जी करसूट आणि सर्व हिशोबांचे वार्षिक पारदर्शक ताळेबंद सादरीकरण.', 'Computerized receipts for donors, 80G tax exemptions, and publicly audited annual financial balance sheets.') }}
              </p>
            </div>
            <span class="text-[11px] font-bold text-blue-800 font-devanagari pt-2 border-t border-blue-100 flex items-center gap-1">
              <span>✓</span>
              <span>{{ mandalData.t('१००% पारदर्शक कारभार', '100% Transparent Governance') }}</span>
            </span>
          </div>

        </div>

      </div>

      <!-- ================= 2. OFFICIAL PRINTED NOTICE: कार्यकारिणी मंडळ व सभासद (२०२५) ================= -->
      <div class="relative bg-gradient-to-b from-[#fffcf7] via-[#fffdf9] to-[#fff8f0] rounded-3xl shadow-xl border-4 border-[#b91c1c] p-4 sm:p-7 md:p-8 space-y-6 overflow-hidden">
        
        <!-- Authentic Decorative Inner Hairline Frame -->
        <div class="absolute inset-2 sm:inset-3 border-1.5 border-[#b91c1c]/40 rounded-2xl pointer-events-none"></div>

        <!-- Top Corner Decorative Traditional Motifs -->
        <div class="absolute top-4 left-4 text-xs font-bold text-amber-800/60 font-devanagari select-none hidden sm:block">
          ॥ श्री गणेशाय नमः ॥
        </div>
        <div class="absolute top-4 right-4 text-xs font-bold text-amber-800/60 font-devanagari select-none hidden sm:block">
          ॥ स्थापना वर्ष १९९७ ॥
        </div>

        <!-- ================= TOP NOTICE HEADER ================= -->
        <div class="relative z-10 text-center space-y-2 pt-1 sm:pt-2">
          
          <!-- Namaste & Plaque Container -->
          <div class="flex items-center justify-center gap-3 sm:gap-6">
            <!-- Left Folded Hands Icon -->
            <div class="hidden sm:flex flex-col items-center justify-center text-amber-700/80 drop-shadow-sm select-none">
              <svg class="w-9 h-9 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.75 3a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V3zM9.75 4.5a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V4.5zM15.75 4.5a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V4.5zM6.75 7.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM18.75 7.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM5.25 13.5c0 4.5 3.36 8.25 7.5 8.25s7.5-3.75 7.5-8.25a.75.75 0 00-1.5 0c0 3.73-2.69 6.75-6 6.75s-6-3.02-6-6.75a.75.75 0 00-1.5 0z"/>
              </svg>
            </div>

            <!-- Authentic Red Header Plaque: कार्यकारिणी मंडळ - २०२५ -->
            <div class="relative px-6 sm:px-12 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#991b1b] text-white font-black text-lg sm:text-2xl md:text-3xl font-devanagari shadow-lg border-2 border-amber-300 flex items-center justify-center gap-3">
              <span class="w-3 h-3 rounded-full bg-white/90 shadow-xs shrink-0"></span>
              <span class="tracking-wide drop-shadow">{{ mandalData.t('कार्यकारिणी मंडळ ', 'Executive Committee - 2025') }}</span>
              <span class="w-3 h-3 rounded-full bg-white/90 shadow-xs shrink-0"></span>
            </div>

            <!-- Right Folded Hands Icon -->
            <div class="hidden sm:flex flex-col items-center justify-center text-amber-700/80 drop-shadow-sm select-none">
              <svg class="w-9 h-9 transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.75 3a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V3zM9.75 4.5a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V4.5zM15.75 4.5a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V4.5zM6.75 7.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM18.75 7.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM5.25 13.5c0 4.5 3.36 8.25 7.5 8.25s7.5-3.75 7.5-8.25a.75.75 0 00-1.5 0c0 3.73-2.69 6.75-6 6.75s-6-3.02-6-6.75a.75.75 0 00-1.5 0z"/>
              </svg>
            </div>
          </div>

          <p class="text-xs sm:text-sm font-semibold text-amber-900 font-devanagari max-w-xl mx-auto">
            {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ • शिव स्फूर्ती, आदर्श नगर, जोगेश्वरी (पश्चिम), मुंबई - ४००१०२', 'Shree Ashtavinayak Mitra Mandal • Shiv Sphurti, Adarsh Nagar, Jogeshwari (W), Mumbai - 400102') }}
          </p>
        </div>

        <!-- ================= 1. KEY 3 OFFICE BEARERS (अध्यक्ष, सेक्रेटरी, खजिनदार) ================= -->
        <div class="relative z-10 pt-2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            
            <!-- 1. बाळासाहेब यादव - अध्यक्ष -->
            <div 
              (click)="openCommitteeMemberCard('president')"
              class="bg-gradient-to-b from-white to-amber-50/70 rounded-2xl p-4 sm:p-5 border-2 border-red-200 shadow-sm hover:shadow-md hover:border-red-400 transition-all text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
              title="ओळखपत्र (ID Card) पाहण्यासाठी क्लिक करा"
            >
              <div class="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-amber-400 mb-0.5 bg-amber-900 shrink-0 relative flex items-center justify-center">
                <span class="absolute inset-0 flex items-center justify-center text-amber-200 font-black text-2xl font-devanagari z-0">
                  {{ mandalData.isEnglish() ? 'B' : 'बा' }}
                </span>
                <img
                  [src]="formatPhotoPath('/Sabhasad/Balasaheb Yadav.jpg')"
                  alt=""
                  (error)="onPhotoError($event)"
                  class="relative z-10 w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 font-devanagari group-hover:text-red-900 transition">
                  {{ mandalData.isEnglish() ? 'Balasaheb Yadav' : 'बाळासाहेब यादव' }}
                </h3>
                <div class="mt-1">
                  <span class="inline-block px-3.5 py-1 rounded-full bg-[#991b1b] text-white font-black text-xs sm:text-sm font-devanagari tracking-wider shadow-2xs">
                    {{ mandalData.t('अध्यक्ष', 'President') }}
                  </span>
                </div>
              </div>
              <div class="text-[11px] font-medium text-slate-500 font-devanagari pt-1 border-t border-amber-200/60 w-full flex items-center justify-center gap-1">
                <span>{{ mandalData.t('श्री अष्टविनायक मित्र मंडळ', 'Shree Ashtavinayak Mitra Mandal') }}</span>
                <span class="text-xs text-amber-600">🪪</span>
              </div>
            </div>

            <!-- 2. शैलेश पैनला - सेक्रेटरी -->
            <div 
              (click)="openCommitteeMemberCard('secretary')"
              class="bg-gradient-to-b from-white to-amber-50/70 rounded-2xl p-4 sm:p-5 border-2 border-red-200 shadow-sm hover:shadow-md hover:border-red-400 transition-all text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
              title="ओळखपत्र (ID Card) पाहण्यासाठी क्लिक करा"
            >
              <div class="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-amber-400 mb-0.5 bg-emerald-900 shrink-0 relative flex items-center justify-center">
                <span class="absolute inset-0 flex items-center justify-center text-emerald-200 font-black text-2xl font-devanagari z-0">
                  {{ mandalData.isEnglish() ? 'S' : 'शै' }}
                </span>
                <img
                  [src]="formatPhotoPath('/Sabhasad/Shailesh Painla.jpeg')"
                  alt=""
                  (error)="onPhotoError($event)"
                  class="relative z-10 w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 font-devanagari group-hover:text-red-900 transition">
                  {{ mandalData.isEnglish() ? 'Shailesh Painla' : 'शैलेश पैनला' }}
                </h3>
                <div class="mt-1">
                  <span class="inline-block px-3.5 py-1 rounded-full bg-[#991b1b] text-white font-black text-xs sm:text-sm font-devanagari tracking-wider shadow-2xs">
                    {{ mandalData.t('सेक्रेटरी', 'Secretary') }}
                  </span>
                </div>
              </div>
              <div class="text-[11px] font-medium text-slate-500 font-devanagari pt-1 border-t border-amber-200/60 w-full flex items-center justify-center gap-1">
                <span>{{ mandalData.t('श्री अष्टविनायक मित्र मंडळ', 'Shree Ashtavinayak Mitra Mandal') }}</span>
                <span class="text-xs text-amber-600">🪪</span>
              </div>
            </div>

            <!-- 3. जगदीश शिंदे - खजिनदार -->
            <div 
              (click)="openCommitteeMemberCard('treasurer')"
              class="bg-gradient-to-b from-white to-amber-50/70 rounded-2xl p-4 sm:p-5 border-2 border-red-200 shadow-sm hover:shadow-md hover:border-red-400 transition-all text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
              title="ओळखपत्र (ID Card) पाहण्यासाठी क्लिक करा"
            >
              <div class="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-amber-400 mb-0.5 bg-blue-900 shrink-0 relative flex items-center justify-center">
                <span class="absolute inset-0 flex items-center justify-center text-blue-200 font-black text-2xl font-devanagari z-0">
                  {{ mandalData.isEnglish() ? 'J' : 'ज' }}
                </span>
                <img
                  [src]="formatPhotoPath('/Sabhasad/Jagdish Shinde.jpeg')"
                  alt=""
                  (error)="onPhotoError($event)"
                  class="relative z-10 w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 font-devanagari group-hover:text-red-900 transition">
                  {{ mandalData.isEnglish() ? 'Jagdish Shinde' : 'जगदीश शिंदे' }}
                </h3>
                <div class="mt-1">
                  <span class="inline-block px-3.5 py-1 rounded-full bg-[#991b1b] text-white font-black text-xs sm:text-sm font-devanagari tracking-wider shadow-2xs">
                    {{ mandalData.t('खजिनदार', 'Treasurer') }}
                  </span>
                </div>
              </div>
              <div class="text-[11px] font-medium text-slate-500 font-devanagari pt-1 border-t border-amber-200/60 w-full flex items-center justify-center gap-1">
                <span>{{ mandalData.t('श्री अष्टविनायक मित्र मंडळ', 'Shree Ashtavinayak Mitra Mandal') }}</span>
                <span class="text-xs text-amber-600">🪪</span>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= 2. ADVISORS SECTION (ॐ सल्लागार ॐ) ================= -->
        <div class="relative z-10 pt-2">
          
          <!-- Decorative Ruled Banner: ॐ सल्लागार ॐ -->
          <div class="flex items-center justify-center gap-3 my-3">
            <div class="h-0.5 flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#b91c1c]/50 to-[#b91c1c]"></div>
            <div class="px-5 py-1.5 rounded-full border-1.5 border-[#b91c1c] bg-red-50 text-[#991b1b] font-black text-sm sm:text-base font-devanagari shadow-xs tracking-wider flex items-center gap-1.5">
              <span>ॐ</span>
              <span>{{ mandalData.t('सल्लागार', 'Advisors') }}</span>
              <span>ॐ</span>
            </div>
            <div class="h-0.5 flex-1 max-w-xs bg-gradient-to-l from-transparent via-[#b91c1c]/50 to-[#b91c1c]"></div>
          </div>

          <!-- Symmetrical 5 Advisors (3 on top row, 2 on bottom row) with Photos -->
          <div class="space-y-2.5 max-w-3xl mx-auto pt-1">
            <!-- Row 1: 3 Advisors -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              @for (adv of advisoryRow1(); track adv.id) {
                <div 
                  (click)="openAdvisorCard(adv)"
                  class="py-2 px-3 rounded-xl bg-white border border-amber-300/90 shadow-2xs hover:shadow-xs hover:border-red-400 hover:bg-amber-50/50 transition-all text-center flex items-center justify-center gap-2.5 group cursor-pointer"
                  [title]="adv.nameEn + ' - ओळखपत्र पहा'"
                >
                  <div class="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 shadow-2xs bg-amber-800 relative flex items-center justify-center">
                    <span class="absolute inset-0 flex items-center justify-center text-amber-200 text-xs font-bold font-devanagari z-0">
                      {{ mandalData.isEnglish() ? adv.nameEn.charAt(0) : adv.nameMr.replace(/^श्री\.\s*/, '').charAt(0) }}
                    </span>
                    @if (adv.photoUrl && !adv._photoError) {
                      <img
                        [src]="formatPhotoPath(adv.photoUrl)"
                        alt=""
                        (error)="onPhotoError($event, adv)"
                        class="relative z-10 w-full h-full object-cover object-top"
                      />
                    }
                  </div>
                  <span class="font-black text-slate-900 font-devanagari text-sm sm:text-base group-hover:text-red-900 transition">
                    {{ mandalData.isEnglish() ? adv.nameEn : adv.nameMr.replace(/^श्री\.\s*/, '') }}
                  </span>
                </div>
              }
            </div>

            <!-- Row 2: 2 Advisors (Centered) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto">
              @for (adv of advisoryRow2(); track adv.id) {
                <div 
                  (click)="openAdvisorCard(adv)"
                  class="py-2 px-3 rounded-xl bg-white border border-amber-300/90 shadow-2xs hover:shadow-xs hover:border-red-400 hover:bg-amber-50/50 transition-all text-center flex items-center justify-center gap-2.5 group cursor-pointer"
                  [title]="adv.nameEn + ' - ओळखपत्र पहा'"
                >
                  <div class="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 shadow-2xs bg-amber-800 relative flex items-center justify-center">
                    <span class="absolute inset-0 flex items-center justify-center text-amber-200 text-xs font-bold font-devanagari z-0">
                      {{ mandalData.isEnglish() ? adv.nameEn.charAt(0) : adv.nameMr.replace(/^श्री\.\s*/, '').charAt(0) }}
                    </span>
                    @if (adv.photoUrl && !adv._photoError) {
                      <img
                        [src]="formatPhotoPath(adv.photoUrl)"
                        alt=""
                        (error)="onPhotoError($event, adv)"
                        class="relative z-10 w-full h-full object-cover object-top"
                      />
                    }
                  </div>
                  <span class="font-black text-slate-900 font-devanagari text-sm sm:text-base group-hover:text-red-900 transition">
                    {{ mandalData.isEnglish() ? adv.nameEn : adv.nameMr.replace(/^श्री\.\s*/, '') }}
                  </span>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- ================= 3. MEMBERS SECTION (ॐ सभासद ॐ) ================= -->
        <div class="relative z-10 pt-3">
          
          <!-- Decorative Ruled Banner: ॐ सभासद ॐ -->
          <div class="flex items-center justify-center gap-3 my-3">
            <div class="h-0.5 flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#b91c1c]/50 to-[#b91c1c]"></div>
            <div class="px-5 py-1.5 rounded-full border-1.5 border-[#b91c1c] bg-red-50 text-[#991b1b] font-black text-sm sm:text-base font-devanagari shadow-xs tracking-wider flex items-center gap-1.5">
              <span>ॐ</span>
              <span>{{ mandalData.t('सभासद', 'Members') }}</span>
              <span>ॐ</span>
            </div>
            <div class="h-0.5 flex-1 max-w-xs bg-gradient-to-l from-transparent via-[#b91c1c]/50 to-[#b91c1c]"></div>
          </div>

          <!-- Total Count & Description Subtitle -->
          <div class="text-center mb-3">
            <p class="text-xs sm:text-sm font-bold text-slate-700 font-devanagari">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळाचे अधिकृत नोंदणीकृत सभासद (एकूण ' + mandalData.toMarathiDigits(mandalData.sabhasadMembers().length) + ' सभासद - ५ स्तंभ रचना)', 'Official Registered Members of Shree Ashtavinayak Mitra Mandal (Total: ' + mandalData.sabhasadMembers().length + ' Members - 5 Columns Layout)') }}
            </p>
          </div>

          <!-- Controls Bar: Search & View Toggle -->
          <div class="bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <!-- Search Bar -->
            <div class="relative w-full sm:max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input
                type="text"
                [ngModel]="sabhasadSearchQuery()"
                (ngModelChange)="sabhasadSearchQuery.set($event)"
                [placeholder]="mandalData.t('सभासदाचे नाव किंवा अनुक्रमांक शोधा...', 'Search member name or serial number...')"
                class="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm font-devanagari focus:outline-none focus:ring-1.5 focus:ring-red-600 focus:bg-white transition"
              />
              @if (sabhasadSearchQuery()) {
                <button
                  (click)="sabhasadSearchQuery.set('')"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              }
            </div>

            <!-- View Switcher Toggle -->
            <div class="flex items-center gap-1.5 bg-amber-100/60 p-1 rounded-xl border border-amber-200 self-stretch sm:self-auto justify-center">
              <button
                (click)="memberViewMode.set('notice')"
                [class.bg-white]="memberViewMode() === 'notice'"
                [class.text-red-900]="memberViewMode() === 'notice'"
                [class.shadow-xs]="memberViewMode() === 'notice'"
                [class.font-black]="memberViewMode() === 'notice'"
                [class.text-slate-600]="memberViewMode() !== 'notice'"
                class="px-3 py-1.5 rounded-lg text-xs font-devanagari transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>📜</span>
                <span>{{ mandalData.t('नोटीस रचना (५ स्तंभ)', 'Notice (5 Columns)') }}</span>
              </button>

              <button
                (click)="memberViewMode.set('cards')"
                [class.bg-white]="memberViewMode() === 'cards'"
                [class.text-red-900]="memberViewMode() === 'cards'"
                [class.shadow-xs]="memberViewMode() === 'cards'"
                [class.font-black]="memberViewMode() === 'cards'"
                [class.text-slate-600]="memberViewMode() !== 'cards'"
                class="px-3 py-1.5 rounded-lg text-xs font-devanagari transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>📇</span>
                <span>{{ mandalData.t('तपशीलवार कार्ड रचना', 'Detailed Cards') }}</span>
              </button>
            </div>

          </div>

          <!-- VIEW MODE 1: AUTHENTIC 5-COLUMN NOTICE VIEW (Default) -->
          @if (memberViewMode() === 'notice') {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
              @for (col of sabhasadColumns(); track col.colNo) {
                <div class="bg-white/95 rounded-2xl border border-amber-200/90 shadow-xs p-2.5 sm:p-3 flex flex-col justify-start space-y-1">
                  
                  <!-- Column Header Badge -->
                  <div class="pb-2 mb-1 border-b border-amber-200/80 flex items-center justify-between text-center">
                    <span class="text-[11px] font-black text-amber-900 font-devanagari px-2 py-0.5 rounded-md bg-amber-100/70 border border-amber-200">
                      {{ mandalData.isEnglish() ? col.titleEn : col.titleMr }}
                    </span>
                    <span class="text-[10px] font-bold text-slate-500 font-mono">
                      {{ mandalData.formatNum(col.members.length) }}
                    </span>
                  </div>

                  <!-- Names List -->
                  <div class="space-y-0.5">
                    @for (mem of col.members; track mem.id) {
                      <div
                        (click)="openIdModal(mem)"
                        class="px-2 py-1.5 rounded-xl hover:bg-amber-100/70 border border-transparent hover:border-amber-300 transition-all flex items-center justify-between gap-1.5 cursor-pointer group select-none"
                        [title]="(mandalData.isEnglish() ? mem.nameEn : mem.nameMr) + ' - आयकार्ड पाहण्यासाठी क्लिक करा'"
                      >
                        <div class="flex items-center gap-1.5 min-w-0 flex-1">
                          @if (mem.photoUrl && !mem._photoError) {
                            <img
                              [src]="formatPhotoPath(mem.photoUrl)"
                              alt=""
                              (error)="onPhotoError($event, mem)"
                              class="w-6 h-6 rounded-full object-cover object-top border border-amber-400 shrink-0 shadow-2xs bg-black/10"
                            />
                          } @else {
                            <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 group-hover:bg-red-700 group-hover:text-white transition">
                              {{ mandalData.toMarathiDigits(mem.srNo) }}
                            </span>
                          }
                          <span class="font-bold text-slate-900 font-devanagari text-xs truncate group-hover:text-red-900 transition">
                            {{ mandalData.isEnglish() ? mem.nameEn : mem.nameMr }}
                          </span>
                        </div>

                        <!-- Hover Action Icons -->
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                          <button
                            (click)="$event.stopPropagation(); openIdModal(mem)"
                            class="p-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 text-[10px] cursor-pointer"
                            title="आयकार्ड पहा"
                          >
                            👁️
                          </button>
                          <button
                            (click)="$event.stopPropagation(); triggerDownloadFromTable(mem)"
                            class="p-1 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[10px] cursor-pointer"
                            title="आयकार्ड डाउनलोड करा"
                          >
                            ⬇️
                          </button>
                        </div>
                      </div>
                    }
                  </div>

                </div>
              }
            </div>
          }

          <!-- VIEW MODE 2: DETAILED MEMBER CARDS VIEW -->
          @if (memberViewMode() === 'cards') {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              @for (mem of filteredSabhasad(); track mem.id) {
                <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-4 flex flex-col justify-between space-y-3 group">
                  
                  <!-- Card Top: Sr No. -->
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] font-devanagari">
                      अ. क्र. {{ mandalData.toMarathiDigits(mem.srNo) }}
                    </span>
                    <span class="text-[10.5px] text-slate-400 font-devanagari font-bold">
                      {{ mandalData.t('नोंदणीकृत सभासद', 'Registered Member') }}
                    </span>
                  </div>

                  <!-- Card Body: Member Photo/Initial & Details -->
                  <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-700 to-red-800 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0 font-devanagari border-2 border-white ring-1 ring-amber-300 overflow-hidden relative">
                      <span class="absolute inset-0 flex items-center justify-center font-devanagari font-bold text-amber-100 text-base z-0">
                        {{ getMemberInitial(mem) }}
                      </span>
                      @if (mem.photoUrl && !mem._photoError) {
                        <img
                          [src]="formatPhotoPath(mem.photoUrl)"
                          alt=""
                          (error)="onPhotoError($event, mem)"
                          class="relative z-10 w-full h-full object-cover object-top"
                        />
                      }
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="font-bold text-slate-900 font-devanagari text-sm leading-snug group-hover:text-amber-800 transition truncate" [title]="mandalData.isEnglish() ? mem.nameEn : mem.nameMr">
                        {{ mandalData.isEnglish() ? mem.nameEn : mem.nameMr }}
                      </h3>
                      <div class="text-[11px] text-slate-500 font-devanagari mt-0.5 truncate">
                        {{ mandalData.isEnglish() ? mem.nameMr : mem.nameEn }}
                      </div>
                    </div>
                  </div>

                  <!-- Card Footer: "पहा" and "Download" buttons -->
                  <div class="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      (click)="openIdModal(mem)"
                      class="flex-1 py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 hover:border-amber-400 font-bold text-xs font-devanagari transition shadow-2xs hover:shadow-xs active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                      title="आयकार्ड तपशील पहा"
                    >
                      <span>👁️ {{ mandalData.t('पहा', 'View') }}</span>
                    </button>
                    <button
                      (click)="triggerDownloadFromTable(mem)"
                      class="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 hover:border-emerald-400 font-bold text-xs font-devanagari transition shadow-2xs hover:shadow-xs active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                      title="आयकार्ड थेट डाउनलोड करा"
                    >
                      <span>⬇️ {{ mandalData.t('डाउनलोड', 'Download') }}</span>
                    </button>
                  </div>

                </div>
              }
            </div>
          }

          @if (filteredSabhasad().length === 0) {
            <div class="py-12 text-center text-slate-400 font-devanagari bg-white rounded-2xl border border-dashed border-amber-300">
              <span class="text-3xl block mb-2">🔍</span>
              <span>{{ mandalData.t('कोणताही सभासद आढळला नाही.', 'No members found.') }}</span>
            </div>
          }

        </div>

        <!-- ================= 4. FOOTER BANNER (वार्षिक अहवाल - २०२५) ================= -->
        <div class="relative z-10 mt-6 pt-4 border-t-2 border-red-200/80 flex justify-center">
          
        </div>

      </div>

      <!-- ================= 4. DONATION QR CODE & LOCATION MAP ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Official UPI QR Code Card (Left 6 Cols) -->
        <div class="lg:col-span-6 bg-gradient-to-br from-white to-amber-50/70 rounded-2xl shadow-sm border-2 border-amber-300 p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div class="flex items-center justify-between border-b border-amber-200 pb-3">
            <div>
              <span class="text-xs font-bold text-amber-800 uppercase tracking-wider">{{ mandalData.t('अधिकृत देणगी पोर्टल', 'Official Donation Portal') }}</span>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 font-devanagari">{{ mandalData.t('डिजिटल वर्गणी व देणगी (UPI / QR)', 'Digital Donations & Offerings (UPI / QR)') }}</h3>
            </div>
            <div class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold shrink-0">
              {{ mandalData.t('८०जी करसूट', '80G Tax Benefit') }}
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <!-- Simulated High Quality UPI QR Code -->
            <div class="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-md shrink-0 flex flex-col items-center">
              <div class="w-36 h-36 sm:w-40 sm:h-40 bg-slate-900 p-1 flex items-center justify-center rounded-lg relative">
                <svg class="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="25" height="25" fill="white" />
                  <rect x="9" y="9" width="17" height="17" fill="black" />
                  <rect x="13" y="13" width="9" height="9" fill="white" />

                  <rect x="70" y="5" width="25" height="25" fill="white" />
                  <rect x="74" y="9" width="17" height="17" fill="black" />
                  <rect x="78" y="13" width="9" height="9" fill="white" />

                  <rect x="5" y="70" width="25" height="25" fill="white" />
                  <rect x="9" y="74" width="17" height="17" fill="black" />
                  <rect x="13" y="78" width="9" height="9" fill="white" />

                  <rect x="36" y="8" width="6" height="6" fill="white" />
                  <rect x="48" y="14" width="6" height="6" fill="white" />
                  <rect x="58" y="8" width="6" height="6" fill="white" />
                  <rect x="36" y="24" width="6" height="6" fill="white" />
                  <rect x="48" y="28" width="6" height="6" fill="white" />
                  <rect x="10" y="38" width="6" height="6" fill="white" />
                  <rect x="22" y="44" width="6" height="6" fill="white" />
                  <rect x="38" y="40" width="6" height="6" fill="white" />
                  <rect x="50" y="44" width="6" height="6" fill="white" />
                  <rect x="65" y="38" width="6" height="6" fill="white" />
                  <rect x="80" y="44" width="6" height="6" fill="white" />
                  <circle cx="50" cy="50" r="10" fill="#ea580c" />
                  <text x="50" y="54" font-size="10" text-anchor="middle" fill="white" font-weight="bold">ॐ</text>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-slate-600 mt-1">BHIM • GPay • PhonePe • Paytm</span>
            </div>

            <!-- Bank details -->
            <div class="space-y-3 text-xs w-full min-w-0">
              <div class="bg-white p-3 rounded-xl border border-amber-200">
                <span class="text-slate-500 text-[11px] block">{{ mandalData.t('अधिकृत UPI ID:', 'Official UPI ID:') }}</span>
                <div class="flex flex-wrap items-center gap-2 mt-1">
                  <code class="font-mono font-bold text-slate-900 text-xs sm:text-sm bg-slate-100 px-2 py-1 rounded truncate max-w-full">
                    ashtavinayak.jogeshwari&#64;upi
                  </code>
                  <button
                    (click)="copyUpi()"
                    class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition text-[11px] shrink-0 cursor-pointer"
                  >
                    {{ copySuccess() ? mandalData.t('कॉपी झाले! ✓', 'Copied! ✓') : mandalData.t('कॉपी करा', 'Copy') }}
                  </button>
                </div>
              </div>

              <div class="text-slate-700 leading-relaxed font-devanagari text-xs space-y-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                <div class="flex items-center justify-between">
                  <div><b>{{ mandalData.t('बँकेचे नाव:', 'Bank Name:') }}</b> {{ mandalData.t(mandalData.bankDetails.bankNameMr, mandalData.bankDetails.bankNameEn) }}</div>
                  <span class="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold">{{ mandalData.t(mandalData.bankDetails.accountTypeMr, mandalData.bankDetails.accountTypeEn) }}</span>
                </div>
                <div><b>{{ mandalData.t('शाखा:', 'Branch:') }}</b> {{ mandalData.t(mandalData.bankDetails.branchMr, mandalData.bankDetails.branchEn) }}</div>
                <div class="flex items-center justify-between font-mono bg-white px-2 py-1 rounded border border-amber-200">
                  <span><b>{{ mandalData.t('खाते क्र.:', 'A/C No:') }}</b> <span class="font-bold text-slate-900">{{ mandalData.bankDetails.accountNo }}</span></span>
                  <button
                    (click)="copyBankText(mandalData.bankDetails.accountNo, 'ac')"
                    class="px-1.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-sans font-bold transition cursor-pointer"
                    title="खाते क्रमांक कॉपी करा"
                  >
                    {{ copiedBankKey() === 'ac' ? '✓ ' + mandalData.t('कॉपी झाले', 'Copied') : '📋 ' + mandalData.t('कॉपी', 'Copy') }}
                  </button>
                </div>
                <div class="flex items-center justify-between font-mono bg-white px-2 py-1 rounded border border-amber-200">
                  <span><b>{{ mandalData.t('IFSC कोड:', 'IFSC:') }}</b> <span class="font-bold text-slate-900">{{ mandalData.bankDetails.ifscCode }}</span></span>
                  <button
                    (click)="copyBankText(mandalData.bankDetails.ifscCode, 'ifsc')"
                    class="px-1.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-sans font-bold transition cursor-pointer"
                    title="IFSC कोड कॉपी करा"
                  >
                    {{ copiedBankKey() === 'ifsc' ? '✓ ' + mandalData.t('कॉपी झाले', 'Copied') : '📋 ' + mandalData.t('कॉपी', 'Copy') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mandal Office Location & Google Map Card (Right 6 Cols) -->
        <div class="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
            <div>
              <h3 class="text-lg font-bold text-slate-900 font-devanagari">{{ mandalData.t('कार्यालय पत्ता व संपर्क', 'Office Address & Contact') }}</h3>
              <p class="text-xs text-slate-500 font-devanagari">{{ mandalData.t('जोगेश्वरी (पश्चिम), मुंबई', 'Jogeshwari (West), Mumbai') }}</p>
            </div>
            <a
              [href]="mandalData.mapLocationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              title="गुगल मॅप्सवर उघडा / Open in Google Maps"
            >
              <span>📍</span>
              <span>{{ mandalData.t('गुगल मॅप', 'Google Maps') }}</span>
              <span class="text-[10px]">↗</span>
            </a>
          </div>

          <div class="space-y-2 text-xs text-slate-700 font-devanagari">
            <div class="flex items-start gap-2.5">
              <span class="text-amber-600 text-base">📍</span>
              <div>
                <b>{{ mandalData.t('कार्यालय पत्ता:', 'Office Address:') }}</b><br>
                {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ कार्यालय, शिव स्फूर्ती सोसायटी प्रांगण, आदर्श नगर, एस. व्ही. रोड, जोगेश्वरी (पश्चिम), मुंबई - ४०० १०२.', 'Shree Ashtavinayak Mitra Mandal Office, Shiv Sphurti Society Compound, Adarsh Nagar, S. V. Road, Jogeshwari (West), Mumbai - 400 102.') }}
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-amber-600 text-base">📞</span>
              <div><b>{{ mandalData.t('कार्यालय फोन:', 'Office Phone:') }}</b> {{ mandalData.formatPhone('+91 88506 16686') }} / {{ mandalData.formatPhone('+91 9595049374') }}</div>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-amber-600 text-base">✉️</span>
              <div><b>{{ mandalData.t('ईमेल:', 'Email:') }}</b> ashtavinayak.jogeshwari&#64;gmail.com</div>
            </div>
          </div>

          <!-- Interactive Map Container with Direct Directions Link -->
          <div class="space-y-2">
            <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 relative flex items-center justify-center group">
              <iframe
                title="Mandal Location Map"
                class="w-full h-full border-0"
                src="https://maps.google.com/maps?q=Jogeshwari+West+Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
              ></iframe>
              <!-- Direct Floating Action Button Over Map -->
              <a
                [href]="mandalData.mapLocationUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-slate-900/90 hover:bg-emerald-600 text-white border border-white/20 rounded-lg shadow-lg font-bold text-xs transition flex items-center gap-1.5 backdrop-blur-xs cursor-pointer active:scale-95"
              >
                <span>🧭</span>
                <span>{{ mandalData.t('गुगल मॅप्सवर दिशा मिळवा', 'Get Directions') }}</span>
                <span class="text-[10px]">↗</span>
              </a>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 font-devanagari px-1">
              <span>{{ mandalData.t('मंडळ कार्यालय व उत्सव प्रांगण', 'Mandal Office & Festival Grounds') }}</span>
              <a
                [href]="mandalData.mapLocationUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-700 hover:text-emerald-800 font-bold underline flex items-center gap-0.5"
              >
                <span>{{ mandalData.t('थेट लोकेशन लिंक', 'Open Map Link') }}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ================= ATTRACTIVE VERTICAL ID CARD POPUP MODAL ================= -->
    @if (showIdModal() && selectedMember()) {
      <div
        class="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
        (click)="onBackdropClick($event)"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl max-w-[360px] sm:max-w-md w-full border-2 border-amber-400 p-3.5 sm:p-5 space-y-3 sm:space-y-4 font-devanagari relative my-auto mx-auto"
          (click)="$event.stopPropagation()"
        >
          
          <!-- Modal Header with Close Button -->
          <div class="flex items-center justify-between border-b border-amber-200 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-lg sm:text-xl">🪪</span>
              <h3 class="font-bold text-xs sm:text-sm md:text-base text-slate-900">
                {{ mandalData.t('अधिकृत सभासद ओळखपत्र (प्रिव्ह्यू)', 'Official Membership ID Card (Preview)') }}
              </h3>
            </div>
            <button
              (click)="closeIdModal()"
              class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer transition"
              title="बंद करा"
            >
              ✕
            </button>
          </div>

          <!-- THE ATTRACTIVE VERTICAL ID CARD (Captured 1:1 by html2canvas, exactly matching reference design) -->
          <div
            id="verticalIdCardPreview"
            style="background: radial-gradient(circle at 50% 35%, #520707 0%, #3a0404 45%, #220202 85%, #150101 100%); border: 2.5px solid #d97706; box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.75);"
            class="mx-auto w-[335px] max-w-full rounded-[34px] pt-4 px-4 pb-5 relative overflow-hidden flex flex-col items-center text-center select-none box-border text-white shadow-2xl"
          >
            <!-- Background Watermark: Lord Ganesha & Trishul -->
            <img
              src="ganpati-watermark.jpg"
              alt=""
              class="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none opacity-20"
            />

            <!-- Card Content Container -->
            <div class="relative z-10 w-full flex flex-col items-center">

              <!-- 1. Top Lanyard Slot -->
              <div class="w-14 h-3 bg-[#0a0101] rounded-full mx-auto border border-amber-500/40 shadow-inner mb-3 shrink-0"></div>

              <!-- 2. Mandal Circular Logo with Gold Border -->
              <div class="w-[58px] h-[58px] rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 shadow-md border border-amber-300 shrink-0">
                <img
                  src="logo.jpg"
                  alt="Mandal Seal"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>

              <!-- 3. Header Texts -->
              <div class="text-center mt-2 space-y-0.5 shrink-0">
                <div class="text-[11.5px] font-bold text-amber-300 font-devanagari tracking-wide drop-shadow-sm">
                  ॥ मंगलमूर्ती मोरया ॥
                </div>
                <h2 class="text-[18px] font-black text-white font-devanagari tracking-tight leading-tight drop-shadow">
                  श्री अष्टविनायक मित्र मंडळ
                </h2>
                <p class="text-[11px] font-medium text-amber-100/90 font-devanagari tracking-normal">
                  शिव स्फूर्ती • जोगेश्वरी (पश्चिम), मुंबई-४००१०२
                </p>
              </div>

              <!-- Golden Divider Line -->
              <div class="w-[86%] border-t border-amber-500/40 my-3 shrink-0"></div>

              <!-- 4. Photo Frame with Member Photo or Letter fallback -->
              <div class="w-[104px] h-[122px] rounded-[22px] border-[2.2px] border-amber-400 bg-black/60 shadow-lg flex flex-col items-center justify-center relative my-0.5 shrink-0 overflow-hidden">
                <!-- Underlying Initial Fallback (Always rendered behind image) -->
                <div class="absolute inset-0 flex flex-col items-center justify-center z-0">
                  <span class="text-amber-300 text-3xl font-black font-devanagari leading-none drop-shadow-sm">
                    {{ getMemberInitial(selectedMember()) }}
                  </span>
                  <span class="text-amber-200 font-bold font-sans tracking-[0.25em] text-[10px] mt-2 uppercase">
                    PHOTO
                  </span>
                </div>

                <!-- Actual Photo (Rendered on top if photoUrl exists and not errored) -->
                @if (getMemberPhoto(selectedMember()) && !selectedMember()?._photoError) {
                  <img
                    [src]="formatPhotoPath(getMemberPhoto(selectedMember()))"
                    alt=""
                    (error)="onPhotoError($event, selectedMember())"
                    class="relative z-10 w-full h-full object-cover object-top"
                  />
                }
              </div>

              <!-- 5. Member Name Section -->
              <div class="text-center mt-3 space-y-0.5 shrink-0 px-2">
                <div class="text-[11px] font-semibold text-amber-300/90 font-devanagari">
                  सभासदाचे नाव
                </div>
                <h3 class="text-[19px] font-black text-white font-devanagari leading-snug tracking-tight">
                  {{ selectedMember()?.nameMr || 'श्री. बाळासाहेब यादव' }}
                </h3>
                <div class="text-[12px] font-bold text-amber-200/90 font-sans tracking-wide">
                  {{ selectedMember()?.nameEn || 'Balasaheb Yadav' }}
                </div>
              </div>

              <!-- 6. Phone Pill -->
              <div class="mt-3.5 inline-flex items-center justify-center gap-2 px-5 py-1.5 rounded-full bg-[#2a0404]/90 border border-amber-500/60 shadow-md shrink-0">
                <svg class="w-3.5 h-3.5 text-amber-300 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.45-5.15-3.76-6.59-6.59l1.97-1.57c.28-.28.37-.67.25-1.02A11.36 11.36 0 018.98 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.99c0-.55-.45-1-.99-1.01z"/>
                </svg>
                <span class="text-amber-100 font-bold text-[12px] font-devanagari tracking-wider">
                  {{ formatCardPhone(selectedMember()?.phone) }}
                </span>
              </div>

              <!-- 7. Bottom Box with ID and QR Code -->
              <div class="w-full rounded-[20px] border-[1.8px] border-amber-400 bg-black/70 px-3.5 py-2.5 flex items-center justify-between mt-4 shadow-xl shrink-0">
                <!-- Left Details -->
                <div class="text-left space-y-0.5">
                  <div class="text-[10.5px] font-bold text-amber-300 font-devanagari">
                    सभासद ओळख क्रमांक
                  </div>
                  <div class="text-[17px] font-black text-amber-400 font-mono tracking-wider">
                    {{ getIdCardNumber(selectedMember()?.srNo) }}
                  </div>
                  <div class="text-[9.5px] font-medium text-amber-100/80 font-devanagari">
                    स्थापना वर्ष १९९७ • अधिकृत ओळखपत्र
                  </div>
                </div>

                <!-- Right QR Code with Red Accent -->
                <div class="w-[58px] h-[58px] bg-white rounded-xl p-1 shadow flex items-center justify-center shrink-0">
                  <svg class="w-full h-full text-slate-900" viewBox="0 0 44 44" fill="currentColor">
                    <!-- Top-Left Finder Pattern -->
                    <rect x="2" y="2" width="12" height="12" rx="3" fill="currentColor"/>
                    <rect x="4" y="4" width="8" height="8" rx="2" fill="white"/>
                    <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor"/>

                    <!-- Top-Right Finder Pattern -->
                    <rect x="30" y="2" width="12" height="12" rx="3" fill="currentColor"/>
                    <rect x="32" y="4" width="8" height="8" rx="2" fill="white"/>
                    <rect x="34" y="6" width="4" height="4" rx="1" fill="currentColor"/>

                    <!-- Bottom-Left Finder Pattern -->
                    <rect x="2" y="30" width="12" height="12" rx="3" fill="currentColor"/>
                    <rect x="4" y="32" width="8" height="8" rx="2" fill="white"/>
                    <rect x="6" y="34" width="4" height="4" rx="1" fill="currentColor"/>

                    <!-- Data Dots -->
                    <rect x="18" y="4" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="23" y="4" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="18" y="10" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="24" y="10" width="3" height="3" rx="1" fill="currentColor"/>

                    <!-- Red Center Accent from reference design -->
                    <circle cx="22" cy="22" r="3" fill="#dc2626"/>
                    <rect x="16" y="20.5" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="25" y="20.5" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="20.5" y="16" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="20.5" y="25" width="3" height="3" rx="1" fill="currentColor"/>

                    <!-- Bottom Right Bits -->
                    <rect x="30" y="18" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="36" y="18" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="18" y="31" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="23" y="31" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="18" y="37" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="31" y="31" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="37" y="31" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="34" y="36" width="3" height="3" rx="1" fill="currentColor"/>
                    <rect x="39" y="38" width="3" height="3" rx="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>

          <!-- Direct Download & Close Actions -->
          <div class="pt-2 flex items-center justify-end gap-2.5">
            <button
              (click)="closeIdModal()"
              class="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold font-devanagari transition cursor-pointer"
            >
              {{ mandalData.t('बंद करा', 'Close') }}
            </button>
            <button
              (click)="downloadCurrentIdCard()"
              [disabled]="isDownloading()"
              class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs font-devanagari shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              @if (isDownloading()) {
                <span class="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                <span>{{ mandalData.t('तयार होत आहे...', 'Generating...') }}</span>
              } @else {
                <svg class="w-3.5 h-3.5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>{{ mandalData.t('आयकार्ड डाउनलोड करा (HD)', 'Download ID Card (HD)') }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class AboutComponent {
  readonly mandalData = inject(MandalDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Sabhasad List Filters
  readonly sabhasadSearchQuery = signal<string>('');
  readonly selectedBuilding = signal<string>('सर्व');

  readonly copySuccess = signal<boolean>(false);

  // Notice & Member View Mode ('notice' = 5-column authentic booklet layout, 'cards' = grid cards)
  readonly memberViewMode = signal<'notice' | 'cards'>('notice');

  readonly executiveOfficers = computed(() => {
    return this.mandalData.committeeMembers.filter(m => m.roleType === 'पदाधिकारी');
  });

  readonly advisoryRow1 = computed(() => {
    return this.mandalData.committeeMembers.filter(m => m.roleType === 'सल्लागार').slice(0, 3);
  });

  readonly advisoryRow2 = computed(() => {
    return this.mandalData.committeeMembers.filter(m => m.roleType === 'सल्लागार').slice(3, 5);
  });

  // Vertical ID Card Modal State
  readonly showIdModal = signal<boolean>(false);
  readonly selectedMember = signal<SabhasadMember | null>(null);
  readonly isDownloading = signal<boolean>(false);

  constructor() {
    this.route.queryParams.subscribe(params => {
      // Smooth backward compatibility: redirect old president tab to new /manogat page
      if (params['tab'] === 'president' || params['tab'] === 'manogat') {
        this.router.navigate(['/manogat']);
      }
    });
  }

  openIdModal(mem: SabhasadMember) {
    this.selectedMember.set(mem);
    this.showIdModal.set(true);
  }

  closeIdModal() {
    this.showIdModal.set(false);
    this.selectedMember.set(null);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeIdModal();
    }
  }

  /**
   * Helper to format phone number in Marathi numerals e.g. +९१ ९८२०१ ४४५५२
   */
  formatCardPhone(phone: string | undefined): string {
    if (!phone) return '+९१ ९८२०१ ४४५५२';
    const digits = phone.replace(/\D/g, '');
    const clean10 = digits.length >= 10 ? digits.slice(-10) : digits.padStart(10, '0');
    const marathi10 = this.mandalData.toMarathiDigits(clean10);
    return `+९१ ${marathi10.slice(0, 5)} ${marathi10.slice(5)}`;
  }

  /**
   * Helper to format official membership ID code e.g. AM-1997-001
   */
  getIdCardNumber(srNo: number | undefined): string {
    const num = srNo ? srNo : 1;
    return `AM-1997-${String(num).padStart(3, '0')}`;
  }

  /**
   * Helper to extract the member's first name syllable/initial e.g. 'मं' for Mangesh
   */
  getMemberInitial(mem: SabhasadMember | null): string {
    if (!mem) return 'बा';
    const cleaned = (mem.nameMr || '').replace(/^(श्री\.|श्री|सौ\.|सौ|श्रीमती\.|श्रीमती)\s*/, '').trim();
    if (!cleaned) return 'बा';
    const firstChar = cleaned.charAt(0);
    const secondChar = cleaned.charAt(1);
    if (secondChar && /[\u093E-\u094C\u0902]/.test(secondChar)) {
      return firstChar + secondChar;
    }
    return firstChar;
  }

  /**
   * Helper to retrieve photo URL for member, fallback to Balasaheb Yadav if null
   */
  getMemberPhoto(mem: SabhasadMember | null): string | undefined {
    if (!mem) return '/Sabhasad/Balasaheb%20Yadav.jpg';
    return mem.photoUrl || (mem.id === 1 || mem.nameEn?.includes('Balasaheb') ? '/Sabhasad/Balasaheb%20Yadav.jpg' : undefined);
  }

  /**
   * Normalizes photo path to root-relative /Sabhasad/ and encodes special characters / spaces
   */
  formatPhotoPath(rawPath?: string): string {
    if (!rawPath) return '';
    let p = rawPath.trim();
    if (!p.startsWith('/') && !p.startsWith('http')) {
      p = '/' + p;
    }
    if (p.toLowerCase().startsWith('/sabhasad/')) {
      p = '/Sabhasad/' + p.slice(10);
    }
    try {
      return encodeURI(decodeURI(p));
    } catch {
      return encodeURI(p);
    }
  }

  /**
   * Handles photo loading errors gracefully:
   * 1. Attempts fallback casing once (/sabhasad/ vs /Sabhasad/)
   * 2. If it still fails, hides the <img> element completely so browser broken image icon & alt text NEVER display
   * 3. Sets _photoError on the member object so Angular renders fallback Devanagari badge
   */
  onPhotoError(event: Event, item?: any) {
    const img = event.target as HTMLImageElement;
    if (!img) return;

    if (!img.dataset['retried']) {
      img.dataset['retried'] = '1';
      if (img.src.includes('/Sabhasad/')) {
        img.src = img.src.replace('/Sabhasad/', '/sabhasad/');
        return;
      } else if (img.src.includes('/sabhasad/')) {
        img.src = img.src.replace('/sabhasad/', '/Sabhasad/');
        return;
      }
    }

    img.style.display = 'none';
    if (item) {
      item._photoError = true;
    }
  }

  /**
   * Opens ID Card Modal for an Executive Committee member
   */
  openCommitteeMemberCard(role: 'president' | 'secretary' | 'treasurer') {
    const comm = this.mandalData.committeeMembers.find(c => {
      if (role === 'president') return c.id === 1;
      if (role === 'secretary') return c.id === 2;
      return c.id === 3;
    });
    if (comm) {
      this.openIdModal({
        id: 9000 + comm.id,
        srNo: comm.id,
        nameMr: comm.nameMr,
        nameEn: comm.nameEn,
        building: 'शिव स्फूर्ती / आदर्श नगर',
        flatNo: '-',
        membershipTypeMr: comm.designationMr,
        membershipTypeEn: comm.designationEn,
        phone: comm.phone,
        joinYear: 1997,
        status: 'सक्रिय',
        photoUrl: comm.photoUrl
      });
    }
  }

  /**
   * Opens ID Card Modal for an Advisor
   */
  openAdvisorCard(adv: CommitteeMember) {
    this.openIdModal({
      id: 9000 + adv.id,
      srNo: adv.id,
      nameMr: adv.nameMr,
      nameEn: adv.nameEn,
      building: 'शिव स्फूर्ती / आदर्श नगर',
      flatNo: '-',
      membershipTypeMr: adv.designationMr,
      membershipTypeEn: adv.designationEn,
      phone: adv.phone,
      joinYear: 1997,
      status: 'सक्रिय',
      photoUrl: adv.photoUrl
    });
  }

  /**
   * Generates a standardized, fixed-resolution ID Card export (CR80 portrait format: 750 × 1300 px at 300 DPI).
   * Renders inside an off-screen staging container with fixed base dimensions so the output PNG
   * file size, resolution, and visual layout remain 100% identical on mobile, tablet, and desktop.
   */
  async downloadCurrentIdCard() {
    const mem = this.selectedMember();
    if (!mem || this.isDownloading()) return;

    const sourceCard = document.getElementById('verticalIdCardPreview');
    if (!sourceCard) return;

    this.isDownloading.set(true);

    let stagingContainer: HTMLElement | null = null;

    try {
      const EXPORT_WIDTH = 750;
      const EXPORT_HEIGHT = 1300;
      const BASE_WIDTH = 345;
      const BASE_HEIGHT = 600;

      // 1. Create an off-screen staging container with fixed base dimensions
      stagingContainer = document.createElement('div');
      stagingContainer.id = 'id-card-export-staging';
      stagingContainer.style.position = 'fixed';
      stagingContainer.style.left = '0';
      stagingContainer.style.top = '0';
      stagingContainer.style.width = `${BASE_WIDTH}px`;
      stagingContainer.style.height = `${BASE_HEIGHT}px`;
      stagingContainer.style.zIndex = '-9999';
      stagingContainer.style.pointerEvents = 'none';
      stagingContainer.style.overflow = 'hidden';
      stagingContainer.style.margin = '0';
      stagingContainer.style.padding = '0';
      stagingContainer.style.boxSizing = 'border-box';

      // 2. Clone the rendered card element into the staging container with fixed styling
      const clonedCard = sourceCard.cloneNode(true) as HTMLElement;
      clonedCard.id = 'verticalIdCardExportClone';
      clonedCard.style.width = `${BASE_WIDTH}px`;
      clonedCard.style.minWidth = `${BASE_WIDTH}px`;
      clonedCard.style.maxWidth = `${BASE_WIDTH}px`;
      clonedCard.style.height = `${BASE_HEIGHT}px`;
      clonedCard.style.minHeight = `${BASE_HEIGHT}px`;
      clonedCard.style.maxHeight = `${BASE_HEIGHT}px`;
      clonedCard.style.display = 'flex';
      clonedCard.style.flexDirection = 'column';
      clonedCard.style.alignItems = 'center';
      clonedCard.style.justifyContent = 'flex-start';
      clonedCard.style.padding = '16px 16px 20px 16px';
      clonedCard.style.boxSizing = 'border-box';
      clonedCard.style.margin = '0';
      clonedCard.style.transform = 'none';

      stagingContainer.appendChild(clonedCard);
      document.body.appendChild(stagingContainer);

      // 3. Ensure all fonts and images are ready before capturing
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const imgs = Array.from(clonedCard.querySelectorAll('img'));
      await Promise.all(
        imgs.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
      await new Promise(resolve => setTimeout(resolve, 150));

      // 4. Capture with html2canvas using standardized viewport & scale: 2
      const rawCanvas = await html2canvas(clonedCard, {
        scale: 2,
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        windowWidth: BASE_WIDTH,
        windowHeight: BASE_HEIGHT,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 6000,
      });

      // 5. Standardize onto exact 750 × 1200 px canvas
      const standardizedCanvas = document.createElement('canvas');
      standardizedCanvas.width = EXPORT_WIDTH;
      standardizedCanvas.height = EXPORT_HEIGHT;
      const ctx = standardizedCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(rawCanvas, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
      }

      const safeName = (mem.nameEn || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `AM_ID_${mem.srNo}_${safeName}.png`;

      const dataUrl = (ctx ? standardizedCanvas : rawCanvas).toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export standardized ID card via html2canvas:', err);
    } finally {
      if (stagingContainer && stagingContainer.parentNode) {
        stagingContainer.parentNode.removeChild(stagingContainer);
      }
      this.isDownloading.set(false);
    }
  }

  /**
   * Allows direct download from the Sabhasad tile action button.
   * Opens the preview modal and auto-triggers HD export.
   */
  triggerDownloadFromTable(mem: SabhasadMember) {
    this.selectedMember.set(mem);
    this.showIdModal.set(true);
    setTimeout(() => {
      this.downloadCurrentIdCard();
    }, 250);
  }

  // Filtered Sabhasad Members
  readonly filteredSabhasad = computed(() => {
    let list = this.mandalData.sabhasadMembers();
    const query = this.sabhasadSearchQuery().toLowerCase().trim();

    if (query) {
      list = list.filter(item =>
        item.nameMr.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        String(item.srNo).includes(query)
      );
    }

    return list;
  });

  // Authentic 5-Column Notice Partition
  readonly sabhasadColumns = computed(() => {
    const list = this.filteredSabhasad();
    const query = this.sabhasadSearchQuery().toLowerCase().trim();

    if (query) {
      const cols: Array<{ colNo: number; titleMr: string; titleEn: string; count: number; members: SabhasadMember[] }> = [];
      const colCount = Math.min(5, Math.max(1, Math.ceil(list.length / 26)));
      const chunkSize = Math.ceil(list.length / colCount);
      for (let i = 0; i < colCount; i++) {
        const chunk = list.slice(i * chunkSize, (i + 1) * chunkSize);
        if (chunk.length > 0) {
          cols.push({
            colNo: i + 1,
            titleMr: `निकाल स्तंभ ${this.mandalData.toMarathiDigits(i + 1)} (${this.mandalData.toMarathiDigits(chunk.length)})`,
            titleEn: `Result Col ${i + 1} (${chunk.length})`,
            count: chunk.length,
            members: chunk
          });
        }
      }
      return cols;
    }

    const c1 = list.filter(m => m.columnIndex === 1 || (m.srNo >= 1 && m.srNo <= 26));
    const c2 = list.filter(m => m.columnIndex === 2 || (m.srNo >= 27 && m.srNo <= 52));
    const c3 = list.filter(m => m.columnIndex === 3 || (m.srNo >= 53 && m.srNo <= 78));
    const c4 = list.filter(m => m.columnIndex === 4 || (m.srNo >= 79 && m.srNo <= 104));
    const c5 = list.filter(m => m.columnIndex === 5 || m.srNo >= 105);

    return [
      {
        colNo: 1,
        titleMr: 'स्तंभ १',
        titleEn: 'Column 1',
        count: c1.length,
        members: c1
      },
      {
        colNo: 2,
        titleMr: 'स्तंभ २',
        titleEn: 'Column 2',
        count: c2.length,
        members: c2
      },
      {
        colNo: 3,
        titleMr: 'स्तंभ ३',
        titleEn: 'Column 3',
        count: c3.length,
        members: c3
      },
      {
        colNo: 4,
        titleMr: 'स्तंभ ४',
        titleEn: 'Column 4',
        count: c4.length,
        members: c4
      },
      {
        colNo: 5,
        titleMr: 'स्तंभ ५',
        titleEn: 'Column 5',
        count: c5.length,
        members: c5
      }
    ];
  });

  copyUpi() {
    navigator.clipboard.writeText('ashtavinayak.jogeshwari@upi');
    this.copySuccess.set(true);
    setTimeout(() => this.copySuccess.set(false), 2500);
  }

  readonly copiedBankKey = signal<string | null>(null);

  copyBankText(text: string, key: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copiedBankKey.set(key);
        setTimeout(() => this.copiedBankKey.set(null), 2500);
      });
    }
  }
}
