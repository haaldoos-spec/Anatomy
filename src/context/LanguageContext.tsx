/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '@/i18n/translations.json';

type Language = 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'sv')) {
        return savedLang;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'sv' : 'en';
    setLanguage(newLang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: Record<string, unknown> = translations as Record<string, unknown>;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && (current as Record<string, unknown>)[key] !== undefined) {
        current = (current as Record<string, unknown>)[key] as Record<string, unknown>;
      } else {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
    }

    if (current && typeof current === 'object' && (current as Record<string, string>)[language] !== undefined) {
      return (current as Record<string, string>)[language];
    }

    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
