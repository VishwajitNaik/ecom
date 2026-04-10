'use client';

import React, { useState } from 'react';

const PrivacyPolicyPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'At Aushadh Mart, we value your privacy and are committed to protecting your personal information.',
      lastUpdated: 'Last Updated: April 10, 2026',
      sections: [
        {
          icon: '🛡️',
          title: '1. Information We Collect',
          content: 'We may collect the following information:',
          list: [
            'Name, phone number, email address',
            'Shipping address',
            'Payment details (processed securely via third-party payment gateways)'
          ]
        },
        {
          icon: '🔒',
          title: '2. How We Use Your Information',
          content: 'We use your data to:',
          list: [
            'Process and deliver your orders',
            'Provide customer support',
            'Improve our services',
            'Send order updates and important notifications'
          ]
        },
        {
          icon: '💳',
          title: '3. Payment Security',
          content: 'All payments are processed securely through trusted payment gateways like Razorpay. We do not store your card or UPI details.'
        },
        {
          icon: '🔐',
          title: '4. Data Protection',
          content: 'We implement appropriate security measures to protect your personal data from unauthorized access.'
        },
        {
          icon: '🚚',
          title: '5. Sharing of Information',
          content: 'We do not sell or share your personal information with third parties except:',
          list: [
            'Delivery partners (for shipping)',
            'Payment providers (for transactions)'
          ]
        },
        {
          icon: '🍪',
          title: '6. Cookies',
          content: 'Our website may use cookies to improve user experience.'
        }
      ],
      contact: {
        title: '7. Contact Us',
        content: 'If you have any questions regarding this policy, contact us at:',
        email: 'aushdhmart@gmail.com',
        phone: '8308383842'
      },
      agreement: 'By using our website, you agree to this Privacy Policy.',
      buttons: {
        en: 'English',
        mr: 'मराठी'
      }
    },
    mr: {
      title: 'गोपनीयता धोरण',
      subtitle: 'औषध मार्ट येथे, आम्ही आपल्या गोपनीयतेला महत्त्व देतो आणि आपली वैयक्तिक माहिती संरक्षित करण्यासाठी वचनबद्ध आहोत.',
      lastUpdated: 'शेवटचे अद्यतनित: १० एप्रिल २०२६',
      sections: [
        {
          icon: '🛡️',
          title: '१. आम्ही संकलित करत असलेली माहिती',
          content: 'आम्ही खालील माहिती संकलित करू शकतो:',
          list: [
            'नाव, फोन नंबर, ईमेल पत्ता',
            'शिपिंग पत्ता',
            'पेमेंट तपशील (तृतीय-पक्ष पेमेंट गेटवे द्वारे सुरक्षितपणे प्रक्रिया केली जाते)'
          ]
        },
        {
          icon: '🔒',
          title: '२. आम्ही आपली माहिती कशी वापरतो',
          content: 'आम्ही आपला डेटा यासाठी वापरतो:',
          list: [
            'आपले ऑर्डर प्रक्रिया आणि वितरित करण्यासाठी',
            'ग्राहक समर्थन प्रदान करण्यासाठी',
            'आमच्या सेवा सुधारण्यासाठी',
            'ऑर्डर अपडेट आणि महत्त्वाच्या सूचना पाठविण्यासाठी'
          ]
        },
        {
          icon: '💳',
          title: '३. पेमेंट सुरक्षा',
          content: 'सर्व पेमेंट्स रेझरपे सारख्या विश्वसनीय पेमेंट गेटवे द्वारे सुरक्षितपणे प्रक्रिया केली जातात. आम्ही आपले कार्ड किंवा यूपीआय तपशील संग्रहित करत नाही.'
        },
        {
          icon: '🔐',
          title: '४. डेटा संरक्षण',
          content: 'आम्ही आपल्या वैयक्तिक डेटाला अनधिकृत प्रवेशापासून संरक्षित करण्यासाठी योग्य सुरक्षा उपाययोजना अंमलात आणतो.'
        },
        {
          icon: '🚚',
          title: '५. माहितीची सामायिकी',
          content: 'आम्ही आपली वैयक्तिक माहिती तृतीय पक्षांना विकत किंवा सामायिक करत नाही, याशिवाय:',
          list: [
            'डिलिव्हरी भागीदार (शिपिंगसाठी)',
            'पेमेंट प्रदाते (व्यवहारांसाठी)'
          ]
        },
        {
          icon: '🍪',
          title: '६. कुकीज',
          content: 'आमची वेबसाइट वापरकर्ता अनुभव सुधारण्यासाठी कुकीज वापरू शकते.'
        }
      ],
      contact: {
        title: '७. संपर्क करा',
        content: 'या धोरणाबद्दल आपल्याला काही प्रश्न असल्यास, येथे संपर्क साधा:',
        email: 'aushdhmart@gmail.com',
        phone: '८३०८३८३८४२'
      },
      agreement: 'आमची वेबसाइट वापरून, आपण या गोपनीयता धोरणास सहमती देत आहात.',
      buttons: {
        en: 'English',
        mr: 'मराठी'
      }
    }
  };

  const t = content[language];

  // SVG Icons
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-20 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-green-100">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            language === 'en'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-green-100'
          }`}
        >
          {t.buttons.en}
        </button>
        <button
          onClick={() => setLanguage('mr')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            language === 'mr'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-green-100'
          }`}
        >
          {t.buttons.mr}
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10" />
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative">
          <div className="inline-flex items-center justify-center gap-2 bg-green-100 rounded-full px-4 py-1 mb-6">
            <GlobeIcon />
            <span className="text-sm font-medium text-green-800">Aushadh Mart</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <p className="text-sm text-gray-400 mt-4">{t.lastUpdated}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {t.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
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
                      <p className="text-gray-600 leading-relaxed mb-3">
                        {section.content}
                      </p>
                      {section.list && (
                        <ul className="space-y-2 mt-3">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <span className="text-green-600 mt-1">•</span>
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

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    📧
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.contact.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{t.contact.content}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`mailto:${t.contact.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors duration-200"
                      >
                        <MailIcon />
                        {t.contact.email}
                      </a>
                      <a
                        href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors duration-200"
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

          {/* Agreement Footer */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-green-100 text-center">
            <p className="text-gray-500 text-sm">
              {t.agreement}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default PrivacyPolicyPage;