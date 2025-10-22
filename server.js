// Main server using Node.js
const express = require('express');
const app = express();
const port = 3000;

// Serve files inside public/
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/redirect.html', (req, res) => {
    res.send('Redirect');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});