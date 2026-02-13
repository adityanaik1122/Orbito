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

// Custom marker icon with brand color
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  'Sydney': [-33.8688, 151.2093],
  'Singapore': [1.3521, 103.8198],
  'Hong Kong': [22.3193, 114.1694],
  'Los Angeles': [34.0522, -118.2437],
  'San Francisco': [37.7749, -122.4194],
  'Miami': [25.7617, -80.1918],
  'Las Vegas': [36.1699, -115.1398],
  'Bangkok': [13.7563, 100.5018],
  'Bali': [-8.3405, 115.0920],
  'Maldives': [3.2028, 73.2207],
  'Cairo': [30.0444, 31.2357],
  'Istanbul': [41.0082, 28.9784],
  'Vienna': [48.2082, 16.3738],
  'Berlin': [52.5200, 13.4050],
  'Madrid': [40.4168, -3.7038],
  'Lisbon': [38.7223, -9.1393],
  'Athens': [37.9838, 23.7275],
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.7041, 77.1025],
  'Goa': [15.2993, 74.1240],
};

const MapView = ({ destination, activities }) => {
  const cityCenter = cityCoordinates[destination] || [51.5074, -0.1278];

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
      <MapContainer 
        key={destination}
        center={cityCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
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
