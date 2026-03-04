const db = require('../../config/db');
const userModel = require('../users/user.model');
const { hashPassword, comparePassword } = require('../../utils/password');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  generateTokenHash 
} = require('../../utils/jwt');
const env = require('../../config/env');

class AuthService {
  async register({ email, password, name }) {
    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.name = 'ConflictError';
      throw error;
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await userModel.create({
      email,
      password_hash: passwordHash,
      name
    });
    
    // Generate tokens
    const tokens = await this.generateTokens(user);
    
    return {
      user,
      ...tokens
    };
  }
  
  async login({ email, password }) {
    // Find user with password
    const user = await userModel.findByEmailWithPassword(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    // Generate tokens
    const tokens = await this.generateTokens(user);
    
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      ...tokens
    };
  }
  
  async refresh(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token required');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    // Hash the token for lookup
    const tokenHash = generateTokenHash(refreshToken);
    
    // Find token in database
    const tokenRecord = await db('refresh_tokens')
      .where({ token_hash })
      .whereNull('revoked_at')
      .where('expires_at', '>', new Date())
      .first();
    
    if (!tokenRecord) {
      const error = new Error('Invalid or expired refresh token');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    // Get user
    const user = await userModel.findById(tokenRecord.user_id);
    if (!user) {
      const error = new Error('User not found');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });
    
    return { accessToken };
  }
  
  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }
    
    // Hash the token for lookup
    const tokenHash = generateTokenHash(refreshToken);
    
    // Revoke token
    await db('refresh_tokens')
      .where({ token_hash })
      .update({ revoked_at: new Date() });
  }
  
  async generateTokens(user) {
    // Generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });
    
    // Generate refresh token
    const refreshToken = generateRefreshToken();
    const tokenHash = generateTokenHash(refreshToken);
    
    // Calculate expiration
    const expiresIn = env.jwt.refreshExpiresIn;
    const expiresAt = new Date();
    if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn);
      expiresAt.setDate(expiresAt.getDate() + days);
    }
    
    // Store refresh token in database
    await db('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date()
    });
    
    return {
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();
