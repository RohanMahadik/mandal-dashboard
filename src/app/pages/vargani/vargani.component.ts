import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MandalDataService } from '../../services/mandal-data.service';
import { TransliterationService } from '../../services/transliteration.service';
import { ReceiptModalComponent } from '../../components/receipt-modal/receipt-modal.component';
import { VarganiRecord } from '../../models/mandal.models';

@Component({
  selector: 'app-vargani',
  standalone: true,
  imports: [CommonModule, FormsModule, ReceiptModalComponent],
  template: `
    <div class="space-y-5 pb-8 animate-fade-in">
      
      <!-- Page Header & Stats Banner -->
      <div class="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute -right-6 -bottom-8 opacity-10 text-9xl select-none font-bold">॥</div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <span>●</span>
              <span>{{ mandalData.t('वर्गणी व्यवस्थापन पोर्टल', 'Donation Management Portal') }}</span>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
              {{ mandalData.t('उत्सव वर्गणी व देणगी तपशील', 'Festival Donations & Offerings Details') }}
            </h1>
            <p class="text-slate-300 text-xs md:text-sm mt-1">
              {{ mandalData.isEnglish() ? ('Member donation list for ' + mandalData.translateFestival(mandalData.selectedFestival()) + ' (' + mandalData.selectedYear() + ')') : (mandalData.selectedFestival() + ' (' + mandalData.toMarathiDigits(mandalData.selectedYear()) + ') मधील सर्व सभासदांची वर्गणी यादी') }}
            </p>
          </div>

          <!-- Quick Stats Pill -->
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <div class="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 flex-1 sm:flex-none min-w-[120px]">
              <div class="text-[10.5px] sm:text-[11px] text-emerald-200">{{ mandalData.t('एकूण गोळा वर्गणी', 'Total Donations Collected') }}</div>
              <div class="text-lg sm:text-xl font-black text-white">{{ mandalData.formatNum(mandalData.kpi().totalVargani, true) }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 flex-1 sm:flex-none min-w-[120px]">
              <div class="text-[10.5px] sm:text-[11px] text-emerald-200">{{ mandalData.t('पावती स्थिती', 'Receipt Status') }}</div>
              <div class="text-lg sm:text-xl font-black text-white">{{ mandalData.formatNum(mandalData.kpi().receiptsIssued) }} / {{ mandalData.formatNum(mandalData.kpi().totalReceipts) }}</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Action Bar & Advanced Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        
        <!-- Controls Row -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <!-- Bilingual Search Bar -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event); currentPage.set(1)"
              [placeholder]="mandalData.t('मराठी किंवा इंग्रजीत शोधा... (उदा. Rohan, Patil, शिव)', 'Search in English or Marathi... (e.g. Rohan, Patil, Shiv)')"
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-devanagari transition"
            />
            @if (searchQuery()) {
              <button (click)="searchQuery.set(''); currentPage.set(1)" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            }
          </div>
        </div>

        <!-- Filter Dropdowns Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 border-t border-slate-100 text-xs">
          
          <div>
            <label class="block text-slate-500 font-bold mb-1 font-devanagari">{{ mandalData.t('बिल्डिंग', 'Building') }}</label>
            <select [ngModel]="buildingFilter()" (ngModelChange)="buildingFilter.set($event); currentPage.set(1)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500">
              @for (b of mandalData.buildingsList; track b) {
                <option [value]="b">{{ mandalData.translateBuilding(b) }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-slate-500 font-bold mb-1 font-devanagari">{{ mandalData.t('पावती स्थिती', 'Receipt Status') }}</label>
            <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event); currentPage.set(1)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500">
              @for (s of mandalData.receiptStatusList; track s) {
                <option [value]="s">{{ mandalData.translateStatus(s) }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-slate-500 font-bold mb-1 font-devanagari">{{ mandalData.t('भरणा प्रकार', 'Payment Mode') }}</label>
            <select [ngModel]="paymentFilter()" (ngModelChange)="paymentFilter.set($event); currentPage.set(1)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500">
              <option value="सर्व">{{ mandalData.t('सर्व पद्धती', 'All Modes') }}</option>
              <option value="UPI / GPay">UPI / GPay</option>
              <option value="कॅश">{{ mandalData.t('कॅश (रोख)', 'Cash') }}</option>
              <option value="चेक">{{ mandalData.t('चेक', 'Cheque') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-500 font-bold mb-1 font-devanagari">{{ mandalData.t('प्रति पान नोंदी', 'Per Page') }}</label>
            <select [ngModel]="pageSize()" (ngModelChange)="pageSize.set(+$event); currentPage.set(1)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500">
              <option [value]="15">{{ mandalData.t('१५ नोंदी', '15 Records') }}</option>
              <option [value]="25">{{ mandalData.t('२५ नोंदी', '25 Records') }}</option>
              <option [value]="50">{{ mandalData.t('५० नोंदी', '50 Records') }}</option>
              <option [value]="100">{{ mandalData.t('सर्व नोंदी', 'All Records') }}</option>
            </select>
          </div>
        </div>

      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        <div class="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div class="text-xs font-bold text-slate-700 font-devanagari">
            {{ mandalData.t('एकूण नोंदी', 'Total Records') }}: <span class="text-emerald-700 font-extrabold">{{ mandalData.formatNum(filteredList().length) }}</span>
          </div>
          <div class="text-xs text-slate-500">
            {{ mandalData.isEnglish() ? ('Page ' + currentPage() + ' of ' + totalPages()) : ('पान ' + mandalData.toMarathiDigits(currentPage()) + ' पैकी ' + mandalData.toMarathiDigits(totalPages())) }}
          </div>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[700px]">
            <thead>
              <tr class="bg-[#f1f5f9] text-slate-700 font-bold font-devanagari border-b border-slate-200">
                <th class="py-3 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                <th class="py-3 px-4">{{ mandalData.t('नाव (सभासद)', 'Member Name') }}</th>
                <th class="py-3 px-4">{{ mandalData.t('बिल्डिंग / विंग', 'Building / Wing') }}</th>
                <th class="py-3 px-4 text-right">
                  <span class="inline-flex items-center gap-1 justify-end">
                    {{ mandalData.t('रक्कम', 'Amount') }}
                    <span class="text-emerald-700 font-bold" [title]="mandalData.t('सर्वाधिक ते किमान रक्कम क्रमाने', 'Highest to lowest amount')">↓</span>
                  </span>
                </th>
                <th class="py-3 px-4 text-center">{{ mandalData.t('पावती क्र.', 'Receipt No.') }}</th>
                <th class="py-3 px-4 text-center">{{ mandalData.t('भरणा पद्धत', 'Payment Mode') }}</th>
                <th class="py-3 px-4 text-center">{{ mandalData.t('तारीख', 'Date') }}</th>
                <th class="py-3 px-4 text-center">{{ mandalData.t('पावती', 'Status') }}</th>
                <th class="py-3 px-4 text-center">{{ mandalData.t('कृती', 'Action') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (row of paginatedList(); track row.id; let idx = $index) {
                <tr class="hover:bg-amber-50/40 transition">
                  <td class="py-3 px-3 text-center text-slate-500 font-medium">{{ mandalData.formatNum((currentPage() - 1) * pageSize() + idx + 1) }}</td>
                  <td class="py-3 px-4 font-semibold text-slate-900 font-devanagari">
                    @if (mandalData.isEnglish()) {
                      <div class="text-sm font-bold">{{ row.nameEn }}</div>
                      <div class="text-[11px] text-slate-400 font-normal font-devanagari">{{ row.nameMr }}</div>
                    } @else {
                      <div class="text-sm font-bold">{{ row.nameMr }}</div>
                      <div class="text-[11px] text-slate-400 font-normal font-sans">{{ row.nameEn }}</div>
                    }
                  </td>
                  <td class="py-3 px-4 text-slate-700 font-devanagari font-medium">
                    <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                      {{ mandalData.translateBuilding(row.building) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right font-black text-sm text-slate-900">
                    {{ mandalData.formatNum(row.amount, true) }}
                  </td>
                  <td class="py-3 px-4 text-center text-slate-600 font-mono font-bold">
                    {{ row.receiptNo ? mandalData.formatNum(row.receiptNo) : '—' }}
                  </td>
                  <td class="py-3 px-4 text-center text-slate-600 font-devanagari">
                    {{ mandalData.translatePaymentMode(row.paymentMode || 'कॅश') }}
                  </td>
                  <td class="py-3 px-4 text-center text-slate-500 font-sans">
                    {{ mandalData.formatNum(row.date) }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    @if (row.status === 'दिलेली') {
                      <span class="badge-green">{{ mandalData.translateStatus('दिलेली') }}</span>
                    } @else {
                      <span class="badge-red">{{ mandalData.translateStatus('बाकी') }}</span>
                    }
                  </td>
                  <td class="py-3 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button
                        (click)="viewReceipt(row)"
                        [title]="mandalData.t('पावती पहा / प्रिंट करा', 'View / Print Receipt')"
                        class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-md transition text-[11px] flex items-center gap-1"
                      >
                        <span>📄</span>
                        <span>{{ mandalData.t('पावती', 'Receipt') }}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (paginatedList().length === 0) {
                <tr>
                  <td colspan="9" class="py-12 text-center text-slate-400 font-devanagari text-sm">
                    {{ mandalData.t('कोणतीही वर्गणी नोंद आढळली नाही. कृपया शोध शब्द किंवा फिल्टर्स तपासा.', 'No donation records found. Please check search or filters.') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            [disabled]="currentPage() <= 1"
            (click)="currentPage.set(currentPage() - 1)"
            class="px-3.5 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {{ mandalData.t('← मागील (Prev)', '← Previous') }}
          </button>
          <div class="text-slate-600 font-devanagari">
            {{ mandalData.isEnglish() ? ('Page ' + currentPage() + ' / ' + totalPages()) : ('पान ' + mandalData.toMarathiDigits(currentPage()) + ' / ' + mandalData.toMarathiDigits(totalPages())) }}
          </div>
          <button
            [disabled]="currentPage() >= totalPages()"
            (click)="currentPage.set(currentPage() + 1)"
            class="px-3.5 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {{ mandalData.t('पुढील (Next) →', 'Next →') }}
          </button>
        </div>

      </div>

    </div>

    <!-- Modals -->
    @if (selectedReceipt()) {
      <app-receipt-modal
        [record]="selectedReceipt()"
        (close)="selectedReceipt.set(null)"
      />
    }
  `
})
export class VarganiComponent {
  readonly mandalData = inject(MandalDataService);
  private transliteration = inject(TransliterationService);

