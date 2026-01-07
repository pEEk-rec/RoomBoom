const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'House', 'Loft', 'Studio', 'Condo', 'Villa', 'Room', 'PG'],
        default: 'Apartment'
    },
    location: {
        address: String,
        city: {
            type: String,
            required: [true, 'Please add a city']
        },
        state: String,
        country: String,
        zipCode: String
    },
    price: {
        type: Number,
        required: [true, 'Please add a price per month']
    },
    bedrooms: {
        type: Number,
        default: 1
    },
    bathrooms: {
        type: Number,
        default: 1
    },
    sqft: {
        type: Number
    },
    amenities: [{
        type: String,
        enum: ['Wifi', 'Kitchen', 'Parking', 'AC', 'Pool', 'Gym', 'Laundry', 'Pet Friendly', 'Balcony', 'Water Supply', 'Lift', 'Security', 'Garden', 'Power Backup']
    }],
    images: [{
        type: String
    }],
    mainImage: {
        type: String,
        required: [true, 'Please add a main image URL']
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
    featured: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search
listingSchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

module.exports = mongoose.model('Listing', listingSchema);
