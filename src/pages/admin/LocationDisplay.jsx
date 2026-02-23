import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import GoogleMapView from '../GoogleMapView';
import { extractCoordinates } from '../utils/helpers';

const LocationDisplay = ({ location }) => {
  return (
    
      <div className="space-y-4">
        {location?.address && (
          <div className="text-white/90">
            <span className="text-white/60">Address: </span>
            {location.address}
          </div>
        )}
        
        {/* Google Maps Integration */}
        {location?.coordinates && Array.isArray(location.coordinates) && (
          <div className="mt-4 rounded-xl overflow-hidden h-64">
            <GoogleMapView 
              coordinates={extractCoordinates(location)}
              address={location.address}
              title="Report Location"
            />
          </div>
        )}
        
        {!location?.address && !location?.coordinates && (
          <div className="text-white/60 italic">No location information available</div>
        )}
      </div>
  );
};

export default LocationDisplay;