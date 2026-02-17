import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon with brand color
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center when destination changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

// Geocoding function to get coordinates from location name via backend proxy
const geocodeLocation = async (locationName) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(
      `${apiUrl}/geocode?location=${encodeURIComponent(locationName)}`
    );
    const data = await response.json();
    
    if (data.success && data.coordinates) {
      return {
        lat: data.coordinates.lat,
        lon: data.coordinates.lon,
        displayName: data.coordinates.displayName
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

const MapView = ({ destination, activities }) => {
  const [cityCenter, setCityCenter] = useState([51.5074, -0.1278]); // Default to London
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState('London');
  const [zoom, setZoom] = useState(13);

  // Fetch coordinates when destination changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!destination) return;
      
      setIsLoading(true);
      const result = await geocodeLocation(destination);
      
      if (result) {
        setCityCenter([result.lat, result.lon]);
        setLocationName(result.displayName);
        setZoom(13);
      } else {
        console.warn(`Could not find coordinates for "${destination}". Using default location.`);
        setCityCenter([51.5074, -0.1278]);
        setLocationName('London (default)');
      }
      
      setIsLoading(false);
    };

    fetchCoordinates();
  }, [destination]);

  // Create markers from activities
  const activityMarkers = activities
    ?.flatMap(day => day.items || [])
    .map((activity, index) => {
      const position = activity.coordinates || cityCenter;
      
      return {
        position: position,
        name: activity.name,
        location: activity.location || destination,
        time: activity.time,
        description: activity.description,
        id: activity.id || index
      };
    }) || [];

  return (
    <div className="relative w-full h-full bg-gray-200 z-0">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B3D91] mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map for {destination}...</p>
          </div>
        </div>
      )}
      
      <MapContainer 
        center={cityCenter} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapUpdater center={cityCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {activityMarkers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={customIcon}>
            <Popup>
              <div className="font-sans min-w-[180px]">
                <p className="font-bold text-sm text-[#0B3D91] mb-1">{marker.name}</p>
                <p className="text-xs text-gray-500 mb-1">{marker.location}</p>
                {marker.time && <p className="text-xs font-semibold text-[#0B3D91]">{marker.time}</p>}
                {marker.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Activity count badge */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-[1000]">
        <p className="text-sm font-medium text-[#0B3D91]">
          {activityMarkers.length > 0 
            ? `Showing ${activityMarkers.length} activities in ${destination}`
            : `Exploring ${destination}`
          }
        </p>
      </div>
    </div>
  );
};

export default MapView;
