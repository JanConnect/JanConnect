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

// Multiple reliable image sources with different domains for redundancy
const photoSets = [
  // Set 1: Pexels (most reliable)
  [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/533157/pexels-photo-533157.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  ],
  // Set 2: Picsum (always available)
  [
    "https://picsum.photos/id/1015/600/400", // Mountain landscape
    "https://picsum.photos/id/1018/600/400", // Valley
    "https://picsum.photos/id/1043/600/400", // Beach
    "https://picsum.photos/id/106/600/400", // Flower
    "https://picsum.photos/id/107/600/400", // Grass
  ],
  // Set 3: More Pexels
  [
    "https://images.pexels.com/photos/164522/pexels-photo-164522.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/460695/pexels-photo-460695.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  ]
];

// Flatten all photos for maximum variety
const photoUrls = photoSets.flat();

// Enhanced fallback with gradient background
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%234a5568'/%3E%3Cstop offset='100%25' stop-color='%232d3748'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23e2e8f0' font-family='Arial' font-size='24' font-weight='bold'%3ELuxury Home%3C/text%3E%3C/svg%3E";

// Array of working backup images (using different CDNs)
const backupImages = [
  "https://placehold.co/600x400/2d3748/e2e8f0?text=Modern+Villa",
  "https://placehold.co/600x400/1e293b/e2e8f0?text=Luxury+Estate",
  "https://placehold.co/600x400/0f172a/e2e8f0?text=Premium+Residence",
  "https://placehold.co/600x400/334155/e2e8f0?text=Garden+View",
  "https://placehold.co/600x400/475569/e2e8f0?text=Pool+House",
];

const SocietySelection = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { ref, isInView } = useScrollAnimation();
  const navigate = useNavigate();
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>({});
  const [loadAttempts, setLoadAttempts] = useState<{ [key: string]: number }>({});

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

  const getImageSrc = (index: string, originalUrl: string) => {
    return imageSources[index] || originalUrl;
  };

  const handleImageError = (index: string, originalUrl: string) => {
    const currentAttempts = loadAttempts[index] || 0;
    
    if (currentAttempts === 0) {
      // First failure: try a different image from the same set
      const backupIndex = Math.floor(Math.random() * photoUrls.length);
      setImageSources(prev => ({ ...prev, [index]: photoUrls[backupIndex] }));
    } else if (currentAttempts === 1) {
      // Second failure: try placeholder backup
      const backupIndex = Math.floor(Math.random() * backupImages.length);
      setImageSources(prev => ({ ...prev, [index]: backupImages[backupIndex] }));
    } else {
      // Final failure: use fallback SVG
      setImageSources(prev => ({ ...prev, [index]: fallbackImage }));
    }
    
    setLoadAttempts(prev => ({ ...prev, [index]: currentAttempts + 1 }));
  };

  return (
    <section 
      ref={ref} 
      className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-white min-h-screen relative overflow-hidden"
    >
      {/* Moving Photo Ribbon - Larger and Moved Towards Center */}
      <div className="absolute right-[12%] top-1/2 -translate-y-1/2 h-[95%] w-96 pointer-events-none overflow-hidden rounded-2xl">
        {/* First ribbon - moving top to bottom */}
        <motion.div
          className="absolute left-0 w-1/2 pr-3"
          animate={{
            y: [0, -3000]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {[...Array(40)].map((_, index) => {
            const photoIndex = index % photoUrls.length;
            const originalUrl = photoUrls[photoIndex];
            const uniqueKey = `top-${index}`;
            
            return (
              <div
                key={uniqueKey}
                className="w-full h-56 mb-4 rounded-xl overflow-hidden shadow-xl border-2 border-white/20"
              >
                <img
                  src={getImageSrc(uniqueKey, originalUrl)}
                  alt={`Luxury Property ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={() => handleImageError(uniqueKey, originalUrl)}
                  loading="lazy"
                />
              </div>
            );
          })}
        </motion.div>

        {/* Second ribbon - moving bottom to top */}
        <motion.div
          className="absolute right-0 w-1/2 pl-3"
          animate={{
            y: [-3000, 0]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {[...Array(40)].map((_, index) => {
            const photoIndex = (index + 20) % photoUrls.length; // Offset for variety
            const originalUrl = photoUrls[photoIndex];
            const uniqueKey = `bottom-${index}`;
            
            return (
              <div
                key={uniqueKey}
                className="w-full h-56 mb-4 rounded-xl overflow-hidden shadow-xl border-2 border-white/20"
              >
                <img
                  src={getImageSrc(uniqueKey, originalUrl)}
                  alt={`Luxury Property ${index + 41}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={() => handleImageError(uniqueKey, originalUrl)}
                  loading="lazy"
                />
              </div>
            );
          })}
        </motion.div>

        {/* Gradient overlays for smooth edges */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
        
        {/* Decorative border */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-2xl z-20" />
      </div>

      {/* Main content - Shifted Left */}
      <div className="max-w-xl ml-[8%] text-center relative z-10">
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