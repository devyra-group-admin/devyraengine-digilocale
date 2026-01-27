import React from 'react';

// Base skeleton component with shimmer effect
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';

  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
};

// Card skeleton for accommodation/business listings
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-3/4 h-5" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-2/3 h-4" />
      <div className="flex justify-between pt-2">
        <Skeleton variant="text" className="w-20 h-3" />
        <Skeleton variant="text" className="w-16 h-3" />
      </div>
    </div>
  </div>
);

// Post skeleton for community feed
export const PostSkeleton = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-start space-x-3 mb-3">
      <Skeleton variant="circular" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-1/4 h-3" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-3/4 h-4" />
    </div>
    <div className="flex space-x-6 mt-4 pt-3 border-t border-gray-50">
      <Skeleton variant="text" className="w-24 h-4" />
      <Skeleton variant="text" className="w-16 h-4" />
    </div>
  </div>
);

// List skeleton for sidebar
export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4 p-4">
    {[...Array(count)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
