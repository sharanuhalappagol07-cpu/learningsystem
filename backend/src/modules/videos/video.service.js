const videoRepository = require('./video.repository');
const subjectRepository = require('../subjects/subject.repository');
const { 
  flattenVideoOrder, 
  getPreviousVideo, 
  getNextVideo,
  isVideoUnlocked 
} = require('../../utils/ordering');

class VideoService {
  async getVideoById(videoId, userId) {
    // Get video with details
    const video = await videoRepository.findByIdWithDetails(videoId);
    
    if (!video) {
      const error = new Error('Video not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Get subject tree for ordering context
    const tree = await subjectRepository.findTreeByIdWithProgress(video.subject_id, userId);
    
    // Get completed video IDs
    const completedVideoIds = new Set();
    for (const section of tree.sections) {
      for (const v of section.videos) {
        if (v.is_completed) {
          completedVideoIds.add(v.id);
        }
      }
    }
    
    // Flatten videos for ordering
    const flattened = flattenVideoOrder(tree.sections);
    
    // Get previous and next videos
    const previousVideo = getPreviousVideo(flattened, videoId);
    const nextVideo = getNextVideo(flattened, videoId);
    
    // Check if video is locked
    const { locked, unlockReason } = isVideoUnlocked(flattened, videoId, completedVideoIds);
    
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtube_url: video.youtube_url,
      order_index: video.order_index,
      duration_seconds: video.duration_seconds,
      section_id: video.section_id,
      section_title: video.section_title,
      subject_id: video.subject_id,
      subject_title: video.subject_title,
      previous_video_id: previousVideo ? previousVideo.id : null,
      next_video_id: nextVideo ? nextVideo.id : null,
      locked,
      unlock_reason: unlockReason
    };
  }
  
  async createVideo(videoData) {
    return videoRepository.create(videoData);
  }
  
  async updateVideo(id, updates) {
    return videoRepository.update(id, updates);
  }
  
  async deleteVideo(id) {
    return videoRepository.delete(id);
  }
}

module.exports = new VideoService();
