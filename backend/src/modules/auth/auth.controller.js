const { validationResult } = require('express-validator');
const authService = require('./auth.service');
const { refreshCookieOptions } = require('../../config/security');

class AuthController {
  async register(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }
      
      const { email, password, name } = req.body;
      
      const result = await authService.register({ email, password, name });
      
      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
      
      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }
  
  async login(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }
      
      const { email, password } = req.body;
      
      const result = await authService.login({ email, password });
      
      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
      
      res.json({
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }
  
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      const result = await authService.refresh(refreshToken);
      
      res.json({
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }
  
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      await authService.logout(refreshToken);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken', {
        ...refreshCookieOptions,
        maxAge: 0
      });
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
