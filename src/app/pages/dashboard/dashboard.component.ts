import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MandalDataService } from '../../services/mandal-data.service';
import { TransliterationService } from '../../services/transliteration.service';
import { LoadingService } from '../../services/loading.service';
import { DashboardChartsComponent } from '../../components/dashboard-charts/dashboard-charts.component';
import { ReceiptModalComponent } from '../../components/receipt-modal/receipt-modal.component';
import { AddVarganiModalComponent } from '../../components/add-vargani-modal/add-vargani-modal.component';
import { AddKharchModalComponent } from '../../components/add-kharch-modal/add-kharch-modal.component';
import { VarganiRecord } from '../../models/mandal.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DashboardChartsComponent,
    ReceiptModalComponent,
    AddVarganiModalComponent,
    AddKharchModalComponent
  ],
  template: `
    <div class="flex flex-col gap-4 md:gap-5 pb-6">
      
      <!-- Top Filter Bar & Dedicated Connect Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-transparent py-0">
        
        <div class="flex flex-wrap items-center gap-3 sm:gap-5">
          <!-- Year Selector -->
          <div class="flex items-center gap-2">
            <label for="yearSelect" class="text-xs sm:text-sm font-bold text-slate-800 font-devanagari shrink-0">
              {{ mandalData.t('वर्ष निवडा', 'Select Year') }}
            </label>
            <div class="relative">
              <select
                id="yearSelect"
                [ngModel]="mandalData.selectedYear()"
                (ngModelChange)="onYearChange($event)"
                class="appearance-none bg-white border border-slate-300 rounded-lg px-3 py-1.5 pr-7 sm:px-4 sm:py-2 sm:pr-8 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                @for (y of mandalData.availableYears; track y) {
                  <option [value]="y">{{ mandalData.toMarathiDigits(y) }}</option>
                }
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2 text-slate-500">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <!-- Festival Selector -->
          <div class="flex items-center gap-2">
            <label for="festSelect" class="text-xs sm:text-sm font-bold text-slate-800 font-devanagari shrink-0">
              {{ mandalData.t('उत्सव निवडा', 'Select Festival') }}
            </label>
            <div class="relative">
              <select
                id="festSelect"
                [ngModel]="mandalData.selectedFestival()"
                (ngModelChange)="onFestivalChange($event)"
                class="appearance-none bg-white border border-slate-300 rounded-lg px-3 py-1.5 pr-7 sm:px-4 sm:py-2 sm:pr-8 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-devanagari"
              >
                @for (f of mandalData.availableFestivals; track f) {
                  <option [value]="f">{{ mandalData.translateFestival(f) }}</option>
                }
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2 text-slate-500">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Dedicated "Connect & Support / Key Contacts" Button -->
        <a
          routerLink="/connect"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer font-devanagari group shrink-0"
        >
          <span class="text-base group-hover:scale-110 transition-transform">🤝</span>
          <span>{{ mandalData.t('महत्त्वाचे संपर्क व सहकार्य', 'Important Contacts & Support') }}</span>
          <span class="px-2 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-sans font-extrabold uppercase tracking-wide">
            {{ mandalData.t('मदत कक्ष', 'Desk') }}
          </span>
          <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </a>

      </div>

      <!-- ================= 6. ADVERTISEMENT SLIDER BANNER ================= -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-md border border-amber-300/50 select-none group"
        (mouseenter)="pauseSlider()"
        (mouseleave)="resumeSlider()"
      >
        @let ad = currentAd();
        <div
          class="p-4 sm:p-5 text-white bg-gradient-to-r flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500"
          [ngClass]="ad.bgGradient"
        >
          <!-- Content Left -->
          <div class="space-y-1 text-center md:text-left flex-1 min-w-0">
            <div class="inline-flex items-center gap-2 flex-wrap justify-center md:justify-start">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider">
                📢 {{ mandalData.t('प्रायोजक जाहिरात', 'Featured Sponsor') }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                {{ mandalData.isEnglish() ? ad.categoryEn : ad.categoryMr }}
              </span>
            </div>

            <h2 class="text-lg sm:text-2xl font-black font-devanagari tracking-tight text-white drop-shadow-sm leading-tight">
              {{ mandalData.isEnglish() ? ad.sponsorNameEn : ad.sponsorNameMr }}
            </h2>

            <p class="text-xs sm:text-sm text-amber-100 font-devanagari max-w-2xl leading-snug">
              {{ mandalData.isEnglish() ? ad.taglineEn : ad.taglineMr }}
            </p>

            <div class="text-[11px] text-slate-300 flex items-center justify-center md:justify-start gap-1 font-devanagari pt-0.5">
              <span>📍</span>
              <span class="truncate">{{ mandalData.isEnglish() ? ad.addressEn : ad.addressMr }}</span>
            </div>
          </div>

          <!-- Right Action & Offer Badge -->
          <div class="flex flex-col items-center md:items-end gap-2 shrink-0">
            <div class="px-3 py-1 rounded-xl bg-yellow-400 text-amber-950 font-black text-xs font-devanagari shadow-sm border border-yellow-300">
              ⭐ {{ mandalData.isEnglish() ? ad.offerBadgeEn : ad.offerBadgeMr }}
            </div>
            <a
              [href]="'tel:' + ad.phone"
              class="px-4 py-2 bg-white hover:bg-amber-50 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>📞</span>
              <span class="font-mono font-bold">{{ ad.phone }}</span>
            </a>
          </div>
        </div>

        <!-- Slider Controls: Prev / Next Buttons -->
        <button
          (click)="prevAd()"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition opacity-70 group-hover:opacity-100 cursor-pointer shadow"
          title="मागील जाहिरात / Previous Ad"
          aria-label="Previous Ad"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <button
          (click)="nextAd()"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition opacity-70 group-hover:opacity-100 cursor-pointer shadow"
          title="पुढील जाहिरात / Next Ad"
          aria-label="Next Ad"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>

        <!-- Slider Dot Indicators -->
        <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          @for (adItem of mandalData.advertisementBanners; track adItem.id; let idx = $index) {
            <button
              (click)="goToAd(idx)"
              class="h-1.5 rounded-full transition-all cursor-pointer"
              [ngClass]="currentAdIndex() === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'"
              [attr.aria-label]="'Go to ad ' + (idx + 1)"
            ></button>
          }
        </div>
      </div>

      <!-- 4 Summary KPI Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        <!-- Card 1: एकूण वर्गणी -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 flex items-center justify-between">
          <div class="flex items-center gap-3 sm:gap-3.5 w-full">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold text-slate-600 font-devanagari">{{ mandalData.t('एकूण वर्गणी', 'Total Vargani') }}</div>
              <div class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate">
                {{ mandalData.formatNum(mandalData.kpi().totalVargani, true) }}
              </div>
              <div class="text-[11px] text-slate-500 font-devanagari mt-0.5 truncate">
                {{ mandalData.t('एकूण', 'Total') }} {{ mandalData.formatNum(mandalData.kpi().totalMembers) }} {{ mandalData.t('सभासद', 'Members') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: एकूण खर्च -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 flex items-center justify-between">
          <div class="flex items-center gap-3 sm:gap-3.5 w-full">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#ef4444] shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold text-slate-600 font-devanagari">{{ mandalData.t('एकूण खर्च', 'Total Expenses') }}</div>
              <div class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate">
                {{ mandalData.formatNum(mandalData.kpi().totalKharch, true) }}
              </div>
              <div class="text-[11px] text-slate-500 font-devanagari mt-0.5 truncate">
                {{ mandalData.t('एकूण', 'Total') }} {{ mandalData.formatNum(mandalData.kpi().totalKharchEntries) }} {{ mandalData.t('खर्च नोंदी', 'Expense Entries') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: शिल्लक रक्कम -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 flex items-center justify-between">
          <div class="flex items-center gap-3 sm:gap-3.5 w-full">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#2563eb] shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold text-slate-600 font-devanagari">{{ mandalData.t('शिल्लक रक्कम', 'Balance Amount') }}</div>
              <div class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate">
                {{ mandalData.formatNum(mandalData.kpi().balanceAmount, true) }}
              </div>
              <div class="text-[11px] text-slate-500 font-devanagari mt-0.5 truncate">
                {{ mandalData.t('नक्त शिल्लक गंगाजळी', 'Net Cash Reserve') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: पावती दिलेली with progress bar -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 flex items-center justify-between">
          <div class="flex items-center gap-3 sm:gap-3.5 w-full">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#ea580c] shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold text-slate-600 font-devanagari">{{ mandalData.t('पावती दिलेली', 'Receipts Issued') }}</div>
              <div class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate">
                {{ mandalData.toMarathiDigits(mandalData.kpi().receiptsIssued) }} / {{ mandalData.toMarathiDigits(mandalData.kpi().totalReceipts) }}
              </div>
              
              <!-- Progress Bar -->
              <div class="flex items-center gap-2 mt-1">
                <div class="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-[#2563eb] h-1.5 rounded-full" [style.width.%]="mandalData.kpi().receiptPercent"></div>
                </div>
                <span class="text-[11px] font-bold text-slate-600 shrink-0">
                  {{ mandalData.toMarathiDigits(mandalData.kpi().receiptPercent) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 3 Visual Charts Component -->
      <app-dashboard-charts class="block w-full"></app-dashboard-charts>

      <!-- 2 Quick Tables: वर्गणी यादी (Left) & खर्च यादी (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
        
        <!-- Table 1: वर्गणी यादी (Left 7 Cols) -->
        <div class="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 md:p-5 flex flex-col justify-between">
          
          <!-- Title Row with Icon & "सर्व पहा →" -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-slate-800">
              <div class="text-[#10b981]">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 class="text-sm sm:text-base font-bold font-devanagari">{{ mandalData.t('वर्गणी यादी', 'Vargani Donations') }}</h3>
            </div>
            <a routerLink="/vargani" class="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 font-devanagari transition">
              {{ mandalData.t('सर्व पहा →', 'View All →') }}
            </a>
          </div>

          <!-- Quick Filters: Search, Building, Receipt -->
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3 items-center">
            
            <!-- Bilingual Search Input -->
            <div class="sm:col-span-6 relative">
              <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                [placeholder]="mandalData.t('नाव शोधा... (उदा. Rohan, Patil, शिव)', 'Search name... (e.g. Rohan, Patil, Shiv)')"
                class="w-full pl-8 pr-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-devanagari"
              />
            </div>

            <!-- Building Selector -->
            <div class="sm:col-span-3 flex items-center gap-1.5">
              <span class="text-[11px] font-bold text-slate-600 font-devanagari shrink-0">{{ mandalData.t('बिल्डिंग', 'Building') }}</span>
              <select
                [ngModel]="selectedBuildingFilter()"
                (ngModelChange)="selectedBuildingFilter.set($event)"
                class="w-full py-1.5 px-2 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-devanagari"
              >
                @for (b of mandalData.buildingsList; track b) {
                  <option [value]="b">{{ mandalData.translateBuilding(b) }}</option>
                }
              </select>
            </div>

            <!-- Receipt Status Selector -->
            <div class="sm:col-span-3 flex items-center gap-1.5">
              <span class="text-[11px] font-bold text-slate-600 font-devanagari shrink-0">{{ mandalData.t('पावती', 'Status') }}</span>
              <select
                [ngModel]="selectedReceiptFilter()"
                (ngModelChange)="selectedReceiptFilter.set($event)"
                class="w-full py-1.5 px-2 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-devanagari"
              >
                @for (s of mandalData.receiptStatusList; track s) {
                  <option [value]="s">{{ mandalData.translateStatus(s) }}</option>
                }
              </select>
            </div>

          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto w-full -mx-1 sm:mx-0">
            <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[500px]">
              <thead>
                <tr class="bg-[#f1f5f9] text-slate-700 font-bold font-devanagari border-b border-slate-200">
                  <th class="py-2.5 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('नाव', 'Name') }}</th>
                  <th class="py-2.5 px-3">
                    <span class="inline-flex items-center gap-1">
                      {{ mandalData.t('रक्कम', 'Amount') }}
                      <span class="text-emerald-700 font-bold" [title]="mandalData.t('सर्वाधिक ते किमान रक्कम क्रमाने', 'Highest to lowest amount')">↓</span>
                    </span>
                  </th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('पावती क्र.', 'Receipt No.') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('पावती', 'Status') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (row of quickVarganiRows(); track row.id; let idx = $index) {
                  <tr class="hover:bg-amber-50/40 transition cursor-pointer" (click)="openReceipt(row)">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-medium">{{ mandalData.toMarathiDigits(idx + 1) }}</td>
                    <td class="py-2.5 px-3 font-semibold text-slate-800 font-devanagari">
                      {{ mandalData.isEnglish() ? row.nameEn : row.nameMr }}
                      <span class="block text-[10px] text-slate-400 font-normal font-sans">{{ mandalData.isEnglish() ? row.nameMr : row.nameEn }}</span>
                    </td>
                    <td class="py-2.5 px-3 text-slate-600 font-devanagari">{{ mandalData.translateBuilding(row.building) }}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-900">{{ mandalData.formatNum(row.amount, true) }}</td>
                    <td class="py-2.5 px-3 text-center text-slate-600 font-mono">
                      {{ row.receiptNo ? mandalData.toMarathiDigits(row.receiptNo) : '-' }}
                    </td>
                    <td class="py-2.5 px-3 text-center">
                      @if (row.status === 'दिलेली') {
                        <span class="badge-green">{{ mandalData.translateStatus('दिलेली') }}</span>
                      } @else {
                        <span class="badge-red">{{ mandalData.translateStatus('बाकी') }}</span>
                      }
                    </td>
                  </tr>
                }
                @if (quickVarganiRows().length === 0) {
                  <tr>
                    <td colspan="6" class="py-6 text-center text-slate-400 font-devanagari">
                      {{ mandalData.t('कोणतीही नोंद आढळली नाही.', 'No records found.') }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

        </div>

        <!-- Table 2: खर्च यादी (Right 5 Cols - Compact Top Alignment) -->
        <div class="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 md:p-5 flex flex-col justify-start">
          
          <!-- Title Row with Icon & "सर्व पहा →" -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-slate-800">
              <div class="text-[#f97316]">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
              </div>
              <h3 class="text-sm sm:text-base font-bold font-devanagari">{{ mandalData.t('खर्च यादी', 'Expenses List') }}</h3>
            </div>
            <a routerLink="/kharch" class="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 font-devanagari transition">
              {{ mandalData.t('सर्व पहा →', 'View All →') }}
            </a>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto w-full -mx-1 sm:mx-0">
            <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[340px]">
              <thead>
                <tr class="bg-[#f1f5f9] text-slate-700 font-bold font-devanagari border-b border-slate-200">
                  <th class="py-2.5 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('खर्चाचे नाव', 'Expense Name') }}</th>
                  <th class="py-2.5 px-3 text-right">{{ mandalData.t('रक्कम', 'Amount') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('तारीख', 'Date') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (row of quickKharchRows(); track row.id) {
                  <tr class="hover:bg-rose-50/30 transition">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-medium">{{ mandalData.toMarathiDigits(row.srNo) }}</td>
                    <td class="py-2.5 px-3 font-semibold text-slate-800 font-devanagari">
                      {{ mandalData.isEnglish() ? row.nameEn : row.nameMr }}
                    </td>
                    <td class="py-2.5 px-3 text-right font-bold text-slate-900">
                      {{ mandalData.formatNum(row.amount, true) }}
                    </td>
                    <td class="py-2.5 px-3 text-center text-slate-600 font-sans">
                      {{ mandalData.toMarathiDigits(row.date) }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

        </div>

      </div>

      <!-- ================= 3, 4, 5. FESTIVAL OFFERINGS, BHANDARA & SAREE DONORS SECTION ================= -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 space-y-4">
        
        <!-- Header & Tab Navigation -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <div class="flex items-center gap-2 text-amber-700 text-xs font-bold font-devanagari uppercase tracking-wider">
              <span>🌾</span>
              <span>{{ mandalData.t('अन्नदान, महाप्रसाद व वस्त्र अर्पण नोंदवही', 'Mahaprasad Bhandara & Clothes Offerings Register') }}</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 font-devanagari mt-0.5">
              {{ mandalData.t('उत्सव महाप्रसाद साहित्य व देणगीदार यादी', 'Festival Offerings, Bhandara Materials & Donors') }}
            </h3>
          </div>

          <!-- 3 Tabs Switcher (Ganpati Bhandara, Navratri Bhandara, Navratri Saree Donors) -->
          <div class="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold font-devanagari">
            <button
              (click)="selectedDonationTab.set('ganpatiBhandara')"
              class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedDonationTab() === 'ganpatiBhandara' ? 'bg-amber-600 text-white shadow-xs font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>🪔</span>
              <span>{{ mandalData.t('गणेशोत्सव - भंडारा वस्तू', 'Ganpati Bhandara Items') }}</span>
              <span class="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">{{ mandalData.toMarathiDigits(mandalData.ganpatiBhandaraItems().length) }}</span>
            </button>

            <button
              (click)="selectedDonationTab.set('navratriBhandara')"
              class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedDonationTab() === 'navratriBhandara' ? 'bg-rose-600 text-white shadow-xs font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>🔱</span>
              <span>{{ mandalData.t('नवरात्रोत्सव - भंडारा वस्तू', 'Navratri Bhandara Items') }}</span>
              <span class="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">{{ mandalData.toMarathiDigits(mandalData.navratriBhandaraItems().length) }}</span>
            </button>

            <button
              (click)="selectedDonationTab.set('navratriSaree')"
              class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              [ngClass]="selectedDonationTab() === 'navratriSaree' ? 'bg-purple-700 text-white shadow-xs font-black' : 'text-slate-700 hover:bg-slate-200'"
            >
              <span>🌸</span>
              <span>{{ mandalData.t('नवरात्र - साडी देणगीदार', 'Navratri Saree Donors') }}</span>
              <span class="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">{{ mandalData.toMarathiDigits(mandalData.navratriSareeDonors().length) }}</span>
            </button>
          </div>
        </div>

        <!-- Search Bar for In-Kind Tables -->
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input
            type="text"
            [ngModel]="donationSearchQuery()"
            (ngModelChange)="donationSearchQuery.set($event)"
            [placeholder]="mandalData.t('वस्तू किंवा देणगीदाराचे नाव शोधा...', 'Search item or donor name...')"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-devanagari focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <!-- 3. TABLE 1: Ganpati Utsav - Bhandara Items Table -->
        @if (selectedDonationTab() === 'ganpatiBhandara') {
          <div class="overflow-x-auto w-full -mx-1 sm:mx-0">
            <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[650px]">
              <thead>
                <tr class="bg-amber-50 text-amber-950 font-bold font-devanagari border-b border-amber-200">
                  <th class="py-2.5 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('वस्तू / साहित्याचे नाव', 'Item Name') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('प्रमाण', 'Quantity') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('एकक', 'Unit') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('देणगीदाराचे नाव', 'Donor Name') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('तारीख', 'Date') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('शेरा', 'Remarks') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of filteredGanpatiBhandara(); track item.id; let idx = $index) {
                  <tr class="hover:bg-amber-50/40 transition">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-medium">{{ mandalData.toMarathiDigits(idx + 1) }}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-900 font-devanagari">
                      {{ mandalData.isEnglish() ? item.itemNameEn : item.itemNameMr }}
                      <span class="block text-[10px] text-slate-400 font-normal font-sans">{{ mandalData.isEnglish() ? item.itemNameMr : item.itemNameEn }}</span>
                    </td>
                    <td class="py-2.5 px-3 text-center font-black text-amber-800 text-sm">
                      {{ mandalData.toMarathiDigits(item.quantity) }}
                    </td>
                    <td class="py-2.5 px-3 text-center">
                      <span class="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold font-devanagari">
                        {{ mandalData.isEnglish() ? item.unitEn : item.unitMr }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 font-semibold text-slate-800 font-devanagari">
                      {{ mandalData.isEnglish() ? item.donorNameEn : item.donorNameMr }}
                    </td>
                    <td class="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px]">
                      {{ mandalData.toMarathiDigits(item.date) }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-600 font-devanagari text-[11.5px]">
                      {{ mandalData.isEnglish() ? (item.remarksEn || '-') : (item.remarksMr || '-') }}
                    </td>
                  </tr>
                }
                @if (filteredGanpatiBhandara().length === 0) {
                  <tr>
                    <td colspan="7" class="py-6 text-center text-slate-400 font-devanagari">
                      {{ mandalData.t('कोणतीही नोंद आढळली नाही.', 'No records found.') }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- 4. TABLE 2: Navratri Utsav - Bhandara Items Table -->
        @if (selectedDonationTab() === 'navratriBhandara') {
          <div class="overflow-x-auto w-full -mx-1 sm:mx-0">
            <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[650px]">
              <thead>
                <tr class="bg-rose-50 text-rose-950 font-bold font-devanagari border-b border-rose-200">
                  <th class="py-2.5 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('वस्तू / साहित्याचे नाव', 'Item Name') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('प्रमाण', 'Quantity') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('एकक', 'Unit') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('देणगीदाराचे नाव', 'Donor Name') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('तारीख', 'Date') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('शेरा', 'Remarks') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of filteredNavratriBhandara(); track item.id; let idx = $index) {
                  <tr class="hover:bg-rose-50/40 transition">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-medium">{{ mandalData.toMarathiDigits(idx + 1) }}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-900 font-devanagari">
                      {{ mandalData.isEnglish() ? item.itemNameEn : item.itemNameMr }}
                      <span class="block text-[10px] text-slate-400 font-normal font-sans">{{ mandalData.isEnglish() ? item.itemNameMr : item.itemNameEn }}</span>
                    </td>
                    <td class="py-2.5 px-3 text-center font-black text-rose-800 text-sm">
                      {{ mandalData.toMarathiDigits(item.quantity) }}
                    </td>
                    <td class="py-2.5 px-3 text-center">
                      <span class="px-2 py-0.5 bg-rose-100 text-rose-900 rounded-md text-[11px] font-bold font-devanagari">
                        {{ mandalData.isEnglish() ? item.unitEn : item.unitMr }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 font-semibold text-slate-800 font-devanagari">
                      {{ mandalData.isEnglish() ? item.donorNameEn : item.donorNameMr }}
                    </td>
                    <td class="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px]">
                      {{ mandalData.toMarathiDigits(item.date) }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-600 font-devanagari text-[11.5px]">
                      {{ mandalData.isEnglish() ? (item.remarksEn || '-') : (item.remarksMr || '-') }}
                    </td>
                  </tr>
                }
                @if (filteredNavratriBhandara().length === 0) {
                  <tr>
                    <td colspan="7" class="py-6 text-center text-slate-400 font-devanagari">
                      {{ mandalData.t('कोणतीही नोंद आढळली नाही.', 'No records found.') }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- 5. TABLE 3: Navratri Utsav - Saree Donors Table -->
        @if (selectedDonationTab() === 'navratriSaree') {
          <div class="overflow-x-auto w-full -mx-1 sm:mx-0">
            <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[650px]">
              <thead>
                <tr class="bg-purple-50 text-purple-950 font-bold font-devanagari border-b border-purple-200">
                  <th class="py-2.5 px-3 text-center w-12">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('महिला देणगीदाराचे नाव', 'Donor Name') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('वस्तू / साडीचा प्रकार', 'Item / Saree Type') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('प्रमाण', 'Quantity') }}</th>
                  <th class="py-2.5 px-3 text-center">{{ mandalData.t('तारीख', 'Date') }}</th>
                  <th class="py-2.5 px-3">{{ mandalData.t('शेरा / विवरण', 'Remarks / Description') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (donor of filteredNavratriSaree(); track donor.id; let idx = $index) {
                  <tr class="hover:bg-purple-50/40 transition">
                    <td class="py-2.5 px-3 text-center text-slate-500 font-medium">{{ mandalData.toMarathiDigits(idx + 1) }}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-900 font-devanagari">
                      {{ mandalData.isEnglish() ? donor.donorNameEn : donor.donorNameMr }}
                      <span class="block text-[10px] text-slate-400 font-normal font-sans">{{ mandalData.isEnglish() ? donor.donorNameMr : donor.donorNameEn }}</span>
                    </td>
                    <td class="py-2.5 px-3 font-semibold text-purple-900 font-devanagari">
                      {{ mandalData.isEnglish() ? donor.itemEn : donor.itemMr }}
                    </td>
                    <td class="py-2.5 px-3 text-center">
                      <span class="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-md text-[11px] font-black font-devanagari">
                        {{ mandalData.toMarathiDigits(donor.quantity) }} {{ mandalData.t('नग', 'Nos') }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px]">
                      {{ mandalData.toMarathiDigits(donor.date) }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-600 font-devanagari text-[11.5px]">
                      {{ mandalData.isEnglish() ? (donor.remarksEn || '-') : (donor.remarksMr || '-') }}
                    </td>
                  </tr>
                }
                @if (filteredNavratriSaree().length === 0) {
                  <tr>
                    <td colspan="6" class="py-6 text-center text-slate-400 font-devanagari">
                      {{ mandalData.t('कोणतीही नोंद आढळली नाही.', 'No records found.') }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

      </div>

    </div>

    <!-- Modals -->
    @if (selectedReceiptRecord()) {
      <app-receipt-modal
        [record]="selectedReceiptRecord()"
        (close)="selectedReceiptRecord.set(null)"
      />
    }

    @if (showAddVarganiModal()) {
      <app-add-vargani-modal
        (close)="showAddVarganiModal.set(false)"
      />
    }

    @if (showAddKharchModal()) {
      <app-add-kharch-modal
        (close)="showAddKharchModal.set(false)"
      />
    }
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly mandalData = inject(MandalDataService);
  private transliteration = inject(TransliterationService);
  readonly loadingService = inject(LoadingService);

  // Advertisement Slider state
  readonly currentAdIndex = signal<number>(0);
  private autoSlideTimer: any = null;

  readonly currentAd = computed(() => {
    const banners = this.mandalData.advertisementBanners;
    const idx = this.currentAdIndex();
    return banners[idx % banners.length];
  });

  // Filters for quick Vargani table (Reactive Signals)
  readonly searchQuery = signal<string>('');
  readonly selectedBuildingFilter = signal<string>('सर्व');
  readonly selectedReceiptFilter = signal<string>('सर्व');

  // In-Kind & Bhandara Offerings Section State
  readonly selectedDonationTab = signal<'ganpatiBhandara' | 'navratriBhandara' | 'navratriSaree'>('ganpatiBhandara');
  readonly donationSearchQuery = signal<string>('');

  // Modals state
  readonly selectedReceiptRecord = signal<VarganiRecord | null>(null);
  readonly showAddVarganiModal = signal<boolean>(false);
  readonly showAddKharchModal = signal<boolean>(false);

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      this.nextAd();
    }, 4500);
  }

  private stopAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  pauseSlider() {
    this.stopAutoSlide();
  }

  resumeSlider() {
    this.startAutoSlide();
  }

  nextAd() {
    const count = this.mandalData.advertisementBanners.length;
    this.currentAdIndex.update(idx => (idx + 1) % count);
  }

  prevAd() {
    const count = this.mandalData.advertisementBanners.length;
    this.currentAdIndex.update(idx => (idx - 1 + count) % count);
  }

  goToAd(idx: number) {
    this.currentAdIndex.set(idx);
    this.startAutoSlide();
  }

  // Filtered Ganpati Bhandara items
  readonly filteredGanpatiBhandara = computed(() => {
    const list = this.mandalData.ganpatiBhandaraItems();
    const query = this.donationSearchQuery().toLowerCase().trim();
    if (!query) return list;
    return list.filter(item =>
      item.itemNameMr.toLowerCase().includes(query) ||
      item.itemNameEn.toLowerCase().includes(query) ||
      item.donorNameMr.toLowerCase().includes(query) ||
      item.donorNameEn.toLowerCase().includes(query) ||
      (item.remarksMr && item.remarksMr.toLowerCase().includes(query)) ||
      (item.remarksEn && item.remarksEn.toLowerCase().includes(query))
    );
  });

  // Filtered Navratri Bhandara items
  readonly filteredNavratriBhandara = computed(() => {
    const list = this.mandalData.navratriBhandaraItems();
    const query = this.donationSearchQuery().toLowerCase().trim();
    if (!query) return list;
    return list.filter(item =>
      item.itemNameMr.toLowerCase().includes(query) ||
      item.itemNameEn.toLowerCase().includes(query) ||
      item.donorNameMr.toLowerCase().includes(query) ||
      item.donorNameEn.toLowerCase().includes(query) ||
      (item.remarksMr && item.remarksMr.toLowerCase().includes(query)) ||
      (item.remarksEn && item.remarksEn.toLowerCase().includes(query))
    );
  });

  // Filtered Navratri Saree Donors
  readonly filteredNavratriSaree = computed(() => {
    const list = this.mandalData.navratriSareeDonors();
    const query = this.donationSearchQuery().toLowerCase().trim();
    if (!query) return list;
    return list.filter(item =>
      item.donorNameMr.toLowerCase().includes(query) ||
      item.donorNameEn.toLowerCase().includes(query) ||
      item.itemMr.toLowerCase().includes(query) ||
      item.itemEn.toLowerCase().includes(query) ||
      (item.remarksMr && item.remarksMr.toLowerCase().includes(query)) ||
      (item.remarksEn && item.remarksEn.toLowerCase().includes(query))
    );
  });

  // Computed quick Vargani rows
  readonly quickVarganiRows = computed(() => {
    let list = this.mandalData.currentVargani();
    const query = this.searchQuery().trim();
    const bFilter = this.selectedBuildingFilter();
    const rFilter = this.selectedReceiptFilter();

    if (bFilter !== 'सर्व') {
      list = list.filter(item => item.building === bFilter);
    }

    if (rFilter !== 'सर्व') {
      list = list.filter(item => item.status === rFilter);
    }

    if (query) {
      list = list.filter(item => this.transliteration.matches(query, item));
    }

    const sortedList = [...list].sort((a, b) => b.amount - a.amount || (a.srNo || 0) - (b.srNo || 0));
    return (query || bFilter !== 'सर्व' || rFilter !== 'सर्व') ? sortedList.slice(0, 10) : sortedList.slice(0, 5);
  });

  // Top 5 Kharch rows
  readonly quickKharchRows = computed(() => {
    return this.mandalData.currentKharch().slice(0, 5);
  });

  onYearChange(year: number) {
    this.loadingService.showFullscreen(
      '॥ गणपती बाप्पा मोरया ॥',
      'वर्ष ' + year + ' चा तपशील लोड होत आहे...',
      600
    );
    this.mandalData.setYear(Number(year));
  }

  onFestivalChange(festival: string) {
    this.loadingService.showFullscreen(
      '॥ गणपती बाप्पा मोरया ॥',
      festival + ' चा तपशील लोड होत आहे...',
      600
    );
    this.mandalData.setFestival(festival);
  }

  openReceipt(record: VarganiRecord) {
    this.selectedReceiptRecord.set(record);
  }
}
