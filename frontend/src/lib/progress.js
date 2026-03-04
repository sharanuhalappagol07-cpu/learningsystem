import apiClient from './apiClient';

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Progress API
export const progressApi = {
  async getSubjectProgress(subjectId) {
    const response = await apiClient.get(`/api/progress/subjects/${subjectId}`);
    return response.data;
  },

  async getVideoProgress(videoId) {
    const response = await apiClient.get(`/api/progress/videos/${videoId}`);
    return response.data;
  },

  async updateVideoProgress(videoId, data) {
    const response = await apiClient.post(`/api/progress/videos/${videoId}`, data);
    return response.data;
  },
};

// Debounced progress update (5 seconds)
export const debouncedUpdateProgress = debounce(async (videoId, position, isCompleted = false) => {
  try {
    await progressApi.updateVideoProgress(videoId, {
      last_position_seconds: Math.floor(position),
      is_completed: isCompleted,
    });
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
}, 5000);
