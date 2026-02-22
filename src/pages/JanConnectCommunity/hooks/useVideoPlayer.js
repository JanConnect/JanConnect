import { useRef, useState, useEffect, useCallback } from 'react';

export const useVideoPlayer = (videoUrl, isActive) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Play/Pause based on visibility
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handlePlay = async () => {
      try {
        if (isActive) {
          await video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      } catch (err) {
        console.error('Video playback error:', err);
        setError(err);
      }
    };

    handlePlay();
  }, [isActive]);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleError = (e) => {
      setIsLoading(false);
      setError(e);
      console.error('Video error:', e);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const seekTo = useCallback((percentage) => {
    if (!videoRef.current || !duration) return;
    
    const time = (percentage / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(percentage);
  }, [duration]);

  const replay = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  }, []);

  return {
    videoRef,
    isPlaying,
    isLoading,
    error,
    isMuted,
    progress,
    duration,
    togglePlay,
    toggleMute,
    seekTo,
    replay,
  };
};