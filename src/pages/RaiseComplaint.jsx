import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, AlertCircle, Upload, X, Navigation, CheckCircle, Camera, Calendar, AlertTriangle, Info, XCircle } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { createReport } from '../api/report';
import { useTranslation } from "react-i18next"; // Add this import

// Simple Custom Modal Component
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const containerStyle = {
  width: '100%',
  height: '250px',
  marginTop: '0.5rem',
  borderRadius: '0.75rem',
};

// **UPDATED: Radius constant for all verification (changed to 10km)**
const VERIFICATION_RADIUS_KM = 10;

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Check if location is within radius
const isLocationWithinRadius = (userLat, userLon, problemLat, problemLon, radiusKm = VERIFICATION_RADIUS_KM) => {
  const distance = calculateDistance(userLat, userLon, problemLat, problemLon);
  return {
    isWithin: distance <= radiusKm,
    distance: distance,
    radiusKm: radiusKm
  };
};

// **UPDATED: Smart Image Verification Component with 10km radius**
const SmartImageVerification = ({ file, userLocation, problemLocation, onVerificationComplete }) => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const performSmartVerification = async () => {
    if (!file) return;
    
    setLoading(true);
    
    try {
      const result = {
        locationScore: 0,
        timingScore: 0,
        qualityScore: 0,
        overallScore: 0,
        canSubmit: false,
        warnings: [],
        details: {
          location: null,
          timing: null,
          quality: null
        }
      };

      // **UPDATED: Location Verification (35 points) - Using 10km radius**
      if (userLocation && problemLocation) {
        const locationCheck = isLocationWithinRadius(
          userLocation.lat, 
          userLocation.lng, 
          problemLocation.lat, 
          problemLocation.lng, 
          VERIFICATION_RADIUS_KM  // 10km radius
        );
        
        if (locationCheck.isWithin) {
          result.locationScore = 35;
          result.details.location = `Within range (${locationCheck.distance.toFixed(2)} km)`;
        } else {
          result.warnings.push(`You are ${locationCheck.distance.toFixed(2)} km from problem location`);
          result.details.location = `Too far (${locationCheck.distance.toFixed(2)} km)`;
        }
      } else {
        result.warnings.push('Unable to verify location proximity');
      }

      // 2. File Timing Verification (35 points) - Based on file system timestamp
      const currentTime = Date.now();
      const fileTime = file.lastModified;
      const hoursDiff = (currentTime - fileTime) / (1000 * 60 * 60);
      
      if (hoursDiff <= 24) {
        result.timingScore = 35;
        result.details.timing = `Recent file (${Math.round(hoursDiff)} hours old)`;
      } else {
        const daysDiff = Math.floor(hoursDiff / 24);
        result.warnings.push(`File is ${daysDiff} days old`);
        result.details.timing = `Old file (${daysDiff} days old)`;
      }

      // 3. Image Quality Analysis (30 points)
      await analyzeImageQuality(file, result);

      // Calculate overall score
      result.overallScore = result.locationScore + result.timingScore + result.qualityScore;
      
      // Only allow submission if score passes threshold (≥60) - NO USER CONSENT
      result.canSubmit = result.overallScore >= 60;

      setVerificationResult(result);
      onVerificationComplete(result);
      
    } catch (error) {
      console.error('Error in smart verification:', error);
      const errorResult = {
        overallScore: 0,
        canSubmit: false,
        warnings: ['Unable to perform verification - photo cannot be submitted']
      };
      setVerificationResult(errorResult);
      onVerificationComplete(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImageQuality = (file, result) => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        let qualityScore = 0;
        const qualityDetails = [];

        // Check resolution
        if (img.width >= 1200 && img.height >= 900) {
          qualityScore += 15;
          qualityDetails.push('High resolution');
        } else if (img.width >= 800 && img.height >= 600) {
          qualityScore += 10;
          qualityDetails.push('Good resolution');
        } else {
          qualityDetails.push('Low resolution');
          result.warnings.push('Low image resolution detected');
        }

        // Check file size vs resolution ratio
        const pixels = img.width * img.height;
        const bytesPerPixel = file.size / pixels;
        
        if (bytesPerPixel > 1.5) {
          qualityScore += 15;
          qualityDetails.push('Good quality/compression ratio');
        } else if (bytesPerPixel > 0.8) {
          qualityScore += 8;
          qualityDetails.push('Moderate compression');
        } else {
          qualityDetails.push('Heavy compression');
          result.warnings.push('Image appears heavily compressed');
        }

        result.qualityScore = qualityScore;
        result.details.quality = qualityDetails.join(', ');
        resolve();
      };

      img.onerror = () => {
        result.warnings.push('Unable to analyze image quality');
        result.details.quality = 'Analysis failed';
        resolve();
      };

      img.src = URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    performSmartVerification();
  }, [file, userLocation, problemLocation]);

  if (!file) return null;

  return (
    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="h-4 w-4 text-white/70" />
        <span className="text-white/70 text-sm font-medium">Smart Image Verification</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60"></div>
          Analyzing image...
        </div>
      ) : verificationResult ? (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Authenticity Score</span>
            <span className={`text-lg font-bold ${
              verificationResult.overallScore >= 80 ? 'text-green-400' :
              verificationResult.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {verificationResult.overallScore}/100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                verificationResult.overallScore >= 80 ? 'bg-green-400' :
                verificationResult.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min(verificationResult.overallScore, 100)}%` }}
            ></div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">📍 Location Proximity</span>
                  <span className={verificationResult.locationScore > 0 ? 'text-green-400' : 'text-red-400'}>
                    {verificationResult.locationScore}/35
                  </span>
                </div>
                <div className="text-white/60 text-xs">
                  {verificationResult.details.location || 'Not checked'}
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">⏰ File Timing</span>
                  <span className={verificationResult.timingScore > 0 ? 'text-green-400' : 'text-red-400'}>
                    {verificationResult.timingScore}/35
                  </span>
                </div>
                <div className="text-white/60 text-xs">
                  {verificationResult.details.timing || 'Not checked'}
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">🖼️ Image Quality</span>
                  <span className={verificationResult.qualityScore > 0 ? 'text-green-400' : 'text-red-400'}>
                    {verificationResult.qualityScore}/30
                  </span>
                </div>
                <div className="text-white/60 text-xs">
                  {verificationResult.details.quality || 'Not analyzed'}
                </div>
              </div>
            </div>
          </div>

          {/* Status - Only show pass/fail, no consent option */}
          <div className="flex items-center gap-2">
            {verificationResult.canSubmit ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              verificationResult.canSubmit ? 'text-green-400' : 'text-red-400'
            }`}>
              {verificationResult.canSubmit ? 'Verification Passed - Can Submit' : 'Verification Failed - Cannot Submit'}
            </span>
          </div>

          {/* Warnings */}
          {verificationResult.warnings.length > 0 && (
            <div className={`border rounded-lg p-3 ${
              verificationResult.canSubmit ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="space-y-1">
                {verificationResult.warnings.map((warning, index) => (
                  <div key={index} className={`text-xs flex items-start gap-2 ${
                    verificationResult.canSubmit ? 'text-yellow-200' : 'text-red-200'
                  }`}>
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failure Instructions Instead of Consent */}
          {!verificationResult.canSubmit && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="space-y-3">
                <p className="text-red-200 text-sm font-medium">
                  ❌ Verification Failed
                </p>
                <p className="text-red-200 text-xs">
                  Your photo did not pass the automatic verification requirements. 
                  To submit a report, you need to:
                </p>
                
                <ul className="text-red-200 text-xs space-y-1 list-disc list-inside ml-2">
                  <li>Be within {VERIFICATION_RADIUS_KM}km of the problem location</li>
                  <li>Upload a photo taken within the last 24 hours</li>
                  <li>Use high resolution images (at least 800x600 pixels)</li>
                  <li>Avoid heavily compressed images</li>
                </ul>
                
                <p className="text-red-200 text-xs font-medium">
                  Please take a fresh photo at the location or try a different image.
                </p>
              </div>
            </div>
          )}

          {/* Instructions for Better Photos */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
            <div className="text-indigo-200 text-sm space-y-2">
              <p className="font-medium">💡 Tips for automatic verification:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Go to the actual problem location before taking the photo</li>
                <li>Take photos immediately with your device camera</li>
                <li>Use good lighting and avoid blurry images</li>
                <li>Don't edit, crop, or compress images before uploading</li>
                <li>Use original camera quality settings</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// **UPDATED: Location Verification Component with 10km radius**
const LocationVerification = ({ userLocation, problemLocation }) => {
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    if (!userLocation || !problemLocation || 
        !userLocation.lat || !userLocation.lng || 
        !problemLocation.lat || !problemLocation.lng) {
      return;
    }

    const result = isLocationWithinRadius(
      userLocation.lat, 
      userLocation.lng, 
      problemLocation.lat, 
      problemLocation.lng, 
      VERIFICATION_RADIUS_KM // 10 km radius
    );

    setVerification(result);
  }, [userLocation, problemLocation]);

  if (!verification) return null;

  return (
    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-white/70" />
        <span className="text-white/70 text-sm font-medium">Location Verification</span>
      </div>

      <div className="flex items-center gap-2">
        {verification.isWithin ? (
          <CheckCircle className="h-4 w-4 text-green-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-red-400" />
        )}
        <span className={`text-sm font-medium ${
          verification.isWithin ? 'text-green-400' : 'text-red-400'
        }`}>
          {verification.isWithin ? 'Within Range' : 'Too Far'}
        </span>
        <span className="text-white/60 text-xs">
          ({verification.distance.toFixed(2)} km away)
        </span>
      </div>

      {!verification.isWithin && (
        <div className="mt-2 text-red-300 text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          You must be within {VERIFICATION_RADIUS_KM}km of the problem location to report it
        </div>
      )}
    </div>
  );
};

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation(); // Add this hook

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: {
      address: "",
      coordinates: [0, 0],
      placeId: null,
      city: "",
      state: "",
      country: ""
    },
    urgency: "medium",
    media: null
  });
  
  // Verification states
  const [userCurrentLocation, setUserCurrentLocation] = useState(null);
  const [smartVerification, setSmartVerification] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    id: 'maps-script-places'
  });

  const acRef = useRef(null);

  // Get user's current location for verification
  const getUserCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserCurrentLocation(location);
          resolve(location);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  // **UPDATED: Enhanced handleSubmit with 10km radius validation**
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic form validation
    if (!formData.location.address || (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0)) {
      setError("Please select a valid location or use current location");
      setIsSubmitting(false);
      return;
    }

    try {
      // Get current user location for verification
      let currentUserLocation = userCurrentLocation;
      if (!currentUserLocation) {
        try {
          currentUserLocation = await getUserCurrentLocation();
        } catch (locError) {
          setError("Unable to get your current location for verification. Please enable location services.");
          setIsSubmitting(false);
          return;
        }
      }

      // **UPDATED: Check location proximity (10km radius)**
      const locationCheck = isLocationWithinRadius(
        currentUserLocation.lat,
        currentUserLocation.lng,
        formData.location.coordinates[1], // lat
        formData.location.coordinates[0], // lng
        VERIFICATION_RADIUS_KM // 10 km radius
      );

      if (!locationCheck.isWithin) {
        setError(`You are ${locationCheck.distance.toFixed(2)}km away from the problem location. You must be within ${VERIFICATION_RADIUS_KM}km to report this issue.`);
        setIsSubmitting(false);
        return;
      }

      // Strict verification logic for images - NO CONSENT ALLOWED
      if (formData.media && smartVerification) {
        if (!smartVerification.canSubmit) {
          setError("Your photo failed verification and cannot be submitted. Please take a fresh photo at the location or try a different image that meets the requirements.");
          setIsSubmitting(false);
          return;
        }
      }

      // Proceed with form submission
      const submitFormData = new FormData();
      
      submitFormData.append('title', formData.title);
      submitFormData.append('category', formData.category);
      submitFormData.append('description', formData.description);
      submitFormData.append('urgency', formData.urgency);
      submitFormData.append('location[address]', formData.location.address);
      submitFormData.append('location[coordinates]', JSON.stringify(formData.location.coordinates));
      
      // Add verification data
      submitFormData.append('verification[userLocation]', JSON.stringify(currentUserLocation));
      submitFormData.append('verification[distanceFromUser]', locationCheck.distance.toString());
      submitFormData.append('verification[isLocationVerified]', 'true');
      submitFormData.append('verification[verificationRadius]', VERIFICATION_RADIUS_KM.toString());
      
      if (smartVerification) {
        submitFormData.append('verification[smartScore]', smartVerification.overallScore.toString());
        submitFormData.append('verification[smartVerified]', smartVerification.canSubmit.toString());
        submitFormData.append('verification[verificationMethod]', 'smart_verification_strict');
        submitFormData.append('verification[locationScore]', smartVerification.locationScore.toString());
        submitFormData.append('verification[timingScore]', smartVerification.timingScore.toString());
        submitFormData.append('verification[qualityScore]', smartVerification.qualityScore.toString());
      }

      if (formData.media) submitFormData.append('media', formData.media);

      const response = await createReport(submitFormData);

      setSubmittedDetails({
        reportId: response.data.data.report.reportId,
        municipality: response.data.data.autoSelected?.municipality || 'Municipal Authority'
      });

      setShowSuccessPopup(true);

    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Please login again to submit reports");
        navigate('/login');
      } else {
        setError("Failed to submit report. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced file change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Only images (JPEG, PNG, WebP) are allowed");
        return;
      }

      setFormData(prev => ({ ...prev, media: file }));
      setError("");

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle smart verification complete
  const handleSmartVerificationComplete = (result) => {
    setSmartVerification(result);
  };

  // Get user location on component mount
  useEffect(() => {
    getUserCurrentLocation().catch(() => {
      console.log('Could not get initial user location');
    });
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set autocomplete value
  const setAutocompleteValue = (value) => {
    if (acRef.current) {
      setTimeout(() => {
        const input = acRef.current.querySelector('input');
        if (input) {
          input.value = '';
          input.value = value;
          const event = new Event('input', { bubbles: true, cancelable: true });
          input.dispatchEvent(event);
          const changeEvent = new Event('change', { bubbles: true, cancelable: true });
          input.dispatchEvent(changeEvent);
        }
      }, 100);
    }
  };

  // Attach gmp-select listener when loaded
  useEffect(() => {
    if (!isLoaded || !acRef.current || !window.google?.maps?.places) return;

    const el = acRef.current;

    const onSelect = async (e) => {
      try {
        const place = e?.placePrediction?.toPlace?.();
        if (!place) return;

        await place.fetchFields({
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'addressComponents']
        });

        const loc = place.location;
        const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.lat;
        const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.lng;

        let city = "", state = "", country = "";
        const comps = place.addressComponents || [];
        comps.forEach((c) => {
          const types = c.types || [];
          if (types.includes('locality')) city = c.longText || c.long_name || "";
          else if (types.includes('administrative_area_level_1')) state = c.longText || c.long_name || "";
          else if (types.includes('country')) country = c.longText || c.long_name || "";
        });

        const address = place.formattedAddress || place.displayName?.text || "";

        setFormData(prev => ({
          ...prev,
          location: {
            address: address,
            coordinates: [lng ?? 0, lat ?? 0],
            placeId: place.id ?? null,
            city,
            state,
            country
          }
        }));

        if (lat && lng) {
          const pos = { lat, lng };
          setMarkerPosition(pos);
          setMapCenter(pos);
        }

        setError("");
      } catch (err) {
        setError(t("failedToFetchPlaceDetails"));
        console.error(err);
      }
    };

    el.addEventListener('gmp-select', onSelect);
    return () => el.removeEventListener('gmp-select', onSelect);
  }, [isLoaded, t]);

  // Auto-get current location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError(t("geolocationNotSupported"));
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Store user location for verification
        setUserCurrentLocation({ lat: latitude, lng: longitude });
        
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            let city = "", state = "", country = "";
            result.address_components.forEach(component => {
              const types = component.types;
              if (types.includes('locality')) city = component.long_name;
              else if (types.includes('administrative_area_level_1')) state = component.long_name;
              else if (types.includes('country')) country = component.long_name;
            });

            const address = result.formatted_address;

            setFormData(prev => ({
              ...prev,
              location: {
                address: address,
                coordinates: [longitude, latitude],
                placeId: result.place_id,
                city,
                state,
                country
              }
            }));

            setMarkerPosition({ lat: latitude, lng: longitude });
            setMapCenter({ lat: latitude, lng: longitude });
            setAutocompleteValue(address);
          } else {
            throw new Error(t('noAddressFound'));
          }
        } catch (error) {
          const address = `${t('location')}: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: address,
              coordinates: [longitude, latitude]
            }
          }));

          setMarkerPosition({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setAutocompleteValue(address);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(t("locationAccessDenied"));
            break;
          case error.POSITION_UNAVAILABLE:
            setError(t("locationUnavailable"));
            break;
          case error.TIMEOUT:
            setError(t("locationRequestTimeout"));
            break;
          default:
            setError(t("unknownLocationError"));
            break;
        }
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [GOOGLE_MAPS_API_KEY, t]);

  // Reverse geocode function
  const reverseGeocode = useCallback(
    async ({ lat, lng }) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          let city = "", state = "", country = "";
          result.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('locality') || types.includes('sublocality')) city = component.long_name;
            else if (types.includes('administrative_area_level_1')) state = component.long_name;
            else if (types.includes('country')) country = component.long_name;
          });

          const address = result.formatted_address;
          
          setFormData(prev => ({
            ...prev,
            location: {
              address: address,
              coordinates: [lng, lat],
              placeId: result.place_id,
              city,
              state,
              country
            }
          }));

          setAutocompleteValue(address);
        }
      } catch (e) {
        console.error("Reverse geocode error:", e);
      }
    },
    [GOOGLE_MAPS_API_KEY]
  );

  const onMarkerDragEnd = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode({ lat, lng });
    },
    [reverseGeocode]
  );

  const onMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode({ lat, lng });
    },
    [reverseGeocode]
  );

  // Get current location button
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t("geolocationNotSupported"));
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update user location for verification
        setUserCurrentLocation({ lat: latitude, lng: longitude });
        
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            let city = "", state = "", country = "";
            result.address_components.forEach(component => {
              const types = component.types;
              if (types.includes('locality')) city = component.long_name;
              else if (types.includes('administrative_area_level_1')) state = component.long_name;
              else if (types.includes('country')) country = component.long_name;
            });

            const address = result.formatted_address;

            setFormData(prev => ({
              ...prev,
              location: {
                address: address,
                coordinates: [longitude, latitude],
                placeId: result.place_id,
                city,
                state,
                country
              }
            }));

            setMarkerPosition({ lat: latitude, lng: longitude });
            setMapCenter({ lat: latitude, lng: longitude });
            setAutocompleteValue(address);
          }
        } catch (error) {
          const address = `${t('location')}: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: address,
              coordinates: [longitude, latitude]
            }
          }));

          setMarkerPosition({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setAutocompleteValue(address);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(t("locationAccessDenied"));
            break;
          case error.POSITION_UNAVAILABLE:
            setError(t("locationUnavailable"));
            break;
          case error.TIMEOUT:
            setError(t("locationRequestTimeout"));
            break;
          default:
            setError(t("unknownLocationError"));
            break;
        }
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, media: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setSmartVerification(null);
  };

  const closePopupAndNavigate = () => {
    setShowSuccessPopup(false);
    navigate(`/user/${userId}`);
  };

  // Check if form can be submitted - Strict verification required
  const canSubmit = () => {
    const basicRequirements = formData.title && formData.category && formData.description && formData.location.address;
    
    if (!basicRequirements) return false;
    
    // If image is uploaded, smart verification MUST pass - no exceptions
    if (formData.media && smartVerification) {
      return smartVerification.canSubmit;
    }
    
    // Allow submission without image
    return true;
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return "Verifying & Submitting...";
    if (!formData.title || !formData.category || !formData.description) return "Fill Required Fields";
    if (formData.media && smartVerification && !smartVerification.canSubmit) return "Photo Failed Verification - Cannot Submit";
    return "Submit Complaint";
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/50">
        <div className="text-white">{t("loadingGoogleMaps")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/userpagebg.jpg')" }} />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      <motion.header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 20, stiffness: 300 }}>
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <motion.button onClick={() => navigate(-1)} className="flex items-center text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ArrowLeft className="h-5 w-5 mr-2" /> {t("back")}
          </motion.button>

          <motion.div className="text-xl md:text-2xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t("raiseComplaint")}
          </motion.div>

          <div className="w-10" />
        </div>
      </motion.header>

      <CustomModal isOpen={showSuccessPopup} onClose={closePopupAndNavigate}>
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">{t("reportSubmitted")}</h3>
              <div className="text-center space-y-3">
                <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                  <p className="text-green-200 text-sm mb-2"><strong>{t("reportId")}:</strong> {submittedDetails?.reportId}</p>
                  <p className="text-green-200 text-sm"><strong>{t("assignedTo")}:</strong> {submittedDetails?.municipality}</p>
                </div>
                <p className="text-white/80 text-sm">{t("complaintSubmittedMessage")}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button onClick={closePopupAndNavigate} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {t("viewMyReports")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CustomModal>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-16">
        <motion.div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-xl text-red-200 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{t("complaintTitle")} *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder={t("briefDescription")}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Category *</label>
              <select style={{backgroundColor:"transparent"}} name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-3 bg-black backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200">
                <option style={{backgroundColor:"gray"}} value="">Select a category</option>
                <option style={{backgroundColor:"gray"}} value="Infrastructure">Infrastructure</option>
                <option style={{backgroundColor:"gray"}} value="Sanitation">Sanitation</option>
                <option style={{backgroundColor:"gray"}} value="Street Lighting">Street Lighting</option>
                <option style={{backgroundColor:"gray"}} value="Water Supply">Water Supply</option>
                <option style={{backgroundColor:"gray"}} value="Traffic">Traffic</option>
                <option style={{backgroundColor:"gray"}} value="Parks">Parks</option>
                <option style={{backgroundColor:"gray"}} value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{t("description")} *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder={t("provideDetails")} required className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60" />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Problem Location *</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 z-10 pointer-events-none" />
                  <gmp-place-autocomplete
                    ref={acRef}
                    included-region-codes="IN"
                    placeholder="Search problem location..."
                    style={{
                      display: 'block',
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <motion.button 
                  type="button" 
                  onClick={getCurrentLocation} 
                  disabled={isGettingLocation} 
                  className="px-4 py-3 text-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl text-white/80 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  {isGettingLocation ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4 mr-2" />
                      {t("current")}
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Location Verification Display */}
              {userCurrentLocation && markerPosition && (
                <LocationVerification 
                  userLocation={userCurrentLocation}
                  problemLocation={markerPosition}
                />
              )}
            </div>

            {/* Google Map */}
            <div>
              {mapCenter ? (
                <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={14} onClick={onMapClick} options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
                  {markerPosition && (<Marker position={markerPosition} draggable={true} onDragEnd={onMarkerDragEnd} />)}
                </GoogleMap>
              ) : (
                <div className="w-full h-[250px] bg-white/5 rounded-xl border border-white/20 flex items-center justify-center text-white/60 text-sm">
                  {t("selectLocationToViewMap")}
                </div>
              )}
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{t("urgencyLevel")}</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(level => (
                  <button key={level} type="button" className={`py-2 text-sm rounded-xl border transition-all duration-200 ${
                      formData.urgency === level ? (level === 'high' ? 'bg-red-500/20 border-red-400 text-white' : level === 'medium' ? 'bg-yellow-500/20 border-yellow-400 text-white' : 'bg-green-500/20 border-green-400 text-white') : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`} onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}>
                    {t(level)}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload with Smart Verification - Updated Label */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Add Photo (Optional - Automatic verification required) *
              </label>
              {previewUrl && (
                <div className="mb-3 relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                  <button type="button" onClick={removeFile} className="absolute top-2 right-2 p-1 bg-red-500/70 rounded-full hover:bg-red-500/90">
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <p className="text-white/60 text-xs mt-1">{formData.media?.name}</p>
                  
                  {/* Smart Image Verification Component */}
                  <SmartImageVerification 
                    file={formData.media}
                    userLocation={userCurrentLocation}
                    problemLocation={markerPosition}
                    onVerificationComplete={handleSmartVerificationComplete}
                  />
                </div>
              )}
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Click to upload current issue photo</p>
                  <p className="text-white/40 text-xs">Max 50MB • JPEG, PNG, WebP only • Must pass verification</p>
                </div>
                <input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} />
              </label>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              disabled={isSubmitting || isGettingLocation || !canSubmit()} 
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70 disabled:cursor-not-allowed" 
              whileHover={{ scale: canSubmit() ? 1.02 : 1 }} 
              whileTap={{ scale: canSubmit() ? 0.98 : 1 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying & Submitting...
                </span>
              ) : (
                getSubmitButtonText()
              )}
            </motion.button>

            {/* Validation Status */}
            {!canSubmit() && !isSubmitting && (
              <div className="text-center text-yellow-300 text-sm space-y-1">
                {!formData.title || !formData.category || !formData.description ? 
                  <p>Please fill all required fields</p> :
                  formData.media && smartVerification && !smartVerification.canSubmit ?
                    <p className="text-red-300">Photo failed verification requirements and cannot be submitted</p> : null
                }
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}