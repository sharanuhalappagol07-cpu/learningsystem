const express = require('express');
const router = express.Router();
const progressController = require('./progress.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// GET /api/progress/subjects/:subjectId (auth required)
router.get('/subjects/:subjectId', authMiddleware, progressController.getSubjectProgress);

// GET /api/progress/videos/:videoId (auth required)
router.get('/videos/:videoId', authMiddleware, progressController.getVideoProgress);

// POST /api/progress/videos/:videoId (auth required)
router.post('/videos/:videoId', authMiddleware, progressController.updateVideoProgress);

module.exports = router;
