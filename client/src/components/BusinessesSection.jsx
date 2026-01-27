import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, MapPin, Phone, Globe, Navigation, X, ZoomIn, ZoomOut, Heart, Share2, ChevronLeft, ChevronRight, List, Layers } from 'lucide-react';
import ImageWithFallback from './ui/ImageWithFallback';

const BusinessesSection = ({ searchQuery, showMobileMap, setShowMobileMap, selectedCategory }) => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [hoveredBusiness, setHoveredBusiness] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const carouselRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Business data
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

  const mapCenter = [-25.4175, 30.1544];
  const mapZoom = 14;

  // Category mapping for filter
  const categoryMap = {
    'restaurants': 'Restaurants',
    'activities': 'Activities',
    'arts': 'Art & Culture',
  };

  // Filter businesses
  const filteredPlaces = places.filter(place => {
    if (selectedCategory && categoryMap[selectedCategory]) {
      if (place.category !== categoryMap[selectedCategory]) return false;
    }
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return place.name.toLowerCase().includes(query) ||
      place.description.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query);
  });

  // Toggle favorite
  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Select business and center map
  const selectBusiness = useCallback((place, shouldOpenDetails = false) => {
    setSelectedBusiness(place);
    setShowDetails(shouldOpenDetails);

    // Find index and scroll carousel
    const index = filteredPlaces.findIndex(p => p.id === place.id);
    if (index !== -1) {
      setActiveCardIndex(index);
      // Scroll carousel to card
      if (carouselRef.current) {
        const cardWidth = 280;
        carouselRef.current.scrollTo({
          left: index * (cardWidth + 12) - 16,
          behavior: 'smooth'
        });
      }
    }

    // Center map on selected place
    if (mapInstanceRef.current && place.position) {
      mapInstanceRef.current.flyTo(place.position, 16, { duration: 0.8 });
    }
  }, [filteredPlaces]);

  // Handle carousel scroll
  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = 280 + 12;
    const newIndex = Math.round(scrollLeft / cardWidth);

    if (newIndex !== activeCardIndex && newIndex >= 0 && newIndex < filteredPlaces.length) {
      setActiveCardIndex(newIndex);
      const place = filteredPlaces[newIndex];
      setSelectedBusiness(place);

      // Center map on this place
      if (mapInstanceRef.current && place.position) {
        mapInstanceRef.current.flyTo(place.position, 15, { duration: 0.5 });
      }
    }
  }, [activeCardIndex, filteredPlaces]);

  // Scroll to next/prev card
  const scrollToCard = (direction) => {
    const newIndex = direction === 'next'
      ? Math.min(activeCardIndex + 1, filteredPlaces.length - 1)
      : Math.max(activeCardIndex - 1, 0);

    if (filteredPlaces[newIndex]) {
      selectBusiness(filteredPlaces[newIndex]);
    }
  };

  // Load Leaflet
  useEffect(() => {
    if (typeof window.L !== 'undefined') {
      setLeafletLoaded(true);
      return;
    }

    const loadLeaflet = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCss = document.createElement('link');
          leafletCss.rel = 'stylesheet';
          leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(leafletCss);
        }

        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const leafletScript = document.createElement('script');
          leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletScript.onload = () => {
            const checkLeaflet = setInterval(() => {
              if (typeof window.L !== 'undefined') {
                clearInterval(checkLeaflet);
                setLeafletLoaded(true);
              }
            }, 50);
            setTimeout(() => clearInterval(checkLeaflet), 5000);
          };
          document.body.appendChild(leafletScript);
        }
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      const map = window.L.map(mapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      [100, 300, 500, 1000].forEach(delay => {
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), delay);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // ResizeObserver
  useEffect(() => {
    if (!mapRef.current || !mapInstanceRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 50);
    });
    resizeObserver.observe(mapRef.current);
    return () => resizeObserver.disconnect();
  }, [mapInstanceRef.current]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];

    filteredPlaces.forEach((place, index) => {
      const isSelected = selectedBusiness?.id === place.id;
      const isHovered = hoveredBusiness?.id === place.id;

      const getEmoji = (cat) => {
        if (cat.includes('Restaurant')) return '🍽️';
        if (cat.includes('Art')) return '🎨';
        if (cat.includes('Activities')) return '🎯';
        return '🏪';
      };

      const iconHtml = `
        <div style="
          background-color: ${isSelected ? '#059669' : isHovered ? '#10b981' : 'white'};
          color: ${isSelected || isHovered ? 'white' : '#111827'};
          padding: 8px;
          border-radius: ${isSelected ? '16px' : '50%'};
          border: 3px solid ${isSelected ? '#059669' : isHovered ? '#10b981' : '#e5e7eb'};
          font-size: ${isSelected ? '20px' : '18px'};
          box-shadow: 0 4px 15px rgba(0, 0, 0, ${isSelected ? '0.25' : '0.15'});
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '48px' : '40px'};
          height: ${isSelected ? '48px' : '40px'};
          transform: ${isSelected ? 'scale(1.1) translateY(-4px)' : 'scale(1)'};
        ">
          ${getEmoji(place.category)}
        </div>`;

      const marker = window.L.marker(place.position, {
        icon: window.L.divIcon({
          html: iconHtml,
          className: 'business-div-marker',
          iconSize: [isSelected ? 48 : 40, isSelected ? 48 : 40],
          iconAnchor: [isSelected ? 24 : 20, isSelected ? 24 : 20]
        }),
        zIndexOffset: isSelected ? 1000 : 0
      }).addTo(mapInstanceRef.current);

      marker.on('click', () => selectBusiness(place, true));

      markersRef.current.push(marker);
    });

    // Fit bounds only on initial load
    if (!selectedBusiness && filteredPlaces.length > 0 && mapInstanceRef.current) {
      const bounds = window.L.latLngBounds(filteredPlaces.map(p => p.position));
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], animate: true });
    }
  }, [filteredPlaces, selectedBusiness, hoveredBusiness, selectBusiness]);

  // Select first place on load for map view
  useEffect(() => {
    if (showMobileMap && filteredPlaces.length > 0 && !selectedBusiness) {
      setSelectedBusiness(filteredPlaces[0]);
      setActiveCardIndex(0);
    }
  }, [showMobileMap, filteredPlaces]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-gray-50 relative">
      {/* List View - Desktop sidebar or Mobile full screen */}
      <div className={`w-full md:w-80 bg-white flex flex-col border-r border-gray-100 shadow-sm overflow-hidden ${showMobileMap ? 'hidden md:flex' : 'flex'} h-full`}>
        <div className="p-4 md:p-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Explore Dullstroom</h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} to discover
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {filteredPlaces.map((place, index) => (
            <div
              key={place.id}
              onClick={() => {
                selectBusiness(place, true);
                setShowMobileMap(true);
              }}
              onMouseEnter={() => setHoveredBusiness(place)}
              onMouseLeave={() => setHoveredBusiness(null)}
              className={`group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedBusiness?.id === place.id
                  ? 'ring-2 ring-green-500 shadow-elevated scale-[1.01]'
                  : 'bg-white border border-gray-100 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 active:scale-[0.99]'
              }`}
            >
              <div className="relative h-36 md:h-40 overflow-hidden">
                <ImageWithFallback src={place.photo} alt={place.name} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {place.category}
                  </span>
                  <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-current" />
                    <span className="text-xs font-bold text-gray-900">{place.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-base font-bold text-white leading-tight drop-shadow-md line-clamp-1">
                    {place.name}
                  </h3>
                </div>
              </div>

              <div className="p-3 bg-white">
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-2">
                  {place.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-400">
                    <MapPin size={12} className="mr-1" />
                    <span className="line-clamp-1">{place.address.split(',')[0]}</span>
                  </div>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    View <Navigation size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredPlaces.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No places found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </div>
        <div className="h-24 md:h-0" />
      </div>

      {/* Map View */}
      <div className={`flex-1 relative bg-gray-100 min-h-0 h-full ${!showMobileMap ? 'hidden md:block' : 'flex flex-col'}`}>
        <div ref={mapRef} className="absolute inset-0" style={{ minHeight: '300px' }} />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[400]">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-3 bg-white rounded-xl shadow-elevated hover:bg-gray-50 transition-all active:scale-95"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-3 bg-white rounded-xl shadow-elevated hover:bg-gray-50 transition-all active:scale-95"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Place count badge */}
        <div className="absolute top-4 left-4 z-[400]">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-elevated flex items-center gap-2">
            <Layers size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-gray-700">{filteredPlaces.length} places</span>
          </div>
        </div>

        {/* Mobile Card Carousel - Airbnb style */}
        {showMobileMap && filteredPlaces.length > 0 && (
          <div className="absolute bottom-[85px] left-0 right-0 z-[500]">
            {/* Navigation arrows */}
            {activeCardIndex > 0 && (
              <button
                onClick={() => scrollToCard('prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {activeCardIndex < filteredPlaces.length - 1 && (
              <button
                onClick={() => scrollToCard('next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Cards carousel */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {filteredPlaces.map((place, index) => (
                <div
                  key={place.id}
                  onClick={() => selectBusiness(place, true)}
                  className={`flex-shrink-0 w-[280px] bg-white rounded-2xl shadow-elevated overflow-hidden snap-center transition-all duration-300 ${
                    selectedBusiness?.id === place.id
                      ? 'ring-2 ring-green-500 scale-[1.02]'
                      : 'active:scale-[0.98]'
                  }`}
                >
                  <div className="flex h-[100px]">
                    <div className="w-[100px] h-full flex-shrink-0">
                      <ImageWithFallback src={place.photo} alt={place.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Star size={12} className="text-amber-400 fill-current" />
                          <span className="text-xs font-bold text-gray-700">{place.rating}</span>
                          <span className="text-xs text-gray-400">({place.reviews})</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">
                          {place.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{place.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10} />
                          {place.address.split(',')[0]}
                        </span>
                        <button
                          onClick={(e) => toggleFavorite(place.id, e)}
                          className={`p-1 rounded-full transition-colors ${
                            favorites.includes(place.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                          }`}
                        >
                          <Heart size={14} fill={favorites.includes(place.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5 mt-2">
              {filteredPlaces.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeCardIndex ? 'w-4 bg-green-600' : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Panel - Opens when user taps "View" or marker */}
      {showDetails && selectedBusiness && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-[2999] md:hidden"
            onClick={() => setShowDetails(false)}
          />

          {/* Panel */}
          <div className="fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto w-full md:w-[400px] bg-white flex flex-col border-t md:border-t-0 md:border-l border-gray-100 shadow-2xl md:shadow-xl overflow-hidden max-h-[75vh] md:max-h-none md:h-full z-[3000] md:z-20 rounded-t-3xl md:rounded-none animate-slideUp md:animate-none">
            {/* Mobile header */}
            <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-300 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <h3 className="font-bold text-gray-900">{selectedBusiness.name}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Hero Image */}
              <div className="relative">
                <ImageWithFallback
                  src={selectedBusiness.photo}
                  alt={selectedBusiness.name}
                  className="w-full h-48 md:h-56"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={(e) => toggleFavorite(selectedBusiness.id, e)}
                    className={`p-2.5 rounded-full backdrop-blur-sm transition-all active:scale-95 ${
                      favorites.includes(selectedBusiness.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600'
                    }`}
                  >
                    <Heart size={18} fill={favorites.includes(selectedBusiness.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 transition-all active:scale-95">
                    <Share2 size={18} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-bold uppercase tracking-wider bg-green-500/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {selectedBusiness.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <div className="mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight hidden md:block">
                    {selectedBusiness.name}
                  </h2>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(selectedBusiness.rating) ? 'text-amber-400 fill-current' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{selectedBusiness.rating}</span>
                    <span className="text-sm text-gray-400">({selectedBusiness.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{selectedBusiness.description}</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">Address</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{selectedBusiness.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Phone</p>
                      <a href={`tel:${selectedBusiness.phone}`} className="text-sm font-semibold text-green-700 hover:underline">
                        {selectedBusiness.phone}
                      </a>
                    </div>
                  </div>

                  {selectedBusiness.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Globe size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Website</p>
                        <a
                          href={selectedBusiness.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-green-700 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    if (selectedBusiness.position) {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedBusiness.position[0]},${selectedBusiness.position[1]}`, '_blank');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <Navigation size={18} />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessesSection;
