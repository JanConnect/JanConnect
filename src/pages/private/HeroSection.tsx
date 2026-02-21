import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const heroVideo = "/images/community-video.mp4";
const heroFallbackImage = "/images/hero-community.png";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  // Theme toggle state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Theme Toggle Button - Top Right Corner */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-white" />
        ) : (
          <Moon className="h-5 w-5 text-white" />
        )}
      </motion.button>

      {/* Background Video with Parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover scale-110"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img
            src={heroFallbackImage}
            alt="Modern gated community with clean roads and smart infrastructure"
            className="h-full w-full object-cover scale-110"
          />
        </video>
      </motion.div>

      {/* Dark Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity: textOpacity, y: textY }}
      >
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-lg">
          Your Community.
          <br />
          <span className="font-bold text-white">Managed Intelligently.</span>
        </h1>

        <p className="mt-6 max-w-lg font-body text-lg font-bold text-white/90 md:text-xl drop-shadow-md">
          Fast service. Verified workers. Transparent resolution.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-white/20 px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 border-2 border-white/30 shadow-lg"
          >
            Enter Your Society
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white"
          >
            <span className="border-b-2 border-white/50 pb-1 transition-all duration-300 group-hover:border-white">
              Explore Features
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/50 flex items-start justify-center p-1.5">
          <motion.div
            className="h-2 w-1.5 rounded-full bg-white"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;