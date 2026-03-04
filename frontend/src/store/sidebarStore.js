import { create } from 'zustand';
import { subjectsApi } from '../lib/subjects';

export const useSidebarStore = create((set, get) => ({
  tree: null,
  loading: false,
  error: null,
  currentSubjectId: null,

  fetchTree: async (subjectId) => {
    set({ loading: true, error: null, currentSubjectId: subjectId });
    try {
      const tree = await subjectsApi.getSubjectTree(subjectId);
      set({ tree, loading: false });
      return tree;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to load subject tree',
        loading: false,
      });
      return null;
    }
  },

  markVideoCompleted: (videoId) => {
    const { tree } = get();
    if (!tree) return;

    const updatedSections = tree.sections.map((section) => ({
      ...section,
      videos: section.videos.map((video) =>
        video.id === videoId ? { ...video, is_completed: true, locked: false } : video
      ),
    }));

    // Update locking for subsequent videos
    let foundCompleted = false;
    for (const section of updatedSections) {
      for (const video of section.videos) {
        if (foundCompleted && video.locked) {
          video.locked = false;
          video.unlock_reason = null;
          foundCompleted = false;
          break;
        }
        if (video.id === videoId) {
          foundCompleted = true;
        }
      }
      if (foundCompleted) break;
    }

    set({
      tree: { ...tree, sections: updatedSections },
    });
  },

  clearTree: () => set({ tree: null, currentSubjectId: null }),
}));
