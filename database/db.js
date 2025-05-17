const mongoose = require('mongoose');
require('dotenv').config();
const {MONGODB_URI}  = require('../config/env');
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection failed', err);
        process.exit(1);
    }
}

module.exports = connectDB;
