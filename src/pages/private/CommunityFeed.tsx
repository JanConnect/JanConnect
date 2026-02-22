import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useRef } from "react";

const posts = [
  {
    author: "Priya Sharma",
    time: "2h ago",
    text: "The new garden landscaping looks absolutely beautiful. Kudos to the maintenance team for the incredible work! 🌿",
    tags: ["#landscaping", "#community"],
    upvotes: 24,
    comments: 8,
    side: "left",
  },
  {
    author: "Rahul Mehta",
    time: "5h ago",
    text: "Water pressure issue in Block C resolved within 2 hours of reporting. Impressed with the response time.",
    tags: ["#maintenance", "#resolved"],
    upvotes: 18,
    comments: 3,
    side: "right",
  },
  {
    author: "Ananya Patel",
    time: "1d ago",
    text: "Weekend yoga sessions at the clubhouse have been wonderful. Thank you for organizing these wellness events.",
    tags: ["#wellness", "#events"],
    upvotes: 42,
    comments: 12,
    side: "left",
  },
  {
    author: "Vikram Singh",
    time: "3d ago",
    text: "The new security system at the main gate is working great. Feel much safer now!",
    tags: ["#security", "#safety"],
    upvotes: 56,
    comments: 15,
    side: "right",
  },
];

const CommunityFeed = () => {
  const { ref, isInView } = useScrollAnimation();
  const containerRef = useRef(null);

  return (
    <section 
      ref={ref} 
      className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/cf-bg3.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* No overlay - background shows naturally */}
      
      <div className="mx-auto max-w-7xl relative z-10" ref={containerRef}>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span 
            className="inline-block text-sm font-medium tracking-wider text-blue-600 mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            COMMUNITY VOICES
          </span>
          <h2 
            className="text-white" // Changed to white for better contrast
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '3.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)' // Added text shadow
            }}
          >
            Community Pulse
          </h2>
          <p 
            className="mt-4 text-lg text-white/90" // Changed to white with opacity
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 300,
              lineHeight: 1.7,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            Real stories and updates from residents like you
          </p>
        </motion.div>

        {/* Path/Tree Container */}
        <div className="relative">
          {/* Vertical Path Line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-400/40 via-blue-400/60 to-emerald-400/40"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ top: 0 }}
          />

          {/* Tree Branches */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Branch Points */}
            {posts.map((_, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ top: `${index * 200 + 100}px` }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
              >
                {/* Branch Node */}
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
                  
                  {/* Left Branch */}
                  <motion.div 
                    className="absolute top-1/2 right-full w-16 h-0.5 bg-gradient-to-l from-blue-500/60 to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={isInView ? { width: 64, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  />
                  
                  {/* Right Branch */}
                  <motion.div 
                    className="absolute top-1/2 left-full w-16 h-0.5 bg-gradient-to-r from-blue-500/60 to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={isInView ? { width: 64, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Comments - Left and Right */}
          <div className="relative space-y-16 py-10">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                className={`flex ${post.side === 'left' ? 'justify-start' : 'justify-end'} relative`}
                initial={{ opacity: 0, x: post.side === 'left' ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 50
                }}
              >
                {/* Connecting Line to Branch */}
                <motion.div 
                  className={`absolute top-1/2 ${post.side === 'left' ? 'right-full' : 'left-full'} w-16 h-0.5 bg-gradient-to-${post.side === 'left' ? 'l' : 'r'} from-blue-500/40 to-transparent`}
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: 64, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                />

                {/* Comment Card - Solid white for readability */}
                <motion.article
                  className={`w-[600px] bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    post.side === 'left' ? 'ml-12' : 'mr-12'
                  }`}
                  whileHover={{ 
                    scale: 1.01,
                    boxShadow: "0 20px 40px -12px rgba(37, 99, 235, 0.4)"
                  }}
                >
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white font-bold text-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {post.author[0]}
                    </motion.div>
                    <div>
                      <h3 
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {post.author}
                      </h3>
                      <p 
                        className="text-xs text-gray-500"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        {post.time}
                      </p>
                    </div>
                  </div>

                  {/* Content - Horizontal Layout */}
                  <div className="mt-3 flex items-start gap-4">
                    <p 
                      className="flex-1 text-sm leading-relaxed text-gray-700 line-clamp-2"
                      style={{ 
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {post.text}
                    </p>

                    {/* Tags - Vertical Stack on Right */}
                    <div className="flex flex-col gap-1.5 min-w-[100px]">
                      {post.tags.map((tag) => (
                        <motion.span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 text-center"
                          whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                          style={{ 
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Engagement - Horizontal Bar */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <motion.button 
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        <span 
                          className="text-xs font-medium"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {post.upvotes}
                        </span>
                      </motion.button>
                      <motion.button 
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        <span 
                          className="text-xs font-medium"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {post.comments}
                        </span>
                      </motion.button>
                    </div>
                    <motion.button 
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      whileHover={{ x: 2 }}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Read more →
                    </motion.button>
                  </div>
                </motion.article>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.button 
            className="px-10 py-4 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            View All Posts
          </motion.button>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          className="flex justify-center mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityFeed;