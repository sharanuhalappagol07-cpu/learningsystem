const db = require('../../config/db');

class ProgressRepository {
  async findByUserAndVideo(userId, videoId) {
    return db('video_progress')
      .where({ user_id: userId, video_id: videoId })
      .first();
  }
  
  async findByUserAndSubject(userId, subjectId) {
    // Get all videos for subject
    const videos = await db('videos')
      .join('sections', 'videos.section_id', 'sections.id')
      .where('sections.subject_id', subjectId)
      .select('videos.id');
    
    const videoIds = videos.map(v => v.id);
    
    if (videoIds.length === 0) {
      return {
        total_videos: 0,
        completed_videos: 0,
        percent_complete: 0,
        last_video_id: null,
        last_position_seconds: 0
      };
    }
    
    // Get progress for all videos
    const progress = await db('video_progress')
      .where({ user_id: userId })
      .whereIn('video_id', videoIds);
    
    // Calculate stats
    const totalVideos = videoIds.length;
    const completedVideos = progress.filter(p => p.is_completed).length;
    const percentComplete = Math.round((completedVideos / totalVideos) * 100);
    
    // Find last accessed video (most recently updated)
    const sortedProgress = progress
      .filter(p => p.last_position_seconds > 0)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    const lastVideo = sortedProgress[0];
    
    return {
      total_videos: totalVideos,
      completed_videos: completedVideos,
      percent_complete: percentComplete,
      last_video_id: lastVideo ? lastVideo.video_id : null,
      last_position_seconds: lastVideo ? lastVideo.last_position_seconds : 0
    };
  }
  
  async upsert(userId, videoId, data) {
    const existing = await this.findByUserAndVideo(userId, videoId);
    
    if (existing) {
      // Update
      const updates = {
        last_position_seconds: data.last_position_seconds,
        updated_at: new Date()
      };
      
      if (data.is_completed !== undefined) {
        updates.is_completed = data.is_completed;
        if (data.is_completed && !existing.is_completed) {
          updates.completed_at = new Date();
        }
      }
      
      await db('video_progress')
        .where({ id: existing.id })
        .update(updates);
      
      return this.findByUserAndVideo(userId, videoId);
    } else {
      // Insert
      const insertData = {
        user_id: userId,
        video_id: videoId,
        last_position_seconds: data.last_position_seconds || 0,
        is_completed: data.is_completed || false,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      if (data.is_completed) {
        insertData.completed_at = new Date();
      }
      
      const [id] = await db('video_progress').insert(insertData);
      
      return this.findByUserAndVideo(userId, videoId);
    }
  }
  
  async markCompleted(userId, videoId) {
    return this.upsert(userId, videoId, {
      last_position_seconds: 0,
      is_completed: true
    });
  }
}

module.exports = new ProgressRepository();
