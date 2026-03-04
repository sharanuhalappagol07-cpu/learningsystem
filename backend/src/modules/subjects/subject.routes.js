const express = require('express');
const router = express.Router();
const subjectController = require('./subject.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// GET /api/subjects (public)
router.get('/', subjectController.getSubjects);

// GET /api/subjects/:subjectId (public)
router.get('/:subjectId', subjectController.getSubjectById);

// GET /api/subjects/:subjectId/tree (auth required)
router.get('/:subjectId/tree', authMiddleware, subjectController.getSubjectTree);

// GET /api/subjects/:subjectId/first-video (auth required)
router.get('/:subjectId/first-video', authMiddleware, subjectController.getFirstVideo);

module.exports = router;
