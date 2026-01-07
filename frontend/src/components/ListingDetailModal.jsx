import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Heart, Share2, Bed, Bath, Home, IndianRupee, Wifi, Car, Droplet, Wind } from 'lucide-react';
import { listingsAPI, favoritesAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const ListingDetailModal = ({ isOpen, onClose, listingId, onDelete }) => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isOpen && listingId) {
            fetchListingDetails();
        }
    }, [isOpen, listingId]);

    const fetchListingDetails = async () => {
        setLoading(true);
        try {
            const response = await listingsAPI.getById(listingId);
            setListing(response.data.data);
        } catch (error) {
            console.error('Error fetching listing details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        try {
            await listingsAPI.delete(listingId);
            alert('Listing deleted successfully!');
            onDelete?.(); // Refresh the list
            onClose();
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert(error.response?.data?.message || 'Failed to delete listing');
        } finally {
            setDeleting(false);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/?listing=${listingId}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy link');
        }
    };

    const amenityIcons = {
        'Wifi': Wifi,
        'Parking': Car,
        'Water Supply': Droplet,
        'AC': Wind,
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={24} className="text-gray-700" />
                </button>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : listing ? (
                    <div className="overflow-y-auto max-h-[90vh]">
                        {/* Image Gallery */}
                        <div className="relative h-96 bg-gray-100">
                            <img
                                src={listing.images && listing.images.length > 0
                                    ? (listing.images[currentImageIndex].startsWith('http')
                                        ? listing.images[currentImageIndex]
                                        : `http://localhost:5000${listing.images[currentImageIndex]}`)
                                    : (listing.mainImage?.startsWith('http')
                                        ? listing.mainImage
                                        : `http://localhost:5000${listing.mainImage}`)}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Image Navigation */}
                            {listing.images && listing.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {listing.images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                ? 'bg-white w-8'
                                                : 'bg-white/50 hover:bg-white/75'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Property Type Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    {listing.propertyType}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Title & Location */}
                            <div className="mb-6">
                                <h1 className="text-4xl font-black text-gray-900 mb-3">{listing.title}</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={20} />
                                    <span className="text-lg">
                                        {listing.location?.address && `${listing.location.address}, `}
                                        {listing.location?.city}, {listing.location?.state}
                                    </span>
                                </div>
                            </div>

                            {/* Price & Stats */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <IndianRupee size={24} className="text-blue-600" />
                                    <span className="font-black text-3xl text-gray-900">
                                        {listing.price?.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500">/ month</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-lg">{listing.rating?.toFixed(1) || '4.8'}</span>
                                    <span className="text-gray-500">({listing.reviewCount || 0} reviews)</span>
                                </div>
                                {listing.featured && (
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>

                            {/* Property Details */}
                            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                    <Bed size={24} className="text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Bedrooms</p>
                                        <p className="font-bold text-gray-900">{listing.bedrooms || 1}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                    <Bath size={24} className="text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Bathrooms</p>
                                        <p className="font-bold text-gray-900">{listing.bathrooms || 1}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                    <Home size={24} className="text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Square Feet</p>
                                        <p className="font-bold text-gray-900">{listing.sqft || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">About this property</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {listing.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Amenities */}
                            {listing.amenities && listing.amenities.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {listing.amenities.map((amenity, index) => {
                                            const Icon = amenityIcons[amenity] || Home;
                                            return (
                                                <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                                    <Icon size={20} className="text-blue-600" />
                                                    <span className="text-gray-700 font-medium">{amenity}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Host Info */}
                            {listing.host && (
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Hosted by</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                            <img
                                                src={listing.host.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                                alt={listing.host.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{listing.host.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Joined {new Date(listing.host.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Additional Images */}
                            {listing.images && listing.images.length > 1 && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">All Photos</h2>
                                    <div className="grid grid-cols-4 gap-3">
                                        {listing.images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? 'border-blue-500 scale-95'
                                                    : 'border-transparent hover:border-gray-300'
                                                    }`}
                                            >
                                                <img
                                                    src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                                                    alt={`${listing.title} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                    <Heart size={20} />
                                    Save to Favorites
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <Share2 size={20} />
                                        Share
                                    </button>
                                    {showShareMenu && (
                                        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px]">
                                            <button
                                                onClick={handleShare}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                {copySuccess ? '✓ Link Copied!' : 'Copy Link'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isAuthenticated && listing.host && user?._id === listing.host._id && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="px-6 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {deleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">Listing not found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingDetailModal;
