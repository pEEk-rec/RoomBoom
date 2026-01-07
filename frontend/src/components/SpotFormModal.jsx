import React, { useState } from 'react';
import { X, Loader2, Upload, MapPin } from 'lucide-react';
import { discoveryAPI } from '../api';
import ImageUploader from './ImageUploader';
import { uploadAPI } from '../api';


const SpotFormModal = ({ isOpen, onClose, onSuccess, editMode = false, spotData = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tag: 'Nature',
        city: '',
        state: '',
        image: ''
    });

    const tags = [
        { name: 'Nature', color: 'bg-orange-400' },
        { name: 'Nightlife', color: 'bg-purple-500' },
        { name: 'Active', color: 'bg-blue-400' },
        { name: 'Chill', color: 'bg-green-500' },
        { name: 'Food', color: 'bg-red-400' },
        { name: 'Culture', color: 'bg-yellow-500' },
        { name: 'Adventure', color: 'bg-teal-500' }
    ];

    const sampleImages = [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    // Update handleSubmit to upload images first:
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

            const spotData = {
                title: formData.title,
                description: formData.description,
                tag: formData.tag,
                tagColor: tags.find(t => t.name === formData.tag)?.color || 'bg-orange-400',
                location: {
                    city: formData.city,
                    state: formData.state,
                    country: 'India'
                },
                image: imageUrls[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
                images: imageUrls,
                trending: false
            };

            await discoveryAPI.create(spotData);

            // Reset form
            setFormData({ title: '', description: '', tag: 'Nature', city: '', state: '' });
            setImages([]);
            onSuccess?.();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create spot');
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                        <MapPin className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Post a Spot</h2>
                    <p className="text-gray-500 mt-2">Share a hidden gem with the community</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Spot Name *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Secret Sunset Point"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Tell people what makes this spot special..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.name}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tag: tag.name })}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.tag === tag.name
                                        ? `${tag.color} text-white scale-105`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag.name}
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                placeholder="Karnataka"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images (up to 3)
                        </label>
                        <ImageUploader images={images} setImages={setImages} maxImages={3} />
                    </div>

                    {formData.image && (
                        <div className="rounded-xl overflow-hidden h-32">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Post Spot
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SpotFormModal;
