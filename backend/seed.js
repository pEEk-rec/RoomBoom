const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const DiscoverySpot = require('./models/DiscoverySpot');
const Listing = require('./models/Listing');
const bcrypt = require('bcryptjs');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await DiscoverySpot.deleteMany({});
        await Listing.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                name: 'Local Explorer',
                email: 'explorer@example.com',
                password: hashedPassword,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
            },
            {
                name: 'City Host',
                email: 'host@example.com',
                password: hashedPassword,
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
            }
        ]);

        const user1 = users[0];
        const user2 = users[1];
        console.log('✅ Created sample users');

        // Sample Discovery Spots (Hubli-Dharwad)
        const discoverySpots = [
            {
                title: "Unkal Lake Sunset",
                description: "A beautiful historic lake spot perfect for evening walks and watching the sunset. Boating facilities available.",
                tag: "Nature",
                tagColor: "bg-orange-400",
                location: { city: "Hubli", state: "Karnataka", country: "India" },
                image: "https://images.unsplash.com/photo-1596825205490-7234572236cd?auto=format&fit=crop&q=80&w=800",
                rating: 4.8,
                trending: true,
                createdBy: user1._id
            },
            {
                title: "Nrupatunga Betta",
                description: "Hilltop view point offering panoramic views of the twin cities. Great for morning treks.",
                tag: "Active",
                tagColor: "bg-blue-400",
                location: { city: "Hubli", state: "Karnataka", country: "India" },
                image: "https://images.unsplash.com/photo-1589308078059-beeb1f6010bb?auto=format&fit=crop&q=80&w=800",
                rating: 4.7,
                trending: true,
                createdBy: user1._id
            },
            {
                title: "Urban Oasis Mall",
                description: "The biggest shopping and entertainment destination in North Karnataka. Good food court.",
                tag: "Chill",
                tagColor: "bg-purple-500",
                location: { city: "Hubli", state: "Karnataka", country: "India" },
                image: "https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?auto=format&fit=crop&q=80&w=800",
                rating: 4.5,
                trending: true,
                createdBy: user2._id
            },
            {
                title: "Dharwad Pedha Point",
                description: "The authentic place to get the world-famous sweet. A must-visit for foodies.",
                tag: "Food",
                tagColor: "bg-red-400",
                location: { city: "Dharwad", state: "Karnataka", country: "India" },
                image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
                rating: 4.9,
                trending: true,
                createdBy: user2._id
            },
            {
                title: "Chandramouleshwara Temple",
                description: "900-year-old temple from the Chalukya era with intricate carvings.",
                tag: "Culture",
                tagColor: "bg-yellow-500",
                location: { city: "Hubli", state: "Karnataka", country: "India" },
                image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
                rating: 4.8,
                trending: false,
                createdBy: user1._id
            },
            {
                title: "Karnatak University Campus",
                description: "Lush green campus perfect for nature walks and quiet reading spots.",
                tag: "Chill",
                tagColor: "bg-green-500",
                location: { city: "Dharwad", state: "Karnataka", country: "India" },
                image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=800",
                rating: 4.6,
                trending: false,
                createdBy: user2._id
            }
        ];

        await DiscoverySpot.insertMany(discoverySpots);
        console.log(`✅ Inserted ${discoverySpots.length} discovery spots`);

        // Sample Listings (Hubli-Dharwad)
        const listings = [
            {
                title: "Modern 2BHK in Vidya Nagar",
                description: "Fully furnished apartment with essential amenities. Close to college and bus stop.",
                propertyType: "Apartment",
                location: { address: "Vidya Nagar Main Rd", city: "Hubli", state: "Karnataka", country: "India", zipCode: "580031" },
                price: 15000,
                bedrooms: 2,
                bathrooms: 2,
                amenities: ["Wifi", "Kitchen", "Parking", "Water Supply"],
                images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"],
                mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
                rating: 4.5,
                featured: true,
                host: user1._id
            },
            {
                title: "Cozy Studio near Sattur",
                description: "Perfect for students or working professionals. Quiet neighborhood.",
                propertyType: "Studio",
                location: { address: "Sattur Colony", city: "Dharwad", state: "Karnataka", country: "India", zipCode: "580009" },
                price: 8000,
                bedrooms: 1,
                bathrooms: 1,
                amenities: ["Wifi", "Water Supply"],
                images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"],
                mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
                rating: 4.2,
                featured: true,
                host: user2._id
            },
            {
                title: "Spacious Villa in Keshwapur",
                description: "Legacy home with garden available for family rent. Close to railway station.",
                propertyType: "Villa",
                location: { address: "Keshwapur Circle", city: "Hubli", state: "Karnataka", country: "India", zipCode: "580023" },
                price: 25000,
                bedrooms: 3,
                bathrooms: 3,
                amenities: ["Parking", "Garden", "Kitchen", "Balcony"],
                images: ["https://images.unsplash.com/photo-1600596542815-2a434f233300?auto=format&fit=crop&q=80&w=800"],
                mainImage: "https://images.unsplash.com/photo-1600596542815-2a434f233300?auto=format&fit=crop&q=80&w=800",
                rating: 4.8,
                featured: true,
                host: user1._id
            },
            {
                title: "Student Room in Kalyan Nagar",
                description: "Budget friendly single room with mess facility nearby.",
                propertyType: "Room",
                location: { address: "Kalyan Nagar 2nd Cross", city: "Dharwad", state: "Karnataka", country: "India", zipCode: "580007" },
                price: 4500,
                bedrooms: 1,
                bathrooms: 1,
                amenities: ["Water Supply"],
                images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800"],
                mainImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
                rating: 4.0,
                featured: false,
                host: user2._id
            },
            {
                title: "Luxury Apartment in Gokul Road",
                description: "New construction with 24/7 security and lift.",
                propertyType: "Apartment",
                location: { address: "Gokul Road", city: "Hubli", state: "Karnataka", country: "India", zipCode: "580030" },
                price: 18000,
                bedrooms: 2,
                bathrooms: 2,
                amenities: ["Lift", "Security", "Parking", "Wifi"],
                images: ["https://images.unsplash.com/photo-1502005229762-cf1afd34c88d?auto=format&fit=crop&q=80&w=800"],
                mainImage: "https://images.unsplash.com/photo-1502005229762-cf1afd34c88d?auto=format&fit=crop&q=80&w=800",
                rating: 4.7,
                featured: true,
                host: user1._id
            }
        ];

        await Listing.insertMany(listings);
        console.log(`✅ Inserted ${listings.length} listings`);

        console.log('\n🎉 Database seeded successfully with Hubli-Dharwad data!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
