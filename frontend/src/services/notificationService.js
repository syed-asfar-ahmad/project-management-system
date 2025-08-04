import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const notificationService = {
  // Get all notifications for the user
  getNotifications: async (page = 1, limit = 10, unreadOnly = false) => {
    try {
      const response = await axios.get(
        `${API}/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await axios.get(
        `${API}/notifications/unread-count`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(
        `${API}/notifications/${notificationId}/read`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await axios.patch(
        `${API}/notifications/mark-all-read`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(
        `${API}/notifications/${notificationId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}; 