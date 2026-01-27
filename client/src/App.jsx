
import React, { useState, useEffect } from 'react';
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
  const [showMobileMap, setShowMobileMap] = useState(true); // Map-first on mobile
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
  // Map handling moved to individual components

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
    
    // Set default accommodation - only for desktop to avoid blocking mobile view
    if (accommodations.length > 0 && window.innerWidth >= 768) {
      setSelectedAccommodation(accommodations[0]);
    }
  }, []);

  // Note: Leaflet loading is now handled in BookingsSection component

  // Map handling is now done in individual view components

  const filteredPlaces = places.filter(place => {
    const matchesSearch = searchQuery 
      ? place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-amber-200 flex-none z-50">
        <div className="px-3 md:px-4 py-2 md:py-3">
          {/* Top row: Logo and Search */}
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-3xl font-serif italic text-green-800 font-normal">
                Dullstroom
                <span className="block text-[10px] md:text-xs text-amber-600 font-bold tracking-widest -mt-1">
                  • DIGITAL •
                </span>
              </h1>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center space-x-4">
              {viewMode === 'businesses' && (
                <div className="relative">
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
                <div className="relative">
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
                <div className="relative">
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

          {/* Navigation Tabs - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
            <button 
              onClick={() => setViewMode('businesses')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'businesses' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Businesses
            </button>
            <button 
              onClick={() => setViewMode('community')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'community' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => setViewMode('bookings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'bookings' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Bookings
            </button>
            <button 
              onClick={() => setViewMode('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'admin' 
                  ? 'bg-white text-green-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Mobile Search & Map/List Toggle */}
          <div className="md:hidden mt-3 flex flex-col gap-3">
             {/* Map/List Switcher */}
            {(viewMode === 'businesses' || viewMode === 'bookings') && (
              <div className="flex bg-gray-100 p-1 rounded-xl self-center shadow-inner">
                <button 
                  onClick={() => setShowMobileMap(false)}
                  className={`flex items-center gap-2 px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${!showMobileMap ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500'}`}
                >
                  <Menu size={14} />
                  <span>LIST</span>
                </button>
                <button 
                  onClick={() => setShowMobileMap(true)}
                  className={`flex items-center gap-2 px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${showMobileMap ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500'}`}
                >
                  <MapPin size={14} />
                  <span>MAP</span>
                </button>
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${viewMode === 'businesses' ? 'businesses' : viewMode === 'bookings' ? 'accommodations' : 'posts'}...`}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all shadow-sm"
                value={viewMode === 'businesses' ? searchQuery : viewMode === 'bookings' ? bookingsSearchQuery : communitySearchQuery}
                onChange={(e) => {
                  if (viewMode === 'businesses') setSearchQuery(e.target.value);
                  else if (viewMode === 'bookings') setBookingsSearchQuery(e.target.value);
                  else setCommunitySearchQuery(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row pb-20 md:pb-0 min-h-0 relative">
        {/* Business View */}
        {viewMode === 'businesses' && (
          <BusinessesSection 
            searchQuery={searchQuery} 
            showMobileMap={showMobileMap} 
            setShowMobileMap={setShowMobileMap} 
          />
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
            showMobileMap={showMobileMap}
            setShowMobileMap={setShowMobileMap}
          />
        )}

        {/* Admin View */}
        {viewMode === 'admin' && (
          <AdminPanel />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-[4000] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setViewMode('businesses')}
          className={`flex flex-col items-center gap-1 ${viewMode === 'businesses' ? 'text-green-800' : 'text-gray-400'}`}
        >
          <div className={`p-1 rounded-lg ${viewMode === 'businesses' ? 'bg-green-50' : ''}`}>
             <ShoppingBag size={20} className={viewMode === 'businesses' ? 'fill-green-800/10' : ''} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Businesses</span>
        </button>
        
        <button 
          onClick={() => setViewMode('community')}
          className={`flex flex-col items-center gap-1 ${viewMode === 'community' ? 'text-green-800' : 'text-gray-400'}`}
        >
          <div className={`p-1 rounded-lg ${viewMode === 'community' ? 'bg-green-50' : ''}`}>
             <Users size={20} className={viewMode === 'community' ? 'fill-green-800/10' : ''} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Community</span>
        </button>
        
        <button 
          onClick={() => setViewMode('bookings')}
          className={`flex flex-col items-center gap-1 ${viewMode === 'bookings' ? 'text-green-800' : 'text-gray-400'}`}
        >
          <div className={`p-1 rounded-lg ${viewMode === 'bookings' ? 'bg-green-50' : ''}`}>
             <Calendar size={20} className={viewMode === 'bookings' ? 'fill-green-800/10' : ''} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Bookings</span>
        </button>
        
        <button 
          onClick={() => setViewMode('admin')}
          className={`flex flex-col items-center gap-1 ${viewMode === 'admin' ? 'text-green-800' : 'text-gray-400'}`}
        >
          <div className={`p-1 rounded-lg ${viewMode === 'admin' ? 'bg-green-50' : ''}`}>
             <MoreVertical size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Admin</span>
        </button>
      </nav>
    </div>
  );
};

export default App;