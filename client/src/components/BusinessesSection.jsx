import React, { useRef, useState, useEffect } from 'react';
import { Star, MapPin, Phone, Globe, Navigation, X, ZoomIn, ZoomOut } from 'lucide-react';

const BusinessesSection = ({ searchQuery }) => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(true); // Map-first on mobile

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

  // Filter businesses by search query
  const filteredPlaces = places.filter(place => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return place.name.toLowerCase().includes(query) || 
           place.description.toLowerCase().includes(query) ||
           place.category.toLowerCase().includes(query);
  });

  // Load Leaflet
  useEffect(() => {
    if (typeof window.L !== 'undefined') {
      console.log('Leaflet already loaded');
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
        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const leafletScript = document.createElement('script');
          leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          
          // Wait for script to actually load and window.L to be available
          leafletScript.onload = () => {
            // Poll for window.L to be available
            const checkLeaflet = setInterval(() => {
              if (typeof window.L !== 'undefined') {
                console.log('Leaflet loaded and available');
                clearInterval(checkLeaflet);
                setLeafletLoaded(true);
              }
            }, 50);
            
            // Timeout after 5 seconds
            setTimeout(() => {
              clearInterval(checkLeaflet);
              if (typeof window.L === 'undefined') {
                console.error('Leaflet failed to load after 5 seconds');
              }
            }, 5000);
          };
          
          leafletScript.onerror = () => {
            console.error('Failed to load Leaflet script');
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
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) {
      console.log('Map init check:', { leafletLoaded, hasMapRef: !!mapRef.current, hasInstance: !!mapInstanceRef.current });
      return;
    }

    console.log('Initializing map...');
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

    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up map');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Add ResizeObserver to handle container size changes
  useEffect(() => {
    if (!mapRef.current || !mapInstanceRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        console.log('Map container resized, invalidating size');
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 50);
      }
    });
    
    resizeObserver.observe(mapRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [mapInstanceRef.current]);

  // Handle map resize when details panel toggles
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [selectedBusiness]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];

    // Add markers for filtered places
    filteredPlaces.forEach(place => {
      const isSelected = selectedBusiness?.id === place.id;
      
      const iconHtml = `
        <div style="
          background-color: ${isSelected ? '#0d9488' : 'white'};
          border: 3px solid #0d9488;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transform: ${isSelected ? 'scale(1.3)' : 'scale(1)'};
          transition: all 200ms ease;
          cursor: pointer;
        ">
          <span style="
            color: ${isSelected ? 'white' : '#0d9488'};
            font-size: 16px;
          ">📍</span>
        </div>`;

      const marker = window.L.marker(place.position, {
        icon: window.L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(mapInstanceRef.current);

      marker.on('click', () => {
        setSelectedBusiness(place);
        mapInstanceRef.current.setView(place.position, 16, { animate: true });
      });

      markersRef.current.push(marker);
    });
  }, [filteredPlaces, selectedBusiness]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-gray-50 relative">
      {/* Business List Sidebar */}
      <div className={`w-full md:w-80 bg-white flex flex-col border-r border-gray-200 shadow-sm overflow-y-auto ${showMobileMap ? 'hidden md:flex' : 'flex'} h-full`}>
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 sticky top-0 bg-white z-10">Local Businesses</h2>
          <div className="space-y-3">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedBusiness(place)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedBusiness?.id === place.id 
                    ? 'bg-teal-50 border-2 border-teal-500 shadow-md' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex md:block space-x-4 md:space-x-0">
                  <img
                    src={place.photo}
                    alt={place.name}
                    className="w-24 h-24 md:w-full md:h-32 rounded-lg object-cover mb-0 md:mb-3 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 md:mb-2">{place.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                       <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={`${i < Math.floor(place.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {place.rating} ({place.reviews})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{place.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Center */}
      <div className={`flex-1 relative bg-gray-100 min-h-0 h-full ${!showMobileMap ? 'hidden md:block' : 'block'}`}>
        <div ref={mapRef} className="absolute inset-0" style={{ minHeight: '300px' }} />
        
        {/* Map Controls */}
        <div className="absolute top-5 right-5 flex flex-col space-y-2 z-[400]">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ZoomOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000]">
        <button
          onClick={() => {
             const newState = !showMobileMap;
             setShowMobileMap(newState);
             if (newState) {
               // Trigger resize when switching to map
               setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
             }
          }}
          className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 font-semibold hover:bg-gray-800 transition-colors border border-gray-700"
        >
          {showMobileMap ? (
            <>
              <span className="mr-2">📄</span>
              <span>Show List</span>
            </>
          ) : (
            <>
              <MapPin size={18} />
              <span>Show Map</span>
            </>
          )}
        </button>
      </div>

      {/* Business Details Sidebar - Responsive Bottom Sheet / Panel */}
      {selectedBusiness && (
        <div className="fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto w-full md:w-[400px] bg-white flex flex-col border-t md:border-t-0 md:border-l border-gray-200 shadow-2xl md:shadow-xl overflow-y-auto max-h-[85vh] md:max-h-none md:h-full z-[3000] md:z-20 font-sans rounded-t-3xl md:rounded-none">
          {/* Mobile Drag Handle */}
          <div className="md:hidden flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="p-4 md:p-5 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{selectedBusiness.name}</h2>
              <button 
                onClick={() => setSelectedBusiness(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            
            <img 
              src={selectedBusiness.photo} 
              alt={selectedBusiness.name}
              className="w-full h-40 md:h-48 object-cover rounded-xl mb-4 shadow-sm"
            />
            
            <div className="flex items-center mb-3">
              <Star className="text-yellow-400 mr-1" size={16} fill="currentColor" />
              <span className="font-semibold mr-1 text-sm md:text-base">{selectedBusiness.rating}</span>
              <span className="text-gray-600 text-xs md:text-sm">({selectedBusiness.reviews} reviews)</span>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">{selectedBusiness.description}</p>
            
            <div className="space-y-3 pb-4">
              <div className="flex items-center">
                <MapPin className="text-green-700 mr-3 flex-shrink-0" size={16} />
                <span className="text-xs md:text-sm text-gray-700 line-clamp-1">{selectedBusiness.address}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-green-700 mr-3 flex-shrink-0" size={16} />
                <a href={`tel:${selectedBusiness.phone}`} className="text-xs md:text-sm text-green-700 font-medium hover:underline">
                  {selectedBusiness.phone}
                </a>
              </div>
              
              {selectedBusiness.website && (
                <div className="flex items-center">
                  <Globe className="text-green-700 mr-3 flex-shrink-0" size={16} />
                  <a 
                    href={selectedBusiness.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs md:text-sm text-green-700 font-medium hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              
              <div className="mt-4">
                <button 
                  onClick={() => {
                    if (selectedBusiness.position) {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedBusiness.position[0]},${selectedBusiness.position[1]}`, '_blank');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-green-800 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-900 transition-all active:scale-[0.98]"
                >
                  <Navigation size={18} />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessesSection;
