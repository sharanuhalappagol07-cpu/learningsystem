const progressRepository = require('./progress.repository');
const videoRepository = require('../videos/video.repository');

class ProgressService {
  async getVideoProgress(userId, videoId) {
    const progress = await progressRepository.findByUserAndVideo(userId, videoId);
    
    if (!progress) {
      return {
        last_position_seconds: 0,
        is_completed: false
      };
    }
    
    return {
      last_position_seconds: progress.last_position_seconds,
      is_completed: progress.is_completed
    };
  }
  
  async getSubjectProgress(userId, subjectId) {
    return progressRepository.findByUserAndSubject(userId, subjectId);
  }
  
  async updateProgress(userId, videoId, data) {
    // Get video to validate and cap position
    const video = await videoRepository.findById(videoId);
    
    if (!video) {
      const error = new Error('Video not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Cap position between 0 and duration
    let position = data.last_position_seconds || 0;
    
    if (position < 0) {
      position = 0;
    }
    
    if (video.duration_seconds && position > video.duration_seconds) {
      position = video.duration_seconds;
    }
    
    // If marking as completed, cap at duration
    if (data.is_completed && video.duration_seconds) {
      position = video.duration_seconds;
    }
    
    return progressRepository.upsert(userId, videoId, {
      last_position_seconds: position,
      is_completed: data.is_completed
    });
  }
}

module.exports = new ProgressService();
