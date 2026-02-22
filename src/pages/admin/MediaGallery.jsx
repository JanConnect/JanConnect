import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Camera, MessageCircle, Mic } from 'lucide-react';

const MediaGallery = ({ image, voiceMessage }) => {
  const hasImage = image?.url;
  const hasVoice = voiceMessage?.url;

  if (!hasImage && !hasVoice) {
    return (
      <motion.div
        className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Media Attachments</h2>
        <div className="text-white/60 italic flex items-center justify-center py-8">
          <Camera className="h-5 w-5 mr-2 opacity-50" />
          No media attached to this report
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-indigo-400" />
        Media Attachments
      </h2>
      
      <div className="space-y-6">
        {/* Image Section */}
        {hasImage && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Uploaded Image
            </h3>
            <div className="relative group overflow-hidden rounded-xl bg-black/20">
              <img
                src={image.url}
                alt="Report evidence"
                className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error('Failed to load image:', image.url);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Failed+to+Load';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a 
                  href={image.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Eye className="h-6 w-6 text-white" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Voice Message Section */}
        {hasVoice && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Message
            </h3>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <audio 
                controls 
                src={voiceMessage.url}
                className="w-full"
                style={{ 
                  filter: 'invert(1)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  console.error('Failed to load audio:', voiceMessage.url);
                  e.target.onerror = null;
                }}
              >
                Your browser does not support the audio element.
              </audio>
              {voiceMessage.duration && (
                <p className="text-white/50 text-xs mt-2">
                  Duration: {Math.floor(voiceMessage.duration / 60)}:{(voiceMessage.duration % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MediaGallery;