const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  // Option 1: Gmail (most common)
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  
  // Option 2: Outlook/Hotmail
  outlook: {
    service: 'outlook',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  
  // Option 3: Custom SMTP (for any email provider)
  custom: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },

  // Option 4: SendGrid (Professional Email Service)
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey', // This is always 'apikey'
      pass: process.env.SENDGRID_API_KEY
    }
  }
};

// Get email service type from environment
const emailServiceType = process.env.EMAIL_SERVICE_TYPE || 'sendgrid';

// Create transporter based on configuration
let transporter;
try {
  transporter = nodemailer.createTransport(emailConfig[emailServiceType]);
} catch (error) {
  console.error('Email service configuration error:', error);
  transporter = null;
}

// Professional Email Template for Password Reset
const getPasswordResetEmailTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - TaskPilot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .description {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.6;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
        }
        
        .link-section {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .link-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .reset-link {
            font-size: 14px;
            color: #16a34a;
            word-break: break-all;
            background-color: #f0fdf4;
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #16a34a;
            font-family: 'Courier New', monospace;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .security-note {
            font-size: 12px;
            color: #9ca3af;
            font-style: italic;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚀 TaskPilot</div>
            <div class="tagline">Project Management System</div>
        </div>
        
        <div class="content">
            <h1 class="title">Reset Your Password</h1>
            <p class="description">
                We received a request to reset your password for your TaskPilot account. 
                Click the button below to create a new password.
            </p>
            
            <div class="button-container">
                <a href="${resetUrl}" class="reset-button">
                    🔐 Reset Password
                </a>
            </div>
            
            <div class="link-section">
                <p class="link-text">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <div class="reset-link">${resetUrl}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
                </p>
                <p class="footer-text">
                    If you didn't request this password reset, please ignore this email.
                </p>
                <p class="security-note">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Professional Email Template for Password Reset Success
const getPasswordResetSuccessEmailTemplate = (loginUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful - TaskPilot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .success-icon {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .success-icon span {
            font-size: 48px;
        }
        
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .description {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.6;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .login-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }
        
        .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .security-note {
            font-size: 12px;
            color: #9ca3af;
            font-style: italic;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚀 TaskPilot</div>
            <div class="tagline">Project Management System</div>
        </div>
        
        <div class="content">
            <div class="success-icon">
                <span>✅</span>
            </div>
            
            <h1 class="title">Password Reset Successful!</h1>
            <p class="description">
                Your password has been successfully reset. You can now log in to your TaskPilot account 
                with your new password and continue managing your projects.
            </p>
            
            <div class="button-container">
                <a href="${loginUrl}" class="login-button">
                    🚀 Login to TaskPilot
                </a>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>🔒 Security Notice:</strong> If you didn't reset your password, 
                    please contact our support team immediately.
                </p>
                <p class="security-note">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@sendgrid.net',
      to: email,
      subject: '🔐 Reset Your Password - TaskPilot',
      html: getPasswordResetEmailTemplate(resetUrl)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Send password reset success email
const sendPasswordResetSuccessEmail = async (email) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@sendgrid.net',
      to: email,
      subject: '✅ Password Reset Successful - TaskPilot',
      html: getPasswordResetSuccessEmailTemplate(loginUrl)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    return false;
  }
};

// Test email function
const sendTestEmail = async (email) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@sendgrid.net',
      to: email,
      subject: '🧪 Test Email - TaskPilot',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Email - TaskPilot</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .success-icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                }
                h1 {
                    color: #1f2937;
                    text-align: center;
                    margin-bottom: 20px;
                }
                p {
                    color: #6b7280;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .highlight {
                    background-color: #f0fdf4;
                    border-left: 4px solid #16a34a;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="success-icon">🧪</div>
                    <h2>Test Email Successful!</h2>
                </div>
                
                <h1>SendGrid is Working! 🎉</h1>
                <p>This is a test email from your TaskPilot application.</p>
                <p>If you receive this email, your SendGrid configuration is working correctly!</p>
                
                <div class="highlight">
                    <strong>✅ Email Service:</strong> SendGrid<br>
                    <strong>✅ SMTP Configuration:</strong> Working<br>
                    <strong>✅ API Key:</strong> Valid<br>
                    <strong>✅ Sender Email:</strong> Verified
                </div>
                
                <p>You can now send emails from your TaskPilot application!</p>
            </div>
        </body>
        </html>
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

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendTestEmail
}; 