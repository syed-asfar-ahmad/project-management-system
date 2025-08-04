const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Get all notifications for the authenticated user
router.get('/', verifyToken, getUserNotifications);

// Get unread notification count
router.get('/unread-count', verifyToken, getUnreadCount);

// Mark a specific notification as read
router.patch('/:notificationId/read', verifyToken, markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', verifyToken, markAllAsRead);

// Delete a notification
router.delete('/:notificationId', verifyToken, deleteNotification);

module.exports = router; 