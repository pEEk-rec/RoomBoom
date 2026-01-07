import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon with color
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="position: relative;">
                <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" 
                          fill="${color}" 
                          stroke="white" 
                          stroke-width="2"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                </svg>
            </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42]
    });
};

const MapView = ({ spots, onSpotClick }) => {
    // Default center: Hubli-Dharwad area
    const defaultCenter = [15.3647, 75.1240];

    // Get color based on tag
    const getMarkerColor = (tag) => {
        const colors = {
            'Nature': '#10b981',
            'Food': '#f59e0b',
            'Culture': '#8b5cf6',
            'Chill': '#ec4899',
            'Active': '#3b82f6',
            'Adventure': '#14b8a6'
        };
        return colors[tag] || '#6b7280';
    };

    // Helper function to get default coordinates for cities
    const getDefaultCoordinates = (city) => {
        const cityCoordinates = {
            'Hubli': [15.3647, 75.1240],
            'Dharwad': [15.4589, 75.0078],
            'Hubli-Dharwad': [15.3647, 75.1240],
            'Bangalore': [12.9716, 77.5946],
            'Mysore': [12.2958, 76.6394]
        };

        return cityCoordinates[city] || [15.3647, 75.1240]; // Default to Hubli
    };

    return (
        <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {spots.map((spot) => {
                    // Use coordinates if available, otherwise use default location based on city
                    const position = spot.location?.coordinates?.lat && spot.location?.coordinates?.lng
                        ? [spot.location.coordinates.lat, spot.location.coordinates.lng]
                        : getDefaultCoordinates(spot.location?.city);

                    if (!position) return null;

                    return (
                        <Marker
                            key={spot._id}
                            position={position}
                            icon={createCustomIcon(getMarkerColor(spot.tag))}
                            eventHandlers={{
                                click: () => onSpotClick(spot._id)
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <div className="relative h-32 mb-2 rounded-lg overflow-hidden">
                                        <img
                                            src={spot.image?.startsWith('http') ? spot.image : `http://localhost:5000${spot.image}`}
                                            alt={spot.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{spot.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {spot.location?.city}, {spot.location?.state}
                                    </p>
                                    <span className={`inline-block ${spot.tagColor} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                                        {spot.tag}
                                    </span>
                                    <button
                                        onClick={() => onSpotClick(spot._id)}
                                        className="mt-2 w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;
