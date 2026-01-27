import React, { useState, useRef, useEffect } from 'react';

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 0.9], // percentages of screen height
  initialSnap = 0,
  showHandle = true
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const snapHeights = snapPoints.map(p => window.innerHeight * p);
  const currentHeight = snapHeights[currentSnap] - dragOffset;

  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(initialSnap);
      setDragOffset(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialSnap]);

  const handleTouchStart = (e) => {
    if (e.target.closest('.sheet-content-scrollable')) {
      const scrollEl = e.target.closest('.sheet-content-scrollable');
      if (scrollEl.scrollTop > 0) return;
    }

    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = snapHeights[currentSnap] - dragOffset;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const deltaY = e.touches[0].clientY - startY.current;
    const newOffset = Math.max(-50, deltaY); // Allow slight over-drag up
    setDragOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const finalHeight = snapHeights[currentSnap] - dragOffset;

    // Find closest snap point
    let closestSnap = 0;
    let minDistance = Infinity;

    snapHeights.forEach((height, index) => {
      const distance = Math.abs(finalHeight - height);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = index;
      }
    });

    // If dragged down significantly, close
    if (dragOffset > window.innerHeight * 0.2) {
      onClose();
    } else {
      setCurrentSnap(closestSnap);
    }

    setDragOffset(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[2999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-[65px] left-0 right-0 bg-white rounded-t-3xl z-[3000] flex flex-col shadow-2xl ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
        style={{
          height: Math.min(currentHeight, window.innerHeight - 100),
          maxHeight: 'calc(100vh - 100px)',
          transform: `translateY(${isDragging ? 0 : 0}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
