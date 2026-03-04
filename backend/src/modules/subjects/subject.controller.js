const subjectService = require('./subject.service');

class SubjectController {
  async getSubjects(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const search = req.query.q || null;
      
      const result = await subjectService.getSubjects({ page, pageSize, search });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  
  async getSubjectById(req, res, next) {
    try {
      const { subjectId } = req.params;
      
      const subject = await subjectService.getSubjectById(subjectId);
      
      if (!subject) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Subject not found'
        });
      }
      
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }
  
  async getSubjectTree(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;
      
      const tree = await subjectService.getSubjectTreeWithLocking(subjectId, userId);
      
      res.json(tree);
    } catch (error) {
      next(error);
    }
  }
  
  async getFirstVideo(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;
      
      const result = await subjectService.getFirstVideo(subjectId, userId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();
