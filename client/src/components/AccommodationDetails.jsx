import React, { useState } from 'react';
import { MapPin, Phone, Star, Users, Calendar, X, Heart, Share2, Wifi, Car, Coffee, Tv, Wind } from 'lucide-react';
import BookingEnquiryModal from './BookingEnquiryModal';
import ImageWithFallback from './ui/ImageWithFallback';

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
  onClose
}) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.max(1, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));
  };

  const totalPrice = selectedAccommodation.price * calculateNights();

  // Amenity icon mapping
  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Breakfast': Coffee,
    'TV': Tv,
    'Air Conditioning': Wind,
  };

  return (
    <>
      <div className="fixed md:relative bottom-[65px] md:bottom-auto left-0 md:left-auto right-0 md:right-auto w-full md:w-[420px] bg-white flex flex-col border-t md:border-t-0 md:border-l border-gray-100 shadow-2xl md:shadow-xl overflow-hidden max-h-[60vh] md:max-h-none md:h-full z-[1000] md:z-20 font-sans rounded-t-3xl md:rounded-none animate-slideUp md:animate-none">
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-2 bg-white sticky top-0 z-10">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto sheet-content-scrollable">
          {/* Hero Image Section */}
          <div className="relative">
            <ImageWithFallback
              src={selectedAccommodation.images[0]}
              alt={selectedAccommodation.name}
              className="w-full h-44 md:h-52"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-full backdrop-blur-sm transition-all active:scale-95 ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white transition-all active:scale-95">
                <Share2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="md:hidden p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Price tag */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                <span className="text-xl font-bold text-gray-900">R{selectedAccommodation.price}</span>
                <span className="text-sm text-gray-500">/night</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            {/* Title & Rating */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {selectedAccommodation.name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(selectedAccommodation.rating) ? 'text-amber-400 fill-current' : 'text-gray-200'}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-1">{selectedAccommodation.rating}</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{selectedAccommodation.reviews} reviews</span>
              </div>

              <div className="flex items-center text-gray-500 text-sm mt-2">
                <MapPin size={14} className="mr-1.5 text-green-600 flex-shrink-0" />
                <span className="line-clamp-1">{selectedAccommodation.address}</span>
              </div>
            </div>

            {/* Quick Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedAccommodation.amenities?.slice(0, 4).map((amenity, index) => {
                const IconComponent = amenityIcons[amenity] || Coffee;
                return (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    <IconComponent size={12} />
                    {amenity}
                  </span>
                );
              })}
              {selectedAccommodation.amenities?.length > 4 && (
                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  +{selectedAccommodation.amenities.length - 4} more
                </span>
              )}
            </div>

            {/* Booking Card */}
            <div className="bg-gradient-to-br from-stone-50 to-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
              <h2 className="text-sm font-bold text-gray-800 mb-3">Book Your Stay</h2>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white border border-gray-200 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => onCheckInDateChange(e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-semibold text-gray-800 focus:ring-0 p-0"
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => onCheckOutDateChange(e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-semibold text-gray-800 focus:ring-0 p-0"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative mb-3">
                <div className="bg-white border border-gray-200 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</label>
                  <button
                    onClick={onShowGuestSelectorToggle}
                    className="w-full flex items-center justify-between bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
                  >
                    <span>{guests.adults} Adults, {guests.children} Children</span>
                    <Users size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Guest Selector Dropdown */}
                {showGuestSelector && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-elevated p-4 z-50 animate-scaleIn">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">Adults</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onGuestsChange(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >-</button>
                        <span className="text-base font-bold text-gray-800 w-4 text-center">{guests.adults}</span>
                        <button
                          onClick={() => onGuestsChange(prev => ({ ...prev, adults: Math.min(selectedAccommodation.maxGuests, prev.adults + 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Children</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onGuestsChange(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >-</button>
                        <span className="text-base font-bold text-gray-800 w-4 text-center">{guests.children}</span>
                        <button
                          onClick={() => onGuestsChange(prev => ({ ...prev, children: Math.min(selectedAccommodation.maxGuests - guests.adults, prev.children + 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {checkInDate && checkOutDate && (
                <div className="bg-green-50/50 rounded-xl p-3 mb-3 border border-green-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>R{selectedAccommodation.price} × {calculateNights()} nights</span>
                    <span className="font-medium">R{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-green-800 pt-2 border-t border-green-200/50">
                    <span>Total</span>
                    <span>R{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-2">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <Calendar size={18} />
                  <span>Book Now</span>
                </button>

                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full bg-white border-2 border-orange-400 hover:bg-orange-50 text-orange-600 py-3 px-4 rounded-xl font-bold transition-all active:scale-[0.98]"
                >
                  Send Enquiry
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 mb-2">About this place</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedAccommodation.description}</p>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Contact Host</p>
                <a href={`tel:${selectedAccommodation.phone}`} className="text-sm font-semibold text-green-700 hover:underline">
                  {selectedAccommodation.phone}
                </a>
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
