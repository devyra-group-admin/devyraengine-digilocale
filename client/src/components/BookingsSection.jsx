import React, { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
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
  setShowGuestSelector,
  showMobileMap,
  setShowMobileMap
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

  // Load Leaflet with better error handling and detection
  useEffect(() => {
    if (typeof window.L !== 'undefined') {
      setLeafletLoaded(true);
      return;
    }

    const loadLeaflet = async () => {
      try {
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCss = document.createElement('link');
          leafletCss.rel = 'stylesheet';
          leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(leafletCss);
        }

        // Load JS if not already loaded
        if (!document.querySelector('script[src*="leaflet.js"]') && typeof window.L === 'undefined') {
          const leafletScript = document.createElement('script');
          leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletScript.onload = () => {
            console.log('Leaflet loaded successfully');
            setLeafletLoaded(true);
          };
          leafletScript.onerror = (error) => {
            console.error('Failed to load Leaflet script:', error);
          };
          document.body.appendChild(leafletScript);
        } else {
          setLeafletLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map when Leaflet is loaded and component mounts
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      } catch (error) {
        console.error('Error cleaning up existing map:', error);
      }
    }

    try {
      console.log('Initializing map with Leaflet...');
      
      const map = window.L.map(mapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false,
        preferCanvas: true
      });

      // Add tile layer - CartoDB Voyager is cleaner and looks more premium
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      console.log('Map initialized successfully');

      // Force resize after various delays to ensure proper sizing
      const delays = [100, 300, 500, 1000];
      delays.forEach(delay => {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            console.log(`Invalidating map size at ${delay}ms`);
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
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
    <div className="flex flex-col md:flex-row w-full h-full bg-gray-50 relative">
      {/* Accommodation List */}
      <div className={`w-full md:w-80 h-full border-r border-gray-200 overflow-y-auto z-10 ${showMobileMap ? 'hidden md:block' : 'block'}`}>
        <AccommodationList
          accommodations={filteredAccommodations}
          selectedAccommodation={selectedAccommodation}
          onAccommodationSelect={onAccommodationSelect}
        />
      </div>
      
      {/* Map (Right) */}
      <div className={`flex-1 relative bg-gray-100 min-h-0 h-full ${!showMobileMap ? 'hidden md:block' : 'block'}`}>
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
          onClose={() => setSelectedAccommodation(null)}
        />
      )}
    </div>
  );
};

export default BookingsSection;