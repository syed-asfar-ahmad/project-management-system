import React, { useState } from 'react';

const EmailTestComponent = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  const handleTestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/email-test/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail('');
      } else {
        setError(data.error || 'Failed to send test email');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const checkEmailStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/email-test/email-status');
      const data = await response.json();
      setEmailStatus(data);
    } catch (err) {
      setError('Failed to check email status');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🧪 Email Test Tool
      </h2>

      {/* Email Status Check */}
      <div className="mb-6">
        <button
          onClick={checkEmailStatus}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Check Email Configuration
        </button>
        
        {emailStatus && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Configuration Status:</h3>
            <div className="text-sm space-y-1">
              <div>Service Type: <span className="font-mono">{emailStatus.config.emailServiceType}</span></div>
              <div>From Email: <span className="font-mono">{emailStatus.config.fromEmail}</span></div>
              <div>API Key: <span className="font-mono">{emailStatus.config.sendgridApiKey}</span></div>
              <div>Frontend URL: <span className="font-mono">{emailStatus.config.frontendUrl}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Test Email Form */}
      <form onSubmit={handleTestEmail} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to test"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            loading || !email
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          ❌ {error}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Set up your SendGrid account and get API key</li>
          <li>Configure environment variables in backend/.env</li>
          <li>Verify your sender email in SendGrid</li>
          <li>Test the email functionality</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailTestComponent; 