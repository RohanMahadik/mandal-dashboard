import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';

@Component({
  selector: 'app-jama-kharch',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-5 pb-8 animate-fade-in">

      <!-- Top Action Bar (Hidden in Print) -->
      <div class="no-print bg-white rounded-xl shadow-sm border border-slate-200/80 p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <!-- Back to Dashboard Button -->
          <a
            routerLink="/"
            class="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-300 text-xs font-bold font-devanagari transition shadow-2xs active:scale-95 cursor-pointer group"
            title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
          >
            <svg class="w-3.5 h-3.5 text-amber-600 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
          </a>

          <h1 class="text-lg sm:text-xl font-bold font-devanagari text-slate-900">
            {{ mandalData.t('जमा - खर्च अधिकृत ताळेबंद पत्रक', 'Official Income - Expense Balance Sheet') }}
          </h1>
          <p class="text-xs text-slate-500 font-devanagari">
            {{ activeSheetTitle() }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <!-- View Mode Toggle -->
          <div class="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs font-devanagari">
            <button
              (click)="viewMode.set('audited')"
              class="px-2.5 py-1.5 rounded-md font-bold transition cursor-pointer"
              [ngClass]="viewMode() === 'audited' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              📊 {{ mandalData.t('अधिकृत ताळेबंद', 'Audited Sheet') }}
            </button>
            <button
              (click)="viewMode.set('vouchers')"
              class="px-2.5 py-1.5 rounded-md font-bold transition cursor-pointer"
              [ngClass]="viewMode() === 'vouchers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              📑 {{ mandalData.t('तपशीलवार व्हाउचर्स', 'Itemized Vouchers') }}
            </button>
          </div>

          <button
            (click)="printSheet()"
            class="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            <span>{{ mandalData.t('प्रिंट करा', 'Print') }}</span>
          </button>
          <button
            (click)="exportExcel()"
            class="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>{{ mandalData.t('Excel डाउनलोड', 'Download Excel') }}</span>
          </button>
        </div>
      </div>

      <!-- Festival Quick Selector Bar (Hidden in Print) -->
      <div class="no-print bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-xl p-3 border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-amber-950 font-devanagari">🚩 {{ mandalData.t('उत्सव निवडा:', 'Select Festival:') }}</span>
          <span class="text-xs text-amber-800 font-devanagari hidden sm:inline">
            {{ mandalData.t('(गणेशोत्सव किंवा नवरात्रोत्सवाचा हिशोब पहा)', '(View Ganeshotsav or Navratri accounts)') }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            (click)="selectFestival('सार्वजनिक गणेशोत्सव')"
            class="px-3.5 py-1.5 rounded-xl font-bold font-devanagari text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            [ngClass]="isGaneshActive() ? 'bg-amber-600 text-white ring-2 ring-amber-400' : 'bg-white text-slate-700 hover:bg-amber-100 border border-slate-300'"
          >
            <span>🪔</span>
            <span>{{ mandalData.t('सार्वजनिक गणेशोत्सव', 'Ganesh Utsav') }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" [ngClass]="isGaneshActive() ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600'">
              {{ mandalData.formatNum(ganeshTotalExp(), true) }}
            </span>
          </button>

          <button
            (click)="selectFestival('नवरात्र उत्सव')"
            class="px-3.5 py-1.5 rounded-xl font-bold font-devanagari text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            [ngClass]="isNavratriActive() ? 'bg-rose-700 text-white ring-2 ring-rose-400' : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-300'"
          >
            <span>🔱</span>
            <span>{{ mandalData.t('नवरात्र उत्सव', 'Navratri Utsav') }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" [ngClass]="isNavratriActive() ? 'bg-rose-900 text-white' : 'bg-slate-100 text-slate-600'">
              {{ mandalData.formatNum(navratriTotalExp(), true) }}
            </span>
          </button>

          <button
            (click)="selectFestival('संयुक्त (गणेशोत्सव व नवरात्र)')"
            class="px-3 py-1.5 rounded-xl font-bold font-devanagari text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            [ngClass]="isJointActive() ? 'bg-indigo-700 text-white ring-2 ring-indigo-400' : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300'"
          >
            <span>⚖️</span>
            <span>{{ mandalData.t('संयुक्त ताळेबंद (दोन्ही)', 'Joint Balance Sheet') }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" [ngClass]="isJointActive() ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-600'">
              {{ mandalData.formatNum(jointTotalExp(), true) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Printable Official Audit Statement -->
      <div class="printable-area bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">

        <!-- Document Letterhead -->
        <div class="text-center border-b-2 border-slate-900 pb-5 relative">
          <div class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            {{ mandalData.t('॥ श्री गणेशाय नमः ॥ मंगलमूर्ती मोरया ॥', '॥ Shree Ganeshay Namah ॥ Mangalmurti Morya ॥') }}
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-red-800 font-devanagari">
            {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ', 'Shree Ashtavinayak Mitra Mandal') }}
          </h2>
          <div class="text-sm font-semibold text-slate-800 font-devanagari mt-0.5">
            {{ mandalData.t('शिव स्फूर्ती व आदर्श नगर, जोगेश्वरी (पश्चिम), मुंबई - ४०० १०२', 'Shiv Sphurti & Adarsh Nagar, Jogeshwari (West), Mumbai - 400 102') }}
          </div>
          <div class="text-xs text-slate-600 mt-1">
            {{ mandalData.t('नोंदणी क्र.: मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० (E-12345/Mumbai)', 'Reg. No.: Bombay Public Trusts Act 1950 (E-12345/Mumbai)') }}
          </div>

          <div class="inline-block mt-3 px-4 py-1.5 bg-amber-50 text-amber-900 border-2 border-amber-300 rounded-full font-bold text-xs sm:text-sm font-devanagari shadow-xs">
            {{ activeSheetTitle() }}
          </div>
        </div>

        <!-- KPI Balance Summary Strip -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div class="text-xs font-bold text-emerald-800 font-devanagari">{{ mandalData.t('एकूण जमा (Total Receipts)', 'Total Receipts (Income)') }}</div>
            <div class="text-2xl font-black text-emerald-700">{{ mandalData.formatNum(sheetTotalIncome(), true) }}</div>
          </div>
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <div class="text-xs font-bold text-rose-800 font-devanagari">{{ mandalData.t('एकूण खर्च (Total Payments)', 'Total Payments (Expenses)') }}</div>
            <div class="text-2xl font-black text-rose-700">{{ mandalData.formatNum(sheetTotalExpenses(), true) }}</div>
          </div>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div class="text-xs font-bold text-blue-800 font-devanagari">
              {{ surplusTitle() }}
            </div>
            <div class="text-2xl font-black text-blue-700">{{ mandalData.formatNum(sheetSurplus(), true) }}</div>
          </div>
        </div>

        <!-- ================= AUDITED VIEW MODE (FROM DETAIL SHEET) ================= -->
        @if (viewMode() === 'audited') {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            <!-- LEFT: जमा बाजू (Receipts / Income) -->
            <div class="border-2 border-emerald-600/60 rounded-xl overflow-hidden shadow-xs bg-white">
              <div class="bg-emerald-700 text-white font-bold py-2.5 px-3 sm:px-4 flex justify-between items-center text-xs sm:text-sm font-devanagari">
                <span>{{ mandalData.t('जमा बाजू (Income / Receipts)', 'Receipts / Income (Debit)') }}</span>
                <span class="shrink-0">{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</span>
              </div>

              <div class="overflow-x-auto w-full">
                <table class="w-full text-xs">
                  <tbody class="divide-y divide-slate-200">
                    @for (item of detailedIncome(); track item.name) {
                      <tr class="hover:bg-emerald-50/40 transition-colors">
                        <td class="py-2.5 px-3 sm:px-4 text-slate-800 font-devanagari whitespace-normal">
                          <span class="font-bold text-slate-900">{{ item.name }}</span>
                        </td>
                        <td class="py-2.5 px-3 sm:px-4 text-right font-bold text-emerald-800 whitespace-nowrap shrink-0">
                          {{ mandalData.formatNum(item.amount, true) }}
                        </td>
                      </tr>
                    }
                    <!-- Empty fill rows for visual balance if needed -->
                    @if (detailedIncome().length < detailedExpenses().length) {
                      @for (i of emptyIncomeRows(); track i) {
                        <tr class="hidden sm:table-row bg-slate-50/20"><td class="py-3 px-3 sm:px-4 text-transparent select-none">-</td><td class="py-3 text-transparent select-none">-</td></tr>
                      }
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-emerald-100 font-black text-emerald-900 border-t-2 border-emerald-600 text-xs sm:text-sm">
                      <td class="py-3 px-3 sm:px-4 font-devanagari">{{ mandalData.t('एकूण जमा (Total Income)', 'Total Income') }}</td>
                      <td class="py-3 px-3 sm:px-4 text-right whitespace-nowrap font-black">{{ mandalData.formatNum(sheetTotalIncome(), true) }}</td>
                    </tr>
                    @if (sheetTotalBalance() > sheetTotalIncome()) {
                      <tr class="bg-emerald-50 font-black text-emerald-950 border-t border-emerald-400 text-xs sm:text-sm">
                        <td class="py-2.5 px-3 sm:px-4 font-devanagari">{{ mandalData.t('एकूण ताळेबंद (Total Balance)', 'Total Balance') }}</td>
                        <td class="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap font-black">{{ mandalData.formatNum(sheetTotalBalance(), true) }}</td>
                      </tr>
                    }
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- RIGHT: खर्च बाजू (Payments / Expenses) -->
            <div class="border-2 border-rose-600/60 rounded-xl overflow-hidden shadow-xs bg-white">
              <div class="bg-rose-700 text-white font-bold py-2.5 px-3 sm:px-4 flex justify-between items-center text-xs sm:text-sm font-devanagari">
                <span>{{ mandalData.t('खर्च बाजू (Expenditure)', 'Payments / Expenses (Credit)') }}</span>
                <span class="shrink-0">{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</span>
              </div>

              <div class="overflow-x-auto w-full">
                <table class="w-full text-xs">
                  <tbody class="divide-y divide-slate-200">
                    @for (item of detailedExpenses(); track item.name; let idx = $index) {
                      <tr class="hover:bg-rose-50/30 transition-colors">
                        <td class="py-2 px-3 sm:px-4 text-slate-800 font-devanagari whitespace-normal">
                          <span class="text-slate-400 mr-1.5 font-mono text-[11px]">{{ idx + 1 }}.</span>
                          <span class="font-bold text-slate-900">{{ item.name }}</span>
                        </td>
                        <td class="py-2 px-3 sm:px-4 text-right font-bold text-rose-800 whitespace-nowrap shrink-0">
                          {{ mandalData.formatNum(item.amount, true) }}
                        </td>
                      </tr>
                    }

                    <!-- Subtotal Row -->
                    <tr class="bg-rose-50/80 font-bold text-rose-950 border-t-2 border-rose-300">
                      <td class="py-2.5 px-3 sm:px-4 font-devanagari">
                        {{ mandalData.t('एकूण उत्सव खर्च (Total Expenditure)', 'Total Expenditure') }}
                      </td>
                      <td class="py-2.5 px-3 sm:px-4 text-right font-black text-rose-800 whitespace-nowrap shrink-0">
                        {{ mandalData.formatNum(sheetTotalExpenses(), true) }}
                      </td>
                    </tr>

                    <!-- Surplus Breakdown (Navratri Cash/Bank details) -->
                    @if (isNavratriActive() && (cashBalance() > 0 || bankBalance() > 0)) {
                      <tr class="bg-blue-50/50 text-blue-900 text-[11px] border-t border-blue-200">
                        <td class="py-1.5 px-4 font-devanagari pl-6">
                          • {{ mandalData.t('रोख शिल्लक (Balance in Cash)', 'Cash Balance') }}
                        </td>
                        <td class="py-1.5 px-4 text-right font-bold font-mono">
                          {{ mandalData.formatNum(cashBalance(), true) }}
                        </td>
                      </tr>
                      <tr class="bg-blue-50/50 text-blue-900 text-[11px]">
                        <td class="py-1.5 px-4 font-devanagari pl-6">
                          • {{ mandalData.t('बँक शिल्लक (Bank Balance)', 'Bank Balance') }}
                        </td>
                        <td class="py-1.5 px-4 text-right font-bold font-mono">
                          {{ mandalData.formatNum(bankBalance(), true) }}
                        </td>
                      </tr>
                    }

                    <!-- Surplus Row to Balance the Accounts -->
                    <tr class="bg-blue-100/80 font-bold text-blue-950 border-t border-blue-300">
                      <td class="py-2.5 px-3 sm:px-4 font-devanagari whitespace-normal">
                        ★ {{ surplusTitle() }}
                      </td>
                      <td class="py-2.5 px-3 sm:px-4 text-right font-black text-blue-800 whitespace-nowrap shrink-0">
                        {{ mandalData.formatNum(sheetSurplus(), true) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-rose-100 font-black text-rose-950 border-t-2 border-rose-600 text-xs sm:text-sm">
                      <td class="py-3 px-3 sm:px-4 font-devanagari">{{ mandalData.t('एकूण ताळेबंद (Total Balance)', 'Equated Total Balance') }}</td>
                      <td class="py-3 px-3 sm:px-4 text-right whitespace-nowrap font-black">{{ mandalData.formatNum(sheetTotalBalance(), true) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        } @else {
          <!-- ================= VOUCHERS / BUILDING VIEW MODE ================= -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            <!-- LEFT: वर्गणी (By Building / Source) -->
            <div class="border-2 border-emerald-600/60 rounded-xl overflow-hidden shadow-xs bg-white">
              <div class="bg-emerald-700 text-white font-bold py-2.5 px-3 sm:px-4 flex justify-between items-center text-xs sm:text-sm font-devanagari">
                <span>{{ mandalData.t('इमारतीनुसार वर्गणी संकलन', 'Donations by Building / Source') }}</span>
                <span class="shrink-0">{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</span>
              </div>

              <div class="overflow-x-auto w-full">
                <table class="w-full text-xs">
                  <tbody class="divide-y divide-slate-200">
                    @for (item of mandalData.buildingDistribution(); track item.building) {
                      <tr class="hover:bg-emerald-50/40 transition-colors">
                        <td class="py-2.5 px-3 sm:px-4 text-slate-800 font-devanagari whitespace-normal">
                          {{ mandalData.t('वर्गणी', 'Donations') }} - <b>{{ mandalData.translateBuilding(item.building) }}</b>
                          @if (item.count) {
                            <span class="text-[10px] text-slate-500 ml-1">({{ item.count }} {{ mandalData.t('नोंदी', 'entries') }})</span>
                          }
                        </td>
                        <td class="py-2.5 px-3 sm:px-4 text-right font-bold text-slate-900 whitespace-nowrap shrink-0">
                          {{ mandalData.formatNum(item.amount, true) }}
                        </td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-emerald-100 font-black text-emerald-900 border-t-2 border-emerald-600 text-xs sm:text-sm">
                      <td class="py-3 px-3 sm:px-4 font-devanagari">{{ mandalData.t('एकूण वर्गणी जमा', 'Total Donations') }}</td>
                      <td class="py-3 px-3 sm:px-4 text-right whitespace-nowrap font-black">{{ mandalData.formatNum(varganiVoucherTotal(), true) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- RIGHT: सर्व अधिकृत व्हाउचर्स नोंदवही -->
            <div class="border-2 border-rose-600/60 rounded-xl overflow-hidden shadow-xs bg-white">
              <div class="bg-rose-700 text-white font-bold py-2.5 px-3 sm:px-4 flex justify-between items-center text-xs sm:text-sm font-devanagari">
                <span>{{ mandalData.t('सर्व खर्च व्हाउचर्स नोंदवही', 'All Expense Vouchers Register') }} ({{ mandalData.currentKharch().length }})</span>
                <span class="shrink-0">{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</span>
              </div>

              <div class="overflow-x-auto w-full max-h-[500px] overflow-y-auto">
                <table class="w-full text-xs">
                  <tbody class="divide-y divide-slate-200">
                    @for (item of mandalData.currentKharch(); track item.id; let idx = $index) {
                      <tr class="hover:bg-rose-50/30 transition-colors">
                        <td class="py-2 px-3 sm:px-4 text-slate-800 font-devanagari whitespace-normal">
                          <span class="text-slate-400 mr-1.5 font-mono text-[10px]">#{{ item.srNo || (idx + 1) }}</span>
                          <span class="font-bold text-slate-900">{{ mandalData.isEnglish() ? (item.nameEn || item.nameMr) : item.nameMr }}</span>
                          @if (item.category) {
                            <span class="text-[10px] text-slate-500 block">({{ mandalData.translateCategory(item.category) }})</span>
                          }
                        </td>
                        <td class="py-2 px-3 sm:px-4 text-right font-bold text-slate-900 whitespace-nowrap shrink-0">
                          {{ mandalData.formatNum(item.amount, true) }}
                        </td>
                      </tr>
                    }
                  </tbody>
                  <tfoot class="sticky bottom-0 z-10">
                    <tr class="bg-rose-100 font-black text-rose-900 border-t-2 border-rose-600 text-xs sm:text-sm shadow-xs">
                      <td class="py-3 px-3 sm:px-4 font-devanagari">{{ mandalData.t('एकूण खर्च व्हाउचर्स रक्कम', 'Total Vouchers Amount') }}</td>
                      <td class="py-3 px-3 sm:px-4 text-right whitespace-nowrap font-black">{{ mandalData.formatNum(kharchVoucherTotal(), true) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        }

        <!-- Official Auditor Certification Note -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs font-devanagari text-slate-700 leading-relaxed">
          <div class="font-bold text-slate-900 text-sm mb-1">{{ mandalData.t('हिशोब तपासणीस प्रमाणपत्र (Auditor Certificate):', 'Auditor Certificate:') }}</div>
          {{ mandalData.isEnglish() ?
            ('We have thoroughly audited and examined all the books of accounts, bank passbook, receipts, and payment vouchers of Shree Ashtavinayak Mitra Mandal, Jogeshwari (West) for ' + mandalData.translateFestival(mandalData.selectedFestival()) + ' (' + mandalData.selectedYear() + '). All transactions have been executed with proper authorization and this balance sheet presents a true and fair view of the financial status.')
            :
            ('आम्ही श्री अष्टविनायक मित्र मंडळ, जोगेश्वरी (पश्चिम) च्या वर्ष ' + mandalData.toMarathiDigits(mandalData.selectedYear()) + ' मधील ' + mandalData.selectedFestival() + ' च्या जमा-खर्चाच्या सर्व नोंदी, बँक पासबुक, पावती पुस्तके आणि देयक व्हाउचर्सची सखोल तपासणी केली आहे. सर्व व्यवहार नियमांनुसार व अधिकृत मान्यतेने झाले असून हा ताळेबंद संस्थेच्या आर्थिक स्थितीचे अचूक आणि न्याय्य दर्शन घडवतो.')
          }}
        </div>

        <!-- 3 Signatures Block -->
        <div class="pt-8 border-t-2 border-slate-400 grid grid-cols-3 gap-6 text-center text-xs font-devanagari">
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">B. Yadav</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('अध्यक्ष', 'President') }}</div>
          </div>
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">S. Painla</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.t('श्री. शैलेश पैनला', 'Shri Shailesh Painla') }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('कार्यवाह (चिटणीस)', 'Secretary') }}</div>
          </div>
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">J. Shinde</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.t('श्री. जगदीश शिंदे', 'Shri Jagdish Shinde') }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('खजिनदार', 'Treasurer') }}</div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class JamaKharchComponent {
  readonly mandalData = inject(MandalDataService);
  readonly viewMode = signal<'audited' | 'vouchers'>('audited');

  readonly activeSheet = computed(() => this.mandalData.currentDetailedSheet());

  readonly isGaneshActive = computed(() => this.mandalData.selectedFestival().includes('गणेश'));
  readonly isNavratriActive = computed(() => this.mandalData.selectedFestival().includes('नवरात्र'));
  readonly isJointActive = computed(() => this.mandalData.selectedFestival().includes('संयुक्त') || this.mandalData.selectedFestival().includes('Joint'));

  readonly ganeshTotalExp = computed(() => this.mandalData.detailedBalanceSheetData()?.ganesh.totalExpenses || 449189);
  readonly navratriTotalExp = computed(() => this.mandalData.detailedBalanceSheetData()?.navratri.totalExpenses || 354457);
  readonly jointTotalExp = computed(() => this.mandalData.detailedBalanceSheetData()?.joint.totalExpenses || 803646);

  readonly activeSheetTitle = computed(() => {
    const s = this.activeSheet();
    return s ? s.title : 'वार्षिक जमा-खर्च ताळेबंद पत्रक';
  });

  readonly detailedIncome = computed(() => this.activeSheet()?.income || []);
  readonly detailedExpenses = computed(() => this.activeSheet()?.expenses || []);

  readonly emptyIncomeRows = computed(() => {
    const diff = this.detailedExpenses().length - this.detailedIncome().length;
    return diff > 0 ? Array.from({ length: diff }, (_, i) => i) : [];
  });

  readonly sheetTotalIncome = computed(() => {
    const s = this.activeSheet();
    return s && s.totalIncome > 0 ? s.totalIncome : this.mandalData.kpi().totalVargani;
  });

  readonly sheetTotalExpenses = computed(() => {
    const s = this.activeSheet();
    return s && s.totalExpenses > 0 ? s.totalExpenses : this.mandalData.kpi().totalKharch;
  });

  readonly sheetSurplus = computed(() => {
    const s = this.activeSheet();
    if (s && s.surplus !== undefined && s.surplus !== 0) return s.surplus;
    return this.mandalData.kpi().balanceAmount;
  });

  readonly surplusTitle = computed(() => {
    const s = this.activeSheet();
    if (s?.surplusLabelMr) return s.surplusLabelMr;
    if (this.isGaneshActive()) return this.mandalData.t('नवरात्रीसाठी शिल्लक बाकी (Surplus for Navratri)', 'Surplus for Navratri');
    if (this.isNavratriActive()) return this.mandalData.t('पुढील वर्षासाठी शिल्लक (Surplus Carried Forward)', 'Surplus Carried Forward');
    return this.mandalData.t('शिल्लक रक्कम (Total Surplus)', 'Net Surplus');
  });

  readonly sheetTotalBalance = computed(() => {
    const s = this.activeSheet();
    if (s && s.totalBalance > 0) return s.totalBalance;
    return Math.max(this.sheetTotalIncome(), this.sheetTotalExpenses() + this.sheetSurplus());
  });

  readonly cashBalance = computed(() => this.activeSheet()?.cashBalance || 0);
  readonly bankBalance = computed(() => this.activeSheet()?.bankBalance || 0);

  readonly varganiVoucherTotal = computed(() => {
    return this.mandalData.currentVargani().reduce((s, i) => s + i.amount, 0);
  });

  readonly kharchVoucherTotal = computed(() => {
    return this.mandalData.currentKharch().reduce((s, i) => s + i.amount, 0);
  });

  selectFestival(festival: string) {
    this.mandalData.setFestival(festival);
  }

  printSheet() {
    window.print();
  }

  exportExcel() {
    this.mandalData.exportToExcel('balanceSheet');
  }
}
