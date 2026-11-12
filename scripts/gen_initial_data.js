const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Sync from root if user placed an updated Excel file in root
const rootCandidates = [
  path.join(__dirname, '../mandal_data.xlsx'),
  path.join(__dirname, '../mandal_data_format.xlsx')
];
const targetExcel = path.join(__dirname, '../public/data/mandal_data.xlsx');

for (const c of rootCandidates) {
  if (fs.existsSync(c)) {
    try {
      const cStat = fs.statSync(c);
      const tStat = fs.existsSync(targetExcel) ? fs.statSync(targetExcel) : null;
      if (!tStat || cStat.mtimeMs > tStat.mtimeMs) {
        fs.copyFileSync(c, targetExcel);
        console.log(`[sync] Copied newer root file ${path.basename(c)} -> public/data/mandal_data.xlsx`);
      }
    } catch (e) {
      // ignore
    }
  }
}

if (!fs.existsSync(targetExcel)) {
  console.error('Target Excel file not found at:', targetExcel);
  process.exit(1);
}

const wb = XLSX.readFile(targetExcel);

const getVal = (row, ...keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
    const foundKey = Object.keys(row).find(rk => rk.toLowerCase().includes(k.toLowerCase()));
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && row[foundKey] !== '') return row[foundKey];
  }
  return undefined;
};

const findSheet = (...names) => {
  for (const n of names) {
    const match = wb.SheetNames.find(sn => sn.toLowerCase().includes(n.toLowerCase()));
    if (match) return wb.Sheets[match];
  }
  return null;
};

// 1. Vargani Donations
const varganiSheet = findSheet('Vargani', 'वर्गणी', 'donation');
const rawVargani = varganiSheet ? XLSX.utils.sheet_to_json(varganiSheet) : [];
const varganiRecords = rawVargani.map((row, idx) => {
  const srNo = Number(getVal(row, 'Sr_No', 'SrNo', 'अ. क्र.') || (idx + 1));
  const nameMr = String(getVal(row, 'Name_Mr', 'नाव - मराठी', 'नाव') || '').trim();
  const nameEn = String(getVal(row, 'Name_En', 'नाव - English', 'Name') || '').trim();
  const rawBuilding = getVal(row, 'Source', 'स्त्रोत', 'माध्यम', 'Building', 'बिल्डिंग', 'इमारत', 'विंग');
  const building = (rawBuilding && String(rawBuilding).trim() !== 'undefined' && String(rawBuilding).trim()) ? String(rawBuilding).trim() : 'इतर';
  const rawAmount = getVal(row, 'Amount', 'रक्कम ₹', 'रक्कम') || 0;
  const cleanAmount = typeof rawAmount === 'string' ? Number(rawAmount.replace(/[^0-9.]/g, '')) : Number(rawAmount);
  const amount = isNaN(cleanAmount) ? 0 : cleanAmount;
  const rawReceiptNo = getVal(row, 'Receipt_No', 'पावती क्र.', 'पावती');
  const receiptNo = (rawReceiptNo !== undefined && rawReceiptNo !== null && String(rawReceiptNo).trim() !== '') ? String(rawReceiptNo).trim() : null;

  const rawPayment = String(getVal(row, 'Payment_Mode', 'भरणा पद्धत') || 'कॅश').trim();
  let paymentMode = 'कॅश';
  const lowerPay = rawPayment.toLowerCase();
  if (lowerPay.includes('gpay') || lowerPay.includes('upi') || lowerPay.includes('online')) {
    paymentMode = 'UPI / GPay';
  } else if (lowerPay.includes('cheque') || lowerPay.includes('चेक')) {
    paymentMode = 'चेक';
  } else if (lowerPay.includes('bank') || lowerPay.includes('बँक')) {
    paymentMode = 'बँक ट्रान्सफर';
  }

  const statusRaw = String(getVal(row, 'Status', 'पावती स्थिती', 'स्थिती') || 'दिलेली').trim().toLowerCase();
  const status = (statusRaw.includes('not') || statusRaw.includes('बाकी') || statusRaw.includes('pending') || statusRaw === 'no') ? 'बाकी' : 'दिलेली';

  const date = String(getVal(row, 'Date', 'तारीख') || '01/09/2026').trim();
  const rawFest = String(getVal(row, 'Festival', 'उत्सव') || 'सार्वजनिक गणेशोत्सव').trim();
  const festival = (rawFest.includes('गणेश') || rawFest.toLowerCase().includes('ganesh')) ? 'सार्वजनिक गणेशोत्सव' : rawFest;

  const rawYear = getVal(row, 'Year', 'वर्ष');
  const numYear = Number(rawYear);
  const year = (!isNaN(numYear) && numYear > 2000) ? numYear : 2026;
  const phone = String(getVal(row, 'Phone', 'संपर्क') || '').trim();

  return {
    id: idx + 1,
    srNo: srNo || idx + 1,
    nameMr: nameMr || nameEn || 'देणगीदार',
    nameEn: nameEn || nameMr || 'Donor',
    building,
    source: building,
    amount,
    receiptNo,
    status,
    festival,
    year,
    date,
    paymentMode,
    phone: phone || undefined
  };
});

