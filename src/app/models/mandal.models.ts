export interface VarganiRecord {
  id: number;
  srNo: number;
  nameMr: string;
  nameEn: string;
  building: string;
  amount: number;
  receiptNo: string | null;
  status: 'दिलेली' | 'बाकी';
  festival: string;
  year: number;
  date: string;
  phone?: string;
  paymentMode?: 'कॅश' | 'UPI / GPay' | 'चेक' | 'बँक ट्रान्सफर';
  note?: string;
}

export interface KharchRecord {
  id: number;
  srNo: number;
  nameMr: string;
  nameEn: string;
  category: string;
  amount: number;
  date: string;
  voucherNo: string;
  festival: string;
  year: number;
  paidTo: string;
  description?: string;
  approvedBy?: string;
}

export interface SummaryKpi {
  totalVargani: number;
  totalMembers: number;
  totalKharch: number;
  totalKharchEntries: number;
  balanceAmount: number;
  receiptsIssued: number;
  totalReceipts: number;
  receiptPercent: number;
}

export interface BuildingDistribution {
  building: string;
  amount: number;
  color: string;
}

export interface ExpenseDistribution {
  category: string;
  amount: number;
  color: string;
}

export interface CommitteeMember {
  id: number;
  designationMr: string;
  designationEn: string;
  nameMr: string;
  nameEn: string;
  phone: string;
  roleType: 'पदाधिकारी' | 'सल्लागार' | 'प्रमुख सदस्य';
  experienceYears: number;
  avatarBg: string;
}

export interface FestivalEvent {
  id: string;
  nameMr: string;
  nameEn: string;
  taglineMr: string;
  datesMr: string;
  year: number;
  descriptionMr: string;
  schedule: {
    time: string;
    titleMr: string;
    descMr: string;
    icon: string;
  }[];
  highlights: string[];
  notices: string[];
}

export interface YearlySummary {
  year: number;
  totalVargani: number;
  totalKharch: number;
  balance: number;
  memberCount: number;
  kharchCount: number;
  receiptsIssued: number;
  growthPercent: string;
  majorAccomplishment: string;
  majorAccomplishmentEn?: string;
}

export interface BhandaraItem {
  id: number;
  festival: 'गणेशोत्सव' | 'नवरात्र उत्सव';
  itemNameMr: string;
  itemNameEn: string;
  quantity: number | string;
  unitMr: string;
  unitEn: string;
  donorNameMr: string;
  donorNameEn: string;
  date: string;
  remarksMr?: string;
  remarksEn?: string;
}

export interface SareeDonor {
  id: number;
  donorNameMr: string;
  donorNameEn: string;
  itemMr: string;
  itemEn: string;
  quantity: number;
  date: string;
  remarksMr?: string;
  remarksEn?: string;
}

export interface SabhasadMember {
  id: number;
  srNo: number;
  nameMr: string;
  nameEn: string;
  building: string;
  flatNo: string;
  membershipTypeMr: string;
  membershipTypeEn: string;
  phone: string;
  joinYear: number;
  status: 'सक्रिय' | 'Active';
}

export interface AdvertisementBanner {
  id: number;
  sponsorNameMr: string;
  sponsorNameEn: string;
  taglineMr: string;
  taglineEn: string;
  categoryMr: string;
  categoryEn: string;
  phone: string;
  offerBadgeMr: string;
  offerBadgeEn: string;
  addressMr: string;
  addressEn: string;
  bgGradient: string;
  accentColor: string;
}

export interface YearlyFestivalFinancials {
  festivalKey: 'ganpati' | 'navratri' | 'ambedkar';
  festivalNameMr: string;
  festivalNameEn: string;
  icon: string;
  totalCollection: number;
  totalExpenses: number;
  balance: number;
  donorsCount?: number;
  participationEstimate?: number;
}

export interface YearlyFestivalRecord {
  year: number;
  festivals: YearlyFestivalFinancials[];
  totalCollection: number;
  totalExpenses: number;
  netBalance: number;
  noteMr: string;
  noteEn: string;
}

