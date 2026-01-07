import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Star, Heart, Sun, Home, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { discoveryAPI, listingsAPI, favoritesAPI } from '../api';
import SpotFormModal from './SpotFormModal';
import ListingFormModal from './ListingFormModal';
import SpotDetailModal from './SpotDetailModal';
import ListingDetailModal from './ListingDetailModal';
import MapView from './MapView';

const AppContent = ({ mode, setMode, onAuthClick }) => {
    const isDiscovery = mode === 'discovery';
    const { user, isAuthenticated, logout } = useAuth();

    // Data states
    const [spots, setSpots] = useState([]);
    const [listings, setListings] = useState([]);
    const [favorites, setFavorites] = useState({ spots: [], listings: [] });
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Modal states
    const [showSpotModal, setShowSpotModal] = useState(false);
    const [showListingModal, setShowListingModal] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState(null);
    const [showSpotDetail, setShowSpotDetail] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [showListingDetail, setShowListingDetail] = useState(false);

    // Search states
    const [searchLocation, setSearchLocation] = useState('');
    const [showMapView, setShowMapView] = useState(false);

    // Theme configuration
    const theme = isDiscovery ? {
        bg: "bg-[#FFFBF0]",
        textMain: "text-teal-900",
        accent: "text-orange-500",
        primary: "bg-teal-600",
        cardBg: "bg-white",
        heroGradient: "from-teal-400 to-blue-500"
    } : {
        bg: "bg-slate-50",
        textMain: "text-slate-800",
        accent: "text-blue-600",
        primary: "bg-slate-900",
        cardBg: "bg-white",
        heroGradient: "from-slate-100 to-slate-200"
    };

    // Fetch data on mount and mode change
    useEffect(() => {
        fetchData();
    }, [mode]);

    // Fetch favorites if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isDiscovery) {
                const response = await discoveryAPI.getAll({ limit: 20 });
                setSpots(response.data.data || []);
            } else {
                const response = await listingsAPI.getAll({ limit: 20 });
                setListings(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Use fallback data if API fails
            // Use fallback data if API fails
            if (isDiscovery) {
                setSpots([
                    { _id: '1', title: "Unkal Lake", tag: "Nature", tagColor: "bg-orange-400", image: "https://images.unsplash.com/photo-1596825205490-7234572236cd?auto=format&fit=crop&q=80&w=800" },
                    { _id: '2', title: "Urban Oasis", tag: "Chill", tagColor: "bg-purple-500", image: "https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?auto=format&fit=crop&q=80&w=800" },
                    { _id: '3', title: "Nrupatunga Betta", tag: "Active", tagColor: "bg-blue-400", image: "https://images.unsplash.com/photo-1589308078059-beeb1f6010bb?auto=format&fit=crop&q=80&w=800" },
                    { _id: '4', title: "Karnatak Univ.", tag: "Culture", tagColor: "bg-green-500", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=800" }
                ]);
            } else {
                setListings([
                    { _id: '1', title: "Modern 2BHK in Vidya Nagar", location: { city: "Hubli", state: "KA" }, price: 15000, rating: 4.5, mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" },
                    { _id: '2', title: "Cozy Studio near Sattur", location: { city: "Dharwad", state: "KA" }, price: 8000, rating: 4.2, mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" },
                    { _id: '3', title: "Spacious Villa in Keshwapur", location: { city: "Hubli", state: "KA" }, price: 25000, rating: 4.8, mainImage: "https://images.unsplash.com/photo-1600596542815-2a434f233300?auto=format&fit=crop&q=80&w=800" },
                    { _id: '4', title: "Student Room in Kalyan Nagar", location: { city: "Dharwad", state: "KA" }, price: 4500, rating: 4.0, mainImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800" },
                    { _id: '5', title: "Luxury Apartment Gokul Rd", location: { city: "Hubli", state: "KA" }, price: 18000, rating: 4.7, mainImage: "https://images.unsplash.com/photo-1502005229762-cf1afd34c88d?auto=format&fit=crop&q=80&w=800" },
                    { _id: '6', title: "Garden Home in Dharwad", location: { city: "Dharwad", state: "KA" }, price: 12000, rating: 4.6, mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await favoritesAPI.getAll();
            setFavorites(response.data.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const toggleFavorite = async (type, id) => {
        if (!isAuthenticated) {
            onAuthClick('login');
            return;
        }

        try {
            const isFavorite = type === 'spot'
                ? favorites.spots?.some(s => s._id === id)
                : favorites.listings?.some(l => l._id === id);

            if (isFavorite) {
                await favoritesAPI.remove(type, id);
            } else {
                await favoritesAPI.add(type, id);
            }
            await fetchFavorites();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const isSpotFavorite = (id) => favorites.spots?.some(s => s._id === id);
    const isListingFavorite = (id) => favorites.listings?.some(l => l._id === id);

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    const handlePostSpot = () => {
        if (!isAuthenticated) {
            onAuthClick('login');
            return;
        }
        setShowSpotModal(true);
    };

    const handleHostHome = () => {
        if (!isAuthenticated) {
            onAuthClick('login');
            return;
        }
        setShowListingModal(true);
    };

    const handleSpotCreated = () => {
        fetchData(); // Refresh spots list
    };

    const handleListingCreated = () => {
        fetchData(); // Refresh listings list
    };

    const handleSpotClick = (spotId) => {
        setSelectedSpotId(spotId);
        setShowSpotDetail(true);
    };

    const handleListingClick = (listingId) => {
        setSelectedListingId(listingId);
        setShowListingDetail(true);
    };

    return (
        <>
            <SpotDetailModal
                isOpen={showSpotDetail}
                onClose={() => setShowSpotDetail(false)}
                spotId={selectedSpotId}
                onDelete={fetchData}
            />
            <ListingDetailModal
                isOpen={showListingDetail}
                onClose={() => setShowListingDetail(false)}
                listingId={selectedListingId}
                onDelete={fetchData}
            />
            <SpotFormModal
                isOpen={showSpotModal}
                onClose={() => setShowSpotModal(false)}
                onSuccess={handleSpotCreated}
            />
            <ListingFormModal
                isOpen={showListingModal}
                onClose={() => setShowListingModal(false)}
                onSuccess={handleListingCreated}
            />
            <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
                {/* HEADER */}
                <nav className={`fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center backdrop-blur-md ${isDiscovery ? 'bg-white/50' : 'bg-white/80 border-b border-gray-100'}`}>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${isDiscovery ? 'bg-gradient-to-br from-orange-400 to-pink-500' : 'bg-slate-900'}`}>
                            RB
                        </div>
                        <span className={`font-bold text-xl tracking-tight ${theme.textMain}`}>RoomBoom</span>
                    </div>

                    {/* Mode Switcher */}
                    <div className="hidden md:flex bg-black/5 p-1 rounded-full relative">
                        <div className={`absolute top-1 bottom-1 w-[50%] bg-white shadow-sm rounded-full transition-all duration-300 ${mode === 'discovery' ? 'left-1' : 'left-[48%]'}`} />
                        <button onClick={() => setMode('discovery')} className={`relative z-10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${mode === 'discovery' ? 'text-black' : 'text-gray-500'}`}>Local</button>
                        <button onClick={() => setMode('rentals')} className={`relative z-10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${mode === 'rentals' ? 'text-black' : 'text-gray-500'}`}>Rentals</button>
                    </div>

                    <div className="flex items-center gap-4">
                        {isDiscovery ? (
                            <button
                                onClick={handlePostSpot}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 font-bold rounded-full text-sm hover:bg-orange-200 transition-colors"
                            >
                                <Sun size={16} /> Post a Spot
                            </button>
                        ) : (
                            <button
                                onClick={handleHostHome}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-full text-sm hover:bg-slate-200 transition-colors"
                            >
                                <Home size={16} /> Host your Home
                            </button>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                                        <img src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-sm text-gray-500">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => onAuthClick('login')}
                                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-teal-500 transition-all"
                            >
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Login" className="w-full h-full object-cover" />
                            </button>
                        )}
                    </div>
                </nav>

                {/* BODY CONTENT */}
                <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">

                    {/* === DISCOVERY MODE CONTENT === */}
                    {isDiscovery && (
                        <div className="animate-slide-up">
                            {/* Discovery Hero */}
                            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-400 text-white p-8 md:p-16 mb-16 shadow-[0_20px_50px_rgba(20,184,166,0.3)]">
                                <div className="relative z-10 max-w-2xl">
                                    <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Explore Hubli-Dharwad</span>
                                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 drop-shadow-sm">
                                        Discover <br /> <span className="text-yellow-300">Twin Cities.</span>
                                    </h1>
                                    <p className="text-xl font-medium opacity-90 mb-8 max-w-lg">
                                        Explore local hotspots, historic gems, and the best food in North Karnataka.
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowMapView(false)}
                                            className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                                        >
                                            Start Exploring
                                        </button>
                                        <button
                                            onClick={() => setShowMapView(true)}
                                            className="bg-teal-600/30 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-600/50 transition-colors"
                                        >
                                            View Map
                                        </button>
                                    </div>
                                </div>

                                {/* Decorative Circles */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
                            </div>


                            {/* Map or Grid View Toggle */}
                            {showMapView ? (
                                <>
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-3xl font-black text-teal-900 uppercase">Explore on Map</h2>
                                        <button
                                            onClick={() => setShowMapView(false)}
                                            className="px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors"
                                        >
                                            Back to Grid View
                                        </button>
                                    </div>
                                    <MapView spots={spots} onSpotClick={handleSpotClick} />
                                </>
                            ) : (
                                <>
                                    {/* Trending Section */}
                                    <div className="flex justify-between items-end mb-8">
                                        <h2 className="text-3xl font-black text-teal-900 uppercase">Trending Now</h2>
                                        <div className="flex gap-2">
                                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-50 text-teal-600"><ArrowRight className="rotate-180" /></button>
                                            <button className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 shadow-lg"><ArrowRight /></button>
                                        </div>
                                    </div>

                                    {/* Spots Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {spots.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => handleSpotClick(item._id)}
                                                className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                                            >
                                                <img
                                                    src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                                <div className="absolute top-4 left-4">
                                                    <span className={`${item.tagColor} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full`}>{item.tag}</span>
                                                </div>

                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
                                                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                                                        <div className={`h-full ${item.tagColor} w-0 group-hover:w-full transition-all duration-700`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* === RENTALS MODE CONTENT === */}
                    {!isDiscovery && (
                        <div className="animate-slide-up">
                            {/* Residential Hero */}
                            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm mb-12">
                                <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">Find your sanctuary.</h1>

                                {/* Search Bar */}
                                <div className="flex flex-col md:flex-row bg-slate-50 border border-gray-200 rounded-2xl p-2 max-w-4xl mx-auto shadow-sm">
                                    <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-white rounded-xl transition-colors cursor-pointer group">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Vidya Nagar, Hubli"
                                            value={searchLocation}
                                            onChange={(e) => setSearchLocation(e.target.value)}
                                            className="w-full bg-transparent outline-none text-slate-900 font-medium placeholder-slate-400"
                                        />
                                    </div>
                                    <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-white rounded-xl transition-colors cursor-pointer group">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Move-in</label>
                                        <div className="text-slate-900 font-medium">Add dates</div>
                                    </div>
                                    <div className="flex-1 px-6 py-3 hover:bg-white rounded-xl transition-colors cursor-pointer group flex items-center justify-between">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Guests</label>
                                            <div className="text-slate-900 font-medium">Add guests</div>
                                        </div>
                                        <button className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 shadow-lg hover:shadow-blue-600/30 transition-all">
                                            <Search size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Listings Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {listings.map((item) => (
                                    <div
                                        key={item._id}
                                        onClick={() => handleListingClick(item._id)}
                                        className="group cursor-pointer"
                                    >                                        <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                                            <img
                                                src={item.mainImage?.startsWith('http') ? item.mainImage : `http://localhost:5000${item.mainImage}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite('listing', item._id); }}
                                                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                                            >
                                                <Heart
                                                    size={16}
                                                    className={isListingFavorite(item._id) ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                                            <div className="flex items-center gap-1 text-sm font-semibold">
                                                <Star size={12} className="fill-slate-900" /> {item.rating?.toFixed(2) || '4.92'}
                                            </div>
                                        </div>
                                        <div className="text-slate-500 text-sm mb-2">
                                            {item.location?.city}, {item.location?.state}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-bold text-slate-900">₹{item.price?.toLocaleString()}</span>
                                            <span className="text-slate-500 text-sm">/ month</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main >
            </div >
        </>
    );
};

export default AppContent;
