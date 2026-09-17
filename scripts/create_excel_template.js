const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ensure directory exists
const publicDataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const wb = XLSX.utils.book_new();

// -------------------------------------------------------------
// Sheet 0: सूचना व नियम (Instructions & Guidelines)
// -------------------------------------------------------------
const instructionData = [
  {
    'अनुक्रमांक': 1,
    'शीटचे नाव (Sheet Name)': 'Sabhasad_Members',
    'वर्णन (Description)': 'मंडळाचे अधिकृत नोंदणीकृत सभासद (About पृष्ठावरील यादी व ओळखपत्र जनरेशनसाठी)',
    'महत्त्वाचे नियम (Important Rules)': 'नाव (मराठी/English), इमारत व संपर्क क्रमांक अचूक भरावेत. स्थिती "सक्रिय" असावी.'
  },
  {
    'अनुक्रमांक': 2,
    'शीटचे नाव (Sheet Name)': 'Vargani_Donations',
    'वर्णन (Description)': 'उत्सवानिहाय जमा झालेली वर्गणी व देणग्या (डॅशबोर्ड, वर्गणी यादी व ताळेबंदसाठी)',
    'महत्त्वाचे नियम (Important Rules)': 'रक्कम ₹ अंकात असावी. स्थिती "दिलेली" किंवा "बाकी" असावी. उत्सव व वर्ष अचूक असावे.'
  },
  {
    'अनुक्रमांक': 3,
    'शीटचे नाव (Sheet Name)': 'Kharch_Expenses',
    'वर्णन (Description)': 'मंडळाचा झालेला सर्व अधिकृत खर्च व व्हाउचर्स (डॅशबोर्ड, खर्च नोंदवही व ताळेबंदसाठी)',
    'महत्त्वाचे नियम (Important Rules)': 'खर्चाचे नाव, रक्कम ₹, खर्च प्रकार आणि व्हाउचर क्र. भरणे आवश्यक आहे.'
  },
  {
    'अनुक्रमांक': 4,
    'शीटचे नाव (Sheet Name)': 'Ganpati_Bhandara',
    'वर्णन (Description)': 'गणेशोत्सवातील महाप्रसाद, अन्नदान व किराणा साहित्याची देणगी यादी',
    'महत्त्वाचे नियम (Important Rules)': 'साहित्याचे नाव, संख्या, एकक (किलो/लिटर) आणि देणगीदाराचे नाव भरावे.'
  },
  {
    'अनुक्रमांक': 5,
    'शीटचे नाव (Sheet Name)': 'Navratri_Bhandara',
    'वर्णन (Description)': 'नवरात्रोत्सवातील अष्टमी महाप्रसाद व भंडारा किराणा साहित्याची देणगी यादी',
    'महत्त्वाचे नियम (Important Rules)': 'साहित्याचे नाव, संख्या, एकक आणि देणगीदाराचे नाव भरावे.'
  },
  {
    'अनुक्रमांक': 6,
    'शीटचे नाव (Sheet Name)': 'Navratri_Sarees',
    'वर्णन (Description)': 'नवरात्रोत्सवात ९ दिवसांसाठी देवी चरणी अर्पण केलेल्या मानाच्या साड्यांची यादी',
    'महत्त्वाचे नियम (Important Rules)': 'भाविकाचे नाव, साडीचा तपशील/रंग आणि तारीख भरावी.'
  },
  {
    'अनुक्रमांक': 7,
    'शीटचे नाव (Sheet Name)': 'Yearly_Archive',
    'वर्णन (Description)': 'वर्षनिहाय ऐतिहासिक ताळेबंद, तिन्ही उत्सवांचा हिशोब व प्रगती अहवाल (२०२४ ते २०२७)',
    'महत्त्वाचे नियम (Important Rules)': 'वर्ष (Year), उत्सव (Festival), एकूण वर्गणी जमा ₹, झालेला खर्च ₹, शिल्लक व भाविक संख्या अचूक भरावी.'
  }
];
const wsInstructions = XLSX.utils.json_to_sheet(instructionData);
wsInstructions['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 45 }, { wch: 45 }];
XLSX.utils.book_append_sheet(wb, wsInstructions, 'मार्गदर्शन_सूचना');


// -------------------------------------------------------------
// Sheet 1: Sabhasad_Members (सभासद नोंदणी यादी - १६ अधिकृत सभासद)
// -------------------------------------------------------------
const sabhasadData = [
  {
    'अ. क्र. (Sr_No)': 1,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. मंगेश वसंत कदम',
    'नाव - English (Name_En)': 'Mangesh Vasant Kadam',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-102',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98201 44552',
    'प्रवेश वर्ष (Join_Year)': 1997,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 2,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. विलास अनंत सावंत',
    'नाव - English (Name_En)': 'Vilas Anant Sawant',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-204',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98192 33412',
    'प्रवेश वर्ष (Join_Year)': 1997,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 3,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. सचिन चंद्रकांत तांबडे',
    'नाव - English (Name_En)': 'Sachin Chandrakant Tambde',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 2',
    'फ्लॅट क्र. (Flat_No)': 'B-101',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 99203 88124',
    'प्रवेश वर्ष (Join_Year)': 2002,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 4,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. राजेश भास्कर परब',
    'नाव - English (Name_En)': 'Rajesh Bhaskar Parab',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 2',
    'फ्लॅट क्र. (Flat_No)': 'B-303',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98690 77150',
    'प्रवेश वर्ष (Join_Year)': 1999,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 5,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. सुधीर दत्तात्रय सावंत',
    'नाव - English (Name_En)': 'Sudhir Dattatray Sawant',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-302',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98211 99341',
    'प्रवेश वर्ष (Join_Year)': 2005,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 6,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. चंद्रकांत बाबुराव महाडिक',
    'नाव - English (Name_En)': 'Chandrakant Baburao Mahadik',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-001',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'संस्थापक सल्लागार',
    'Membership Type - English (Membership_Type_En)': 'Founding Advisor',
    'संपर्क क्रमांक (Phone)': '+91 98200 11223',
    'प्रवेश वर्ष (Join_Year)': 1997,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 7,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. अमोल दिनकर पाटील',
    'नाव - English (Name_En)': 'Amol Dinkar Patil',
    'इमारत / विंग (Building)': 'आदर्श नगर',
    'फ्लॅट क्र. (Flat_No)': 'C-201',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'वार्षिक सभासद',
    'Membership Type - English (Membership_Type_En)': 'Annual Member',
    'संपर्क क्रमांक (Phone)': '+91 98334 55667',
    'प्रवेश वर्ष (Join_Year)': 2012,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 8,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. रोहन मंगेश महाडिक',
    'नाव - English (Name_En)': 'Rohan Mangesh Mahadik',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-402',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'युवा सभासद',
    'Membership Type - English (Membership_Type_En)': 'Youth Member',
    'संपर्क क्रमांक (Phone)': '+91 98700 88990',
    'प्रवेश वर्ष (Join_Year)': 2018,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 9,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. प्रकाश भिकाजी कदम',
    'नाव - English (Name_En)': 'Prakash Bhikaji Kadam',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 2',
    'फ्लॅट क्र. (Flat_No)': 'B-202',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98205 66778',
    'प्रवेश वर्ष (Join_Year)': 2000,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 10,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. विठ्ठल तुकाराम महाडिक',
    'नाव - English (Name_En)': 'Vitthal Tukaram Mahadik',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-104',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98198 77665',
    'प्रवेश वर्ष (Join_Year)': 1998,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 11,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. सदानंद बाळकृष्ण राणे',
    'नाव - English (Name_En)': 'Sadanand Balkrishna Rane',
    'इमारत / विंग (Building)': 'आदर्श नगर',
    'फ्लॅट क्र. (Flat_No)': 'D-102',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'वार्षिक सभासद',
    'Membership Type - English (Membership_Type_En)': 'Annual Member',
    'संपर्क क्रमांक (Phone)': '+91 98330 22119',
    'प्रवेश वर्ष (Join_Year)': 2014,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 12,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. दीपक विनायक जोशी',
    'नाव - English (Name_En)': 'Deepak Vinayak Joshi',
    'इमारत / विंग (Building)': 'आदर्श नगर',
    'फ्लॅट क्र. (Flat_No)': 'C-304',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'वार्षिक सभासद',
    'Membership Type - English (Membership_Type_En)': 'Annual Member',
    'संपर्क क्रमांक (Phone)': '+91 98214 33221',
    'प्रवेश वर्ष (Join_Year)': 2016,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 13,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. गणेश बाळाराम शिंदे',
    'नाव - English (Name_En)': 'Ganesh Balaram Shinde',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 2',
    'फ्लॅट क्र. (Flat_No)': 'B-401',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'आजीवन सभासद',
    'Membership Type - English (Membership_Type_En)': 'Life Member',
    'संपर्क क्रमांक (Phone)': '+91 98920 11443',
    'प्रवेश वर्ष (Join_Year)': 2008,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 14,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'श्री. संजय शांताराम सुर्वे',
    'नाव - English (Name_En)': 'Sanjay Shantaram Surve',
    'इमारत / विंग (Building)': 'आदर्श नगर',
    'फ्लॅट क्र. (Flat_No)': 'D-203',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'वार्षिक सभासद',
    'Membership Type - English (Membership_Type_En)': 'Annual Member',
    'संपर्क क्रमांक (Phone)': '+91 98209 88771',
    'प्रवेश वर्ष (Join_Year)': 2015,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 15,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'सौ. सुवर्णा मंगेश कदम',
    'नाव - English (Name_En)': 'Suvarna Mangesh Kadam',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-102',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'महिला प्रतिनिधी',
    'Membership Type - English (Membership_Type_En)': 'Women Wing Rep',
    'संपर्क क्रमांक (Phone)': '+91 98201 44553',
    'प्रवेश वर्ष (Join_Year)': 2004,
    'स्थिती (Status)': 'सक्रिय'
  },
  {
    'अ. क्र. (Sr_No)': 16,
    'सभासदाचे नाव - मराठी (Name_Mr)': 'सौ. अनुराधा विलास सावंत',
    'नाव - English (Name_En)': 'Anuradha Vilas Sawant',
    'इमारत / विंग (Building)': 'शिव स्फूर्ती 1',
    'फ्लॅट क्र. (Flat_No)': 'A-204',
    'सभासद प्रकार - मराठी (Membership_Type_Mr)': 'महिला प्रतिनिधी',
    'Membership Type - English (Membership_Type_En)': 'Women Wing Rep',
    'संपर्क क्रमांक (Phone)': '+91 98192 33413',
    'प्रवेश वर्ष (Join_Year)': 2006,
    'स्थिती (Status)': 'सक्रिय'
  }
];
const wsSabhasad = XLSX.utils.json_to_sheet(sabhasadData);
wsSabhasad['!cols'] = [
  { wch: 10 }, { wch: 30 }, { wch: 28 }, { wch: 18 }, { wch: 12 },
  { wch: 22 }, { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 12 }
];
XLSX.utils.book_append_sheet(wb, wsSabhasad, 'Sabhasad_Members');


// -------------------------------------------------------------
// Sheet 2: Vargani_Donations (वर्गणी यादी - सर्व ९६ देणगीदार)
// -------------------------------------------------------------
const varganiData = [];

// 5 Top Official Rows
varganiData.push(
  {
    'अ. क्र. (Sr_No)': 1,
    'नाव - मराठी (Name_Mr)': 'रोहन महाडिक',
    'नाव - English (Name_En)': 'Rohan Mahadik',
    'इमारत (Building)': 'शिव स्फूर्ती 1',
    'रक्कम ₹ (Amount)': 5000,
    'पावती क्र. (Receipt_No)': '100001',
    'भरणा पद्धत (Payment_Mode)': 'UPI / GPay',
    'पावती स्थिती (Status)': 'दिलेली',
    'तारीख (Date)': '01/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 2,
    'नाव - मराठी (Name_Mr)': 'हर्ष फाटक',
    'नाव - English (Name_En)': 'Harsh Phatak',
    'इमारत (Building)': 'शिव स्फूर्ती 2',
    'रक्कम ₹ (Amount)': 5000,
    'पावती क्र. (Receipt_No)': '100002',
    'भरणा पद्धत (Payment_Mode)': 'कॅश',
    'पावती स्थिती (Status)': 'दिलेली',
    'तारीख (Date)': '01/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 3,
    'नाव - मराठी (Name_Mr)': 'अमोल पाटील',
    'नाव - English (Name_En)': 'Amol Patil',
    'इमारत (Building)': 'आदर्श नगर',
    'रक्कम ₹ (Amount)': 2500,
    'पावती क्र. (Receipt_No)': '',
    'भरणा पद्धत (Payment_Mode)': 'कॅश',
    'पावती स्थिती (Status)': 'बाकी',
    'तारीख (Date)': '02/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 4,
    'नाव - मराठी (Name_Mr)': 'संदीप शिंदे',
    'नाव - English (Name_En)': 'Sandeep Shinde',
    'इमारत (Building)': 'शिव स्फूर्ती 1',
    'रक्कम ₹ (Amount)': 5000,
    'पावती क्र. (Receipt_No)': '100004',
    'भरणा पद्धत (Payment_Mode)': 'कॅश',
    'पावती स्थिती (Status)': 'दिलेली',
    'तारीख (Date)': '02/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 5,
    'नाव - मराठी (Name_Mr)': 'प्रिया कदम',
    'नाव - English (Name_En)': 'Priya Kadam',
    'इमारत (Building)': 'शिव स्फूर्ती 2',
    'रक्कम ₹ (Amount)': 2500,
    'पावती क्र. (Receipt_No)': '',
    'भरणा पद्धत (Payment_Mode)': 'कॅश',
    'पावती स्थिती (Status)': 'बाकी',
    'तारीख (Date)': '02/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  }
);

// Populate remaining 91 realistic records to complete exactly 96 members for 2026 Ganeshotsav
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

const generateBuildingRecords = (buildingName, targetAmount, count) => {
  let currentSum = 0;
  for (let i = 0; i < count; i++) {
    const fn = marathiFirstNames[(varganiData.length + i * 3) % marathiFirstNames.length];
    const ln = marathiLastNames[(varganiData.length + i * 2) % marathiLastNames.length];
    const isLast = i === count - 1;
    
    let amount = Math.floor(targetAmount / count / 500) * 500;
    if (isLast) {
      amount = targetAmount - currentSum;
    } else {
      currentSum += amount;
    }

    const isBaki = bakiRemaining > 0 && (i % 8 === 0 || isLast);
    let status = 'दिलेली';
    let receiptNo = (receiptCounter++).toString();

    if (isBaki) {
      status = 'बाकी';
      receiptNo = '';
      bakiRemaining--;
    }

    const day = (3 + (i % 15)).toString().padStart(2, '0');
    varganiData.push({
      'अ. क्र. (Sr_No)': varganiData.length + 1,
      'नाव - मराठी (Name_Mr)': `${fn.mr} ${ln.mr}`,
      'नाव - English (Name_En)': `${fn.en} ${ln.en}`,
      'इमारत (Building)': buildingName,
      'रक्कम ₹ (Amount)': amount,
      'पावती क्र. (Receipt_No)': receiptNo,
      'भरणा पद्धत (Payment_Mode)': i % 3 === 0 ? 'UPI / GPay' : (i % 3 === 1 ? 'कॅश' : 'बँक ट्रान्सफर'),
      'पावती स्थिती (Status)': status,
      'तारीख (Date)': `${day}/09/2026`,
      'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
      'वर्ष (Year)': 2026
    });
  }
};

// Target building totals
generateBuildingRecords('शिव स्फूर्ती 1', 170000, 31); // 1,70,000 + 10,000 = 1,80,000
generateBuildingRecords('शिव स्फूर्ती 2', 117500, 23); // 1,17,500 + 7,500 = 1,25,000
generateBuildingRecords('आदर्श नगर', 92500, 19);     // 92,500 + 2,500 = 95,000
generateBuildingRecords('इतर', 85000, 18);           // 85,000

const wsVargani = XLSX.utils.json_to_sheet(varganiData);
wsVargani['!cols'] = [
  { wch: 10 }, { wch: 28 }, { wch: 26 }, { wch: 18 }, { wch: 15 },
  { wch: 16 }, { wch: 18 }, { wch: 15 }, { wch: 14 }, { wch: 22 }, { wch: 10 }
];
XLSX.utils.book_append_sheet(wb, wsVargani, 'Vargani_Donations');


// -------------------------------------------------------------
// Sheet 3: Kharch_Expenses (खर्च नोंदवही - १२ अधिकृत व्हाउचर्स)
// -------------------------------------------------------------
const kharchData = [
  {
    'अ. क्र. (Sr_No)': 1,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'गणपती मूर्ती',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Ganpati Murti',
    'रक्कम ₹ (Amount)': 100000,
    'खर्च प्रकार (Category)': 'मूर्ती व प्रतिष्ठापना',
    'देय व्यक्ती / संस्था (Paid_To)': 'कलाकुंज आर्ट्स (विजय खातू स्टुडिओ, परळ)',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-001',
    'तारीख (Date)': '01/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 2,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'मंडप',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Mandap',
    'रक्कम ₹ (Amount)': 20000,
    'खर्च प्रकार (Category)': 'मंडप व्यवस्था',
    'देय व्यक्ती / संस्था (Paid_To)': 'स्वास्तिक मंडप डेकोरेटर्स, जोगेश्वरी',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-002',
    'तारीख (Date)': '02/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 3,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'स्पायरो',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Spyro',
    'रक्कम ₹ (Amount)': 10000,
    'खर्च प्रकार (Category)': 'स्पायरो व तांत्रिक यंत्रणा',
    'देय व्यक्ती / संस्था (Paid_To)': 'महालक्ष्मी इलेक्ट्रॉनिक्स & स्पायरो सर्व्हिसेस',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-003',
    'तारीख (Date)': '03/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 4,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'गिफ्ट्स',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Gifts',
    'रक्कम ₹ (Amount)': 10000,
    'खर्च प्रकार (Category)': 'गिफ्ट्स व पारितोषिके',
    'देय व्यक्ती / संस्था (Paid_To)': 'न्यू रॉयल गिफ्ट्स अँड ट्रॉफीज, अंधेरी',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-004',
    'तारीख (Date)': '04/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 5,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (विद्युत रोषणाई व जनरेटर)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Lighting & Generator',
    'रक्कम ₹ (Amount)': 45000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'ओम साई लाईट्स & जनरेटर सप्लायर्स',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-005',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 6,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (ध्वनीक्षेपके व डीजे साऊंड)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Sound System & Acoustics',
    'रक्कम ₹ (Amount)': 35000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'सूरज साऊंड सिस्टीम, जोगेश्वरी',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-006',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 7,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (महाप्रसाद व भोजन व्यवस्था)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Maha Prasad & Catering',
    'रक्कम ₹ (Amount)': 40000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'अन्नपूर्णा केटरर्स, गोरेगाव',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-007',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 8,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (सत्यनारायण महापूजा व भटजी मानधन)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Satyanarayan Puja & Dakshina',
    'रक्कम ₹ (Amount)': 15000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'वेदमूर्ती जोशी गुरुजी व पूजा साहित्य',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-008',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 9,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (विसर्जन मिरवणूक ट्रॅक्टर व ढोल-ताशा)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Visarjan Tractor & Dhol Tasha',
    'रक्कम ₹ (Amount)': 30000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'शिवगर्जना ढोल-ताशा पथक व ट्रॅक्टर चालक',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-009',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 10,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (सीसीटीव्ही व खाजगी सुरक्षा गार्ड)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'CCTV & Security',
    'रक्कम ₹ (Amount)': 15000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'फाल्कन सिक्युरिटी सर्व्हिसेस, मुंबई',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-010',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 11,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (मंडळ टी-शर्ट्स व बॅजेस)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Volunteer T-Shirts & Badges',
    'रक्कम ₹ (Amount)': 12000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'युवा प्रिंटर्स, दादर',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-011',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  },
  {
    'अ. क्र. (Sr_No)': 12,
    'खर्चाचे नाव - मराठी (Expense_Name_Mr)': 'इतर खर्च (स्थानिक परवानग्या व स्टेशनरी)',
    'खर्चाचे नाव - English (Expense_Name_En)': 'Permissions & Printing',
    'रक्कम ₹ (Amount)': 8000,
    'खर्च प्रकार (Category)': 'इतर खर्च',
    'देय व्यक्ती / संस्था (Paid_To)': 'महापालिका व पोलीस नाहरकत, पावती पुस्तक छपाई',
    'व्हाउचर क्र. (Voucher_No)': 'V-2026-012',
    'तारीख (Date)': '05/09/2026',
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'वर्ष (Year)': 2026
  }
];
const wsKharch = XLSX.utils.json_to_sheet(kharchData);
wsKharch['!cols'] = [
  { wch: 10 }, { wch: 38 }, { wch: 30 }, { wch: 15 }, { wch: 24 },
  { wch: 36 }, { wch: 16 }, { wch: 14 }, { wch: 22 }, { wch: 10 }
];
XLSX.utils.book_append_sheet(wb, wsKharch, 'Kharch_Expenses');


// -------------------------------------------------------------
// Sheet 4: Ganpati_Bhandara (गणेशोत्सव भंडारा साहित्य)
// -------------------------------------------------------------
const ganpatiBhandaraData = [
  {
    'अ. क्र. (Sr_No)': 1,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'बासमती तुकडा तांदूळ (उत्तम दर्जा)',
    'Item Name - English (Item_Name_En)': 'Basmati Tukda Rice',
    'संख्या (Quantity)': 150,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. मंगेश वसंत कदम',
    'Donor Name - English (Donor_Name_En)': 'Mangesh Vasant Kadam',
    'तारीख (Date)': '25/08/2026',
    'शेरा (Remarks)': 'महाप्रसाद खिचडी व भातासाठी'
  },
  {
    'अ. क्र. (Sr_No)': 2,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'शेंगदाणा शुद्ध रिफाइंड तेल',
    'Item Name - English (Item_Name_En)': 'Peanut Cooking Oil',
    'संख्या (Quantity)': 45,
    'एकक (Unit)': 'लिटर',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. विलास अनंत सावंत',
    'Donor Name - English (Donor_Name_En)': 'Vilas Anant Sawant',
    'तारीख (Date)': '25/08/2026',
    'शेरा (Remarks)': 'भोजन व पुरी तळण्यासाठी'
  },
  {
    'अ. क्र. (Sr_No)': 3,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'पिवळी तूर डाळ (पॉलिश विरहित)',
    'Item Name - English (Item_Name_En)': 'Yellow Toor Dal',
    'संख्या (Quantity)': 50,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. सचिन चंद्रकांत तांबडे',
    'Donor Name - English (Donor_Name_En)': 'Sachin Chandrakant Tambde',
    'तारीख (Date)': '26/08/2026',
    'शेरा (Remarks)': 'महाप्रसाद वरण व डाळ'
  },
  {
    'अ. क्र. (Sr_No)': 4,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'बारीक रवा (मोदक व शिरा)',
    'Item Name - English (Item_Name_En)': 'Fine Semolina (Rava)',
    'संख्या (Quantity)': 30,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. राजेश भास्कर परब',
    'Donor Name - English (Donor_Name_En)': 'Rajesh Bhaskar Parab',
    'तारीख (Date)': '26/08/2026',
    'शेरा (Remarks)': 'सत्यनारायण पूजा प्रसाद'
  },
  {
    'अ. क्र. (Sr_No)': 5,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'शुद्ध गाईचे साजूक तूप',
    'Item Name - English (Item_Name_En)': 'Pure Cow Ghee',
    'संख्या (Quantity)': 10,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. सुधीर दत्तात्रय सावंत',
    'Donor Name - English (Donor_Name_En)': 'Sudhir Dattatray Sawant',
    'तारीख (Date)': '27/08/2026',
    'शेरा (Remarks)': 'आरती व नैवेद्य'
  },
  {
    'अ. क्र. (Sr_No)': 6,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'खडीसाखर व वेलदोडे / काजू',
    'Item Name - English (Item_Name_En)': 'Dry Fruits & Cardamom',
    'संख्या (Quantity)': 8,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. अमोल दिनकर पाटील',
    'Donor Name - English (Donor_Name_En)': 'Amol Dinkar Patil',
    'तारीख (Date)': '28/08/2026',
    'शेरा (Remarks)': 'महाप्रसाद व लाडू'
  }
];
const wsGanpatiBhandara = XLSX.utils.json_to_sheet(ganpatiBhandaraData);
wsGanpatiBhandara['!cols'] = [
  { wch: 10 }, { wch: 32 }, { wch: 26 }, { wch: 12 }, { wch: 10 },
  { wch: 28 }, { wch: 24 }, { wch: 14 }, { wch: 30 }
];
XLSX.utils.book_append_sheet(wb, wsGanpatiBhandara, 'Ganpati_Bhandara');


// -------------------------------------------------------------
// Sheet 5: Navratri_Bhandara (नवरात्र भंडारा साहित्य)
// -------------------------------------------------------------
const navratriBhandaraData = [
  {
    'अ. क्र. (Sr_No)': 1,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'कोलम तांदूळ (देवीच्या महानैवेद्यासाठी)',
    'Item Name - English (Item_Name_En)': 'Kolam Rice',
    'संख्या (Quantity)': 100,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. विलास अनंत सावंत',
    'Donor Name - English (Donor_Name_En)': 'Vilas Anant Sawant',
    'तारीख (Date)': '20/09/2026',
    'शेरा (Remarks)': 'अष्टमी महाप्रसाद भंडारा'
  },
  {
    'अ. क्र. (Sr_No)': 2,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'सूर्यफूल खाद्यतेल (४ डबे)',
    'Item Name - English (Item_Name_En)': 'Sunflower Oil Tins',
    'संख्या (Quantity)': 4,
    'एकक (Unit)': 'डबे (६० लिटर)',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'सौ. नंदा सतीश मोरे',
    'Donor Name - English (Donor_Name_En)': 'Nanda Satish More',
    'तारीख (Date)': '23/09/2026',
    'शेरा (Remarks)': 'महाप्रसाद पुरी व भाजीसाठी'
  },
  {
    'अ. क्र. (Sr_No)': 3,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'साखर (गोड महाप्रसादासाठी)',
    'Item Name - English (Item_Name_En)': 'Crystal Sugar',
    'संख्या (Quantity)': 25,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. दीपक विनायक जोशी',
    'Donor Name - English (Donor_Name_En)': 'Deepak Vinayak Joshi',
    'तारीख (Date)': '24/09/2026',
    'शेरा (Remarks)': 'देवीच्या महानैवेद्य व खिरीसाठी'
  },
  {
    'अ. क्र. (Sr_No)': 4,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'शुद्ध गावरान गाईचे तूप',
    'Item Name - English (Item_Name_En)': 'Pure Desi Cow Ghee',
    'संख्या (Quantity)': 8,
    'एकक (Unit)': 'लिटर',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'सौ. वंदना सचिन तांबडे',
    'Donor Name - English (Donor_Name_En)': 'Vandana Sachin Tambde',
    'तारीख (Date)': '25/09/2026',
    'शेरा (Remarks)': 'अष्टमी दुर्गा महाहवन व महानैवेद्य'
  },
  {
    'अ. क्र. (Sr_No)': 5,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'खवा व चारोळी / पिस्ता',
    'Item Name - English (Item_Name_En)': 'Mawa & Pistachio / Charoli',
    'संख्या (Quantity)': 5,
    'एकक (Unit)': 'किलो',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. संजय शांताराम सुर्वे',
    'Donor Name - English (Donor_Name_En)': 'Sanjay Shantaram Surve',
    'तारीख (Date)': '26/09/2026',
    'शेरा (Remarks)': 'पंचामृत व पेढे नैवेद्यासाठी'
  },
  {
    'अ. क्र. (Sr_No)': 6,
    'साहित्याचे नाव - मराठी (Item_Name_Mr)': 'सोललेले श्रीफळ (नारळ)',
    'Item Name - English (Item_Name_En)': 'Fresh Husked Coconuts',
    'संख्या (Quantity)': 51,
    'एकक (Unit)': 'नग',
    'देणगीदाराचे नाव - मराठी (Donor_Name_Mr)': 'श्री. गणेश बाळाराम शिंदे',
    'Donor Name - English (Donor_Name_En)': 'Ganesh Balaram Shinde',
    'तारीख (Date)': '27/09/2026',
    'शेरा (Remarks)': 'देवीची ओटी व महाहवन पूर्णाहुती'
  }
];
const wsNavratriBhandara = XLSX.utils.json_to_sheet(navratriBhandaraData);
wsNavratriBhandara['!cols'] = [
  { wch: 10 }, { wch: 32 }, { wch: 26 }, { wch: 12 }, { wch: 14 },
  { wch: 28 }, { wch: 24 }, { wch: 14 }, { wch: 30 }
];
XLSX.utils.book_append_sheet(wb, wsNavratriBhandara, 'Navratri_Bhandara');


// -------------------------------------------------------------
// Sheet 6: Navratri_Sarees (नवरात्र साडी देणगीदार)
// -------------------------------------------------------------
const navratriSareeData = [
  {
    'अ. क्र. (Sr_No)': 1,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. सुवर्णा मंगेश कदम',
    'Donor Name - English (Donor_Name_En)': 'Suvarna Mangesh Kadam',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'शाही जांभळी पैठणी साडी (सोनेरी मोर काठ)',
    'Saree Details - English (Saree_Details_En)': 'Royal Purple Paithani Saree (Gold Peacock Border)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '21/09/2026',
    'शेरा (Remarks)': 'घटस्थापना पहिल्या माळेचा शृंगार'
  },
  {
    'अ. क्र. (Sr_No)': 2,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. अनुराधा विलास सावंत',
    'Donor Name - English (Donor_Name_En)': 'Anuradha Vilas Sawant',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'काठपदराची शुद्ध रेशमी साडी (गडद लाल रंग)',
    'Saree Details - English (Saree_Details_En)': 'Pure Silk Saree with Rich Zari Border (Crimson Red)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '22/09/2026',
    'शेरा (Remarks)': 'देवीच्या नित्य पूजेसाठी अर्पण'
  },
  {
    'अ. क्र. (Sr_No)': 3,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. वंदना सचिन तांबडे',
    'Donor Name - English (Donor_Name_En)': 'Vandana Sachin Tambde',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'बनारसी ब्रोकेड शालू (सोनेरी पिवळा रंग)',
    'Saree Details - English (Saree_Details_En)': 'Banarasi Brocade Shalu (Golden Yellow)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '24/09/2026',
    'शेरा (Remarks)': 'ललिता पंचमी विशेष अलंकार शृंगार'
  },
  {
    'अ. क्र. (Sr_No)': 4,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. प्राजक्ता राजेश परब',
    'Donor Name - English (Donor_Name_En)': 'Prajakta Rajesh Parab',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'इरकली नक्षीदार साडी (गुलाबी व जांभळा काठ)',
    'Saree Details - English (Saree_Details_En)': 'Ilkal Designer Saree (Pink & Purple Border)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '26/09/2026',
    'शेरा (Remarks)': 'महासप्तमी पूजा वस्त्र'
  },
  {
    'अ. क्र. (Sr_No)': 5,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. सुनंदा अमोल पाटील',
    'Donor Name - English (Donor_Name_En)': 'Sunanda Amol Patil',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'पारंपरिक नऊवारी पैठणी साडी (हिरवा रंग)',
    'Saree Details - English (Saree_Details_En)': 'Traditional Nauvari Paithani (Emerald Green)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '28/09/2026',
    'शेरा (Remarks)': 'महाअष्टमी हवन व कुमारी पूजन वस्त्र'
  },
  {
    'अ. क्र. (Sr_No)': 6,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. मंगला चंद्रकांत महाडिक',
    'Donor Name - English (Donor_Name_En)': 'Mangala Chandrakant Mahadik',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'चंदेरी जरी सिल्क साडी (भगवा नारंगी रंग)',
    'Saree Details - English (Saree_Details_En)': 'Chanderi Zari Silk Saree (Saffron Orange)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '29/09/2026',
    'शेरा (Remarks)': 'महानवमी महाकुंकुमार्चन पूजा'
  },
  {
    'अ. क्र. (Sr_No)': 7,
    'भाविकाचे नाव - मराठी (Donor_Name_Mr)': 'सौ. कविता सुधीर सावंत',
    'Donor Name - English (Donor_Name_En)': 'Kavita Sudhir Sawant',
    'साडी तपशील - मराठी (Saree_Details_Mr)': 'तासर सिल्क साडी (मोरपंखी निळा रंग)',
    'Saree Details - English (Saree_Details_En)': 'Tussar Silk Saree (Peacock Feather Blue)',
    'संख्या (Quantity)': 1,
    'तारीख (Date)': '30/09/2026',
    'शेरा (Remarks)': 'विजयादशमी दसरा शस्त्रपूजन शृंगार'
  }
];
const wsNavratriSaree = XLSX.utils.json_to_sheet(navratriSareeData);
wsNavratriSaree['!cols'] = [
  { wch: 10 }, { wch: 28 }, { wch: 26 }, { wch: 40 }, { wch: 40 },
  { wch: 10 }, { wch: 14 }, { wch: 32 }
];
XLSX.utils.book_append_sheet(wb, wsNavratriSaree, 'Navratri_Sarees');


// -------------------------------------------------------------
// Sheet 7: Yearly_Archive (वर्षनिहाय ऐतिहासिक हिशोब व ताळेबंद)
// -------------------------------------------------------------
const yearlyArchiveData = [
  // Only the authentic 2026 Ganeshotsav data from the official records
  {
    'अ. क्र. (Sr_No)': 1,
    'वर्ष (Year)': 2026,
    'उत्सव (Festival)': 'सार्वजनिक गणेशोत्सव',
    'Festival (English)': 'Ganeshotsav',
    'एकूण वर्गणी जमा ₹ (Total_Collection)': 485000,
    'झालेला खर्च ₹ (Total_Expenses)': 340000,
    'शिल्लक गंगाजळी ₹ (Net_Balance)': 145000,
    'देणगीदार संख्या (Donors_Count)': 96,
    'सहभागी भाविक (Participation_Estimate)': 45000,
    'वार्षिक नोंद - मराठी (Note_Mr)': 'चालू आर्थिक वर्ष २०२६ - सार्वजनिक गणेशोत्सव भव्य उत्सव व हिशोब पूर्ण.',
    'Yearly Note - English (Note_En)': 'Current Year 2026 - Ganeshotsav accounts successfully completed.'
  }
];

const wsYearlyArchive = XLSX.utils.json_to_sheet(yearlyArchiveData);
wsYearlyArchive['!cols'] = [
  { wch: 10 }, { wch: 12 }, { wch: 28 }, { wch: 24 }, { wch: 20 },
  { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 22 }, { wch: 55 }, { wch: 55 }
];
XLSX.utils.book_append_sheet(wb, wsYearlyArchive, 'Yearly_Archive');

// Write to public/data/mandal_data.xlsx
const publicFilePath = path.join(publicDataDir, 'mandal_data.xlsx');
XLSX.writeFile(wb, publicFilePath);
console.log('Saved to:', publicFilePath);

// Also write copy in root directory for easy user discovery
const rootFilePath = path.join(__dirname, '..', 'mandal_data_format.xlsx');
XLSX.writeFile(wb, rootFilePath);
console.log('Saved to:', rootFilePath);

// Write to parent folder if present
try {
  const parentFilePath = path.join(__dirname, '..', '..', 'mandal_data_format.xlsx');
  XLSX.writeFile(wb, parentFilePath);
  console.log('Saved to parent path:', parentFilePath);
} catch (e) {
  // ignore
}
