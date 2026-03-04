import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import { SectionItem } from './SectionItem';
import { Spinner } from '../common/Button';
import { ChevronLeft } from 'lucide-react';

export function SubjectSidebar() {
  const { subjectId, videoId } = useParams();
  const { tree, loading, error } = useSidebarStore();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6 text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!tree) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link
          to="/"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to subjects
        </Link>
        <h2 className="font-semibold text-gray-900">{tree.title}</h2>
      </div>

      {/* Sections */}
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
        {tree.sections.map((section, index) => (
          <SectionItem
            key={section.id}
            section={section}
            subjectId={subjectId}
            currentVideoId={videoId}
            isLast={index === tree.sections.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
