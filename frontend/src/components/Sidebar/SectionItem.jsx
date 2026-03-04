import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronRight } from 'lucide-react';

export function SectionItem({ section, subjectId, currentVideoId, isLast }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* Section Header */}
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-sm text-gray-900 text-left">
          {section.title}
        </span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {/* Videos */}
      {isExpanded && (
        <div className="pb-2">
          {section.videos.map((video) => {
            const isActive = video.id === parseInt(currentVideoId);
            const isCompleted = video.is_completed;
            const isLocked = video.locked;

            return (
              <Link
                key={video.id}
                to={isLocked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : isLocked
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isLocked ? video.unlock_reason : video.title}
              >
                {/* Status Icon */}
                <span className="flex-shrink-0 mr-3">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <PlayCircle className="h-4 w-4 text-primary-500" />
                  )}
                </span>

                {/* Title */}
                <span className="truncate flex-1">{video.title}</span>

                {/* Duration */}
                {video.duration_seconds && !isLocked && (
                  <span className="flex-shrink-0 ml-2 text-xs text-gray-400">
                    {formatDuration(video.duration_seconds)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
