# 📧 SendGrid Email Setup Guide

## Step 1: SendGrid Account Setup

### 1.1 Create SendGrid Account
- Go to [sendgrid.com](https://sendgrid.com)
- Sign up for a free account (100 emails/day)
- Verify your email address

### 1.2 Get API Key
- Login to SendGrid dashboard
- Go to Settings → API Keys
- Click "Create API Key"
- Choose "Full Access" or "Restricted Access" (Mail Send)
- Copy the API key (you'll only see it once!)

### 1.3 Verify Sender Email
- Go to Settings → Sender Authentication
- Verify your sender email address
- This will be your FROM_EMAIL

## Step 2: Environment Variables

Create a `.env` file in your backend directory with these variables:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_SERVICE_TYPE=sendgrid
FROM_EMAIL=your_verified_sender@yourdomain.com
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Step 3: Enhanced Email Service

Your email service is already configured for SendGrid! Here's what's included:

### Current Features:
- ✅ Password reset emails
- ✅ Password reset success emails
- ✅ Professional HTML templates
- ✅ SendGrid SMTP configuration

### Available Email Functions:
```javascript
// Password reset email
sendPasswordResetEmail(email, resetToken, resetUrl)

// Password reset success email
sendPasswordResetSuccessEmail(email)
```

## Step 4: Testing SendGrid

### 4.1 Test Email Function
Add this to your emailService.js for testing:

```javascript
// Test email function
const sendTestEmail = async (email) => {
  try {
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: '🧪 Test Email - TaskPilot',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your TaskPilot application.</p>
        <p>If you receive this, SendGrid is working correctly!</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
};
```

### 4.2 Test Route
Add this route to test emails:

```javascript
// In your routes file
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    const success = await sendTestEmail(email);
    
    if (success) {
      res.json({ message: 'Test email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send test email' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Step 5: Additional Email Templates

### 5.1 Welcome Email Template
```javascript
const getWelcomeEmailTemplate = (userName) => `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to TaskPilot</title>
</head>
<body>
    <h1>Welcome ${userName}!</h1>
    <p>Thank you for joining TaskPilot. Start managing your projects efficiently!</p>
</body>
</html>
`;
```

### 5.2 Project Assignment Email
```javascript
const getProjectAssignmentTemplate = (userName, projectName) => `
<!DOCTYPE html>
<html>
<head>
    <title>New Project Assignment</title>
</head>
<body>
    <h1>New Project Assignment</h1>
    <p>Hello ${userName},</p>
    <p>You have been assigned to project: <strong>${projectName}</strong></p>
</body>
</html>
`;
```

## Step 6: Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error:**
   - Check your SENDGRID_API_KEY in .env
   - Ensure the API key has "Mail Send" permissions

2. **"Sender not verified" Error:**
   - Verify your sender email in SendGrid dashboard
   - Use the verified email as FROM_EMAIL

3. **"Rate limit exceeded" Error:**
   - Free tier allows 100 emails/day
   - Upgrade to paid plan for more emails

4. **"Authentication failed" Error:**
   - Check if EMAIL_SERVICE_TYPE=sendgrid
   - Verify all environment variables are set

### Debug Commands:
```bash
# Check if environment variables are loaded
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);
console.log('EMAIL_SERVICE_TYPE:', process.env.EMAIL_SERVICE_TYPE);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
```

## Step 7: Production Deployment

### 7.1 Environment Variables in Production:
- Set all environment variables in your hosting platform
- Never commit .env files to version control
- Use different API keys for development and production

### 7.2 SendGrid Best Practices:
- Use verified sender domains for better deliverability
- Monitor email analytics in SendGrid dashboard
- Set up webhooks for email events (optional)
- Use email templates for consistency

## Step 8: Email Analytics

### 8.1 Monitor in SendGrid Dashboard:
- Email delivery rates
- Open rates
- Click rates
- Bounce rates
- Spam reports

### 8.2 Webhook Setup (Optional):
- Go to Settings → Mail Settings → Event Webhook
- Add your webhook URL
- Receive real-time email events

## Success Checklist:

- [ ] SendGrid account created
- [ ] API key generated and saved
- [ ] Sender email verified
- [ ] Environment variables configured
- [ ] Test email sent successfully
- [ ] Password reset emails working
- [ ] Production environment variables set
- [ ] Email analytics monitored

## Support Resources:

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference/)
- [Email Template Examples](https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail)
- [SendGrid Support](https://support.sendgrid.com/)

---

**Note:** Your email service is already configured for SendGrid! Just follow steps 1-2 to set up your account and environment variables, then test with step 4. 