
import React, { useState, useEffect } from 'react';
import {
  Search, Menu, MapPin, Star, Phone, Navigation, Globe, X, ZoomIn, ZoomOut,
  MessageCircle, ThumbsUp, MoreVertical, Plus, Calendar, ShoppingBag, Briefcase,
  AlertCircle, Fish, Wrench, Users, Bell, User, Cloud, Sun, MapPinned,
  Home, Utensils, Palette, TreePine, Coffee, ChevronRight, Sparkles
} from 'lucide-react';
import BookingsSection from './components/BookingsSection';
import accommodations from './data/accommodations';
import { communityEvents, eventCategories } from './data/communityEvents';
import { communityBoards, communityPosts } from './data/communityBoards';
import CommunitySection from './components/CommunitySection';
import BusinessesSection from './components/BusinessesSection';
import AdminPanel from './components/AdminPanel';

const App = () => {
  // View Mode State
  const [viewMode, setViewMode] = useState('businesses');
  const [showMobileMap, setShowMobileMap] = useState(true);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedEventCategory, setSelectedEventCategory] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState('local-events');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Original Business State
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingsSearchQuery, setBookingsSearchQuery] = useState('');
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');

  // Mock weather data
  const weather = { temp: 18, condition: 'sunny', icon: Sun };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New event: Trout Festival this weekend!', time: '2h ago', unread: true },
    { id: 2, text: 'Your booking enquiry was received', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Categories for quick filters
  const categories = [
    { id: 'restaurants', name: "Restaurants", icon: Utensils, color: "bg-red-500" },
    { id: 'stays', name: "Stays", icon: Home, color: "bg-blue-500" },
    { id: 'activities', name: "Activities", icon: TreePine, color: "bg-green-500" },
    { id: 'arts', name: "Arts", icon: Palette, color: "bg-purple-500" },
    { id: 'cafes', name: "Cafés", icon: Coffee, color: "bg-amber-500" },
  ];

  // Navigation items with icons
  const navItems = [
    { id: 'businesses', label: 'Explore', icon: MapPinned, badge: null },
    { id: 'community', label: 'Community', icon: Users, badge: 3 },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: null },
    { id: 'admin', label: 'Admin', icon: MoreVertical, badge: null },
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

    if (accommodations.length > 0 && window.innerWidth >= 768) {
      setSelectedAccommodation(accommodations[0]);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-stone-100 overflow-hidden">
      {/* Header - Premium Design */}
      <header className="flex-none z-50">
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:flex items-center justify-between px-6 py-2 bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-green-100">
              <MapPin size={12} />
              Mpumalanga, South Africa
            </span>
            <span className="flex items-center gap-1.5">
              <Sun size={12} className="text-amber-400" />
              <span className="text-green-100">{weather.temp}°C</span>
              <span className="text-green-300">Sunny</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-green-200">
            <a href="#" className="hover:text-white transition-colors">About Dullstroom</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white/95 backdrop-blur-xl shadow-soft border-b border-gray-100">
          <div className="px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                {/* Logo Icon */}
                <div className="relative">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Accent dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                </div>

                {/* Logo Text */}
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-none flex items-baseline gap-1">
                    <span className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                      Dullstroom
                    </span>
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-px w-4 bg-gradient-to-r from-amber-500 to-transparent" />
                    <span className="text-[10px] md:text-[11px] text-amber-600 font-semibold tracking-wide uppercase">
                      Digital Guide
                    </span>
                    <div className="h-px w-4 bg-gradient-to-l from-amber-500 to-transparent" />
                  </div>
                </div>
              </div>

            {/* Desktop Search & Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${viewMode === 'businesses' ? 'places' : viewMode === 'bookings' ? 'stays' : 'posts'}...`}
                  className="w-72 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder:text-gray-400"
                  value={viewMode === 'businesses' ? searchQuery : viewMode === 'bookings' ? bookingsSearchQuery : communitySearchQuery}
                  onChange={(e) => {
                    if (viewMode === 'businesses') setSearchQuery(e.target.value);
                    else if (viewMode === 'bookings') setBookingsSearchQuery(e.target.value);
                    else setCommunitySearchQuery(e.target.value);
                  }}
                />
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Bell size={20} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-gray-100 overflow-hidden z-50 animate-scaleIn">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <button className="text-xs text-green-600 font-semibold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${notif.unread ? 'bg-green-50/50' : ''}`}>
                          <p className="text-sm text-gray-700">{notif.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  G
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">Guest</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                G
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 mt-4 bg-gray-100/80 rounded-xl p-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = viewMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-green-800 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Search & Controls */}
          <div className="md:hidden mt-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${viewMode === 'businesses' ? 'places' : viewMode === 'bookings' ? 'stays' : 'posts'}...`}
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-soft placeholder:text-gray-400"
                value={viewMode === 'businesses' ? searchQuery : viewMode === 'bookings' ? bookingsSearchQuery : communitySearchQuery}
                onChange={(e) => {
                  if (viewMode === 'businesses') setSearchQuery(e.target.value);
                  else if (viewMode === 'bookings') setBookingsSearchQuery(e.target.value);
                  else setCommunitySearchQuery(e.target.value);
                }}
              />
            </div>

            {/* Category Chips - Mobile */}
            {viewMode === 'businesses' && (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                        isSelected
                          ? `${cat.color} text-white shadow-md`
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={14} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Map/List Toggle */}
            {(viewMode === 'businesses' || viewMode === 'bookings') && (
              <div className="flex bg-gray-100/80 p-1 rounded-2xl self-center w-fit mx-auto shadow-inner-soft">
                <button
                  onClick={() => setShowMobileMap(false)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 ${
                    !showMobileMap
                      ? 'bg-white text-green-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Menu size={14} strokeWidth={2.5} />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setShowMobileMap(true)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 ${
                    showMobileMap
                      ? 'bg-white text-green-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MapPin size={14} strokeWidth={2.5} />
                  <span>Map</span>
                </button>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Desktop Category Bar & Quick Actions */}
        {viewMode === 'businesses' && (
          <div className="hidden md:block border-t border-gray-100 bg-gray-50/50">
            <div className="px-6 py-3 flex items-center justify-between">
              {/* Category Chips */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 mr-2">Quick filters:</span>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? `${cat.color} text-white shadow-sm`
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={14} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Featured Badge */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-amber-700">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="font-semibold">Trout Festival this weekend!</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row pb-20 md:pb-0 min-h-0 relative">
        {viewMode === 'businesses' && (
          <BusinessesSection
            searchQuery={searchQuery}
            showMobileMap={showMobileMap}
            setShowMobileMap={setShowMobileMap}
            selectedCategory={selectedCategory}
          />
        )}

        {viewMode === 'community' && (
          <CommunitySection searchQuery={communitySearchQuery} />
        )}

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

        {viewMode === 'admin' && (
          <AdminPanel />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-2 flex justify-around items-center z-[4000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {[
          { id: 'businesses', label: 'Explore', icon: MapPinned },
          { id: 'community', label: 'Community', icon: Users, badge: 3 },
          { id: 'bookings', label: 'Stay', icon: Calendar },
          { id: 'admin', label: 'More', icon: MoreVertical },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-300 active:scale-95 ${
                isActive ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-600 rounded-full animate-scaleIn" />
              )}
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-green-50 shadow-sm' : 'hover:bg-gray-50'
              }`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-all duration-300 ${isActive ? 'text-green-700' : ''}`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-tight transition-all duration-300 ${
                isActive ? 'text-green-700' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default App;
