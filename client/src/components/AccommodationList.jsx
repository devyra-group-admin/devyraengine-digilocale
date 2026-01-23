import React from 'react';
import { Star } from 'lucide-react';

const AccommodationList = ({
  accommodations,
  selectedAccommodation,
  onAccommodationSelect
}) => {
  return (
    <div className="w-80 bg-white flex flex-col border-r border-gray-200 shadow-sm">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Accommodations
        </h2>
        
        <div className="space-y-3">
          {accommodations.map((accommodation) => (
            <div
              key={accommodation.id}
              onClick={() => onAccommodationSelect(accommodation)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedAccommodation?.id === accommodation.id 
                  ? 'bg-teal-50 border-2 border-teal-500 shadow-md' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <img
                src={accommodation.images[0]}
                alt={accommodation.name}
                className="w-full h-32 rounded-lg object-cover mb-3"
              />
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {accommodation.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={`${i < Math.floor(accommodation.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {accommodation.rating} ({accommodation.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {accommodation.category}
                </span>
                <span className="text-sm font-bold text-green-600">
                  R{accommodation.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccommodationList;