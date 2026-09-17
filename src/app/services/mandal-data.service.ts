import { Injectable, signal, computed } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  VarganiRecord,
  KharchRecord,
  SummaryKpi,
  BuildingDistribution,
  ExpenseDistribution,
  CommitteeMember,
  FestivalEvent,
  YearlySummary,
  BhandaraItem,
  SareeDonor,
  SabhasadMember,
  AdvertisementBanner,
  YearlyFestivalFinancials,
  YearlyFestivalRecord
} from '../models/mandal.models';

@Injectable({
  providedIn: 'root'
})
export class MandalDataService {
  // Global Filters
  readonly selectedYear = signal<number>(2026);
  readonly selectedFestival = signal<string>('सार्वजनिक गणेशोत्सव');

  // Available options
  get availableYears(): number[] {
    const list = this.yearlyFestivalBreakdowns ? this.yearlyFestivalBreakdowns() : [];
    return list && list.length > 0 ? list.map(r => r.year) : [2026];
  }
  readonly availableFestivals = [
    'सार्वजनिक गणेशोत्सव',
    'नवरात्र उत्सव',
    'डॉ. बाबासाहेब आंबेडकर जयंती',
    'छत्रपती शिवाजी महाराज जयंती'
  ];

  readonly buildingsList = ['सर्व', 'शिव स्फूर्ती 1', 'शिव स्फूर्ती 2', 'आदर्श नगर', 'इतर'];
  readonly receiptStatusList = ['सर्व', 'दिलेली', 'बाकी'];

  // Marathi Digit Conversion State (Default enabled as requested)
  readonly useMarathiDigits = signal<boolean>(true);

  // Selected Language: 'mr' (मराठी) or 'en' (English) - Default: 'mr'
  readonly selectedLanguage = signal<'mr' | 'en'>('mr');
  readonly isEnglish = computed(() => this.selectedLanguage() === 'en');

  // Excel Integration & Live Sync State
  readonly isExcelLoaded = signal<boolean>(false);
  readonly excelFileName = signal<string>('mandal_data.xlsx');
  readonly lastExcelUpdate = signal<Date | null>(null);
  readonly excelLoadStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly excelLoadMessage = signal<string>('');

  constructor() {
    // Automatically load mandal_data.xlsx on service initialization
    this.loadMasterExcelFromPublic();
  }

  // Official President Details (अध्यक्ष तपशील)
  readonly presidentNameMr = signal<string>('श्री. मंगेश वसंत कदम');
  readonly presidentNameEn = signal<string>('Shri Mangesh Vasant Kadam');
  readonly presidentDesignationMr = signal<string>('अध्यक्ष, श्री अष्टविनायक मित्र मंडळ');
  readonly presidentDesignationEn = signal<string>('President, Shree Ashtavinayak Mitra Mandal');
  readonly presidentPhone = signal<string>('+91 98201 44552');
  readonly presidentTenureMr = signal<string>('१९९७ पासून अविरत सेवा (२९ वर्षे)');
  readonly presidentTenureEn = signal<string>('Serving Since 1997 (29 Years)');

  setPresidentName(nameMr: string, nameEn: string, phone?: string) {
    if (nameMr && nameMr.trim()) this.presidentNameMr.set(nameMr.trim());
    if (nameEn && nameEn.trim()) this.presidentNameEn.set(nameEn.trim());
    if (phone && phone.trim()) this.presidentPhone.set(phone.trim());
  }

  setLanguage(lang: 'mr' | 'en') {
    this.selectedLanguage.set(lang);
    this.useMarathiDigits.set(lang === 'mr');
  }

  toggleDigitLanguage() {
    this.useMarathiDigits.update(v => !v);
    this.selectedLanguage.set(this.useMarathiDigits() ? 'mr' : 'en');
  }

  /** Inline bilingual helper */
  t(mrText: string, enText: string): string {
    return this.selectedLanguage() === 'mr' ? mrText : enText;
  }

  translateCategory(category: string): string {
    if (this.selectedLanguage() === 'mr') return category;
    const map: Record<string, string> = {
      'मंडप व डेकोरेशन': 'Mandap & Decoration',
      'लाईटिंग व ध्वनी': 'Lighting & Sound System',
      'महाप्रसाद व पूजा': 'Mahaprasad & Puja',
      'सुरक्षा व सीसीटीव्ही': 'Security & CCTV',
      'परवानग्या व इतर': 'Permits & Misc',
      'विसर्जन व्यवस्था': 'Visarjan Arrangement',
      'सर्व': 'All Categories',
      'इतर': 'Other'
    };
    return map[category] || category;
  }

  translateBuilding(building: string): string {
    if (this.selectedLanguage() === 'mr') return this.toMarathiDigits(building);
    const map: Record<string, string> = {
      'शिव स्फूर्ती 1': 'Shiv Sphurti 1',
      'शिव स्फूर्ती 2': 'Shiv Sphurti 2',
      'आदर्श नगर': 'Adarsh Nagar',
      'इतर': 'Other',
      'सर्व': 'All Buildings'
    };
    return map[building] || building;
  }

  translateStatus(status: string): string {
    if (this.selectedLanguage() === 'mr') return status;
    const map: Record<string, string> = {
      'दिलेली': 'Paid / Issued',
      'बाकी': 'Pending',
      'सर्व': 'All Statuses'
    };
    return map[status] || status;
  }

  translatePaymentMode(mode?: string): string {
    if (!mode) return this.selectedLanguage() === 'mr' ? 'कॅश' : 'Cash';
    if (this.selectedLanguage() === 'mr') return mode;
    const map: Record<string, string> = {
      'कॅश': 'Cash',
      'UPI / GPay': 'UPI / GPay',
      'चेक': 'Cheque',
      'बँक ट्रान्सफर': 'Bank Transfer'
    };
    return map[mode] || mode;
  }

  translateFestival(fest: string): string {
    if (this.selectedLanguage() === 'mr') return fest;
    const map: Record<string, string> = {
      'सार्वजनिक गणेशोत्सव': 'Sarvajanik Ganeshotsav',
      'नवरात्र उत्सव': 'Navratri Festival',
      'डॉ. बाबासाहेब आंबेडकर जयंती': 'Dr. B. R. Ambedkar Jayanti',
      'छत्रपती शिवाजी महाराज जयंती': 'Chhatrapati Shivaji Maharaj Jayanti'
    };
    return map[fest] || fest;
  }

