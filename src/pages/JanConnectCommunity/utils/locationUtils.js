/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (degrees) => degrees * Math.PI / 180;

/**
 * Filter posts near user's location
 * @param {Array} posts - Array of posts
 * @param {Object} userLocation - User's coordinates {lat, lng}
 * @param {number} radius - Search radius in km (default: 10)
 * @returns {Array} Filtered posts
 */
export const filterNearMe = (posts = [], userLocation, radius = 10) => {
  if (!userLocation) return posts;
  
  return posts.filter(post => {
    if (!post.location?.coordinates) return false;
    
    const distance = calculateDistance(
      userLocation,
      post.location.coordinates
    );
    
    return distance <= radius;
  }).sort((a, b) => {
    const distA = calculateDistance(userLocation, a.location.coordinates);
    const distB = calculateDistance(userLocation, b.location.coordinates);
    return distA - distB;
  });
};

/**
 * Get user's current location
 * @returns {Promise} Promise resolving to coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Get municipality from coordinates (reverse geocoding)
 * @param {Object} coordinates - {lat, lng}
 * @returns {Promise} Promise resolving to municipality name
 */
export const getMunicipalityFromCoordinates = async (coordinates) => {
  try {
    // You can use OpenStreetMap Nominatim or Google Maps API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
    );
    const data = await response.json();
    
    // Extract city/district from address
    return data.address?.city || 
           data.address?.town || 
           data.address?.district || 
           'Unknown';
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Unknown';
  }
};