// 2. Kharch Expenses
const kharchSheet = findSheet('Kharch', 'खर्च', 'expense');
const rawKharch = kharchSheet ? XLSX.utils.sheet_to_json(kharchSheet) : [];
const kharchRecords = rawKharch.map((row, idx) => {
  const srNo = Number(getVal(row, 'Sr_No', 'SrNo', 'अ. क्र.', 'Sr') || (idx + 1));
  const nameMr = String(getVal(row, 'Expense_Name_Mr', 'खर्चाचे नाव - मराठी', 'खर्चाचे नाव', 'खर्च तपशील', 'तपशील', 'नाव') || '').trim();
  const nameEn = String(getVal(row, 'Expense_Name_En', 'खर्चाचे नाव - English', 'Expense Name', 'Details') || '').trim();
  const rawAmount = getVal(row, 'Amount', 'रक्कम ₹', 'रक्कम') || 0;
  const cleanAmount = typeof rawAmount === 'string' ? Number(rawAmount.replace(/[^0-9.]/g, '')) : Number(rawAmount);
  const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

  const rawCat = getVal(row, 'Category', 'खर्च प्रकार', 'प्रकार', 'कॅटेगरी');
  const category = (rawCat && String(rawCat).trim() !== 'undefined') ? String(rawCat).trim() : (nameMr || 'इतर खर्च');

  const paidTo = String(getVal(row, 'Paid_To', 'देय व्यक्ती / संस्था', 'देय व्यक्ती') || '').trim();
  const voucherNo = String(getVal(row, 'Voucher_No', 'व्हाउचर क्र.', 'व्हाउचर') || '').trim();
  const date = String(getVal(row, 'Date', 'तारीख', 'दिनांक') || '01/09/2026').trim();
  const festival = String(getVal(row, 'Festival', 'उत्सव') || 'सार्वजनिक गणेशोत्सव').trim();
  const year = Number(getVal(row, 'Year', 'वर्ष') || 2026);
  const desc = String(getVal(row, 'Description', 'विवरण', 'शेरा') || '').trim();

  return {
    id: idx + 1,
    srNo: srNo || idx + 1,
    nameMr: nameMr || nameEn || 'खर्च',
    nameEn: nameEn || nameMr || 'Expense',
    category,
    amount,
    date,
    voucherNo: voucherNo || undefined,
    festival,
    year: isNaN(year) ? 2026 : year,
    paidTo: paidTo || undefined,
    description: desc || undefined
  };
});

