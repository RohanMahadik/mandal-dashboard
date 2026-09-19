import { Component, inject, signal, computed, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

export interface GalleryPhoto {
  id: number;
  titleMr: string;
  titleEn: string;
  category: 'ganesh-events' | 'ganpati-visarjan' | 'swachhata' | 'navratri' | 'bathukamma' | 'ambedkar-jayanti' | 'shiv-jayanti';
  categoryMr: string;
  categoryEn: string;
  icon: string;
  date: string;
  year: string;
  url: string;
  descMr: string;
  descEn: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 pb-12 animate-fade-in">
      
      <!-- Top Banner -->
      <div class="bg-gradient-to-r from-amber-700 via-orange-800 to-red-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute right-0 top-0 bottom-0 opacity-15 flex items-center pr-6 text-9xl pointer-events-none select-none">
          📸
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
            <span>{{ mandalData.t('अधिकृत उत्सव व स्पर्धा क्षणचित्रे', 'Official Festival & Competition Moments') }}</span>
          </div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
            {{ mandalData.t('छायाचित्र दालन (Photo Gallery)', 'Photo Gallery') }}
          </h1>
          <p class="text-amber-100 text-xs md:text-sm mt-1 max-w-2xl font-devanagari leading-relaxed">
            {{ mandalData.t(
              'गणेशोत्सव चित्रकला व वक्तृत्व स्पर्धा, स्वच्छता मोहीम, मोफत नेत्र तपासणी, महापूजा, पारितोषिक वितरण, सुरवर भजन, महाप्रसाद, विसर्जन मिरवणूक, नवरात्र, बथुकम्मा, डॉ. आंबेडकर जयंती व शिवजयंतीची अस्सल छायाचित्रे.',
              'Authentic photos of Ganeshotsav drawing & speech competitions, cleanliness drive, eye checkup camp, Mahapooja, prize distribution, bhajan, visarjan procession, and annual festivals.'
            ) }}
          </p>

          <!-- Badges -->
          <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span class="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-lg font-bold border border-white/20 flex items-center gap-1.5">
              <span>🖼️</span>
              <span>{{ mandalData.t('एकूण छायाचित्रे:', 'Total Photos:') }} {{ mandalData.formatNum(photos.length.toString()) }}</span>
            </span>
            <span class="px-3 py-1 bg-amber-400 text-slate-950 rounded-lg font-bold flex items-center gap-1.5 shadow-xs">
              <span>✓</span>
              <span>{{ mandalData.t('केवळ संबंधित व अस्सल उत्सव फोटो', 'Authentic Event-Specific Photos') }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Category Filter Tabs & Search Bar -->
      <div class="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4 space-y-4">
        
        <!-- Search & Info Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:w-96">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              [placeholder]="mandalData.t('छायाचित्र शोधा... (उदा. चित्रकला, वक्तृत्व, स्वच्छता, भजन, विसर्जन, गरबा)', 'Search photos (e.g. drawing, speech, cleanliness, bhajan)...')"
              class="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-amber-500 font-devanagari transition bg-slate-50 focus:bg-white"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            @if (searchQuery) {
              <button (click)="searchQuery = ''" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">✕</button>
            }
          </div>

          <div class="text-xs text-slate-500 font-devanagari flex items-center gap-1.5 self-end sm:self-center">
            <span>दिसणारे फोटो:</span>
            <span class="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-sans">
              {{ mandalData.formatNum(filteredPhotos().length.toString()) }} / {{ mandalData.formatNum(photos.length.toString()) }}
            </span>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2 pt-1 border-t border-slate-100">
          @for (cat of categories; track cat.key) {
            <button
              (click)="selectedCategory.set(cat.key)"
              [class.bg-amber-500]="selectedCategory() === cat.key"
              [class.text-slate-950]="selectedCategory() === cat.key"
              [class.font-black]="selectedCategory() === cat.key"
              [class.shadow-xs]="selectedCategory() === cat.key"
              [class.border-amber-600]="selectedCategory() === cat.key"
              [class.bg-slate-50]="selectedCategory() !== cat.key"
              [class.text-slate-700]="selectedCategory() !== cat.key"
              class="px-3 py-1.5 rounded-xl text-xs font-devanagari border border-slate-200 hover:border-amber-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{{ cat.icon }}</span>
              <span>{{ mandalData.isEnglish() ? cat.nameEn : cat.nameMr }}</span>
              <span class="text-[10px] opacity-80 font-sans px-1.5 py-0.2 rounded-full bg-black/10">
                {{ getCategoryCount(cat.key) }}
              </span>
            </button>
          }
        </div>

      </div>

      <!-- Photo Grid -->
      @if (filteredPhotos().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          @for (photo of filteredPhotos(); track photo.id; let idx = $index) {
            <div
              class="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              (click)="openLightbox(photo)"
            >
              <!-- Image Container -->
              <div class="relative aspect-4/3 overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200">
                <img
                  [src]="photo.url"
                  [alt]="photo.titleMr"
                  (error)="onImgError($event)"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                
                <!-- Fallback Container if Image Fails -->
                <div class="hidden absolute inset-0 bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span class="text-4xl mb-1">{{ photo.icon }}</span>
                  <span class="font-bold text-xs font-devanagari">{{ photo.titleMr }}</span>
                </div>

                <!-- Category Tag Top Left -->
                <div class="absolute top-2.5 left-2.5">
                  <span class="px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded-md text-[10px] font-bold font-devanagari shadow-xs flex items-center gap-1">
                    <span>{{ photo.icon }}</span>
                    <span>{{ mandalData.isEnglish() ? photo.categoryEn : photo.categoryMr }}</span>
                  </span>
                </div>

                <!-- Year Tag Top Right -->
                <div class="absolute top-2.5 right-2.5">
                  <span class="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-md text-[10px] font-devanagari shadow-xs">
                    {{ mandalData.formatNum(photo.year) }}
                  </span>
                </div>

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span class="text-white text-xs font-bold font-devanagari flex items-center gap-1.5">
                    <span>🔍</span>
                    <span>{{ mandalData.t('मोठे पहा (Full View)', 'View Full Photo') }}</span>
                  </span>
                </div>
              </div>

              <!-- Content Below Image -->
              <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 class="font-bold text-slate-900 text-xs sm:text-sm font-devanagari group-hover:text-amber-700 transition line-clamp-1">
                    {{ mandalData.isEnglish() ? photo.titleEn : photo.titleMr }}
                  </h3>
                  <p class="text-[11px] text-slate-500 font-devanagari mt-1 line-clamp-2 leading-relaxed">
                    {{ mandalData.isEnglish() ? photo.descEn : photo.descMr }}
                  </p>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 font-devanagari">
                  <span>📅 {{ mandalData.formatNum(photo.date) }}</span>
                  <span class="text-amber-600 font-bold group-hover:translate-x-0.5 transition">पहा →</span>
                </div>
              </div>

            </div>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div class="text-5xl">📷</div>
          <h3 class="text-base font-bold text-slate-800 font-devanagari">
            {{ mandalData.t('या वर्गात कोणतीही छायाचित्रे आढळली नाहीत', 'No photos found matching your filter') }}
          </h3>
          <p class="text-xs text-slate-500 font-devanagari">
            {{ mandalData.t('कृपया वेगळा शोध शब्द वापरा किंवा सर्व छायाचित्रे निवडा.', 'Please try a different search or select All Photos.') }}
          </p>
          <button
            (click)="selectedCategory.set('all'); searchQuery = ''"
            class="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold font-devanagari shadow-xs hover:bg-amber-400 transition cursor-pointer"
          >
            {{ mandalData.t('सर्व छायाचित्रे पहा', 'View All Photos') }}
          </button>
        </div>
      }

      <!-- Bottom Upload / Contact Banner -->
      <div class="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 border border-amber-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3.5 text-center sm:text-left">
          <div class="w-12 h-12 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center text-2xl shrink-0">
            🤝
          </div>
          <div>
            <h4 class="font-bold text-sm text-slate-900 font-devanagari">
              {{ mandalData.t('आपल्याकडे मंडळाच्या स्पर्धा व उपक्रमांची आणखी छायाचित्रे आहेत का?', 'Do you have more authentic celebration photos?') }}
            </h4>
            <p class="text-xs text-slate-600 font-devanagari mt-0.5">
              {{ mandalData.t('सोशल मीडिया व प्रसिद्धी प्रमुखांशी संपर्क करून आपले फोटो गॅलरीत जोडण्यासाठी पाठवू शकता.', 'Send your photos to our media coordinators to feature them in the official gallery.') }}
            </p>
          </div>
        </div>
        <a
          routerLink="/connect"
          class="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold font-devanagari transition shadow-xs whitespace-nowrap"
        >
          {{ mandalData.t('प्रसिद्धी प्रमुखांशी संपर्क साधा', 'Contact Media Team') }} →
        </a>
      </div>

    </div>

    <!-- Lightbox Modal -->
    @if (activePhoto(); as photo) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none"
        (click)="closeLightbox()"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-white/20"
          (click)="$event.stopPropagation()"
        >
          
          <!-- Modal Header -->
          <div class="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded-md text-[11px] font-devanagari flex items-center gap-1">
                <span>{{ photo.icon }}</span>
                <span>{{ mandalData.isEnglish() ? photo.categoryEn : photo.categoryMr }}</span>
              </span>
              <span class="text-xs text-slate-300 font-devanagari">
                {{ mandalData.formatNum(photo.date) }} ({{ mandalData.formatNum(photo.year) }})
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400 font-sans">
                {{ currentPhotoIndex() + 1 }} / {{ filteredPhotos().length }}
              </span>
              <button
                (click)="closeLightbox()"
                class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
                title="बंद करा (Close)"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Main Image Display with Prev/Next Navigation -->
          <div class="relative bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] sm:max-h-[65vh] overflow-hidden group">
            <img
              [src]="photo.url"
              [alt]="photo.titleMr"
              (error)="onImgError($event)"
              class="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain mx-auto transition-transform duration-300"
            />
            
            <div class="hidden absolute inset-0 bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 flex flex-col items-center justify-center text-white p-6 text-center">
              <span class="text-6xl mb-2">{{ photo.icon }}</span>
              <h3 class="text-xl font-bold font-devanagari">{{ photo.titleMr }}</h3>
            </div>

            <!-- Prev Button -->
            @if (filteredPhotos().length > 1) {
              <button
                (click)="prevPhoto($event)"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center text-lg font-black transition shadow-lg backdrop-blur-xs cursor-pointer"
                title="मागील फोटो (Previous Photo)"
              >
                ‹
              </button>
              
              <!-- Next Button -->
              <button
                (click)="nextPhoto($event)"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center text-lg font-black transition shadow-lg backdrop-blur-xs cursor-pointer"
                title="पुढील फोटो (Next Photo)"
              >
                ›
              </button>
            }
          </div>

          <!-- Modal Footer Details -->
          <div class="p-4 sm:p-5 bg-white space-y-2 border-t border-slate-200">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h3 class="font-bold text-slate-900 text-sm sm:text-base font-devanagari flex items-center gap-2">
                <span>{{ photo.icon }}</span>
                <span>{{ mandalData.isEnglish() ? photo.titleEn : photo.titleMr }}</span>
              </h3>
              <div class="flex items-center gap-2">
                <a
                  [href]="photo.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-devanagari font-semibold transition"
                >
                  <span>🔗</span>
                  <span>{{ mandalData.t('मूळ फोटो पहा', 'Open Full Image') }}</span>
                </a>
              </div>
            </div>
            <p class="text-xs text-slate-600 font-devanagari leading-relaxed">
              {{ mandalData.isEnglish() ? photo.descEn : photo.descMr }}
            </p>
          </div>

        </div>
      </div>
    }
  `
})
export class GalleryComponent implements OnInit {
  readonly mandalData = inject(MandalDataService);
  private readonly route = inject(ActivatedRoute);

  readonly selectedCategory = signal<string>('all');
  searchQuery = '';
  readonly activePhoto = signal<GalleryPhoto | null>(null);

  readonly categories = [
    { key: 'all', nameMr: 'सर्व छायाचित्रे', nameEn: 'All Photos', icon: '🌟' },
    { key: 'ganesh-events', nameMr: 'गणेशोत्सव स्पर्धा व उपक्रम', nameEn: 'Ganeshotsav Events & Contests', icon: '🎨' },
    { key: 'ganpati-visarjan', nameMr: 'गणपती विसर्जन मिरवणूक', nameEn: 'Ganpati Visarjan', icon: '🌊' },
    { key: 'swachhata', nameMr: 'स्वच्छता मोहीम', nameEn: 'Swachhata Mohim', icon: '🧹' },
    { key: 'navratri', nameMr: 'नवरात्र उत्सव', nameEn: 'Navratri Utsav', icon: '🔱' },
    { key: 'bathukamma', nameMr: 'बथुकम्मा उत्सव', nameEn: 'Bathukamma Festival', icon: '🌺' },
    { key: 'ambedkar-jayanti', nameMr: 'डॉ. आंबेडकर जयंती', nameEn: 'Dr. Ambedkar Jayanti', icon: '📘' },
    { key: 'shiv-jayanti', nameMr: 'शिवजयंती सोहळा', nameEn: 'Shiv Jayanti', icon: '🚩' }
  ];

  readonly photos: GalleryPhoto[] = [
    // =========================================================================
    // 1. गणेशोत्सव स्पर्धा व उपक्रम (Ganeshotsav Events & Competitions)
    // =========================================================================
    
    // 1A. चित्रकला स्पर्धा (Drawing Competition)
    {
      id: 101,
      titleMr: 'चित्रकला स्पर्धा - बाप्पाचे रेखाटन व रंगभरण स्पर्धा',
      titleEn: 'Drawing Competition - Children Drawing Lord Ganesha Art',
      category: 'ganesh-events',
      categoryMr: 'गणेशोत्सव स्पर्धा',
      categoryEn: 'Ganeshotsav Contests',
      icon: '🎨',
      date: '२२ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
      descMr: '१० वर्षांखालील व ११ ते १५ वर्षे वयोगटातील लहान मुले व तरुणांनी श्री गणपती बाप्पाच्या विविध रूपांचे काढलेले विलोभनीय रेखाटन व कलात्मक रंगकाम.',
      descEn: 'Children and students enthusiastically painting artistic depictions of Lord Ganesha in the annual drawing competition.'
    },
    {
      id: 102,
      titleMr: 'चित्रकला स्पर्धा - चिमुकल्या बालचित्रकारांचे कला सादरीकरण',
      titleEn: 'Junior Painting Contest - Young Artists at Work',
      category: 'ganesh-events',
      categoryMr: 'गणेशोत्सव स्पर्धा',
      categoryEn: 'Ganeshotsav Contests',
      icon: '🎨',
      date: '२२ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Painting_Competition.jpg?width=1000',
      descMr: 'मंडपात शेकडो स्पर्धक बालमित्रांनी उत्स्फूर्त सहभाग घेऊन सुंदर चित्रे साकारली. परीक्षकांकडून सर्वोत्कृष्ट चित्रांची निवड.',
      descEn: 'Young contestants sitting on floor mats immersed in colors and creativity during the mandal art contest.'
    },

    // 1B. वक्तृत्व स्पर्धा (Elocution / Speech Competition)
    {
      id: 103,
      titleMr: 'वक्तृत्व स्पर्धा - बालवक्त्यांचे प्रभावी भाषण व विचार सादरीकरण',
      titleEn: 'Elocution Competition - Young Speaker Addressing Audience',
      category: 'ganesh-events',
      categoryMr: 'गणेशोत्सव स्पर्धा',
      categoryEn: 'Ganeshotsav Contests',
      icon: '🎙️',
      date: '२३ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
      descMr: "'माझी आई', 'माझा आवडता सण' व 'माझी शाळा' या विषयांवर मंचावरून अतिशय प्रभावी व अस्खलित वाणीने विचार मांडणारे बालवक्ते.",
      descEn: 'Passionate student speaker holding the microphone on stage, addressing judges and audience in the elocution contest.'
    },
    {
      id: 104,
      titleMr: 'वक्तृत्व स्पर्धा - व्यासपीठावरून स्पर्धकांचे ओजस्वी सादरीकरण',
      titleEn: 'Speech Contest - Young Talent at the Podium with Microphone',
      category: 'ganesh-events',
      categoryMr: 'गणेशोत्सव स्पर्धा',
      categoryEn: 'Ganeshotsav Contests',
      icon: '🎙️',
      date: '२३ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1000&q=80',
      descMr: 'सभागृहातील श्रोते, पालक व मान्यवर परीक्षकांच्या उपस्थितीत वक्तृत्व स्पर्धेत विचार मांडतानाचा प्रेरणादायी क्षण.',
      descEn: 'Youth orator speaking at the dais in front of an attentive audience during Ganeshotsav cultural week.'
    },

    // 1C. मोफत नेत्र तपासणी शिबिर व चष्मे वाटप (Free Eye Checkup Camp)
    {
      id: 105,
      titleMr: 'मोफत नेत्र तपासणी शिबिर व चष्मे वाटप सोहळा',
      titleEn: 'Free Eye Checkup & Spectacles Distribution Camp',
      category: 'ganesh-events',
      categoryMr: 'आरोग्य शिबिर',
      categoryEn: 'Healthcare Camp',
      icon: '👁️',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
      descMr: 'तज्ज्ञ नेत्ररोग तज्ज्ञांद्वारे ज्येष्ठ नागरिक व परिसरातील बांधवांची अत्याधुनिक उपकरणांच्या साहाय्याने मोफत डोळ्यांची तपासणी व नंबर चष्म्यांचे वाटप.',
      descEn: 'Qualified optometrists and doctors examining eyesight and providing free spectacles to local residents and seniors.'
    },
    {
      id: 106,
      titleMr: 'सामुदायिक आरोग्य व नेत्र सेवा शिबिर क्षणचित्रे',
      titleEn: 'Community Eye Healthcare Camp in Progress',
      category: 'ganesh-events',
      categoryMr: 'आरोग्य शिबिर',
      categoryEn: 'Healthcare Camp',
      icon: '👓',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Radhanath_Swami_on_eyecamp.jpg?width=1000',
      descMr: 'आदर्श नगर व शिव स्फूर्ती परिसरातील शेकडो नागरिकांनी शिबिराचा लाभ घेतला. मोफत औषधोपचार व सल्ला मार्गदर्शन.',
      descEn: 'Volunteers and medical staff serving hundreds of patients at the community health and vision camp.'
    },

    // 1D. श्री सत्यनारायण महापूजा (Satyanarayan Mahapooja)
    {
      id: 107,
      titleMr: 'श्री सत्यनारायण महापूजा व तीर्थप्रसाद सोहळा',
      titleEn: 'Shree Satyanarayan Mahapooja & Prasad Ceremony',
      category: 'ganesh-events',
      categoryMr: 'धार्मिक विधी',
      categoryEn: 'Religious Pooja',
      icon: '🪔',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
      descMr: 'श्री गणरायाच्या साक्षीने वैदिक मंत्रोच्चारात संपन्न झालेली श्री सत्यनारायण महापूजा. सहकुटुंब सहभागी भाविकांना तीर्थप्रसादाचे वाटप.',
      descEn: 'Traditional Vedic Satyanarayan puja performed in front of Lord Ganesha with flowers, sacred kalash, and distribution of prasad.'
    },

    // 1E. विशेष पाहुण्यांचा सत्कार समारंभ (Felicitation of Guests)
    {
      id: 108,
      titleMr: 'विशेष पाहुण्यांचा सत्कार समारंभ व सन्मान',
      titleEn: 'Felicitation of Distinguished Guests & Patrons',
      category: 'ganesh-events',
      categoryMr: 'सत्कार समारंभ',
      categoryEn: 'Felicitation Event',
      icon: '💐',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
      descMr: 'परिसरातील प्रतिष्ठित मान्यवर, ज्येष्ठ कार्यकर्ते, देणगीदार व विशेष अतिथींचा मंडळाच्या वतीने शाल, श्रीफळ व सन्मानचिन्ह देऊन यथोचित सत्कार.',
      descEn: 'Honoring distinguished dignitaries, community leaders, and patrons on stage with shawls, garlands, and mementos.'
    },

    // 1F. सांस्कृतिक स्पर्धा पारितोषिक वितरण (Prize Distribution Ceremony)
    {
      id: 109,
      titleMr: 'सांस्कृतिक स्पर्धा पारितोषिक वितरण - सन्मान चषक व पदके',
      titleEn: 'Cultural Contests Prize Distribution - Trophies & Awards',
      category: 'ganesh-events',
      categoryMr: 'पारितोषिक वितरण',
      categoryEn: 'Prize Distribution',
      icon: '🏆',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80',
      descMr: 'चित्रकला, वक्तृत्व व क्रीडा स्पर्धांमध्ये यश संपादन केलेल्या विजेत्या बालकांना सुवर्ण व रौप्य चषक, सन्मानचिन्हे व प्रमाणपत्रे प्रदान.',
      descEn: 'Glittering golden trophies, cups, and medals lined up to felicitate winners of drawing, elocution, and cultural contests.'
    },
    {
      id: 110,
      titleMr: 'पारितोषिक वितरण रंगमंच सोहळा - बालकांचा गौरव',
      titleEn: 'Award Ceremony - Felicitating Young Winners on Dais',
      category: 'ganesh-events',
      categoryMr: 'पारितोषिक वितरण',
      categoryEn: 'Prize Distribution',
      icon: '🏅',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Prize_Distribution_Ceremony_2016.jpg?width=1000',
      descMr: 'मान्यवरांच्या शुभहस्ते विजेत्या लहान मुलांचा आणि सहभागी विद्यार्थ्यांचा उत्साहवर्धक सन्मान सोहळा.',
      descEn: 'Proud children receiving prizes and certificates from chief guests with applauding parents and friends.'
    },

    // 1G. स्थानिक सांस्कृतिक सुरवर भजन (Survar Bhajan)
    {
      id: 111,
      titleMr: 'स्थानिक सांस्कृतिक सुरवर भजन संध्या',
      titleEn: 'Local Survar Bhajan - Musical Devotional Performance',
      category: 'ganesh-events',
      categoryMr: 'सांस्कृतिक भजन',
      categoryEn: 'Devotional Music',
      icon: '🪕',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
      descMr: 'स्थानिक भजन मंडळाचे संवादिनी (पेटी), तबला व टाळांच्या तालावर तल्लीन करणारे सुश्राव्य व भावस्पर्शी सुरवर भजन सादरीकरण.',
      descEn: 'Traditional Indian devotional artists performing melodious bhajans with harmonium, dholak, and cymbals.'
    },
    {
      id: 112,
      titleMr: 'भजन मंडळींचे सुरेल टाळ-मृदुंगाच्या गजरात भजन',
      titleEn: 'Devotees Performing Melodious Bhajan in Harmony',
      category: 'ganesh-events',
      categoryMr: 'सांस्कृतिक भजन',
      categoryEn: 'Devotional Music',
      icon: '🪕',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Devotees_performing_Bhajan.jpg?width=1000',
      descMr: 'भक्तिरसात मंत्रमुग्ध झालेले भाविक व स्थानिक कलाकारांची सुरेल भजन सेवा. "माझे माहेर पंढरी" व गणेश स्तवन.',
      descEn: 'Devotees singing devotional hymns in deep reverence, captivating the entire pandal audience.'
    },

    // 1H. अखंड भंडारा महाप्रसाद (Bhandara Mahaprasad)
    {
      id: 113,
      titleMr: 'अखंड भंडारा महाप्रसाद - सर्व भाविकांसाठी अन्नदान सेवा',
      titleEn: 'Grand Bhandara Mahaprasad - Holy Community Feast',
      category: 'ganesh-events',
      categoryMr: 'भंडारा महाप्रसाद',
      categoryEn: 'Community Feast',
      icon: '🍲',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80',
      descMr: 'हजारो भाविकांसाठी तयार केलेला गरमागरम स्वादिष्ट भंडारा महाप्रसाद. कार्यकर्त्यांकडून अहोरात्र सेवा व शिस्तबद्ध पंगत.',
      descEn: 'Serving delicious hot sanctified Mahaprasad to thousands of devotees during the grand community annadaan.'
    },
    {
      id: 114,
      titleMr: 'सामुदायिक महाप्रसाद वाटप व सेवा कार्य',
      titleEn: 'Bhandara Food Distribution to Devotees',
      category: 'ganesh-events',
      categoryMr: 'भंडारा महाप्रसाद',
      categoryEn: 'Community Feast',
      icon: '🍲',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Bhandara_Food_Distribution.jpg?width=1000',
      descMr: 'मंडळ कार्यकर्ते व महिला भगिनींनी मनोभावे केलेली महाप्रसाद वाटप सेवा. परिसरातील सर्व जाती-धर्माच्या बांधवांचा सहभाग.',
      descEn: 'Mandal volunteers serving prasad with devotion to families, children, and elders in the festive pandal.'
    },

    // 1I. श्री गणेश प्राणप्रतिष्ठापना व मंडप दर्शन
    {
      id: 115,
      titleMr: 'श्री अष्टविनायक मित्र मंडळ - बाप्पाची मनमोहक मूर्ती व मंडप दर्शन',
      titleEn: 'Shree Ashtavinayak Mandal - Ganpati Bappa Pandal Darshan',
      category: 'ganesh-events',
      categoryMr: 'मंडप दर्शन',
      categoryEn: 'Pandal Darshan',
      icon: '🪔',
      date: '१४ सप्टेंबर २०२६',
      year: '२०२६',
      url: '/reference_dashboard.jpg',
      descMr: 'जोगेश्वरी आदर्श नगर व शिव स्फूर्ती परिसरातील श्री अष्टविनायक मित्र मंडळाचा अधिकृत देखावा व विघ्नहर्त्या गणरायाचे पावन दर्शन.',
      descEn: 'Official festival pandal and majestic idol of Lord Ganesha at Shree Ashtavinayak Mitra Mandal, Jogeshwari.'
    },

    // =========================================================================
    // 2. गणपती विसर्जन मिरवणूक (Ganpati Visarjan Procession)
    // =========================================================================
    {
      id: 201,
      titleMr: 'गिरगाव चौपाटी - गणपती बाप्पा भव्य विसर्जन सोहळा',
      titleEn: 'Girgaon Chowpatty - Grand Ganpati Visarjan Ceremony',
      category: 'ganpati-visarjan',
      categoryMr: 'गणपती विसर्जन मिरवणूक',
      categoryEn: 'Ganpati Visarjan',
      icon: '🌊',
      date: '२५ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganpati_Visarjan.jpg?width=1000',
      descMr: 'मुंबईच्या समुद्रकिनारी लाखो भाविकांच्या उपस्थितीत गणरायाचा भावपूर्ण व भव्य विसर्जन सोहळा. "गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या!"',
      descEn: 'Devotees gather in thousands at Mumbai beach on Anant Chaturdashi for the holy immersion of Lord Ganesha.'
    },
    {
      id: 202,
      titleMr: 'ढोल-ताशांच्या गजरात बाप्पाची भव्य विसर्जन मिरवणूक',
      titleEn: 'Grand Visarjan Immersion Procession with Dhol-Tasha',
      category: 'ganpati-visarjan',
      categoryMr: 'गणपती विसर्जन मिरवणूक',
      categoryEn: 'Ganpati Visarjan',
      icon: '🌊',
      date: '२५ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganesh_Visarjan_Festival_India.jpg?width=1000',
      descMr: 'पारंपरिक ढोल-ताशांच्या गजरात, गुलालाच्या उधळणीत व बाप्पाच्या जयघोषात निघालेली विसर्जन मिरवणूक.',
      descEn: 'Energetic traditional Dhol-Tasha troop beats, red gulal powder, and chanting during the grand immersion procession.'
    },
    {
      id: 203,
      titleMr: 'जलाभिषेक व भावपूर्ण गणेश विसर्जन',
      titleEn: 'Sacred Water Immersion of Lord Ganesha',
      category: 'ganpati-visarjan',
      categoryMr: 'गणपती विसर्जन मिरवणूक',
      categoryEn: 'Ganpati Visarjan',
      icon: '🌊',
      date: '२५ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganesh_immersion_hyd.JPG?width=1000',
      descMr: 'वैदिक मंत्रोच्चारात गणरायाचे जलकुंभात विसर्जन करताना बाप्पाच्या चरणी नतमस्तक होणारे कार्यकर्ते व भाविक.',
      descEn: 'Solemn immersion of Ganesha idols in the holy waters with prayers and flowers.'
    },

    // =========================================================================
    // 3. स्वच्छता मोहीम (Swachhata Mohim - Cleanliness Drives)
    // =========================================================================
    {
      id: 301,
      titleMr: 'स्वच्छ भारत अभियान - झाडू श्रमदान मोहीम',
      titleEn: 'Swachh Bharat Abhiyan - Community Broom Cleaning Shramdaan',
      category: 'swachhata',
      categoryMr: 'स्वच्छता मोहीम',
      categoryEn: 'Swachhata Mohim',
      icon: '🧹',
      date: '०२ ऑक्टोबर २०२५',
      year: '२०२५',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/PM_Modi_launches_the_Swachh_Bharat_Abhiyaan_(1).jpg?width=1000',
      descMr: 'हातात झाडू घेऊन रस्ते व परिसराची स्वच्छता करण्याचा ऐतिहासिक श्रमदान संकल्प. स्वच्छ व हरित परिसर निर्मिती.',
      descEn: 'Community volunteers and citizens picking up brooms to clean streets, inspiring neighborhood cleanliness drives.'
    },
    {
      id: 302,
      titleMr: 'सामुदायिक परिसर स्वच्छता व श्रमदान मोहीम',
      titleEn: 'Community Neighborhood Sanitation & Cleanliness Campaign',
      category: 'swachhata',
      categoryMr: 'स्वच्छता मोहीम',
      categoryEn: 'Swachhata Mohim',
      icon: '🧹',
      date: 'वर्षभर अखंड',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Swachh_Bharat_campaign_by_the_WNC_at_the_The_Asiatic_Society_Library_on_World_Environment_Day_2015.JPG?width=1000',
      descMr: 'आदर्श नगर व शिव स्फूर्ती परिसरात मंडळ कार्यकर्ते, युवक व रहिवाशांनी एकत्र येऊन केलेले स्वच्छता व गटारे निर्जंतुकीकरण श्रमदान.',
      descEn: 'Volunteers and local residents actively clearing litter, sanitizing drains, and maintaining hygiene across the locality.'
    },
    {
      id: 303,
      titleMr: 'स्वच्छता शपथ, प्लास्टिक मुक्ती व पर्यावरण संवर्धन जनजागृती',
      titleEn: 'Cleanliness Pledge & Anti-Plastic Environmental Campaign',
      category: 'swachhata',
      categoryMr: 'स्वच्छता मोहीम',
      categoryEn: 'Swachhata Mohim',
      icon: '🧹',
      date: '१५ ऑगस्ट २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Clean_India_Pledge_-_NCSM_-_Kolkata_2018-04-16_0122.JPG?width=1000',
      descMr: 'परिसर स्वच्छ ठेवण्याची सामूहिक शपथ, कापडी पिशव्यांचे मोफत वाटप आणि एकल वापराच्या प्लास्टिकवर बंदीची जनजागृती.',
      descEn: 'Citizens and youth taking public cleanliness pledge and promoting zero-plastic, eco-friendly lifestyle.'
    },

    // =========================================================================
    // 4. नवरात्र उत्सव (Navratri Utsav)
    // =========================================================================
    {
      id: 401,
      titleMr: 'पारंपरिक रास-गरबा व दांडिया रास महोत्सव',
      titleEn: 'Traditional Navratri Garba & Dandiya Raas Festival',
      category: 'navratri',
      categoryMr: 'नवरात्र उत्सव',
      categoryEn: 'Navratri Utsav',
      icon: '🔱',
      date: '२२ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Navratri_Garba.jpg?width=1000',
      descMr: 'पारंपरिक रंगीबेरंगी चनिया-चोली व कुडत्यांमध्ये दांडियांच्या तालावर गरबा खेळणारे महिला, तरुण व लहान मुले.',
      descEn: 'Vibrant traditional Garba and Dandiya dancers in ethnic attire swirling to rhythmic folk beats during Navratri.'
    },
    {
      id: 402,
      titleMr: 'आई दुर्गेची नित्य षोडशोपचार पूजा व महाआरती',
      titleEn: 'Maa Durga Daily Shodashopachare Navratri Puja',
      category: 'navratri',
      categoryMr: 'नवरात्र उत्सव',
      categoryEn: 'Navratri Utsav',
      icon: '🔱',
      date: '२१ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Navratri_Puja.jpg?width=1000',
      descMr: 'नवरात्रोत्सवात घटस्थापनेनंतर आदिशक्ती जगदंबेची कलश स्थापना, दुर्वा-पुष्पांची आरास व वैदिक महापूजा.',
      descEn: 'Sacred Kalash sthapna, flower decoration, and traditional ritual worship of Goddess Durga during the holy nine nights.'
    },
    {
      id: 403,
      titleMr: 'महिषासुरमर्दिनी आई जगदंबेचा दैदिप्यमान अवतार',
      titleEn: 'Maa Durga Sacred Idol & Navratri Darshan',
      category: 'navratri',
      categoryMr: 'नवरात्र उत्सव',
      categoryEn: 'Navratri Utsav',
      icon: '🔱',
      date: '२४ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Navratri_-_the_festival_of_Maa_Durga.jpg?width=1000',
      descMr: 'दुष्टप्रवृत्तींचा नाश करणाऱ्या आदिशक्ती जगदंबेची मंगल मूर्ती व दर्शनासाठी भाविकांची गर्दी.',
      descEn: 'Divine manifestation of Goddess Durga victorious over negative forces, worshipped by devotees across the locality.'
    },
    {
      id: 404,
      titleMr: 'नवरात्र मंडप दीप आराधना व महिला भोंडला',
      titleEn: 'Navratri Deepotsav, Illumination & Devotee Prayers',
      category: 'navratri',
      categoryMr: 'नवरात्र उत्सव',
      categoryEn: 'Navratri Utsav',
      icon: '🔱',
      date: '२६ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Navratri_Decoration_and_Devotee.jpg?width=1000',
      descMr: 'नवरात्र मंडपातील अखंड दीप प्रज्वलन, महिलांचा पारंपरिक भोंडला व आरती सोहळा.',
      descEn: 'Auspicious lamp lighting, evening aarti, and women celebrating traditional folk Bhondla songs.'
    },

    // =========================================================================
    // 5. बथुकम्मा उत्सव (Bathukamma Floral Festival)
    // =========================================================================
    {
      id: 501,
      titleMr: 'औषधी व रानफुलांची पारंपरिक बथुकम्मा रचना',
      titleEn: 'Traditional Concentric Flower Tower - Bathukamma',
      category: 'bathukamma',
      categoryMr: 'बथुकम्मा उत्सव',
      categoryEn: 'Bathukamma Festival',
      icon: '🌺',
      date: '२३ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bathukamma_traditional_festival.jpg?width=1000',
      descMr: 'झेंडू, कमळ, गुनुगु, तांगेडू व सुगंधी फुलांची मनोरेवजा कलात्मक रचना करून निसर्गाची चैतन्यमयी पूजा.',
      descEn: 'Artistic concentric arrangement of medicinal wild flowers, marigolds, and lotus into pyramidal floral towers worshipping nature.'
    },
    {
      id: 502,
      titleMr: 'महिलांचा पारंपरिक फेर व बथुकम्मा लोकगीत गायन',
      titleEn: 'Women Circle Dance & Folk Songs around Bathukamma',
      category: 'bathukamma',
      categoryMr: 'बथुकम्मा उत्सव',
      categoryEn: 'Bathukamma Festival',
      icon: '🌺',
      date: '२५ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bathukamma_Festival_Telangana_Folk_Culture.jpg?width=1000',
      descMr: 'रंगीबेरंगी रेशमी साड्या परिधान करून बथुकम्माभोवती टाळ्यांच्या लयीत फेर धरणाऱ्या महिला भगिनींचे पारंपरिक लोकगीत गायन.',
      descEn: 'Women dressed in rich traditional sarees clapping rhythmically and singing ancient folk songs in circles around flower pyramids.'
    },
    {
      id: 503,
      titleMr: 'बथुकम्मा - निसर्ग, संस्कृती व फुलांचा अद्वितीय महोत्सव',
      titleEn: 'Bathukamma - Unique Festival of Flowers & Sisterhood',
      category: 'bathukamma',
      categoryMr: 'बथुकम्मा उत्सव',
      categoryEn: 'Bathukamma Festival',
      icon: '🌺',
      date: '२७ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bathukamma_-_Festival_of_Flowers.jpg?width=1000',
      descMr: 'नवरात्रोत्सवादरम्यान स्त्रीशक्ती व पर्यावरण संवर्धनाचा गौरव करणारा शेकडो महिलांचा सामूहिक बथुकम्मा उत्सव.',
      descEn: 'Celebration of feminine divinity, natural ecology, and sisterhood during Navratri with flower arrangements.'
    },
    {
      id: 504,
      titleMr: 'सद्दुल बथुकम्मा - भावपूर्ण जलविसर्जन व मलिदा नैवेद्य वाटप',
      titleEn: 'Saddula Bathukamma Final Water Immersion Ritual',
      category: 'bathukamma',
      categoryMr: 'बथुकम्मा उत्सव',
      categoryEn: 'Bathukamma Festival',
      icon: '🌺',
      date: '२९ सप्टेंबर २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bathukamma_Immersion_in_Hyderabad%2C_India.jpg?width=1000',
      descMr: 'उत्सवाच्या सांगतेवेळी तलावामध्ये फुलांच्या बथुकम्माचे विसर्जन व उपस्थित भाविकांना गूळ-पोळ्यांचा मलिदा महाप्रसाद वाटप.',
      descEn: 'Immersion of floral towers in water bodies with songs of gratitude and sharing traditional Malida sweet prasad.'
    },

    // =========================================================================
    // 6. डॉ. बाबासाहेब आंबेडकर जयंती (Dr. Ambedkar Jayanti)
    // =========================================================================
    {
      id: 601,
      titleMr: 'भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती सोहळा व रॅली',
      titleEn: 'Dr. B. R. Ambedkar Jayanti Procession & Tribute',
      category: 'ambedkar-jayanti',
      categoryMr: 'डॉ. आंबेडकर जयंती',
      categoryEn: 'Dr. Ambedkar Jayanti',
      icon: '📘',
      date: '१४ एप्रिल २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ambedkar_Jayanti_BY_Vijayendra.jpg?width=1000',
      descMr: 'महामानव डॉ. बाबासाहेब आंबेडकर यांच्या जयंतीदिनी निळे ध्वज, पुष्पहार अर्पण व चैतन्यमयी अभिवादन रॅली.',
      descEn: 'Grand celebrations on Dr. B. R. Ambedkar Jayanti with blue flags, floral garlands, and community rallies honoring his legacy.'
    },
    {
      id: 602,
      titleMr: 'डॉ. बाबासाहेब आंबेडकर जयंतीनिमित्त प्रतिमा पूजन व बुद्धवंदना',
      titleEn: 'Floral Tributes & Buddha Vandana on Ambedkar Jayanti',
      category: 'ambedkar-jayanti',
      categoryMr: 'डॉ. आंबेडकर जयंती',
      categoryEn: 'Dr. Ambedkar Jayanti',
      icon: '📘',
      date: '१४ एप्रिल २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pic_of_Babasaheb_on_his_Ambedkar_Jayanti.jpg?width=1000',
      descMr: 'संविधान निर्माते डॉ. बाबासाहेब आंबेडकर यांच्या प्रतिमेस पुष्पहार, सामूहिक बुद्धवंदना व संविधान उद्देशिकेचे वाचन.',
      descEn: 'Community gathering offering flowers, lighting candles, reciting Buddha Vandana and reading the Constitution preamble.'
    },
    {
      id: 603,
      titleMr: 'भारतीय संविधानाचे शिल्पकार डॉ. बाबासाहेब आंबेडकर स्मारक प्रतिमा',
      titleEn: 'Statue of Dr. B. R. Ambedkar holding Indian Constitution',
      category: 'ambedkar-jayanti',
      categoryMr: 'डॉ. आंबेडकर जयंती',
      categoryEn: 'Dr. Ambedkar Jayanti',
      icon: '📘',
      date: '१४ एप्रिल २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dr_BR_Ambedkar_Statue.jpg?width=1000',
      descMr: "'शिका, संघटित व्हा व संघर्ष करा' या विचारधारेचे प्रतीक - हातात भारतीय संविधान घेतलेली भारतरत्न डॉ. बाबासाहेब आंबेडकर यांची प्रेरणादायी प्रतिमा.",
      descEn: 'Majestic statue of Bharat Ratna Dr. B. R. Ambedkar holding the Constitution of India, symbolizing equality and education.'
    },

    // =========================================================================
    // 7. छत्रपती शिवाजी महाराज जयंती (Shiv Jayanti)
    // =========================================================================
    {
      id: 701,
      titleMr: 'प्रतापगडावरील छत्रपती शिवाजी महाराज भव्य अश्वारूढ पुतळा',
      titleEn: 'Chhatrapati Shivaji Maharaj Equestrian Statue at Pratapgad',
      category: 'shiv-jayanti',
      categoryMr: 'शिवजयंती सोहळा',
      categoryEn: 'Shiv Jayanti',
      icon: '🚩',
      date: '१९ फेब्रुवारी २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Statue_of_Chatrapati_Shivaji_Maharaj_at_Pratapgad.jpg?width=1000',
      descMr: 'अखंड महाराष्ट्राचे आराध्य दैवत छत्रपती शिवाजी महाराज यांच्या जन्मदिनानिमित्त ऐतिहासिक प्रतापगडावरील अश्वारूढ पुतळ्यास अभिवादन.',
      descEn: 'Heroic equestrian monument of Chhatrapati Shivaji Maharaj at Pratapgad fort, revered by millions across Maharashtra.'
    },
    {
      id: 702,
      titleMr: 'गेटवे ऑफ इंडिया - छत्रपती शिवाजी महाराज ऐतिहासिक स्मारक',
      titleEn: 'Gateway of India - Chhatrapati Shivaji Maharaj Memorial',
      category: 'shiv-jayanti',
      categoryMr: 'शिवजयंती सोहळा',
      categoryEn: 'Shiv Jayanti',
      icon: '🚩',
      date: '१९ फेब्रुवारी २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chhatrapati_Shivaji_Statue.jpg?width=1000',
      descMr: 'मुंबईतील ऐतिहासिक छत्रपती शिवाजी महाराज स्मारक - शिवजयंतीदिनी भगवे ध्वज व शिवभक्तांचे मानवंदना सोहळे.',
      descEn: 'Iconic bronze monument of Shivaji Maharaj in Mumbai decorated with saffron flags during Shiv Jayanti celebrations.'
    },
    {
      id: 703,
      titleMr: 'मुंबईतील शिवजयंती सोहळा - शिवज्योत व पालखी मिरवणूक',
      titleEn: 'Shiv Jayanti Celebrations in Mumbai - Shiv Jyoti & Palanquin',
      category: 'shiv-jayanti',
      categoryMr: 'शिवजयंती सोहळा',
      categoryEn: 'Shiv Jayanti',
      icon: '🚩',
      date: '१९ फेब्रुवारी २०२६',
      year: '२०२६',
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shivaji_Maharaj_statue_in_Deonar%2C_Mumbai.jpg?width=1000',
      descMr: "'जय भवानी, जय शिवाजी' च्या जयघोषात शिवनेरी किल्ल्यावरून आणलेली पवित्र शिवज्योत, मशालींची रॅली व भव्य पालखी सोहळा.",
      descEn: 'Traditional torch relay carrying Shiv Jyoti, palanquin procession, and saffron-clad youth celebrating Shiv Jayanti.'
    }
  ];

  readonly filteredPhotos = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery.trim().toLowerCase();

    return this.photos.filter(p => {
      const matchCat = cat === 'all' || p.category === cat;
      if (!matchCat) return false;

      if (!query) return true;
      return (
        p.titleMr.toLowerCase().includes(query) ||
        p.titleEn.toLowerCase().includes(query) ||
        p.descMr.toLowerCase().includes(query) ||
        p.descEn.toLowerCase().includes(query) ||
        p.categoryMr.toLowerCase().includes(query) ||
        p.date.toLowerCase().includes(query)
      );
    });
  });

  readonly currentPhotoIndex = computed(() => {
    const active = this.activePhoto();
    if (!active) return -1;
    return this.filteredPhotos().findIndex(p => p.id === active.id);
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const cat = params['cat'];
      if (cat && this.categories.some(c => c.key === cat)) {
        this.selectedCategory.set(cat);
      }
    });
  }

  getCategoryCount(key: string): number {
    if (key === 'all') return this.photos.length;
    return this.photos.filter(p => p.category === key).length;
  }

  openLightbox(photo: GalleryPhoto): void {
    this.activePhoto.set(photo);
  }

  closeLightbox(): void {
    this.activePhoto.set(null);
  }

  prevPhoto(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const list = this.filteredPhotos();
    const idx = this.currentPhotoIndex();
    if (idx > 0) {
      this.activePhoto.set(list[idx - 1]);
    } else {
      this.activePhoto.set(list[list.length - 1]);
    }
  }

  nextPhoto(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const list = this.filteredPhotos();
    const idx = this.currentPhotoIndex();
    if (idx < list.length - 1) {
      this.activePhoto.set(list[idx + 1]);
    } else {
      this.activePhoto.set(list[0]);
    }
  }

  onImgError(event: Event): void {
    const imgEl = event.target as HTMLElement;
    imgEl.style.display = 'none';
    const fallback = imgEl.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.activePhoto()) return;
    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      this.prevPhoto();
    } else if (event.key === 'ArrowRight') {
      this.nextPhoto();
    }
  }
}
