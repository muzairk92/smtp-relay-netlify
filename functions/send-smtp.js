const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Or specify your domain: 'http://localhost:5173'
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed'
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: 'Invalid JSON'
    };
  }

  const {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,
    from,
    to,
    cc,
    subject,
    html
  } = data;

  let transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from,
      to,
      cc,
      subject,
      html
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Email sent successfully" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to send email: " + err.message })
    };
  }
};
