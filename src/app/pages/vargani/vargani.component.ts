import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';
import { TransliterationService } from '../../services/transliteration.service';
import { ReceiptModalComponent } from '../../components/receipt-modal/receipt-modal.component';
import { VarganiRecord } from '../../models/mandal.models';

export type VarganiSortColumn = 'srNo' | 'name' | 'source' | 'amount' | 'receiptNo' | 'paymentMode' | 'date' | 'status';
export type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-vargani',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReceiptModalComponent],
  template: `
    <div class="space-y-5 pb-8 animate-fade-in">
      
      <!-- Page Header & Stats Banner -->
      <div class="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute -right-6 -bottom-8 opacity-10 text-9xl select-none font-bold">॥</div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <!-- Back to Dashboard Button -->
            <a
              routerLink="/"
              class="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-emerald-100 hover:text-white border border-white/20 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
              title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
            >
              <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
            </a>

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
              [placeholder]="mandalData.t('मराठी किंवा इंग्रजीत शोधा... (उदा. Ashok, Gawda, शिव)', 'Search in English or Marathi... (e.g. Ashok, Gawda, Shiv)')"
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
            <label class="block text-slate-500 font-bold mb-1 font-devanagari">{{ mandalData.t('स्त्रोत (Source)', 'Source') }}</label>
            <select [ngModel]="buildingFilter()" (ngModelChange)="buildingFilter.set($event); currentPage.set(1)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500">
              @for (b of mandalData.availableSources(); track b) {
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
        
        <div class="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div class="font-bold text-slate-700 font-devanagari">
              {{ mandalData.t('एकूण नोंदी', 'Total Records') }}: <span class="text-emerald-700 font-extrabold">{{ mandalData.formatNum(filteredList().length) }}</span>
            </div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-devanagari">
              <span class="text-emerald-600 font-bold">⇅</span>
              <span>{{ mandalData.t('क्रमवारी', 'Sort') }}: <b>{{ getSortLabel() }}</b></span>
            </div>
          </div>
          <div class="text-xs text-slate-500">
            {{ mandalData.isEnglish() ? ('Page ' + currentPage() + ' of ' + totalPages()) : ('पान ' + mandalData.toMarathiDigits(currentPage()) + ' पैकी ' + mandalData.toMarathiDigits(totalPages())) }}
          </div>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[700px]">
            <thead>
              <tr class="bg-[#f1f5f9] text-slate-700 font-bold font-devanagari border-b border-slate-200">
                <!-- 1. अ. क्र. -->
                <th
                  (click)="toggleSort('srNo')"
                  class="py-3 px-3 text-center w-14 cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'srNo'"
                  [class.text-emerald-950]="sortColumn() === 'srNo'"
                  [title]="mandalData.t('अ. क्र. नुसार क्रमवारी लावा', 'Sort by Sr. No.')"
                >
                  <div class="inline-flex items-center justify-center gap-1">
                    <span>{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'srNo'" [class.font-black]="sortColumn() === 'srNo'" [class.opacity-40]="sortColumn() !== 'srNo'">
                      @if (sortColumn() === 'srNo') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 2. नाव (सभासद) -->
                <th
                  (click)="toggleSort('name')"
                  class="py-3 px-4 cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'name'"
                  [class.text-emerald-950]="sortColumn() === 'name'"
                  [title]="mandalData.t('नावानुसार क्रमवारी लावा', 'Sort by Member Name')"
                >
                  <div class="inline-flex items-center gap-1.5">
                    <span>{{ mandalData.t('नाव (सभासद)', 'Member Name') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'name'" [class.font-black]="sortColumn() === 'name'" [class.opacity-40]="sortColumn() !== 'name'">
                      @if (sortColumn() === 'name') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 3. स्त्रोत (Source) -->
                <th
                  (click)="toggleSort('source')"
                  class="py-3 px-4 cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'source'"
                  [class.text-emerald-950]="sortColumn() === 'source'"
                  [title]="mandalData.t('स्त्रोतानुसार क्रमवारी लावा', 'Sort by Source')"
                >
                  <div class="inline-flex items-center gap-1.5">
                    <span>{{ mandalData.t('स्त्रोत (Source)', 'Source') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'source'" [class.font-black]="sortColumn() === 'source'" [class.opacity-40]="sortColumn() !== 'source'">
                      @if (sortColumn() === 'source') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 4. रक्कम (Amount) -->
                <th
                  (click)="toggleSort('amount')"
                  class="py-3 px-4 text-right cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'amount'"
                  [class.text-emerald-950]="sortColumn() === 'amount'"
                  [title]="mandalData.t('रक्कमेनुसार क्रमवारी लावा', 'Sort by Amount')"
                >
                  <div class="inline-flex items-center gap-1.5 justify-end">
                    <span>{{ mandalData.t('रक्कम', 'Amount') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'amount'" [class.font-black]="sortColumn() === 'amount'" [class.opacity-40]="sortColumn() !== 'amount'">
                      @if (sortColumn() === 'amount') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 5. पावती क्र. (Receipt No.) -->
                <th
                  (click)="toggleSort('receiptNo')"
                  class="py-3 px-4 text-center cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'receiptNo'"
                  [class.text-emerald-950]="sortColumn() === 'receiptNo'"
                  [title]="mandalData.t('पावती क्रमांकानुसार क्रमवारी लावा', 'Sort by Receipt No.')"
                >
                  <div class="inline-flex items-center justify-center gap-1.5">
                    <span>{{ mandalData.t('पावती क्र.', 'Receipt No.') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'receiptNo'" [class.font-black]="sortColumn() === 'receiptNo'" [class.opacity-40]="sortColumn() !== 'receiptNo'">
                      @if (sortColumn() === 'receiptNo') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 6. भरणा पद्धत (Payment Mode) -->
                <th
                  (click)="toggleSort('paymentMode')"
                  class="py-3 px-4 text-center cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'paymentMode'"
                  [class.text-emerald-950]="sortColumn() === 'paymentMode'"
                  [title]="mandalData.t('भरणा पद्धतीनुसार क्रमवारी लावा', 'Sort by Payment Mode')"
                >
                  <div class="inline-flex items-center justify-center gap-1.5">
                    <span>{{ mandalData.t('भरणा पद्धत', 'Payment Mode') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'paymentMode'" [class.font-black]="sortColumn() === 'paymentMode'" [class.opacity-40]="sortColumn() !== 'paymentMode'">
                      @if (sortColumn() === 'paymentMode') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 7. तारीख (Date) -->
                <th
                  (click)="toggleSort('date')"
                  class="py-3 px-4 text-center cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'date'"
                  [class.text-emerald-950]="sortColumn() === 'date'"
                  [title]="mandalData.t('तारखेनुसार क्रमवारी लावा', 'Sort by Date')"
                >
                  <div class="inline-flex items-center justify-center gap-1.5">
                    <span>{{ mandalData.t('तारीख', 'Date') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'date'" [class.font-black]="sortColumn() === 'date'" [class.opacity-40]="sortColumn() !== 'date'">
                      @if (sortColumn() === 'date') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 8. पावती (Status) -->
                <th
                  (click)="toggleSort('status')"
                  class="py-3 px-4 text-center cursor-pointer select-none transition group hover:bg-slate-200/80"
                  [class.bg-emerald-100/60]="sortColumn() === 'status'"
                  [class.text-emerald-950]="sortColumn() === 'status'"
                  [title]="mandalData.t('पावती स्थितीनुसार क्रमवारी लावा', 'Sort by Status')"
                >
                  <div class="inline-flex items-center justify-center gap-1.5">
                    <span>{{ mandalData.t('पावती', 'Status') }}</span>
                    <span class="text-[11px]" [class.text-emerald-700]="sortColumn() === 'status'" [class.font-black]="sortColumn() === 'status'" [class.opacity-40]="sortColumn() !== 'status'">
                      @if (sortColumn() === 'status') {
                        {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ⇅
                      }
                    </span>
                  </div>
                </th>

                <!-- 9. कृती (Action) -->
                <th class="py-3 px-4 text-center">{{ mandalData.t('कृती', 'Action') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (row of paginatedList(); track row.id; let idx = $index) {
                <tr class="hover:bg-amber-50/40 transition">
                  <td class="py-3 px-3 text-center text-slate-600 font-semibold font-mono">
                    {{ mandalData.formatNum(row.srNo || ((currentPage() - 1) * pageSize() + idx + 1)) }}
                  </td>
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

  // Sorting State (Default: Highest amount first)
  readonly sortColumn = signal<VarganiSortColumn>('amount');
  readonly sortDirection = signal<SortDirection>('desc');

  toggleSort(column: VarganiSortColumn) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'amount' ? 'desc' : 'asc');
    }
    this.currentPage.set(1);
  }

  getSortLabel(): string {
    const col = this.sortColumn();
    const dir = this.sortDirection();
    const dirMr = dir === 'asc' ? 'कमी ते जास्त' : 'जास्त ते कमी';
    const dirEn = dir === 'asc' ? 'Ascending' : 'Descending';

    const colMap: Record<VarganiSortColumn, [string, string]> = {
      srNo: ['अ. क्र.', 'Sr. No.'],
      name: ['नाव', 'Member Name'],
      source: ['स्त्रोत', 'Source'],
      amount: ['रक्कम', 'Amount'],
      receiptNo: ['पावती क्र.', 'Receipt No.'],
      paymentMode: ['भरणा पद्धत', 'Payment Mode'],
      date: ['तारीख', 'Date'],
      status: ['पावती स्थिती', 'Status']
    };

    const [mr, en] = colMap[col] || ['रक्कम', 'Amount'];
    return `${this.mandalData.t(mr, en)} (${this.mandalData.t(dirMr, dirEn)})`;
  }

  // Filtered List computation (reacts to every keystroke, filter change and sorting)
  readonly filteredList = computed(() => {
    let list = this.mandalData.currentVargani();
    const query = this.searchQuery().trim();
    const bFilter = this.buildingFilter();
    const sFilter = this.statusFilter();
    const pFilter = this.paymentFilter();

    if (bFilter !== 'सर्व') {
      list = list.filter(item => (item.source || item.building) === bFilter || item.building === bFilter);
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

    const col = this.sortColumn();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      let diff = 0;
      switch (col) {
        case 'srNo': {
          const aSr = a.srNo ?? a.id ?? 0;
          const bSr = b.srNo ?? b.id ?? 0;
          diff = aSr - bSr;
          break;
        }
        case 'name': {
          const aName = this.mandalData.isEnglish() ? (a.nameEn || a.nameMr) : (a.nameMr || a.nameEn);
          const bName = this.mandalData.isEnglish() ? (b.nameEn || b.nameMr) : (b.nameMr || b.nameEn);
          diff = (aName || '').localeCompare(bName || '', this.mandalData.isEnglish() ? 'en' : 'mr', { numeric: true, sensitivity: 'base' });
          break;
        }
        case 'source': {
          const aSrc = a.source || a.building || '';
          const bSrc = b.source || b.building || '';
          diff = aSrc.localeCompare(bSrc, 'mr', { numeric: true, sensitivity: 'base' });
          break;
        }
        case 'amount': {
          diff = a.amount - b.amount;
          break;
        }
        case 'receiptNo': {
          const aRec = a.receiptNo ? parseInt(String(a.receiptNo).replace(/\D/g, ''), 10) || 0 : 0;
          const bRec = b.receiptNo ? parseInt(String(b.receiptNo).replace(/\D/g, ''), 10) || 0 : 0;
          diff = aRec - bRec;
          break;
        }
        case 'paymentMode': {
          const aMode = a.paymentMode || 'कॅश';
          const bMode = b.paymentMode || 'कॅश';
          diff = aMode.localeCompare(bMode, 'mr');
          break;
        }
        case 'date': {
          const parseDate = (d?: string): number => {
            if (!d) return 0;
            const parts = String(d).trim().split(/[\/\-.]/);
            if (parts.length === 3) {
              if (parts[2].length === 4) {
                return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime() || 0;
              } else if (parts[0].length === 4) {
                return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getTime() || 0;
              }
            }
            return Date.parse(d) || 0;
          };
          diff = parseDate(a.date) - parseDate(b.date);
          break;
        }
        case 'status': {
          diff = (a.status || '').localeCompare(b.status || '', 'mr');
          break;
        }
      }

      if (diff === 0) {
        diff = (a.srNo ?? a.id ?? 0) - (b.srNo ?? b.id ?? 0);
      }

      return diff * dir;
    });
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
