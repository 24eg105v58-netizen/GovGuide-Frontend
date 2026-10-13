
import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    home: 'Home',
    schemes: 'Schemes',
    eligibility: 'Check Eligibility',
    login: 'Login',
    register: 'Register',
    language: 'Language',
    welcome: 'Welcome to GovGuide',
    search: 'Search schemes',
    farmerSchemes: 'Farmer Schemes',
    speak: 'Speak',
    readAloud: 'Read aloud',
    benefits: 'Benefits',
    documents: 'Required Documents',
    officialWebsite: 'Official Website'
  },
  te: {
    home: 'హోమ్',
    schemes: 'పథకాలు',
    eligibility: 'అర్హతను తనిఖీ చేయండి',
    login: 'లాగిన్',
    register: 'నమోదు',
    language: 'భాష',
    welcome: 'GovGuide కు స్వాగతం',
    search: 'పథకాలను వెతకండి',
    farmerSchemes: 'రైతుల పథకాలు',
    speak: 'మాట్లాడండి',
    readAloud: 'చదివి వినిపించండి',
    benefits: 'ప్రయోజనాలు',
    documents: 'అవసరమైన పత్రాలు',
    officialWebsite: 'అధికారిక వెబ్‌సైట్'
  },
  hi: {
    home: 'होम',
    schemes: 'योजनाएँ',
    eligibility: 'पात्रता जाँचें',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    language: 'भाषा',
    welcome: 'GovGuide में आपका स्वागत है',
    search: 'योजनाएँ खोजें',
    farmerSchemes: 'किसानों की योजनाएँ',
    speak: 'बोलें',
    readAloud: 'ज़ोर से पढ़ें',
    benefits: 'लाभ',
    documents: 'आवश्यक दस्तावेज़',
    officialWebsite: 'आधिकारिक वेबसाइट'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key) => translations[language]?.[key] ?? translations.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
