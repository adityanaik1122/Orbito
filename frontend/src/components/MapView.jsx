import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const cityCoordinates = {
  'London': [51.5074, -0.1278],
  'Paris': [48.8566, 2.3522],
  'Amsterdam': [52.3676, 4.9041],
  'Dubai': [25.2048, 55.2708],
  'Prague': [50.0755, 14.4378],
  'Edinburgh': [55.9533, -3.1883],
  'Barcelona': [41.3851, 2.1734],
  'Rome': [41.9028, 12.4964],
  'New York': [40.7128, -74.0060],
  'Tokyo': [35.6762, 139.6503],
};

const MapView = ({ destination, activities }) => {
  const cityCenter = cityCoordinates[destination] || [51.5074, -0.1278]; // Default to London

  // Create markers from activities
  const activityMarkers = activities
    ?.flatMap(day => day.items || [])
    .map((activity, index) => {
        // Use activity coordinates if available, otherwise fall back to city center
        const position = activity.coordinates || cityCenter;
        
        return {
            position: position,
            name: activity.name,
            location: activity.location || destination,
            time: activity.time,
            id: activity.id || index
        };
    }) || [];

  return (
    <div className="relative w-full h-full bg-gray-200 z-0">
       <MapContainer 
          key={destination} // Force re-render on destination change
          center={cityCenter} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {activityMarkers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="font-sans min-w-[150px]">
                <p className="font-bold text-sm mb-1">{marker.name}</p>
                <p className="text-xs text-gray-500 m-0">{marker.location}</p>
                {marker.time && <p className="text-xs font-semibold text-[#0B3D91] mt-1">{marker.time}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;