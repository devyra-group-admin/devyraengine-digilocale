import React from 'react';
import { Star } from 'lucide-react';

const AccommodationList = ({
  accommodations,
  selectedAccommodation,
  onAccommodationSelect
}) => {
  return (
    <div className="w-full md:w-80 bg-white flex flex-col border-r border-gray-200 shadow-sm h-full">
      <div className="p-4 md:p-5 border-b border-gray-100 sticky top-0 bg-white z-10 backdrop-blur-md bg-white/90">
        <h2 className="text-xl md:text-lg font-bold text-gray-900 leading-tight">
          Accommodations
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
          {accommodations.length} properties found
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {accommodations.map((accommodation) => (
          <div
            key={accommodation.id}
            onClick={() => onAccommodationSelect(accommodation)}
            className={`group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
              selectedAccommodation?.id === accommodation.id 
                ? 'ring-2 ring-green-600 shadow-xl scale-[1.02]' 
                : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={accommodation.images[0]}
                alt={accommodation.name}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                 <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-gray-900">{accommodation.rating}</span>
                 </div>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-medium bg-green-600/90 px-2 py-0.5 rounded-full mb-1 inline-block backdrop-blur-sm">
                  {accommodation.category}
                </span>
                <div className="font-bold text-lg drop-shadow-sm">R{accommodation.price}</div>
              </div>
            </div>

            <div className="p-4 bg-white">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                {accommodation.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {accommodation.description}
              </p>
              
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  {accommodation.reviews} reviews
                </span>
                <span className="text-xs font-bold text-green-700 hover:underline">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        ))}
        {/* Spacer for bottom nav on mobile */}
        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  );
};

export default AccommodationList;