const express = require('express');
const router = express.Router();
const { sendTestEmail } = require('../services/emailService');

// Test email route
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('Attempting to send test email to:', email);
    
    const success = await sendTestEmail(email);
    
    if (success) {
      res.json({ 
        message: 'Test email sent successfully!',
        email: email,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send test email',
        details: 'Check your SendGrid configuration and environment variables'
      });
    }
  } catch (error) {
    console.error('Test email route error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get email configuration status
router.get('/email-status', (req, res) => {
  try {
    const config = {
      emailServiceType: process.env.EMAIL_SERVICE_TYPE || 'not set',
      fromEmail: process.env.FROM_EMAIL || 'not set',
      sendgridApiKey: process.env.SENDGRID_API_KEY ? 'configured' : 'not set',
      frontendUrl: process.env.FRONTEND_URL || 'not set'
    };

    res.json({
      message: 'Email configuration status',
      config: config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get email status',
      details: error.message 
    });
  }
});

module.exports = router; 