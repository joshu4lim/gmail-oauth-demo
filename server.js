// Main server using Node.js
const express = require('express');
const app = express();
const port = 3000;

// Serve files inside public/
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/redirect', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'redirect.html');
    res.sendFile(filePath);
});

app.post('/redirect', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'redirect.html');
    console.log('Signing in');

    // VALIDATE TOKENS

    res.redirect('/redirect');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});