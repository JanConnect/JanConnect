import React from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const GoogleMapView = ({ coordinates, address, title }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (loadError) {
    return (
      <div className="h-48 bg-white/5 rounded-xl border border-white/20 flex items-center justify-center">
        <span className="text-white/60">Error loading maps</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-48 bg-white/5 rounded-xl border border-white/20 flex items-center justify-center">
        <span className="text-white/60">Loading map...</span>
      </div>
    );
  }

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return (
      <div className="h-48 bg-white/5 rounded-xl border border-white/20 flex items-center justify-center">
        <span className="text-white/60">No location coordinates available</span>
      </div>
    );
  }

  // Your backend returns [longitude, latitude] but Google Maps expects [latitude, longitude]
  const [lng, lat] = coordinates; // Note: swapped order from your backend
  
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return (
      <div className="h-48 bg-white/5 rounded-xl border border-white/20 flex items-center justify-center">
        <span className="text-white/60">Invalid location coordinates</span>
      </div>
    );
  }

  const center = { lat, lng }; // Google Maps format

  return (
    <div className="h-48 rounded-xl overflow-hidden border border-white/20 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          // Remove the styles property to get normal Google Maps colors
          disableDefaultUI: false,
          gestureHandling: 'cooperative',
          mapTypeId: 'roadmap' // This gives you the standard Google Maps appearance
        }}
      >
        <Marker 
          position={center}
          title={title || 'Report Location'}
        />
      </GoogleMap>
      
      {/* Coordinates overlay */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </div>
    </div>
  );
};

export default GoogleMapView;
