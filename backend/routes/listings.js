const express = require('express');
const Listing = require('../models/Listing');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            city,
            minPrice,
            maxPrice,
            bedrooms,
            propertyType,
            search,
            limit = 12,
            page = 1
        } = req.query;

        let query = { available: true };

        // Filter by city
        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        // Filter by bedrooms
        if (bedrooms) {
            query.bedrooms = parseInt(bedrooms);
        }

        // Filter by property type
        if (propertyType) {
            query.propertyType = propertyType;
        }

        // Search by text
        if (search) {
            query.$text = { $search: search };
        }

        const listings = await Listing.find(query)
            .sort({ featured: -1, createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('host', 'name avatar');

        const total = await Listing.countDocuments(query);

        res.json({
            success: true,
            count: listings.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: listings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/listings/featured
// @desc    Get featured listings
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const listings = await Listing.find({ featured: true, available: true })
            .sort({ rating: -1, reviewCount: -1 })
            .limit(parseInt(limit))
            .populate('host', 'name avatar');

        res.json({
            success: true,
            count: listings.length,
            data: listings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('host', 'name avatar email');

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.json({
            success: true,
            data: listing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/listings
// @desc    Create a listing
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const listingData = {
            ...req.body,
            host: req.user._id
        };

        const listing = await Listing.create(listingData);

        res.status(201).json({
            success: true,
            data: listing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/listings/:id
// @desc    Update a listing
// @access  Private (host only)
router.put('/:id', protect, async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // Check ownership
        if (listing.host && listing.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
        }

        listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: listing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
// @access  Private (host only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // Check ownership
        if (listing.host && listing.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
        }

        await listing.deleteOne();

        res.json({
            success: true,
            message: 'Listing deleted'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
