const db = require('../../config/db');

class SubjectRepository {
  async findAll({ page = 1, pageSize = 10, search = null }) {
    // Build base query for counting
    let countQuery = db('subjects')
      .where({ is_published: true })
      .count('* as count');
    
    // Build query for fetching data
    let dataQuery = db('subjects')
      .where({ is_published: true })
      .select('id', 'title', 'slug', 'description', 'created_at');
    
    if (search) {
      const searchFilter = function() {
        this.where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      };
      countQuery = countQuery.andWhere(searchFilter);
      dataQuery = dataQuery.andWhere(searchFilter);
    }
    
    const totalResult = await countQuery.first();
    const total = totalResult.count;
    
    const subjects = await dataQuery
      .orderBy('created_at', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    
    return {
      subjects,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
  
  async findById(id) {
    return db('subjects')
      .where({ id })
      .select('id', 'title', 'slug', 'description', 'is_published', 'created_at', 'updated_at')
      .first();
  }
  
  async findBySlug(slug) {
    return db('subjects')
      .where({ slug })
      .first();
  }
  
  async findTreeById(subjectId) {
    // Get subject
    const subject = await this.findById(subjectId);
    if (!subject) return null;
    
    // Get sections with videos
    const sections = await db('sections')
      .where({ subject_id: subjectId })
      .select('id', 'title', 'order_index')
      .orderBy('order_index');
    
    // Get videos for each section
    for (const section of sections) {
      section.videos = await db('videos')
        .where({ section_id: section.id })
        .select('id', 'title', 'order_index', 'duration_seconds')
        .orderBy('order_index');
    }
    
    return {
      ...subject,
      sections
    };
  }
  
  async findTreeByIdWithProgress(subjectId, userId) {
    // Get subject
    const subject = await this.findById(subjectId);
    if (!subject) return null;
    
    // Get sections with videos
    const sections = await db('sections')
      .where({ subject_id: subjectId })
      .select('id', 'title', 'order_index')
      .orderBy('order_index');
    
    // Get videos for each section with progress
    for (const section of sections) {
      const videos = await db('videos')
        .where({ section_id: section.id })
        .select('id', 'title', 'order_index', 'duration_seconds')
        .orderBy('order_index');
      
      // Get progress for each video
      for (const video of videos) {
        const progress = await db('video_progress')
          .where({ user_id: userId, video_id: video.id })
          .first();
        
        video.is_completed = progress ? progress.is_completed : false;
      }
      
      section.videos = videos;
    }
    
    return {
      ...subject,
      sections
    };
  }
  
  async create(subjectData) {
    const [id] = await db('subjects').insert({
      title: subjectData.title,
      slug: subjectData.slug,
      description: subjectData.description,
      is_published: subjectData.is_published || false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return this.findById(id);
  }
  
  async update(id, updates) {
    await db('subjects')
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date()
      });
    
    return this.findById(id);
  }
  
  async delete(id) {
    return db('subjects').where({ id }).del();
  }
}

module.exports = new SubjectRepository();
