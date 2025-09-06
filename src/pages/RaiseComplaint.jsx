import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, AlertCircle, Upload, X, Navigation, CheckCircle } from "lucide-react";
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
      coordinates: [0, 0], // [lng, lat]
      placeId: null,
      city: "",
      state: "",
      country: ""
    },
    urgency: "medium",
    media: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  // Load Maps JS API with Places library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    id: 'maps-script-places'
  });

  // Ref for the Place Autocomplete web component
  const acRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to force update the autocomplete input value
  const setAutocompleteValue = (value) => {
    if (acRef.current) {
      // Wait for the component to be fully rendered
      setTimeout(() => {
        const input = acRef.current.querySelector('input');
        if (input) {
          // Clear existing value
          input.value = '';
          // Set new value
          input.value = value;
          // Force the component to recognize the change
          const event = new Event('input', { bubbles: true, cancelable: true });
          input.dispatchEvent(event);
          
          // Also trigger change event
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

        // Fetch needed fields for details
        await place.fetchFields({
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'addressComponents']
        });

        // Extract lat/lng
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

  // Automatically get current location once on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError(t("geolocationNotSupported"));
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
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
            
            // Update the autocomplete display
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
          
          // Update the autocomplete display
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

  // Reverse geocode when user drags or clicks marker on map
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

          // Update the autocomplete display with the new address
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

  // Handle current location button click
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t("geolocationNotSupported"));
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
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
            
            // Update the autocomplete display
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
          
          // Update the autocomplete display
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError(t("fileSizeLimit"));
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        setError(t("invalidFileType"));
        return;
      }

      setFormData(prev => ({ ...prev, media: file }));
      setError("");

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, media: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.location.address || (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0)) {
      setError(t("selectValidLocation"));
      setIsSubmitting(false);
      return;
    }

    try {
      const submitFormData = new FormData();

      submitFormData.append('title', formData.title);
      submitFormData.append('category', formData.category);
      submitFormData.append('description', formData.description);
      submitFormData.append('urgency', formData.urgency);
      submitFormData.append('location[address]', formData.location.address);
      submitFormData.append('location[coordinates]', JSON.stringify(formData.location.coordinates));

      if (formData.media) submitFormData.append('media', formData.media);

      const response = await createReport(submitFormData);

      setSubmittedDetails({
        reportId: response.data.data.report.reportId,
        municipality: response.data.data.autoSelected?.municipality || t('municipalAuthority')
      });

      setShowSuccessPopup(true);

    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError(t("loginAgainToSubmit"));
        navigate('/login');
      } else {
        setError(t("submitReportError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopupAndNavigate = () => {
    setShowSuccessPopup(false);
    navigate(`/user/${userId}`);
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
              <label className="block text-white/80 text-sm font-medium mb-2">{t("category")} *</label>
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

            {/* Location - Made smaller similar to title input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{t("location")} *</label>
              <div className="flex gap-2">
                {/* Autocomplete Input - Same size as title input */}
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 z-10 pointer-events-none" />
                  <gmp-place-autocomplete
                    ref={acRef}
                    included-region-codes="IN"
                    placeholder={t("searchLocation")}
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
                
                {/* Current Location Button - Same height as title input */}
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

            {/* File Upload - Keep original perfect size */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{t("addPhotoVideo")}</label>
              {previewUrl && (
                <div className="mb-3 relative">
                  {formData.media?.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                  ) : (
                    <video src={previewUrl} className="w-full h-32 object-cover rounded-xl" controls />
                  )}
                  <button type="button" onClick={removeFile} className="absolute top-2 right-2 p-1 bg-red-500/70 rounded-full hover:bg-red-500/90"><X className="h-4 w-4 text-white" /></button>
                  <p className="text-white/60 text-xs mt-1">{formData.media?.name}</p>
                </div>
              )}
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">{t("clickToUpload")}</p>
                  <p className="text-white/40 text-xs">{t("max50MB")}</p>
                </div>
                <input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm" onChange={handleFileChange} />
              </label>
            </div>

            {/* Submit Button */}
            <motion.button type="submit" disabled={isSubmitting || isGettingLocation} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? (<span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t("submitting")}...</span>) : (t("submitComplaint"))}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}