import React, { useState } from 'react';
import { X, Loader2, Home, IndianRupee, Bed, Bath } from 'lucide-react';
import { listingsAPI } from '../api';
import ImageUploader from './ImageUploader';
import { uploadAPI } from '../api';

const ListingFormModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'Apartment',
        city: '',
        state: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        mainImage: ''
    });

    const propertyTypes = ['Apartment', 'House', 'Loft', 'Studio', 'Condo', 'Villa', 'Room', 'PG'];

    const amenityOptions = ['Wifi', 'Kitchen', 'Parking', 'AC', 'Pool', 'Gym', 'Laundry', 'Pet Friendly', 'Balcony', 'Water Supply', 'Lift', 'Security', 'Garden', 'Power Backup'];
    const [selectedAmenities, setSelectedAmenities] = useState(['Wifi', 'Kitchen']);

    const sampleImages = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600596542815-2a434f233300?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setUploading(true);

        try {
            let imageUrls = [];

            // Upload images if any
            if (images.length > 0) {
                const files = images.map(img => img.file);
                const uploadResponse = await uploadAPI.multiple(files);
                imageUrls = uploadResponse.data.imageUrls;
            }

            const listingData = {
                title: formData.title,
                description: formData.description,
                propertyType: formData.propertyType,
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: 'India'
                },
                price: parseInt(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                sqft: parseInt(formData.sqft) || undefined,
                amenities: selectedAmenities,
                mainImage: imageUrls[0] || sampleImages[Math.floor(Math.random() * sampleImages.length)],
                images: imageUrls.length > 0 ? imageUrls : [sampleImages[Math.floor(Math.random() * sampleImages.length)]],
                featured: false,
                available: true
            };

            await listingsAPI.create(listingData);

            // Reset form
            setFormData({
                title: '',
                description: '',
                propertyType: 'Apartment',
                city: '',
                state: '',
                address: '',
                price: '',
                bedrooms: 1,
                bathrooms: 1,
                sqft: ''
            });
            setImages([]);
            setSelectedAmenities(['Wifi', 'Kitchen']);

            onSuccess?.();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create listing');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center">
                        <Home className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Host your Home</h2>
                    <p className="text-gray-500 mt-2">List your property for long-term rental</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Modern Loft in Downtown"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Describe your property..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                        <div className="flex flex-wrap gap-2">
                            {propertyTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, propertyType: type })}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.propertyType === type
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Hubli"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Karnataka"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="123 Main Street"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                        <input
                            type="number"
                            name="sqft"
                            value={formData.sqft || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="1200"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <IndianRupee size={14} className="inline" /> Price/month *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="100"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="15000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Bed size={14} className="inline" /> Beds
                            </label>
                            <select
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            >
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n === 0 ? 'Studio' : n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Bath size={14} className="inline" /> Baths
                            </label>
                            <select
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            >
                                {[1, 2, 3, 4].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {amenityOptions.map((amenity) => (
                                <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedAmenities.includes(amenity)
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                                        }`}
                                >
                                    {amenity}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images (up to 5)
                        </label>
                        <ImageUploader images={images} setImages={setImages} maxImages={5} />
                    </div>

                    {images.length > 0 && (
                        <div className="rounded-xl overflow-hidden h-32">
                            <img src={images[0].url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating Listing...
                            </>
                        ) : (
                            <>
                                <Home size={20} />
                                List Property
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ListingFormModal;
