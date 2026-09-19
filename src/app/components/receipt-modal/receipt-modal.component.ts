import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VarganiRecord } from '../../models/mandal.models';
import { MandalDataService } from '../../services/mandal-data.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (record(); as item) {
      <div class="receipt-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
        <div class="receipt-modal-card bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-amber-200" (click)="$event.stopPropagation()">

          <!-- Modal Toolbar (Hidden in Print) -->
          <div class="no-print flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white shrink-0">
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <span class="text-amber-400 font-bold text-sm sm:text-lg">{{ mandalData.t('॥ पावती दर्शन ॥', '॥ Official Receipt ॥') }}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 hidden xs:inline">({{ mandalData.t('अधिकृत पावती', 'Official Receipt') }})</span>
            </div>

            <!-- Action Buttons: Print, Save as PDF, Download PNG -->
            <div class="flex items-center flex-wrap gap-1.5 sm:gap-2">
              <!-- Print Button -->
              <button
                (click)="printReceipt()"
                class="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition cursor-pointer active:scale-95"
                title="प्रिंट करा / Print"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                <span class="hidden sm:inline">{{ mandalData.t('प्रिंट', 'Print') }}</span>
              </button>

              <!-- Save as PDF Button -->
              <button
                (click)="downloadPdf()"
                [disabled]="isGeneratingPdf() || isGeneratingPng()"
                class="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition cursor-pointer active:scale-95 disabled:opacity-50"
                title="PDF डाउनलोड करा / Save as PDF"
              >
                @if (isGeneratingPdf()) {
                  <span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span class="hidden sm:inline">{{ mandalData.t('तयार होत आहे...', 'Saving...') }}</span>
                } @else {
                  <svg class="w-3.5 h-3.5 text-rose-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  <span>{{ mandalData.t('PDF', 'PDF') }}</span>
                }
              </button>

              <!-- Download PNG Button -->
              <button
                (click)="downloadPng()"
                [disabled]="isGeneratingPng() || isGeneratingPdf()"
                class="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition cursor-pointer active:scale-95 disabled:opacity-50"
                title="PNG इमेज डाउनलोड करा / Download PNG"
              >
                @if (isGeneratingPng()) {
                  <span class="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span class="hidden sm:inline">{{ mandalData.t('तयार होत आहे...', 'Saving...') }}</span>
                } @else {
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>{{ mandalData.t('PNG', 'PNG') }}</span>
                }
              </button>

              <!-- Close Modal -->
              <button (click)="close.emit()" class="text-slate-400 hover:text-white p-1 rounded-md transition ml-1 cursor-pointer" aria-label="Close modal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Printable Receipt Body (Complete Receipt Only) -->
          <div
            id="official-receipt-print-area"
            class="p-3.5 sm:p-6 md:p-8 printable-area bg-[#fffef9] border-2 sm:border-4 border-amber-900/20 m-1 sm:m-2 rounded-lg relative overflow-y-auto"
          >
            <!-- Watermark Silhouette -->
            <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span class="text-8xl sm:text-9xl font-bold font-devanagari text-amber-900">श्री</span>
            </div>

            <!-- Receipt Header -->
            <div class="border-b-2 border-dashed border-amber-900/30 pb-3 sm:pb-4 text-center">
              <div class="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <img src="logo.jpg" alt="Logo" class="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-amber-500 shadow-sm shrink-0" />
                <div class="text-left">
                  <div class="text-[9px] sm:text-[10px] font-bold text-amber-800 tracking-wider">
                    {{ mandalData.t('स्थापना १९९७ | रजि. न. १९२३ जी.वी.वी.एस.डी', 'Est. 1997 | Reg. No. 1923 GBVSD') }}
                  </div>
                  <h2 class="text-base sm:text-xl md:text-2xl font-black text-red-700 font-devanagari tracking-tight leading-tight">
                    {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ', 'Shree Ashtavinayak Mitra Mandal') }}
                  </h2>
                  <div class="text-[10.5px] sm:text-xs font-semibold text-slate-700 font-devanagari">
                    {{ mandalData.t('शिव स्फुर्ति बिल्डिंग, आदर्श नगर, जोगेश्वरी - (प), मुंबई-४००१०२', 'Shiv Sphurti Bldg, Adarsh Nagar, Jogeshwari (W), Mumbai-400102') }}
                  </div>
                </div>
              </div>
              <div class="text-[10px] sm:text-[11px] font-bold text-[#b91c1c] font-devanagari">
                {{ mandalData.t('॥ परंपरेचा वारसा आम्ही जपतो, विघ्नहर्ताचा गजर आम्ही करतो ॥', '॥ Preserving Heritage & Cultural Devotion to Lord Ganesha ॥') }}
              </div>
              <div class="inline-block mt-1.5 px-2.5 sm:px-3 py-0.5 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold rounded-full border border-amber-300">
                {{ mandalData.t('अधिकृत उत्सव वर्गणी / देणगी पावती', 'Official Festival Donation Receipt') }}
              </div>
            </div>

            <!-- Receipt Metadata Row -->
            <div class="grid grid-cols-2 gap-2 sm:gap-4 py-2 sm:py-3 border-b border-amber-100 text-xs sm:text-sm">
              <div>
                <span class="text-slate-500 text-[11px] sm:text-xs">{{ mandalData.t('पावती क्रमांक:', 'Receipt No:') }}</span>
                <span class="font-bold text-red-700 ml-1 text-sm sm:text-base">{{ item.receiptNo ? mandalData.formatNum(item.receiptNo) : mandalData.t('पेंडिंग (Pending)', 'Pending') }}</span>
              </div>
              <div class="text-right">
                <span class="text-slate-500 text-[11px] sm:text-xs">{{ mandalData.t('तारीख:', 'Date:') }}</span>
                <span class="font-bold text-slate-800 ml-1">{{ mandalData.formatNum(item.date) }}</span>
              </div>
            </div>

            <!-- Donor Details -->
            <div class="py-3 sm:py-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-800">
              <div class="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-slate-200 pb-1.5 sm:pb-2">
                <span class="text-slate-500 w-28 sm:w-36 shrink-0 text-xs">{{ mandalData.t('देणगीदाराचे नाव:', 'Donor Name:') }}</span>
                <span class="font-bold text-sm sm:text-base text-slate-900 font-devanagari">
                  @if (mandalData.isEnglish()) {
                    {{ item.nameEn }} <span class="text-xs font-normal text-slate-500">({{ item.nameMr }})</span>
                  } @else {
                    {{ item.nameMr }} <span class="text-xs font-normal text-slate-500">({{ item.nameEn }})</span>
                  }
                </span>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-slate-200 pb-1.5 sm:pb-2">
                <span class="text-slate-500 w-28 sm:w-36 shrink-0 text-xs">{{ mandalData.t('स्त्रोत / इमारत:', 'Source / Building:') }}</span>
                <span class="font-semibold text-slate-900">{{ mandalData.translateBuilding(item.building) }}</span>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-slate-200 pb-1.5 sm:pb-2">
                <span class="text-slate-500 w-28 sm:w-36 shrink-0 text-xs">{{ mandalData.t('उत्सव / वर्ष:', 'Festival / Year:') }}</span>
                <span class="font-semibold text-slate-900">{{ mandalData.translateFestival(item.festival) }} ({{ mandalData.formatNum(item.year) }})</span>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-slate-200 pb-1.5 sm:pb-2">
                <span class="text-slate-500 w-28 sm:w-36 shrink-0 text-xs">{{ mandalData.t('भरणा पद्धत:', 'Payment Mode:') }}</span>
                <span class="font-semibold text-slate-900">{{ mandalData.translatePaymentMode(item.paymentMode || 'कॅश') }}</span>
                @if (item.phone) {
                  <span class="sm:ml-auto text-xs text-slate-500 mt-0.5 sm:mt-0">{{ mandalData.t('मोबाईल:', 'Mobile:') }} {{ mandalData.formatNum(item.phone) }}</span>
                }
              </div>

              <!-- Amount Highlight Box -->
              <div class="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 sm:p-3.5 my-2 sm:my-3 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
                <div>
                  <div class="text-[11px] sm:text-xs text-amber-800 font-semibold">{{ mandalData.t('अक्षरी रक्कम (Amount in Words):', 'Amount in Words:') }}</div>
                  <div class="font-bold text-slate-900 text-xs sm:text-sm font-devanagari mt-0.5">
                    {{ getAmountInWords(item.amount) }}
                  </div>
                </div>
                <div class="text-left xs:text-right shrink-0">
                  <div class="text-[10px] sm:text-xs text-slate-500 font-semibold">{{ mandalData.t('एकूण रक्कम', 'Total Amount') }}</div>
                  <div class="text-xl sm:text-2xl font-black text-emerald-700">{{ mandalData.formatNum(item.amount, true) }}</div>
                </div>
              </div>
            </div>

            <!-- Signatures & Stamp -->
            <div class="pt-4 sm:pt-6 border-t-2 border-dashed border-amber-900/30 grid grid-cols-3 gap-1.5 sm:gap-4 items-end text-center">
              <div>
                <div class="h-8 sm:h-10 flex items-center justify-center">
                  <span class="font-script text-slate-600 italic text-xs sm:text-sm">J.Shinde</span>
                </div>
                <div class="text-[10px] sm:text-xs font-bold text-slate-700 border-t border-slate-400 pt-0.5 sm:pt-1 leading-tight">
                  <div>जगदीश शिंदे</div>
                  <div class="text-[9px] sm:text-[10px] text-slate-500 font-normal">({{ mandalData.t('खजिनदार', 'Treasurer') }})</div>
                </div>


              </div>

              <!-- Mandal Stamp -->
              <div class="flex flex-col items-center justify-center">
                <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-red-500/80 flex flex-col items-center justify-center text-[7px] sm:text-[8px] text-red-600 font-bold leading-tight rotate-[-6deg] p-0.5 bg-red-50/30">
                  <span>{{ mandalData.t('अष्टविनायक', 'Ashtavinayak') }}</span>
                  <span class="text-[6px] sm:text-[7px]">★ {{ mandalData.t('जोगेश्वरी', 'Jogeshwari') }} ★</span>
                  <span class="text-[5px] sm:text-[6px]">{{ mandalData.t('अधिकृत शिक्का', 'Official Stamp') }}</span>
                </div>
              </div>

              <div>
                <div class="h-8 sm:h-10 flex items-center justify-center">
                  <span class="font-script text-slate-600 italic text-xs sm:text-sm">B.Yadav</span>
                </div>
                <div class="text-[10px] sm:text-xs font-bold text-slate-700 border-t border-slate-400 pt-0.5 sm:pt-1 leading-tight">
                  <div>{{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }}</div>
                  <div class="text-[9px] sm:text-[10px] text-slate-500 font-normal">({{ mandalData.t('अध्यक्ष', 'President') }})</div>
                </div>
              </div>
            </div>

            <!-- Footer Note -->
            <div class="mt-3 sm:mt-5 text-[9px] sm:text-[10px] text-slate-500 text-center leading-relaxed border-t border-slate-100 pt-2 space-y-0.5">
              <div>{{ mandalData.t('॥ सामूहिक श्रद्धा | सामूहिक सेवा | आपलेच मंडळ ॥', '॥ Collective Faith | Selfless Service | Our Community ॥') }}</div>
              <div class="font-medium text-slate-600">
                {{ mandalData.t('अधिकृत बँक खाते: ' + mandalData.bankDetails.bankNameMr + ' • खाते क्र.: ' + mandalData.bankDetails.accountNo + ' • IFSC: ' + mandalData.bankDetails.ifscCode, 'Official Bank: ' + mandalData.bankDetails.bankNameEn + ' • A/C: ' + mandalData.bankDetails.accountNo + ' • IFSC: ' + mandalData.bankDetails.ifscCode) }}
              </div>
              <div>{{ mandalData.t('टीप: ही पावती संगणकीय प्रणालीद्वारे तयार करण्यात आली असून अधिकृत मानली जाईल.', 'Note: This receipt is computer generated and valid for all official purposes.') }}</div>
            </div>
          </div>

          <!-- Bottom Actions (Hidden in Print) -->
          <div class="no-print bg-slate-50 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2 sm:gap-3 shrink-0">
            <button
              (click)="close.emit()"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              {{ mandalData.t('बंद करा', 'Close') }}
            </button>

            <!-- Download PNG Button -->
            <button
              (click)="downloadPng()"
              [disabled]="isGeneratingPng() || isGeneratingPdf()"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="PNG स्वरूपात सेव्ह करा"
            >
              @if (isGeneratingPng()) {
                <span class="w-3.5 h-3.5 border-2 border-amber-950 border-t-transparent rounded-full animate-spin"></span>
                <span>{{ mandalData.t('तयार होत आहे...', 'Saving...') }}</span>
              } @else {
                <svg class="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span>{{ mandalData.t('PNG डाउनलोड', 'Download PNG') }}</span>
              }
            </button>

            <!-- Save as PDF Button -->
            <button
              (click)="downloadPdf()"
              [disabled]="isGeneratingPdf() || isGeneratingPng()"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-rose-700 hover:bg-rose-800 text-white rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="PDF स्वरूपात सेव्ह करा"
            >
              @if (isGeneratingPdf()) {
                <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ mandalData.t('तयार होत आहे...', 'Saving...') }}</span>
              } @else {
                <svg class="w-4 h-4 text-rose-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span>{{ mandalData.t('PDF सेव्ह करा', 'Save as PDF') }}</span>
              }
            </button>

            <!-- Print Button -->
            <button
              (click)="printReceipt()"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              <span>{{ mandalData.t('प्रिंट करा', 'Print') }}</span>
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ReceiptModalComponent {
  readonly mandalData = inject(MandalDataService);
  readonly record = input<VarganiRecord | null>(null);
  readonly close = output<void>();

  readonly isGeneratingPng = signal<boolean>(false);
  readonly isGeneratingPdf = signal<boolean>(false);

  /**
   * Generates a clean automatic file name matching user format:
   * e.g. Pavati_123_Rohan
   */
  getSafeBaseName(): string {
    const item = this.record();
    if (!item) return 'Pavati';

    // Receipt Number
    const rawNo = item.receiptNo ? String(item.receiptNo).trim() : '000';
    const cleanNo = rawNo.replace(/[^a-zA-Z0-9_-]/g, '');

    // Donor First Name / Name
    let donorName = '';
    if (item.nameEn && item.nameEn.trim()) {
      const parts = item.nameEn.trim().split(/\s+/);
      donorName = parts[0];
    } else if (item.nameMr && item.nameMr.trim()) {
      const cleaned = item.nameMr.trim().replace(/^(श्री\.|श्री|सौ\.|सौ|श्रीमती\.|श्रीमती)\s*/, '');
      const parts = cleaned.split(/\s+/);
      donorName = parts[0];
    }
    const cleanDonor = (donorName || 'Donor').replace(/[^a-zA-Z0-9_-]/g, '');

    return `Pavati_${cleanNo}_${cleanDonor}`;
  }

  /**
   * Triggers native print with document.title temporarily set to automatic file name,
   * so browser's "Save as PDF" dialog pre-fills "Pavati_123_Rohan.pdf".
   */
  printReceipt() {
    const baseName = this.getSafeBaseName();
    const originalTitle = document.title;
    document.title = baseName;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1200);
  }

  /**
   * Clones the receipt into an off-screen staging container at standard desktop print width (700px),
   * enforcing full expanded layouts (unwrapped donor rows, horizontal signatures, clean borders),
   * ensuring the captured canvas is 100% identical to the print view on all devices.
   */
  private async captureReceiptCanvas(): Promise<HTMLCanvasElement | null> {
    const elem = document.getElementById('official-receipt-print-area');
    if (!elem) return null;

    let staging: HTMLElement | null = null;
    try {
      const STANDARDIZED_WIDTH = 700;

      staging = document.createElement('div');
      staging.id = 'receipt-staging-export';
      staging.style.position = 'fixed';
      staging.style.left = '-9999px';
      staging.style.top = '0';
      staging.style.width = `${STANDARDIZED_WIDTH}px`;
      staging.style.minWidth = `${STANDARDIZED_WIDTH}px`;
      staging.style.maxWidth = `${STANDARDIZED_WIDTH}px`;
      staging.style.height = 'auto';
      staging.style.maxHeight = 'none';
      staging.style.overflow = 'visible';
      staging.style.zIndex = '-9999';
      staging.style.pointerEvents = 'none';
      staging.style.background = '#fffef9';
      staging.style.margin = '0';
      staging.style.padding = '0';
      staging.style.boxSizing = 'border-box';

      // Clone the receipt
      const clone = elem.cloneNode(true) as HTMLElement;
      clone.id = 'receipt-export-clone';
      clone.style.width = `${STANDARDIZED_WIDTH}px`;
      clone.style.minWidth = `${STANDARDIZED_WIDTH}px`;
      clone.style.maxWidth = `${STANDARDIZED_WIDTH}px`;
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';
      clone.style.margin = '0';
      clone.style.padding = '24px 30px';
      clone.style.border = '2px solid rgba(120, 53, 15, 0.4)';
      clone.style.borderRadius = '12px';
      clone.style.background = '#fffef9';
      clone.style.boxShadow = 'none';
      clone.style.boxSizing = 'border-box';

      staging.appendChild(clone);
      document.body.appendChild(staging);

      const canvas = await html2canvas(clone, {
        scale: 2, // 1400px wide, 300 DPI crisp
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fffef9',
        width: STANDARDIZED_WIDTH,
        windowWidth: STANDARDIZED_WIDTH,
        logging: false,
        scrollX: 0,
        scrollY: 0
      });

      return canvas;
    } catch (err) {
      console.error('Failed to capture standardized receipt canvas:', err);
      return null;
    } finally {
      if (staging && staging.parentNode) {
        staging.parentNode.removeChild(staging);
      }
    }
  }

  /**
   * Captures the complete receipt element in high-resolution matching the Print View,
   * and downloads with automatic file name (e.g. Pavati_123_Rohan.png).
   */
  async downloadPng() {
    if (this.isGeneratingPng() || this.isGeneratingPdf()) return;
    this.isGeneratingPng.set(true);
    try {
      const canvas = await this.captureReceiptCanvas();
      if (!canvas) return;

      const baseName = this.getSafeBaseName();
      const filename = `${baseName}.png`;
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating receipt PNG:', err);
    } finally {
      this.isGeneratingPng.set(false);
    }
  }

  /**
   * Captures the complete receipt and builds a standard PDF containing only the receipt,
   * downloading directly with automatic file name (e.g. Pavati_123_Rohan.pdf).
   */
  async downloadPdf() {
    if (this.isGeneratingPdf() || this.isGeneratingPng()) return;
    this.isGeneratingPdf.set(true);
    try {
      const canvas = await this.captureReceiptCanvas();
      if (!canvas) return;

      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const base64Data = jpegDataUrl.split(',')[1];
      const binaryStr = window.atob(base64Data);
      const len = binaryStr.length;
      const jpegBytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        jpegBytes[i] = binaryStr.charCodeAt(i);
      }

      const pdfBlob = this.buildSingleImagePdf(jpegBytes, canvas.width, canvas.height);
      const baseName = this.getSafeBaseName();
      const filename = `${baseName}.pdf`;

      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error generating receipt PDF:', err);
      // Fallback to print dialog
      this.printReceipt();
    } finally {
      this.isGeneratingPdf.set(false);
    }
  }

  /**
   * Builds a valid PDF 1.4 binary Blob embedding the JPEG image centered on an A4 page.
   */
  private buildSingleImagePdf(jpegBytes: Uint8Array, imgWidth: number, imgHeight: number): Blob {
    const pageWidth = 595.28; // Standard A4 points
    const pageHeight = 841.89;
    const margin = 28.35; // 10mm margins
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    let drawWidth = maxWidth;
    let drawHeight = (imgHeight / imgWidth) * drawWidth;
    if (drawHeight > maxHeight) {
      drawHeight = maxHeight;
      drawWidth = (imgWidth / imgHeight) * drawHeight;
    }

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    const contentStream = `q\n${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im1 Do\nQ\n`;
    const contentLen = contentStream.length;

    const header = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;
    const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
    const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
    const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
    const obj4Header = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
    const obj4Footer = `\nendstream\nendobj\n`;
    const obj5 = `5 0 obj\n<< /Length ${contentLen} >>\nstream\n${contentStream}endstream\nendobj\n`;

    const enc = new TextEncoder();
    const hBytes = enc.encode(header);
    const o1Bytes = enc.encode(obj1);
    const o2Bytes = enc.encode(obj2);
    const o3Bytes = enc.encode(obj3);
    const o4HBytes = enc.encode(obj4Header);
    const o4FBytes = enc.encode(obj4Footer);
    const o5Bytes = enc.encode(obj5);

    const offset1 = hBytes.length;
    const offset2 = offset1 + o1Bytes.length;
    const offset3 = offset2 + o2Bytes.length;
    const offset4 = offset3 + o3Bytes.length;
    const offset5 = offset4 + o4HBytes.length + jpegBytes.length + o4FBytes.length;
    const xrefOffset = offset5 + o5Bytes.length;

    const pad = (n: number) => String(n).padStart(10, '0');
    const xref = `xref\n0 6\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n${pad(offset5)} 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    const xrefBytes = enc.encode(xref);

    const parts: any[] = [
      hBytes,
      o1Bytes,
      o2Bytes,
      o3Bytes,
      o4HBytes,
      jpegBytes,
      o4FBytes,
      o5Bytes,
      xrefBytes
    ];

    return new Blob(parts, { type: 'application/pdf' });
  }

  getAmountInWords(amount: number): string {
    if (this.mandalData.isEnglish()) {
      const enMap: Record<number, string> = {
        1000: 'One Thousand Rupees Only.',
        1500: 'One Thousand Five Hundred Rupees Only.',
        2000: 'Two Thousand Rupees Only.',
        2500: 'Two Thousand Five Hundred Rupees Only.',
        3000: 'Three Thousand Rupees Only.',
        4000: 'Four Thousand Rupees Only.',
        5000: 'Five Thousand Rupees Only.',
        7500: 'Seven Thousand Five Hundred Rupees Only.',
        10000: 'Ten Thousand Rupees Only.',
        15000: 'Fifteen Thousand Rupees Only.',
        20000: 'Twenty Thousand Rupees Only.',
        25000: 'Twenty Five Thousand Rupees Only.',
        50000: 'Fifty Thousand Rupees Only.',
        100000: 'One Lakh Rupees Only.'
      };
      return enMap[amount] || `Rupees ${amount.toLocaleString('en-IN')} Only.`;
    }

    const wordMap: Record<number, string> = {
      1000: 'एक हजार रुपये फक्त.',
      1500: 'एक हजार पाचशे रुपये फक्त.',
      2000: 'दोन हजार रुपये फक्त.',
      2500: 'दोन हजार पाचशे रुपये फक्त.',
      3000: 'तीन हजार रुपये फक्त.',
      4000: 'चार हजार रुपये फक्त.',
      5000: 'पाच हजार रुपये फक्त.',
      7500: 'सात हजार पाचशे रुपये फक्त.',
      10000: 'दहा हजार रुपये फक्त.',
      15000: 'पंधरा हजार रुपये फक्त.',
      20000: 'वीस हजार रुपये फक्त.',
      25000: 'पंचवीस हजार रुपये फक्त.',
      50000: 'पन्नास हजार रुपये फक्त.',
      100000: 'एक लाख रुपये फक्त.'
    };

    if (wordMap[amount]) return wordMap[amount];
    return `अक्षरी रुपये ${amount.toLocaleString('en-IN')} फक्त.`;
  }
}
