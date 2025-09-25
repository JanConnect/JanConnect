import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay, Parallax } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// CSS for the pagination bullets
const paginationStyles = `
  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 6px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: transparent;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  }
`;

const defaultDirtyBg = "/images/dirtybg.jpg";
const defaultCleanBg = "/images/cleanbg.jpg";

const defaultDirtyThumbs = [
  "/images/dirty6.jpg",
  "/images/dirtyc5.jpg",
  "/images/dirtyc2.jpg",
];

const defaultCleanThumbs = [
  "/images/cleanc1.jpg",
  "/images/cleanc2.jpg",
  "/images/cleanc3.jpg",
];

function Particles({ variant = "dust" }) {
  const items = new Array(18).fill(0);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{
            opacity: [0, 0.8, 0.2, 0.8, 0],
            y: [0, -20, 10, -10, 0],
            x: [0, 10, -5, 5, 0],
            scale: [0.8, 1, 0.9, 1.05, 0.8],
          }}
          transition={{
            duration: 8 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={
            variant === "dust"
              ? "absolute h-1 w-1 rounded-full bg-white/30 blur-[1px]"
              : "absolute h-1 w-1 rounded-full bg-white/70"
          }
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

function BottomCard({ thumbs }) {
  const offsets = ["-translate-y-30", "-translate-y-15", "translate-y-3"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[min(90%,800px)] h-[40%] absolute bottom-0 right-0 z-50"
    >
      <div className="h-full flex flex-col justify-end pb-4">
        <div className="flex h-full gap-6 md:gap-8 px-2 justify-end items-end">
          {thumbs.slice(0, 3).map((src, idx) => (
            <motion.div
              key={idx}
              className={`relative h-full w-[250px] overflow-hidden rounded-2xl ${offsets[idx]} cursor-pointer group`}
              whileHover={{
                scale: 1.1,
                z: 50,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              {/* Card Image */}
              <img
                src={src}
                alt="preview"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Headline({ text, variant = "dirty" }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="pointer-events-none select-none text-left w-full text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight drop-shadow-xl px-6 mt-10 leading-[1.1] text-white"
      data-swiper-parallax="-100%"
    >
      {text}
    </motion.h1>
  );
}

export default function ImpactHeroSlider({
  dirtyBg = defaultDirtyBg,
  dirtyThumbs = defaultDirtyThumbs,
  cleanBg = defaultCleanBg,
  cleanThumbs = defaultCleanThumbs,
  onCTA,
}) {
  return (
    <div className="relative h-[100svh] w-full">
      <style>{paginationStyles}</style>
      
      <Swiper
        modules={[Pagination, EffectFade, Autoplay, Parallax]}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        effect="fade"
        speed={900}
        parallax
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {/* Slide 1 — Unclean City */}
        <SwiperSlide>
          <section className="relative h-[100svh] w-full overflow-hidden">
            <img
  src={`${import.meta.env.BASE_URL}images/dirtybg.jpg`}
  alt="Unclean City"
  className="absolute inset-0 h-full w-full object-cover"
/>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
            <Particles variant="dust" />

            {/* Headline shifted to top-left */}
            <div className="relative z-10 flex flex-col items-start justify-start h-full w-full px-6 pt-10">
              <Headline text="Nature can't speak-" variant="dirty" />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-4 max-w-xl text-left text-white/80 md:text-lg"
                data-swiper-parallax="-60%"
              >
                But the city's pain is loud—pollution, waste, neglect. See it.
                Feel it.
              </motion.p>
            </div>

            {/* Bottom card moved to right side */}
            <BottomCard thumbs={dirtyThumbs} />
          </section>
        </SwiperSlide>

        {/* Slide 2 — Clean City */}
        <SwiperSlide>
          <section className="relative h-[100svh] w-full overflow-hidden">
            <img
              src={cleanBg}
              alt="Clean City"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
            <Particles variant="light" />

            <div className="relative z-10 flex flex-col items-start justify-start h-full w-full px-6 pt-10">
              <Headline text="But you can !" variant="clean" />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-4 max-w-xl text-left text-white/90 md:text-lg"
                data-swiper-parallax="-60%"
              >
                Report. Act. Transform. Your voice turns problems into progress.
              </motion.p>

              {onCTA && (
                <motion.button
                  onClick={onCTA}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-black/90 bg-white/90 backdrop-blur border border-white/40 shadow-lg"
                >
                  Start Reporting →
                </motion.button>
              )}
            </div>

            <BottomCard thumbs={cleanThumbs} />
          </section>
        </SwiperSlide>
      </Swiper>

      <div className="swiper-pagination !bottom-8" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
    </div>
  );
}