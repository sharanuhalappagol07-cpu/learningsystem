import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videosApi } from '../lib/subjects';
import { progressApi } from '../lib/progress';
import { useVideoStore } from '../store/videoStore';
import { useSidebarStore } from '../store/sidebarStore';
import { AppShell } from '../components/Layout/AppShell';
import { SubjectSidebar } from '../components/Sidebar/SubjectSidebar';
import { VideoPlayer } from '../components/Video/VideoPlayer';
import { VideoMeta, LockedVideoMessage } from '../components/Video/VideoMeta';
import { Spinner, Alert } from '../components/common/Button';

export function VideoPage() {
  const { subjectId, videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    setCurrentVideo, 
    setVideoMeta, 
    isCompleted, 
    setIsCompleted,
    nextVideoId 
  } = useVideoStore();
  const { markVideoCompleted } = useSidebarStore();

  useEffect(() => {
    fetchVideoData();
  }, [subjectId, videoId]);

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch video metadata
      const videoData = await videosApi.getVideo(videoId);
      setVideo(videoData);
      setVideoMeta(videoData);
      setCurrentVideo(videoId, subjectId);
      
      // Fetch progress
      const progressData = await progressApi.getVideoProgress(videoId);
      setProgress(progressData);
      setIsCompleted(progressData.is_completed);
      
      // If video is locked, we still show it but without the player
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCompleted = async () => {
    try {
      // Update progress
      await progressApi.updateVideoProgress(videoId, {
        last_position_seconds: 0,
        is_completed: true,
      });
      
      // Update stores
      setIsCompleted(true);
      markVideoCompleted(videoId);
      
      // Navigate to next video if available
      if (nextVideoId) {
        navigate(`/subjects/${subjectId}/video/${nextVideoId}`);
      }
    } catch (error) {
      console.error('Failed to complete video:', error);
    }
  };

  const handleManualComplete = async () => {
    await handleVideoCompleted();
  };

  if (loading) {
    return (
      <AppShell sidebar={<SubjectSidebar />}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell sidebar={<SubjectSidebar />}>
        <Alert type="error" message={error} />
      </AppShell>
    );
  }

  if (!video) {
    return (
      <AppShell sidebar={<SubjectSidebar />}>
        <Alert type="error" message="Video not found" />
      </AppShell>
    );
  }

  return (
    <AppShell sidebar={<SubjectSidebar />}>
      <div className="space-y-6">
        {/* Video Player or Locked Message */}
        {video.locked ? (
          <LockedVideoMessage reason={video.unlock_reason} />
        ) : (
          <VideoPlayer
            videoId={videoId}
            youtubeUrl={video.youtube_url}
            startPositionSeconds={progress?.last_position_seconds || 0}
            onCompleted={handleVideoCompleted}
          />
        )}

        {/* Video Metadata */}
        <VideoMeta
          video={video}
          onComplete={handleManualComplete}
          isCompleted={isCompleted}
        />
      </div>
    </AppShell>
  );
}
