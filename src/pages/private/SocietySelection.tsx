import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const societies = [
  "Prestige Lakeside Habitat",
  "Brigade Gateway",
  "Sobha Dream Acres",
  "Godrej Platinum",
  "DLF The Camellias",
  "Lodha World One",
];

const SocietySelection = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { ref, isInView } = useScrollAnimation();
  const navigate = useNavigate();

  const filtered = societies.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const handleSocietySelect = (society: string) => {
    setSearch(society);
    setIsOpen(false);
  };

  const handleContinue = () => {
    if (search && societies.includes(search)) {
      navigate(`/privatehome?society=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section 
      ref={ref} 
      className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-white min-h-screen"
    >
      <div className="mx-auto max-w-xl text-center">
        <motion.h2
          className="text-gray-900"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Find Your Community
        </motion.h2>

        {/* Location Detection */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            <MapPin className="h-5 w-5 text-blue-600 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-ping" />
          </div>
          <span 
            className="text-base font-medium text-gray-600 tracking-wide"
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 300
            }}
          >
            Detecting your location…
          </span>
        </motion.div>

        {/* Search Input */}
        <motion.div
          className="relative mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search your society"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full border-b-2 border-gray-200 bg-transparent px-0 py-5 text-xl text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none transition-all duration-300"
              style={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 300
              }}
            />
            {search.length > 0 && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && search.length > 0 && (
            <motion.div
              className="absolute left-0 right-0 top-full z-20 mt-3 rounded-xl bg-white py-3 shadow-xl border border-gray-200 max-h-80 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((society) => (
                <button
                  key={society}
                  className="w-full px-5 py-4 text-left text-gray-900 transition-all hover:bg-gray-50 hover:pl-7"
                  style={{ 
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 300
                  }}
                  onClick={() => handleSocietySelect(society)}
                >
                  {society}
                </button>
              ))}
              {filtered.length === 0 && (
                <p 
                  className="px-5 py-4 text-base text-gray-500"
                  style={{ 
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 300
                  }}
                >
                  No communities found
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.button
            whileHover={{ 
              y: -4, 
              boxShadow: "0 20px 40px -15px rgba(37, 99, 235, 0.4)",
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!search || !societies.includes(search)}
            className={`relative group ${(!search || !societies.includes(search)) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* Gradient glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-300" />
            
            {/* Button background */}
            <div 
              className="relative px-12 py-5 bg-gray-900 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-300"
              style={{ 
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.05em'
              }}
            >
              Continue
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SocietySelection;