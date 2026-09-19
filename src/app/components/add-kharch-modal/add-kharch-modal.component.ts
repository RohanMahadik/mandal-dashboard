import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MandalDataService } from '../../services/mandal-data.service';

@Component({
  selector: 'app-add-kharch-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[95vh] flex flex-col overflow-hidden border border-rose-200" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white shrink-0">
          <div class="flex items-center space-x-2">
            <span class="text-lg sm:text-xl">🧾</span>
            <h3 class="text-base sm:text-lg font-bold font-devanagari">{{ mandalData.t('नवीन खर्च नोंदणी', 'Add New Expense Record') }}</h3>
          </div>
          <button (click)="close.emit()" class="text-white/80 hover:text-white p-1 rounded-md transition" aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Form Body -->
        <form (ngSubmit)="onSubmit()" class="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('खर्चाचे नाव (मराठीत) *', 'Expense Title (in Marathi) *') }}</label>
              <input type="text" [(ngModel)]="nameMr" name="nameMr" required [placeholder]="mandalData.t('उदा. मंडप डेकोरेशन', 'e.g. Mandap Decoration')" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-devanagari" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('खर्चाचे नाव (इंग्रजीत) *', 'Expense Title (in English) *') }}</label>
              <input type="text" [(ngModel)]="nameEn" name="nameEn" required placeholder="e.g. Mandap Decoration" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('खर्च प्रकार (Category) *', 'Category *') }}</label>
              <select [(ngModel)]="category" name="category" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                <option value="मूर्ती व प्रतिष्ठापना">{{ mandalData.translateCategory('मूर्ती व प्रतिष्ठापना') }}</option>
                <option value="मंडप व्यवस्था">{{ mandalData.translateCategory('मंडप व्यवस्था') }}</option>
                <option value="स्पायरो व तांत्रिक यंत्रणा">{{ mandalData.translateCategory('स्पायरो व तांत्रिक यंत्रणा') }}</option>
                <option value="गिफ्ट्स व पारितोषिके">{{ mandalData.translateCategory('गिफ्ट्स व पारितोषिके') }}</option>
                <option value="इतर खर्च">{{ mandalData.translateCategory('इतर खर्च') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('रक्कम (₹) *', 'Amount (₹) *') }}</label>
              <input type="number" [(ngModel)]="amount" name="amount" required min="100" step="100" placeholder="20000" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold text-rose-700" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('ज्याला दिले ते नाव (Payee) *', 'Paid To (Payee) *') }}</label>
              <input type="text" [(ngModel)]="paidTo" name="paidTo" required [placeholder]="mandalData.t('उदा. स्वास्तिक डेकोरेटर्स', 'e.g. Swastik Decorators')" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('तारीख *', 'Date *') }}</label>
              <input type="text" [(ngModel)]="date" name="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">{{ mandalData.t('खर्च तपशील (Description)', 'Expense Description') }}</label>
            <textarea [(ngModel)]="description" name="description" rows="2" [placeholder]="mandalData.t('खर्चाचे सविस्तर वर्णन...', 'Detailed description of the expense...')" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"></textarea>
          </div>

          <div class="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <span>✓</span>
            <span>{{ mandalData.t('खर्चाची नोंद अधिकृत ताळेबंदात स्वयंचलित समाविष्ट होईल.', 'Expense will be automatically recorded in official ledger.') }}</span>
          </div>

          <!-- Footer Buttons -->
          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">
              {{ mandalData.t('रद्द करा', 'Cancel') }}
            </button>
            <button type="submit" [disabled]="!nameMr || !amount || !paidTo" class="px-5 py-2 text-sm bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-lg shadow transition">
              {{ mandalData.t('खर्च जतन करा (Save Expense)', 'Save Expense') }}
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AddKharchModalComponent {
  readonly mandalData = inject(MandalDataService);

  readonly close = output<void>();

  nameMr = '';
  nameEn = '';
  category = 'इतर खर्च';
  amount = 10000;
  paidTo = '';
  date = '05/09/2026';
  description = '';

  onSubmit() {
    if (!this.nameMr || !this.amount || !this.paidTo) return;

    const voucherNo = `V-${this.mandalData.selectedYear()}-0${Math.floor(13 + Math.random() * 20)}`;

    this.mandalData.addKharch({
      nameMr: this.nameMr,
      nameEn: this.nameEn || this.nameMr,
      category: this.category,
      amount: Number(this.amount),
      date: this.date,
      voucherNo: voucherNo,
      festival: this.mandalData.selectedFestival(),
      year: this.mandalData.selectedYear(),
      paidTo: this.paidTo,
      description: this.description,
      approvedBy: 'राजेश परब (खजिनदार)'
    });

    this.close.emit();
  }
}
