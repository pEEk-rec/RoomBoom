const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/favorites
// @desc    Get user's favorites
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favoriteSpots')
            .populate('favoriteListings');

        res.json({
            success: true,
            data: {
                spots: user.favoriteSpots,
                listings: user.favoriteListings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/favorites/:type/:id
// @desc    Add to favorites (type: 'spot' or 'listing')
// @access  Private
router.post('/:type/:id', protect, async (req, res) => {
    try {
        const { type, id } = req.params;
        const user = await User.findById(req.user._id);

        if (type === 'spot') {
            if (!user.favoriteSpots.includes(id)) {
                user.favoriteSpots.push(id);
                await user.save();
            }
        } else if (type === 'listing') {
            if (!user.favoriteListings.includes(id)) {
                user.favoriteListings.push(id);
                await user.save();
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type. Use "spot" or "listing"' });
        }

        res.json({
            success: true,
            message: `Added to favorite ${type}s`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/favorites/:type/:id
// @desc    Remove from favorites
// @access  Private
router.delete('/:type/:id', protect, async (req, res) => {
    try {
        const { type, id } = req.params;
        const user = await User.findById(req.user._id);

        if (type === 'spot') {
            user.favoriteSpots = user.favoriteSpots.filter(
                spotId => spotId.toString() !== id
            );
            await user.save();
        } else if (type === 'listing') {
            user.favoriteListings = user.favoriteListings.filter(
                listingId => listingId.toString() !== id
            );
            await user.save();
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type. Use "spot" or "listing"' });
        }

        res.json({
            success: true,
            message: `Removed from favorite ${type}s`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/favorites/check/:type/:id
// @desc    Check if item is in favorites
// @access  Private
router.get('/check/:type/:id', protect, async (req, res) => {
    try {
        const { type, id } = req.params;
        const user = await User.findById(req.user._id);

        let isFavorite = false;

        if (type === 'spot') {
            isFavorite = user.favoriteSpots.includes(id);
        } else if (type === 'listing') {
            isFavorite = user.favoriteListings.includes(id);
        }

        res.json({
            success: true,
            isFavorite
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
