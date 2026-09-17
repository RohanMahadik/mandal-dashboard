import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MandalDataService } from '../../services/mandal-data.service';

@Component({
  selector: 'app-add-vargani-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[95vh] flex flex-col overflow-hidden border border-amber-200" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white shrink-0">
          <div class="flex items-center space-x-2">
            <span class="text-lg sm:text-xl">✍️</span>
            <h3 class="text-base sm:text-lg font-bold font-devanagari">{{ mandalData.t('नवीन वर्गणी नोंदणी', 'Add New Donation Record') }}</h3>
          </div>
          <button (click)="close.emit()" class="text-white/80 hover:text-white p-1 rounded-md transition" aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Form Body -->
        <form (ngSubmit)="onSubmit()" class="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('नाव (मराठीत) *', 'Name (in Marathi) *') }}</label>
              <input type="text" [(ngModel)]="nameMr" name="nameMr" required [placeholder]="mandalData.t('उदा. रोहन महाडिक', 'e.g. Rohan Mahadik')" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-devanagari" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('नाव (इंग्रजीत) *', 'Name (in English) *') }}</label>
              <input type="text" [(ngModel)]="nameEn" name="nameEn" required placeholder="e.g. Rohan Mahadik" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('बिल्डिंग / पत्ता *', 'Building / Wing *') }}</label>
              <select [(ngModel)]="building" name="building" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                <option value="शिव स्फूर्ती 1">{{ mandalData.translateBuilding('शिव स्फूर्ती 1') }}</option>
                <option value="शिव स्फूर्ती 2">{{ mandalData.translateBuilding('शिव स्फूर्ती 2') }}</option>
                <option value="आदर्श नगर">{{ mandalData.translateBuilding('आदर्श नगर') }}</option>
                <option value="इतर">{{ mandalData.translateBuilding('इतर') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('रक्कम (₹) *', 'Amount (₹) *') }}</label>
              <input type="number" [(ngModel)]="amount" name="amount" required min="100" step="100" placeholder="5000" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('भरणा पद्धत', 'Payment Mode') }}</label>
              <select [(ngModel)]="paymentMode" name="paymentMode" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                <option value="UPI / GPay">UPI / GPay / QR</option>
                <option value="कॅश">{{ mandalData.t('कॅश (रोख)', 'Cash') }}</option>
                <option value="चेक">{{ mandalData.t('चेक (Cheque)', 'Cheque') }}</option>
                <option value="बँक ट्रान्सफर">{{ mandalData.t('बँक ट्रान्सफर', 'Bank Transfer') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('पावती स्थिती', 'Receipt Status') }}</label>
              <select [(ngModel)]="status" name="status" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                <option value="दिलेली">{{ mandalData.t('दिलेली (Issued)', 'Issued') }}</option>
                <option value="बाकी">{{ mandalData.t('बाकी (Pending)', 'Pending') }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('मोबाईल क्रमांक', 'Mobile Number') }}</label>
              <input type="tel" [(ngModel)]="phone" name="phone" [placeholder]="mandalData.t('उदा. 9820123456', 'e.g. 9820123456')" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('तारीख', 'Date') }}</label>
              <input type="text" [(ngModel)]="date" name="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">
              {{ mandalData.t('रद्द करा', 'Cancel') }}
            </button>
            <button type="submit" [disabled]="!nameMr || !amount" class="px-5 py-2 text-sm bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg shadow transition">
              {{ mandalData.t('नोंद जतन करा (Save)', 'Save Record') }}
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AddVarganiModalComponent {
  readonly mandalData = inject(MandalDataService);

  readonly close = output<void>();

  nameMr = '';
  nameEn = '';
  building = 'शिव स्फूर्ती 1';
  amount = 5000;
  paymentMode: 'कॅश' | 'UPI / GPay' | 'चेक' | 'बँक ट्रान्सफर' = 'UPI / GPay';
  status: 'दिलेली' | 'बाकी' = 'दिलेली';
  phone = '';
  date = '06/09/2026';

  onSubmit() {
    if (!this.nameMr || !this.amount) return;

    const receiptNo = this.status === 'दिलेली' ? `1000${Math.floor(10 + Math.random() * 90)}` : null;

    this.mandalData.addVargani({
      nameMr: this.nameMr,
      nameEn: this.nameEn || this.nameMr,
      building: this.building,
      amount: Number(this.amount),
      receiptNo: receiptNo,
      status: this.status,
      festival: this.mandalData.selectedFestival(),
      year: this.mandalData.selectedYear(),
      date: this.date,
      paymentMode: this.paymentMode,
      phone: this.phone
    });

    this.close.emit();
  }
}
