import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { Phone, Star, Clock, ShieldCheck, ArrowRight } from "lucide-react";

const workerImg = "/images/worker-portrait.png";

const features = [
  { icon: ShieldCheck, text: "Background-verified professional assigned to your request" },
  { icon: Phone, text: "Direct contact access — no middlemen, no delays" },
  { icon: Clock, text: "Real-time status updates from start to finish" },
  { icon: Star, text: "Rate and review every interaction transparently" },
];

const WorkerTransparency = () => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section 
      ref={ref} 
      className="py-32 px-6 md:px-12 lg:px-24 bg-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-20 lg:gap-24 md:grid-cols-2">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Label */}
            <span 
              className="inline-block text-sm font-medium tracking-wider text-blue-600"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              COMPLETE TRANSPARENCY
            </span>

            {/* Heading */}
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
              Know Who's
              <br />
              <span className="text-blue-600">At Your Door.</span>
            </h2>

            {/* Description */}
            <p 
              className="text-lg text-gray-600 max-w-lg"
              style={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              Every professional is thoroughly vetted and monitored to ensure your safety and peace of mind.
            </p>

            {/* Features */}
            <div className="space-y-6 pt-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <div className="mt-0.5 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p 
                    className="flex-1 text-gray-700"
                    style={{ 
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    {feature.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ y: -3, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-8 px-10 py-4 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
              style={{ 
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.05em'
              }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Learn More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl" />
            
            {/* Image container */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <motion.img
                src={workerImg}
                alt="Verified professional worker smiling in modern building lobby"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
            </div>

            {/* Stats card overlay */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">100% Verified</p>
                  <p className="text-xs text-gray-500">Background checked</p>
                </div>
              </div>
            </motion.div>
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

export default WorkerTransparency;