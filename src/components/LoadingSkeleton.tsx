import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />

      {/* Content placeholder */}
      <div className="p-4 space-y-4">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

        {/* Description placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>

        {/* Stats and button placeholder */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Tags placeholder */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
