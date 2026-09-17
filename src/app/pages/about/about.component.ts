import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MandalDataService } from '../../services/mandal-data.service';
import { SabhasadMember } from '../../models/mandal.models';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-8 animate-fade-in">
      
      <!-- Top Banner -->
      <div class="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-5">
          <img src="logo.jpg" alt="Logo" class="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400 shadow-lg shrink-0" />
          <div>
            <div class="flex items-center justify-center sm:justify-start gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span>●</span>
              <span>{{ mandalData.t('संस्था परिचय व अधिकृत माहिती (स्थापना १९९७)', 'Organization Overview & Official Info (Est. 1997)') }}</span>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-devanagari mt-1">
              {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ', 'Shree Ashtavinayak Mitra Mandal') }}
            </h1>
            <div class="text-amber-200 text-xs md:text-sm font-semibold mt-0.5">
              {{ mandalData.t('शिव स्फुर्ति बिल्डिंग. आदर्श नगर. जोगेश्वरी - (प), मुंबई-४००१०२', 'Shiv Sphurti Bldg, Adarsh Nagar, Jogeshwari (W), Mumbai-400102') }}
            </div>
            <p class="text-amber-100 text-xs mt-1 font-bold">
              {{ mandalData.t('॥ परंपरेचा वारसा आम्ही जपतो, विघ्नहर्ताचा गजर आम्ही करतो ॥', '॥ Preserving Heritage & Cultural Devotion to Lord Ganesha ॥') }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= MAIN TAB NAVIGATION ================= -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-2 sm:p-2.5 flex items-center gap-2">
        
        <!-- Tab 1 Button: Mandal Information & Members Directory -->
        <button
          (click)="activeTab.set('info')"
          class="flex-1 py-2.5 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm font-devanagari transition flex items-center justify-center gap-2 cursor-pointer"
          [ngClass]="activeTab() === 'info' ? 'bg-amber-600 text-white shadow-sm font-black' : 'text-slate-700 hover:bg-slate-100'"
        >
          <span class="text-base">🏛️</span>
          <span>{{ mandalData.t('मंडळाची माहिती व सभासद यादी', 'Mandal Information & Members List') }}</span>
        </button>

        <!-- Tab 2 Button: Adhyakshanche Manogat (President's Message) -->
        <button
          (click)="activeTab.set('president')"
          class="flex-1 py-2.5 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm font-devanagari transition flex items-center justify-center gap-2 cursor-pointer"
          [ngClass]="activeTab() === 'president' ? 'bg-[#991b1b] text-white shadow-sm font-black' : 'text-slate-700 hover:bg-slate-100'"
        >
          <span class="text-base">✍️</span>
          <span>{{ mandalData.isEnglish() ? "President's Message" : 'अध्यक्षांचे मनोगत' }}</span>
        </button>

      </div>

      <!-- ================= TAB 1: MANDAL INFORMATION & SABHASAD LIST ================= -->
      @if (activeTab() === 'info') {
        <div class="space-y-6">

          <!-- 1. Executive Committee Directory (कार्यकारिणी मंडळ) -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 space-y-5">
            <div class="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 class="text-lg font-bold text-slate-900 font-devanagari">
                  {{ mandalData.t('कार्यकारिणी पदाधिकारी व विश्वस्त (२०२४ - २०२७)', 'Executive Managing Committee & Trustees (2024 - 2027)') }}
                </h2>
                <p class="text-xs text-slate-500 font-devanagari">
                  {{ mandalData.t('मंडळाचे अधिकृत व्यवस्थापन आणि उत्सव नियोजन समिती', 'Official Governance and Festival Organizing Committee') }}
                </p>
              </div>
              <span class="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold font-devanagari self-start sm:self-auto">
                {{ mandalData.t('एकूण पदाधिकारी:', 'Total Committee:') }} {{ mandalData.toMarathiDigits(mandalData.committeeMembers.length) }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (member of mandalData.committeeMembers; track member.id) {
                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-amber-50/40 hover:border-amber-300 transition flex flex-col justify-between space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0" [style.backgroundColor]="member.avatarBg">
                      {{ mandalData.isEnglish() ? member.nameEn.charAt(0) : (member.nameMr.charAt(4) || member.nameMr.charAt(0)) }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-amber-700 font-devanagari">
                        {{ mandalData.isEnglish() ? member.designationEn : member.designationMr }}
                      </div>
                      <div class="text-sm font-black text-slate-900 font-devanagari leading-snug">
                        {{ mandalData.isEnglish() ? member.nameEn : member.nameMr }}
                      </div>
                      <div class="text-[10px] text-slate-400 font-sans">
                        {{ mandalData.isEnglish() ? member.nameMr : member.designationEn }}
                      </div>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                    <span class="text-[11px] font-mono">{{ mandalData.formatPhone(member.phone) }}</span>
                    <span class="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-devanagari">
                      {{ mandalData.formatNum(member.experienceYears) }} {{ mandalData.t('वर्षे सेवा', 'Yrs Service') }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- 2. Donation QR Code & Bank Details + Location Map -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Official UPI QR Code Card (Left 6 Cols) -->
            <div class="lg:col-span-6 bg-gradient-to-br from-white to-amber-50/70 rounded-2xl shadow-sm border-2 border-amber-300 p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div class="flex items-center justify-between border-b border-amber-200 pb-3">
                <div>
                  <span class="text-xs font-bold text-amber-800 uppercase tracking-wider">{{ mandalData.t('अधिकृत देणगी पोर्टल', 'Official Donation Portal') }}</span>
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 font-devanagari">{{ mandalData.t('डिजिटल वर्गणी व देणगी (UPI / QR)', 'Digital Donations & Offerings (UPI / QR)') }}</h3>
                </div>
                <div class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold shrink-0">
                  {{ mandalData.t('८०जी करसूट', '80G Tax Benefit') }}
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <!-- Simulated High Quality UPI QR Code -->
                <div class="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-md shrink-0 flex flex-col items-center">
                  <div class="w-36 h-36 sm:w-40 sm:h-40 bg-slate-900 p-1 flex items-center justify-center rounded-lg relative">
                    <svg class="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="5" y="5" width="25" height="25" fill="white" />
                      <rect x="9" y="9" width="17" height="17" fill="black" />
                      <rect x="13" y="13" width="9" height="9" fill="white" />

                      <rect x="70" y="5" width="25" height="25" fill="white" />
                      <rect x="74" y="9" width="17" height="17" fill="black" />
                      <rect x="78" y="13" width="9" height="9" fill="white" />

                      <rect x="5" y="70" width="25" height="25" fill="white" />
                      <rect x="9" y="74" width="17" height="17" fill="black" />
                      <rect x="13" y="78" width="9" height="9" fill="white" />

                      <rect x="36" y="8" width="6" height="6" fill="white" />
                      <rect x="48" y="14" width="6" height="6" fill="white" />
                      <rect x="58" y="8" width="6" height="6" fill="white" />
                      <rect x="36" y="24" width="6" height="6" fill="white" />
                      <rect x="48" y="28" width="6" height="6" fill="white" />
                      <rect x="10" y="38" width="6" height="6" fill="white" />
                      <rect x="22" y="44" width="6" height="6" fill="white" />
                      <rect x="38" y="40" width="6" height="6" fill="white" />
                      <rect x="50" y="44" width="6" height="6" fill="white" />
                      <rect x="65" y="38" width="6" height="6" fill="white" />
                      <rect x="80" y="44" width="6" height="6" fill="white" />
                      <circle cx="50" cy="50" r="10" fill="#ea580c" />
                      <text x="50" y="54" font-size="10" text-anchor="middle" fill="white" font-weight="bold">ॐ</text>
                    </svg>
                  </div>
                  <span class="text-[10px] font-bold text-slate-600 mt-1">BHIM • GPay • PhonePe • Paytm</span>
                </div>

                <!-- Bank details -->
                <div class="space-y-3 text-xs w-full min-w-0">
                  <div class="bg-white p-3 rounded-xl border border-amber-200">
                    <span class="text-slate-500 text-[11px] block">{{ mandalData.t('अधिकृत UPI ID:', 'Official UPI ID:') }}</span>
                    <div class="flex flex-wrap items-center gap-2 mt-1">
                      <code class="font-mono font-bold text-slate-900 text-xs sm:text-sm bg-slate-100 px-2 py-1 rounded truncate max-w-full">
                        ashtavinayak.jogeshwari&#64;upi
                      </code>
                      <button
                        (click)="copyUpi()"
                        class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition text-[11px] shrink-0 cursor-pointer"
                      >
                        {{ copySuccess() ? mandalData.t('कॉपी झाले! ✓', 'Copied! ✓') : mandalData.t('कॉपी करा', 'Copy') }}
                      </button>
                    </div>
                  </div>

                  <div class="text-slate-700 leading-relaxed font-devanagari text-xs">
                    <div><b>{{ mandalData.t('बँकेचे नाव:', 'Bank Name:') }}</b> {{ mandalData.t('बँक ऑफ महाराष्ट्र', 'Bank of Maharashtra') }}</div>
                    <div><b>{{ mandalData.t('शाखा:', 'Branch:') }}</b> {{ mandalData.t('जोगेश्वरी (पश्चिम) शाखा', 'Jogeshwari (West) Branch') }}</div>
                    <div><b>{{ mandalData.t('खाते क्रमांक:', 'Account No:') }}</b> 60234567890 ({{ mandalData.t('चालू खाते', 'Current Account') }})</div>
                    <div><b>{{ mandalData.t('IFSC कोड:', 'IFSC Code:') }}</b> MAHB0000123</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mandal Office Location & Google Map Card (Right 6 Cols) -->
            <div class="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-4">
              <div class="border-b border-slate-100 pb-3">
                <h3 class="text-lg font-bold text-slate-900 font-devanagari">{{ mandalData.t('कार्यालय पत्ता व संपर्क', 'Office Address & Contact') }}</h3>
                <p class="text-xs text-slate-500 font-devanagari">{{ mandalData.t('जोगेश्वरी (पश्चिम), मुंबई', 'Jogeshwari (West), Mumbai') }}</p>
              </div>

              <div class="space-y-2 text-xs text-slate-700 font-devanagari">
                <div class="flex items-start gap-2.5">
                  <span class="text-amber-600 text-base">📍</span>
                  <div>
                    <b>{{ mandalData.t('कार्यालय पत्ता:', 'Office Address:') }}</b><br>
                    {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ कार्यालय, शिव स्फूर्ती सोसायटी प्रांगण, आदर्श नगर, एस. व्ही. रोड, जोगेश्वरी (पश्चिम), मुंबई - ४०० १०२.', 'Shree Ashtavinayak Mitra Mandal Office, Shiv Sphurti Society Compound, Adarsh Nagar, S. V. Road, Jogeshwari (West), Mumbai - 400 102.') }}
                  </div>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="text-amber-600 text-base">📞</span>
                  <div><b>{{ mandalData.t('कार्यालय फोन:', 'Office Phone:') }}</b> {{ mandalData.formatPhone('+91 98201 44552') }} / {{ mandalData.formatPhone('+91 98690 77150') }}</div>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="text-amber-600 text-base">✉️</span>
                  <div><b>{{ mandalData.t('ईमेल:', 'Email:') }}</b> ashtavinayak.jogeshwari&#64;gmail.com</div>
                </div>
              </div>

              <!-- Interactive Map Container -->
              <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 relative flex items-center justify-center">
                <iframe
                  title="Mandal Location Map"
                  class="w-full h-full border-0"
                  src="https://maps.google.com/maps?q=Jogeshwari+West+Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                ></iframe>
              </div>

            </div>

          </div>

          <!-- 3. SIMPLIFIED SABHASAD TABLE - At the Very Bottom Position -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-4">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div class="flex items-center gap-2 text-amber-700 text-xs font-bold font-devanagari uppercase tracking-wider flex-wrap">
                  <span>👥</span>
                  <span>{{ mandalData.t('अधिकृत सभासद नोंदवही', 'Official Members Registry') }}</span>
                  <!-- Live Excel Source Badge -->
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black border border-emerald-300 shadow-2xs">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>{{ mandalData.t('डेटा स्त्रोत: Excel (' + mandalData.excelFileName() + ')', 'Source: Excel (' + mandalData.excelFileName() + ')') }}</span>
                  </span>
                </div>
                <h2 class="text-lg sm:text-xl font-black text-slate-900 font-devanagari mt-0.5">
                  {{ mandalData.t('सभासद नोंदणी टेबल (Sabhasad Table)', 'Sabhasad Members Directory') }}
                </h2>
              </div>

              <!-- Member count pill -->
              <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <span class="px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black font-devanagari shadow-2xs">
                  {{ mandalData.t('एकूण नोंदणीकृत सभासद:', 'Total Registered Members:') }} {{ mandalData.toMarathiDigits(filteredSabhasad().length) }}
                </span>
              </div>
            </div>

            <!-- Filter Controls: Search & Building -->
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
              
              <!-- Search Bar -->
              <div class="sm:col-span-8 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input
                  type="text"
                  [ngModel]="sabhasadSearchQuery()"
                  (ngModelChange)="sabhasadSearchQuery.set($event)"
                  [placeholder]="mandalData.t('सभासदाचे नाव किंवा इमारत शोधा...', 'Search member name or building...')"
                  class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-devanagari focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <!-- Building Filter -->
              <div class="sm:col-span-4 flex items-center gap-2">
                <span class="text-xs font-bold text-slate-600 font-devanagari shrink-0">{{ mandalData.t('इमारत:', 'Building:') }}</span>
                <select
                  [ngModel]="selectedBuilding()"
                  (ngModelChange)="selectedBuilding.set($event)"
                  class="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 font-devanagari focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="सर्व">{{ mandalData.t('सर्व इमारती', 'All Buildings') }}</option>
                  <option value="शिव स्फूर्ती 1">शिव स्फूर्ती 1</option>
                  <option value="शिव स्फूर्ती 2">शिव स्फूर्ती 2</option>
                  <option value="आदर्श नगर">आदर्श नगर</option>
                </select>
              </div>

            </div>

            <!-- Simplified Table with ONLY 4 Columns Requested -->
            <div class="overflow-x-auto w-full -mx-1 sm:mx-0">
              <table class="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[600px]">
                <thead>
                  <tr class="bg-[#f8fafc] text-slate-800 font-bold font-devanagari border-b border-slate-200">
                    <th class="py-3 px-3 text-center w-14">{{ mandalData.t('अ. क्र.', 'Sr. No.') }}</th>
                    <th class="py-3 px-4">{{ mandalData.t('सभासदाचे नाव', 'Member Name') }}</th>
                    <th class="py-3 px-4 text-center">{{ mandalData.t('संपर्क क्र.', 'Contact Number') }}</th>
                    <th class="py-3 px-4 text-center">{{ mandalData.t('आयकार्ड प्रिव्ह्यू व डाउनलोड', 'ID Card Preview & Download') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (mem of filteredSabhasad(); track mem.id) {
                    <tr class="hover:bg-amber-50/40 transition">
                      
                      <!-- Column 1: Sr. No. -->
                      <td class="py-3 px-3 text-center text-slate-500 font-bold text-xs">
                        {{ mandalData.toMarathiDigits(mem.srNo) }}
                      </td>

                      <!-- Column 2: Member Name -->
                      <td class="py-3 px-4">
                        <div class="font-bold text-slate-900 font-devanagari text-sm">
                          {{ mandalData.isEnglish() ? mem.nameEn : mem.nameMr }}
                        </div>
                      </td>

                      <!-- Column 3: Contact Number -->
                      <td class="py-3 px-4 text-center">
                        <div class="font-mono text-xs text-slate-800 font-bold">
                          {{ mandalData.formatPhone(mem.phone) }}
                        </div>
                      </td>

                      <!-- Column 4: ID Card Preview & Direct Download Buttons -->
                      <td class="py-3 px-4 text-center">
                        <div class="inline-flex items-center justify-center gap-1.5 flex-wrap">
                          <!-- Eye Preview Button -->
                          <button
                            (click)="openIdModal(mem)"
                            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 hover:border-amber-400 font-bold text-xs font-devanagari shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
                            title="आयकार्ड प्रिव्ह्यू पहा (Preview ID Card)"
                          >
                            <svg class="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <span>{{ mandalData.t('पहा', 'View') }}</span>
                          </button>

                          <!-- Direct Download Button -->
                          <button
                            (click)="triggerDownloadFromTable(mem)"
                            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 hover:border-emerald-400 font-bold text-xs font-devanagari shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
                            title="आयकार्ड थेट डाउनलोड करा (Download ID Card)"
                          >
                            <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            <span>{{ mandalData.t('डाउनलोड', 'Download') }}</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  }

                  @if (filteredSabhasad().length === 0) {
                    <tr>
                      <td colspan="4" class="py-8 text-center text-slate-400 font-devanagari">
                        {{ mandalData.t('कोणताही सभासद आढळला नाही.', 'No members found.') }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

          </div>

        </div>
      }

      <!-- ================= TAB 2: ADHYAKSHANCHE MANOGAT (PRESIDENT'S MESSAGE - READ ONLY) ================= -->
      @if (activeTab() === 'president') {
        <div class="space-y-6">
          
          <!-- President Profile & Message Hero Section -->
          <div class="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 rounded-3xl p-5 sm:p-8 md:p-10 border-2 border-amber-300 shadow-md">
            
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              
              <!-- President Photo Profile Card (Clean & Read-Only) -->
              <div class="flex flex-col items-center text-center shrink-0 w-full sm:w-64 bg-white/90 p-5 rounded-2xl border border-amber-200 shadow-xs">
                
                <!-- Gold Framed Dignified Avatar / Photo -->
                <div class="relative group">
                  <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl p-1.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-xl ring-4 ring-amber-400/40 overflow-hidden">
                    <img
                      src="logo.jpg"
                      [alt]="(mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr()) + ' - अध्यक्ष'"
                      class="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-red-700 to-amber-800 text-white font-black text-[11px] shadow-md border border-amber-300 whitespace-nowrap">
                    🚩 {{ mandalData.t('मंडळ अध्यक्ष', 'Mandal President') }}
                  </div>
                </div>

                <!-- President Name & Designation -->
                <div class="mt-5 space-y-1 w-full">
                  <div class="text-[10px] uppercase font-extrabold tracking-wider text-amber-700">
                    {{ mandalData.t('सन्माननीय अध्यक्ष', 'Honorable President') }}
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-[#991b1b] font-devanagari">
                    {{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }}
                  </h3>
                  <div class="text-xs font-bold text-slate-800 font-devanagari">
                    {{ mandalData.isEnglish() ? mandalData.presidentDesignationEn() : mandalData.presidentDesignationMr() }}
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium font-devanagari">
                    {{ mandalData.t('शिव स्फूर्ती • जोगेश्वरी (पश्चिम), मुंबई-४००१०२', 'Shiv Sphurti • Jogeshwari (West), Mumbai-400102') }}
                  </div>
                </div>

                <!-- Tenure Badge -->
                <div class="mt-3 px-3 py-1.5 rounded-xl bg-amber-100 text-[#78350f] border border-amber-300 text-xs font-bold font-devanagari w-full shadow-2xs">
                  🏆 {{ mandalData.isEnglish() ? mandalData.presidentTenureEn() : mandalData.presidentTenureMr() }}
                </div>

                <div class="mt-2 text-xs font-mono text-slate-700 flex items-center justify-center gap-1.5 font-semibold">
                  <span>📞</span>
                  <span>{{ mandalData.formatPhone(mandalData.presidentPhone()) }}</span>
                </div>

              </div>

              <!-- President's Inspiring Address / Message -->
              <div class="flex-1 space-y-4">
                
                <!-- Quote Header with Prominent Proper Name (Clean, Read-Only, No Edit Buttons) -->
                <div class="border-b border-amber-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 flex-wrap">
                    <span class="text-2xl text-amber-600">❝</span>
                    <h2 class="text-xl sm:text-2xl font-black text-[#991b1b] font-devanagari">
                      {{ mandalData.isEnglish() ? "President's Message" : 'अध्यक्षांचे मनोगत' }}
                    </h2>
                    <span class="text-slate-400 font-bold hidden sm:inline">•</span>
                    <span class="text-sm sm:text-base font-black text-[#78350f] font-devanagari bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">
                      {{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }} ({{ mandalData.t('मंडळ अध्यक्ष', 'President') }})
                    </span>
                  </div>

                  <span class="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full font-devanagari self-start sm:self-auto">
                    {{ mandalData.t('॥ मंगलमूर्ती मोरया ॥', '॥ Mangalmurti Morya ॥') }}
                  </span>
                </div>

                <!-- Speech Paragraphs (Marathi / English) -->
                <div class="space-y-3.5 text-xs sm:text-sm text-slate-800 font-devanagari leading-relaxed text-justify">
                  
                  @if (mandalData.selectedLanguage() === 'mr') {
                    <p class="font-bold text-[#991b1b] text-sm sm:text-base border-b border-amber-200 pb-1">
                      सस्नेह जय गणेश आणि आदिशक्ती जगदंबेचा जयजयकार !
                    </p>

                    <div class="bg-amber-50 border-l-4 border-[#991b1b] p-3 rounded-r-xl font-bold text-slate-900 leading-snug">
                      मी, <span class="text-[#991b1b] font-black text-base">{{ mandalData.presidentNameMr() }}</span> (अध्यक्ष, श्री अष्टविनायक मित्र मंडळ), शिव स्फूर्ती व आदर्श नगर परिसरातील सर्व ज्येष्ठ नागरिक, माता-भगिनी, तरुण सहकारी, लाडके बालमित्र आणि समस्त भाविकांचे या अधिकृत डिजिटल पोर्टलवर मनःपूर्वक सहर्ष स्वागत करतो.
                    </div>

                    <p>
                      शिव स्फूर्ती आणि आदर्श नगर परिसरातील सर्व आदरणीय ज्येष्ठ नागरिक, माता-भगिनी, तरुण सहकारी आणि लाडक्या बालमित्रांनो,
                    </p>

                    <p>
                      सन <b>१९९७</b> साली एका लहानशा मंडपात आणि मोजक्या निष्ठावंत सहकाऱ्यांच्या साथीने लावलेले हे रोपटे आज तब्बल <b>२९ वर्षांनंतर</b> एका भव्य वटवृक्षात रूपांतरित झाले आहे, याचा मला मंडळाचा अध्यक्ष म्हणून सार्थ अभिमान आणि मनस्वी आनंद वाटतो. आमच्या मंडळाची मूळ ताकद ही केवळ उत्सवाचा डामडौल नसून आपल्या सोसायटीतील प्रत्येक कुटुंबाचा परस्पर विश्वास, आत्मीयता आणि 'आपलेच मंडळ' ही उत्स्फूर्त भावना आहे.
                    </p>

                    <p>
                      गेल्या पाव शतकाहून अधिक काळात आम्ही केवळ सार्वजनिक गणेशोत्सवच नव्हे, तर नऊ दिवसांचा भक्तीमय नवरात्रोत्सव आणि महामानव भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती अत्यंत उत्साहात आणि सामाजिक बांधिलकी जपत साजरी केली आहे. उत्सवातील प्रत्येक रुपयाचा पारदर्शक हिशोब ठेवणे, कम्प्युटराइज्ड पावत्या देणे आणि शिल्लक गंगाजळीचा विनियोग मोफत आरोग्य शिबिरे, गरजू विद्यार्थ्यांचे शिक्षण आणि सामाजिक कार्यासाठी करणे ही आपली सुसंस्कृत परंपरा राहिली आहे.
                    </p>

                    <p>
                      यंदाही महिला भगिनींनी नवरात्रीत मोठ्या भक्तिभावाने अर्पण केलेल्या साड्या, अन्नदानासाठी भरभरून मिळालेले धान्य-साहित्य आणि तरुण मुलांचे अहोरात्र श्रम हे आपल्या ऐक्याचे जिवंत प्रतीक आहेत. आपण सर्वजण असाच एकोपा जपत पुढील पिढीकडे हा सांस्कृतिक वारसा अभिमानाने सोपवूया.
                    </p>

                    <p class="font-bold text-slate-900 pt-2 border-t border-amber-100">
                      विघ्नहर्ता गणराया आणि आई जगदंबा आपणा सर्वांना उदंड आरोग्य, सुख-समृद्धी आणि भरभराट देवो, हीच श्रींच्या चरणी नम्र प्रार्थना!
                    </p>
                  } @else {
                    <p class="font-bold text-[#991b1b] text-sm sm:text-base border-b border-amber-200 pb-1">
                      Warmest Greetings & Jai Ganesh to All Devotees and Well-Wishers!
                    </p>

                    <div class="bg-amber-50 border-l-4 border-[#991b1b] p-3 rounded-r-xl font-bold text-slate-900 leading-snug">
                      I, <span class="text-[#991b1b] font-black text-base">{{ mandalData.presidentNameEn() }}</span> (President, Shree Ashtavinayak Mitra Mandal), extend my warmest greetings and heartfelt welcome to all respected elders, mothers, sisters, youth members, children, and devotees visiting our official digital portal.
                    </div>

                    <p>
                      Respected elders, mothers, sisters, dear youth members, and children of Shiv Sphurti and Adarsh Nagar,
                    </p>

                    <p>
                      What began in <b>1997</b> with humble devotion and a handful of dedicated youth has today completed <b>29 glorious years</b> of uninterrupted cultural and social service. As the President of Shree Ashtavinayak Mitra Mandal, my heart fills with profound gratitude seeing how our small gathering has blossomed into a cherished community family.
                    </p>

                    <p>
                      Our Mandal stands on the unshakeable pillars of transparency, collective harmony, and selfless service. Across Ganeshotsav, Navratri, and Dr. B. R. Ambedkar Jayanti, we have consistently upheld absolute financial integrity with digital receipts, 80G tax exemptions, and reinvesting surplus reserves into free medical checkups, educational scholarships, and local welfare.
                    </p>

                    <p>
                      The overwhelming generosity of our mothers donating sarees, donors contributing Bhandara provisions, and our youth volunteering day and night proves that faith binds us together beyond words. Let us pledge to safeguard and nurture this sacred heritage for generations to come.
                    </p>

                    <p class="font-bold text-slate-900 pt-2 border-t border-amber-100">
                      May Lord Vighnaharta and Mother Jagdamba bless each family with peace, abundant health, and enduring prosperity!
                    </p>
                  }

                </div>

                <!-- Signature Block -->
                <div class="pt-4 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-devanagari">
                  <div>
                    <div class="font-bold text-slate-700 text-xs">
                      {{ mandalData.isEnglish() ? 'Yours faithfully in Service,' : 'आपला नम्र व सेवेकरी,' }}
                    </div>
                    <!-- Signature Line -->
                    <div class="italic font-serif text-slate-500 text-sm h-6 flex items-center">
                      M. V. Kadam
                    </div>
                    <div class="text-[#991b1b] font-black text-base mt-0.5">
                      {{ mandalData.isEnglish() ? mandalData.presidentNameEn() : mandalData.presidentNameMr() }}
                    </div>
                    <div class="text-slate-800 font-bold text-xs">
                      {{ mandalData.isEnglish() ? mandalData.presidentDesignationEn() : mandalData.presidentDesignationMr() }}
                    </div>
                    <div class="text-slate-500 text-[11px]">
                      {{ mandalData.t('श्री अष्टविनायक मित्र मंडळ (स्थापना वर्ष १९९७)', 'Shree Ashtavinayak Mitra Mandal (Established 1997)') }}
                    </div>
                  </div>

                  <div class="text-right sm:text-right shrink-0">
                    <span class="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 font-calligraphy text-[#78350f] font-bold text-xs sm:text-sm shadow-2xs">
                      {{ mandalData.t('॥ परंपरेचा वारसा आम्ही जपतो ॥', '॥ Preserving Heritage & Cultural Devotion ॥') }}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      }

    </div>

    <!-- ================= ATTRACTIVE FULL-SCREEN VERTICAL ID CARD POPUP MODAL ================= -->
    @if (showIdModal() && selectedMember()) {
      <div
        class="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
        (click)="onBackdropClick($event)"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl max-w-[360px] sm:max-w-md w-full border-2 border-amber-400 p-3.5 sm:p-5 space-y-3 sm:space-y-4 font-devanagari relative my-auto mx-auto"
          (click)="$event.stopPropagation()"
        >
          
          <!-- Modal Header with Close Button -->
          <div class="flex items-center justify-between border-b border-amber-200 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-lg sm:text-xl">🪪</span>
              <h3 class="font-bold text-xs sm:text-sm md:text-base text-slate-900">
                {{ mandalData.t('अधिकृत सभासद ओळखपत्र (प्रिव्ह्यू)', 'Official Membership ID Card (Preview)') }}
              </h3>
            </div>
            <button
              (click)="closeIdModal()"
              class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer transition"
              title="बंद करा"
            >
              ✕
            </button>
          </div>

          <!-- THE ATTRACTIVE VERTICAL ID CARD (Captured 1:1 by html2canvas - Non-clipping & Crisp Devanagari) -->
          <div
            id="verticalIdCardPreview"
            style="background: linear-gradient(180deg, #6b1212 0%, #881818 35%, #5e0d0d 75%, #380505 100%); border: 2.5px solid #fbbf24; outline: 1px solid rgba(254, 240, 138, 0.35); outline-offset: -6px;"
            class="mx-auto w-[330px] max-w-full rounded-3xl pt-5 px-5 pb-7 relative overflow-hidden flex flex-col items-center text-center select-none box-border shadow-2xl text-white"
          >
            
            <!-- 1. Realistic Lanyard Slot -->
            <div class="w-14 h-3 bg-slate-950/80 rounded-full mx-auto border border-amber-300/50 shadow-inner mb-3 shrink-0"></div>

            <!-- 2. Subtle Ganpati Watermark Background (Soft opacity so text remains crystal clear) -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none select-none rounded-3xl">
              <img
                src="ganpati-watermark.jpg"
                alt="Ganpati Watermark"
                style="opacity: 0.10; object-fit: cover; width: 100%; height: 100%; filter: brightness(1.15) contrast(1.25);"
                crossorigin="anonymous"
              />
            </div>

            <!-- 3. Centered Header with Mandal Name & Logo Slot (Clean Devanagari without negative tracking) -->
            <div class="relative z-10 w-full pb-3 border-b border-amber-300/35 flex flex-col items-center text-center">
              <!-- Mandal Logo Slot -->
              <div style="width: 48px; height: 48px; border: 2px solid #fbbf24;" class="rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-md overflow-hidden shrink-0 mb-1.5">
                <img src="logo.jpg" alt="Logo" class="w-full h-full object-cover rounded-full" crossorigin="anonymous" />
              </div>
              <!-- Divine Slogan -->
              <div style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; letter-spacing: 0.04em;" class="text-amber-300 text-[10px] font-bold">
                ॥ मंगलमूर्ती मोरया ॥
              </div>
              <!-- Mandal Name (No truncate, no tracking-tight, no drop-shadow) -->
              <h4 style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; letter-spacing: 0.01em; line-height: 1.3;" class="text-[17px] font-black text-white mt-0.5">
                श्री अष्टविनायक मित्र मंडळ
              </h4>
              <!-- Mandal Location -->
              <div style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; line-height: 1.3;" class="text-[11px] text-amber-200 font-semibold mt-0.5">
                शिव स्फूर्ती • जोगेश्वरी (पश्चिम), मुंबई-४००१०२
              </div>
            </div>

            <!-- 4. Photo Avatar Box with Gold Frame & Member Initial (No stray dot, Verified removed) -->
            <div class="relative z-10 my-3.5">
              <div style="width: 104px; height: 118px; border: 2px solid #fbbf24; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(40,10,10,0.65) 100%); border-radius: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.35);" class="flex flex-col items-center justify-center p-2 mx-auto">
                <!-- Inner Initial Roundel -->
                <div style="width: 58px; height: 58px; border: 2px solid #fbbf24; background: linear-gradient(135deg, #9a3412 0%, #7c1d1d 50%, #450a0a 100%); box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);" class="rounded-full flex items-center justify-center">
                  <span style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; line-height: 1;" class="font-black text-3xl text-yellow-300 select-none">
                    {{ getMemberInitial(selectedMember()!) }}
                  </span>
                </div>
                <span style="letter-spacing: 0.12em;" class="text-[9px] font-extrabold text-amber-200 tracking-wider mt-1.5 uppercase font-sans select-none">
                  PHOTO
                </span>
              </div>
            </div>

            <!-- 5. Member Name (Marathi & English) (Building name removed) -->
            <div class="relative z-10 w-full mt-0.5 mb-2.5 space-y-0.5 flex flex-col items-center justify-center text-center">
              <div style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; letter-spacing: 0.05em; text-align: center;" class="text-[10px] text-amber-300 font-bold uppercase text-center w-full">
                {{ mandalData.t('सभासदाचे नाव', 'MEMBER NAME') }}
              </div>
              <h3 style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; line-height: 1.25; text-align: center;" class="text-xl font-black text-white text-center w-full">
                {{ selectedMember()!.nameMr }}
              </h3>
              <div style="text-align: center;" class="text-[13px] font-bold text-amber-200 font-sans tracking-wide text-center w-full">
                {{ selectedMember()!.nameEn }}
              </div>
            </div>

            <!-- 6. Contact Number (Vector SVG Phone Icon) -->
            <div class="relative z-10 w-full mb-3 flex items-center justify-center text-center">
              <div style="border: 1px solid rgba(251, 191, 36, 0.45); background: rgba(0, 0, 0, 0.45);" class="inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-amber-100 text-xs font-bold font-mono mx-auto text-center">
                <svg class="w-3.5 h-3.5 text-amber-400 shrink-0 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"/>
                </svg>
                <span class="tracking-wider text-center font-mono">{{ mandalData.formatPhone(selectedMember()!.phone) }}</span>
              </div>
            </div>

            <!-- 7. Member ID Badge & QR Code Box (Ample padding to prevent text cutting) -->
            <div style="border: 1.5px solid rgba(251, 191, 36, 0.65); background: rgba(0, 0, 0, 0.55);" class="relative z-10 w-full rounded-2xl p-3 flex items-center justify-between gap-2.5 mb-1">
              <!-- Left: ID details -->
              <div class="text-left flex-1 min-w-0 pl-1">
                <div style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif;" class="text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                  {{ mandalData.t('सभासद ओळख क्रमांक', 'MEMBER ID NUMBER') }}
                </div>
                <div class="text-base font-black font-mono text-yellow-300 tracking-wider mt-0.5">
                  AM-{{ selectedMember()!.joinYear }}-{{ ('00' + selectedMember()!.srNo).slice(-3) }}
                </div>
                <div style="font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif;" class="text-[8.5px] text-amber-200/90 font-medium mt-0.5">
                  {{ mandalData.t('स्थापना वर्ष १९९७ • अधिकृत ओळखपत्र', 'Est. 1997 • Official ID') }}
                </div>
              </div>

              <!-- Right: SVG QR Code -->
              <div style="width: 54px; height: 54px; border: 1.5px solid #fbbf24;" class="bg-white p-1 rounded-xl shadow-md shrink-0 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Corner Markers -->
                  <rect x="2" y="2" width="9" height="9" fill="#1e293b" rx="1.5"/>
                  <rect x="4" y="4" width="5" height="5" fill="#ffffff" rx="0.5"/>
                  <rect x="5.5" y="5.5" width="2" height="2" fill="#1e293b"/>

                  <rect x="22" y="2" width="9" height="9" fill="#1e293b" rx="1.5"/>
                  <rect x="24" y="4" width="5" height="5" fill="#ffffff" rx="0.5"/>
                  <rect x="25.5" y="5.5" width="2" height="2" fill="#1e293b"/>

                  <rect x="2" y="22" width="9" height="9" fill="#1e293b" rx="1.5"/>
                  <rect x="4" y="24" width="5" height="5" fill="#ffffff" rx="0.5"/>
                  <rect x="5.5" y="5.5" width="2" height="2" fill="#1e293b"/>

                  <!-- Data Patterns -->
                  <rect x="14" y="2" width="2" height="2" fill="#1e293b"/>
                  <rect x="18" y="4" width="2" height="2" fill="#1e293b"/>
                  <rect x="14" y="8" width="2" height="2" fill="#1e293b"/>
                  <rect x="2" y="14" width="2" height="2" fill="#1e293b"/>
                  <rect x="6" y="16" width="2" height="2" fill="#1e293b"/>
                  <rect x="10" y="14" width="2" height="2" fill="#1e293b"/>
                  <rect x="14" y="13" width="5" height="5" fill="#991b1b" rx="1"/>
                  <circle cx="16.5" cy="15.5" r="1.5" fill="#fef08a"/>
                  <rect x="22" y="14" width="2" height="2" fill="#1e293b"/>
                  <rect x="28" y="16" width="2" height="2" fill="#1e293b"/>
                  <rect x="14" y="22" width="2" height="2" fill="#1e293b"/>
                  <rect x="18" y="25" width="2" height="2" fill="#1e293b"/>
                  <rect x="14" y="28" width="2" height="2" fill="#1e293b"/>
                  <rect x="22" y="22" width="2" height="2" fill="#1e293b"/>
                  <rect x="26" y="25" width="2" height="2" fill="#1e293b"/>
                  <rect x="29" y="29" width="2" height="2" fill="#1e293b"/>
                </svg>
              </div>
            </div>

          </div>

          <!-- Modal Action Buttons -->
          <div class="flex items-center justify-between gap-2.5 sm:gap-3 pt-1">
            <button
              type="button"
              (click)="closeIdModal()"
              class="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              {{ mandalData.t('बंद करा', 'Close') }}
            </button>

            <button
              type="button"
              (click)="downloadCurrentIdCard()"
              [disabled]="isDownloading()"
              class="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              @if (isDownloading()) {
                <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>{{ mandalData.t('डाउनलोड होत आहे...', 'Generating HD...') }}</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span>{{ mandalData.t('आयकार्ड डाउनलोड करा', 'Download ID Card') }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class AboutComponent {
  readonly mandalData = inject(MandalDataService);
  private readonly route = inject(ActivatedRoute);

  // Tab State: 'info' (Mandal Info & Sabhasad) | 'president' (Adhyakshanche Manogat)
  readonly activeTab = signal<'info' | 'president'>('info');

  // Sabhasad List Filters
  readonly sabhasadSearchQuery = signal<string>('');
  readonly selectedBuilding = signal<string>('सर्व');

  readonly copySuccess = signal<boolean>(false);

  // Vertical ID Card Modal State
  readonly showIdModal = signal<boolean>(false);
  readonly selectedMember = signal<SabhasadMember | null>(null);
  readonly isDownloading = signal<boolean>(false);

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'president' || params['tab'] === 'manogat') {
        this.activeTab.set('president');
      } else if (params['tab'] === 'info' || params['tab'] === 'sabhasad') {
        this.activeTab.set('info');
      }
    });
  }

  openIdModal(mem: SabhasadMember) {
    this.selectedMember.set(mem);
    this.showIdModal.set(true);
  }

  closeIdModal() {
    this.showIdModal.set(false);
    this.selectedMember.set(null);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeIdModal();
    }
  }

  /**
   * Helper to accurately extract the member's first name syllable/initial
   * (e.g. 'वि' from 'श्री. विठ्ठल तुकाराम महाडिक', or 'V' in English)
   * avoiding punctuation or stray dots.
   */
  getMemberInitial(mem: SabhasadMember | null): string {
    if (!mem) return 'अ';
    if (this.mandalData.isEnglish()) {
      return (mem.nameEn || 'M').trim().charAt(0).toUpperCase();
    }
    const cleaned = (mem.nameMr || '').replace(/^(श्री\.|श्री|सौ\.|सौ|श्रीमती\.|श्रीमती)\s*/, '').trim();
    if (!cleaned) return 'अ';
    const firstChar = cleaned.charAt(0);
    const secondChar = cleaned.charAt(1);
    if (secondChar && /[\u093E-\u094C\u0902]/.test(secondChar)) {
      return firstChar + secondChar;
    }
    return firstChar;
  }

  /**
   * Generates a standardized, fixed-resolution ID Card export (CR80 portrait format: 750 × 1200 px at 300 DPI).
   * Renders inside an off-screen staging container with fixed base dimensions so the output PNG
   * file size, resolution, and visual layout remain 100% identical on mobile, tablet, and desktop.
   */
  async downloadCurrentIdCard() {
    const mem = this.selectedMember();
    if (!mem || this.isDownloading()) return;

    const sourceCard = document.getElementById('verticalIdCardPreview');
    if (!sourceCard) return;

    this.isDownloading.set(true);

    let stagingContainer: HTMLElement | null = null;

    try {
      // Standard ID card CR80 format dimensions (portrait high-resolution 750 × 1200 px at 300 DPI)
      const EXPORT_WIDTH = 750;
      const EXPORT_HEIGHT = 1200;
      const BASE_WIDTH = 375;
      const BASE_HEIGHT = 600;

      // 1. Create an off-screen staging container with fixed base dimensions
      stagingContainer = document.createElement('div');
      stagingContainer.id = 'id-card-export-staging';
      stagingContainer.style.position = 'fixed';
      stagingContainer.style.left = '0';
      stagingContainer.style.top = '0';
      stagingContainer.style.width = `${BASE_WIDTH}px`;
      stagingContainer.style.height = `${BASE_HEIGHT}px`;
      stagingContainer.style.zIndex = '-9999';
      stagingContainer.style.pointerEvents = 'none';
      stagingContainer.style.overflow = 'hidden';
      stagingContainer.style.margin = '0';
      stagingContainer.style.padding = '0';
      stagingContainer.style.boxSizing = 'border-box';

      // 2. Clone the rendered card element into the staging container with fixed styling
      const clonedCard = sourceCard.cloneNode(true) as HTMLElement;
      clonedCard.id = 'verticalIdCardExportClone';
      clonedCard.style.width = `${BASE_WIDTH}px`;
      clonedCard.style.minWidth = `${BASE_WIDTH}px`;
      clonedCard.style.maxWidth = `${BASE_WIDTH}px`;
      clonedCard.style.height = `${BASE_HEIGHT}px`;
      clonedCard.style.minHeight = `${BASE_HEIGHT}px`;
      clonedCard.style.maxHeight = `${BASE_HEIGHT}px`;
      clonedCard.style.display = 'flex';
      clonedCard.style.flexDirection = 'column';
      clonedCard.style.justifyContent = 'space-between';
      clonedCard.style.padding = '20px 20px 22px 20px';
      clonedCard.style.boxSizing = 'border-box';
      clonedCard.style.margin = '0';
      clonedCard.style.transform = 'none';

      stagingContainer.appendChild(clonedCard);
      document.body.appendChild(stagingContainer);

      // 3. Ensure all fonts and images are ready before capturing
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise(resolve => setTimeout(resolve, 150));

      // 4. Capture with html2canvas using standardized viewport & scale: 2
      const rawCanvas = await html2canvas(clonedCard, {
        scale: 2,
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        windowWidth: BASE_WIDTH,
        windowHeight: BASE_HEIGHT,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 6000,
      });

      // 5. Standardize onto exact 750 × 1200 px canvas regardless of device/browser pixel ratios
      const standardizedCanvas = document.createElement('canvas');
      standardizedCanvas.width = EXPORT_WIDTH;
      standardizedCanvas.height = EXPORT_HEIGHT;
      const ctx = standardizedCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(rawCanvas, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
      }

      const safeName = (mem.nameEn || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `AM_ID_${mem.srNo}_${safeName}.png`;

      const dataUrl = (ctx ? standardizedCanvas : rawCanvas).toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export standardized ID card via html2canvas:', err);
    } finally {
      if (stagingContainer && stagingContainer.parentNode) {
        stagingContainer.parentNode.removeChild(stagingContainer);
      }
      this.isDownloading.set(false);
    }
  }

  /**
   * Allows direct download from the Sabhasad table action button.
   * Opens the preview modal and auto-triggers HD export.
   */
  triggerDownloadFromTable(mem: SabhasadMember) {
    this.selectedMember.set(mem);
    this.showIdModal.set(true);
    setTimeout(() => {
      this.downloadCurrentIdCard();
    }, 250);
  }

  // Filtered Sabhasad Members
  readonly filteredSabhasad = computed(() => {
    let list = this.mandalData.sabhasadMembers();
    const query = this.sabhasadSearchQuery().toLowerCase().trim();
    const bFilter = this.selectedBuilding();

    if (bFilter !== 'सर्व') {
      list = list.filter(item => item.building === bFilter);
    }

    if (query) {
      list = list.filter(item =>
        item.nameMr.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        item.flatNo.toLowerCase().includes(query) ||
        item.phone.includes(query) ||
        item.membershipTypeMr.toLowerCase().includes(query) ||
        item.membershipTypeEn.toLowerCase().includes(query)
      );
    }

    return list;
  });

  copyUpi() {
    navigator.clipboard.writeText('ashtavinayak.jogeshwari@upi');
    this.copySuccess.set(true);
    setTimeout(() => this.copySuccess.set(false), 2500);
  }
}
