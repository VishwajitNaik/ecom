'use client';

import React, { useState } from 'react';

const TermsConditionsPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Terms & Conditions',
      subtitle: 'Welcome to Aushadh Mart. By accessing our website, you agree to the following terms.',
      lastUpdated: 'Last Updated: April 10, 2026',
      sections: [
        {
          icon: '📄',
          title: '1. Product Information',
          content: 'We offer Ayurvedic product "Shuga Amrit Syrup" which is intended to support overall wellness and help maintain healthy blood sugar levels.',
        },
        {
          icon: '⚠️',
          title: '2. Medical Disclaimer',
          content: '',
          list: [
            'This product is not intended to diagnose, treat, cure, or prevent any disease.',
            'Results may vary from person to person.',
            'Please consult a qualified healthcare professional before use.',
          ],
        },
        {
          icon: '📋',
          title: '3. Usage Instructions',
          content: 'Recommended dosage: 10ml twice daily (morning and night) or as advised by a healthcare professional.',
        },
        {
          icon: '💰',
          title: '4. Pricing',
          content: 'All prices are listed in INR. We reserve the right to modify prices at any time.',
        },
        {
          icon: '💳',
          title: '5. Orders & Payments',
          content: 'Orders are confirmed only after successful payment via secure payment gateways.',
        },
        {
          icon: '⚖️',
          title: '6. Limitation of Liability',
          content: 'Aushadh Mart shall not be liable for any adverse effects resulting from misuse or improper use of the product.',
        },
        {
          icon: '©️',
          title: '7. Intellectual Property',
          content: 'All content on this website is the property of Aushadh Mart and cannot be reused without permission.',
        },
      ],
      contact: {
        title: '8. Contact Information',
        owner: 'Owner: Sanket Metkar',
        email: 'aushdhmart@gmail.com',
        phone: '8308383842',
      },
      agreement: 'By using our website, you agree to these terms.',
      buttons: {
        en: 'English',
        mr: 'मराठी',
      },
      productName: 'Shuga Amrit Syrup',
    },
    mr: {
      title: 'नियम व शर्ती',
      subtitle: 'औषध मार्ट मध्ये आपले स्वागत आहे. आमची वेबसाइट वापरून, आपण खालील नियमांना सहमती देत आहात.',
      lastUpdated: 'शेवटचे अद्यतनित: १० एप्रिल २०२६',
      sections: [
        {
          icon: '📄',
          title: '१. उत्पादन माहिती',
          content: 'आम्ही आयुर्वेदिक उत्पादन "शुगा अमृत सिरप" ऑफर करतो जे संपूर्ण निरोगीपणाला समर्थन देण्यासाठी आणि निरोगी रक्तातील साखरेची पातळी राखण्यास मदत करण्यासाठी आहे.',
        },
        {
          icon: '⚠️',
          title: '२. वैद्यकीय अस्वीकरण',
          content: '',
          list: [
            'हे उत्पादन कोणत्याही रोगाचे निदान, उपचार, इलाज किंवा प्रतिबंध करण्यासाठी नाही.',
            'परिणाम व्यक्तीपरत्वे बदलू शकतात.',
            'कृपया वापरापूर्वी पात्र आरोग्यसेवा व्यावसायिकांचा सल्ला घ्या.',
          ],
        },
        {
          icon: '📋',
          title: '३. वापर सूचना',
          content: 'शिफारस केलेले डोस: १० मिली दिवसातून दोनदा (सकाळी आणि रात्री) किंवा आरोग्यसेवा व्यावसायिकांच्या सल्ल्यानुसार.',
        },
        {
          icon: '💰',
          title: '४. किंमत निर्धारण',
          content: 'सर्व किंमती INR मध्ये सूचीबद्ध आहेत. आम्ही कधीही किंमती सुधारित करण्याचा अधिकार राखून ठेवतो.',
        },
        {
          icon: '💳',
          title: '५. ऑर्डर आणि पेमेंट',
          content: 'सुरक्षित पेमेंट गेटवे द्वारे यशस्वी पेमेंट नंतरच ऑर्डरची पुष्टी होते.',
        },
        {
          icon: '⚖️',
          title: '६. दायित्वाची मर्यादा',
          content: 'उत्पादनाच्या गैरवापरामुळे किंवा अयोग्य वापरामुळे होणाऱ्या कोणत्याही प्रतिकूल परिणामांसाठी औषध मार्ट जबाबदार राहणार नाही.',
        },
        {
          icon: '©️',
          title: '७. बौद्धिक संपत्ती',
          content: 'या वेबसाइटवरील सर्व सामग्री औषध मार्टची मालमत्ता आहे आणि परवानगीशिवाय पुन्हा वापरली जाऊ शकत नाही.',
        },
      ],
      contact: {
        title: '८. संपर्क माहिती',
        owner: 'मालक: संकेत मेटकर',
        email: 'aushdhmart@gmail.com',
        phone: '८३०८३८३८४२',
      },
      agreement: 'आमची वेबसाइट वापरून, आपण या नियम व शर्तींना सहमती देत आहात.',
      buttons: {
        en: 'English',
        mr: 'मराठी',
      },
      productName: 'शुगा अमृत सिरप',
    },
  };

  const t = content[language];

  const MailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const GlobeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-50">
      <div className="fixed top-4 right-4 z-20 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-amber-200">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            language === 'en'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-amber-100'
          }`}
        >
          {t.buttons.en}
        </button>
        <button
          onClick={() => setLanguage('mr')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            language === 'mr'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-amber-100'
          }`}
        >
          {t.buttons.mr}
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10" />
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative">
          <div className="inline-flex items-center justify-center gap-2 bg-amber-100 rounded-full px-4 py-1 mb-6">
            <GlobeIcon />
            <span className="text-sm font-medium text-amber-800">Aushadh Mart</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-lg">🧪</span>
            <span className="text-sm font-medium text-amber-800">
              {t.productName}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-4">{t.lastUpdated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {t.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-3xl">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                        {section.title}
                      </h2>
                      {section.content && (
                        <p className="text-gray-600 leading-relaxed mb-3">
                          {section.content}
                        </p>
                      )}
                      {section.list && (
                        <ul className="space-y-2 mt-3">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <span className="text-amber-600 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    📞
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.contact.title}
                    </h2>
                    <p className="text-gray-700 font-medium mb-2">{t.contact.owner}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <a
                        href={`mailto:${t.contact.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors duration-200"
                      >
                        <MailIcon />
                        {t.contact.email}
                      </a>
                      <a
                        href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors duration-200"
                      >
                        <PhoneIcon />
                        {t.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-2xl border border-amber-100 text-center">
            <p className="text-gray-500 text-sm">{t.agreement}</p>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200 text-center">
            <p className="text-xs text-red-600">
              {language === 'en'
                ? '⚠️ This is a herbal product. Please consult your doctor before use if you are pregnant, nursing, or have any medical condition.'
                : '⚠️ हे हर्बल उत्पादन आहे. कृपया गर्भवती असल्यास, स्तनपान करत असल्यास किंवा कोणतीही वैद्यकीय स्थिती असल्यास वापरापूर्वी आपल्या डॉक्टरांचा सल्ला घ्या.'}
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2026 Aushadh Mart. {language === 'en' ? 'All rights reserved.' : 'सर्व हक्क राखीव.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsConditionsPage;