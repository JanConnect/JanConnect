import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { safeRender } from '../../utils/helpers';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ 
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 224
      });
    }
  }, [isOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all duration-200 relative z-10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-white text-sm hidden sm:block">{safeRender(user?.name, 'Admin')}</span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl overflow-hidden"
            style={{
              top: position.top,
              left: position.left,
              width: 224,
              zIndex: 9999
            }}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{safeRender(user?.name, 'Admin')}</div>
                  <div className="text-white/60 text-xs">{safeRender(user?.email, 'admin@janconnect.com')}</div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ProfileDropdown;