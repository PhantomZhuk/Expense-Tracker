import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import users from './routes/users';
import cookieParser = require('cookie-parser');

dotenv.config();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI!)
    .then(() => {
        console.log('✅ MongoDB is connected');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
    })

const app = express()
    .use(cors(
        {
            origin: 'http://localhost:5174',
            credentials: true
        }
    ))
    .use(express.json())
    .use(cookieParser())
    .use(express.urlencoded({ extended: true }))
    .get('/', (req, res) => {
        res.send('🚀 API is running!');
    })
    .use('/api', users)
    .listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
