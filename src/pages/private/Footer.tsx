import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-3xl md:text-4xl font-bold tracking-tight"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            JanConnect
          </motion.h3>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-gray-400 text-sm"
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 300
            }}
          >
            Your community, managed intelligently.
          </motion.p>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-8"
          >
            {["About", "Features", "Privacy", "Contact"].map((link) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ y: -2 }}
                className="text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors duration-300"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 h-px w-16 bg-gray-800"
          />

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-gray-600 text-xs"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            © {currentYear} JanConnect · Made with ❤️ in India
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;