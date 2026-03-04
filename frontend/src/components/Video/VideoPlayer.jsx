import React, { useRef, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import { useVideoStore } from '../../store/videoStore';
import { debouncedUpdateProgress, progressApi } from '../../lib/progress';

export function VideoPlayer({ videoId, youtubeUrl, startPositionSeconds, onCompleted }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const { setCurrentTime, setIsPlaying, setDuration, setIsCompleted } = useVideoStore();

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(youtubeUrl);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      start: startPositionSeconds || 0,
      rel: 0,
      modestbranding: 1,
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    const duration = event.target.getDuration();
    setDuration(duration);
  };

  const onPlay = () => {
    setIsPlaying(true);
    
    // Start progress tracking interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        setCurrentTime(currentTime);
        debouncedUpdateProgress(videoId, currentTime);
      }
    }, 5000);
  };

  const onPause = () => {
    setIsPlaying(false);
    
    // Clear interval and send final progress
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      debouncedUpdateProgress(videoId, currentTime);
    }
  };

  const onEnd = async () => {
    setIsPlaying(false);
    setIsCompleted(true);
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Mark as completed
    try {
      await progressApi.updateVideoProgress(videoId, {
        last_position_seconds: 0,
        is_completed: true,
      });
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
    }
  };

  const onError = (event) => {
    console.error('YouTube player error:', event.data);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        debouncedUpdateProgress(videoId, currentTime);
      }
    };
  }, [videoId]);

  if (!youtubeId) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-white">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <YouTube
        videoId={youtubeId}
        opts={opts}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onError={onError}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
