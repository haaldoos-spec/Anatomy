'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      title={language === 'en' ? 'Byt till svenska' : 'Switch to English'}
    >
      <Globe className="w-4 h-4 mr-2" />
      {language === 'en' ? 'EN' : 'SV'}
    </button>
  );
}
