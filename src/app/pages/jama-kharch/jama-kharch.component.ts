import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandalDataService } from '../../services/mandal-data.service';

@Component({
  selector: 'app-jama-kharch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-5 pb-8 animate-fade-in">
      
      <!-- Top Action Bar (Hidden in Print) -->
      <div class="no-print bg-white rounded-xl shadow-sm border border-slate-200/80 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold font-devanagari text-slate-900">
            {{ mandalData.t('जमा - खर्च ताळेबंद पत्रक', 'Income - Expense Balance Sheet') }}
          </h1>
          <p class="text-xs text-slate-500 font-devanagari">
            {{ mandalData.isEnglish() ? (mandalData.translateFestival(mandalData.selectedFestival()) + ' (' + mandalData.selectedYear() + ') - Official Double-Entry Ledger') : (mandalData.selectedFestival() + ' (वर्ष ' + mandalData.toMarathiDigits(mandalData.selectedYear()) + ') - अधिकृत द्विनोंद हिशोब वही') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            (click)="printSheet()"
            class="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            <span>{{ mandalData.t('प्रिंट करा', 'Print') }}</span>
          </button>
          <button
            (click)="exportExcel()"
            class="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <span>{{ mandalData.t('Excel डाउनलोड', 'Download Excel') }}</span>
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

          <div class="inline-block mt-3 px-4 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full font-bold text-xs font-devanagari">
            {{ mandalData.isEnglish() ? ('Annual Balance Sheet - ' + mandalData.translateFestival(mandalData.selectedFestival()) + ' (' + mandalData.selectedYear() + ')') : ('वार्षिक जमा-खर्च हिशोब पत्रक (ताळेबंद) - ' + mandalData.selectedFestival() + ' (' + mandalData.toMarathiDigits(mandalData.selectedYear()) + ')') }}
          </div>
        </div>

        <!-- KPI Balance Summary Strip -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div class="text-xs font-bold text-emerald-800 font-devanagari">{{ mandalData.t('एकूण जमा (Total Receipts)', 'Total Receipts (Income)') }}</div>
            <div class="text-2xl font-black text-emerald-700">{{ mandalData.formatNum(mandalData.kpi().totalVargani, true) }}</div>
          </div>
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <div class="text-xs font-bold text-rose-800 font-devanagari">{{ mandalData.t('एकूण खर्च (Total Payments)', 'Total Payments (Expenses)') }}</div>
            <div class="text-2xl font-black text-rose-700">{{ mandalData.formatNum(mandalData.kpi().totalKharch, true) }}</div>
          </div>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div class="text-xs font-bold text-blue-800 font-devanagari">{{ mandalData.t('शिल्लक रक्कम (Net Surplus)', 'Net Surplus (Balance)') }}</div>
            <div class="text-2xl font-black text-blue-700">{{ mandalData.formatNum(mandalData.kpi().balanceAmount, true) }}</div>
          </div>
        </div>

        <!-- Double Column T-Format Balance Sheet -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- LEFT: जमा बाजू (Receipts / Income) -->
          <div class="border-2 border-emerald-600/60 rounded-xl overflow-hidden">
            <div class="bg-emerald-700 text-white font-bold py-2.5 px-4 flex justify-between items-center text-sm font-devanagari">
              <span>{{ mandalData.t('जमा बाजू (Receipts / Income)', 'Receipts / Income (Debit)') }}</span>
              <span>{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</span>
            </div>

            <table class="w-full text-xs whitespace-nowrap">
              <tbody class="divide-y divide-slate-200">
                @for (item of mandalData.buildingDistribution(); track item.building) {
                  <tr class="hover:bg-emerald-50/40">
                    <td class="py-2.5 px-4 text-slate-800 font-devanagari">
                      {{ mandalData.t('वर्गणी', 'Donations') }} - <b>{{ mandalData.translateBuilding(item.building) }}</b>
                    </td>
                    <td class="py-2.5 px-4 text-right font-bold text-slate-900">
                      {{ mandalData.formatNum(item.amount, true) }}
                    </td>
                  </tr>
                }
                <!-- Balancing empty rows for visual alignment -->
                <tr class="bg-slate-50/50"><td colspan="2" class="py-6"></td></tr>
              </tbody>
              <tfoot>
                <tr class="bg-emerald-100 font-black text-emerald-900 border-t-2 border-emerald-600 text-sm">
                  <td class="py-3 px-4 font-devanagari">{{ mandalData.t('एकूण जमा (Total Receipts)', 'Total Receipts') }}</td>
                  <td class="py-3 px-4 text-right">{{ mandalData.formatNum(mandalData.kpi().totalVargani, true) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- RIGHT: खर्च बाजू (Payments / Expenses) -->
          <div class="border-2 border-rose-600/60 rounded-xl overflow-hidden">
            <div class="bg-rose-700 text-white font-bold py-2.5 px-4 flex justify-between items-center text-sm font-devanagari">
              <span>{{ mandalData.t('खर्च बाजू (Payments / Expenses)', 'Payments / Expenses (Credit)') }}</span>
              <span>{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</span>
            </div>

            <table class="w-full text-xs whitespace-nowrap">
              <tbody class="divide-y divide-slate-200">
                @for (item of mandalData.currentKharch(); track item.id) {
                  <tr class="hover:bg-rose-50/30">
                    <td class="py-2 px-4 text-slate-800 font-devanagari">
                      {{ mandalData.isEnglish() ? (item.nameEn || item.nameMr) : item.nameMr }}
                      <span class="text-[10px] text-slate-500 font-mono ml-1">({{ mandalData.formatNum(item.voucherNo) }})</span>
                    </td>
                    <td class="py-2 px-4 text-right font-bold text-slate-900">
                      {{ mandalData.formatNum(item.amount, true) }}
                    </td>
                  </tr>
                }
                <!-- Surplus Row to Balance the Accounts -->
                <tr class="bg-blue-50/80 font-bold text-blue-900 border-t border-slate-300">
                  <td class="py-2.5 px-4 font-devanagari">
                    {{ mandalData.t('★ शिल्लक नफा / पुढील वर्षासाठी जमा (Surplus Carried Forward)', '★ Net Surplus Carried Forward to Next Year') }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-black text-blue-700">
                    {{ mandalData.formatNum(mandalData.kpi().balanceAmount, true) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-rose-100 font-black text-rose-900 border-t-2 border-rose-600 text-sm">
                  <td class="py-3 px-4 font-devanagari">{{ mandalData.t('खर्च बाजू एकूण (Equated Total)', 'Equated Total') }}</td>
                  <td class="py-3 px-4 text-right">{{ mandalData.formatNum(mandalData.kpi().totalVargani, true) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>

        <!-- Official Auditor Certification Note -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs font-devanagari text-slate-700 leading-relaxed">
          <div class="font-bold text-slate-900 text-sm mb-1">{{ mandalData.t('हिशोब तपासणीस प्रमाणपत्र (Auditor Certificate):', 'Auditor Certificate:') }}</div>
          {{ mandalData.isEnglish() ?
            ('We have thoroughly audited and examined all the books of accounts, bank passbook, receipts, and payment vouchers of Shree Ashtavinayak Mitra Mandal, Jogeshwari (West) for ' + mandalData.translateFestival(mandalData.selectedFestival()) + ' (' + mandalData.selectedYear() + '). All transactions have been executed with proper authorization and this balance sheet presents a true and fair view of the financial status.')
            :
            ('आम्ही श्री अष्टविनायक मित्र मंडळ, जोगेश्वरी (पश्चिम) च्या वर्ष ' + mandalData.toMarathiDigits(mandalData.selectedYear()) + ' मधील ' + mandalData.selectedFestival() + ' च्या जमा-खर्चाच्या सर्व नोंदी, बँक पासबुक, पावती पुस्तके आणि देयक व्हाउचर्सची सखोल तपासणी केली आहे. सर्व व्यवहार नियमांनुसार व अधिकृत मान्यतेने झाले असून हा ताळेबंद संस्थेच्या आर्थिक स्थितीचे अचूक आणि न्याय्य दर्शन घडवतो.')
          }}
        </div>


        <!-- 4 Signatures Block -->
        <div class="pt-8 border-t-2 border-slate-400 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-devanagari">
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">M. V. Kadam</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('अध्यक्ष', 'President') }}</div>
          </div>
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">S. C. Tambde</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.t('श्री. सचिन तांबडे', 'Shri Sachin Tambde') }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('कार्यवाह (चिटणीस)', 'Secretary') }}</div>
          </div>
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">R. B. Parab</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.t('श्री. राजेश परब', 'Shri Rajesh Parab') }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('खजिनदार', 'Treasurer') }}</div>
          </div>
          <div>
            <div class="italic font-serif text-slate-500 h-10 flex items-center justify-center">K. S. & Associates</div>
            <div class="font-bold text-slate-900 border-t border-slate-400 pt-1">{{ mandalData.t('सी.ए. के. एस. अँड असोसिएट्स', 'C.A. K. S. & Associates') }}</div>
            <div class="text-[11px] text-slate-500">{{ mandalData.t('मानद हिशोब तपासणीस', 'Hon. Auditor') }}</div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class JamaKharchComponent {
  readonly mandalData = inject(MandalDataService);

  printSheet() {
    window.print();
  }

  exportExcel() {
    this.mandalData.exportToExcel('balanceSheet');
  }
}
