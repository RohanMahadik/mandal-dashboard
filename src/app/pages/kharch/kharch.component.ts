import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';
import { TransliterationService } from '../../services/transliteration.service';
import { KharchRecord } from '../../models/mandal.models';

@Component({
  selector: 'app-kharch',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-5 pb-8 animate-fade-in">
      
      <!-- Page Header & Stats Banner -->
      <div class="bg-gradient-to-r from-rose-900 via-red-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute -right-6 -bottom-8 opacity-10 text-9xl select-none font-bold">₹</div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <!-- Back to Dashboard Button -->
            <a
              routerLink="/"
              class="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-rose-100 hover:text-white border border-white/20 text-xs font-bold font-devanagari transition shadow-xs active:scale-95 cursor-pointer group"
              title="मुख्यपृष्ठावर परत जा / Back to Dashboard"
            >
              <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{{ mandalData.t('मुख्यपृष्ठावर जा', 'Back to Dashboard') }}</span>
            </a>

            <div class="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <span>●</span>
              <span>{{ mandalData.t('खर्च व्यवस्थापन व लेजर', 'Expense Management & Ledger') }}</span>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
              {{ mandalData.t('उत्सव खर्च तपशील नोंदवही', 'Festival Expenses Register') }}
            </h1>
            <p class="text-slate-300 text-xs md:text-sm mt-1">
              {{ activeFestivalSubtitle() }}
            </p>
          </div>

          <!-- Quick Stats Pill -->
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <div class="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 flex-1 sm:flex-none min-w-[120px]">
              <div class="text-[10.5px] sm:text-[11px] text-rose-200">{{ mandalData.t('एकूण खर्च', 'Total Expenses') }}</div>
              <div class="text-lg sm:text-xl font-black text-white">{{ mandalData.formatNum(totalFestivalAmount(), true) }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 flex-1 sm:flex-none min-w-[120px]">
              <div class="text-[10.5px] sm:text-[11px] text-rose-200">{{ mandalData.t('एकूण व्हाउचर्स / वर्गवारी', 'Total Vouchers / Heads') }}</div>
              <div class="text-lg sm:text-xl font-black text-white">
                {{ mandalData.formatNum(filteredList().length) }} {{ mandalData.t('व्हाउचर्स', 'vouchers') }}
                <span class="text-xs font-normal text-rose-200 block sm:inline">({{ categoryCount() }} {{ mandalData.t('वर्गवारी', 'heads') }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Festival Quick Selector Bar (Ganesh vs Navratri vs Joint) -->
      <div class="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 rounded-xl p-3 border border-rose-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-900 font-devanagari">🚩 {{ mandalData.t('उत्सव खर्च निवडा:', 'Select Festival Expenses:') }}</span>
          <span class="text-xs text-rose-800 font-devanagari hidden sm:inline">
            {{ mandalData.t('(गणेशोत्सवात गणेशोत्सवाचा व नवरात्रीत नवरात्रीचा खर्च दिसेल)', '(Shows Ganesh Utsav in Ganesh and Navratri in Navratri)') }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Ganesh Utsav Button -->
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

          <!-- Navratri Button -->
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

          <!-- Joint Button -->
          <button
            (click)="selectFestival('संयुक्त (गणेशोत्सव व नवरात्र)')"
            class="px-3 py-1.5 rounded-xl font-bold font-devanagari text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            [ngClass]="isJointActive() ? 'bg-indigo-700 text-white ring-2 ring-indigo-400' : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300'"
          >
            <span>⚖️</span>
            <span>{{ mandalData.t('दोन्ही उत्सव एकत्र (संयुक्त)', 'Joint Expenses') }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" [ngClass]="isJointActive() ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-600'">
              {{ mandalData.formatNum(jointTotalExp(), true) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Category Summary Cards (from Detail Sheet / Computed Distribution) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700 font-devanagari px-1">
          <span>📊 {{ mandalData.t('अधिकृत वर्गवारीनुसार खर्च सारांश', 'Audited Expense Distribution by Head') }}</span>
          <span class="text-slate-500 font-normal">({{ mandalData.expenseDistribution().length }} {{ mandalData.t('प्रमुख खर्च शिर्षके', 'expense categories') }})</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
          @for (item of mandalData.expenseDistribution(); track item.category) {
            <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition">
              <div class="flex items-center justify-between">
                <span class="w-3 h-3 rounded-full inline-block shrink-0 shadow-xs" [style.backgroundColor]="item.color"></span>
                <span class="text-[10px] text-slate-500 font-sans font-bold">
                  {{ mandalData.formatNum(getPercent(item.amount)) }}%
                </span>
              </div>
              <div class="mt-2 min-w-0">
                <div class="text-xs font-bold text-slate-700 font-devanagari truncate" [title]="mandalData.translateCategory(item.category)">
                  {{ mandalData.translateCategory(item.category) }}
                </div>
                <div class="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                  {{ mandalData.formatNum(item.amount, true) }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Action Bar: Search & View Toggle -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-3.5 sm:p-4 space-y-3">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <!-- View Toggle -->
          <div class="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs font-devanagari self-start">
            <button
              (click)="viewTab.set('vouchers')"
              class="px-3 py-1.5 rounded-md font-bold transition cursor-pointer"
              [ngClass]="viewTab() === 'vouchers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              📑 {{ mandalData.t('व्हाउचर्स नोंदवही', 'Voucher Ledger') }} ({{ filteredList().length }})
            </button>
            <button
              (click)="viewTab.set('categories')"
              class="px-3 py-1.5 rounded-md font-bold transition cursor-pointer"
              [ngClass]="viewTab() === 'categories' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              📊 {{ mandalData.t('वर्गवारी ताळेबंद तपशील', 'Category Statement') }}
            </button>
          </div>

          <!-- Bilingual Search Bar -->
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              [placeholder]="mandalData.t('खर्चाचे नाव किंवा वर्गवारी शोधा...', 'Search expense name or category...')"
              class="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-devanagari transition"
            />
            @if (searchQuery()) {
              <button (click)="searchQuery.set('')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 font-bold text-xs">
                ✕
              </button>
            }
          </div>

          <div class="flex items-center gap-2">
            <a
              routerLink="/jama-kharch"
              class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold font-devanagari transition shadow-2xs flex items-center gap-1.5"
            >
              <span>📋</span>
              <span>{{ mandalData.t('संपूर्ण ताळेबंद पत्रक पहा', 'View Full Balance Sheet') }}</span>
            </a>
            <button
              (click)="exportExcel()"
              class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥</span>
              <span>Excel</span>
            </button>
          </div>

        </div>
      </div>

      <!-- ================= 1. TAB: VOUCHERS LEDGER ================= -->
      @if (viewTab() === 'vouchers') {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          
          <div class="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="font-bold text-slate-700 font-devanagari">
              {{ mandalData.t('एकूण नोंदी', 'Total Entries') }}: <span class="text-rose-700 font-extrabold">{{ mandalData.formatNum(filteredList().length) }}</span>
            </div>
            <div class="text-slate-500 font-devanagari">
              {{ mandalData.t('एकूण खर्च रक्कम', 'Total Expenses') }}: <span class="text-slate-900 font-bold text-sm">{{ mandalData.formatNum(totalFilteredAmount(), true) }}</span>
            </div>
          </div>

          <!-- Table View (Visible on both Mobile & Desktop) -->
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[650px]">
              <thead>
                <tr class="bg-[#f1f5f9] text-slate-700 font-bold font-devanagari border-b border-slate-200">
                  <th class="py-3 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                  <th class="py-3 px-4">{{ mandalData.t('खर्चाचे नाव', 'Expense Name') }}</th>
                  <th class="py-3 px-4">{{ mandalData.t('प्रकार (Category)', 'Category') }}</th>
                  <th class="py-3 px-4 text-right">{{ mandalData.t('रक्कम', 'Amount') }}</th>
                  <th class="py-3 px-4 text-center">{{ mandalData.t('उत्सव', 'Festival') }}</th>
                  <th class="py-3 px-4 text-center">{{ mandalData.t('कृती', 'Action') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (row of filteredList(); track row.id) {
                  <tr class="hover:bg-rose-50/30 transition">
                    <td class="py-3 px-3 text-center text-slate-500 font-medium">{{ mandalData.formatNum(row.srNo) }}</td>
                    <td class="py-3 px-4 font-bold text-slate-800 font-devanagari">
                      @if (mandalData.isEnglish()) {
                        <div class="text-sm font-bold">{{ row.nameEn || row.nameMr }}</div>
                        <div class="text-[11px] text-slate-400 font-normal font-devanagari">{{ row.nameMr }}</div>
                      } @else {
                        <div class="text-sm font-bold">{{ row.nameMr }}</div>
                        @if (row.nameEn) {
                          <div class="text-[11px] text-slate-400 font-normal font-sans">{{ row.nameEn }}</div>
                        }
                      }
                      @if (row.description) {
                        <div class="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                          {{ row.description }}
                        </div>
                      }
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-devanagari text-[11px]">
                        {{ mandalData.translateCategory(row.category) }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right font-black text-sm text-slate-900">
                      {{ mandalData.formatNum(row.amount, true) }}
                    </td>
                    <td class="py-3 px-4 text-center">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="row.festival.includes('गणेश') ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'">
                        {{ row.festival.includes('गणेश') ? '🪔 गणेशोत्सव' : '🔱 नवरात्र' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <button
                        (click)="viewVoucher(row)"
                        class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold rounded-md transition text-[11px] cursor-pointer"
                      >
                        {{ mandalData.t('तपशील', 'Details') }}
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="text-center py-8 text-slate-400 font-devanagari text-sm">
                      {{ mandalData.t('कोणताही खर्च आढळला नाही.', 'No expenses found.') }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

        </div>
      } @else {
        <!-- ================= 2. TAB: CATEGORY STATEMENT ================= -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h3 class="font-bold text-slate-900 font-devanagari text-sm">
              📊 {{ mandalData.t('अधिकृत ताळेबंद वर्गवारी तपशील (Excel Detail Sheet)', 'Audited Category Breakdown (from Detail Sheet)') }}
            </h3>
            <span class="text-xs text-rose-800 font-bold font-devanagari">
              {{ mandalData.t('एकूण खर्च:', 'Total Expenditure:') }} {{ mandalData.formatNum(totalFestivalAmount(), true) }}
            </span>
          </div>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-slate-100 font-bold text-slate-700 font-devanagari border-b border-slate-200">
                  <th class="py-2.5 px-4 text-center w-12">#</th>
                  <th class="py-2.5 px-4 text-left">{{ mandalData.t('खर्च शिर्षक / वर्गवारी', 'Expense Category') }}</th>
                  <th class="py-2.5 px-4 text-right">{{ mandalData.t('रक्कम (₹)', 'Amount (₹)') }}</th>
                  <th class="py-2.5 px-4 text-center">{{ mandalData.t('टक्केवारी', 'Share %') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                @for (cat of mandalData.expenseDistribution(); track cat.category; let idx = $index) {
                  <tr class="hover:bg-slate-50 transition">
                    <td class="py-2.5 px-4 text-center text-slate-400 font-medium">{{ idx + 1 }}</td>
                    <td class="py-2.5 px-4 font-bold text-slate-900 font-devanagari flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full inline-block shrink-0" [style.backgroundColor]="cat.color"></span>
                      <span>{{ cat.category }}</span>
                    </td>
                    <td class="py-2.5 px-4 text-right font-black text-slate-900">
                      {{ mandalData.formatNum(cat.amount, true) }}
                    </td>
                    <td class="py-2.5 px-4 text-center font-bold text-slate-600 font-mono">
                      {{ mandalData.formatNum(getPercent(cat.amount)) }}%
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr class="bg-rose-100 font-black text-rose-950 border-t-2 border-rose-500 text-xs sm:text-sm">
                  <td colspan="2" class="py-3 px-4 font-devanagari">{{ mandalData.t('एकूण उत्सव खर्च', 'Total Expenditure') }}</td>
                  <td class="py-3 px-4 text-right font-black">{{ mandalData.formatNum(totalFestivalAmount(), true) }}</td>
                  <td class="py-3 px-4 text-center font-mono">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      }

    </div>

    <!-- Voucher Preview Modal -->
    @if (selectedVoucher(); as v) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="selectedVoucher.set(null)">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[95vh] flex flex-col overflow-hidden border border-rose-200" (click)="$event.stopPropagation()">
          
          <div class="px-4 py-3 sm:px-6 sm:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-rose-400 font-bold text-sm sm:text-base">{{ mandalData.t('॥ अधिकृत खर्च पावती तपशील ॥', '॥ Official Expense Details ॥') }}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 font-mono">#{{ mandalData.formatNum(v.srNo || v.id) }}</span>
            </div>
            <button (click)="selectedVoucher.set(null)" class="text-slate-400 hover:text-white p-1" aria-label="Close modal">✕</button>
          </div>

          <div class="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs font-devanagari overflow-y-auto">
            <div class="text-center border-b pb-3">
              <h3 class="font-bold text-base sm:text-lg text-rose-800">{{ mandalData.t('श्री अष्टविनायक मित्र मंडळ, जोगेश्वरी (पश्चिम)', 'Shree Ashtavinayak Mitra Mandal, Jogeshwari (West)') }}</h3>
              <p class="text-slate-500 text-[10px] sm:text-[11px]">{{ mandalData.t('अधिकृत खर्च देयक पावती', 'Official Payment Receipt') }}</p>
            </div>

            <div class="grid grid-cols-2 gap-2 sm:gap-3">
              <div><span class="text-slate-500 text-[11px]">{{ mandalData.t('नोंद क्र:', 'Entry No:') }}</span> <b class="text-rose-700 font-mono text-xs sm:text-sm ml-1">#{{ mandalData.formatNum(v.srNo || v.id) }}</b></div>
              <div class="text-right"><span class="text-slate-500 text-[11px]">{{ mandalData.t('तारीख:', 'Date:') }}</span> <b class="ml-1">{{ mandalData.formatNum(v.date) }}</b></div>
            </div>

            <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 sm:space-y-2">
              <div><span class="text-slate-500">{{ mandalData.t('खर्चाचे नाव:', 'Expense:') }}</span> <b class="text-xs sm:text-sm text-slate-900 ml-1">{{ mandalData.isEnglish() ? (v.nameEn || v.nameMr) : v.nameMr }}</b></div>
              <div><span class="text-slate-500">{{ mandalData.t('वर्गवारी:', 'Category:') }}</span> <b class="ml-1">{{ mandalData.translateCategory(v.category) }}</b></div>
              <div><span class="text-slate-500">{{ mandalData.t('उत्सव:', 'Festival:') }}</span> <b class="text-slate-800 ml-1">{{ v.festival }}</b></div>
              @if (v.description) {
                <div><span class="text-slate-500">{{ mandalData.t('तपशील:', 'Description:') }}</span> <span class="text-slate-700 ml-1">{{ v.description }}</span></div>
              }
            </div>

            <div class="flex items-center justify-between p-2.5 sm:p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <span class="font-bold text-rose-900 text-xs sm:text-sm">{{ mandalData.t('एकूण अदा रक्कम:', 'Total Paid Amount:') }}</span>
              <span class="text-lg sm:text-xl font-black text-rose-700">{{ mandalData.formatNum(v.amount, true) }}</span>
            </div>

            <div class="pt-3 sm:pt-4 border-t flex justify-between items-end text-center">
              <div>
                <div class="italic text-slate-400 font-serif mb-1 text-xs">Signed</div>
                <div class="text-[10px] sm:text-[11px] font-bold text-slate-700">{{ mandalData.t('स्वीकारणारा / पुरवठादार', 'Receiver / Vendor') }}</div>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-dashed border-rose-400 flex items-center justify-center text-[7px] sm:text-[8px] text-rose-600 font-bold rotate-[-10deg]">
                {{ mandalData.t('तपासले व मंजूर', 'Verified') }}
              </div>
              <div>
                <div class="italic text-slate-400 font-serif mb-1 text-xs">{{ mandalData.t(v.approvedBy || 'खजिनदार', 'Treasurer') }}</div>
                <div class="text-[10px] sm:text-[11px] font-bold text-slate-700">{{ mandalData.t('अधिकृत मंजुरी', 'Authorized By') }}</div>
              </div>
            </div>

          </div>

          <div class="bg-slate-50 px-4 py-2.5 sm:px-6 sm:py-3 border-t flex justify-end gap-2 shrink-0">
            <button (click)="selectedVoucher.set(null)" class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg">
              {{ mandalData.t('बंद करा', 'Close') }}
            </button>
            <button (click)="printVoucher()" class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700">
              {{ mandalData.t('प्रिंट पावती', 'Print Receipt') }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class KharchComponent {
  readonly mandalData = inject(MandalDataService);
  private transliteration = inject(TransliterationService);

  readonly searchQuery = signal<string>('');
  readonly selectedVoucher = signal<KharchRecord | null>(null);
  readonly viewTab = signal<'vouchers' | 'categories'>('vouchers');

  readonly isJointActive = computed(() => this.mandalData.selectedFestival().includes('संयुक्त') || this.mandalData.selectedFestival().includes('Joint'));
  readonly isGaneshActive = computed(() => !this.isJointActive() && this.mandalData.selectedFestival().includes('गणेश'));
  readonly isNavratriActive = computed(() => !this.isJointActive() && this.mandalData.selectedFestival().includes('नवरात्र'));

  readonly ganeshTotalExp = computed(() => this.mandalData.detailedBalanceSheetData()?.ganesh.totalExpenses || 449189);
  readonly navratriTotalExp = computed(() => this.mandalData.detailedBalanceSheetData()?.navratri.totalExpenses || 354457);
  readonly jointTotalExp = computed(() => this.mandalData.detailedBalanceSheetData()?.joint.totalExpenses || 803646);

  readonly activeFestivalSubtitle = computed(() => {
    const yr = this.mandalData.toMarathiDigits(this.mandalData.selectedYear());
    const fest = this.mandalData.translateFestival(this.mandalData.selectedFestival());
    if (this.isGaneshActive()) {
      return `सार्वजनिक गणेशोत्सव (वर्ष ${yr}) मधील सर्व अधिकृत खर्च नोंदी व ताळेबंद तपशील`;
    } else if (this.isNavratriActive()) {
      return `श्री नवरात्र उत्सव (वर्ष ${yr}) मधील सर्व अधिकृत खर्च नोंदी व ताळेबंद तपशील`;
    } else {
      return `गणेशोत्सव व नवरात्रोत्सव संयुक्त ताळेबंद (वर्ष ${yr}) - सर्व अधिकृत खर्च`;
    }
  });

  readonly filteredList = computed(() => {
    let list = this.mandalData.currentKharch();
    const query = this.searchQuery().trim();

    if (query) {
      list = list.filter(item => this.transliteration.matches(query, item));
    }

    return list;
  });

  readonly totalFilteredAmount = computed(() => {
    return this.filteredList().reduce((sum, item) => sum + item.amount, 0);
  });

  readonly totalFestivalAmount = computed(() => {
    const det = this.mandalData.currentDetailedSheet();
    return det?.totalExpenses || this.totalFilteredAmount();
  });

  readonly categoryCount = computed(() => {
    return this.mandalData.expenseDistribution().length;
  });

  getPercent(amount: number): number {
    const total = this.totalFestivalAmount();
    return total > 0 ? Math.round((amount / total) * 100) : 0;
  }

  selectFestival(festival: string) {
    this.mandalData.setFestival(festival);
    this.searchQuery.set('');
  }

  viewVoucher(record: KharchRecord) {
    this.selectedVoucher.set(record);
  }

  printVoucher() {
    window.print();
  }

  exportExcel() {
    this.mandalData.exportToExcel('kharch');
  }
}
