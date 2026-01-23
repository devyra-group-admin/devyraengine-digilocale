import React, { useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

const AccommodationMap = ({
  accommodations,
  selectedAccommodation,
  onAccommodationSelect,
  mapRef,
  mapInstanceRef,
  markersRef
}) => {
  
  
  // Update markers when accommodations or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !accommodations) return;

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
      if (!accommodation.position) return;
      
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
      } catch (error) {
        console.error('Error creating marker:', error);
      }
    });
  }, [accommodations, selectedAccommodation, onAccommodationSelect]);

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
      <div
        ref={mapRef}
        className="w-full h-full"
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