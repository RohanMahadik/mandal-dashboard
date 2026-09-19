const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rootFormat = path.join(__dirname, '..', 'mandal_data_format.xlsx');
const publicData = path.join(__dirname, '..', 'public', 'data', 'mandal_data.xlsx');
const parentFormat = path.join(__dirname, '..', '..', 'mandal_data_format.xlsx');

const files = [
  { label: 'Root mandal_data_format.xlsx', path: rootFormat },
  { label: 'Public mandal_data.xlsx', path: publicData },
  { label: 'Parent mandal_data_format.xlsx', path: parentFormat }
];

console.log('=== CHECKING EXCEL FILES ===');
files.forEach(f => {
  if (fs.existsSync(f.path)) {
    const stat = fs.statSync(f.path);
    console.log(`[FOUND] ${f.label}:`);
    console.log(`  Path: ${f.path}`);
    console.log(`  Size: ${stat.size} bytes`);
    console.log(`  Modified: ${stat.mtime.toISOString()}`);
    
    try {
      const wb = XLSX.readFile(f.path);
      console.log(`  Sheets: ${wb.SheetNames.join(', ')}`);
      
      const varganiSheetName = wb.SheetNames.find(s => s.toLowerCase().includes('vargani') || s.toLowerCase().includes('वर्गणी'));
      if (varganiSheetName) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[varganiSheetName]);
        console.log(`  Sheet "${varganiSheetName}" has ${rows.length} rows.`);
        if (rows.length > 0) {
          console.log(`  First row keys: ${Object.keys(rows[0]).join(' | ')}`);
          console.log(`  Sample row 1:`, JSON.stringify(rows[0]));
          if (rows.length > 1) {
            console.log(`  Sample last row:`, JSON.stringify(rows[rows.length - 1]));
          }
        }
      } else {
        console.log(`  No Vargani sheet found!`);
      }
    } catch (e) {
      console.error(`  Error reading file:`, e.message);
    }
  } else {
    console.log(`[NOT FOUND] ${f.label} at ${f.path}`);
  }
});
