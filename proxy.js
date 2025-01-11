const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');  

const app = express();

app.use(cors()); 

app.use(express.json());

app.use('/api', async (req, res) => {
    try {
        const apiUrl = `https://suitmedia-backend.suitdev.com${req.originalUrl}`;
        const response = await fetch(apiUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running at http://127.0.0.1:${PORT}`);
});
