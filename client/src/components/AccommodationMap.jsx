import React, { useEffect, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

const AccommodationMap = ({
  accommodations,
  selectedAccommodation,
  onAccommodationSelect,
  mapRef,
  mapInstanceRef,
  markersRef
}) => {
  // Add loading state
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Check if map is ready - watch for changes to map instance
  useEffect(() => {
    // Check periodically if map is initialized
    const checkMapReady = () => {
      if (mapInstanceRef.current && window.L) {
        setIsMapReady(true);
      }
    };
    
    checkMapReady();
    const interval = setInterval(checkMapReady, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  
  // Add ResizeObserver to handle container size changes
  useEffect(() => {
    if (!mapRef.current || !mapInstanceRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current && isMapReady) {
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
  }, [isMapReady]);
  
  // Update markers when accommodations or selection changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [selectedAccommodation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !accommodations || !isMapReady) return;

    console.log('Adding markers to map for', accommodations.length, 'accommodations');

    // Clear existing markers
    if (markersRef.current && markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        try {
          mapInstanceRef.current.removeLayer(marker);
        } catch (e) {
          console.error('Error removing marker:', e);
        }
      });
      markersRef.current = [];
    }

    // Add accommodation markers
    accommodations.forEach(accommodation => {
      if (!accommodation.position) {
        console.warn('No position found for accommodation:', accommodation.name);
        return;
      }
      
      console.log('Adding marker for:', accommodation.name, 'at position:', accommodation.position);
      
      const isSelected = selectedAccommodation && selectedAccommodation.id === accommodation.id;

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
            font-weight: bold;
          ">🏨</span>
        </div>`;

      try {
        const marker = window.L.marker(accommodation.position, {
          icon: window.L.divIcon({
            html: iconHtml,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(mapInstanceRef.current);

        marker.on('click', (e) => {
          e.originalEvent?.stopPropagation();
          onAccommodationSelect(accommodation);
          // Center map on selected accommodation
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(accommodation.position, 16, { animate: true });
          }
        });

        markersRef.current.push(marker);
        console.log('Marker added successfully for:', accommodation.name);
      } catch (error) {
        console.error('Error creating marker for', accommodation.name, ':', error);
      }
    });
    
    console.log('Total markers added:', markersRef.current.length);
  }, [accommodations, selectedAccommodation, onAccommodationSelect, isMapReady]);

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

  return (
    <div className="w-full h-full relative bg-gray-100">
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
      
      {/* Map Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#374151',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 200ms ease'
          }}
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#374151',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 200ms ease'
          }}
        >
          <ZoomOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default AccommodationMap;