// 3. Detailed Balance Sheet
const detailedSheet = findSheet('Detailed', 'detail', 'ताळेबंद');
let detailedBalanceSheet = null;
if (detailedSheet) {
  const rawRows = XLSX.utils.sheet_to_json(detailedSheet, { header: 1 });
  const result = {
    joint: {
      title: 'श्री गणेशोत्सव आणि नवरात्रोत्सव २०२६ - संयुक्त ताळेबंद (Joint Balance Sheet)',
      festivalKey: 'joint',
      festivalNameMr: 'संयुक्त (गणेशोत्सव व नवरात्र)',
      festivalNameEn: 'Joint Balance Sheet (Ganesh & Navratri)',
      income: [],
      expenses: [],
      totalIncome: 0,
      totalExpenses: 0,
      surplus: 0,
      surplusLabelMr: 'पुढील वर्षासाठी शिल्लक रक्कम (Total Surplus)',
      surplusLabelEn: 'Total Surplus Carried Forward',
      totalBalance: 0
    },
    ganesh: {
      title: 'श्री गणेशोत्सव २०२६ - ताळेबंद (Ganesh Utsav Balance Sheet)',
      festivalKey: 'ganesh',
      festivalNameMr: 'सार्वजनिक गणेशोत्सव',
      festivalNameEn: 'Ganeshotsav (Ganpati Utsav)',
      income: [],
      expenses: [],
      totalIncome: 0,
      totalExpenses: 0,
      surplus: 0,
      surplusLabelMr: 'नवरात्रीसाठी शिल्लक बाकी (Surplus for Navratri)',
      surplusLabelEn: 'Surplus for Navratri',
      totalBalance: 0
    },
    navratri: {
      title: 'श्री नवरात्रोत्सव २०२६ - ताळेबंद (Navratri Utsav Balance Sheet)',
      festivalKey: 'navratri',
      festivalNameMr: 'नवरात्र उत्सव',
      festivalNameEn: 'Navratri Utsav',
      income: [],
      expenses: [],
      totalIncome: 0,
      totalExpenses: 0,
      surplus: 0,
      surplusLabelMr: 'पुढील वर्षासाठी शिल्लक (Surplus Carried Forward)',
      surplusLabelEn: 'Surplus Carried Forward',
      totalBalance: 0,
      cashBalance: 0,
      bankBalance: 0
    }
  };

  let currentSection = null;
  const cleanNum = (val) => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  rawRows.forEach(row => {
    if (!row || row.length === 0) return;
    const text0 = String(row[0] || '').trim();
    const text3 = String(row[3] || '').trim();

    if (text0.includes('संयुक्त ताळेबंद') || text0.includes('Joint Balance Sheet')) {
      currentSection = 'joint';
      result.joint.title = text0;
      return;
    } else if (text0.includes('गणेशोत्सव') && (text0.includes('ताळेबंद') || text0.includes('Balance Sheet'))) {
      currentSection = 'ganesh';
      result.ganesh.title = text0;
      return;
    } else if (text0.includes('नवरात्र') && (text0.includes('ताळेबंद') || text0.includes('Balance Sheet'))) {
      currentSection = 'navratri';
      result.navratri.title = text0;
      return;
    }

    if (!currentSection) return;
    const active = result[currentSection];

    if (text0 && !text0.includes('जमा बाजू') && !text0.includes('Receipts / Income')) {
      const amt0 = cleanNum(row[1]);
      if (text0.includes('एकूण जमा') || text0.includes('Total Income')) {
        active.totalIncome = amt0;
      } else if (amt0 > 0 && !text0.includes('ताळेबंद') && !text0.includes('Total Balance')) {
        active.income.push({ name: text0, amount: amt0 });
      }
    }

    if (text3 && !text3.includes('खर्च बाजू') && !text3.includes('खर्च आणि शिल्लक')) {
      const amt4 = cleanNum(row[4]);
      if (text3.includes('एकूण उत्सव खर्च') || text3.includes('एकूण खर्च') || text3.includes('Total Expenditure')) {
        active.totalExpenses = amt4;
      } else if (text3.includes('रोख शिल्लक') || text3.includes('Cash Balance')) {
        if (currentSection === 'navratri') active.cashBalance = amt4;
      } else if (text3.includes('बँक शिल्लक') || text3.includes('Bank Balance')) {
        if (currentSection === 'navratri') active.bankBalance = amt4;
      } else if (text3.includes('पुढील वर्षासाठी शिल्लक') || text3.includes('नवरात्रीसाठी शिल्लक') || text3.includes('शिल्लक') || text3.includes('Surplus')) {
        if (amt4 > 0) {
          active.surplus = amt4;
          active.surplusLabelMr = text3;
        }
      } else if (text3.includes('एकूण ताळेबंद') || text3.includes('Total Balance')) {
        active.totalBalance = amt4;
      } else if (amt4 > 0) {
        active.expenses.push({ name: text3, amount: amt4 });
      }
    }
  });

  ['joint', 'ganesh', 'navratri'].forEach(k => {
    const s = result[k];
    if (s.totalIncome === 0 && s.income.length > 0) {
      s.totalIncome = s.income.reduce((sum, i) => sum + i.amount, 0);
    }
    if (s.totalExpenses === 0 && s.expenses.length > 0) {
      s.totalExpenses = s.expenses.reduce((sum, i) => sum + i.amount, 0);
    }
    if (s.surplus === 0) {
      s.surplus = s.totalIncome - s.totalExpenses;
    }
    if (s.totalBalance === 0) {
      s.totalBalance = Math.max(s.totalIncome, s.totalExpenses + s.surplus);
    }
  });

  detailedBalanceSheet = result;
}

const tsCode = `import { VarganiRecord, KharchRecord, DetailedBalanceSheetData } from '../models/mandal.models';

export const INITIAL_VARGANI_RECORDS: VarganiRecord[] = ${JSON.stringify(varganiRecords, null, 2)};

export const INITIAL_KHARCH_RECORDS: KharchRecord[] = ${JSON.stringify(kharchRecords, null, 2)};

export const INITIAL_DETAILED_BALANCE_SHEET: DetailedBalanceSheetData | null = ${JSON.stringify(detailedBalanceSheet, null, 2)};
`;

const outDir = path.join(__dirname, '../src/app/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'initial-mandal-data.ts'), tsCode, 'utf8');
console.log(`[gen_initial_data] Generated initial-mandal-data.ts with ${varganiRecords.length} Vargani, ${kharchRecords.length} Kharch, Detailed: ${!!detailedBalanceSheet}`);
