const subjectRepository = require('./subject.repository');
const { buildSubjectTreeWithLocking, getFirstUnlockedVideo, flattenVideoOrder } = require('../../utils/ordering');

class SubjectService {
  async getSubjects({ page, pageSize, search }) {
    return subjectRepository.findAll({ page, pageSize, search });
  }
  
  async getSubjectById(id) {
    return subjectRepository.findById(id);
  }
  
  async getSubjectTree(subjectId) {
    const tree = await subjectRepository.findTreeById(subjectId);
    if (!tree) {
      const error = new Error('Subject not found');
      error.name = 'NotFoundError';
      throw error;
    }
    return tree;
  }
  
  async getSubjectTreeWithLocking(subjectId, userId) {
    const tree = await subjectRepository.findTreeByIdWithProgress(subjectId, userId);
    if (!tree) {
      const error = new Error('Subject not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Get completed video IDs
    const completedVideoIds = new Set();
    for (const section of tree.sections) {
      for (const video of section.videos) {
        if (video.is_completed) {
          completedVideoIds.add(video.id);
        }
      }
    }
    
    // Build tree with locking
    tree.sections = buildSubjectTreeWithLocking(tree.sections, completedVideoIds);
    
    return tree;
  }
  
  async getFirstVideo(subjectId, userId) {
    const tree = await subjectRepository.findTreeByIdWithProgress(subjectId, userId);
    if (!tree) {
      const error = new Error('Subject not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Get completed video IDs
    const completedVideoIds = new Set();
    for (const section of tree.sections) {
      for (const video of section.videos) {
        if (video.is_completed) {
          completedVideoIds.add(video.id);
        }
      }
    }
    
    // Flatten videos
    const flattened = flattenVideoOrder(tree.sections);
    
    // Get first unlocked video
    const firstUnlocked = getFirstUnlockedVideo(flattened, completedVideoIds);
    
    if (!firstUnlocked) {
      const error = new Error('No videos available in this subject');
      error.name = 'NotFoundError';
      throw error;
    }
    
    return { video_id: firstUnlocked.id };
  }
  
  async createSubject(subjectData) {
    // Generate slug if not provided
    if (!subjectData.slug) {
      subjectData.slug = subjectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    return subjectRepository.create(subjectData);
  }
  
  async updateSubject(id, updates) {
    return subjectRepository.update(id, updates);
  }
  
  async deleteSubject(id) {
    return subjectRepository.delete(id);
  }
}

module.exports = new SubjectService();
