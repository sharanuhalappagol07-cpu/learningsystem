const express = require('express');
const router = express.Router();
const healthController = require('./health.controller');

// GET /api/health
router.get('/', healthController.check);

module.exports = router;
