const express = require('express');
const app = express();
const shortener = require('./shortener');

app.use(express.json());

// Routes
app.post('/shorturls', shortener);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
