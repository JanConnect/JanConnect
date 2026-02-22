import { useRef, useState, useEffect, useCallback } from 'react';

export const useVideoPlayer = (videoUrl, isActive) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Play/Pause based on visibility
  useEffect(() => {
    const controlVideo = async () => {
      if (!videoRef.current) return;

      try {
        if (isActive) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
      } catch (err) {
        console.error('Video control error:', err);
        setError(err);
      }
    };

    controlVideo();
  }, [isActive]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const replay = useCallback(async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
    }
  }, []);

  const onLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const onLoad = useCallback((status) => {
    setIsLoading(false);
    setStatus(status);
  }, []);

  const onError = useCallback((error) => {
    setIsLoading(false);
    setError(error);
    console.error('Video loading error:', error);
  }, []);

  return {
    videoRef,
    status,
    isLoading,
    error,
    isMuted,
    toggleMute,
    replay,
    onLoadStart,
    onLoad,
    onError,
  };
};