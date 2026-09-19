const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rootFormat = path.join(__dirname, '..', 'mandal_data_format.xlsx');
const publicData = path.join(__dirname, '..', 'public', 'data', 'mandal_data.xlsx');
const publicJson = path.join(__dirname, '..', 'public', 'data', 'vargani_data.json');

console.log('=== SYNCING EXCEL FILES ===');

if (!fs.existsSync(rootFormat)) {
  console.error('mandal_data_format.xlsx not found in root!');
  process.exit(1);
}

// 1. Copy mandal_data_format.xlsx to public/data/mandal_data.xlsx
fs.copyFileSync(rootFormat, publicData);
console.log('Copied mandal_data_format.xlsx -> public/data/mandal_data.xlsx');

// 2. Read and verify content
const wb = XLSX.readFile(publicData);
console.log('Workbook sheets:', wb.SheetNames.join(', '));

const varganiSheetName = wb.SheetNames.find(s => s.toLowerCase().includes('vargani') || s.toLowerCase().includes('वर्गणी'));
if (varganiSheetName) {
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[varganiSheetName]);
  console.log(`Vargani Sheet (${varganiSheetName}) verified with ${rows.length} rows.`);
  
  // Also export JSON for immediate zero-delay fallback
  fs.writeFileSync(publicJson, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`Wrote JSON cache to ${publicJson} (${rows.length} items)`);
} else {
  console.warn('Warning: No Vargani sheet found in workbook!');
}

console.log('Sync complete successfully.');
