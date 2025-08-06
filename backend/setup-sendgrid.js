#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 SendGrid Setup Script for TaskPilot\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating new .env file...');
}

// Function to get user input
const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Main setup function
const setupSendGrid = async () => {
  try {
    console.log('\n📧 SendGrid Configuration\n');
    
    const sendgridApiKey = await question('Enter your SendGrid API Key: ');
    const fromEmail = await question('Enter your verified sender email: ');
    const frontendUrl = await question('Enter your frontend URL (default: http://localhost:3000): ') || 'http://localhost:3000';
    
    // Get existing environment variables
    let envContent = '';
    if (envExists) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Parse existing variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    // Update with new values
    envVars.SENDGRID_API_KEY = sendgridApiKey;
    envVars.EMAIL_SERVICE_TYPE = 'sendgrid';
    envVars.FROM_EMAIL = fromEmail;
    envVars.FRONTEND_URL = frontendUrl;
    
    // Ensure other required variables exist
    if (!envVars.MONGODB_URI) {
      const mongoUri = await question('Enter your MongoDB connection string: ');
      envVars.MONGODB_URI = mongoUri;
    }
    
    if (!envVars.JWT_SECRET) {
      const jwtSecret = await question('Enter your JWT secret key: ');
      envVars.JWT_SECRET = jwtSecret;
    }
    
    if (!envVars.PORT) {
      envVars.PORT = '5000';
    }
    
    if (!envVars.NODE_ENV) {
      envVars.NODE_ENV = 'development';
    }
    
    // Write to .env file
    const newEnvContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(envPath, newEnvContent);
    
    console.log('\n✅ SendGrid configuration completed!');
    console.log('\n📋 Configuration Summary:');
    console.log(`   API Key: ${sendgridApiKey.substring(0, 10)}...`);
    console.log(`   From Email: ${fromEmail}`);
    console.log(`   Frontend URL: ${frontendUrl}`);
    console.log(`   Service Type: sendgrid`);
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Test email functionality using the test component');
    console.log('3. Check SendGrid dashboard for email delivery');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
};

// Run setup
setupSendGrid(); 