const db = require('../../config/db');

class UserModel {
  async findById(id) {
    const user = await db('users')
      .where({ id })
      .select('id', 'email', 'name', 'created_at', 'updated_at')
      .first();
    return user;
  }
  
  async findByEmail(email) {
    const user = await db('users')
      .where({ email })
      .first();
    return user;
  }
  
  async findByEmailWithPassword(email) {
    const user = await db('users')
      .where({ email })
      .first();
    return user;
  }
  
  async create(userData) {
    const [id] = await db('users').insert({
      email: userData.email,
      password_hash: userData.password_hash,
      name: userData.name,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return this.findById(id);
  }
  
  async update(id, updates) {
    await db('users')
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date()
      });
    
    return this.findById(id);
  }
}

module.exports = new UserModel();
