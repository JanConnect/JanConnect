// src/hocs/withMultilingual.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const withMultilingual = (WrappedComponent) => {
  return (props) => {
    const { t, i18n } = useTranslation();
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    
    // Available languages
    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    ];

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      setLanguageDropdownOpen(false);
    };

    return (
      <WrappedComponent
        {...props}
        t={t}
        i18n={i18n}
        languages={languages}
        languageDropdownOpen={languageDropdownOpen}
        setLanguageDropdownOpen={setLanguageDropdownOpen}
        changeLanguage={changeLanguage}
      />
    );
  };
};