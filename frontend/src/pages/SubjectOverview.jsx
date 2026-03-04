import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { subjectsApi } from '../lib/subjects';
import { useSidebarStore } from '../store/sidebarStore';
import { Spinner } from '../components/common/Button';

export function SubjectOverview() {
  const { subjectId } = useParams();
  const { fetchTree, tree, loading, error } = useSidebarStore();

  useEffect(() => {
    fetchTree(subjectId);
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-8 w-8 text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Find first unlocked video and redirect
  if (tree) {
    for (const section of tree.sections) {
      for (const video of section.videos) {
        if (!video.locked) {
          return <Navigate to={`/subjects/${subjectId}/video/${video.id}`} replace />;
        }
      }
    }
    
    // If all videos are locked, redirect to first video anyway (will show locked message)
    if (tree.sections.length > 0 && tree.sections[0].videos.length > 0) {
      return <Navigate to={`/subjects/${subjectId}/video/${tree.sections[0].videos[0].id}`} replace />;
    }
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-600">No videos available in this subject.</p>
    </div>
  );
}
