import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express()
    .use(cors())
    .use(express.json())
    .get('/', (req, res) => {
        res.send('🚀 API is running!');
    }).listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
