// src/components/LanguageSelector.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Languages } from 'lucide-react';

export const LanguageSelector = ({ 
  languages, 
  i18n, 
  languageDropdownOpen, 
  setLanguageDropdownOpen, 
  changeLanguage 
}) => {
  return (
    <div className="relative">
      <motion.button
        onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
        className="flex items-center space-x-2 bg-white-900/70 hover:bg-white-800/70 p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-white/20 backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Languages className="h-5 w-5 text-white" />
        <span className="text-white">
          {languages.find(lang => lang.code === i18n.language)?.flag}
        </span>
      </motion.button>

      {/* Language Dropdown */}
      <AnimatePresence>
        {languageDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-white-900/95 backdrop-blur-xl rounded-xl shadow-lg z-20 overflow-hidden border border-white/20"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full text-left p-3 text-white/90 hover:bg-indigo-500/20 transition-all duration-150 flex items-center ${
                  i18n.language === language.code ? 'bg-indigo-500/30' : ''
                }`}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};