import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, MapPin, Star, Phone, Navigation, Globe, X, ZoomIn, ZoomOut } from 'lucide-react';
import BookingsSection from './components/BookingsSection';
import accommodations from './data/accommodations';
import { communityEvents, eventCategories } from './data/communityEvents';

const App = () => {
  // View Mode State 
  const [viewMode, setViewMode] = useState('businesses'); // 'businesses', 'community', or 'bookings'
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedEventCategory, setSelectedEventCategory] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  // Original Business State
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 bg-green-800 text-white rounded-lg">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Three Views */}
      <div className="flex-1 flex">
        {/* Business View */}
        {viewMode === 'businesses' && (
          <>
            {/* Map Container */}
            <div className="flex-1 relative">
              <div ref={mapRef} className="w-full h-full"></div>

              {/* Map Controls */}
              <div className="absolute top-4 left-4 flex flex-col bg-white rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      const currentZoom = mapInstanceRef.current.getZoom();
                      mapInstanceRef.current.setZoom(currentZoom + 1);
                    }
                  }}
                  className="p-3 hover:bg-gray-100 border-b"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      const currentZoom = mapInstanceRef.current.getZoom();
                      mapInstanceRef.current.setZoom(currentZoom - 1);
                    }
                  }}
                  className="p-3 hover:bg-gray-100"
                >
                  <ZoomOut size={20} />
                </button>
              </div>

              {/* Search Bar for Mobile */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 md:hidden">
                <div className="relative w-80 bg-white rounded-lg shadow-lg">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for businesses..."
                    className="w-full pl-10 pr-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Business Sidebar */}
            {selectedBusiness && (
              <div className="w-96 bg-white p-6 shadow-lg overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedBusiness.name}</h2>
                  <button 
                    onClick={() => setSelectedBusiness(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <img 
                    src={selectedBusiness.photo} 
                    alt={selectedBusiness.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex items-center mb-2">
                  <Star className="text-yellow-400 mr-1" size={16} fill="currentColor" />
                  <span className="font-semibold mr-1">{selectedBusiness.rating}</span>
                  <span className="text-gray-600">({selectedBusiness.reviews} reviews)</span>
                </div>
                
                <p className="text-gray-600 mb-4">{selectedBusiness.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-3" size={16} />
                    <span className="text-sm">{selectedBusiness.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-3" size={16} />
                    <span className="text-sm">{selectedBusiness.phone}</span>
                  </div>
                  
                  {selectedBusiness.website && (
                    <div className="flex items-center">
                      <Globe className="text-gray-400 mr-3" size={16} />
                      <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Navigation className="text-gray-400 mr-3" size={16} />
                    <button 
                      onClick={() => {
                        if (selectedBusiness.position) {
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedBusiness.position[0]},${selectedBusiness.position[1]}`, '_blank');
                        }
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Community View */}
        {viewMode === 'community' && (
          <div className="w-full">
            {/* Community Header */}
            <div className="bg-white p-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold mb-4">Community Events</h2>
              
              {/* Event Categories */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedEventCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedEventCategory 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Events
                </button>
                {eventCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedEventCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedEventCategory === category.id
                        ? `${category.bgColor} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`mr-2 ${category.textColor}`}>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {communityEvents
                  .filter(event => !selectedEventCategory || event.categoryId === selectedEventCategory)
                  .map((event) => {
                    const category = eventCategories.find(cat => cat.id === event.categoryId);
                    return (
                      <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.bgColor} text-white`}>
                              <span className="mr-1">{category.icon}</span>
                              {category.name}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span>{event.date} at {event.time}</span>
                            <span className="mx-2">•</span>
                            <span>{event.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>👥 {event.attendees}</span>
                              <span>❤️ {event.likes}</span>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Join Event
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Bookings View */}
        {viewMode === 'bookings' && (
          <BookingsSection
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
      </div>
    </div>
  );
};

export default App;