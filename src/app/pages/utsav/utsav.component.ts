import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';
import { FestivalEvent } from '../../models/mandal.models';

@Component({
  selector: 'app-utsav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 pb-8 animate-fade-in">
      
      <!-- Banner -->
      <div class="bg-gradient-to-r from-amber-700 via-orange-800 to-red-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute right-0 top-0 bottom-0 opacity-15 flex items-center pr-6 text-9xl pointer-events-none select-none">
          🪔
        </div>
        <div class="relative z-10">
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

          <div class="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span>●</span>
            <span>{{ mandalData.t('धार्मिक व सामाजिक उपक्रम', 'Religious & Cultural Events') }}</span>
          </div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
            {{ mandalData.t('मंडळाचे वार्षिक उत्सव व कार्यक्रम दिनदर्शिका', 'Annual Festivals & Event Calendar') }}
          </h1>
          <p class="text-amber-100 text-xs md:text-sm mt-1">
            {{ mandalData.t('आरती वेळा, महाप्रसाद, सांस्कृतिक स्पर्धा, स्वच्छता मोहीम व विसर्जन मिरवणूक छायाचित्रे', 'Aarti timings, Maha Prasad, competitions, cleanliness drives, and immersion photos') }}
          </p>
        </div>
      </div>

      <!-- Festival Selector Tabs -->
      <div class="flex flex-wrap gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
        @for (fest of mandalData.festivalEvents; track fest.id) {
          <button
            (click)="selectedFestivalId.set(fest.id)"
            [class.bg-amber-500]="selectedFestivalId() === fest.id"
            [class.text-slate-950]="selectedFestivalId() === fest.id"
            [class.font-black]="selectedFestivalId() === fest.id"
            [class.shadow]="selectedFestivalId() === fest.id"
            [class.bg-white]="selectedFestivalId() !== fest.id"
            [class.text-slate-700]="selectedFestivalId() !== fest.id"
            class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-devanagari border border-slate-200 hover:border-amber-400 transition"
          >
            {{ mandalData.isEnglish() ? fest.nameEn : fest.nameMr }}
          </button>
        }
      </div>

      <!-- Active Festival Details -->
      @if (currentFestival(); as fest) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Schedule & Details -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Overview Card -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 class="text-xl font-bold text-slate-900 font-devanagari">{{ mandalData.isEnglish() ? fest.nameEn : fest.nameMr }}</h2>
                  <div class="text-xs text-amber-700 font-bold font-devanagari">{{ fest.taglineMr }}</div>
                </div>
                <div class="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold font-sans">
                  📅 {{ mandalData.formatNum(fest.datesMr) }}
                </div>
              </div>
              <p class="text-xs leading-relaxed text-slate-600 font-devanagari">
                {{ fest.descriptionMr }}
              </p>
            </div>

            <!-- Official Ganeshotsav 2026 Flyer / Patrika Showcase with Event Photos -->
            @if (fest.id === 'ganeshotsav') {
              <div class="bg-gradient-to-b from-amber-50 via-white to-orange-50/30 rounded-2xl border-2 border-amber-300 shadow-md p-4 sm:p-6 space-y-5">
                
                <!-- Flyer Header Banner -->
                <div class="text-center space-y-2 border-b-2 border-dashed border-amber-300 pb-4">
                  <div class="text-xs font-bold text-amber-800 tracking-widest font-devanagari">
                    ॥ श्री गणेशाय नमः ॥
                  </div>
                  <div class="flex items-center justify-center gap-2 sm:gap-3">
                    <span class="text-xl sm:text-2xl">🌺</span>
                    <h2 class="text-lg sm:text-2xl md:text-3xl font-black text-red-950 font-devanagari tracking-wide">
                      ॥ श्री अष्टविनायक मित्र मंडळ ॥
                    </h2>
                    <span class="text-xl sm:text-2xl">🌺</span>
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 font-semibold font-devanagari">
                    रजि. नं. १९१२३ जी.बी.बी.एस.डी • आदर्श नगर व शिव स्फूर्ती, जोगेश्वरी (पश्चिम)
                  </p>
                  
                  <div class="pt-1 flex flex-wrap items-center justify-center gap-2">
                    <span class="px-3.5 py-1 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white font-black text-xs sm:text-sm md:text-base rounded-full shadow-sm font-devanagari">
                      ॥ गणेशोत्सव २०२६ ॥
                    </span>
                    <span class="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-xs font-devanagari border border-amber-500">
                      यंदाचे २९ वे वर्ष (३० वा वर्धापन दिन)
                    </span>
                  </div>
                  
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-950 text-xs font-bold rounded-lg mt-1 font-devanagari">
                    <span>🗓️</span>
                    <span>१४ सप्टेंबर २०२६ प्रतिष्ठापना ते २५ सप्टेंबर २०२६ अनंत चतुर्दशी विसर्जन</span>
                  </div>
                </div>

                <!-- Flyer Programs Grid (With Authentic Photos for Every Event) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  
                  <!-- 1. चित्रकला स्पर्धा (Drawing Competition) -->
                  <div class="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50/90 via-white to-amber-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-rose-700 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          चित्रकला स्पर्धा
                        </span>
                        <span class="text-xl">🎨</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-rose-200 bg-slate-100"
                        (click)="openPhoto('चित्रकला स्पर्धा - बाप्पाचे रेखाटन व रंगभरण', '१० वर्षांखालील व ११ ते १५ वर्षे वयोगटातील स्पर्धकांनी काढलेली गणपती बाप्पाची अप्रतिम चित्रे.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80"
                          alt="चित्रकला स्पर्धा"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>स्पर्धा फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="space-y-1 text-xs text-slate-700 font-devanagari">
                        <div class="font-bold text-rose-950">विषय : गणपती बाप्पा</div>
                        <div class="text-[11px] text-slate-600">
                          वयोगट : <span class="font-semibold text-slate-800">१) १० वर्षांखालील  २) ११ ते १५ वर्षे</span>
                        </div>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-rose-200 flex items-center justify-between text-[11px] font-bold text-rose-900">
                      <span>📅 २२ सप्टेंबर २०२६</span>
                      <span>⏰ सायं. ५.०० वा.</span>
                    </div>
                  </div>

                  <!-- 2. वक्तृत्व स्पर्धा (Elocution Competition) -->
                  <div class="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-indigo-700 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          वक्तृत्व स्पर्धा
                        </span>
                        <span class="text-xl">🎙️</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-indigo-200 bg-slate-100"
                        (click)="openPhoto('वक्तृत्व स्पर्धा - बालवक्त्यांचे प्रभावी भाषण', 'माझी आई, माझा आवडता सण व माझी शाळा या विषयांवर मंचावरून ओजस्वी भाषण सादरीकरण.', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80"
                          alt="वक्तृत्व स्पर्धा"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>स्पर्धा फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="space-y-1 text-xs text-slate-700 font-devanagari">
                        <div class="font-bold text-indigo-950">विषय : १) माझी आई  २) माझा आवडता सण  ३) माझी शाळा</div>
                        <div class="text-[11px] text-slate-600">
                          वयोगट : <span class="font-semibold text-slate-800">१) १० वर्षांखालील  २) ११ ते १५ वर्षे</span>
                        </div>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-indigo-200 flex items-center justify-between text-[11px] font-bold text-indigo-900">
                      <span>📅 २३ सप्टेंबर २०२६</span>
                      <span>⏰ सायं. ५.०० वा.</span>
                    </div>
                  </div>

                  <!-- 3. स्वच्छता मोहीम (Swachhata Mohim Drive) -->
                  <div class="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-emerald-800 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          स्वच्छता मोहीम
                        </span>
                        <span class="text-xl">🧹🌿</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-emerald-200 bg-slate-100"
                        (click)="openPhoto('स्वच्छता मोहीम - स्वच्छ भारत झाडू श्रमदान', 'आदर्श नगर व शिव स्फूर्ती परिसरात मंडळ कार्यकर्ते व नागरिकांनी मिळून केलेले परिसर स्वच्छता श्रमदान.', 'https://commons.wikimedia.org/wiki/Special:FilePath/PM_Modi_launches_the_Swachh_Bharat_Abhiyaan_(1).jpg?width=1000')"
                      >
                        <img
                          src="https://commons.wikimedia.org/wiki/Special:FilePath/PM_Modi_launches_the_Swachh_Bharat_Abhiyaan_(1).jpg?width=1000"
                          alt="स्वच्छता मोहीम"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>श्रमदान फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="text-xs text-slate-700 font-devanagari leading-relaxed">
                        <div class="font-bold text-emerald-950">परिसर स्वच्छता व प्लास्टिक मुक्ती संकल्प</div>
                        <p class="text-[11px] text-slate-600 mt-0.5">मंडळ कार्यकर्त्यांचा झाडू श्रमदान उपक्रम.</p>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] font-bold text-emerald-900">
                      <span>📅 अखंड उपक्रम</span>
                      <span>⏰ स. ७ ते ९ वा.</span>
                    </div>
                  </div>

                  <!-- 4. मोफत नेत्र तपासणी शिबिर -->
                  <div class="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-teal-800 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          मोफत नेत्र तपासणी शिबिर
                        </span>
                        <span class="text-xl">👁️👓</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-teal-200 bg-slate-100"
                        (click)="openPhoto('मोफत नेत्र तपासणी शिबिर व चष्मे वाटप', 'तज्ज्ञ नेत्ररोग तज्ज्ञांद्वारे मोफत नेत्र तपासणी व चष्म्यांचे वाटप.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
                          alt="मोफत नेत्र तपासणी शिबिर"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>शिबिर फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="text-xs text-slate-700 font-devanagari leading-relaxed">
                        <div class="font-bold text-teal-950">सर्वांसाठी मोफत नेत्र तपासणी व चष्मे वाटप</div>
                        <p class="text-[11px] text-slate-600 mt-0.5">तज्ज्ञ डॉक्टरांच्या पथकाद्वारे मोफत तपासणी.</p>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-teal-200 flex items-center justify-between text-[11px] font-bold text-teal-900">
                      <span>📅 २४ सप्टेंबर २०२६</span>
                      <span>⏰ स. १० ते दु. ३ वा.</span>
                    </div>
                  </div>

                  <!-- 5. श्री सत्यनारायण महापूजा -->
                  <div class="rounded-xl border border-red-200 bg-gradient-to-br from-red-50/90 via-white to-amber-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-red-800 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          श्री सत्यनारायण महापूजा
                        </span>
                        <span class="text-xl">🪔</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-red-200 bg-slate-100"
                        (click)="openPhoto('श्री सत्यनारायण महापूजा व तीर्थप्रसाद सोहळा', 'गणरायाच्या साक्षीने वैदिक मंत्रोच्चारात संपन्न झालेली सत्यनारायण महापूजा व तीर्थप्रसाद.', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"
                          alt="श्री सत्यनारायण महापूजा"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>महापूजा फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="text-xs text-slate-700 font-devanagari leading-relaxed">
                        <p class="font-bold text-red-950">सहकुटुंब सहभागी व्हावे, ही नम्र विनंती.</p>
                        <p class="text-[11px] text-slate-600 mt-0.5">गणरायाच्या चरणी महापूजा व तीर्थप्रसाद.</p>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-red-200 flex items-center justify-between text-[11px] font-bold text-red-900">
                      <span>📅 २४ सप्टेंबर २०२६</span>
                      <span>⏰ दुपारी ३.०० वा.</span>
                    </div>
                  </div>

                  <!-- 6. विशेष पाहुण्यांचा सत्कार समारंभ -->
                  <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-purple-800 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          विशेष पाहुण्यांचा सत्कार
                        </span>
                        <span class="text-xl">💐</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-purple-200 bg-slate-100"
                        (click)="openPhoto('विशेष पाहुण्यांचा सत्कार समारंभ व सन्मान', 'परिसरातील मान्यवर व अतिथींचा शाल व सन्मानचिन्ह देऊन यथोचित गौरव.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
                          alt="विशेष पाहुण्यांचा सत्कार"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>सत्कार फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="text-xs text-slate-700 font-devanagari leading-relaxed">
                        <p class="font-bold text-purple-950">परिसरातील मान्यवर व अतिथींचा सन्मान</p>
                        <p class="text-[11px] text-slate-600 mt-0.5">मंडळाच्या वतीने यथोचित सत्कार समारंभ.</p>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-purple-200 flex items-center justify-between text-[11px] font-bold text-purple-900">
                      <span>📅 २४ सप्टेंबर २०२६</span>
                      <span>⏰ सायं. ६.०० वा. नंतर</span>
                    </div>
                  </div>

                  <!-- 7. पारितोषिक वितरण (Prize Distribution) -->
                  <div class="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-amber-700 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          पारितोषिक वितरण
                        </span>
                        <span class="text-xl">🏆</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-amber-300 bg-slate-100"
                        (click)="openPhoto('सांस्कृतिक स्पर्धा पारितोषिक वितरण - चषक व पदके', 'चित्रकला व वक्तृत्व स्पर्धेतील विजेत्या विद्यार्थ्यांना चषक व प्रमाणपत्र प्रदान.', 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80"
                          alt="पारितोषिक वितरण"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>पारितोषिक फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="text-xs text-slate-700 font-devanagari leading-relaxed">
                        <p class="font-bold text-amber-950">सांस्कृतिक स्पर्धा पारितोषिक सोहळा</p>
                        <p class="text-[11px] text-slate-600 mt-0.5">स्पर्धक व विजेत्या बालकांचा गौरव व बक्षिसे.</p>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-amber-300 flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span>📅 २४ सप्टेंबर २०२६</span>
                      <span>⏰ सायं. ७.३० वा.</span>
                    </div>
                  </div>

                  <!-- 8. स्थानिक सांस्कृतिक सुरवर भजन (Survar Bhajan) -->
                  <div class="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/50 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 bg-cyan-800 text-white rounded-md text-xs font-bold font-devanagari shadow-xs">
                          स्थानिक सुरवर भजन
                        </span>
                        <span class="text-xl">🪕</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-cyan-200 bg-slate-100"
                        (click)="openPhoto('स्थानिक सांस्कृतिक सुरवर भजन संध्या', 'पेटी, तबला व टाळांच्या गजरात रंगलेली भक्तिमय भजन मैफल.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
                          alt="स्थानिक सुरवर भजन"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>भजन फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="text-xs text-slate-700 font-devanagari leading-relaxed">
                        <p class="font-bold text-cyan-950">स्थानिक सांस्कृतिक सुरवर भजन</p>
                        <p class="text-[11px] text-slate-600 mt-0.5">कलाकारांचे भक्तिमय व सुश्राव्य भजन सादरीकरण.</p>
                      </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-cyan-200 flex items-center justify-between text-[11px] font-bold text-cyan-900">
                      <span>📅 २४ सप्टेंबर २०२६</span>
                      <span>⏰ रात्री ८.०० वा.</span>
                    </div>
                  </div>

                  <!-- 9. भंडारा महाप्रसाद (Bhandara Mahaprasad) -->
                  <div class="rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-1.5">
                          <span class="px-2.5 py-0.5 bg-amber-800 text-white rounded-md text-xs font-black font-devanagari shadow-xs">
                            भंडारा महाप्रसाद
                          </span>
                        </div>
                        <span class="text-2xl">🍲</span>
                      </div>

                      <!-- Photo Thumbnail -->
                      <div
                        class="relative h-28 rounded-lg overflow-hidden mb-2.5 group/img cursor-pointer border border-amber-300 bg-slate-100"
                        (click)="openPhoto('अखंड भंडारा महाप्रसाद व अन्नदान सोहळा', 'सर्व भाविकांसाठी अन्नदान व गरमागरम महाप्रसाद सेवा.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80')"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80"
                          alt="भंडारा महाप्रसाद"
                          (error)="onPhotoErr($event)"
                          loading="lazy"
                          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span class="text-[10px] text-white font-bold font-devanagari flex items-center gap-1">
                            <span>📸</span>
                            <span>महाप्रसाद फोटो</span>
                          </span>
                          <span class="text-[10px] text-amber-300 font-bold font-sans">🔍 मोठी करा</span>
                        </div>
                      </div>

                      <div class="p-2 bg-white/90 rounded-lg border border-amber-300 text-xs font-devanagari text-slate-800 space-y-1">
                        <p class="font-medium text-amber-950 text-[11px]">
                          महाप्रसादासाठी योगदानासाठी संपर्क:
                        </p>
                        <div class="flex items-center justify-between gap-1 pt-1 border-t border-amber-200">
                          <span class="font-bold text-slate-900 text-[11px]">जगदीश शिंदे (खजिनदार)</span>
                          <a
                            href="tel:+919820668739"
                            class="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold"
                          >
                            📞 ९८२०६६८७३९
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="mt-2 pt-2 border-t border-amber-300 flex items-center justify-between text-[11px] font-bold text-amber-950">
                      <span>📅 २४ सप्टेंबर २०२६</span>
                      <span>⏰ रात्री ८.०० वा. नंतर</span>
                    </div>
                  </div>

                </div>

                <!-- 10. बाप्पाचे विसर्जन मिरवणूक (अनंत चतुर्दशी) Banner with Photo -->
                <div class="rounded-xl bg-gradient-to-r from-red-800 via-orange-700 to-amber-800 text-white p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/30 cursor-pointer group/v"
                      (click)="openPhoto('बाप्पाचे विसर्जन मिरवणूक सोहळा', 'ढोल-ताशांच्या गजरात, गुलालाच्या उधळणीत व बाप्पाच्या जयघोषात निघालेली विसर्जन मिरवणूक.', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganesh_Visarjan_Festival_India.jpg?width=1000')"
                      title="विसर्जन मिरवणूक फोटो पहा"
                    >
                      <img
                        src="https://commons.wikimedia.org/wiki/Special:FilePath/Ganesh_Visarjan_Festival_India.jpg?width=1000"
                        alt="विसर्जन मिरवणूक"
                        (error)="onPhotoErr($event)"
                        class="w-full h-full object-cover group-hover/v:scale-110 transition-transform"
                      />
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/v:opacity-100 transition">
                        <span class="text-xs">🔍</span>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="text-base sm:text-lg font-black font-devanagari">बाप्पाचे विसर्जन मिरवणूक</h4>
                        <span class="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md font-devanagari">
                          अनंत चतुर्दशी
                        </span>
                      </div>
                      <p class="text-xs text-amber-100 font-devanagari mt-0.5">
                        ढोल-ताशांच्या गजरात, गुलालाच्या उधळणीत व बाप्पाच्या जयघोषात, सर्वांनी मोठ्या संख्येने सहभागी व्हावे.
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <div class="text-center sm:text-right">
                      <div class="text-xs font-bold text-amber-200">📅 २५ सप्टेंबर २०२६</div>
                      <div class="text-sm font-black text-white">⏰ सायं. ६.०० वा.</div>
                    </div>
                    <button
                      (click)="openPhoto('बाप्पाचे विसर्जन मिरवणूक सोहळा', 'चौपाटीवर लाखो भाविकांच्या उपस्थितीत बाप्पाचा भावपूर्ण विसर्जन सोहळा.', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganpati_Visarjan.jpg?width=1000')"
                      class="px-3 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-xs font-bold font-devanagari text-center transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📸 विसर्जन फोटो पहा</span>
                    </button>
                  </div>
                </div>

                <!-- Direct Button to Open Gallery With All Ganeshotsav Photos -->
                <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-100/60 p-3 rounded-xl border border-amber-300">
                  <div class="text-xs font-bold text-amber-950 font-devanagari flex items-center gap-2">
                    <span class="text-base">🖼️</span>
                    <span>गणेशोत्सवातील चित्रकला, वक्तृत्व, नेत्र शिबिर, महापूजा, पारितोषिक, भजन व विसर्जनाची सर्व छायाचित्रे गॅलरीत उपलब्ध आहेत.</span>
                  </div>
                  <a
                    routerLink="/gallery"
                    [queryParams]="{ cat: 'ganesh-events' }"
                    class="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white text-xs font-black rounded-xl font-devanagari shadow-xs transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🎨</span>
                    <span>गॅलरीमध्ये सर्व स्पर्धा फोटो पहा</span>
                    <span>→</span>
                  </a>
                </div>

                <!-- Footer Slogan -->
                <div class="text-center text-xs font-black text-amber-900 font-devanagari tracking-wider">
                  ॥ गणपती बाप्पा मोरया ... मंगलमूर्ती मोरया ॥
                </div>

              </div>
            }

            <!-- Daily Schedule Timeline -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h3 class="font-bold text-base text-slate-800 font-devanagari flex items-center gap-2">
                  <span>⏰</span>
                  <span>{{ mandalData.t('तपशीलवार कार्यक्रम व आरती वेळापत्रक', 'Detailed Event Schedule & Aarti Timings') }}</span>
                </h3>
                <span class="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-devanagari">
                  {{ fest.schedule.length }} कार्यक्रम नोंदवले आहेत
                </span>
              </div>

              <div class="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-amber-200 pl-2">
                @for (item of fest.schedule; track item.titleMr + item.time) {
                  <div class="relative flex items-start gap-4">
                    <div class="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-amber-100 z-10">
                      {{ item.icon || '●' }}
                    </div>
                    <div class="bg-slate-50 hover:bg-amber-50/50 p-3.5 rounded-xl border border-slate-200 flex-1 transition">
                      <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <div class="flex items-center gap-2 flex-wrap">
                          <h4 class="font-bold text-slate-900 text-sm font-devanagari">{{ item.titleMr }}</h4>
                          @if (item.category) {
                            <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-devanagari font-medium">
                              {{ item.category }}
                            </span>
                          }
                        </div>
                        <div class="flex items-center gap-1.5 flex-wrap">
                          @if (item.date) {
                            <span class="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 px-2 py-0.5 rounded font-devanagari">
                              📅 {{ mandalData.formatNum(item.date) }}
                            </span>
                          }
                          <span class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-sans">
                            ⏰ {{ mandalData.formatNum(item.time) }}
                          </span>
                        </div>
                      </div>
                      <p class="text-xs text-slate-600 font-devanagari mt-1.5 leading-relaxed">
                        {{ item.descMr }}
                      </p>
                      @if (item.contact) {
                        <div class="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                          <span class="text-[11px] font-bold text-amber-900 font-devanagari">
                            🤝 योगदानासाठी संपर्क: {{ item.contact }}
                          </span>
                          <a
                            href="tel:+919820668739"
                            class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            <span>कॉल करा</span>
                          </a>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Visarjan Miravnuk & Special Highlights -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-3">
              <h3 class="font-bold text-base text-slate-800 font-devanagari flex items-center gap-2">
                <span>🚩</span>
                <span>{{ mandalData.t('विशेष आकर्षणे व विसर्जन मिरवणूक मार्ग', 'Special Highlights & Procession Route') }}</span>
              </h3>
              <div class="space-y-2">
                @for (hl of fest.highlights; track hl) {
                  <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs font-devanagari text-slate-800 flex items-center gap-2.5 font-medium">
                    <span class="text-amber-600">✦</span>
                    <span>{{ mandalData.formatNum(hl) }}</span>
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Right 1 Col: Notices & Gallery -->
          <div class="space-y-6">
            
            <!-- Public Notices Board -->
            <div class="bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-xl shadow-sm border border-amber-200 p-5 space-y-3">
              <div class="flex items-center gap-2 text-amber-900">
                <span class="text-lg">📢</span>
                <h3 class="font-bold text-base font-devanagari">{{ mandalData.t('मंडळ सूचना फलक', 'Mandal Notice Board') }}</h3>
              </div>
              <div class="space-y-2.5">
                @for (notice of fest.notices; track notice) {
                  <div class="text-xs text-slate-700 font-devanagari bg-white p-3 rounded-lg border border-amber-200/80 shadow-xs">
                    {{ notice }}
                  </div>
                }
              </div>
              <div class="pt-2 text-[11px] text-amber-900 font-bold border-t border-amber-200">
                {{ mandalData.t('आपत्कालीन संपर्क: १०० (पोलीस) | १०१ (अग्निशामक) | +91 98201 44552 (मंडळ अध्यक्ष)', 'Emergency Contacts: 100 (Police) | 101 (Fire) | +91 98201 44552 (Mandal President)') }}
              </div>
            </div>

            <!-- Photo Memories Gallery Card -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-3">
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-bold text-base text-slate-800 font-devanagari flex items-center gap-2">
                  <span>📸</span>
                  <span>{{ mandalData.t('उत्सव व स्पर्धा छायाचित्रे', 'Festival & Event Photos') }}</span>
                </h3>
                <a
                  routerLink="/gallery"
                  class="text-[11px] font-bold text-amber-700 hover:text-amber-800 font-devanagari flex items-center gap-0.5"
                >
                  <span>सर्व पहा</span>
                  <span>→</span>
                </a>
              </div>

              <div class="grid grid-cols-2 gap-2">
                @for (img of galleryPhotos; track img.title) {
                  <div
                    class="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video cursor-pointer shadow-xs hover:shadow-md transition"
                    (click)="selectedPhoto.set(img)"
                  >
                    <img
                      [src]="img.url"
                      [alt]="img.title"
                      (error)="onPhotoErr($event)"
                      loading="lazy"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-2 transition">
                      <span class="text-white text-[10px] sm:text-[11px] font-bold font-devanagari line-clamp-1 group-hover:text-amber-300">
                        {{ img.title }}
                      </span>
                    </div>
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold">
                      {{ mandalData.t('मोठे पहा 🔍', 'View Full 🔍') }}
                    </div>
                  </div>
                }
              </div>

              <div class="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  routerLink="/gallery"
                  [queryParams]="{ cat: 'ganesh-events' }"
                  class="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl text-center font-devanagari transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>🎨</span>
                  <span>{{ mandalData.t('गणेशोत्सव स्पर्धा दालन उघडा', 'Open Ganeshotsav Contests Gallery') }}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      }

      <!-- Lightbox Modal -->
      @if (selectedPhoto(); as photo) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-fade-in" (click)="selectedPhoto.set(null)">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20" (click)="$event.stopPropagation()">
            <div class="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              <img [src]="photo.url" [alt]="photo.title" class="max-h-full max-w-full object-contain" />
              <button
                (click)="selectedPhoto.set(null)"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div class="p-4 text-center space-y-2">
              <h4 class="font-bold text-slate-900 text-sm sm:text-base font-devanagari">{{ photo.title }}</h4>
              <p class="text-xs text-slate-500 font-devanagari leading-relaxed">{{ photo.desc }}</p>
              <div class="pt-2 flex items-center justify-center gap-2">
                <a
                  routerLink="/gallery"
                  [queryParams]="{ cat: 'ganesh-events' }"
                  (click)="selectedPhoto.set(null)"
                  class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl font-devanagari transition shadow-xs"
                >
                  {{ mandalData.t('सर्व गॅलरी पहा', 'View All Gallery') }} →
                </a>
                <button
                  (click)="selectedPhoto.set(null)"
                  class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {{ mandalData.t('बंद करा', 'Close') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class UtsavComponent {
  readonly mandalData = inject(MandalDataService);

  readonly selectedFestivalId = signal<string>('ganeshotsav');
  readonly selectedPhoto = signal<{ title: string; desc: string; url: string } | null>(null);

  readonly currentFestival = () => {
    return this.mandalData.festivalEvents.find(f => f.id === this.selectedFestivalId()) || this.mandalData.festivalEvents[0];
  };

  openPhoto(title: string, desc: string, url: string): void {
    this.selectedPhoto.set({ title, desc, url });
  }

  readonly galleryPhotos = [
    {
      title: 'चित्रकला स्पर्धा - बाप्पाचे रेखाटन व रंगभरण',
      desc: '१० वर्षांखालील व ११ ते १५ वर्षे वयोगटातील चिमुकल्यांनी श्री गणेशाची काढलेली अप्रतिम चित्रे.',
      url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'वक्तृत्व स्पर्धा - बालवक्त्यांचे प्रभावी भाषण',
      desc: "'माझी आई', 'माझा आवडता सण' व 'माझी शाळा' विषयांवर विद्यार्थ्यांचे ओजस्वी सादरीकरण.",
      url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'स्वच्छता मोहीम - परिसर झाडू श्रमदान',
      desc: 'आदर्श नगर व शिव स्फूर्ती परिसराची सर्व कार्यकर्त्यांनी केलेली सामूहिक स्वच्छता व प्लास्टिक मुक्ती.',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/PM_Modi_launches_the_Swachh_Bharat_Abhiyaan_(1).jpg?width=1000'
    },
    {
      title: 'मोफत नेत्र तपासणी शिबिर व चष्मे वाटप',
      desc: 'तज्ज्ञ डॉक्टरांच्या उपस्थितीत परिसरातील नागरिकांची मोफत डोळ्यांची तपासणी व चष्मे वाटप.',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'श्री सत्यनारायण महापूजा व तीर्थप्रसाद सोहळा',
      desc: 'वैदिक मंत्रोच्चारात गणपती बाप्पाच्या चरणी सत्यनारायण महापूजा व भाविकांना तीर्थप्रसाद.',
      url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'सांस्कृतिक स्पर्धा पारितोषिक वितरण',
      desc: 'विजेत्या लहान मुलांना सुवर्ण चषक, पदके व गौरव प्रमाणपत्र प्रदान सोहळा.',
      url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'स्थानिक सांस्कृतिक सुरवर भजन संध्या',
      desc: 'पेटी, तबला व टाळांच्या गजरात रंगलेली स्थानिक कलाकारांची भक्तिमय भजन मैफल.',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'अखंड भंडारा महाप्रसाद व अन्नदान',
      desc: 'सर्व भाविकांसाठी महाप्रसाद आणि अन्नदान सेवा कार्य.',
      url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80'
    },
    {
      title: 'गणपती बाप्पा विसर्जन मिरवणूक सोहळा',
      desc: 'चौपाटीवर लाखो भाविकांच्या उपस्थितीत बाप्पाचा भावपूर्ण व भव्य विसर्जन सोहळा.',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganpati_Visarjan.jpg?width=1000'
    },
    {
      title: 'श्री अष्टविनायक मित्र मंडळ - मंडप दर्शन',
      desc: 'जोगेश्वरी आदर्श नगर व शिव स्फूर्ती परिसरातील बाप्पाचे मनमोहक रूप व सुंदर देखावा.',
      url: '/reference_dashboard.jpg'
    }
  ];

  onPhotoErr(event: Event): void {
    const img = event.target as HTMLElement;
    img.style.display = 'none';
  }
}
