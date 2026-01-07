const express = require('express');
const DiscoverySpot = require('../models/DiscoverySpot');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/discovery
// @desc    Get all discovery spots with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { tag, search, limit = 20, page = 1 } = req.query;

        let query = {};

        // Filter by tag
        if (tag) {
            query.tag = tag;
        }

        // Search by text
        if (search) {
            query.$text = { $search: search };
        }

        const spots = await DiscoverySpot.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('createdBy', 'name avatar');

        const total = await DiscoverySpot.countDocuments(query);

        res.json({
            success: true,
            count: spots.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: spots
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/discovery/trending
// @desc    Get trending discovery spots
// @access  Public
router.get('/trending', async (req, res) => {
    try {
        const { limit = 4 } = req.query;

        const spots = await DiscoverySpot.find({ trending: true })
            .sort({ rating: -1, reviewCount: -1 })
            .limit(parseInt(limit))
            .populate('createdBy', 'name avatar');

        res.json({
            success: true,
            count: spots.length,
            data: spots
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/discovery/tags
// @desc    Get all available tags
// @access  Public
router.get('/tags', async (req, res) => {
    try {
        const tags = ['Nature', 'Nightlife', 'Active', 'Chill', 'Food', 'Culture', 'Adventure'];
        const tagColors = {
            'Nature': 'bg-orange-400',
            'Nightlife': 'bg-purple-500',
            'Active': 'bg-blue-400',
            'Chill': 'bg-green-500',
            'Food': 'bg-red-400',
            'Culture': 'bg-yellow-500',
            'Adventure': 'bg-teal-500'
        };

        res.json({
            success: true,
            data: tags.map(tag => ({ name: tag, color: tagColors[tag] }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/discovery/:id
// @desc    Get single discovery spot
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const spot = await DiscoverySpot.findById(req.params.id)
            .populate('createdBy', 'name avatar');

        if (!spot) {
            return res.status(404).json({ success: false, message: 'Spot not found' });
        }

        res.json({
            success: true,
            data: spot
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/discovery
// @desc    Create a discovery spot
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const spotData = {
            ...req.body,
            createdBy: req.user._id
        };

        const spot = await DiscoverySpot.create(spotData);

        res.status(201).json({
            success: true,
            data: spot
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/discovery/:id
// @desc    Update a discovery spot
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
    try {
        let spot = await DiscoverySpot.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({ success: false, message: 'Spot not found' });
        }

        // Check ownership
        if (spot.createdBy && spot.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this spot' });
        }

        spot = await DiscoverySpot.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: spot
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/discovery/:id
// @desc    Delete a discovery spot
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const spot = await DiscoverySpot.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({ success: false, message: 'Spot not found' });
        }

        // Check ownership
        if (spot.createdBy && spot.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this spot' });
        }

        await spot.deleteOne();

        res.json({
            success: true,
            message: 'Spot deleted'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
