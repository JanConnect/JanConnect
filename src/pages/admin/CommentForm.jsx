import React, { useState, useRef } from 'react';
import { Send, Camera, RefreshCw } from 'lucide-react';

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
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment about this complaint's progress..."
          rows={3}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
      </div>

      {/* Media Upload */}
      <div>
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
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
        >
          <Camera className="h-4 w-4" />
          Attach Photos
        </button>
      </div>

      {/* Selected Files Preview */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
      </button>
    </form>
  );
};

export default CommentForm;