
const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../Middlewares/authMiddleware');
const { getDashboardImages, updateDashboardImages } = require('../Controllers/settingsController');

// Public/User routes
router.get('/images', getDashboardImages);

// Admin routes
router.post('/images', auth, isAdmin, updateDashboardImages);

module.exports = router;
