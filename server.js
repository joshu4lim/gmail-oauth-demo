// Main server using Node.js
const express = require('express');
const app = express();
const port = 3000;

// Serve files inside public/
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

// GET request for redirect.html
app.get('/redirect', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'redirect.html');
    res.sendFile(filePath);
});

// auth object
// const oauth2Client = new google.auth.OAuth2(
//   YOUR_CLIENT_ID,
//   YOUR_CLIENT_SECRET,
//   YOUR_REDIRECT_URL
// );

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});