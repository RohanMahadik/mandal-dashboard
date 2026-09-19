import { Component, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { MandalDataService } from '../../services/mandal-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-yearly-archive',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 pb-8 animate-fade-in">
      
      <!-- Banner -->
      <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10">
          <!-- Back to Dashboard Button -->
          <a
            routerLink="/"
            class="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-blue-100 hover:text-white border border-white/20 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
            title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
          >
            <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
          </a>

          <div class="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <span>●</span>
            <span>{{ mandalData.t('ऐतिहासिक ताळेबंद व उत्सव हिशोब', 'Historical Balance Sheet & Festival Accounts') }}</span>
          </div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
            {{ mandalData.t('वर्षनिहाय अहवाल व उत्सव ताळेबंद', 'Yearly Festival Archive & Financial Balance Sheet') }}
          </h1>
          <p class="text-slate-300 text-xs md:text-sm mt-1">
            {{ mandalData.t('Excel मधील अधिकृत वर्षनिहाय हिशोब व उत्सव आर्थिक ताळेबंद अहवाल', 'Official yearly financial accounts & festival balance sheet reports from Excel') }}
          </p>
        </div>
      </div>

      <!-- Explanatory Information Note Card -->
      <div class="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-slate-50 border border-blue-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-start gap-3.5 sm:gap-4">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0 mt-0.5">
          📜
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs sm:text-sm font-black text-slate-900 font-devanagari">
              {{ mandalData.t('वार्षिक दस्तऐवज उद्देश व स्वरूप', 'Purpose of Yearly Archive') }}
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider font-sans">
              Archive Guide
            </span>
          </div>
          <p class="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-devanagari mt-1">
            {{ mandalData.t(archiveDescriptionMr, archiveDescriptionEn) }}
          </p>
        </div>
      </div>

      <!-- Live Excel Sync Status Banner -->
      @if (mandalData.isExcelLoaded()) {
        <div class="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:px-5 text-xs text-emerald-950 font-devanagari shadow-2xs">
          <div class="flex items-center gap-2.5">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <span class="font-black text-emerald-800">{{ mandalData.t('Excel डेटा थेट जोडलेला आहे (Live Excel Synced):', 'Live Excel Data Connected:') }}</span>
            <span class="font-bold text-emerald-950 font-sans bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-200">
              {{ mandalData.excelFileName() }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-emerald-800 font-sans">
            <span><b>{{ mandalData.allVargani().length }}</b> {{ mandalData.t('वर्गणी', 'Donations') }}</span>
            <span>•</span>
            <span><b>{{ mandalData.allKharch().length }}</b> {{ mandalData.t('खर्च', 'Expenses') }}</span>
            <span>•</span>
            <span><b>{{ mandalData.yearlyFestivalBreakdowns().length }}</b> {{ mandalData.t('वर्षे समाविष्ट', 'Years Included') }}</span>
          </div>
        </div>
      }

      <!-- ================= 8. YEAR-WISE TABS (2024, 2025, 2026, 2027) ================= -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-3 sm:p-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div class="flex items-center gap-2">
            <span class="text-amber-600 text-base">📅</span>
            <div>
              <div class="text-xs font-bold text-slate-500 font-devanagari">{{ mandalData.t('आर्थिक वर्ष निवडा', 'Select Financial Year') }}</div>
              <div class="text-sm font-black text-slate-900 font-devanagari">
                {{ mandalData.t('वर्षनिहाय ताळेबंद टॅब्स', 'Yearly Archive Tabs') }}
              </div>
            </div>
          </div>

          <!-- Year Tabs Button Group -->
          <div class="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
            @for (y of yearList(); track y) {
              <button
                (click)="selectYear(y)"
                class="px-4 py-2 rounded-lg font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-1 shrink-0"
                [ngClass]="selectedYear() === y ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'"
              >
                <span>{{ mandalData.toMarathiDigits(y) }}</span>
                @if (selectedYear() === y) {
                  <span class="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-sans">Active</span>
                }
              </button>
            }
          </div>

        </div>
      </div>

      <!-- ================= 8. SEPARATE FINANCIAL SUMMARIES FOR 3 FESTIVALS ================= -->
      @let curRecord = currentYearRecord();
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        <!-- 1. Ganpati Utsav Financial Card -->
        @let ganpati = getFestivalData('ganpati');
        <div class="bg-white rounded-2xl shadow-sm border-2 border-amber-300 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="border-b border-amber-100 pb-3 flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-2xs">
                🪔
              </div>
              <div>
                <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                  {{ mandalData.t('प्रमुख उत्सव', 'Main Festival') }} • {{ mandalData.toMarathiDigits(selectedYear()) }}
                </span>
                <h3 class="text-base sm:text-lg font-black text-slate-900 font-devanagari">
                  {{ mandalData.isEnglish() ? ganpati?.festivalNameEn : ganpati?.festivalNameMr }}
                </h3>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
              १० दिवस
            </span>
          </div>

          <div class="space-y-3 font-devanagari">
            <div class="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span class="text-xs font-semibold text-emerald-900">{{ mandalData.t('एकूण वर्गणी जमा (Collection):', 'Total Collection:') }}</span>
              <span class="text-sm sm:text-base font-black text-emerald-700">{{ mandalData.formatNum(ganpati?.totalCollection, true) }}</span>
            </div>

            <div class="flex items-center justify-between p-2 rounded-lg bg-rose-50/70 border border-rose-100">
              <span class="text-xs font-semibold text-rose-900">{{ mandalData.t('झालेला एकूण खर्च (Expenses):', 'Total Expenses:') }}</span>
              <span class="text-sm sm:text-base font-black text-rose-700">{{ mandalData.formatNum(ganpati?.totalExpenses, true) }}</span>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <div>
                <span class="text-xs font-bold text-blue-900 block">{{ mandalData.t('शिल्लक रक्कम (Balance):', 'Net Balance:') }}</span>
                <span class="text-[10px] text-blue-700">{{ mandalData.t('गंगाजळी शिल्लक', 'Surplus Reserve') }}</span>
              </div>
              <span class="text-base sm:text-lg font-black text-blue-700">{{ mandalData.formatNum(ganpati?.balance, true) }}</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-500 font-devanagari text-center pt-1 border-t border-slate-100">
            {{ mandalData.t('भव्य मूर्ती, मंडप, पूजा व महाप्रसाद खर्च समाविष्ट', 'Includes Murti, Mandap, Puja & Mahaprasad') }}
          </div>
        </div>

        <!-- 2. Navratri Utsav Financial Card -->
        @let navratri = getFestivalData('navratri');
        <div class="bg-white rounded-2xl shadow-sm border-2 border-rose-300 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="border-b border-rose-100 pb-3 flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl shadow-2xs">
                🔱
              </div>
              <div>
                <span class="text-[10px] font-bold text-rose-700 uppercase tracking-wide">
                  {{ mandalData.t('शक्ति उत्सव', 'Devotion Festival') }} • {{ mandalData.toMarathiDigits(selectedYear()) }}
                </span>
                <h3 class="text-base sm:text-lg font-black text-slate-900 font-devanagari">
                  {{ mandalData.isEnglish() ? navratri?.festivalNameEn : navratri?.festivalNameMr }}
                </h3>
              </div>
            </div>
            @if (navratri?.totalCollection === 0 && navratri?.totalExpenses === 0) {
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold font-devanagari">
                {{ mandalData.t('नोंद नाही', 'No Record') }}
              </span>
            } @else {
              <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[11px] font-bold">
                ९ दिवस
              </span>
            }
          </div>

          <div class="space-y-3 font-devanagari">
            <div class="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span class="text-xs font-semibold text-emerald-900">{{ mandalData.t('एकूण वर्गणी जमा (Collection):', 'Total Collection:') }}</span>
              <span class="text-sm sm:text-base font-black text-emerald-700">{{ mandalData.formatNum(navratri?.totalCollection, true) }}</span>
            </div>

            <div class="flex items-center justify-between p-2 rounded-lg bg-rose-50/70 border border-rose-100">
              <span class="text-xs font-semibold text-rose-900">{{ mandalData.t('झालेला एकूण खर्च (Expenses):', 'Total Expenses:') }}</span>
              <span class="text-sm sm:text-base font-black text-rose-700">{{ mandalData.formatNum(navratri?.totalExpenses, true) }}</span>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <div>
                <span class="text-xs font-bold text-blue-900 block">{{ mandalData.t('शिल्लक रक्कम (Balance):', 'Net Balance:') }}</span>
                <span class="text-[10px] text-blue-700">{{ mandalData.t('गंगाजळी शिल्लक', 'Surplus Reserve') }}</span>
              </div>
              <span class="text-base sm:text-lg font-black text-blue-700">{{ mandalData.formatNum(navratri?.balance, true) }}</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-500 font-devanagari text-center pt-1 border-t border-slate-100">
            @if (navratri?.totalCollection === 0 && navratri?.totalExpenses === 0) {
              <span class="text-amber-700 font-semibold">{{ mandalData.t('Excel मध्ये या उत्सवाचा आर्थिक हिशोब नोंदवलेला नाही (₹ ०)', 'No financial entries for this festival in Excel (₹ 0)') }}</span>
            } @else {
              {{ mandalData.t('घटस्थापना, गरबा-दांडिया, अष्टमी हवन व महाप्रसाद', 'Ghatsthapana, Dandiya, Ashtami Havan & Prasad') }}
            }
          </div>
        </div>

        <!-- 3. Dr. B. R. Ambedkar Jayanti Financial Card -->
        @let ambedkar = getFestivalData('ambedkar');
        <div class="bg-white rounded-2xl shadow-sm border-2 border-indigo-300 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="border-b border-indigo-100 pb-3 flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl shadow-2xs">
                ⚖️
              </div>
              <div>
                <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                  {{ mandalData.t('राष्ट्रीय जयंती', 'National Jayanti') }} • {{ mandalData.toMarathiDigits(selectedYear()) }}
                </span>
                <h3 class="text-base sm:text-lg font-black text-slate-900 font-devanagari">
                  {{ mandalData.isEnglish() ? ambedkar?.festivalNameEn : ambedkar?.festivalNameMr }}
                </h3>
              </div>
            </div>
            @if (ambedkar?.totalCollection === 0 && ambedkar?.totalExpenses === 0) {
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold font-devanagari">
                {{ mandalData.t('नोंद नाही', 'No Record') }}
              </span>
            } @else {
              <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-bold">
                १४ एप्रिल
              </span>
            }
          </div>

          <div class="space-y-3 font-devanagari">
            <div class="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span class="text-xs font-semibold text-emerald-900">{{ mandalData.t('एकूण वर्गणी जमा (Collection):', 'Total Collection:') }}</span>
              <span class="text-sm sm:text-base font-black text-emerald-700">{{ mandalData.formatNum(ambedkar?.totalCollection, true) }}</span>
            </div>

            <div class="flex items-center justify-between p-2 rounded-lg bg-rose-50/70 border border-rose-100">
              <span class="text-xs font-semibold text-rose-900">{{ mandalData.t('झालेला एकूण खर्च (Expenses):', 'Total Expenses:') }}</span>
              <span class="text-sm sm:text-base font-black text-rose-700">{{ mandalData.formatNum(ambedkar?.totalExpenses, true) }}</span>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <div>
                <span class="text-xs font-bold text-blue-900 block">{{ mandalData.t('शिल्लक रक्कम (Balance):', 'Net Balance:') }}</span>
                <span class="text-[10px] text-blue-700">{{ mandalData.t('गंगाजळी शिल्लक', 'Surplus Reserve') }}</span>
              </div>
              <span class="text-base sm:text-lg font-black text-blue-700">{{ mandalData.formatNum(ambedkar?.balance, true) }}</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-500 font-devanagari text-center pt-1 border-t border-slate-100">
            @if (ambedkar?.totalCollection === 0 && ambedkar?.totalExpenses === 0) {
              <span class="text-amber-700 font-semibold">{{ mandalData.t('Excel मध्ये या उत्सवाचा आर्थिक हिशोब नोंदवलेला नाही (₹ ०)', 'No financial entries for this festival in Excel (₹ 0)') }}</span>
            } @else {
              {{ mandalData.t('पुष्पवृष्टी, व्याख्यान, सामाजिक शिबीर व अल्पोपहार', 'Floral Tribute, Lectures, Social Camp & Snacks') }}
            }
          </div>
        </div>

      </div>

      <!-- Combined Year Summary Bar -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="space-y-1 text-center md:text-left">
          <span class="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold font-devanagari border border-blue-400/30">
            {{ mandalData.t('वार्षिक ताळेबंद एकत्रित गोषवारा', 'Combined Annual Financial Summary') }} - वर्ष {{ mandalData.toMarathiDigits(selectedYear()) }}
          </span>
          <p class="text-xs text-slate-300 font-devanagari">
            {{ mandalData.isEnglish() ? curRecord?.noteEn : curRecord?.noteMr }}
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 text-center">
          <div class="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
            <span class="text-[10px] text-slate-400 block">{{ mandalData.t('एकूण तिन्ही उत्सव वर्गणी', 'Total Collection') }}</span>
            <span class="text-base font-black text-emerald-400">{{ mandalData.formatNum(curRecord?.totalCollection, true) }}</span>
          </div>
          <div class="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
            <span class="text-[10px] text-slate-400 block">{{ mandalData.t('एकूण तिन्ही उत्सव खर्च', 'Total Expenses') }}</span>
            <span class="text-base font-black text-rose-400">{{ mandalData.formatNum(curRecord?.totalExpenses, true) }}</span>
          </div>
          <div class="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
            <span class="text-[10px] text-slate-400 block">{{ mandalData.t('एकूण शिल्लक गंगाजळी', 'Net Surplus') }}</span>
            <span class="text-base font-black text-blue-400">{{ mandalData.formatNum(curRecord?.netBalance, true) }}</span>
          </div>
        </div>
      </div>

      <!-- ================= 4. INTERACTIVE FESTIVAL COMPARISON / BALANCE SHEET CHART ================= -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-5">
        
        <!-- Header & Metric Switcher Controls -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold font-devanagari border border-blue-200 mb-1">
              <span>📊</span>
              <span>{{ mandalData.t('उत्सव आर्थिक आलेख', 'Festival Financial Graph') }}</span>
              <span>•</span>
              <span>वर्ष {{ formattedComparisonYears() }}</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 font-devanagari">
              {{ mandalData.t(
                'उत्सवनिहाय तुलनात्मक विश्लेषण: गणेशोत्सव vs नवरात्रोत्सव vs डॉ. आंबेडकर जयंती',
                'Festival Comparison: Ganeshotsav vs Navratri vs Ambedkar Jayanti'
              ) }}
            </h2>
            <p class="text-xs text-slate-500 font-devanagari">
              {{ mandalData.t(
                'Excel डेटामधून थेट वर्गणी संकलन, खर्च, शिल्लक व भाविक सहभागाचे अचूक विश्लेषण.',
                'Real-time comparative analysis of collections, expenses, balance, and participation from Excel data.'
              ) }}
            </p>
          </div>

          <!-- Interactive Metric Toggle Buttons -->
          <div class="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start lg:self-auto">
            <button
              type="button"
              (click)="setMetric('collection')"
              class="px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedMetric() === 'collection' ? 'bg-emerald-600 text-white shadow-sm font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>🪙</span>
              <span>{{ mandalData.t('वर्गणी जमा', 'Collections') }}</span>
            </button>

            <button
              type="button"
              (click)="setMetric('expenses')"
              class="px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedMetric() === 'expenses' ? 'bg-rose-600 text-white shadow-sm font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>📉</span>
              <span>{{ mandalData.t('झालेला खर्च', 'Expenses') }}</span>
            </button>

            <button
              type="button"
              (click)="setMetric('balance')"
              class="px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedMetric() === 'balance' ? 'bg-blue-600 text-white shadow-sm font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>💰</span>
              <span>{{ mandalData.t('शिल्लक गंगाजळी', 'Net Balance') }}</span>
            </button>

            <button
              type="button"
              (click)="setMetric('participation')"
              class="px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedMetric() === 'participation' ? 'bg-purple-600 text-white shadow-sm font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>👥</span>
              <span>{{ mandalData.t('सहभागी भाविक', 'Participation') }}</span>
            </button>
          </div>

        </div>

        <!-- If only 2026 is present in Excel, show an informative banner -->
        @if (activeComparisonYears().length <= 1) {
          <div class="flex items-center gap-2 p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 font-devanagari">
            <span class="text-base shrink-0">ℹ️</span>
            <span>
              {{ mandalData.t(
                'सध्या Excel शीटमध्ये फक्त २०२६ चे अधिकृत हिशोब उपलब्ध आहेत. आगामी काळात २०२५, २०२४ किंवा इतर वर्षांचा डेटा Excel मध्ये जोडल्यास येथे बहुवर्षीय तुलनात्मक आलेख आपोआप दिसेल.',
                'Currently only 2026 official records exist in Excel. When historical records (2025, 2024) are added to Excel, multi-year comparisons will appear automatically.'
              ) }}
            </span>
          </div>
        }

        <!-- Legend Pills for Available Years -->
        <div class="flex flex-wrap items-center justify-center gap-5 text-xs font-bold font-devanagari text-slate-700 py-1">
          @for (yr of activeComparisonYears(); track yr) {
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-md shadow-2xs" [style.backgroundColor]="getYearColor(yr)"></span>
              <span>{{ mandalData.t('वर्ष ' + mandalData.toMarathiDigits(yr), 'Year ' + yr) }}</span>
              @if (yr === 2026) {
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold font-devanagari">{{ mandalData.t('चालू', 'Current') }}</span>
              }
            </div>
          }
        </div>

        <!-- Chart Canvas Container with Responsive Height -->
        <div class="relative w-full h-[320px] sm:h-[380px]">
          <canvas #comparisonCanvas></canvas>
        </div>

        <!-- Festival Highlights Cards (Dynamic from Excel Data) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100">
          
          <!-- Ganpati Growth Card -->
          @let gStat = getGrowthStats('ganpati');
          <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1 text-xs">
            <div class="flex items-center justify-between font-bold text-amber-900">
              <span class="flex items-center gap-1">🪔 <span>{{ mandalData.t('सार्वजनिक गणेशोत्सव', 'Ganeshotsav') }}</span></span>
              @if (gStat.hasGrowth) {
                <span class="text-emerald-700 font-black">{{ mandalData.toMarathiDigits(gStat.growthFormatted) }} {{ mandalData.t('वाढ', 'Growth') }}</span>
              } @else {
                <span class="text-amber-800 font-bold text-[11px] bg-amber-100/80 px-2 py-0.5 rounded-full">{{ mandalData.t('चालू वर्ष नोंद', 'Active Record') }}</span>
              }
            </div>
            @if (gStat.hasData) {
              <div class="text-[11px] text-slate-700 font-sans">
                {{ mandalData.toMarathiDigits(selectedYear()) }}: <b>{{ mandalData.formatNum(gStat.cCurrent, true) }}</b>
                @if (gStat.cPrev > 0) {
                  <span class="text-slate-500 font-normal"> (मागील: {{ mandalData.formatNum(gStat.cPrev, true) }})</span>
                }
              </div>
              <div class="text-[10px] text-slate-500 font-devanagari">
                {{ mandalData.formatNum(gStat.donorsCount) }} {{ mandalData.t('देणगीदार', 'donors') }}
                @if (gStat.devotees > 0) {
                  • {{ mandalData.formatNum(gStat.devotees) }}+ {{ mandalData.t('भाविक उपस्थिती', 'devotees') }}
                }
              </div>
            } @else {
              <div class="text-[11px] text-slate-500 font-devanagari italic">
                {{ mandalData.t('Excel मध्ये नोंद उपलब्ध नाही (₹ ०)', 'No data in Excel (₹ 0)') }}
              </div>
            }
          </div>

          <!-- Navratri Growth Card -->
          @let nStat = getGrowthStats('navratri');
          <div class="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1 text-xs">
            <div class="flex items-center justify-between font-bold text-rose-900">
              <span class="flex items-center gap-1">🔱 <span>{{ mandalData.t('नवरात्र उत्सव', 'Navratri Utsav') }}</span></span>
              @if (nStat.hasGrowth) {
                <span class="text-emerald-700 font-black">{{ mandalData.toMarathiDigits(nStat.growthFormatted) }} {{ mandalData.t('वाढ', 'Growth') }}</span>
              } @else {
                <span class="text-rose-800 font-bold text-[11px] bg-rose-100/80 px-2 py-0.5 rounded-full">{{ mandalData.t('डेटा स्थिती', 'Status') }}</span>
              }
            </div>
            @if (nStat.hasData) {
              <div class="text-[11px] text-slate-700 font-sans">
                {{ mandalData.toMarathiDigits(selectedYear()) }}: <b>{{ mandalData.formatNum(nStat.cCurrent, true) }}</b>
                @if (nStat.cPrev > 0) {
                  <span class="text-slate-500 font-normal"> (मागील: {{ mandalData.formatNum(nStat.cPrev, true) }})</span>
                }
              </div>
              <div class="text-[10px] text-slate-500 font-devanagari">
                {{ mandalData.formatNum(nStat.donorsCount) }} {{ mandalData.t('देणगीदार', 'donors') }}
                @if (nStat.devotees > 0) {
                  • {{ mandalData.formatNum(nStat.devotees) }}+ {{ mandalData.t('भाविक उपस्थिती', 'devotees') }}
                }
              </div>
            } @else {
              <div class="text-[11px] text-slate-500 font-devanagari italic">
                {{ mandalData.t('Excel मध्ये आर्थिक नोंद नाही (₹ ०)', 'No financial entries in Excel (₹ 0)') }}
              </div>
            }
          </div>

          <!-- Ambedkar Jayanti Growth Card -->
          @let aStat = getGrowthStats('ambedkar');
          <div class="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-1 text-xs">
            <div class="flex items-center justify-between font-bold text-indigo-900">
              <span class="flex items-center gap-1">⚖️ <span>{{ mandalData.t('डॉ. आंबेडकर जयंती', 'Dr. Ambedkar Jayanti') }}</span></span>
              @if (aStat.hasGrowth) {
                <span class="text-emerald-700 font-black">{{ mandalData.toMarathiDigits(aStat.growthFormatted) }} {{ mandalData.t('वाढ', 'Growth') }}</span>
              } @else {
                <span class="text-indigo-800 font-bold text-[11px] bg-indigo-100/80 px-2 py-0.5 rounded-full">{{ mandalData.t('डेटा स्थिती', 'Status') }}</span>
              }
            </div>
            @if (aStat.hasData) {
              <div class="text-[11px] text-slate-700 font-sans">
                {{ mandalData.toMarathiDigits(selectedYear()) }}: <b>{{ mandalData.formatNum(aStat.cCurrent, true) }}</b>
                @if (aStat.cPrev > 0) {
                  <span class="text-slate-500 font-normal"> (मागील: {{ mandalData.formatNum(aStat.cPrev, true) }})</span>
                }
              </div>
              <div class="text-[10px] text-slate-500 font-devanagari">
                {{ mandalData.formatNum(aStat.donorsCount) }} {{ mandalData.t('देणगीदार', 'donors') }}
                @if (aStat.devotees > 0) {
                  • {{ mandalData.formatNum(aStat.devotees) }}+ {{ mandalData.t('भाविक उपस्थिती', 'devotees') }}
                }
              </div>
            } @else {
              <div class="text-[11px] text-slate-500 font-devanagari italic">
                {{ mandalData.t('Excel मध्ये आर्थिक नोंद नाही (₹ ०)', 'No financial entries in Excel (₹ 0)') }}
              </div>
            }
          </div>

        </div>

        <!-- Year-by-Year Historical Balance Sheet Summary Table -->
        <div class="mt-6 bg-slate-50/70 rounded-2xl p-3 sm:p-4 border border-slate-200/80">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-blue-600 text-sm">📋</span>
              <h3 class="text-xs sm:text-sm font-bold text-slate-900 font-devanagari">
                {{ mandalData.t('वर्षनिहाय सर्व उत्सवांचा एकत्रित तुलनात्मक ताळेबंद तक्ता', 'Year-by-Year Combined Festival Financial Comparison Table') }}
              </h3>
            </div>
            <span class="text-[11px] text-slate-500 font-devanagari">
              {{ mandalData.t('Excel डेटामधून थेट एकत्रित', 'Dynamically Aggregated from Excel Data') }}
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
            <table class="w-full text-left text-xs font-devanagari">
              <thead class="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-2.5 sm:px-3.5">{{ mandalData.t('वर्ष', 'Year') }}</th>
                  <th class="p-2.5 sm:px-3.5 text-amber-800">🪔 {{ mandalData.t('गणेशोत्सव (जमा/खर्च)', 'Ganeshotsav (Coll/Exp)') }}</th>
                  <th class="p-2.5 sm:px-3.5 text-rose-800">🔱 {{ mandalData.t('नवरात्र (जमा/खर्च)', 'Navratri (Coll/Exp)') }}</th>
                  <th class="p-2.5 sm:px-3.5 text-indigo-800">⚖️ {{ mandalData.t('आंबेडकर जयंती (जमा/खर्च)', 'Ambedkar (Coll/Exp)') }}</th>
                  <th class="p-2.5 sm:px-3.5 text-emerald-700">{{ mandalData.t('एकूण वर्गणी जमा', 'Total Collection') }}</th>
                  <th class="p-2.5 sm:px-3.5 text-rose-700">{{ mandalData.t('झालेला एकूण खर्च', 'Total Expenses') }}</th>
                  <th class="p-2.5 sm:px-3.5 text-blue-700 font-black">{{ mandalData.t('निव्वळ शिल्लक', 'Net Balance') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (rec of mandalData.yearlyFestivalBreakdowns(); track rec.year) {
                  <tr class="hover:bg-slate-50/80 transition cursor-pointer" (click)="selectYear(rec.year)" [ngClass]="selectedYear() === rec.year ? 'bg-blue-50/50 font-semibold' : ''">
                    <td class="p-2.5 sm:px-3.5 font-bold font-sans flex items-center gap-1.5">
                      <span class="text-blue-600 hover:underline">
                        {{ mandalData.toMarathiDigits(rec.year) }}
                      </span>
                      @if (rec.year === 2026) {
                        <span class="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">चालू</span>
                      }
                    </td>
                    <td class="p-2.5 sm:px-3.5">
                      <span class="text-emerald-700 font-medium">{{ mandalData.formatNum(rec.festivals[0]?.totalCollection, true) }}</span> /
                      <span class="text-rose-700 font-medium">{{ mandalData.formatNum(rec.festivals[0]?.totalExpenses, true) }}</span>
                    </td>
                    <td class="p-2.5 sm:px-3.5">
                      <span class="text-emerald-700 font-medium">{{ mandalData.formatNum(rec.festivals[1]?.totalCollection, true) }}</span> /
                      <span class="text-rose-700 font-medium">{{ mandalData.formatNum(rec.festivals[1]?.totalExpenses, true) }}</span>
                    </td>
                    <td class="p-2.5 sm:px-3.5">
                      <span class="text-emerald-700 font-medium">{{ mandalData.formatNum(rec.festivals[2]?.totalCollection, true) }}</span> /
                      <span class="text-rose-700 font-medium">{{ mandalData.formatNum(rec.festivals[2]?.totalExpenses, true) }}</span>
                    </td>
                    <td class="p-2.5 sm:px-3.5 text-emerald-700 font-bold">
                      {{ mandalData.formatNum(rec.totalCollection, true) }}
                    </td>
                    <td class="p-2.5 sm:px-3.5 text-rose-700 font-bold">
                      {{ mandalData.formatNum(rec.totalExpenses, true) }}
                    </td>
                    <td class="p-2.5 sm:px-3.5 text-blue-700 font-black">
                      {{ mandalData.formatNum(rec.netBalance, true) }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `
})
export class YearlyArchiveComponent implements AfterViewInit, OnDestroy {
  readonly mandalData = inject(MandalDataService);

  readonly archiveDescriptionMr = "हे 'वार्षिक दस्तऐवज (Yearly Archive)' पान मागील सर्व वर्षांच्या उत्सवांची ऐतिहासिक नोंद ठेवते. येथे तुम्ही मागील वर्षांमधील जमा वर्गणी, खर्च, शिल्लक रक्कम आणि उत्सवांचे तुलनात्मक अहवाल पाहू शकता.";
  readonly archiveDescriptionEn = "This Yearly Archive page maintains historical records of all past festivals. Here, you can review, compare, and analyze year-over-year collections, expenses, balance sheets, and key highlights across previous years.";

  readonly yearList = computed(() => {
    return this.mandalData.yearlyFestivalBreakdowns().map(r => r.year);
  });
  readonly selectedYear = signal<number>(2026);
  readonly selectedMetric = signal<'collection' | 'expenses' | 'balance' | 'participation'>('collection');

  readonly activeComparisonYears = computed(() => {
    const list = this.yearList();
    return list.length > 0 ? [...list].sort((a, b) => a - b) : [2026];
  });

  readonly formattedComparisonYears = computed(() => {
    return this.activeComparisonYears().map(y => this.mandalData.toMarathiDigits(y)).join(', ');
  });

  getYearColor(year: number): string {
    const colors: Record<number, string> = {
      2026: '#10b981',
      2025: '#f59e0b',
      2024: '#3b82f6',
      2027: '#8b5cf6'
    };
    return colors[year] || '#6366f1';
  }

  readonly currentYearRecord = computed(() => {
    const list = this.mandalData.yearlyFestivalBreakdowns();
    const year = this.selectedYear();
    return list.find(item => item.year === year) || list[0];
  });

  @ViewChild('comparisonCanvas') comparisonCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      this.mandalData.selectedLanguage();
      this.mandalData.useMarathiDigits();
      this.selectedMetric();
      this.mandalData.yearlyFestivalBreakdowns(); // Reactively re-render whenever Excel data updates!
      if (this.chart) {
        this.updateChart();
      }
    });
  }

  getFestivalData(key: 'ganpati' | 'navratri' | 'ambedkar') {
    const rec = this.currentYearRecord();
    return rec?.festivals.find(f => f.festivalKey === key);
  }

  selectYear(year: number) {
    this.selectedYear.set(year);
  }

  setMetric(metric: 'collection' | 'expenses' | 'balance' | 'participation') {
    this.selectedMetric.set(metric);
  }

  ngAfterViewInit() {
    const ctx = this.comparisonCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.initChart(ctx);
  }

  private getFestivalRecord(year: number, key: 'ganpati' | 'navratri' | 'ambedkar') {
    const list = this.mandalData.yearlyFestivalBreakdowns();
    const yearRec = list.find(y => y.year === year);
    return yearRec?.festivals.find(f => f.festivalKey === key);
  }

  getGrowthStats(key: 'ganpati' | 'navratri' | 'ambedkar') {
    const list = this.mandalData.yearlyFestivalBreakdowns();
    const curYear = this.selectedYear();
    const curFest = this.getFestivalRecord(curYear, key);
    const cCur = curFest?.totalCollection || 0;

    // Find previous available year in data
    const prevYearRec = list.find(y => y.year < curYear);
    const prevFest = prevYearRec ? prevYearRec.festivals.find(f => f.festivalKey === key) : null;
    const cPrev = prevFest?.totalCollection || 0;

    let growthFormatted = '-';
    let hasGrowth = false;
    if (cPrev > 0 && cCur > 0) {
      const growth = ((cCur - cPrev) / cPrev) * 100;
      const sign = growth >= 0 ? '+' : '';
      growthFormatted = `${sign}${growth.toFixed(1)}%`;
      hasGrowth = true;
    }

    return {
      hasData: cCur > 0,
      hasGrowth,
      cCurrent: cCur,
      cPrev: cPrev,
      growthFormatted,
      donorsCount: curFest?.donorsCount || 0,
      devotees: curFest?.participationEstimate || 0
    };
  }

  private getMetricValue(year: number, key: 'ganpati' | 'navratri' | 'ambedkar'): number {
    const fest = this.getFestivalRecord(year, key);
    if (!fest) return 0;
    const metric = this.selectedMetric();
    if (metric === 'collection') return fest.totalCollection;
    if (metric === 'expenses') return fest.totalExpenses;
    if (metric === 'balance') return fest.balance;
    return fest.participationEstimate || 0;
  }

  private initChart(ctx: CanvasRenderingContext2D) {
    const mandal = this.mandalData;

    const labels = [
      mandal.t('सार्वजनिक गणेशोत्सव', 'Ganeshotsav'),
      mandal.t('नवरात्र उत्सव', 'Navratri Utsav'),
      mandal.t('डॉ. आंबेडकर जयंती', 'Dr. Ambedkar Jayanti')
    ];

    const datasets = this.activeComparisonYears().map(year => ({
      label: mandal.t(`वर्ष ${mandal.toMarathiDigits(year)}`, `Year ${year}`),
      data: [
        this.getMetricValue(year, 'ganpati'),
        this.getMetricValue(year, 'navratri'),
        this.getMetricValue(year, 'ambedkar')
      ],
      backgroundColor: this.getYearColor(year),
      borderRadius: 8,
      borderSkipped: false
    }));

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: 'Mukta, sans-serif', size: 12, weight: 'bold' as any },
              boxWidth: 14,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const metric = this.selectedMetric();
                const val = ctx.raw as number;
                if (metric === 'participation') {
                  return `${ctx.dataset.label}: ${mandal.formatNum(val)} ${mandal.t('भाविक', 'Devotees')}`;
                }
                return `${ctx.dataset.label}: ${mandal.formatNum(val, true)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { family: 'Mukta, sans-serif' },
              callback: (val) => {
                const metric = this.selectedMetric();
                if (metric === 'participation') {
                  return mandal.formatNum(Number(val));
                }
                return mandal.formatNum(Number(val), true);
              }
            },
            grid: {
              color: '#f1f5f9'
            }
          },
          x: {
            ticks: {
              font: { family: 'Mukta, sans-serif', size: 12, weight: 'bold' as any }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;
    const mandal = this.mandalData;

    this.chart.data.labels = [
      mandal.t('सार्वजनिक गणेशोत्सव', 'Ganeshotsav'),
      mandal.t('नवरात्र उत्सव', 'Navratri Utsav'),
      mandal.t('डॉ. आंबेडकर जयंती', 'Dr. Ambedkar Jayanti')
    ];

    this.chart.data.datasets = this.activeComparisonYears().map(year => ({
      label: mandal.t(`वर्ष ${mandal.toMarathiDigits(year)}`, `Year ${year}`),
      data: [
        this.getMetricValue(year, 'ganpati'),
        this.getMetricValue(year, 'navratri'),
        this.getMetricValue(year, 'ambedkar')
      ],
      backgroundColor: this.getYearColor(year),
      borderRadius: 8,
      borderSkipped: false
    }));

    this.chart.update();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}
