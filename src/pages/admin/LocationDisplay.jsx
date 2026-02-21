import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import GoogleMapView from '../GoogleMapView';
import { extractCoordinates } from '../../utils/helpers';

const LocationDisplay = ({ location }) => {
  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Location
      </h2>
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
    </motion.div>
  );
};

export default LocationDisplay;