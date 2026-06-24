const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve uploaded images from the uploads folder
// On Render, you'd replace this with actual image hosting (e.g. Cloudinary, S3)
// For local dev, images are served from /uploads
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, service, message } = req.body;

  if (!firstName || !lastName || !email || !service || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Log the enquiry (replace with email sending via SendGrid/Nodemailer in production)
  const enquiry = {
    timestamp: new Date().toISOString(),
    name: `${firstName} ${lastName}`,
    email,
    service,
    message
  };
  console.log('New enquiry received:', enquiry);

  // In production, send an email here:
  // await sendEmail({ to: 'hello@drnedu.com', ...enquiry })

  res.json({ success: true, message: 'Enquiry received. Dr. Arize will be in touch within 24 hours.' });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all → serve index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dr. Arize website running on http://localhost:${PORT}`);
});
