import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "Report an Issue",
    description: "Submit via image, voice, or text — it takes under 30 seconds.",
  },
  {
    number: "02",
    title: "We Assign a Verified Worker",
    description: "Fast response from trained, background-checked professionals.",
  },
  {
    number: "03",
    title: "Track & Rate",
    description: "Full transparency from assignment to resolution. You're always in control.",
  },
];

const HowItWorks = () => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section 
      ref={ref} 
      className="py-28 px-6 md:px-12 lg:px-24 bg-[#F8F8F8]"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-gray-900"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '3.5rem',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            >
              <span 
                className="inline-block text-gray-200"
                style={{ 
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '8rem',
                  fontWeight: 400,
                  lineHeight: 0.9,
                  letterSpacing: '0.02em'
                }}
              >
                {step.number}
              </span>
              <h3 
                className="mt-4 text-2xl text-gray-900"
                style={{ 
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.05em'
                }}
              >
                {step.title}
              </h3>
              <p 
                className="mt-4 text-base leading-relaxed text-gray-600 max-w-xs mx-auto"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 300,
                  lineHeight: 1.7
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Subtle decorative element */}
        <motion.div
          className="flex justify-center mt-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="w-16 h-px bg-gray-300" />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;