const mongoose = require('mongoose');

const discoverySpotSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    tag: {
        type: String,
        required: [true, 'Please add a tag'],
        enum: ['Nature', 'Nightlife', 'Active', 'Chill', 'Food', 'Culture', 'Adventure']
    },
    tagColor: {
        type: String,
        default: 'bg-orange-400'
    },
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    trending: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search
discoverySpotSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('DiscoverySpot', discoverySpotSchema);
