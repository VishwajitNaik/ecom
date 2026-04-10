'use client';

import React, { useState } from 'react';

const RefundReturnPolicyPage = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Refund & Return Policy',
      subtitle: 'We aim to provide the best quality products. However, refunds are applicable under the following conditions:',
      lastUpdated: 'Last Updated: April 10, 2026',
      eligible: {
        title: '✅ Eligible for Refund',
        items: [
          'Damaged product received',
          'Wrong product delivered',
        ],
      },
      notEligible: {
        title: '❌ Not Eligible for Refund',
        items: [
          'Opened or used products',
          'Change of mind after purchase',
        ],
      },
      request: {
        title: '📋 Refund Request',
        description: 'You must request a refund within 48 hours of delivery by contacting us with proof (photos/videos).',
        timeline: '48 hours',
      },
      process: {
        title: '⚙️ Refund Process',
        steps: [
          'Once approved, refund will be processed within 5–7 business days',
          'Amount will be credited to original payment method',
        ],
      },
      shipping: {
        title: '🚚 Shipping',
        description: 'Delivery time: 4–5 working days (may vary based on location)',
      },
      contact: {
        title: '📞 Contact Us',
        email: 'aushdhmart@gmail.com',
        phone: '8308383842',
      },
      agreement: 'By placing an order, you agree to this refund policy.',
      buttons: {
        en: 'English',
        mr: 'मराठी',
      },
    },
    mr: {
      title: 'परतावा आणि वापसी धोरण',
      subtitle: 'आम्ही सर्वोत्तम गुणवत्तेची उत्पादने प्रदान करण्याचे उद्दिष्ट ठेवतो. तथापि, खालील अटींनुसार परतावा लागू आहे:',
      lastUpdated: 'शेवटचे अद्यतनित: १० एप्रिल २०२६',
      eligible: {
        title: '✅ परताव्यासाठी पात्र',
        items: [
          'खराब झालेले उत्पादन प्राप्त झाले',
          'चुकीचे उत्पादन वितरित केले',
        ],
      },
      notEligible: {
        title: '❌ परताव्यासाठी पात्र नाही',
        items: [
          'उघडलेली किंवा वापरलेली उत्पादने',
          'खरेदी केल्यानंतर मन बदलल्यास',
        ],
      },
      request: {
        title: '📋 परतावा विनंती',
        description: 'डिलिव्हरीनंतर ४८ तासांच्या आत पुराव्यासह (फोटो/व्हिडिओ) आमच्याशी संपर्क साधून परताव्याची विनंती करणे आवश्यक आहे.',
        timeline: '४८ तास',
      },
      process: {
        title: '⚙️ परतावा प्रक्रिया',
        steps: [
          'एकदा मंजूर झाल्यावर, ५-७ कामकाजाच्या दिवसांत परतावा प्रक्रिया केली जाईल',
          'रक्कम मूळ पेमेंट पद्धतीवर जमा केली जाईल',
        ],
      },
      shipping: {
        title: '🚚 शिपिंग',
        description: 'डिलिव्हरी वेळ: ४-५ कामकाजाचे दिवस (स्थानानुसार बदलू शकते)',
      },
      contact: {
        title: '📞 संपर्क करा',
        email: 'aushdhmart@gmail.com',
        phone: '८३०८३८३८४२',
      },
      agreement: 'ऑर्डर देऊन, आपण या परतावा धोरणास सहमती देत आहात.',
      buttons: {
        en: 'English',
        mr: 'मराठी',
      },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-blue-50">
      <div className="fixed top-4 right-4 z-20 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-blue-200">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            language === 'en'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-100'
          }`}
        >
          {t.buttons.en}
        </button>
        <button
          onClick={() => setLanguage('mr')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            language === 'mr'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-100'
          }`}
        >
          {t.buttons.mr}
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 rounded-full px-4 py-1 mb-6">
            <GlobeIcon />
            <span className="text-sm font-medium text-blue-800">Aushadh Mart</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-lg">🛡️</span>
            <span className="text-sm font-medium text-blue-800">
              {language === 'en' ? 'Customer Protection' : 'ग्राहक संरक्षण'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-4">{t.lastUpdated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    ✅
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.eligible.title}
                    </h2>
                    <ul className="space-y-2">
                      {t.eligible.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    ❌
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.notEligible.title}
                    </h2>
                    <ul className="space-y-2">
                      {t.notEligible.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <span className="text-red-600 mt-1">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    ⏰
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.request.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {t.request.description}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-blue-50 rounded-full">
                      <span className="text-lg">📸</span>
                      <span className="text-sm font-medium text-blue-700">
                        {language === 'en' ? 'Proof required: Photos/Videos' : 'पुरावा आवश्यक: फोटो/व्हिडिओ'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      ⏱️ {language === 'en' ? 'Time limit:' : 'वेळ मर्यादा:'}{' '}
                      <span className="font-semibold text-blue-600">{t.request.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-purple-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    🔄
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.process.title}
                    </h2>
                    <ul className="space-y-3">
                      {t.process.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <span className="text-purple-600 mt-1">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-700">
                        <span className="text-lg">💰</span>
                        <span className="text-sm font-medium">
                          {language === 'en'
                            ? 'Refund credited to original payment method'
                            : 'परतावा मूळ पेमेंट पद्धतीवर जमा केला जातो'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-teal-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    🚚
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.shipping.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{t.shipping.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    📞
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                      {t.contact.title}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`mailto:${t.contact.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <MailIcon />
                        {t.contact.email}
                      </a>
                      <a
                        href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
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

          <div className="mt-8 p-6 bg-white rounded-2xl border border-blue-100 text-center">
            <p className="text-gray-500 text-sm">{t.agreement}</p>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
            <p className="text-xs text-yellow-700">
              {language === 'en'
                ? '📸 Keep the original packaging and unboxing video for a smooth refund process.'
                : '📸 सुरळीत परतावा प्रक्रियेसाठी मूळ पॅकेजिंग आणि अनबॉक्सिंग व्हिडिओ ठेवा.'}
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

export default RefundReturnPolicyPage;