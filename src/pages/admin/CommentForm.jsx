import React, { useState, useRef } from 'react';
import { Send, Camera, RefreshCw, X } from 'lucide-react';

const CommentForm = ({ onAddComment, isSubmitting }) => {
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const commentData = {
      message,
      media: mediaFiles.map(file => URL.createObjectURL(file)) // Mock URLs for demo
    };

    await onAddComment(commentData);
    setMessage('');
    setMediaFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Comment Input with Bottom Border Only */}
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment about this complaint...."
          rows={2}
          className="w-full px-0 bg-transparent border-b border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
          required
        />
      </div>

      {/* Media Upload - Minimal Style */}
      <div className="flex items-center justify-between">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 py-2 text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/30"
        >
          <Camera className="h-4 w-4" />
          <span className="text-sm">Attach Photos</span>
        </button>
        
        {/* Character count - optional */}
        <span className="text-xs text-white/30">
          {message.length} characters
        </span>
      </div>

      {/* Selected Files Preview - Clean Style */}
      {mediaFiles.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-white/50 mb-2">Attached photos ({mediaFiles.length})</p>
          <div className="grid grid-cols-4 gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-16 object-cover rounded-md border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 bg-red-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-[10px] text-white/40 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button - Clean Style */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="w-full py-3 flex items-center justify-center gap-2 text-white font-medium transition-colors border-b border-white/20 hover:border-indigo-400 disabled:opacity-50 disabled:hover:border-white/20"
        >
          {isSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="text-sm">{isSubmitting ? 'Adding Comment...' : 'Add Comment'}</span>
        </button>
      </div>
    </form>
  );
};

export default CommentForm;