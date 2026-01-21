import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, MapPin, Star, Phone, Navigation, Globe, X, ZoomIn, ZoomOut } from 'lucide-react';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([-25.41682188170712, 30.10243602023188]);
  const [mapZoom, setMapZoom] = useState(16.5);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Extended sample data . Need to fix some locations and also add real pictures
  const places = [
    {
      id: 1,
      name: "Duck & Trout Restaurant",
      category: "Food & Drink",
      description: "Popular pub and restaurant on the main street.",
      address: "Hugenote St, Dullstroom",
      position: [-25.42392769985406, 30.10037451338561],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 2,
      name: "Mrs Simpson's",
      category: "Food & Drink",
      description: "Cozy restaurant with local cuisine.",
      address: "Main Street, Dullstroom",
      position: [-25.41545673927404, 30.107736413385332],
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Critchley Hackle Lodge",
      category: "Accommodation",
      description: "Luxury lodge with scenic views.",
      address: "Dullstroom Area",
      position: [-25.418347743222068, 30.109825753861376],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Dullstroom Inn",
      category: "Accommodation",
      description: "Historic inn in the heart of town.",
      address: "Central Dullstroom",
      position: [-25.41494493857514, 30.10727345386131],
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"
    },
  
    {
      id: 5,
      name: "Earth Gear",
      category: "Retail & Gifts",
      description: "Outdoor equipment and gifts.",
      address: "Shopping District",
      position: [-25.413330763950693, 30.11013720528195],
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop"
    },

    {
      id: 6,
      name: "Mavungana",
      category: "Accommodation",
      description: "Comfortable accommodation with mountain views.",
      address: "Dullstroom",
      position: [-25.424415320795934, 30.10008468454961],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
    },

    {
      id: 7,
      name: "Kosmas Stationery & Gift",
      category: "Retail & Gifts",
      description: "Stationery and unique gift items.",
      address: "Main Street, Dullstroom",
      position: [-25.412152156571196, 30.104644628018615],
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop"
    },

   
    {
      id: 8,
      name: "Birchcroft Preparatory School",
      category: "Tourism & Attractions",
      description: "Local educational institution.",
      address: "Dullstroom",
      position: [-25.41395311554934, 30.10588185006474],
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop"
    },
    {
      id: 9,
      name: "The Montreo School",
      category: "Tourism & Attractions",
      description: "Private school in the highlands.",
      address: "Dullstroom Area",
      position: [-25.411059606266303, 30.101963360852068],
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop"
    },
    {
      id: 10,
      name: "Barlack Attorneys",
      category: "Property & Real Estate",
      description: "Legal services and property consultation.",
      address: "Dullstroom",
      position: [-25.41535905346672, 30.106519790495973],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
    },
    {
      id: 11,
      name: "Zest Property Group",
      category: "Property & Real Estate",
      description: "Real estate services and property management.",
      address: "Dullstroom",
      position: [-25.41526686131065, 30.10289628896996],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
      id: 12,
      name: "Farms, Lodges & Estates",
      category: "Outdoor & Adventure",
      description: "Experience farm life and outdoor activities.",
      address: "Dullstroom",
      position: [-25.42142053247414, 30.103432158910046],
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
    }
  ];

  const categories = [
    { name: "Food & Drink", color: "#c77d3b", icon: "🍴" },
    { name: "Accommodation", color: "#5a8ba8", icon: "🛏️" },
    { name: "Retail & Gifts", color: "#e8b844", icon: "🎁" },
    { name: "Outdoor & Adventure", color: "#6b8e4e", icon: "🏕️" },
    { name: "Tourism & Attractions", color: "#d4a853", icon: "🎯" },
    { name: "Property & Real Estate", color: "#8b6f47", icon: "🏠" }
  ];

  const categoryColors = {
    "Food & Drink": "#c77d3b",
    "Accommodation": "#5a8ba8",
    "Retail & Gifts": "#e8b844",
    "Outdoor & Adventure": "#6b8e4e",
    "Tourism & Attractions": "#d4a853",
    "Property & Real Estate": "#8b6f47"
  };

  useEffect(() => {
    if (places.length > 0) {
      setSelectedPlace(places[0]);
    }
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    
    script.onload = () => {
      if (!mapInstanceRef.current && mapRef.current && window.L) {
        const map = window.L.map(mapRef.current, {
          zoomControl: false
        }).setView(mapCenter, mapZoom);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 20
        }).addTo(map);

        mapInstanceRef.current = map;
        updateMarkers();
      }
    };

    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [selectedCategory, selectedPlace, searchQuery]);

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const placesToShow = places.filter(place => {
      const matchesCategory = selectedCategory ? place.category === selectedCategory : true;
      const matchesSearch = searchQuery 
        ? place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.id.toString().includes(searchQuery)
        : true;
      return matchesCategory && matchesSearch;
    });

    placesToShow.forEach(place => {
      const isSelected = selectedPlace && selectedPlace.id === place.id;
      const categoryColor = categoryColors[place.category] || '#666';

      const iconHtml = `
        <div style="
          background-color: ${isSelected ? categoryColor : 'white'};
          border: 3px solid ${categoryColor};
          border-radius: 50%;
          width: ${isSelected ? '40px' : '30px'};
          height: ${isSelected ? '40px' : '30px'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? '20px' : '16px'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        ">
          ${categories.find(c => c.name === place.category)?.icon || '📍'}
        </div>
      `;

      const customIcon = window.L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [isSelected ? 40 : 30, isSelected ? 40 : 30],
        iconAnchor: [isSelected ? 20 : 15, isSelected ? 20 : 15]
      });

      const marker = window.L.marker(place.position, { icon: customIcon })
        .addTo(mapInstanceRef.current);

      marker.on('click', () => {
        handlePlaceClick(place);
        mapInstanceRef.current.setView(place.position, 16, { animate: true });
      });

      marker.bindPopup(`
        <div style="font-family: 'Segoe UI', sans-serif;">
          <strong style="font-size: 16px; color: #2d3e2d;">${place.name}</strong><br/>
          <span style="font-size: 13px; color: #666;">${place.category}</span><br/>
          <span style="font-size: 12px; color: #888;">${place.address}</span>
        </div>
      `);

      markersRef.current.push(marker);
    });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      if (selectedPlace) {
        mapInstanceRef.current.setView(selectedPlace.position, 16, { animate: true });
      } else {
        mapInstanceRef.current.setView(mapCenter, mapZoom, { animate: true });
      }
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedPlace(null);
    setSidebarOpen(true);
    setCategoryMenuOpen(false);
    setShowBottomNav(false);
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setSelectedCategory(null);
    setSidebarOpen(true);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(place.position, 16, { animate: true });
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory ? place.category === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.id.toString().includes(searchQuery)
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <h1 style={styles.logoTitle}>Dullstroom</h1>
          <span style={styles.logoSubtitle}>• DIGITAL •</span>
        </div>
        
        <div style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <button 
          style={styles.menuButton}
          onClick={() => setShowBottomNav(!showBottomNav)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Category Side Menu */}
        <div style={{...styles.categoryMenu, ...(categoryMenuOpen ? styles.categoryMenuOpen : {})}}>
          <button 
            style={styles.closeCategoryMenu}
            onClick={() => setCategoryMenuOpen(false)}
          >
            <X size={24} />
          </button>
          
          <h3 style={styles.categoryMenuTitle}>Categories</h3>
          
          <div style={styles.categoryMenuList}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                style={{...styles.categoryMenuItem, borderLeft: `5px solid ${cat.color}`}}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <span style={styles.categoryMenuIcon}>{cat.icon}</span>
                <span style={styles.categoryMenuText}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overlay for category menu */}
        {categoryMenuOpen && (
          <div 
            style={styles.overlay}
            onClick={() => setCategoryMenuOpen(false)}
          />
        )}

        {/* Map */}
        <div style={styles.mapContainer}>
          <div ref={mapRef} style={styles.map}></div>

          {/* Map Controls */}
          <div style={styles.mapControls}>
            <button 
              style={styles.controlButton}
              onClick={handleRecenter}
              title="Recenter map"
            >
              <MapPin size={20} />
              <span style={styles.controlButtonText}>Map</span>
            </button>
            <button 
              style={styles.controlButton}
              onClick={() => setCategoryMenuOpen(true)}
            >
              <span style={styles.controlButtonText}>Categories</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div style={styles.zoomControls}>
            <button 
              style={styles.zoomButton}
              onClick={handleZoomIn}
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              style={styles.zoomButton}
              onClick={handleZoomOut}
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{...styles.sidebar, ...(sidebarOpen ? styles.sidebarOpen : {})}}>
          <button 
            style={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>

          {selectedCategory && !selectedPlace && (
            <div style={styles.categoryView}>
              <h2 style={styles.categoryTitle}>
                <span style={styles.categoryIcon}>
                  {categories.find(c => c.name === selectedCategory)?.icon}
                </span>
                {selectedCategory}
              </h2>
              
              <div style={styles.placesList}>
                {filteredPlaces.map((place) => (
                  <div 
                    key={place.id} 
                    style={styles.placeCard}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div style={styles.placeCardImage}>
                      <img 
                        src={place.image} 
                        alt={place.name}
                        style={styles.image}
                      />
                    </div>
                    <div style={styles.placeCardContent}>
                      <h3 style={styles.placeCardName}>{place.name}</h3>
                      <p style={styles.placeCardDescription}>{place.description}</p>
                      <div style={styles.placeCardAddress}>
                        <MapPin size={14} color="#666" />
                        <span>{place.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPlace && (
            <div style={styles.placeDetails}>
              <div style={{...styles.categoryBadge, backgroundColor: categoryColors[selectedPlace.category]}}>
                <span style={styles.categoryBadgeIcon}>
                  {categories.find(c => c.name === selectedPlace.category)?.icon}
                </span>
                <span>{selectedPlace.category}</span>
              </div>
              
              {selectedPlace.featured && (
                <Star 
                  size={32} 
                  fill="#d4a853" 
                  color="#d4a853" 
                  style={styles.starIcon}
                />
              )}

              <h2 style={styles.placeName}>{selectedPlace.name}</h2>
              
              <div style={styles.placeImage}>
                <img 
                  src={selectedPlace.image} 
                  alt={selectedPlace.name}
                  style={styles.image}
                />
              </div>

              <p style={styles.placeDescription}>{selectedPlace.description}</p>
              
              <div style={styles.placeAddress}>
                <MapPin size={18} color="#666" />
                <span>{selectedPlace.address}</span>
              </div>

              <div style={styles.actionButtons}>
                <button style={styles.actionButton}>
                  <Phone size={18} />
                  Call
                </button>
                <button style={styles.actionButton}>
                  <Navigation size={18} />
                  Directions
                </button>
                <button style={styles.actionButton}>
                  <Globe size={18} />
                  Website
                </button>
              </div>

              {selectedPlace.featured && (
                <div style={styles.featuredBanner}>
                  ★ FEATURED ★
                </div>
              )}

              <div style={styles.businessOwnerSection}>
                <h3 style={styles.businessOwnerTitle}>
                  👤 Business Owners
                </h3>
                <div style={styles.businessActions}>
                  <button style={styles.claimButton}>✏️ Claim Listing</button>
                  <button style={styles.editButton}>📝 Edit Info</button>
                  <button style={styles.promoteButton}>📢 Promote</button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      {showBottomNav && (
        <>
          <div 
            style={styles.bottomNavOverlay}
            onClick={() => setShowBottomNav(false)}
          />
          <div style={{...styles.bottomNav, ...(showBottomNav ? styles.bottomNavOpen : {})}}>
            <div style={styles.bottomNavCategories}>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  style={{...styles.bottomNavCategory, borderTop: `4px solid ${cat.color}`}}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <span style={styles.bottomNavIcon}>{cat.icon}</span>
                  <span style={styles.bottomNavText}>{cat.name}</span>
                </button>
              ))}
            </div>
            
            <div style={styles.bottomNavPlaces}>
              {places.slice(0, 8).map((place) => (
                <button
                  key={place.id}
                  style={styles.bottomNavPlace}
                  onClick={() => {
                    handlePlaceClick(place);
                    setShowBottomNav(false);
                  }}
                >
                  <span style={styles.bottomNavPlaceIcon}>
                    {categories.find(c => c.name === place.category)?.icon}
                  </span>
                  <span style={styles.bottomNavPlaceText}>{place.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden',
    backgroundColor: '#f5f3ed'
  },
  header: {
    backgroundColor: '#f5f3ed',
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '2px solid #d4c5a8',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    zIndex: 1001
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: '120px'
  },
  logoTitle: {
    fontSize: 'clamp(24px, 5vw, 36px)',
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
    margin: 0,
    color: '#2d3e2d',
    fontWeight: 'normal'
  },
  logoSubtitle: {
    fontSize: 'clamp(10px, 2.5vw, 14px)',
    color: '#c77d3b',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginTop: '-5px'
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    minWidth: '150px',
    maxWidth: '500px'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 40px',
    border: '2px solid #d4c5a8',
    borderRadius: '8px',
    fontSize: 'clamp(14px, 3vw, 16px)',
    backgroundColor: 'white',
    color: '#333'
  },
  menuButton: {
    padding: '8px',
    backgroundColor: '#2d3e2d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    minWidth: '40px',
    justifyContent: 'center'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  },
  categoryMenu: {
    width: '280px',
    backgroundColor: '#f5f3ed',
    borderRight: '2px solid #d4c5a8',
    overflowY: 'auto',
    padding: '20px',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    transform: 'translateX(-100%)'
  },
  categoryMenuOpen: {
    transform: 'translateX(0)'
  },
  closeCategoryMenu: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    color: '#666',
    zIndex: 10
  },
  categoryMenuTitle: {
    fontSize: 'clamp(20px, 4vw, 24px)',
    color: '#2d3e2d',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  categoryMenuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  categoryMenuItem: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: 'bold',
    color: '#2d3e2d',
    textAlign: 'left',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  categoryMenuIcon: {
    fontSize: '24px'
  },
  categoryMenuText: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999
  },
  mapContainer: {
    flex: 1,
    position: 'relative'
  },
  map: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  mapControls: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 500
  },
  controlButton: {
    padding: '10px 15px',
    backgroundColor: '#2d3e2d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    whiteSpace: 'nowrap'
  },
  controlButtonText: {
    display: 'inline'
  },
  zoomControls: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 500
  },
  zoomButton: {
    padding: '8px',
    backgroundColor: 'white',
    color: '#2d3e2d',
    border: '2px solid #d4c5a8',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '40px',
    height: '40px'
  },
  sidebar: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#f5f3ed',
    borderLeft: '2px solid #d4c5a8',
    overflowY: 'auto',
    padding: '15px',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    transform: 'translateX(100%)'
  },
  sidebarOpen: {
    transform: 'translateX(0)'
  },
  closeSidebar: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    color: '#666',
    zIndex: 10
  },
  categoryView: {
    marginTop: '20px'
  },
  categoryTitle: {
    fontSize: 'clamp(22px, 5vw, 28px)',
    color: '#2d3e2d',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  placesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  placeCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  placeCardImage: {
    width: '100%',
    height: '150px',
    overflow: 'hidden'
  },
  placeCardContent: {
    padding: '15px'
  },
  placeCardName: {
    fontSize: 'clamp(16px, 4vw, 20px)',
    color: '#2d3e2d',
    marginBottom: '8px',
    fontWeight: 'bold'
  },
  placeCardDescription: {
    fontSize: 'clamp(13px, 3vw, 15px)',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.4'
  },
  placeCardAddress: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'clamp(12px, 2.5vw, 13px)',
    color: '#888'
  },
  placeDetails: {
    marginTop: '20px'
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  categoryBadgeIcon: {
    fontSize: '16px'
  },
  starIcon: {
    position: 'absolute',
    top: '20px',
    right: '50px'
  },
  placeName: {
    fontSize: 'clamp(20px, 5vw, 28px)',
    color: '#2d3e2d',
    marginTop: '10px',
    marginBottom: '15px'
  },
  placeImage: {
    width: '100%',
    height: 'clamp(150px, 30vw, 200px)',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '15px'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeDescription: {
    fontSize: 'clamp(14px, 3vw, 16px)',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px'
  },
  placeAddress: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    color: '#666',
    marginBottom: '20px'
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px'
  },
  actionButton: {
    flex: '1 1 calc(33.333% - 6px)',
    minWidth: '80px',
    padding: '10px 8px',
    backgroundColor: 'white',
    border: '2px solid #d4c5a8',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: 'clamp(11px, 2.5vw, 14px)',
    fontWeight: 'bold',
    color: '#2d3e2d'
  },
  featuredBanner: {
    backgroundColor: '#2d3e2d',
    color: '#d4a853',
    textAlign: 'center',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '20px'
  },
  businessOwnerSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px solid #d4c5a8'
  },
  businessOwnerTitle: {
    fontSize: 'clamp(16px, 4vw, 18px)',
    color: '#2d3e2d',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  businessActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  claimButton: {
    flex: '1 1 calc(50% - 4px)',
    minWidth: '100px',
    padding: '10px 8px',
    backgroundColor: 'white',
    border: '2px solid #2d3e2d',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 'clamp(11px, 2.5vw, 14px)',
    color: '#2d3e2d'
  },
  editButton: {
    flex: '1 1 calc(50% - 4px)',
    minWidth: '100px',
    padding: '10px 8px',
    backgroundColor: 'white',
    border: '2px solid #2d3e2d',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 'clamp(11px, 2.5vw, 14px)',
    color: '#2d3e2d'
  },
  promoteButton: {
    flex: '1 1 100%',
    padding: '10px 8px',
    backgroundColor: '#2d3e2d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(11px, 2.5vw, 14px)',
    fontWeight: 'bold'
  },
  toggleSidebarButton: {
    position: 'absolute',
    right: '15px',
    bottom: '20px',
    width: 'clamp(50px, 12vw, 60px)',
    height: 'clamp(50px, 12vw, 60px)',
    borderRadius: '50%',
    backgroundColor: '#2d3e2d',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 999
  },
  categoryIcon: {
    fontSize: '18px'
  },
  bottomNavOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1001
  },
  bottomNav: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '300px',
    backgroundColor: '#f5f3ed',
    borderLeft: '2px solid #d4c5a8',
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
    maxHeight: '100vh',
    overflowY: 'auto',
    zIndex: 1002,
    padding: '15px',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease'
  },
  bottomNavOpen: {
    transform: 'translateX(0)'
  },
  bottomNavCategories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    marginBottom: '20px'
  },
  bottomNavCategory: {
    padding: '12px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#2d3e2d',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  bottomNavIcon: {
    fontSize: '28px'
  },
  bottomNavText: {
    textAlign: 'center',
    lineHeight: '1.2'
  },
  bottomNavPlaces: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px'
  },
  bottomNavPlace: {
    padding: '10px',
    backgroundColor: 'white',
    border: '2px solid #d4c5a8',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#2d3e2d'
  },
  bottomNavPlaceIcon: {
    fontSize: '20px'
  },
  bottomNavPlaceText: {
    textAlign: 'center',
    lineHeight: '1.2',
    fontSize: '11px'
  }
};

export default App;
