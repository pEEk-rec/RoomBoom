import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ images, setImages, maxImages = 5 }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (images.length + imageFiles.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        const newImages = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    return (
        <div>
            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">
                        Drag & drop images here, or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Max {maxImages} images, 5MB each
                    </p>
                </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                            {index === 0 && (
                                <span className="absolute bottom-1 left-1 bg-teal-500 text-white text-xs px-2 py-0.5 rounded">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;