import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandalDataService } from '../../services/mandal-data.service';
import { FestivalEvent } from '../../models/mandal.models';

@Component({
  selector: 'app-utsav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 pb-8 animate-fade-in">
      
      <!-- Banner -->
      <div class="bg-gradient-to-r from-amber-700 via-orange-800 to-red-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute right-0 top-0 bottom-0 opacity-15 flex items-center pr-6 text-9xl pointer-events-none select-none">
          🪔
        </div>
        <div class="relative z-10">
          <div class="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span>●</span>
            <span>{{ mandalData.t('धार्मिक व सामाजिक उपक्रम', 'Religious & Cultural Events') }}</span>
          </div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
            {{ mandalData.t('मंडळाचे वार्षिक उत्सव व कार्यक्रम दिनदर्शिका', 'Annual Festivals & Event Calendar') }}
          </h1>
          <p class="text-amber-100 text-xs md:text-sm mt-1">
            {{ mandalData.t('आरती वेळा, महाप्रसाद, सांस्कृतिक कार्यक्रम आणि विसर्जन मिरवणूक तपशील', 'Aarti timings, Maha Prasad, cultural competitions, and immersion procession details') }}
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

            <!-- Daily Schedule Timeline -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
              <h3 class="font-bold text-base text-slate-800 font-devanagari flex items-center gap-2">
                <span>⏰</span>
                <span>{{ mandalData.t('दैनंदिन कार्यक्रम व आरती वेळापत्रक', 'Daily Schedule & Aarti Timings') }}</span>
              </h3>

              <div class="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-amber-200 pl-2">
                @for (item of fest.schedule; track item.time) {
                  <div class="relative flex items-start gap-4">
                    <div class="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-amber-100 z-10">
                      ●
                    </div>
                    <div class="bg-slate-50 hover:bg-amber-50/50 p-3 rounded-xl border border-slate-200 flex-1 transition">
                      <div class="flex flex-wrap items-center justify-between gap-1">
                        <h4 class="font-bold text-slate-900 text-sm font-devanagari">{{ item.titleMr }}</h4>
                        <span class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-sans">
                          {{ mandalData.formatNum(item.time) }}
                        </span>
                      </div>
                      <p class="text-xs text-slate-600 font-devanagari mt-1">
                        {{ item.descMr }}
                      </p>
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
              <h3 class="font-bold text-base text-slate-800 font-devanagari flex items-center gap-2">
                <span>📸</span>
                <span>{{ mandalData.t('उत्सव छायाचित्रे (Photo Gallery)', 'Festival Photo Gallery') }}</span>
              </h3>

              <div class="grid grid-cols-2 gap-2">
                @for (img of galleryPhotos; track img.title) {
                  <div class="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video cursor-pointer" (click)="selectedPhoto.set(img)">
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-600 to-red-700 text-white font-bold text-xs p-2 text-center font-devanagari group-hover:scale-105 transition">
                      {{ img.title }}
                    </div>
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                      {{ mandalData.t('मोठे पहा 🔍', 'View Full 🔍') }}
                    </div>
                  </div>
                }
              </div>
              <p class="text-[10px] text-slate-400 text-center font-devanagari">
                {{ mandalData.t('स्थानिक छायाचित्रकारांनी टिपलेले सुंदर क्षण', 'Memorable moments captured by local photographers') }}
              </p>
            </div>

          </div>

        </div>
      }

      <!-- Lightbox Modal -->
      @if (selectedPhoto(); as photo) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" (click)="selectedPhoto.set(null)">
          <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden" (click)="$event.stopPropagation()">
            <div class="p-6 text-center space-y-4">
              <div class="w-full h-64 bg-gradient-to-br from-amber-600 via-orange-600 to-red-800 rounded-xl flex items-center justify-center text-white text-2xl font-bold font-devanagari p-6 shadow-inner">
                {{ photo.title }}
              </div>
              <div>
                <h4 class="font-bold text-slate-900 font-devanagari">{{ photo.title }}</h4>
                <p class="text-xs text-slate-500 font-devanagari mt-1">{{ photo.desc }}</p>
              </div>
              <button (click)="selectedPhoto.set(null)" class="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">
                {{ mandalData.t('बंद करा', 'Close') }}
              </button>
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
  readonly selectedPhoto = signal<{ title: string; desc: string } | null>(null);

  readonly currentFestival = () => {
    return this.mandalData.festivalEvents.find(f => f.id === this.selectedFestivalId()) || this.mandalData.festivalEvents[0];
  };

  readonly galleryPhotos = [
    { title: 'भव्य महाआरती सोहळा', desc: 'स्थानिक हजारो भाविकांच्या उपस्थितीत गणरायाची सायंकालीन मंगल आरती.' },
    { title: 'सत्यनारायण महाप्रसाद', desc: '२००० हून अधिक रहिवासी व भाविकांसाठी महाप्रसादाचे सुव्यवस्थापन.' },
    { title: 'बाल चित्रकला स्पर्धा', desc: 'परिसरातील १०० हून अधिक चिमुकल्या कलाकारांचा उत्स्फूर्त सहभाग.' },
    { title: 'भव्य विसर्जन मिरवणूक', desc: 'पारंपरिक ढोल-ताशांच्या गजरात व लेझीम पथकासह विसर्जन सोहळा.' }
  ];
}
