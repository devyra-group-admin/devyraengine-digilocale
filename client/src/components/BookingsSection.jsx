import React, { useRef, useState, useEffect } from 'react';
import AccommodationList from './AccommodationList';
import AccommodationMap from './AccommodationMap';
import AccommodationDetails from './AccommodationDetails';

const BookingsSection = ({
  searchQuery,
  accommodations,
  selectedAccommodation,
  setSelectedAccommodation,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guests,
  setGuests,
  showGuestSelector,
  setShowGuestSelector
}) => {
  // Create refs for the map
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Default map settings for Dullstroom
  const mapCenter = [-25.4175, 30.1544];
  const mapZoom = 13;

  // Filter accommodations by search query
  const filteredAccommodations = accommodations.filter(accommodation => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return accommodation.name.toLowerCase().includes(query) || 
           accommodation.description.toLowerCase().includes(query) ||
           accommodation.category.toLowerCase().includes(query);
  });

  // Load Leaflet
  useEffect(() => {
    if (typeof window.L !== 'undefined') {
      setLeafletLoaded(true);
      return;
    }

    const loadLeaflet = async () => {
      try {
        // Check if already loaded
        if (document.querySelector('link[href*="leaflet.css"]')) {
          setLeafletLoaded(true);
          return;
        }

        // Load Leaflet CSS
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCss);

        // Check if script already exists
        if (document.querySelector('script[src*="leaflet.js"]')) {
          setLeafletLoaded(true);
          return;
        }

        // Load Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletScript.onload = () => {
          setLeafletLoaded(true);
        };
        document.body.appendChild(leafletScript);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map when Leaflet is loaded and component mounts
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      const map = window.L.map(mapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Handlers
  const onAccommodationSelect = setSelectedAccommodation;
  const onCheckInDateChange = setCheckInDate;
  const onCheckOutDateChange = setCheckOutDate;
  const onGuestsChange = setGuests;
  const onShowGuestSelectorToggle = () => setShowGuestSelector(prev => !prev);

  return (
    <div className="flex w-full h-full bg-gray-50">
      {/* Accommodation List */}
      <AccommodationList
        accommodations={filteredAccommodations}
        selectedAccommodation={selectedAccommodation}
        onAccommodationSelect={onAccommodationSelect}
      />
      
      {/* Map (Right) */}
      <div className="flex-1 relative bg-gray-100 min-h-0">
        <AccommodationMap
          accommodations={filteredAccommodations}
          selectedAccommodation={selectedAccommodation}
          onAccommodationSelect={onAccommodationSelect}
          mapRef={mapRef}
          mapInstanceRef={mapInstanceRef}
          markersRef={markersRef}
        />
      </div>
      
      {/* Booking Details Sidebar */}
      {selectedAccommodation && (
        <AccommodationDetails
          selectedAccommodation={selectedAccommodation}
          checkInDate={checkInDate}
          onCheckInDateChange={onCheckInDateChange}
          checkOutDate={checkOutDate}
          onCheckOutDateChange={onCheckOutDateChange}
          guests={guests}
          onGuestsChange={onGuestsChange}
          showGuestSelector={showGuestSelector}
          onShowGuestSelectorToggle={onShowGuestSelectorToggle}
        />
      )}
    </div>
  );
};

export default BookingsSection;