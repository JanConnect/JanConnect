const MediaGallery = ({ media }) => {
  if (!media || (!media.url && (!Array.isArray(media) || media.length === 0))) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
        <div className="text-white/60 italic">No media attached to this report</div>
      </div>
    );
  }

  const mediaArray = Array.isArray(media) ? media : [media];

  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mediaArray.map((item, index) => (
          <div key={item.id || index} className="relative group overflow-hidden rounded-xl">
            <img
              src={item.url}  // Direct URL, no BASE_URL
              alt="Report media"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <Eye className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};