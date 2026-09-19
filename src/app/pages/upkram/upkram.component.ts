import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

interface MandalActivity {
  id: number;
  titleMr: string;
  titleEn: string;
  categoryMr: string;
  categoryEn: string;
  timingMr: string;
  timingEn: string;
  shortDescMr: string;
  shortDescEn: string;
  fullDescMr: string;
  fullDescEn: string;
  icon: string;
  bgGradient: string;
  accentColor: string;
  highlightsMr: string[];
  highlightsEn: string[];
}

@Component({
  selector: 'app-upkram',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 pb-12 animate-fade-in">
      
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
              <span>{{ mandalData.t('सामाजिक बांधिलकी व समाजोपयोगी कार्य (स्थापना १९९७)', 'Social Responsibility & Community Welfare (Est. 1997)') }}</span>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
              {{ mandalData.t('मंडळाचे उपक्रम', 'Mandal Activities & Initiatives') }}
            </h1>
            <div class="text-amber-200 text-xs md:text-sm font-semibold mt-0.5">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ • जोगेश्वरी (पश्चिम), मुंबई-४००१०२', 'Shree Ashtavinayak Mitra Mandal • Jogeshwari (W), Mumbai-400102') }}
            </div>
            <p class="text-amber-100 text-xs mt-1 font-bold">
              {{ mandalData.t('॥ उत्सवासोबतच समाजसेवेचा वसा आम्ही अविरत जपतो ॥', '॥ Carrying Forward the Legacy of Selfless Community Service ॥') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Header Overview Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-amber-700 text-xs font-bold font-devanagari uppercase tracking-wider">
            <span>🤝</span>
            <span>{{ mandalData.t('लोककल्याण व सामाजिक एकात्मता', 'Public Welfare & Social Harmony') }}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 font-devanagari mt-1">
            {{ mandalData.t('मंडळाचे प्रमुख सामाजिक, सांस्कृतिक व आरोग्य उपक्रम', 'Key Social, Cultural & Healthcare Initiatives') }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-devanagari mt-0.5 max-w-3xl">
            {{ mandalData.t('मंडळ केवळ उत्सवापुरते मर्यादित नसून आरोग्य, शिक्षण, पर्यावरण, महिला सक्षमीकरण आणि गरजूंना साहाय्य यासाठी वर्षभर सक्रिय असते.', 'Our Mandal remains active year-round in health, education, environment, womens empowerment, and emergency relief.') }}
          </p>
        </div>

        <div class="px-4 py-2.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-300 text-amber-900 text-xs sm:text-sm font-black font-devanagari shadow-2xs self-start sm:self-auto shrink-0 flex items-center gap-2">
          <span>🚩</span>
          <span>{{ mandalData.t('एकूण उपक्रम:', 'Total Initiatives:') }} {{ mandalData.toMarathiDigits(activities.length) }}</span>
        </div>
      </div>

      <!-- Activity Cards Grid: 3 columns on desktop, 1 on mobile, equal height -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (act of activities; track act.id) {
          <div 
            class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            
            <!-- Card Top Graphic / Banner Area -->
            <div 
              class="h-44 p-5 flex flex-col justify-between relative overflow-hidden text-white"
              [style.background]="act.bgGradient"
            >
              <!-- Background Icon Motif -->
              <div class="absolute -right-6 -bottom-6 opacity-15 pointer-events-none text-8xl select-none group-hover:scale-110 transition-transform duration-500">
                {{ act.icon }}
              </div>

              <!-- Badge Row -->
              <div class="flex items-center justify-between relative z-10">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black backdrop-blur-md bg-white/20 border border-white/30 tracking-wide font-devanagari shadow-2xs">
                  {{ mandalData.isEnglish() ? act.categoryEn : act.categoryMr }}
                </span>
                <span class="text-2xl drop-shadow-md">
                  {{ act.icon }}
                </span>
              </div>

              <!-- Banner Title -->
              <div class="relative z-10">
                <div class="text-[11px] text-amber-200 font-mono font-semibold">
                  {{ mandalData.isEnglish() ? act.timingEn : act.timingMr }}
                </div>
                <h3 class="text-base sm:text-lg font-black font-devanagari text-white leading-tight drop-shadow-sm mt-0.5">
                  {{ mandalData.isEnglish() ? act.titleEn : act.titleMr }}
                </h3>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              
              <div>
                <!-- Short Description (2-4 lines) -->
                <p class="text-xs sm:text-sm text-slate-700 font-devanagari leading-relaxed line-clamp-3">
                  {{ mandalData.isEnglish() ? act.shortDescEn : act.shortDescMr }}
                </p>

                <!-- Key Highlights bullet preview -->
                <div class="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  @for (hl of (mandalData.isEnglish() ? act.highlightsEn : act.highlightsMr).slice(0, 2); track hl) {
                    <div class="flex items-center gap-2 text-[11px] text-slate-600 font-devanagari">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span class="truncate">{{ hl }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Card Footer: "अधिक माहिती" / View Button -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10.5px] font-mono text-slate-400">
                  उपक्रम क्र. {{ mandalData.toMarathiDigits(act.id) }}
                </span>
                
                <button
                  (click)="openActivityModal(act)"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 hover:border-amber-400 font-bold text-xs font-devanagari transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-500"
                >
                  <span>{{ mandalData.t('अधिक माहिती', 'Learn More') }}</span>
                  <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

            </div>

          </div>
        }
      </div>

    </div>

    <!-- ================= ACTIVITY DETAILS POPUP MODAL ================= -->
    @if (selectedActivity(); as act) {
      <div 
        class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
        (click)="closeActivityModal()"
      >
        <div 
          class="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-amber-300 overflow-hidden font-devanagari my-auto mx-auto"
          (click)="$event.stopPropagation()"
        >
          
          <!-- Modal Top Banner -->
          <div class="p-5 sm:p-6 text-white relative overflow-hidden" [style.background]="act.bgGradient">
            <button 
              (click)="closeActivityModal()"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center text-sm font-bold cursor-pointer transition"
              title="बंद करा"
            >
              ✕
            </button>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-3xl">{{ act.icon }}</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black backdrop-blur-md bg-white/25 border border-white/30">
                {{ mandalData.isEnglish() ? act.categoryEn : act.categoryMr }}
              </span>
            </div>

            <h3 class="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow">
              {{ mandalData.isEnglish() ? act.titleEn : act.titleMr }}
            </h3>

            <div class="mt-2 text-xs font-semibold text-amber-200">
              📅 {{ mandalData.isEnglish() ? act.timingEn : act.timingMr }}
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-slate-800">
            
            <div>
              <h4 class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                {{ mandalData.t('उपक्रमाचा सविस्तर तपशील', 'Initiative Details') }}
              </h4>
              <p class="text-xs sm:text-sm leading-relaxed text-justify text-slate-700">
                {{ mandalData.isEnglish() ? act.fullDescEn : act.fullDescMr }}
              </p>
            </div>

            <!-- Key Features / Highlights -->
            <div class="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 space-y-2">
              <h4 class="text-xs font-bold text-[#78350f]">
                🌟 {{ mandalData.t('प्रमुख वैशिष्ट्ये व उद्दिष्टे', 'Key Highlights & Objectives') }}
              </h4>
              <ul class="space-y-1.5 text-xs">
                @for (hl of (mandalData.isEnglish() ? act.highlightsEn : act.highlightsMr); track hl) {
                  <li class="flex items-start gap-2">
                    <span class="text-amber-600 font-bold mt-0.5">✓</span>
                    <span>{{ hl }}</span>
                  </li>
                }
              </ul>
            </div>

            <!-- Community Impact Note -->
            <div class="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              {{ mandalData.t('मंडळ हे केवळ उत्सवापुरते मर्यादित नसून संपूर्ण वर्षभर सामाजिक एकात्मता आणि समाजहितासाठी अविरत कार्यरत आहे.', 'Our Mandal remains active throughout the year, committed to community solidarity, welfare, and social harmony.') }}
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              (click)="closeActivityModal()"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              {{ mandalData.t('समजले / बंद करा', 'Understood / Close') }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class UpkramComponent {
  readonly mandalData = inject(MandalDataService);
  readonly selectedActivity = signal<MandalActivity | null>(null);

  openActivityModal(act: MandalActivity) {
    this.selectedActivity.set(act);
  }

  closeActivityModal() {
    this.selectedActivity.set(null);
  }

  readonly activities: MandalActivity[] = [
    {
      id: 1,
      titleMr: 'रक्तदान शिबिर',
      titleEn: 'Blood Donation Camp',
      categoryMr: 'आरोग्य व सामाजिक सेवा',
      categoryEn: 'Health & Social Service',
      timingMr: 'दरवर्षी सार्वजनिक गणेशोत्सवात',
      timingEn: 'Annual Ganeshotsav Festival',
      shortDescMr: 'दरवर्षी गणेशोत्सवाचे औचित्य साधून नामांकित रक्तपेढ्यांच्या सहकार्याने भव्य रक्तदान शिबिर आयोजित केले जाते. शेकडो दात्यांच्या सहभागातून रुग्णांसाठी अमूल्य रक्त संकलन होते.',
      shortDescEn: 'Organized annually during Ganeshotsav in association with prominent Mumbai blood banks. Devotees and youth donate blood saving hundreds of lives.',
      fullDescMr: 'श्री अष्टविनायक मित्र मंडळाच्या वतीने दरवर्षी गणेशोत्सवादरम्यान भव्य रक्तदान शिबिराचे आयोजन केले जाते. "रक्तदान हेच सर्वश्रेष्ठ दान" या ब्रीदवाक्याला अनुसरून परिसरातील तरुण सहकारी, सभासद आणि भाविक उत्स्फूर्तपणे रक्तदान करतात. संकलित रक्त हे गरजू रुग्णांसाठी, विशेषतः थॅलेसेमियाग्रस्त बालके आणि तातडीच्या शस्त्रक्रियांसाठी मोफत उपलब्ध करून दिले जाते. शिबिरात सहभागी दात्यांना सन्मानपत्र व पौष्टिक आहार दिला जातो.',
      fullDescEn: 'Shree Ashtavinayak Mitra Mandal organizes an annual Mega Blood Donation Camp during Ganeshotsav in collaboration with reputed hospitals and blood banks. True to the spirit of community service, scores of local youth and devotees donate blood. The collected blood units assist needy emergency patients and children with thalassemia. Every donor receives an official recognition certificate and refreshments.',
      icon: '🩸',
      bgGradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #b91c1c 100%)',
      accentColor: '#dc2626',
      highlightsMr: [
        'दरवर्षी १००+ रक्त बाटल्यांचे संकलन',
        'केईएम व नायर हॉस्पिटल रक्तपेढ्यांचे सहकार्य',
        'दात्यांना अधिकृत प्रमाणपत्र व सन्मान',
        'आपत्कालीन रुग्णांना रक्ताची तातडीची व्यवस्था'
      ],
      highlightsEn: [
        '100+ blood units collected every festival season',
        'Conducted with BMC & civil hospital blood banks',
        'Official certificate of appreciation for each donor',
        'Emergency blood donor network for community members'
      ]
    },
    {
      id: 2,
      titleMr: 'आरोग्य सेवा व मोफत तपासणी शिबिर',
      titleEn: 'Health Care & Medical Checkup Camp',
      categoryMr: 'वैद्यकीय सहकार्य',
      categoryEn: 'Medical Care',
      timingMr: 'दरवर्षी नवरात्रोत्सव व वर्षभर',
      timingEn: 'Navratri Utsav & Periodic',
      shortDescMr: 'परिसरातील ज्येष्ठ नागरिक, महिला व बालकांसाठी मोफत नेत्र तपासणी, मधुमेह, रक्तदाब आणि ईसीजी तपासणी तज्ज्ञ डॉक्टरांच्या उपस्थितीत केली जाते. मोफत औषधे व चष्मे वाटप.',
      shortDescEn: 'Free medical checkups for senior citizens, mothers and children including eye checkups, diabetes, blood pressure, ECG, and free spectacles distribution.',
      fullDescMr: 'मंडळाच्या वतीने शिव स्फूर्ती आणि आदर्श नगर परिसरातील सर्व नागरिकांसाठी मोफत आरोग्य तपासणी शिबिर आयोजित केले जाते. नामांकित तज्ज्ञ डॉक्टरांच्या पथकाद्वारे सामान्य तपासणी, मधुमेह चाचणी (Blood Sugar), रक्तदाब (BP), डोळ्यांची तपासणी व मोतीबिंदू निदान केले जाते. गरजू रुग्णांना मोफत औषधे आणि ज्येष्ठ नागरिकांना मोफत वाचन चष्म्यांचे वाटप केले जाते.',
      fullDescEn: 'Comprehensive medical camps are organized for community residents. Specialist doctors conduct general consultations, diabetic screenings, hypertension checks, eye power assessments, and cataract screenings. Prescribed basic medicines and reading glasses are provided free of cost to senior citizens.',
      icon: '🩺',
      bgGradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #047857 100%)',
      accentColor: '#059669',
      highlightsMr: [
        'तज्ज्ञ डॉक्टरांद्वारे मोफत आरोग्य तपासणी व सल्ला',
        'रक्तातील साखर व रक्तदाब विनामूल्य चाचणी',
        'ज्येष्ठ नागरिकांना मोफत चष्मे वाटप',
        'मोतीबिंदू शस्त्रक्रियेसाठी आवश्यक मार्गदर्शन'
      ],
      highlightsEn: [
        'Free consultations with experienced physicians',
        'Complimentary blood sugar and blood pressure testing',
        'Free reading glasses distributed to senior citizens',
        'Subsidized guidance for cataract operations'
      ]
    },
    {
      id: 3,
      titleMr: 'स्वच्छता अभियान व पर्यावरण जनजागृती',
      titleEn: 'Cleanliness Drive & Eco Awareness',
      categoryMr: 'पर्यावरण व नागरी सेवा',
      categoryEn: 'Civic & Environment',
      timingMr: 'गांधी जयंती, स्वातंत्र्य दिन व नियमित',
      timingEn: 'Gandhi Jayanti & Cleanliness Drives',
      shortDescMr: '\'स्वच्छ सुंदर जोगेश्वरी\' या संकल्पनेतून शिव स्फूर्ती व आदर्श नगर परिसरात नियमित स्वच्छता मोहीम, वृक्षारोपण, आणि ओला-सुका कचरा वर्गीकरण जनजागृती राबवली जाते.',
      shortDescEn: 'Regular neighborhood cleanliness campaigns, tree plantation drives, and dry-wet waste segregation awareness drives under the "Clean Jogeshwari" banner.',
      fullDescMr: 'परिसर स्वच्छ आणि निरोगी ठेवणे ही प्रत्येकाची जबाबदारी आहे. मंडळाचे कार्यकर्ते दरवर्षी राष्ट्रीय दिनांचे औचित्य साधून सोसायटी व लगतच्या रस्त्यांची स्वच्छता करतात. पर्यावरणपूरक उत्सवासाठी शाडूच्या मूर्तींचा प्रसार, प्लास्टिक बंदी जनजागृती आणि झाडे लावून त्यांचे संवर्धन करण्याचा संदेश दिला जातो.',
      fullDescEn: 'Under the "Clean & Green Jogeshwari" vision, youth volunteers carry out area cleaning, drainage sanitization awareness, and eco-friendly Ganeshotsav initiatives encouraging clay idols and zero plastic usage in pandal decoration.',
      icon: '🌱',
      bgGradient: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #166534 100%)',
      accentColor: '#16a34a',
      highlightsMr: [
        'सोसायटी व रस्ते स्वच्छता मोहीम',
        'ओला व सुका कचरा वर्गीकरण जनजागृती',
        'पर्यावरणपूरक शाडू मूर्ती संकल्पना',
        'परिसरात वृक्षारोपण व संवर्धन'
      ],
      highlightsEn: [
        'Regular society compound and street cleaning drives',
        'Wet and dry waste segregation guidance',
        'Promoting eco-friendly clay Ganesha idols',
        'Tree plantation and green cover conservation'
      ]
    },
    {
      id: 4,
      titleMr: 'महिलांसाठी होम मिनिस्टर कार्यक्रम',
      titleEn: 'Home Minister Event for Women',
      categoryMr: 'सांस्कृतिक व महिला सक्षमीकरण',
      categoryEn: 'Cultural & Women Empowerment',
      timingMr: 'नवरात्रोत्सव दरम्यान',
      timingEn: 'During Navratri Festival',
      shortDescMr: 'नवरात्रौत्सवात परिसरातील माता-भगिनींसाठी मनोरंजक खेळ, उखाणे स्पर्धा आणि मानाची पैठणी साडी देऊन सन्मान केला जातो. महिलांच्या कलागुणांना हक्काचे व्यासपीठ.',
      shortDescEn: 'A signature Navratri event celebrating mothers and sisters with fun traditional games, Ukhane competitions, and honoring winners with Paithani sarees.',
      fullDescMr: 'नवरात्रोत्सवाचे औचित्य साधून शिव स्फूर्ती व आदर्श नगर परिसरातील महिलांसाठी लोकप्रिय \'होम मिनिस्टर - खेळ पैठणीचा\' कार्यक्रम मोठ्या उत्साहात आयोजित केला जातो. विविध मनोरंजक खेळ, पाककला स्पर्धा, रांगोळी स्पर्धा आणि पारंपरिक उखाणे स्पर्धा घेऊन विजेत्यांना पैठणी साडी, सुवर्णपदक व आकर्षक घरगुती भेटवस्तू देऊन गौरविले जाते.',
      fullDescEn: 'Every Navratri, our Mandal hosts the beloved "Home Minister - Khel Paithanicha" honoring mothers and sisters across the neighborhood. Featuring entertaining games, traditional riddle (Ukhane) contests, Rangoli showcases, and honoring each participant with tokens of affection and the coveted Paithani saree for the winner.',
      icon: '🥻',
      bgGradient: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #9d174d 100%)',
      accentColor: '#be185d',
      highlightsMr: [
        'खेळ पैठणीचा व पारंपरिक उखाणे स्पर्धा',
        'विजेत्या माता-भगिनींना मानाची पैठणी साडी',
        'रांगोळी व कलागुण प्रदर्शन स्पर्धा',
        'हळदी-कुंकू व सर्व सहभागी महिलांचा सन्मान'
      ],
      highlightsEn: [
        'Traditional games and cultural competition',
        'Paithani saree gifted to the grand winner',
        'Rangoli and creative talent competitions',
        'Haldi-Kunku ceremony and gifts for all participants'
      ]
    },
    {
      id: 5,
      titleMr: 'सामाजिक जनजागृती व प्रबोधन व्याख्याने',
      titleEn: 'Social Awareness & Awareness Talks',
      categoryMr: 'प्रबोधन व शिक्षण',
      categoryEn: 'Social Awareness & Education',
      timingMr: 'वर्षभर विविध राष्ट्रीय दिनी',
      timingEn: 'Throughout the Year on National Days',
      shortDescMr: 'व्यसनमुक्ती, सायबर सुरक्षा, महिला सुरक्षितता आणि वाहतूक नियमांवर तज्ज्ञांची व्याख्याने व मार्गदर्शन सत्रे आयोजित करून समाजप्रबोधन केले जाते.',
      shortDescEn: 'Informative seminars and awareness lectures on cyber safety, de-addiction, road safety, and womens safety conducted by guest experts and police officers.',
      fullDescMr: 'उत्सव हे समाजप्रबोधनाचे प्रभावी माध्यम व्हावे या हेतूने मंडळाकडून सायबर फसवणुकीपासून बचाव, महिला व ज्येष्ठ नागरिकांची सुरक्षितता, आणि तरुणांमधील व्यसनमुक्ती या विषयांवर मार्गदर्शन शिबिरे घेतली जातात. स्थानिक पोलीस ठाण्यातील अधिकारी व कायदेतज्ज्ञांच्या मदतीने नागरिकांना सतर्क केले जाते.',
      fullDescEn: 'Festivals must serve as an instrument of social awakening. The Mandal organizes workshops on cyber safety, fraud awareness, women empowerment, and anti-addiction campaigns in coordination with local authorities and guest speakers.',
      icon: '📢',
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
      accentColor: '#2563eb',
      highlightsMr: [
        'सायबर गुन्हेगारीपासून बचाव मार्गदर्शन',
        'महिला व बाल सुरक्षितता जनजागृती',
        'वाहतूक नियम व रस्ता सुरक्षा माहिती',
        'स्थानिक पोलीस अधिकाऱ्यांचे थेट मार्गदर्शन'
      ],
      highlightsEn: [
        'Guidance on avoiding digital & online financial scams',
        'Women and child safety awareness sessions',
        'Traffic discipline and helmet/road safety',
        'Interactive sessions with local law enforcement'
      ]
    },
    {
      id: 6,
      titleMr: 'गरजू व्यक्तींना व विद्यार्थ्यांना मदत',
      titleEn: 'Aid to the Needy & Students',
      categoryMr: 'लोककल्याण व साहाय्य',
      categoryEn: 'Welfare & Scholarships',
      timingMr: 'शैक्षणिक वर्षारंभ व आपत्कालीन',
      timingEn: 'School Reopening & Emergency Needs',
      shortDescMr: 'आर्थिक दुर्बल घटकांतील गुणवंत विद्यार्थ्यांना वह्या-पुस्तके, शैक्षणिक साहित्य वाटप आणि आपत्कालीन वैद्यकीय उपचारांसाठी गरजू कुटुंबांना तातडीचे साहाय्य.',
      shortDescEn: 'Educational stationery, notebooks, and scholarship support to meritorious students from underprivileged families, along with emergency medical welfare assistance.',
      fullDescMr: 'मंडळाच्या गंगाजळीतून दरवर्षी गरजू कुटुंबातील विद्यार्थ्यांना शालेय दप्तर, वह्या, कंपास पेटी व पुस्तकांचे वाटप केले जाते. तसेच गंभीर आजार किंवा आपत्कालीन परिस्थितीत ज्या कुटुंबांना उपचाराचा खर्च पेलवत नाही, त्यांना मंडळाच्या वतीने शक्य तेवढी रोख वा थेट औषधोपचार मदत पुरवली जाते.',
      fullDescEn: 'Reinvesting festival reserves back into the community, we distribute school bags, notebooks, and stationery to deserving students before every academic year, and provide emergency relief aid to neighborhood families facing unforeseen medical emergencies.',
      icon: '📚',
      bgGradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #c2410c 100%)',
      accentColor: '#ea580c',
      highlightsMr: [
        'गरजू विद्यार्थ्यांना वह्या व दप्तर वाटप',
        'दहावी-बारावीतील गुणवंत विद्यार्थ्यांचा सत्कार',
        'तातडीच्या वैद्यकीय उपचारांसाठी आर्थिक मदत',
        'ज्येष्ठ नागरिकांसाठी आवश्यक साहाय्य'
      ],
      highlightsEn: [
        'Free school books and stationery kit distribution',
        'Felicitation of meritorious 10th & 12th students',
        'Financial aid for critical medical treatments',
        'Elderly assistance network within society'
      ]
    },
    {
      id: 7,
      titleMr: 'सांस्कृतिक उत्सव, अन्नदान व ज्येष्ठ नागरिक सन्मान',
      titleEn: 'Community Cultural Events, Annadaan & Senior Honors',
      categoryMr: 'सांस्कृतिक व सामुदायिक ऐक्य',
      categoryEn: 'Cultural Unity & Annadaan',
      timingMr: 'गणेशोत्सव, नवरात्रोत्सव व वर्षभर',
      timingEn: 'Ganeshotsav, Navratri & Year-Round',
      shortDescMr: 'महाप्रसाद व भव्य अन्नदान (भंडारा), भजन स्पर्धा, हळदी-कुंकू समारंभ, क्रीडा स्पर्धा आणि सोसायटीतील ज्येष्ठ नागरिकांचा कृतज्ञता सत्कार सोहळा.',
      shortDescEn: 'Grand Bhandara (community feast) serving thousands, bhajan competitions, sports tournaments, and honoring senior citizens for their lifetime guidance.',
      fullDescMr: 'सामूहिक ऐक्य वृद्धिंगत करण्यासाठी गणेशोत्सवात व नवरात्रीत हजारो भाविकांना महाप्रसादाचे (अन्नदान) वाटप केले जाते. लहान मुलांसाठी चित्रकला व वक्तृत्व स्पर्धा, तरुणांसाठी क्रीडा स्पर्धा आणि सोसायटीची पायाभरणी करणाऱ्या आदरणीय ज्येष्ठ नागरिकांचा शाल-श्रीफळ देऊन सन्मान सोहळा संपन्न होतो.',
      fullDescEn: 'Building deep familial bonds among all residents, our Mandal serves grand community Bhandara prasad to thousands of devotees. In addition, we host youth sports tournaments, childrens art competitions, and conduct respectful felicitations for elderly residents.',
      icon: '🍲',
      bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #b45309 50%, #92400e 100%)',
      accentColor: '#b45309',
      highlightsMr: [
        'हजारो भाविकांसाठी मोफत महाप्रसाद व भंडारा',
        'लहान मुलांसाठी चित्रकला व क्रीडा स्पर्धा',
        'परिसरातील ज्येष्ठ नागरिकांचा गौरव सोहळा',
        'भजन संध्या व पारंपरिक सांस्कृतिक कार्यक्रम'
      ],
      highlightsEn: [
        'Free Maha-Prasad & Bhandara for thousands',
        'Art and sports competitions for children',
        'Lifetime felicitation of senior citizens',
        'Devotional Bhajan evenings and cultural programs'
      ]
    }
  ];
}
