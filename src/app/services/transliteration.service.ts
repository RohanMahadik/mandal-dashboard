import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransliterationService {
  // Common Marathi surname and name transliteration dictionary
  private readonly phoneticMap: Record<string, string> = {
    'rohan': 'रोहन',
    'mahadik': 'महाडिक',
    'harsh': 'हर्ष',
    'phatak': 'फाटक',
    'fatak': 'फाटक',
    'amol': 'अमोल',
    'patil': 'पाटील',
    'sandeep': 'संदीप',
    'sandip': 'संदीप',
    'shinde': 'शिंदे',
    'priya': 'प्रिया',
    'kadam': 'कदम',
    'shiv': 'शिव',
    'sfurti': 'स्फूर्ती',
    'sphurti': 'स्फूर्ती',
    'adarsh': 'आदर्श',
    'nagar': 'नगर',
    'itar': 'इतर',
    'ganesh': 'गणेश',
    'ganpati': 'गणपती',
    'murti': 'मूर्ती',
    'mandap': 'मंडप',
    'spyro': 'स्पायरो',
    'gifts': 'गिफ्ट्स',
    'gift': 'गिफ्ट्स',
    'kharch': 'खर्च',
    'prasad': 'प्रसाद',
    'vargani': 'वर्गणी',
    'mangesh': 'मंगेश',
    'sachin': 'सचिन',
    'rajesh': 'राजेश',
    'vilas': 'विलास',
    'sawant': 'सावंत',
    'tambde': 'तांबडे',
    'parab': 'परब',
    'jogeshwari': 'जोगेश्वरी',
    'mumbai': 'मुंबई'
  };

  /**
   * Normalizes a search string
   */
  normalize(str: string): string {
    return (str || '')
      .toLowerCase()
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  }

  /**
   * Checks if an item matches the bilingual search query
   */
  matches(query: string, item: {
    nameMr?: string;
    nameEn?: string;
    building?: string;
    receiptNo?: string | number | null;
    phone?: string;
    category?: string;
    paidTo?: string;
    [key: string]: any;
  }): boolean {
    if (!query || !query.trim()) return true;

    const cleanQuery = this.normalize(query);
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    // Build searchable haystack
    const nameMr = (item.nameMr || '').toLowerCase();
    const nameEn = (item.nameEn || '').toLowerCase();
    const building = (item.building || '').toLowerCase();
    const receiptNo = (item.receiptNo || '').toString().toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const paidTo = (item.paidTo || '').toLowerCase();

    // Check every token in query
    return tokens.every(token => {
      // 1. Direct match in English fields
      if (nameEn.includes(token) || building.includes(token) || receiptNo.includes(token) || phone.includes(token)) {
        return true;
      }

      // 2. Direct match in Marathi fields
      if (nameMr.includes(token) || category.includes(token) || paidTo.includes(token)) {
        return true;
      }

      // 3. Check phonetic transliteration with prefix matching
      const marathiEquiv = this.phoneticMap[token];
      if (marathiEquiv && (nameMr.includes(marathiEquiv) || building.includes(marathiEquiv))) {
        return true;
      }

      for (const [enKey, mrVal] of Object.entries(this.phoneticMap)) {
        if ((enKey.startsWith(token) && token.length >= 2) || (token.startsWith(enKey) && enKey.length >= 3)) {
          if (nameMr.includes(mrVal) || building.includes(mrVal)) {
            return true;
          }
        }
      }

      // 4. Check building English approximations
      if ((token === 'shiv' || token === 'shi') && (building.includes('शिव') || building.includes('shiv'))) return true;
      if ((token === 'adarsh' || token === 'ad') && (building.includes('आदर्श') || building.includes('adarsh'))) return true;
      if (token === 'itar' || token === 'other' || token === 'it') {
        if (building.includes('इतर') || category.includes('इतर')) return true;
      }

      return false;
    });
  }
}
