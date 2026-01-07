const express = require('express');
const upload = require('../config/multer-config');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Upload single image
router.post('/single', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Upload multiple images
router.post('/multiple', protect, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        res.json({
            success: true,
            imageUrls: imageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;