const db = require('../../config/db');

class SectionRepository {
  async findById(id) {
    return db('sections')
      .where({ id })
      .first();
  }
  
  async findBySubjectId(subjectId) {
    return db('sections')
      .where({ subject_id: subjectId })
      .orderBy('order_index');
  }
  
  async create(sectionData) {
    const [id] = await db('sections').insert({
      subject_id: sectionData.subject_id,
      title: sectionData.title,
      order_index: sectionData.order_index,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return this.findById(id);
  }
  
  async update(id, updates) {
    await db('sections')
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date()
      });
    
    return this.findById(id);
  }
  
  async delete(id) {
    return db('sections').where({ id }).del();
  }
}

module.exports = new SectionRepository();
