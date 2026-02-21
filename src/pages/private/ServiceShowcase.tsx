import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const serviceImg = "/images/service-showcase.png";

const ServiceShowcase = () => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section 
      ref={ref} 
      className="py-32 px-6 md:px-12 lg:px-24 bg-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-20 lg:gap-24 md:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-3xl shadow-xl"
          >
            <motion.img
              src={serviceImg}
              alt="Professional worker using tablet for smart home maintenance"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span 
                className="inline-block text-sm font-medium tracking-wider text-blue-600"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                WHY CHOOSE US
              </span>
              <h2 
                className="text-gray-900"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2
                }}
              >
                Fast. Verified.
                <br />
                <span className="text-blue-600">Accountable.</span>
              </h2>
              <p 
                className="text-lg text-gray-600 max-w-lg"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 300,
                  lineHeight: 1.7
                }}
              >
                Every professional is thoroughly vetted and monitored to ensure quality service.
              </p>
            </div>

            <ul className="space-y-6">
              {[
                "Verified professionals with background checks",
                "Real-time tracking from assignment to completion",
                "Transparent pricing with no hidden charges",
                "Rate and review every service interaction",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4 text-gray-700"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  style={{ 
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400
                  }}
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row pt-6">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-gray-900 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-xl"
                style={{ 
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                Raise Complaint
              </motion.button>
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 border-2 border-gray-200 rounded-full text-sm font-bold uppercase tracking-widest text-gray-900 transition-all duration-300 hover:bg-gray-100 hover:border-gray-300"
                style={{ 
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                Book a Service
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Decorative element */}
        <motion.div
          className="flex justify-center mt-24"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceShowcase;