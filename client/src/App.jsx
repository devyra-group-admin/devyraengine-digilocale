import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, MapPin, Star, Phone, Navigation, Globe, X, ZoomIn, ZoomOut, MessageCircle, ThumbsUp, MoreVertical, Plus, Calendar, ShoppingBag, Briefcase, AlertCircle, Fish, Wrench, Users } from 'lucide-react';
import BookingsSection from './components/BookingsSection';
import accommodations from './data/accommodations';
import { communityEvents, eventCategories } from './data/communityEvents';
import { communityBoards, communityPosts } from './data/communityBoards';
import CommunitySection from './components/CommunitySection';
import BusinessesSection from './components/BusinessesSection';
import AdminPanel from './components/AdminPanel';

const App = () => {
  // View Mode State 
  const [viewMode, setViewMode] = useState('businesses'); // 'businesses', 'community', 'bookings', or 'admin'
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedEventCategory, setSelectedEventCategory] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState('local-events');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  // Original Business State
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingsSearchQuery, setBookingsSearchQuery] = useState('');
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');
  const mapRef = useRef(null);
  
  // Map and leaflet state
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Default map settings
  const mapCenter = [-25.4175, 30.1544];
  const mapZoom = 14;

  // Updated places data
  const places = [
    {
      id: 1,
      name: "The Highlander Restaurant",
      description: "Family-owned restaurant serving authentic South African cuisine with stunning mountain views",
      category: "Restaurants",
      address: "12 Hugenote St, Dullstroom, 1110",
      position: [-25.4175, 30.1544],
      photo: "https://images.unsplash.com/photo-1552566063-32e6af5d4bb8?w=400",
      rating: 4.7,
      reviews: 127,
      website: "https://highlander.co.za",
      phone: "+27 13 254 0031"
    },
    {
      id: 2,
      name: "Dullstroom Gallery",
      description: "Local art gallery featuring South African artists and handcrafted goods",
      category: "Art & Culture",
      address: "8 Tedderfield Rd, Dullstroom, 1110",
      position: [-25.4190, 30.1520],
      photo: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      rating: 4.5,
      reviews: 63,
      phone: "+27 13 254 0142"
    },
    {
      id: 3,
      name: "Trout Triangle Adventures",
      description: "Guided fishing tours and outdoor adventures in the Dullstroom area",
      category: "Activities",
      address: "15 Dam Rd, Dullstroom, 1110",
      position: [-25.4160, 30.1580],
      photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
      rating: 4.8,
      reviews: 89,
      website: "https://trout-adventures.co.za",
      phone: "+27 13 254 0089"
    }
  ];

  const categories = [
    { name: "Restaurants", icon: "🍽️", color: "#e74c3c" },
    { name: "Accommodations", icon: "🏨", color: "#3498db" },
    { name: "Activities", icon: "🎯", color: "#2ecc71" },
    { name: "Shopping", icon: "🛍️", color: "#f39c12" },
    { name: "Art & Culture", icon: "🎨", color: "#9b59b6" }
  ];

  // Icon mapping function
  const getIcon = (iconName) => {
    const icons = {
      Calendar,
      ShoppingBag,
      Briefcase,
      AlertCircle,
      Fish,
      Wrench,
      Users
    };
    return icons[iconName] || Calendar;
  };

  // Set default booking dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    setCheckInDate(tomorrow.toISOString().split('T')[0]);
    setCheckOutDate(dayAfter.toISOString().split('T')[0]);
    
    // Set default accommodation
    if (accommodations.length > 0) {
      setSelectedAccommodation(accommodations[0]);
    }
  }, []);

  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCss);

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

  // Initialize map (only for businesses view)
  useEffect(() => {
    if (leafletLoaded && viewMode === 'businesses' && mapRef.current && !mapInstanceRef.current) {
      try {
        const map = window.L.map(mapRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          zoomControl: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add business markers
        places.forEach(place => {
          const marker = window.L.marker(place.position)
            .addTo(map)
            .bindPopup(`<b>${place.name}</b><br>${place.description}`)
            .on('click', () => setSelectedBusiness(place));
        });

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }
  }, [leafletLoaded, viewMode]);

  // Cleanup map when switching views
  useEffect(() => {
    if (viewMode !== 'businesses' && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  }, [viewMode]);

  const filteredPlaces = places.filter(place => {
    const matchesSearch = searchQuery 
      ? place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-amber-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl md:text-3xl font-serif italic text-green-800 font-normal">
              Dullstroom
              <span className="block text-xs text-amber-600 font-bold tracking-widest -mt-1">
                • DIGITAL •
              </span>
            </h1>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('businesses')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'businesses' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Businesses
            </button>
            <button 
              onClick={() => setViewMode('community')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'community' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => setViewMode('bookings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'bookings' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Bookings
            </button>
            <button 
              onClick={() => setViewMode('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'admin' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {viewMode === 'businesses' && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            {viewMode === 'bookings' && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search accommodations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  value={bookingsSearchQuery}
                  onChange={(e) => setBookingsSearchQuery(e.target.value)}
                />
              </div>
            )}
            {viewMode === 'community' && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  value={communitySearchQuery}
                  onChange={(e) => setCommunitySearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Three Views */}
      <div className="flex-1 flex">
        {/* Business View */}
        {viewMode === 'businesses' && (
          <BusinessesSection searchQuery={searchQuery} />
        )}

        {/* Community View */}
        {viewMode === 'community' && (
          <CommunitySection searchQuery={communitySearchQuery} />
        )}

        {/* Bookings View */}
        {viewMode === 'bookings' && (
          <BookingsSection
            searchQuery={bookingsSearchQuery}
            accommodations={accommodations}
            selectedAccommodation={selectedAccommodation}
            setSelectedAccommodation={setSelectedAccommodation}
            checkInDate={checkInDate}
            setCheckInDate={setCheckInDate}
            checkOutDate={checkOutDate}
            setCheckOutDate={setCheckOutDate}
            guests={guests}
            setGuests={setGuests}
            showGuestSelector={showGuestSelector}
            setShowGuestSelector={setShowGuestSelector}
          />
        )}

        {/* Admin View */}
        {viewMode === 'admin' && (
          <AdminPanel />
        )}
      </div>
    </div>
  );
};

export default App;