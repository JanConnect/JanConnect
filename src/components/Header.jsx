import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LogIn, Menu, X, Lock } from "lucide-react";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check system preference and saved preference on initial load
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
    
    // Check system preference
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Determine initial theme
    let initialDarkMode = false;
    
    if (savedTheme) {
      initialDarkMode = savedTheme === "dark";
    } else {
      initialDarkMode = systemPrefersDark;
    }
    
    setIsDarkMode(initialDarkMode);
    
    // Apply the theme to the document
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Detect scroll for header style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-sm" 
            : "bg-white/10 dark:bg-black/10 backdrop-blur-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Site Name */}
          <motion.div 
            className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/">JanConnect</Link>
          </motion.div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/0 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Private Button */}
            <motion.button
              className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-white dark:border-gray-300 text-gray-800 dark:text-white bg-transparent hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock className="h-4 w-4" />
              <Link to="/private">Private</Link>
            </motion.button>

            {/* Login Button */}
            <motion.button
              className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-white dark:border-gray-300 text-gray-800 dark:text-white bg-transparent hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn className="h-4 w-4" />
              <Link to="/login">Login</Link>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-xl bg-white/0 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/20 dark:bg-black/20 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* Theme Toggle in Mobile Menu */}
              <motion.button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-xl bg-white/0 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300"
                whileTap={{ scale: 0.95 }}
              >
                {isDarkMode ? (
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-white mr-2" />
                    <span className="text-gray-800 dark:text-white">Light Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Moon className="h-5 w-5 text-gray-700 mr-2" />
                    <span className="text-gray-800 dark:text-white">Dark Mode</span>
                  </div>
                )}
              </motion.button>

              {/* Private Button in Mobile Menu */}
              <motion.button
                className="flex items-center justify-center space-x-1 px-4 py-2 rounded-xl border border-white dark:border-gray-300 text-gray-800 dark:text-white bg-transparent hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <Lock className="h-4 w-4" />
                <Link to="/private">Private</Link>
              </motion.button>

              {/* Login Button in Mobile Menu */}
              <motion.button
                className="flex items-center justify-center space-x-1 px-4 py-2 rounded-xl border border-white dark:border-gray-300 text-gray-800 dark:text-white bg-transparent hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="h-4 w-4" />
                <Link to="/login">Login</Link>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;