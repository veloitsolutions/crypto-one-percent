
const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../Middlewares/authMiddleware');
const { createTask, getTasks, completeTask, deleteTask } = require('../Controllers/taskController');

// User routes
router.get('/', auth, getTasks);
router.post('/complete/:taskId', auth, completeTask);

// Admin routes
router.post('/', auth, isAdmin, createTask);
router.delete('/:taskId', auth, isAdmin, deleteTask);

module.exports = router;
