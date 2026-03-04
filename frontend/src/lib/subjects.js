import apiClient from './apiClient';

export const subjectsApi = {
  async getSubjects(params = {}) {
    const { page = 1, pageSize = 10, q } = params;
    const queryParams = new URLSearchParams({ page, pageSize });
    if (q) queryParams.append('q', q);
    
    const response = await apiClient.get(`/api/subjects?${queryParams}`);
    return response.data;
  },

  async getSubject(subjectId) {
    const response = await apiClient.get(`/api/subjects/${subjectId}`);
    return response.data;
  },

  async getSubjectTree(subjectId) {
    const response = await apiClient.get(`/api/subjects/${subjectId}/tree`);
    return response.data;
  },

  async getFirstVideo(subjectId) {
    const response = await apiClient.get(`/api/subjects/${subjectId}/first-video`);
    return response.data;
  },
};

export const videosApi = {
  async getVideo(videoId) {
    const response = await apiClient.get(`/api/videos/${videoId}`);
    return response.data;
  },
};
