const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: 'Invalid JSON'
    };
  }

  const {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,      // true (for TLS/SSL), otherwise false
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
      body: JSON.stringify({ message: "Email sent successfully" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email: " + err.message })
    };
  }
}