  /** Convert any number or string with digits (0-9) to Marathi numerals (०-९) */
  toMarathiDigits(val: any): string {
    if (val === null || val === undefined) return '';
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val).replace(/[0-9]/g, (d) => marathiDigits[parseInt(d, 10)]);
  }

  /** Formats a phone or contact number with Marathi numerals if Marathi is selected */
  formatPhone(phone: string): string {
    if (!phone) return '';
    return this.selectedLanguage() === 'mr' ? this.toMarathiDigits(phone) : phone;
  }

  /**
   * Formats a number with Indian comma notation and converts to Marathi digits if enabled
   * @param val numeric value or string
   * @param isCurrency whether to prepend currency symbol (₹ )
   */
  formatNum(val: any, isCurrency: boolean = false): string {
    if (val === null || val === undefined) return '';
    let formatted: string;
    if (typeof val === 'number') {
      formatted = new Intl.NumberFormat('en-IN').format(val);
    } else {
      formatted = String(val);
    }

    if (this.useMarathiDigits()) {
      formatted = this.toMarathiDigits(formatted);
    }

    return isCurrency ? `₹ ${formatted}` : formatted;
  }


  // Master Data Stores (Signals)
  private readonly _varganiRecords = signal<VarganiRecord[]>(this.generateInitialVargani());
  private readonly _kharchRecords = signal<KharchRecord[]>(this.generateInitialKharch());

  // Public readonly signals
  readonly allVargani = this._varganiRecords.asReadonly();
  readonly allKharch = this._kharchRecords.asReadonly();

  // Filtered by selected year and festival (sorted highest amount to lowest)
  readonly currentVargani = computed(() => {
    const year = this.selectedYear();
    const fest = this.selectedFestival();
    return this._varganiRecords()
      .filter(item => item.year === year && item.festival === fest)
      .sort((a, b) => b.amount - a.amount || (a.srNo || 0) - (b.srNo || 0));
  });

  readonly currentKharch = computed(() => {
    const year = this.selectedYear();
    const fest = this.selectedFestival();
    return this._kharchRecords().filter(item => item.year === year && item.festival === fest);
  });

  // KPI Metrics computed from current filtered data
  readonly kpi = computed<SummaryKpi>(() => {
    const vList = this.currentVargani();
    const kList = this.currentKharch();

    const totalVargani = vList.reduce((sum, item) => sum + item.amount, 0);
    const totalMembers = vList.length;
    const totalKharch = kList.reduce((sum, item) => sum + item.amount, 0);
    const totalKharchEntries = kList.length;
    const balanceAmount = totalVargani - totalKharch;

    const receiptsIssued = vList.filter(item => item.status === 'दिलेली').length;
    const receiptPercent = totalMembers > 0 ? Math.round((receiptsIssued / totalMembers) * 100) : 0;

    return {
      totalVargani,
      totalMembers,
      totalKharch,
      totalKharchEntries,
      balanceAmount,
      receiptsIssued,
      totalReceipts: totalMembers,
      receiptPercent
    };
  });

  // Building Distribution computed for Bar Chart
  readonly buildingDistribution = computed<BuildingDistribution[]>(() => {
    const vList = this.currentVargani();
    
    // Group amounts by 4 standard categories
    let s1 = 0;
    let s2 = 0;
    let an = 0;
    let other = 0;

    vList.forEach(item => {
      if (item.building.includes('शिव स्फूर्ती 1')) s1 += item.amount;
      else if (item.building.includes('शिव स्फूर्ती 2')) s2 += item.amount;
      else if (item.building.includes('आदर्श नगर')) an += item.amount;
      else other += item.amount;
    });

    return [
      { building: 'शिव स्फूर्ती 1', amount: s1, color: '#2563eb' },
      { building: 'शिव स्फूर्ती 2', amount: s2, color: '#f97316' },
      { building: 'आदर्श नगर', amount: an, color: '#10b981' },
      { building: 'इतर', amount: other, color: '#8b5cf6' }
    ];
  });

  // Expense Categories computed for Horizontal Bar Chart
  readonly expenseDistribution = computed<ExpenseDistribution[]>(() => {
    const kList = this.currentKharch();

    let murti = 0;
    let mandap = 0;
    let spyro = 0;
    let gifts = 0;
    let other = 0;

    kList.forEach(item => {
      const name = item.nameMr;
      const cat = item.category;
      if (name.includes('मूर्ती') || cat.includes('मूर्ती')) murti += item.amount;
      else if (name.includes('मंडप') || cat.includes('मंडप')) mandap += item.amount;
      else if (name.includes('स्पायरो') || cat.includes('स्पायरो')) spyro += item.amount;
      else if (name.includes('गिफ्ट्स') || cat.includes('गिफ्ट्स')) gifts += item.amount;
      else other += item.amount;
    });

    return [
      { category: 'गणपती मूर्ती', amount: murti, color: '#8b5cf6' },
      { category: 'मंडप', amount: mandap, color: '#f97316' },
      { category: 'स्पायरो', amount: spyro, color: '#06b6d4' },
      { category: 'गिफ्ट्स', amount: gifts, color: '#10b981' },
      { category: 'इतर खर्च', amount: other, color: '#ef4444' }
    ];
  });

  // Static Data Collections
  readonly committeeMembers: CommitteeMember[] = [
    { id: 1, designationMr: 'अध्यक्ष', designationEn: 'President', nameMr: 'श्री. मंगेश वसंत कदम', nameEn: 'Mangesh Vasant Kadam', phone: '+91 98201 44552', roleType: 'पदाधिकारी', experienceYears: 16, avatarBg: '#1e3a8a' },
    { id: 2, designationMr: 'उपाध्यक्ष', designationEn: 'Vice President', nameMr: 'श्री. विलास अनंत सावंत', nameEn: 'Vilas Anant Sawant', phone: '+91 98192 33412', roleType: 'पदाधिकारी', experienceYears: 14, avatarBg: '#0f766e' },
    { id: 3, designationMr: 'कार्यवाह (चिटणीस)', designationEn: 'General Secretary', nameMr: 'श्री. सचिन चंद्रकांत तांबडे', nameEn: 'Sachin Chandrakant Tambde', phone: '+91 99203 88124', roleType: 'पदाधिकारी', experienceYears: 12, avatarBg: '#c2410c' },
    { id: 4, designationMr: 'खजिनदार', designationEn: 'Treasurer', nameMr: 'श्री. राजेश भास्कर परब', nameEn: 'Rajesh Bhaskar Parab', phone: '+91 98690 77150', roleType: 'पदाधिकारी', experienceYears: 15, avatarBg: '#6b21a8' },
    { id: 5, designationMr: 'सह-खजिनदार', designationEn: 'Joint Treasurer', nameMr: 'श्री. सुधीर दत्तात्रय सावंत', nameEn: 'Sudhir Dattatray Sawant', phone: '+91 98211 99341', roleType: 'पदाधिकारी', experienceYears: 9, avatarBg: '#b45309' },
    { id: 6, designationMr: 'वरिष्ठ सल्लागार', designationEn: 'Chief Advisor', nameMr: 'श्री. चंद्रकांत बाबुराव महाडिक', nameEn: 'Chandrakant Baburao Mahadik', phone: '+91 98200 11223', roleType: 'सल्लागार', experienceYears: 28, avatarBg: '#374151' },
    { id: 7, designationMr: 'प्रमुख व्यवस्थापक', designationEn: 'Event Manager', nameMr: 'श्री. अमोल दिनकर पाटील', nameEn: 'Amol Dinkar Patil', phone: '+91 98334 55667', roleType: 'प्रमुख सदस्य', experienceYears: 8, avatarBg: '#15803d' },
    { id: 8, designationMr: 'युवा विभाग प्रमुख', designationEn: 'Youth Wing Head', nameMr: 'श्री. रोहन मंगेश महाडिक', nameEn: 'Rohan Mangesh Mahadik', phone: '+91 98700 88990', roleType: 'प्रमुख सदस्य', experienceYears: 7, avatarBg: '#1d4ed8' }
  ];

  // Base yearly festival records (loaded from Excel Yearly_Archive sheet or initial defaults)
  private readonly _baseYearlyFestivalBreakdowns = signal<YearlyFestivalRecord[]>(this.getInitialYearlyFestivalBreakdowns());

  // Dynamic & Reactive Yearly Festival Breakdown combining live Excel Vargani and Kharch data
  readonly yearlyFestivalBreakdowns = computed<YearlyFestivalRecord[]>(() => {
    const baseList = this._baseYearlyFestivalBreakdowns();
    const vargani = this._varganiRecords();
    const kharch = this._kharchRecords();

    // Collect all distinct years from base records, vargani, and kharch
    const yearsSet = new Set<number>();
    baseList.forEach(r => { if (r.year) yearsSet.add(r.year); });
    vargani.forEach(v => { if (v.year) yearsSet.add(v.year); });
    kharch.forEach(k => { if (k.year) yearsSet.add(k.year); });

    if (yearsSet.size === 0) {
      yearsSet.add(2026);
    }

    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    return sortedYears.map(year => {
      const baseRec = baseList.find(r => r.year === year);

      const festivalDefs: Array<{ key: 'ganpati' | 'navratri' | 'ambedkar'; nameMr: string; nameEn: string; icon: string }> = [
        { key: 'ganpati', nameMr: 'सार्वजनिक गणेशोत्सव', nameEn: 'Ganeshotsav (Ganpati Utsav)', icon: '🪔' },
        { key: 'navratri', nameMr: 'नवरात्र उत्सव', nameEn: 'Navratri Utsav', icon: '🔱' },
        { key: 'ambedkar', nameMr: 'डॉ. बाबासाहेब आंबेडकर जयंती', nameEn: 'Dr. B. R. Ambedkar Jayanti', icon: '⚖️' }
      ];

      const festivalsToProcess: YearlyFestivalFinancials[] = festivalDefs.map(def => {
        // Look for an entry in baseRec first (from Excel Yearly_Archive)
        const existingInBase = baseRec?.festivals?.find(f => f.festivalKey === def.key || f.festivalNameMr === def.nameMr);

        let coll = existingInBase ? (existingInBase.totalCollection || 0) : 0;
        let exp = existingInBase ? (existingInBase.totalExpenses || 0) : 0;
        let bal = existingInBase ? (existingInBase.balance ?? (coll - exp)) : 0;
        let donors = existingInBase ? (existingInBase.donorsCount || 0) : 0;
        let part = existingInBase ? (existingInBase.participationEstimate || 0) : 0;

        // Check live vargani and kharch items
        const vList = vargani.filter(v =>
          v.year === year && (
            v.festival === def.nameMr ||
            (def.key === 'ganpati' && v.festival.includes('गणेश')) ||
            (def.key === 'navratri' && v.festival.includes('नवरात्र')) ||
            (def.key === 'ambedkar' && (v.festival.includes('आंबेडकर') || v.festival.includes('Ambedkar')))
          )
        );

        const kList = kharch.filter(k =>
          k.year === year && (
            k.festival === def.nameMr ||
            (def.key === 'ganpati' && k.festival.includes('गणेश')) ||
            (def.key === 'navratri' && k.festival.includes('नवरात्र')) ||
            (def.key === 'ambedkar' && (k.festival.includes('आंबेडकर') || k.festival.includes('Ambedkar')))
          )
        );

        if (vList.length > 0) {
          coll = vList.reduce((sum, v) => sum + (v.amount || 0), 0);
          donors = vList.length;
          if (part === 0) part = donors * 100;
        }
        if (kList.length > 0) {
          exp = kList.reduce((sum, k) => sum + (k.amount || 0), 0);
        }
        bal = coll - exp;

        return {
          festivalKey: def.key,
          festivalNameMr: def.nameMr,
          festivalNameEn: def.nameEn,
          icon: def.icon,
          totalCollection: coll,
          totalExpenses: exp,
          balance: bal,
          donorsCount: donors,
          participationEstimate: part
        };
      });

      const totalCollection = festivalsToProcess.reduce((sum, f) => sum + f.totalCollection, 0);
      const totalExpenses = festivalsToProcess.reduce((sum, f) => sum + f.totalExpenses, 0);
      const netBalance = totalCollection - totalExpenses;

      return {
        year: year,
        festivals: festivalsToProcess,
        totalCollection: totalCollection,
        totalExpenses: totalExpenses,
        netBalance: netBalance,
        noteMr: baseRec?.noteMr || `वर्ष ${this.toMarathiDigits(year)} - सर्व उत्सव हिशोब व ताळेबंद.`,
        noteEn: baseRec?.noteEn || `Year ${year} - Festival accounts & balance sheet.`
      };
    });
  });

  // Dynamic Yearly Summary records (combining live totals & archive notes)
  readonly yearlyArchives = computed<YearlySummary[]>(() => {
    const list = this.yearlyFestivalBreakdowns();
    return list.map((rec, idx) => {
      const vList = this._varganiRecords().filter(v => v.year === rec.year);
      const kList = this._kharchRecords().filter(k => k.year === rec.year);
      const totalVargani = rec.totalCollection;
      const totalKharch = rec.totalExpenses;
      const balance = rec.netBalance;
      const memberCount = vList.length > 0 ? vList.length : rec.festivals.reduce((s, f) => s + (f.donorsCount || 0), 0);
      const kharchCount = kList.length > 0 ? kList.length : 12;
      const receiptsIssued = vList.length > 0 ? vList.filter(v => v.status === 'दिलेली').length : Math.round(memberCount * 0.88);

      const prevRec = list[idx + 1];
      let growthPercent = '';
      if (prevRec && prevRec.totalCollection > 0) {
        const pct = ((totalVargani - prevRec.totalCollection) / prevRec.totalCollection) * 100;
        growthPercent = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
      }

      return {
        year: rec.year,
        totalVargani,
        totalKharch,
        balance,
        memberCount,
        kharchCount,
        receiptsIssued,
        growthPercent: growthPercent || '-',
        majorAccomplishment: rec.noteMr,
        majorAccomplishmentEn: rec.noteEn
      };
    });
  });

  // Ganpati Utsav - Bhandara Items / Donations
  readonly ganpatiBhandaraItems = signal<BhandaraItem[]>([
    {
      id: 1,
      festival: 'गणेशोत्सव',
      itemNameMr: 'बासमती तांदूळ (कोलम / बासमती)',
      itemNameEn: 'Basmati Rice (Special Quality)',
      quantity: 50,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. रमेश नारायण पाटील',
      donorNameEn: 'Ramesh Narayan Patil',
      date: '28/08/2026',
      remarksMr: 'महाप्रसाद अन्नदानासाठी उत्तम दर्जा',
      remarksEn: 'Special high-grade rice for Mahaprasad'
    },
    {
      id: 2,
      festival: 'गणेशोत्सव',
      itemNameMr: 'शुद्ध शेंगदाणा तेल डबे',
      itemNameEn: 'Pure Groundnut Oil Cans',
      quantity: 5,
      unitMr: 'डबे (७५ लिटर)',
      unitEn: 'Tins (75 Ltr)',
      donorNameMr: 'सौ. सुमित्रा विलास सावंत',
      donorNameEn: 'Sumitra Vilas Sawant',
      date: '29/08/2026',
      remarksMr: 'महाप्रसाद भोजनासाठी अर्पण',
      remarksEn: 'Donated for Mahaprasad preparation'
    },
    {
      id: 3,
      festival: 'गणेशोत्सव',
      itemNameMr: 'उत्तम पांढरी साखर',
      itemNameEn: 'Refined Sugar',
      quantity: 35,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. प्रकाश भिकाजी कदम',
      donorNameEn: 'Prakash Bhikaji Kadam',
      date: '29/08/2026',
      remarksMr: 'प्रसादाचा शिरा व नैवेद्यासाठी',
      remarksEn: 'For sweet Prasad preparation'
    },
    {
      id: 4,
      festival: 'गणेशोत्सव',
      itemNameMr: 'शुद्ध देशी गाईचे तूप',
      itemNameEn: 'Pure Cow Desi Ghee',
      quantity: 10,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. विठ्ठल तुकाराम महाडिक',
      donorNameEn: 'Vitthal Tukaram Mahadik',
      date: '30/08/2026',
      remarksMr: 'सत्यनारायण महापूजा व नैवेद्य',
      remarksEn: 'For Satyanarayan Maha Puja & Prasad'
    },
    {
      id: 5,
      festival: 'गणेशोत्सव',
      itemNameMr: 'बारीक रवा (सुजी)',
      itemNameEn: 'Fine Semolina (Rawa)',
      quantity: 25,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. सुधीर दत्तात्रय सावंत',
      donorNameEn: 'Sudhir Dattatray Sawant',
      date: '30/08/2026',
      remarksMr: 'महाप्रसाद शिरा वाटप',
      remarksEn: 'For sweet Sheera distribution'
    },
    {
      id: 6,
      festival: 'गणेशोत्सव',
      itemNameMr: 'हरभरा डाळ',
      itemNameEn: 'Bengal Gram Dal (Chana Dal)',
      quantity: 20,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. चंद्रकांत बाबुराव महाडिक',
      donorNameEn: 'Chandrakant Baburao Mahadik',
      date: '31/08/2026',
      remarksMr: 'महाप्रसाद आमटीसाठी',
      remarksEn: 'For Mahaprasad Dal'
    },
    {
      id: 7,
      festival: 'गणेशोत्सव',
      itemNameMr: 'काजू व बदाम (सुकामेवा)',
      itemNameEn: 'Cashew & Almonds (Dry Fruits)',
      quantity: 6,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'मे. राजेश ज्वेलर्स (जोगेश्वरी)',
      donorNameEn: 'M/s Rajesh Jewellers (Jogeshwari)',
      date: '31/08/2026',
      remarksMr: 'उकडीचे मोदक व शिरा सजावट',
      remarksEn: 'For Modak and Sheera garnishing'
    },
    {
      id: 8,
      festival: 'गणेशोत्सव',
      itemNameMr: 'विशेष मसाला पॅकेट संच',
      itemNameEn: 'Special Spice Assortment Pack',
      quantity: 15,
      unitMr: 'पॅकेट्स',
      unitEn: 'Packets',
      donorNameMr: 'श्री. अमोल दिनकर पाटील',
      donorNameEn: 'Amol Dinkar Patil',
      date: '01/09/2026',
      remarksMr: 'भंडारा भोजन चव व सुगंधासाठी',
      remarksEn: 'Special curated spices for Bhandara'
    }
  ]);

  // Navratri Utsav - Bhandara Items / Materials
  readonly navratriBhandaraItems = signal<BhandaraItem[]>([
    {
      id: 101,
      festival: 'नवरात्र उत्सव',
      itemNameMr: 'दर्जेदार तुकडा बासमती तांदूळ',
      itemNameEn: 'Premium Tukda Basmati Rice',
      quantity: 40,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. सदानंद बाळकृष्ण राणे',
      donorNameEn: 'Sadanand Balkrishna Rane',
      date: '22/09/2026',
      remarksMr: 'नवमी महाप्रसाद अन्नदान',
      remarksEn: 'Navami Mahaprasad distribution'
    },
    {
      id: 102,
      festival: 'नवरात्र उत्सव',
      itemNameMr: 'फॉर्च्युन रिफाइंड तेल डबे',
      itemNameEn: 'Fortune Refined Cooking Oil',
      quantity: 4,
      unitMr: 'डबे (६० लिटर)',
      unitEn: 'Tins (60 Ltr)',
      donorNameMr: 'सौ. नंदा सतीश मोरे',
      donorNameEn: 'Nanda Satish More',
      date: '23/09/2026',
      remarksMr: 'महाप्रसाद पुरी व भाजीसाठी',
      remarksEn: 'For Mahaprasad Puri and vegetables'
    },
    {
      id: 103,
      festival: 'नवरात्र उत्सव',
      itemNameMr: 'साखर (गोड महाप्रसादासाठी)',
      itemNameEn: 'Crystal Sugar',
      quantity: 25,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. दीपक विनायक जोशी',
      donorNameEn: 'Deepak Vinayak Joshi',
      date: '24/09/2026',
      remarksMr: 'देवीच्या महानैवेद्य व खिरीसाठी',
      remarksEn: 'For Kheer offering to Goddess'
    },
    {
      id: 104,
      festival: 'नवरात्र उत्सव',
      itemNameMr: 'शुद्ध गावरान गाईचे तूप',
      itemNameEn: 'Pure Desi Cow Ghee',
      quantity: 8,
      unitMr: 'लिटर',
      unitEn: 'Liters',
      donorNameMr: 'सौ. वंदना सचिन तांबडे',
      donorNameEn: 'Vandana Sachin Tambde',
      date: '25/09/2026',
      remarksMr: 'अष्टमी दुर्गा महाहवन व महानैवेद्य',
      remarksEn: 'For Ashtami Durga Havan and Prasad'
    },
    {
      id: 105,
      festival: 'नवरात्र उत्सव',
      itemNameMr: 'खवा व चारोळी / पिस्ता',
      itemNameEn: 'Mawa & Pistachio / Charoli',
      quantity: 5,
      unitMr: 'किलो',
      unitEn: 'Kg',
      donorNameMr: 'श्री. संजय शांताराम सुर्वे',
      donorNameEn: 'Sanjay Shantaram Surve',
      date: '26/09/2026',
      remarksMr: 'पंचामृत व पेढे नैवेद्यासाठी',
      remarksEn: 'For Panchamrit and sweet offerings'
    },
    {
      id: 106,
      festival: 'नवरात्र उत्सव',
      itemNameMr: 'सोललेले श्रीफळ (नारळ)',
      itemNameEn: 'Fresh Husked Coconuts',
      quantity: 51,
      unitMr: 'नग',
      unitEn: 'Nos',
      donorNameMr: 'श्री. गणेश बाळाराम शिंदे',
      donorNameEn: 'Ganesh Balaram Shinde',
      date: '27/09/2026',
      remarksMr: 'देवीची ओटी व महाहवन पूर्णाहुती',
      remarksEn: 'For Goddess Oti and Maha Havan'
    }
  ]);

  // Navratri Utsav - Saree & Clothing Donors (महिला वस्त्र देणगीदार)
  readonly navratriSareeDonors = signal<SareeDonor[]>([
    {
      id: 201,
      donorNameMr: 'सौ. सुवर्णा मंगेश कदम',
      donorNameEn: 'Suvarna Mangesh Kadam',
      itemMr: 'शाही जांभळी पैठणी साडी (सोनेरी मोर काठ)',
      itemEn: 'Royal Purple Paithani Saree (Gold Peacock Border)',
      quantity: 1,
      date: '21/09/2026',
      remarksMr: 'घटस्थापना पहिल्या माळेचा शृंगार',
      remarksEn: 'Ghatsthapana 1st Day adornment'
    },
    {
      id: 202,
      donorNameMr: 'सौ. अनुराधा विलास सावंत',
      donorNameEn: 'Anuradha Vilas Sawant',
      itemMr: 'काठपदराची शुद्ध रेशमी साडी (गडद लाल रंग)',
      itemEn: 'Pure Silk Saree with Rich Zari Border (Crimson Red)',
      quantity: 1,
      date: '22/09/2026',
      remarksMr: 'देवीच्या नित्य पूजेसाठी अर्पण',
      remarksEn: 'Offered for daily evening Maha Aarti'
    },
    {
      id: 203,
      donorNameMr: 'सौ. वंदना सचिन तांबडे',
      donorNameEn: 'Vandana Sachin Tambde',
      itemMr: 'बनारसी ब्रोकेड शालू (सोनेरी पिवळा रंग)',
      itemEn: 'Banarasi Brocade Shalu (Golden Yellow)',
      quantity: 1,
      date: '24/09/2026',
      remarksMr: 'ललिता पंचमी विशेष अलंकार शृंगार',
      remarksEn: 'Lalita Panchami special celebration'
    },
    {
      id: 204,
      donorNameMr: 'सौ. रेखा राजेश परब',
      donorNameEn: 'Rekha Rajesh Parab',
      itemMr: 'कांजीवरम सिल्क साडी (राणी गुलाबी रंग)',
      itemEn: 'Kanjivaram Silk Saree (Rani Pink)',
      quantity: 1,
      date: '26/09/2026',
      remarksMr: 'महासप्तमी देवीच्या अंगावरील वस्त्र',
      remarksEn: 'Offered for Maha Saptami ritual'
    },
    {
      id: 205,
      donorNameMr: 'सौ. सुनंदा अमोल पाटील',
      donorNameEn: 'Sunanda Amol Patil',
      itemMr: 'पारंपरिक नऊवारी पैठणी साडी (हिरवा रंग)',
      itemEn: 'Traditional Nauvari Paithani (Emerald Green)',
      quantity: 1,
      date: '28/09/2026',
      remarksMr: 'महाअष्टमी हवन व कुमारी पूजन वस्त्र',
      remarksEn: 'Durga Ashtami Maha Havan special offering'
    },
    {
      id: 206,
      donorNameMr: 'सौ. मंगला चंद्रकांत महाडिक',
      donorNameEn: 'Mangala Chandrakant Mahadik',
      itemMr: 'चंदेरी जरी सिल्क साडी (भगवा नारंगी रंग)',
      itemEn: 'Chanderi Zari Silk Saree (Saffron Orange)',
      quantity: 1,
      date: '29/09/2026',
      remarksMr: 'महानवमी महाकुंकुमार्चन पूजा',
      remarksEn: 'Maha Navami Kumkumarchan Puja'
    },
    {
      id: 207,
      donorNameMr: 'सौ. कविता सुधीर सावंत',
      donorNameEn: 'Kavita Sudhir Sawant',
      itemMr: 'तासर सिल्क साडी (मोरपंखी निळा रंग)',
      itemEn: 'Tussar Silk Saree (Peacock Feather Blue)',
      quantity: 1,
      date: '30/09/2026',
      remarksMr: 'विजयादशमी दसरा शस्त्रपूजन शृंगार',
      remarksEn: 'Vijayadashami Dasara Shastra Puja'
    }
  ]);

  // Sabhasad (Registered Members) List
  readonly sabhasadMembers = signal<SabhasadMember[]>([
    { id: 1, srNo: 1, nameMr: 'श्री. मंगेश वसंत कदम', nameEn: 'Mangesh Vasant Kadam', building: 'शिव स्फूर्ती 1', flatNo: 'A-102', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98201 44552', joinYear: 1997, status: 'सक्रिय' },
    { id: 2, srNo: 2, nameMr: 'श्री. विलास अनंत सावंत', nameEn: 'Vilas Anant Sawant', building: 'शिव स्फूर्ती 1', flatNo: 'A-204', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98192 33412', joinYear: 1997, status: 'सक्रिय' },
    { id: 3, srNo: 3, nameMr: 'श्री. सचिन चंद्रकांत तांबडे', nameEn: 'Sachin Chandrakant Tambde', building: 'शिव स्फूर्ती 2', flatNo: 'B-101', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 99203 88124', joinYear: 2002, status: 'सक्रिय' },
    { id: 4, srNo: 4, nameMr: 'श्री. राजेश भास्कर परब', nameEn: 'Rajesh Bhaskar Parab', building: 'शिव स्फूर्ती 2', flatNo: 'B-303', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98690 77150', joinYear: 1999, status: 'सक्रिय' },
    { id: 5, srNo: 5, nameMr: 'श्री. सुधीर दत्तात्रय सावंत', nameEn: 'Sudhir Dattatray Sawant', building: 'शिव स्फूर्ती 1', flatNo: 'A-302', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98211 99341', joinYear: 2005, status: 'सक्रिय' },
    { id: 6, srNo: 6, nameMr: 'श्री. चंद्रकांत बाबुराव महाडिक', nameEn: 'Chandrakant Baburao Mahadik', building: 'शिव स्फूर्ती 1', flatNo: 'A-001', membershipTypeMr: 'संस्थापक सल्लागार', membershipTypeEn: 'Founding Advisor', phone: '+91 98200 11223', joinYear: 1997, status: 'सक्रिय' },
    { id: 7, srNo: 7, nameMr: 'श्री. अमोल दिनकर पाटील', nameEn: 'Amol Dinkar Patil', building: 'आदर्श नगर', flatNo: 'C-201', membershipTypeMr: 'वार्षिक सभासद', membershipTypeEn: 'Annual Member', phone: '+91 98334 55667', joinYear: 2012, status: 'सक्रिय' },
    { id: 8, srNo: 8, nameMr: 'श्री. रोहन मंगेश महाडिक', nameEn: 'Rohan Mangesh Mahadik', building: 'शिव स्फूर्ती 1', flatNo: 'A-402', membershipTypeMr: 'युवा सभासद', membershipTypeEn: 'Youth Member', phone: '+91 98700 88990', joinYear: 2018, status: 'सक्रिय' },
    { id: 9, srNo: 9, nameMr: 'श्री. प्रकाश भिकाजी कदम', nameEn: 'Prakash Bhikaji Kadam', building: 'शिव स्फूर्ती 2', flatNo: 'B-202', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98205 66778', joinYear: 2000, status: 'सक्रिय' },
    { id: 10, srNo: 10, nameMr: 'श्री. विठ्ठल तुकाराम महाडिक', nameEn: 'Vitthal Tukaram Mahadik', building: 'शिव स्फूर्ती 1', flatNo: 'A-104', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98198 77665', joinYear: 1998, status: 'सक्रिय' },
    { id: 11, srNo: 11, nameMr: 'श्री. सदानंद बाळकृष्ण राणे', nameEn: 'Sadanand Balkrishna Rane', building: 'आदर्श नगर', flatNo: 'D-102', membershipTypeMr: 'वार्षिक सभासद', membershipTypeEn: 'Annual Member', phone: '+91 98330 22119', joinYear: 2014, status: 'सक्रिय' },
    { id: 12, srNo: 12, nameMr: 'श्री. दीपक विनायक जोशी', nameEn: 'Deepak Vinayak Joshi', building: 'आदर्श नगर', flatNo: 'C-304', membershipTypeMr: 'वार्षिक सभासद', membershipTypeEn: 'Annual Member', phone: '+91 98214 33221', joinYear: 2016, status: 'सक्रिय' },
    { id: 13, srNo: 13, nameMr: 'श्री. गणेश बाळाराम शिंदे', nameEn: 'Ganesh Balaram Shinde', building: 'शिव स्फूर्ती 2', flatNo: 'B-401', membershipTypeMr: 'आजीवन सभासद', membershipTypeEn: 'Life Member', phone: '+91 98920 11443', joinYear: 2008, status: 'सक्रिय' },
    { id: 14, srNo: 14, nameMr: 'श्री. संजय शांताराम सुर्वे', nameEn: 'Sanjay Shantaram Surve', building: 'आदर्श नगर', flatNo: 'D-203', membershipTypeMr: 'वार्षिक सभासद', membershipTypeEn: 'Annual Member', phone: '+91 98209 88771', joinYear: 2015, status: 'सक्रिय' },
    { id: 15, srNo: 15, nameMr: 'सौ. सुवर्णा मंगेश कदम', nameEn: 'Suvarna Mangesh Kadam', building: 'शिव स्फूर्ती 1', flatNo: 'A-102', membershipTypeMr: 'महिला प्रतिनिधी', membershipTypeEn: 'Women Wing Rep', phone: '+91 98201 44553', joinYear: 2004, status: 'सक्रिय' },
    { id: 16, srNo: 16, nameMr: 'सौ. अनुराधा विलास सावंत', nameEn: 'Anuradha Vilas Sawant', building: 'शिव स्फूर्ती 1', flatNo: 'A-204', membershipTypeMr: 'महिला प्रतिनिधी', membershipTypeEn: 'Women Wing Rep', phone: '+91 98192 33413', joinYear: 2006, status: 'सक्रिय' }
  ]);

  // Advertisement Slider Banners
  readonly advertisementBanners: AdvertisementBanner[] = [
    {
      id: 1,
      sponsorNameMr: 'राजेश ज्वेलर्स अँड सन्स',
      sponsorNameEn: 'Rajesh Jewellers & Sons',
      taglineMr: 'शुद्ध २२ कॅरेट ९१६ हॉलमार्क सुवर्ण व चांदीचे अलौकिक अलंकार',
      taglineEn: 'Pure 22K 916 Hallmarked Gold & Silver Festive Jewellery',
      categoryMr: 'सुवर्ण अलंकार दालन',
      categoryEn: 'Gold & Diamond Showroom',
      phone: '+91 98200 44111',
      offerBadgeMr: 'गणेशोत्सवासाठी घडणावळीवर ५०% सूट!',
      offerBadgeEn: 'Festive 50% Off On Making Charges!',
      addressMr: 'दुकान क्र. ४, स्वामी समर्थ कॉम्पलेक्स, एस. व्ही. रोड, जोगेश्वरी (प)',
      addressEn: 'Shop 4, Swami Samarth Complex, S. V. Road, Jogeshwari (W)',
      bgGradient: 'from-amber-900 via-amber-800 to-yellow-900',
      accentColor: '#f59e0b'
    },
    {
      id: 2,
      sponsorNameMr: 'श्री गणेश केटरर्स अँड इव्हेंट्स',
      sponsorNameEn: 'Shree Ganesh Caterers & Events',
      taglineMr: 'सत्यनारायण महापूजा, लग्नकार्य व सणांसाठी रुचकर व सात्विक महाप्रसाद भोजन व्यवस्था',
      taglineEn: 'Delicious Pure Veg Mahaprasad & Catering for All Auspicious Events',
      categoryMr: 'उत्तम केटरिंग व अन्नदान सेवा',
      categoryEn: 'Pure Veg Catering & Event Food',
      phone: '+91 98190 22334',
      offerBadgeMr: '१००% शुद्ध व घरगुती चव!',
      offerBadgeEn: '100% Hygienic & Authentic Taste!',
      addressMr: 'प्लॉट १२, शिव स्फूर्ती समोर, जोगेश्वरी (पश्चिम), मुंबई',
      addressEn: 'Plot 12, Opp. Shiv Sphurti, Jogeshwari (W), Mumbai',
      bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
      accentColor: '#10b981'
    },
    {
      id: 3,
      sponsorNameMr: 'साई इलेक्ट्रॉनिक्स अँड होम अप्लायन्सेस',
      sponsorNameEn: 'Sai Electronics & Home Appliances',
      taglineMr: 'सर्व नामांकित ब्रँड्सचे स्मार्ट टीव्ही, फ्रिज, वॉशिंग मशीन व एसी वर धमाकेदार डिस्काउंट',
      taglineEn: 'Mega Festive Discounts on Smart TVs, Refrigerators & ACs',
      categoryMr: 'इलेक्ट्रॉनिक्स मेगा स्टोअर',
      categoryEn: 'Consumer Electronics & Appliances',
      phone: '+91 98670 99887',
      offerBadgeMr: '०% व्याज सुलभ EMI उपलब्ध!',
      offerBadgeEn: '0% Interest Easy EMI Available!',
      addressMr: 'आझाद रोड नाका, जोगेश्वरी (पश्चिम), मुंबई-४००१०२',
      addressEn: 'Azad Road Naka, Jogeshwari (West), Mumbai-400102',
      bgGradient: 'from-blue-950 via-indigo-900 to-slate-900',
      accentColor: '#3b82f6'
    },
    {
      id: 4,
      sponsorNameMr: 'समर्थ डेकोरेटर्स अँड साऊंड सिस्टिम्स',
      sponsorNameEn: 'Samarth Decorators & Sound Systems',
      taglineMr: 'भव्य जलरोधक उत्सव मंडप, डिजिटल एलईडी रोषणाई व दर्जेदार ध्वनी यंत्रणा',
      taglineEn: 'Grand Waterproof Mandap Setup, LED Lighting & Audio Systems',
      categoryMr: 'उत्सव मंडप व रोषणाई तज्ज्ञ',
      categoryEn: 'Mandap, Lighting & Sound',
      phone: '+91 98333 11223',
      offerBadgeMr: 'सर्व सण-उत्सवांसाठी अग्रगण्य!',
      offerBadgeEn: 'Premier Event & Stage Partner!',
      addressMr: 'स्टेशन रोड, जोगेश्वरी (पश्चिम), मुंबई',
      addressEn: 'Station Road, Jogeshwari (West), Mumbai',
      bgGradient: 'from-rose-950 via-red-900 to-slate-900',
      accentColor: '#f43f5e'
    }
  ];

  // Initial fallback breakdown matching authentic 2026 Excel data
  private getInitialYearlyFestivalBreakdowns(): YearlyFestivalRecord[] {
    return [
      {
        year: 2026,
        totalCollection: 485000,
        totalExpenses: 340000,
        netBalance: 145000,
        noteMr: 'चालू आर्थिक वर्ष २०२६ - सार्वजनिक गणेशोत्सव भव्य उत्सव व हिशोब पूर्ण.',
        noteEn: 'Current Year 2026 - Ganeshotsav accounts successfully completed.',
        festivals: [
          {
            festivalKey: 'ganpati',
            festivalNameMr: 'सार्वजनिक गणेशोत्सव',
            festivalNameEn: 'Ganeshotsav (Ganpati Utsav)',
            icon: '🪔',
            totalCollection: 485000,
            totalExpenses: 340000,
            balance: 145000,
            donorsCount: 96,
            participationEstimate: 45000
          },
          {
            festivalKey: 'navratri',
            festivalNameMr: 'नवरात्र उत्सव',
            festivalNameEn: 'Navratri Utsav',
            icon: '🔱',
            totalCollection: 0,
            totalExpenses: 0,
            balance: 0,
            donorsCount: 0,
            participationEstimate: 0
          },
          {
            festivalKey: 'ambedkar',
            festivalNameMr: 'डॉ. बाबासाहेब आंबेडकर जयंती',
            festivalNameEn: 'Dr. B. R. Ambedkar Jayanti',
            icon: '⚖️',
            totalCollection: 0,
            totalExpenses: 0,
            balance: 0,
            donorsCount: 0,
            participationEstimate: 0
          }
        ]
      }
    ];
  }

  readonly festivalEvents: FestivalEvent[] = [
    {
      id: 'ganeshotsav',
      nameMr: 'सार्वजनिक गणेशोत्सव २०२६',
      nameEn: 'Sarvajanik Ganeshotsav 2026',
      taglineMr: '॥ जोगेश्वरीचा विघ्नहर्ता ॥ ५६ वे वर्ष',
      datesMr: '२७ ऑगस्ट २०२६ ते ०६ सप्टेंबर २०२६ (१० दिवस)',
      year: 2026,
      descriptionMr: 'जोगेश्वरी (पश्चिम) येथील शिव स्फूर्ती व आदर्श नगर परिसरातील सर्वात मोठा आणि भक्तिमय गणेशोत्सव. यंदाचे ५६ वे वर्ष असून भव्य मंदिरामधील आरास आणि धार्मिक-सांस्कृतिक कार्यक्रमांचे आयोजन करण्यात आले आहे.',
      schedule: [
        { time: 'सकाळी ०८:०० वा.', titleMr: 'प्रातःकालीन महाआरती व अभिषेक', descMr: 'सर्व भाविकांच्या उपस्थितीत गणरायाची षोडशोपचारे नित्य पूजा आणि महाआरती.', icon: 'bell' },
        { time: 'दुपारी १२:०० वा.', titleMr: 'दुपारची आरती व महानैवेद्य', descMr: 'उकडीच्या मोदकांचा विशेष महाभोग आणि मोदक वाटप.', icon: 'utensils' },
        { time: 'दुपारी ०४:०० वा.', titleMr: 'सांस्कृतिक स्पर्धा व मुलांचे कार्यक्रम', descMr: 'चित्रकला, वक्तृत्व, पाठांतर व फॅन्सी ड्रेस स्पर्धा (पारितोषिक वितरण).', icon: 'award' },
        { time: 'संध्याकाळी ०८:०० वा.', titleMr: 'संध्या महाआरती व कीर्तन/भजन', descMr: 'स्थानिक महिला भजनी मंडळ व प्रसिद्ध कीर्तनकारांचे उद्बोधक कीर्तन.', icon: 'flame' },
        { time: 'रात्री १०:०० वा.', titleMr: 'हरिपाठ व शेजारती', descMr: 'शांत आणि भक्तिमय वातावरणात रात्रीची शेजारती.', icon: 'moon' }
      ],
      highlights: [
        'सत्यनारायण महापूजा: ०३ सप्टेंबर २०२६ (दुपारी ०२:०० वा.)',
        'भव्य महाप्रसाद वाटप: ०३ सप्टेंबर २०२६ (दुपारी १२ ते ४, सुमारे २००० भाविक)',
        'भव्य विसर्जन मिरवणूक: ०६ सप्टेंबर २०२६ (अनंत चतुर्दशी - दुपारी ०३:०० वा. निघणार)'
      ],
      notices: [
        'मंडपात पादत्राणे योग्य ठिकाणी ठेवावीत. शांतता राखावी.',
        'आरती वेळी रांगेत उभे राहून दर्शन घ्यावे. स्वयंसेवकांना सहकार्य करावे.',
        'सर्व देणगीदारांना कम्प्युटराइज्ड अधिकृत पावती तत्काळ दिली जाईल.'
      ]
    },
    {
      id: 'navratri',
      nameMr: 'नवरात्र उत्सव २०२६',
      nameEn: 'Navratri Utsav 2026',
      taglineMr: '॥ आदिशक्ती जगदंबेचा जयजयकार ॥',
      datesMr: '२१ सप्टेंबर २०२६ ते ३० सप्टेंबर २०२६ (९ दिवस)',
      year: 2026,
      descriptionMr: 'आई जगदंबेची मंगलमय घटस्थापना, पारंपरिक गरबा व दांडिया रास, अष्टमीचे भव्य हवन व दसरा शस्त्रपूजन.',
      schedule: [
        { time: 'सकाळी ०८:३० वा.', titleMr: 'घटस्थापना व देवीची महाआरती', descMr: 'वैदिक मंत्रोच्चारात कलश स्थापना व दुर्गा सप्तशती पाठ.', icon: 'bell' },
        { time: 'संध्याकाळी ०७:३० वा.', titleMr: 'पारंपरिक भोंडला व आरती', descMr: 'महिला व लहान मुलांचा पारंपरिक भोंडला खेळ.', icon: 'sparkles' },
        { time: 'रात्री ०८:३० वा.', titleMr: 'रास-गरबा व दांडिया महोत्सव', descMr: 'स्थानिक कुटुंबांसाठी सुरक्षित आणि सुसंस्कृत दांडिया.', icon: 'music' }
      ],
      highlights: [
        'दुर्गाष्टमी महाहवन: २८ सप्टेंबर २०२६ (सकाळी ९ ते दुपारी १)',
        'दसरा शस्त्रपूजा व आपट्याची पाने वाटप: ३० सप्टेंबर २०२६'
      ],
      notices: [
        'दांडियासाठी मंडळाचे अधिकृत पासेस अनिवार्य आहेत.'
      ]
    },
    {
      id: 'ambedkar-jayanti',
      nameMr: 'डॉ. बाबासाहेब आंबेडकर जयंती २०२६',
      nameEn: 'Dr. Babasaheb Ambedkar Jayanti 2026',
      taglineMr: '॥ ज्ञानाचे प्रतीक - महामानव ॥',
      datesMr: '१४ एप्रिल २०२६',
      year: 2026,
      descriptionMr: 'भारतीय संविधानाचे शिल्पकार भारतरत्न डॉ. बाबासाहेब आंबेडकर यांच्या जयंतीनिमित्त विचारमंथन व सामाजिक उपक्रम.',
      schedule: [
        { time: 'सकाळी ०९:०० वा.', titleMr: 'प्रतिमा पूजन व सामूहिक बुद्धवंदना', descMr: 'प्रमुख मान्यवरांच्या हस्ते पुष्पहार अर्पण व अभिवादन.', icon: 'flower' },
        { time: 'सकाळी १०:०० वा.', titleMr: 'मोफत रक्तदान व आरोग्य शिबीर', descMr: 'केईएम हॉस्पिटलच्या सहकार्याने रक्तदान शिबीर.', icon: 'heart' },
        { time: 'संध्याकाळी ०६:०० वा.', titleMr: 'विचार प्रबोधन व्याख्यानमाला', descMr: 'संविधान आणि आधुनिक भारत विषयावर ज्येष्ठ विचारवंतांचे व्याख्यान.', icon: 'book-open' }
      ],
      highlights: [
        '१५० रक्तदात्यांचा सहभाग व प्रमाणपत्र वितरण',
        'गरजू विद्यार्थ्यांना वह्या व शैक्षणिक साहित्याचे मोफत वाटप'
      ],
      notices: [
        'रक्तदान शिबिरात जास्तीत जास्त तरुणांनी सहभागी व्हावे.'
      ]
    },
    {
      id: 'shiv-jayanti',
      nameMr: 'छत्रपती शिवाजी महाराज जयंती २०२६',
      nameEn: 'Chhatrapati Shivaji Maharaj Jayanti 2026',
      taglineMr: '॥ जय भवानी, जय शिवाजी ॥',
      datesMr: '१९ फेब्रुवारी २०२६',
      year: 2026,
      descriptionMr: 'अखंड महाराष्ट्राचे आराध्य दैवत छत्रपती शिवाजी महाराज यांच्या जन्मदिनानिमित्त भव्य पालखी सोहळा व मर्दानी खेळांची प्रात्यक्षिके.',
      schedule: [
        { time: 'सकाळी ०७:३० वा.', titleMr: 'शिवनेरीवरून आणलेल्या शिवज्योतीचे स्वागत', descMr: 'मशाल रॅली व भव्य स्वागत.', icon: 'flame' },
        { time: 'सकाळी ०९:०० वा.', titleMr: 'शिवजन्मोत्सव सोहळा व पाळणा', descMr: 'महिला भगिनींच्या उपस्थितीत पारंपरिक शिवपाळणा गीत.', icon: 'sun' },
        { time: 'संध्याकाळी ०५:०० वा.', titleMr: 'पारंपरिक पालखी मिरवणूक', descMr: 'ढोल-ताशांच्या गजरात व लेझीम पथकासह भव्य मिरवणूक.', icon: 'flag' }
      ],
      highlights: [
        'शाहिरी पोवाडा व ऐतिहासिक शिवचरित्र सादरीकरण',
        'पारंपरिक लाठी-काठी व तलवारबाजीची प्रात्यक्षिके'
      ],
      notices: [
        'मिरवणुकीत पारंपरिक पोशाखात (कुर्ता/फेटा) सहभागी व्हावे.'
      ]
    }
  ];

  // Methods to manipulate data
  setYear(year: number) {
    this.selectedYear.set(year);
  }

  setFestival(festival: string) {
    this.selectedFestival.set(festival);
  }

  addVargani(record: Omit<VarganiRecord, 'id' | 'srNo'>) {
    const list = this._varganiRecords();
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newRecord: VarganiRecord = {
      ...record,
      id: newId,
      srNo: list.filter(i => i.year === record.year && i.festival === record.festival).length + 1
    };
    this._varganiRecords.set([newRecord, ...list]);
  }

  addKharch(record: Omit<KharchRecord, 'id' | 'srNo'>) {
    const list = this._kharchRecords();
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newRecord: KharchRecord = {
      ...record,
      id: newId,
      srNo: list.filter(i => i.year === record.year && i.festival === record.festival).length + 1
    };
    this._kharchRecords.set([newRecord, ...list]);
  }

  updateVarganiStatus(id: number, status: 'दिलेली' | 'बाकी', receiptNo?: string) {
    this._varganiRecords.update(records =>
      records.map(r => (r.id === id ? { ...r, status, receiptNo: receiptNo ?? r.receiptNo } : r))
    );
  }

  // Export to Excel
  exportToExcel(type: 'vargani' | 'kharch' | 'balanceSheet') {
    const wb = XLSX.utils.book_new();

    if (type === 'vargani' || type === 'balanceSheet') {
      const varganiData = this.currentVargani().map(item => ({
        'अ. क्र.': item.srNo,
        'नाव (मराठी)': item.nameMr,
        'नाव (English)': item.nameEn,
        'बिल्डिंग / पत्ता': item.building,
        'रक्कम (₹)': item.amount,
        'पावती क्रमांक': item.receiptNo || 'लागू नाही',
        'पावती स्थिती': item.status,
        'तारीख': item.date,
        'भरणा पद्धत': item.paymentMode || 'कॅश',
        'उत्सव': item.festival,
        'वर्ष': item.year
      }));
      const wsVargani = XLSX.utils.json_to_sheet(varganiData);
      XLSX.utils.book_append_sheet(wb, wsVargani, 'वर्गणी तपशील');
    }

    if (type === 'kharch' || type === 'balanceSheet') {
      const kharchData = this.currentKharch().map(item => ({
        'अ. क्र.': item.srNo,
        'खर्चाचे नाव': item.nameMr,
        'प्रकार': item.category,
        'रक्कम (₹)': item.amount,
        'व्हाउचर क्रमांक': item.voucherNo,
        'तारीख': item.date,
        'ज्याला दिले ते नाव': item.paidTo,
        'उत्सव': item.festival,
        'वर्ष': item.year
      }));
      const wsKharch = XLSX.utils.json_to_sheet(kharchData);
      XLSX.utils.book_append_sheet(wb, wsKharch, 'खर्च तपशील');
    }

    const filename = `Shree_Ashtavinayak_Mandal_${this.selectedFestival()}_${this.selectedYear()}_${type}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  // Master Excel Integration & Auto-Reflection
  async loadMasterExcelFromPublic(): Promise<boolean> {
    this.excelLoadStatus.set('loading');
    try {
      // Add cache buster timestamp to ensure fresh load
      const response = await fetch(`/data/mandal_data.xlsx?t=${Date.now()}`);
      if (!response.ok) {
        console.info('[MandalDataService] mandal_data.xlsx not found at /data/, using default initial data.');
        this.excelLoadStatus.set('idle');
        return false;
      }
      const buffer = await response.arrayBuffer();
      const success = this.parseAndApplyWorkbook(buffer, 'mandal_data.xlsx');
      if (success) {
        this.excelLoadStatus.set('success');
        this.excelLoadMessage.set('Excel डेटा थेट कनेक्ट झाला (mandal_data.xlsx)');
        console.log(`[MandalDataService] Loaded mandal_data.xlsx: ${this.sabhasadMembers().length} Sabhasad, ${this._varganiRecords().length} Vargani, ${this._kharchRecords().length} Kharch`);
      } else {
        this.excelLoadStatus.set('error');
      }
      return success;
    } catch (err: any) {
      console.warn('[MandalDataService] Failed to auto-load mandal_data.xlsx:', err);
      this.excelLoadStatus.set('error');
      this.excelLoadMessage.set(err?.message || 'Excel फाईल लोड करताना त्रुटी आली');
      return false;
    }
  }

  async loadExcelFromFile(file: File): Promise<boolean> {
    this.excelLoadStatus.set('loading');
    try {
      const buffer = await file.arrayBuffer();
      const success = this.parseAndApplyWorkbook(buffer, file.name);
      if (success) {
        this.excelLoadStatus.set('success');
        this.excelLoadMessage.set(`"${file.name}" फाईल यशस्वीरित्या सिंक झाली!`);
      } else {
        this.excelLoadStatus.set('error');
        this.excelLoadMessage.set('Excel पार्स करताना त्रुटी आली.');
      }
      return success;
    } catch (err: any) {
      this.excelLoadStatus.set('error');
      this.excelLoadMessage.set(err?.message || 'फाईल वाचताना अडचण आली.');
      return false;
    }
  }

  downloadExcelTemplate() {
    const link = document.createElement('a');
    link.href = '/data/mandal_data.xlsx';
    link.download = 'mandal_data_format.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  parseAndApplyWorkbook(buffer: ArrayBuffer, fileName: string): boolean {
    try {
      const wb = XLSX.read(buffer, { type: 'array' });
      const sheetNames = wb.SheetNames;

      const findSheet = (...names: string[]) => {
        for (const name of names) {
          const found = sheetNames.find(s => s.toLowerCase().includes(name.toLowerCase()));
          if (found) return wb.Sheets[found];
        }
        return null;
      };

      const getVal = (row: any, ...keys: string[]): any => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null && row[k] !== '') {
            return row[k];
          }
          const foundKey = Object.keys(row).find(rk => rk.toLowerCase().includes(k.toLowerCase()));
          if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && row[foundKey] !== '') {
            return row[foundKey];
          }
        }
        return undefined;
      };

      // 1. Sabhasad_Members (सभासद नोंदणी यादी)
      const sabhasadSheet = findSheet('Sabhasad', 'सभासद');
      if (sabhasadSheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(sabhasadSheet);
        if (rawRows.length > 0) {
          const members: SabhasadMember[] = rawRows.map((row, idx) => {
            const srNo = Number(getVal(row, 'Sr_No', 'SrNo', 'अ. क्र.') || (idx + 1));
            const nameMr = String(getVal(row, 'Name_Mr', 'नाव - मराठी', 'नाव') || '').trim();
            const nameEn = String(getVal(row, 'Name_En', 'नाव - English', 'Name') || '').trim();
            const building = String(getVal(row, 'Building', 'इमारत / विंग', 'इमारत') || 'इतर').trim();
            const flatNo = String(getVal(row, 'Flat_No', 'फ्लॅट क्र.', 'Flat') || '').trim();
            const memTypeMr = String(getVal(row, 'Membership_Type_Mr', 'सभासद प्रकार - मराठी', 'सभासद प्रकार') || 'आजीवन सभासद').trim();
            const memTypeEn = String(getVal(row, 'Membership_Type_En', 'Membership Type - English', 'Membership Type') || 'Life Member').trim();
            const phone = String(getVal(row, 'Phone', 'संपर्क क्रमांक', 'संपर्क') || '').trim();
            const joinYear = Number(getVal(row, 'Join_Year', 'प्रवेश वर्ष') || 2026);
            const statusRaw = String(getVal(row, 'Status', 'स्थिती') || 'सक्रिय').trim();

            return {
              id: srNo || idx + 1,
              srNo: srNo || idx + 1,
              nameMr: nameMr || nameEn || 'सभासद',
              nameEn: nameEn || nameMr || 'Member',
              building: building,
              flatNo: flatNo || '-',
              membershipTypeMr: memTypeMr,
              membershipTypeEn: memTypeEn,
              phone: phone || '-',
              joinYear: isNaN(joinYear) ? 2026 : joinYear,
              status: (statusRaw.includes('Active') ? 'Active' : 'सक्रिय') as 'सक्रिय' | 'Active'
            };
          });
          this.sabhasadMembers.set(members);
        }
      }

      // 2. Vargani_Donations (वर्गणी यादी)
      const varganiSheet = findSheet('Vargani', 'वर्गणी', 'donation');
      if (varganiSheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(varganiSheet);
        if (rawRows.length > 0) {
          const varganiRecords: VarganiRecord[] = rawRows.map((row, idx) => {
            const srNo = Number(getVal(row, 'Sr_No', 'SrNo', 'अ. क्र.') || (idx + 1));
            const nameMr = String(getVal(row, 'Name_Mr', 'नाव - मराठी', 'नाव') || '').trim();
            const nameEn = String(getVal(row, 'Name_En', 'नाव - English', 'Name') || '').trim();
            const building = String(getVal(row, 'Building', 'इमारत') || 'इतर').trim();
            const amount = Number(getVal(row, 'Amount', 'रक्कम ₹', 'रक्कम') || 0);
            const receiptNo = getVal(row, 'Receipt_No', 'पावती क्र.', 'पावती');
            const paymentMode = String(getVal(row, 'Payment_Mode', 'भरणा पद्धत') || 'कॅश').trim();
            const statusRaw = String(getVal(row, 'Status', 'पावती स्थिती', 'स्थिती') || 'दिलेली').trim();
            const date = String(getVal(row, 'Date', 'तारीख') || '01/09/2026').trim();
            const festival = String(getVal(row, 'Festival', 'उत्सव') || 'सार्वजनिक गणेशोत्सव').trim();
            const year = Number(getVal(row, 'Year', 'वर्ष') || 2026);
            const phone = String(getVal(row, 'Phone', 'संपर्क') || '').trim();

            return {
              id: srNo || idx + 1,
              srNo: srNo || idx + 1,
              nameMr: nameMr || nameEn || 'देणगीदार',
              nameEn: nameEn || nameMr || 'Donor',
              building: building,
              amount: isNaN(amount) ? 0 : amount,
              receiptNo: receiptNo ? String(receiptNo).trim() : null,
              status: (statusRaw.includes('बाकी') || statusRaw.toLowerCase().includes('pending')) ? 'बाकी' : 'दिलेली',
              festival: festival,
              year: isNaN(year) ? 2026 : year,
              date: date,
              paymentMode: (paymentMode as any) || 'कॅश',
              phone: phone || undefined
            };
          });
          this._varganiRecords.set(varganiRecords);
        }
      }

      // 3. Kharch_Expenses (खर्च नोंदवही)
      const kharchSheet = findSheet('Kharch', 'खर्च', 'expense');
      if (kharchSheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(kharchSheet);
        if (rawRows.length > 0) {
          const kharchRecords: KharchRecord[] = rawRows.map((row, idx) => {
            const srNo = Number(getVal(row, 'Sr_No', 'SrNo', 'अ. क्र.') || (idx + 1));
            const nameMr = String(getVal(row, 'Expense_Name_Mr', 'खर्चाचे नाव - मराठी', 'खर्चाचे नाव') || '').trim();
            const nameEn = String(getVal(row, 'Expense_Name_En', 'खर्चाचे नाव - English', 'Expense Name') || '').trim();
            const amount = Number(getVal(row, 'Amount', 'रक्कम ₹', 'रक्कम') || 0);
            const category = String(getVal(row, 'Category', 'खर्च प्रकार') || 'इतर खर्च').trim();
            const paidTo = String(getVal(row, 'Paid_To', 'देय व्यक्ती / संस्था', 'Paid To') || 'संबंधित विक्रेता').trim();
            const voucherNo = String(getVal(row, 'Voucher_No', 'व्हाउचर क्र.') || `V-2026-${String(idx+1).padStart(3, '0')}`).trim();
            const date = String(getVal(row, 'Date', 'तारीख') || '01/09/2026').trim();
            const festival = String(getVal(row, 'Festival', 'उत्सव') || 'सार्वजनिक गणेशोत्सव').trim();
            const year = Number(getVal(row, 'Year', 'वर्ष') || 2026);
            const desc = String(getVal(row, 'Description', 'विवरण') || '').trim();

            return {
              id: srNo || idx + 1,
              srNo: srNo || idx + 1,
              nameMr: nameMr || nameEn || 'खर्च',
              nameEn: nameEn || nameMr || 'Expense',
              category: category,
              amount: isNaN(amount) ? 0 : amount,
              date: date,
              voucherNo: voucherNo,
              festival: festival,
              year: isNaN(year) ? 2026 : year,
              paidTo: paidTo,
              description: desc || undefined
            };
          });
          this._kharchRecords.set(kharchRecords);
        }
      }

      // 4. Ganpati_Bhandara (गणेशोत्सव भंडारा साहित्य)
      const ganpatiSheet = findSheet('Ganpati_Bhandara', 'गणपती भंडारा', 'गणेशोत्सव भंडारा');
      if (ganpatiSheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(ganpatiSheet);
        if (rawRows.length > 0) {
          const items: BhandaraItem[] = rawRows.map((row, idx) => ({
            id: idx + 1,
            festival: 'गणेशोत्सव',
            itemNameMr: String(getVal(row, 'Item_Name_Mr', 'साहित्याचे नाव - मराठी', 'साहित्याचे नाव') || '').trim(),
            itemNameEn: String(getVal(row, 'Item_Name_En', 'Item Name - English', 'Item Name') || '').trim(),
            quantity: getVal(row, 'Quantity', 'संख्या') || 1,
            unitMr: String(getVal(row, 'Unit', 'एकक') || 'किलो').trim(),
            unitEn: String(getVal(row, 'Unit_En', 'Unit') || 'Kg').trim(),
            donorNameMr: String(getVal(row, 'Donor_Name_Mr', 'देणगीदाराचे नाव - मराठी', 'देणगीदाराचे नाव') || '').trim(),
            donorNameEn: String(getVal(row, 'Donor_Name_En', 'Donor Name - English', 'Donor Name') || '').trim(),
            date: String(getVal(row, 'Date', 'तारीख') || '25/08/2026').trim(),
            remarksMr: getVal(row, 'Remarks', 'शेरा') || undefined
          }));
          this.ganpatiBhandaraItems.set(items);
        }
      }

      // 5. Navratri_Bhandara (नवरात्र भंडारा साहित्य)
      const navratriSheet = findSheet('Navratri_Bhandara', 'नवरात्र भंडारा');
      if (navratriSheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(navratriSheet);
        if (rawRows.length > 0) {
          const items: BhandaraItem[] = rawRows.map((row, idx) => ({
            id: idx + 101,
            festival: 'नवरात्र उत्सव',
            itemNameMr: String(getVal(row, 'Item_Name_Mr', 'साहित्याचे नाव - मराठी', 'साहित्याचे नाव') || '').trim(),
            itemNameEn: String(getVal(row, 'Item_Name_En', 'Item Name - English', 'Item Name') || '').trim(),
            quantity: getVal(row, 'Quantity', 'संख्या') || 1,
            unitMr: String(getVal(row, 'Unit', 'एकक') || 'किलो').trim(),
            unitEn: String(getVal(row, 'Unit_En', 'Unit') || 'Kg').trim(),
            donorNameMr: String(getVal(row, 'Donor_Name_Mr', 'देणगीदाराचे नाव - मराठी', 'देणगीदाराचे नाव') || '').trim(),
            donorNameEn: String(getVal(row, 'Donor_Name_En', 'Donor Name - English', 'Donor Name') || '').trim(),
            date: String(getVal(row, 'Date', 'तारीख') || '20/09/2026').trim(),
            remarksMr: getVal(row, 'Remarks', 'शेरा') || undefined
          }));
          this.navratriBhandaraItems.set(items);
        }
      }

      // 6. Navratri_Sarees (नवरात्र साडी देणगीदार)
      const sareeSheet = findSheet('Navratri_Sarees', 'साडी', 'Saree');
      if (sareeSheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(sareeSheet);
        if (rawRows.length > 0) {
          const donors: SareeDonor[] = rawRows.map((row, idx) => ({
            id: idx + 201,
            donorNameMr: String(getVal(row, 'Donor_Name_Mr', 'भाविकाचे नाव - मराठी', 'भाविकाचे नाव') || '').trim(),
            donorNameEn: String(getVal(row, 'Donor_Name_En', 'Donor Name - English', 'Donor Name') || '').trim(),
            itemMr: String(getVal(row, 'Saree_Details_Mr', 'साडी तपशील - मराठी', 'साडी तपशील') || '').trim(),
            itemEn: String(getVal(row, 'Saree_Details_En', 'Saree Details - English', 'Saree Details') || '').trim(),
            quantity: Number(getVal(row, 'Quantity', 'संख्या') || 1),
            date: String(getVal(row, 'Date', 'तारीख') || '21/09/2026').trim(),
            remarksMr: getVal(row, 'Remarks', 'शेरा') || undefined
          }));
          this.navratriSareeDonors.set(donors);
        }
      }

      // 7. Yearly_Archive (वर्षनिहाय ऐतिहासिक हिशोब व ताळेबंद)
      const yearlySheet = findSheet('Yearly_Archive', 'Yearly', 'वर्षनिहाय', 'archive');
      if (yearlySheet) {
        const rawRows = XLSX.utils.sheet_to_json<any>(yearlySheet);
        if (rawRows.length > 0) {
          const yearMap = new Map<number, YearlyFestivalFinancials[]>();
          const yearNotes = new Map<number, { mr: string; en: string }>();

          rawRows.forEach((row: any) => {
            const yr = Number(getVal(row, 'Year', 'वर्ष') || 2026);
            if (isNaN(yr)) return;

            const festRaw = String(getVal(row, 'Festival', 'उत्सव') || '').trim();
            let festKey: 'ganpati' | 'navratri' | 'ambedkar' = 'ganpati';
            let festNameMr = 'सार्वजनिक गणेशोत्सव';
            let festNameEn = 'Ganeshotsav (Ganpati Utsav)';
            let icon = '🪔';

            if (festRaw.includes('नवरात्र') || festRaw.toLowerCase().includes('navratri')) {
              festKey = 'navratri';
              festNameMr = 'नवरात्र उत्सव';
              festNameEn = 'Navratri Utsav';
              icon = '🔱';
            } else if (festRaw.includes('आंबेडकर') || festRaw.toLowerCase().includes('ambedkar')) {
              festKey = 'ambedkar';
              festNameMr = 'डॉ. बाबासाहेब आंबेडकर जयंती';
              festNameEn = 'Dr. B. R. Ambedkar Jayanti';
              icon = '⚖️';
            }

            const coll = Number(getVal(row, 'Total_Collection', 'एकूण वर्गणी जमा ₹', 'वर्गणी जमा', 'Amount', 'रक्कम') || 0);
            const exp = Number(getVal(row, 'Total_Expenses', 'झालेला खर्च ₹', 'झालेला एकूण खर्च ₹', 'खर्च') || 0);
            const balVal = getVal(row, 'Net_Balance', 'शिल्लक गंगाजळी ₹', 'शिल्लक रक्कम ₹', 'शिल्लक');
            const bal = balVal !== undefined ? Number(balVal) : (coll - exp);
            const donors = Number(getVal(row, 'Donors_Count', 'देणगीदार संख्या', 'देणगीदार') || 0);
            const part = Number(getVal(row, 'Participation_Estimate', 'सहभागी भाविक', 'भाविक') || 0);

            const noteMr = String(getVal(row, 'Note_Mr', 'वार्षिक नोंद - मराठी', 'वार्षिक नोंद', 'शेरा') || '').trim();
            const noteEn = String(getVal(row, 'Note_En', 'Yearly Note - English', 'Note') || '').trim();

            if (!yearNotes.has(yr) && (noteMr || noteEn)) {
              yearNotes.set(yr, { mr: noteMr, en: noteEn });
            }

            if (!yearMap.has(yr)) {
              yearMap.set(yr, []);
            }

            yearMap.get(yr)!.push({
              festivalKey: festKey,
              festivalNameMr: festNameMr,
              festivalNameEn: festNameEn,
              icon: icon,
              totalCollection: isNaN(coll) ? 0 : coll,
              totalExpenses: isNaN(exp) ? 0 : exp,
              balance: isNaN(bal) ? (coll - exp) : bal,
              donorsCount: donors,
              participationEstimate: part
            });
          });

          const parsedYearlyRecords: YearlyFestivalRecord[] = [];
          yearMap.forEach((festivals, yr) => {
            const totColl = festivals.reduce((s, f) => s + f.totalCollection, 0);
            const totExp = festivals.reduce((s, f) => s + f.totalExpenses, 0);
            const notes = yearNotes.get(yr) || { mr: '', en: '' };

            parsedYearlyRecords.push({
              year: yr,
              festivals: festivals,
              totalCollection: totColl,
              totalExpenses: totExp,
              netBalance: totColl - totExp,
              noteMr: notes.mr || `वर्ष ${this.toMarathiDigits(yr)} चा हिशोब व ताळेबंद.`,
              noteEn: notes.en || `Year ${yr} financial statements & festival accounts.`
            });
          });

          if (parsedYearlyRecords.length > 0) {
            this._baseYearlyFestivalBreakdowns.set(parsedYearlyRecords);
            console.log(`[MandalDataService] Successfully parsed ${parsedYearlyRecords.length} yearly archive records from Excel.`);
          }
        }
      }

      this.isExcelLoaded.set(true);
      this.excelFileName.set(fileName);
      this.lastExcelUpdate.set(new Date());
      return true;
    } catch (e: any) {
      console.error('[MandalDataService] Failed to parse workbook:', e);
      return false;
    }
  }

  // Import JSON / Excel
  importVarganiFromJSON(data: Partial<VarganiRecord>[]) {
    const list = [...this._varganiRecords()];
    let nextId = Math.max(...list.map(i => i.id), 0) + 1;

    data.forEach((item, index) => {
      list.unshift({
        id: nextId++,
        srNo: list.length + 1,
        nameMr: item.nameMr || 'अनामिक देणगीदार',
        nameEn: item.nameEn || 'Anonymous Donor',
        building: item.building || 'इतर',
        amount: Number(item.amount) || 1000,
        receiptNo: item.receiptNo || `100${nextId}`,
        status: item.status === 'बाकी' ? 'बाकी' : 'दिलेली',
        festival: this.selectedFestival(),
        year: this.selectedYear(),
        date: item.date || '01/09/2026',
        paymentMode: item.paymentMode || 'UPI / GPay'
      });
    });

    this._varganiRecords.set(list);
  }

  // Seed Data Generator: Exact match for 2026 reference image
  private generateInitialVargani(): VarganiRecord[] {
    const records: VarganiRecord[] = [];

    // Top 5 Exact Rows from reference image:
    // 1 | रोहन महाडिक | शिव स्फूर्ती 1 | ₹ 5,000 | 100001 | दिलेली
    // 2 | हर्ष फाटक | शिव स्फूर्ती 2 | ₹ 5,000 | 100002 | दिलेली
    // 3 | अमोल पाटील | आदर्श नगर | ₹ 2,500 | - | बाकी
    // 4 | संदीप शिंदे | शिव स्फूर्ती 1 | ₹ 5,000 | 100004 | दिलेली
    // 5 | प्रिया कदम | शिव स्फूर्ती 2 | ₹ 2,500 | - | बाकी
    records.push(
      { id: 1, srNo: 1, nameMr: 'रोहन महाडिक', nameEn: 'Rohan Mahadik', building: 'शिव स्फूर्ती 1', amount: 5000, receiptNo: '100001', status: 'दिलेली', festival: 'सार्वजनिक गणेशोत्सव', year: 2026, date: '01/09/2026', paymentMode: 'UPI / GPay', phone: '9820112233' },
      { id: 2, srNo: 2, nameMr: 'हर्ष फाटक', nameEn: 'Harsh Phatak', building: 'शिव स्फूर्ती 2', amount: 5000, receiptNo: '100002', status: 'दिलेली', festival: 'सार्वजनिक गणेशोत्सव', year: 2026, date: '01/09/2026', paymentMode: 'कॅश', phone: '9820223344' },
      { id: 3, srNo: 3, nameMr: 'अमोल पाटील', nameEn: 'Amol Patil', building: 'आदर्श नगर', amount: 2500, receiptNo: null, status: 'बाकी', festival: 'सार्वजनिक गणेशोत्सव', year: 2026, date: '02/09/2026', paymentMode: 'कॅश', phone: '9820334455' },
      { id: 4, srNo: 4, nameMr: 'संदीप शिंदे', nameEn: 'Sandeep Shinde', building: 'शिव स्फूर्ती 1', amount: 5000, receiptNo: '100004', status: 'दिलेली', festival: 'सार्वजनिक गणेशोत्सव', year: 2026, date: '02/09/2026', paymentMode: 'कॅश', phone: '9820445566' },
      { id: 5, srNo: 5, nameMr: 'प्रिया कदम', nameEn: 'Priya Kadam', building: 'शिव स्फूर्ती 2', amount: 2500, receiptNo: null, status: 'बाकी', festival: 'सार्वजनिक गणेशोत्सव', year: 2026, date: '02/09/2026', paymentMode: 'कॅश', phone: '9820556677' }
    );

    // Now populate remaining 91 records to complete exactly 96 members for 2026 Ganeshotsav
    // Exact totals required:
    // शिव स्फूर्ती 1: ₹ 1,80,000 (Current: 10,000, Remaining: 1,70,000)
    // शिव स्फूर्ती 2: ₹ 1,25,000 (Current: 7,50, Remaining: 1,17,500)
    // आदर्श नगर: ₹ 95,000 (Current: 2,500, Remaining: 92,500)
    // इतर: ₹ 85,000 (Current: 0, Remaining: 85,000)
    // Total Vargani: ₹ 4,85,000!
    // Receipts Issued: exactly 84 (Current: 3 दिलेली, 2 बाकी. Remaining: 81 दिलेली, 10 बाकी). Total = 84 दिलेली, 12 बाकी = 96 members! (87.5% ~ 87%)

    const marathiFirstNames = [
      { mr: 'गणेश', en: 'Ganesh' }, { mr: 'महेश', en: 'Mahesh' }, { mr: 'सुनील', en: 'Sunil' },
      { mr: 'अशोक', en: 'Ashok' }, { mr: 'राजेश', en: 'Rajesh' }, { mr: 'दिलीप', en: 'Dilip' },
      { mr: 'विकास', en: 'Vikas' }, { mr: 'विजय', en: 'Vijay' }, { mr: 'संतोष', en: 'Santosh' },
      { mr: 'समीर', en: 'Sameer' }, { mr: 'नितीन', en: 'Nitin' }, { mr: 'प्रमोद', en: 'Pramod' },
      { mr: 'शेखर', en: 'Shekhar' }, { mr: 'दीपक', en: 'Deepak' }, { mr: 'संजय', en: 'Sanjay' },
      { mr: 'अजय', en: 'Ajay' }, { mr: 'मनोज', en: 'Manoj' }, { mr: 'राहुल', en: 'Rahul' },
      { mr: 'प्रशांत', en: 'Prashant' }, { mr: 'सुधीर', en: 'Sudhir' }, { mr: 'योगेश', en: 'Yogesh' },
      { mr: 'अनिल', en: 'Anil' }, { mr: 'किरण', en: 'Kiran' }, { mr: 'विशाल', en: 'Vishal' },
      { mr: 'अमित', en: 'Amit' }, { mr: 'सागर', en: 'Sagar' }, { mr: 'आनंद', en: 'Anand' },
      { mr: 'सुरेश', en: 'Suresh' }, { mr: 'सचिन', en: 'Sachin' }, { mr: 'प्रवीण', en: 'Praveen' },
      { mr: 'विनायक', en: 'Vinayak' }, { mr: 'दत्तात्रय', en: 'Dattatray' }, { mr: 'कैलास', en: 'Kailas' },
      { mr: 'बाळकृष्ण', en: 'Balkrishna' }, { mr: 'तुकाराम', en: 'Tukaram' }, { mr: 'ज्ञानेश्वर', en: 'Dnyaneshwar' }
    ];

    const marathiLastNames = [
      { mr: 'सावंत', en: 'Sawant' }, { mr: 'मोरे', en: 'More' }, { mr: 'जाधव', en: 'Jadhav' },
      { mr: 'तांबडे', en: 'Tambde' }, { mr: 'परब', en: 'Parab' }, { mr: 'राणे', en: 'Rane' },
      { mr: 'गावडे', en: 'Gawde' }, { mr: 'कदम', en: 'Kadam' }, { mr: 'शिंदे', en: 'Shinde' },
      { mr: 'पाटील', en: 'Patil' }, { mr: 'चव्हाण', en: 'Chavan' }, { mr: 'भोसले', en: 'Bhosale' },
      { mr: 'सुर्वे', en: 'Surve' }, { mr: 'साळुंखे', en: 'Salunkhe' }, { mr: 'देशमुख', en: 'Deshmukh' },
      { mr: 'माने', en: 'Mane' }, { mr: 'घाडगे', en: 'Ghadge' }, { mr: 'धुमाळ', en: 'Dhumal' }
    ];

    let receiptCounter = 100005;
    let bakiRemaining = 10;

    // Helper to generate records for a building to hit target sum and count
    const generateBuildingRecords = (
      buildingName: string,
      targetAmount: number,
      count: number
    ) => {
      let currentSum = 0;
      for (let i = 0; i < count; i++) {
        const fn = marathiFirstNames[(records.length + i * 3) % marathiFirstNames.length];
        const ln = marathiLastNames[(records.length + i * 2) % marathiLastNames.length];
        const isLast = i === count - 1;
        
        let amount = Math.floor(targetAmount / count / 500) * 500;
        if (isLast) {
          amount = targetAmount - currentSum;
        } else {
          currentSum += amount;
        }

        const isBaki = bakiRemaining > 0 && (i % 8 === 0 || isLast);
        let status: 'दिलेली' | 'बाकी' = 'दिलेली';
        let receiptNo: string | null = (receiptCounter++).toString();

        if (isBaki) {
          status = 'बाकी';
          receiptNo = null;
          bakiRemaining--;
        }

        const day = (3 + (i % 15)).toString().padStart(2, '0');
        records.push({
          id: records.length + 1,
          srNo: records.length + 1,
          nameMr: `${fn.mr} ${ln.mr}`,
          nameEn: `${fn.en} ${ln.en}`,
          building: buildingName,
          amount: amount,
          receiptNo: receiptNo,
          status: status,
          festival: 'सार्वजनिक गणेशोत्सव',
          year: 2026,
          date: `${day}/09/2026`,
          paymentMode: i % 3 === 0 ? 'UPI / GPay' : 'कॅश',
          phone: `9820${(100000 + records.length).toString().slice(1)}`
        });
      }
    };

    // 1. Shiv Sfurti 1 remaining: ₹1,70,000 over 34 members (Total: ₹1,80,000)
    generateBuildingRecords('शिव स्फूर्ती 1', 170000, 34);

    // 2. Shiv Sfurti 2 remaining: ₹1,17,500 over 24 members (Total: ₹1,25,000)
    generateBuildingRecords('शिव स्फूर्ती 2', 117500, 24);

    // 3. Adarsh Nagar remaining: ₹92,500 over 18 members (Total: ₹95,000)
    generateBuildingRecords('आदर्श नगर', 92500, 18);

    // 4. Itar remaining: ₹85,000 over 15 members (Total: ₹85,000)
    generateBuildingRecords('इतर', 85000, 15);

    // Ensure exact counts: 96 total records, exactly 84 'दिलेली' and 12 'बाकी'
    const totalIssued = records.filter(r => r.status === 'दिलेली').length;
    if (totalIssued !== 84) {
      let diff = 84 - totalIssued;
      for (const r of records) {
        if (diff > 0 && r.status === 'बाकी' && r.id > 5) {
          r.status = 'दिलेली';
          r.receiptNo = (receiptCounter++).toString();
          diff--;
        } else if (diff < 0 && r.status === 'दिलेली' && r.id > 5) {
          r.status = 'बाकी';
          r.receiptNo = null;
          diff++;
        }
      }
    }

    return records;
  }

  // Seed Data Generator: Exact match for 2026 reference image
  private generateInitialKharch(): KharchRecord[] {
    const list: KharchRecord[] = [];

    // Exact top 5 rows from reference image:
    // 1 | गणपती मूर्ती | ₹ 1,00,000 | 01/09/2026
    // 2 | मंडप | ₹ 20,000 | 02/09/2026
    // 3 | स्पायरो | ₹ 10,000 | 03/09/2026
    // 4 | गिफ्ट्स | ₹ 10,000 | 04/09/2026
    // 5 | इतर खर्च | ₹ 2,00,000 | 05/09/2026
    // Total for these 5 categories = ₹ 3,40,000!
    // And total entries is 12 (as seen in card "एकूण 12 खर्च नोंदी").
    // Let's break down 'इतर खर्च' into remaining itemized vouchers (totaling ₹ 2,00,000) so that total records = 12, total sum = ₹ 3,40,000!

    list.push(
      {
        id: 1,
        srNo: 1,
        nameMr: 'गणपती मूर्ती',
        nameEn: 'Ganpati Murti',
        category: 'मूर्ती व प्रतिष्ठापना',
        amount: 100000,
        date: '01/09/2026',
        voucherNo: 'V-2026-001',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'कलाकुंज आर्ट्स (विजय खातू स्टुडिओ, परळ)',
        description: '९ फूट उंच आकर्षक शाडू मातीची अष्टविनायक मूर्ती आणि बैठक व्यवस्था.',
        approvedBy: 'मंगेश कदम (अध्यक्ष)'
      },
      {
        id: 2,
        srNo: 2,
        nameMr: 'मंडप',
        nameEn: 'Mandap',
        category: 'मंडप व्यवस्था',
        amount: 20000,
        date: '02/09/2026',
        voucherNo: 'V-2026-002',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'स्वास्तिक मंडप डेकोरेटर्स, जोगेश्वरी',
        description: 'वॉटरप्रूफ मंडप, सुरक्षित स्टेज, बॅरिकेड्स व व्हीआयपी रांग व्यवस्था.',
        approvedBy: 'सचिन तांबडे (कार्यवाह)'
      },
      {
        id: 3,
        srNo: 3,
        nameMr: 'स्पायरो',
        nameEn: 'Spyro',
        category: 'स्पायरो व तांत्रिक यंत्रणा',
        amount: 10000,
        date: '03/09/2026',
        voucherNo: 'V-2026-003',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'महालक्ष्मी इलेक्ट्रॉनिक्स & स्पायरो सर्व्हिसेस',
        description: 'स्पायरो मशीन, फॉग इफेक्ट्स आणि स्टेज ऑटोमेशन कंट्रोल सिस्टीम भाडे.',
        approvedBy: 'राजेश परब (खजिनदार)'
      },
      {
        id: 4,
        srNo: 4,
        nameMr: 'गिफ्ट्स',
        nameEn: 'Gifts',
        category: 'गिफ्ट्स व पारितोषिके',
        amount: 10000,
        date: '04/09/2026',
        voucherNo: 'V-2026-004',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'न्यू रॉयल गिफ्ट्स अँड ट्रॉफीज, अंधेरी',
        description: 'सांस्कृतिक स्पर्धा व बाल कलाकारांसाठी ट्रॉफीज, मेडल व शैक्षणिक भेटवस्तू.',
        approvedBy: 'अमोल पाटील (व्यवस्थापक)'
      },
      // Break down the remaining ₹2,00,000 into realistic itemized vouchers totaling 12 entries
      {
        id: 5,
        srNo: 5,
        nameMr: 'इतर खर्च (विद्युत रोषणाई व जनरेटर)',
        nameEn: 'Lighting & Generator',
        category: 'इतर खर्च',
        amount: 45000,
        date: '05/09/2026',
        voucherNo: 'V-2026-005',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'ओम साई लाईट्स & जनरेटर सप्लायर्स',
        description: '१० दिवस एलईडी फोकस, आकर्षक विद्युत कमानी व सायलेंट जनरेटर बॅकअप.',
        approvedBy: 'विलास सावंत (उपाध्यक्ष)'
      },
      {
        id: 6,
        srNo: 6,
        nameMr: 'इतर खर्च (ध्वनीक्षेपके व डीजे साऊंड)',
        nameEn: 'Sound System & Acoustics',
        category: 'इतर खर्च',
        amount: 35000,
        date: '05/09/2026',
        voucherNo: 'V-2026-006',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'सूरज साऊंड सिस्टीम, जोगेश्वरी',
        description: '१० दिवस डिजिटल जेबीएल साऊंड, वायरलेस माईक व आरती व्यवस्था.',
        approvedBy: 'सचिन तांबडे (कार्यवाह)'
      },
      {
        id: 7,
        srNo: 7,
        nameMr: 'इतर खर्च (महाप्रसाद व भोजन व्यवस्था)',
        nameEn: 'Maha Prasad & Catering',
        category: 'इतर खर्च',
        amount: 40000,
        date: '05/09/2026',
        voucherNo: 'V-2026-007',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'अन्नपूर्णा केटरर्स, गोरेगाव',
        description: 'सत्यनारायण महापूजा महाप्रसाद (शिरा, मसालेभात, भाजी व लाडू) २००० भाविकांसाठी.',
        approvedBy: 'मंगेश कदम (अध्यक्ष)'
      },
      {
        id: 8,
        srNo: 8,
        nameMr: 'इतर खर्च (सत्यनारायण महापूजा व भटजी मानधन)',
        nameEn: 'Satyanarayan Puja & Dakshina',
        category: 'इतर खर्च',
        amount: 15000,
        date: '05/09/2026',
        voucherNo: 'V-2026-008',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'वेदमूर्ती जोशी गुरुजी व पूजा साहित्य',
        description: '१० दिवसांचे नित्य पूजा साहित्य, दूर्वा, हार-फुले व सत्यनारायण विधी.',
        approvedBy: 'राजेश परब (खजिनदार)'
      },
      {
        id: 9,
        srNo: 9,
        nameMr: 'इतर खर्च (विसर्जन मिरवणूक ट्रॅक्टर व ढोल-ताशा)',
        nameEn: 'Visarjan Tractor & Dhol Tasha',
        category: 'इतर खर्च',
        amount: 30000,
        date: '05/09/2026',
        voucherNo: 'V-2026-009',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'शिवगर्जना ढोल-ताशा पथक व ट्रॅक्टर चालक',
        description: 'अनंत चतुर्दशी विसर्जन मिरवणूक रथ, ट्रॅक्टर भाडे व पुष्पवृष्टी तोफ.',
        approvedBy: 'रोहन महाडिक (युवा प्रमुख)'
      },
      {
        id: 10,
        srNo: 10,
        nameMr: 'इतर खर्च (सीसीटीव्ही व खाजगी सुरक्षा गार्ड)',
        nameEn: 'CCTV & Security',
        category: 'इतर खर्च',
        amount: 15000,
        date: '05/09/2026',
        voucherNo: 'V-2026-010',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'फाल्कन सिक्युरिटी सर्व्हिसेस, मुंबई',
        description: '८ एचडी सीसीटीव्ही कॅमेरे २४ तास रेकॉर्डिंग आणि महिला/पुरुष गार्ड्स.',
        approvedBy: 'विलास सावंत (उपाध्यक्ष)'
      },
      {
        id: 11,
        srNo: 11,
        nameMr: 'इतर खर्च (मंडळ टी-शर्ट्स व बॅजेस)',
        nameEn: 'Volunteer T-Shirts & Badges',
        category: 'इतर खर्च',
        amount: 12000,
        date: '05/09/2026',
        voucherNo: 'V-2026-011',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'युवा प्रिंटर्स, दादर',
        description: '५० स्वयंसेवकांसाठी भगवे टी-शर्ट्स आणि ओळखपत्रे.',
        approvedBy: 'सुधीर सावंत (सह-खजिनदार)'
      },
      {
        id: 12,
        srNo: 12,
        nameMr: 'इतर खर्च (स्थानिक परवानग्या व स्टेशनरी)',
        nameEn: 'Permissions & Printing',
        category: 'इतर खर्च',
        amount: 8000,
        date: '05/09/2026',
        voucherNo: 'V-2026-012',
        festival: 'सार्वजनिक गणेशोत्सव',
        year: 2026,
        paidTo: 'महापालिका व पोलीस नाहरकत, पावती पुस्तक छपाई',
        description: 'बीएमसी, ट्रॅफिक पोलीस, अग्निशामक दल परवानग्या व पावती पुस्तके छपाई.',
        approvedBy: 'सचिन तांबडे (कार्यवाह)'
      }
    );

    // Sum of items 5 to 12: 45000 + 35000 + 40000 + 15000 + 30000 + 15000 + 12000 + 8000 = 2,00,000!
    // Exact match for "इतर खर्च: ₹ 2,00,000" in Horizontal Bar Chart!
    // Exact match for Total Kharch: 100000 + 20000 + 10000 + 10000 + 200000 = ₹ 3,40,000!
    // Exact count: 12 entries!

    return list;
  }
}
