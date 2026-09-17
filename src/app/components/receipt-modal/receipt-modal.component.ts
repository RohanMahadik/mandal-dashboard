import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VarganiRecord } from '../../models/mandal.models';
import { MandalDataService } from '../../services/mandal-data.service';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (record(); as item) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-amber-200" (click)="$event.stopPropagation()">
          
          <!-- Modal Toolbar (Hidden in Print) -->
          <div class="no-print flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white shrink-0">
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <span class="text-amber-400 font-bold text-sm sm:text-lg">{{ mandalData.t('॥ पावती दर्शन ॥', '॥ Official Receipt ॥') }}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 hidden xs:inline">({{ mandalData.t('अधिकृत पावती', 'Official Receipt') }})</span>
            </div>
            <div class="flex items-center space-x-2 sm:space-x-3">
              <button (click)="printReceipt()" class="px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md shadow flex items-center gap-1.5 transition">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                <span>{{ mandalData.t('प्रिंट करा', 'Print') }}</span>
              </button>
              <button (click)="close.emit()" class="text-slate-400 hover:text-white p-1 rounded-md transition" aria-label="Close modal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Printable Receipt Body -->
          <div class="p-3.5 sm:p-6 md:p-8 printable-area bg-[#fffef9] border-2 sm:border-4 border-amber-900/20 m-1 sm:m-2 rounded-lg relative overflow-y-auto">
            
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
                <span class="text-slate-500 w-28 sm:w-36 shrink-0 text-xs">{{ mandalData.t('बिल्डिंग / विंग:', 'Building / Wing:') }}</span>
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
                  <span class="font-script text-slate-600 italic text-xs sm:text-sm">R. Parab</span>
                </div>
                <div class="text-[10px] sm:text-xs font-bold text-slate-700 border-t border-slate-400 pt-0.5 sm:pt-1">
                  {{ mandalData.t('खजिनदार', 'Treasurer') }}
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
                  <span class="font-script text-slate-600 italic text-xs sm:text-sm">M. V. Kadam</span>
                </div>
                <div class="text-[10px] sm:text-xs font-bold text-slate-700 border-t border-slate-400 pt-0.5 sm:pt-1 leading-tight">
                  <div>{{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }}</div>
                  <div class="text-[9px] sm:text-[10px] text-slate-500 font-normal">({{ mandalData.t('अध्यक्ष', 'President') }})</div>
                </div>
              </div>
            </div>

            <!-- Footer Note -->
            <div class="mt-3 sm:mt-5 text-[9px] sm:text-[10px] text-slate-500 text-center leading-relaxed border-t border-slate-100 pt-2">
              {{ mandalData.t('॥ सामूहिक श्रद्धा | सामूहिक सेवा | आपलेच मंडळ ॥', '॥ Collective Faith | Selfless Service | Our Community ॥') }}<br>
              {{ mandalData.t('टीप: ही पावती संगणकीय प्रणालीद्वारे तयार करण्यात आली असून अधिकृत मानली जाईल.', 'Note: This receipt is computer generated and valid for all official purposes.') }}
            </div>

          </div>

          <!-- Bottom Actions -->
          <div class="no-print bg-slate-50 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 flex justify-end gap-2 sm:gap-3 shrink-0">
            <button (click)="close.emit()" class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition">
              {{ mandalData.t('बंद करा', 'Close') }}
            </button>
            <button (click)="printReceipt()" class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow transition flex items-center gap-1.5">
              {{ mandalData.t('प्रिंट किंवा PDF सेव्ह करा', 'Print or Save as PDF') }}
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

  printReceipt() {
    window.print();
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

