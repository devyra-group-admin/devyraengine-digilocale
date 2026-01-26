import React, { useState } from 'react';
import { MapPin, Phone, Star, AlertCircle, Check, Users, Calendar, X } from 'lucide-react';
import BookingEnquiryModal from './BookingEnquiryModal';

const AccommodationDetails = ({
  selectedAccommodation,
  checkInDate,
  onCheckInDateChange,
  checkOutDate,
  onCheckOutDateChange,
  guests,
  onGuestsChange,
  showGuestSelector,
  onShowGuestSelectorToggle,
  onClose // Add onClose prop
}) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.max(1, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));
  };

  const totalPrice = selectedAccommodation.price * calculateNights();

  return (
    <>
      <div className="fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto w-full md:w-[400px] bg-white flex flex-col border-t md:border-t-0 md:border-l border-gray-200 shadow-2xl md:shadow-xl overflow-y-auto max-h-[75vh] md:max-h-none md:h-full z-[1000] md:z-20 font-sans rounded-t-3xl md:rounded-none">
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header Image & Title */}
        <div className="p-4 md:p-5 border-b border-gray-100">
          <div className="relative mb-4 group cursor-pointer overflow-hidden rounded-xl shadow-md">
            <img
              src={selectedAccommodation.images[0]}
              alt={selectedAccommodation.name}
              className="w-full h-40 md:h-48 object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                From R{selectedAccommodation.price}/night
              </div>
              <button 
                onClick={onClose}
                className="md:hidden bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-600 shadow-sm active:scale-95 transition-transform"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-start">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2 leading-tight">
              {selectedAccommodation.name}
            </h1>
            <button 
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Add to favorites"
            >
              <span className="text-2xl">♡</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={`${i < Math.floor(selectedAccommodation.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 font-medium">({selectedAccommodation.reviews} Reviews)</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 text-xs md:text-sm">
              <MapPin size={14} className="mr-2 text-teal-600 flex-shrink-0" />
              <span className="line-clamp-1">{selectedAccommodation.address}</span>
            </div>
            <div className="flex items-center text-gray-600 text-xs md:text-sm">
              <Phone size={14} className="mr-2 text-teal-600 flex-shrink-0" />
              <span>{selectedAccommodation.phone}</span>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="p-4 md:p-5 flex-1 bg-stone-50">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 mb-6 relative overflow-hidden">
            {/* Textured background hint */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

            <h2 className="text-lg font-serif font-bold text-gray-800 mb-4 relative z-10">Booking Details</h2>
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-teal-500 transition-shadow">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Check-In</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => onCheckInDateChange(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-gray-800 focus:ring-0 p-0"
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-teal-500 transition-shadow">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Check-Out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => onCheckOutDateChange(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-gray-800 focus:ring-0 p-0"
                />
              </div>
            </div>
            
            {/* Guests */}
            <div className="mb-6 relative z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-teal-500 transition-shadow relative">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Guests</label>
                <button
                  onClick={onShowGuestSelectorToggle}
                  className="w-full flex items-center justify-between bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
                >
                  <span>{guests.adults} Adults, {guests.children} Children</span>
                  <Users size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Guest Selector Popover */}
              {showGuestSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Adults</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onGuestsChange(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                      >-</button>
                      <span className="text-base font-bold text-gray-800 w-4 text-center">{guests.adults}</span>
                      <button
                        onClick={() => onGuestsChange(prev => ({ ...prev, adults: Math.min(selectedAccommodation.maxGuests, prev.adults + 1) }))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Children</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onGuestsChange(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                      >-</button>
                      <span className="text-base font-bold text-gray-800 w-4 text-center">{guests.children}</span>
                      <button
                        onClick={() => onGuestsChange(prev => ({ ...prev, children: Math.min(selectedAccommodation.maxGuests - guests.adults, prev.children + 1) }))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations */}
            {checkInDate && checkOutDate && (
              <div className="bg-teal-50/50 rounded-lg p-3 mb-6 relative z-10 border border-teal-100">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>R{selectedAccommodation.price} x {calculateNights()} nights</span>
                  <span className="font-medium">R{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-teal-800 pt-2 border-t border-teal-200/50">
                  <span>Total</span>
                  <span>R{totalPrice}</span>
                </div>
              </div>
            )}
            
            {/* CTAs */}
            <div className="space-y-3 relative z-10">
              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center group">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>Book Now</span>
                </div>
                <span className="text-[10px] opacity-80 group-hover:opacity-100">Secure Booking via LekkerSlaap</span>
              </button>
              
              <button 
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center group"
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>Send Booking Enquiry</span>
                </div>
                <span className="text-[10px] opacity-80 group-hover:opacity-100">Direct Request to {selectedAccommodation.name}</span>
              </button>
            </div>
            
            {/* Logos */}
            <div className="flex items-center justify-center gap-4 mt-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for logos in screenshot */}
               <div className="flex items-center text-[10px] text-gray-500 font-bold bg-white px-2 py-1 rounded border border-gray-200">
                 <span className="text-blue-600 mr-1">Lekke</span>Slaap
               </div>
               <div className="flex items-center text-[10px] text-gray-500 font-bold bg-white px-2 py-1 rounded border border-gray-200">
                 <span className="mr-1">📧</span> Email
               </div>
            </div>

          </div>
          
          {/* Info Sections */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedAccommodation.description}</p>
            </div>
            
            <div>
              <h3 className="font-serif font-bold text-gray-800 mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAccommodation.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingEnquiryModal 
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        accommodationName={selectedAccommodation.name}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        guests={guests}
      />
    </>
  );
};

export default AccommodationDetails;