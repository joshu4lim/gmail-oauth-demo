// Main server using Node.js
// Reference: https://developers.google.com/identity/protocols/oauth2/web-server
require('dotenv').config();     // For env
const {google} = require('googleapis');
const express = require('express');
const app = express();

const port = 3000;

// Google OAuth2 Setup - like a bridge to Google's login system
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/redirect'
);

// Serve files inside public/
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

// GET request for redirect.html
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
        res.status(500).send('OAuth error');
    }

    const filePath = path.join(__dirname, 'public', 'redirect.html');
    res.sendFile(filePath);
});    

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});