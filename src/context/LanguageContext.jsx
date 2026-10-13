import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('govguide_language') || 'en'
  );

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const changeLanguage = async (newLang) => {
    if (['en', 'te', 'hi'].includes(newLang)) {
      setCurrentLanguage(newLang);
      localStorage.setItem('govguide_language', newLang);
      await i18n.changeLanguage(newLang);

      // If user is logged in, sync preference with backend
      if (authService.isAuthenticated()) {
        try {
          await authService.updateLanguage(newLang);
        } catch (ignored) {
        }
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
