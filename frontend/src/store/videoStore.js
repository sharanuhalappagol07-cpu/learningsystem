import { create } from 'zustand';

export const useVideoStore = create((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,

  setCurrentVideo: (videoId, subjectId) =>
    set({
      currentVideoId: videoId,
      subjectId,
      currentTime: 0,
      isCompleted: false,
    }),

  setVideoMeta: (meta) =>
    set({
      nextVideoId: meta.next_video_id,
      prevVideoId: meta.prev_video_id,
      duration: meta.duration_seconds,
    }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setIsCompleted: (isCompleted) => set({ isCompleted }),

  setDuration: (duration) => set({ duration }),

  reset: () =>
    set({
      currentVideoId: null,
      subjectId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null,
    }),
}));
