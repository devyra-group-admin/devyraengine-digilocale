import React from 'react';
import { Star, MapPin, Users, Wifi, Car } from 'lucide-react';
import ImageWithFallback from './ui/ImageWithFallback';

const AccommodationList = ({
  accommodations,
  selectedAccommodation,
  onAccommodationSelect
}) => {
  return (
    <div className="w-full md:w-80 bg-white flex flex-col border-r border-gray-100 shadow-sm h-full">
      {/* Header with count */}
      <div className="p-4 md:p-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
          Places to Stay
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {accommodations.length} {accommodations.length === 1 ? 'property' : 'properties'} available
        </p>
      </div>

      {/* Accommodation Cards */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
        {accommodations.map((accommodation, index) => (
          <div
            key={accommodation.id}
            onClick={() => onAccommodationSelect(accommodation)}
            className={`group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden animate-fadeIn ${
              selectedAccommodation?.id === accommodation.id
                ? 'ring-2 ring-green-500 shadow-elevated scale-[1.01]'
                : 'bg-white border border-gray-100 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 active:scale-[0.99]'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image Section */}
            <div className="relative h-40 md:h-44 overflow-hidden">
              <ImageWithFallback
                src={accommodation.images[0]}
                alt={accommodation.name}
                className="w-full h-full"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                  {accommodation.category}
                </span>
                <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-current" />
                  <span className="text-xs font-bold text-gray-900">{accommodation.rating}</span>
                </div>
              </div>

              {/* Price badge */}
              <div className="absolute bottom-2.5 left-2.5">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="text-lg font-bold text-gray-900">R{accommodation.price}</span>
                  <span className="text-xs text-gray-500 ml-1">/night</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-3.5 bg-white">
              <h3 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1 mb-1">
                {accommodation.name}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                {accommodation.description}
              </p>

              {/* Quick info */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {accommodation.maxGuests} guests
                </span>
                {accommodation.amenities?.includes('WiFi') && (
                  <span className="flex items-center gap-1">
                    <Wifi size={12} />
                    WiFi
                  </span>
                )}
                {accommodation.amenities?.includes('Parking') && (
                  <span className="flex items-center gap-1">
                    <Car size={12} />
                    Parking
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                <div className="flex items-center text-xs text-gray-400">
                  <MapPin size={12} className="mr-1" />
                  <span className="line-clamp-1">{accommodation.reviews} reviews</span>
                </div>
                <span className="text-xs font-bold text-green-600 group-hover:text-green-700 flex items-center gap-1 transition-all group-hover:gap-2">
                  View Details
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {accommodations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No places found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Spacer for bottom nav on mobile */}
        <div className="h-24 md:h-0" />
      </div>
    </div>
  );
};

export default AccommodationList;
