import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { Button } from '../common/Button';

export function VideoMeta({
  video,
  onComplete,
  isCompleted,
}) {
  return (
    <div className="space-y-4">
      {/* Title and Navigation */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {video.subject_title} / {video.section_title}
          </p>
        </div>
        
        {/* Completion Status */}
        {isCompleted && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      {/* Description */}
      {video.description && (
        <p className="text-gray-600">{video.description}</p>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {video.previous_video_id ? (
          <Link to={`/subjects/${video.subject_id}/video/${video.previous_video_id}`}>
            <Button variant="secondary" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {!isCompleted && !video.locked && (
          <Button variant="primary" size="sm" onClick={onComplete}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark as Complete
          </Button>
        )}

        {video.next_video_id ? (
          <Link to={`/subjects/${video.subject_id}/video/${video.next_video_id}`}>
            <Button variant="secondary" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export function LockedVideoMessage({ reason }) {
  return (
    <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center p-8">
      <Lock className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Video Locked</h3>
      <p className="text-gray-500 text-center max-w-md">{reason}</p>
    </div>
  );
}
