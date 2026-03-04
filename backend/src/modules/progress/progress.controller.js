const progressService = require('./progress.service');

class ProgressController {
  async getSubjectProgress(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;
      
      const progress = await progressService.getSubjectProgress(userId, subjectId);
      
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
  
  async getVideoProgress(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      
      const progress = await progressService.getVideoProgress(userId, videoId);
      
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
  
  async updateVideoProgress(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      const { last_position_seconds, is_completed } = req.body;
      
      const progress = await progressService.updateProgress(userId, videoId, {
        last_position_seconds,
        is_completed
      });
      
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProgressController();
