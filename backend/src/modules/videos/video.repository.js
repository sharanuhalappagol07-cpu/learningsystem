const db = require('../../config/db');

class VideoRepository {
  async findById(id) {
    return db('videos')
      .where({ id })
      .first();
  }
  
  async findByIdWithDetails(id) {
    const video = await db('videos')
      .where('videos.id', id)
      .join('sections', 'videos.section_id', 'sections.id')
      .join('subjects', 'sections.subject_id', 'subjects.id')
      .select(
        'videos.id',
        'videos.title',
        'videos.description',
        'videos.youtube_url',
        'videos.order_index',
        'videos.duration_seconds',
        'videos.section_id',
        'sections.title as section_title',
        'sections.subject_id',
        'subjects.title as subject_title'
      )
      .first();
    
    return video;
  }
  
  async findBySectionId(sectionId) {
    return db('videos')
      .where({ section_id: sectionId })
      .orderBy('order_index');
  }
  
  async findAllBySubjectId(subjectId) {
    return db('videos')
      .join('sections', 'videos.section_id', 'sections.id')
      .where('sections.subject_id', subjectId)
      .select('videos.*', 'sections.order_index as section_order_index')
      .orderBy('sections.order_index')
      .orderBy('videos.order_index');
  }
  
  async create(videoData) {
    const [id] = await db('videos').insert({
      section_id: videoData.section_id,
      title: videoData.title,
      description: videoData.description,
      youtube_url: videoData.youtube_url,
      order_index: videoData.order_index,
      duration_seconds: videoData.duration_seconds,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return this.findById(id);
  }
  
  async update(id, updates) {
    await db('videos')
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date()
      });
    
    return this.findById(id);
  }
  
  async delete(id) {
    return db('videos').where({ id }).del();
  }
}

module.exports = new VideoRepository();
