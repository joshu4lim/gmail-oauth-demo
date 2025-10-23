// Main server using Node.js
// Reference: https://developers.google.com/identity/protocols/oauth2/web-server
require('dotenv').config();     // For env
const {google} = require('googleapis');
const express = require('express');
const app = express();

const port = 3000;

// Access token for API
let savedTokens = null;

// Google OAuth2 Setup - like a bridge to Google's login system
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Serve files inside public/
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

// Enable JSON parsing
app.use(express.json());

// For login authorization
app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        prompt: 'consent',   // Show consent screen everytime refreshed
        scope: [
            'https://www.googleapis.com/auth/gmail.send']   // permission
    });
    // console.log('authURL: ', authUrl);
    res.redirect(authUrl); // send user to Google login
});

// GET request for redirect route, serves redirect.html
app.get('/redirect', async (req, res) => {
    // Get temporary code from URL
    const code = req.query.code;
    const error = req.query.error;

    // Check for permissions
    if (error) {
        return res.status(401).json({ message: 'User Permissions Needed.', error: error.message });
    }

    // Check if we receive authorization code
    if (!code) {
        console.log('No code found.');
    } else {
        console.log('Authorization code received.', code);
    }

    // Exchange and get access token
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Tokens received:', tokens);
        oauth2Client.setCredentials(tokens);
        savedTokens = tokens;
    } catch (err) {
        console.error('Error exchanging code:', err);
        // If refreshed, go back to main page
        res.redirect('/')
    }

    const filePath = path.join(__dirname, 'public', 'redirect.html');
    res.sendFile(filePath);
});    

// Send email using Gmail API
// References: 
// https://developers.google.com/workspace/gmail/api/quickstart/nodejs
// https://developers.google.com/workspace/gmail/api/reference/rest
app.post('/send', async (req, res) => {
    if (!savedTokens) {
        return res.status(401).send('User not authenticated. Please log in again.');
    } else {
        console.log('Saved token: ', savedTokens)
    }

    // Use stored credentials
    oauth2Client.setCredentials(savedTokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const { to, subject, message } = req.body;

    // Build email 
    const lines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        message
    ];

    // Needs to be base64url-encoded
    const raw = Buffer.from(lines.join('\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Try sending email
    try {
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw }
        });
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});