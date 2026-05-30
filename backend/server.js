const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TaskFlow API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});