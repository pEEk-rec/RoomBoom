const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'RoomBoom API is running', timestamp: new Date() });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/discovery', require('./routes/discovery'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/upload', require('./routes/upload'));


// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 RoomBoom Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});