  readonly searchQuery = signal<string>('');
  readonly buildingFilter = signal<string>('सर्व');
  readonly statusFilter = signal<string>('सर्व');
  readonly paymentFilter = signal<string>('सर्व');
  readonly pageSize = signal<number>(15);

  readonly currentPage = signal<number>(1);
  readonly selectedReceipt = signal<VarganiRecord | null>(null);

  // Filtered List computation (reacts to every keystroke and filter change)
  readonly filteredList = computed(() => {
    let list = this.mandalData.currentVargani();
    const query = this.searchQuery().trim();
    const bFilter = this.buildingFilter();
    const sFilter = this.statusFilter();
    const pFilter = this.paymentFilter();

    if (bFilter !== 'सर्व') {
      list = list.filter(item => item.building === bFilter);
    }

    if (sFilter !== 'सर्व') {
      list = list.filter(item => item.status === sFilter);
    }

    if (pFilter !== 'सर्व') {
      list = list.filter(item => item.paymentMode === pFilter);
    }

    if (query) {
      list = list.filter(item => this.transliteration.matches(query, item));
    }

    // Always show highest amount to lowest
    return [...list].sort((a, b) => b.amount - a.amount || (a.srNo || 0) - (b.srNo || 0));
  });

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredList().length / this.pageSize()));
  });

  readonly paginatedList = computed(() => {
    const size = this.pageSize();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * size;
    return this.filteredList().slice(start, start + size);
  });

  viewReceipt(record: VarganiRecord) {
    this.selectedReceipt.set(record);
  }
}
