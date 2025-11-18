import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} text-purple-600 loading-spin`} />
        {text && (
          <p className="text-gray-600 text-sm font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

const LoadingOverlay = ({ isVisible, text = 'Cargando...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop-animate">
      <div className="bg-white rounded-xl p-8 shadow-2xl modal-animate">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

const LoadingButton = ({ 
  loading = false, 
  children, 
  className = '', 
  loadingText = 'Cargando...',
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={`btn-animate ripple relative ${className} ${(loading || disabled) ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 loading-spin" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={`h-4 bg-gray-200 rounded flex-1 ${colIndex === 0 ? 'w-1/2' : ''}`}
                  style={{
                    animationDelay: `${(rowIndex * 0.1) + (colIndex * 0.05)}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-purple-600 rounded-full loading-pulse"
          style={{
            animationDelay: `${index * 0.2}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const SkeletonLine = ({ className = '', width = 'full' }) => {
  const widths = {
    quarter: 'w-1/4',
    half: 'w-1/2',
    threeQuarter: 'w-3/4',
    full: 'w-full'
  };

  return (
    <div className={`h-4 bg-gray-200 rounded animate-pulse ${widths[width]} ${className}`}></div>
  );
};

const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine 
          key={index} 
          width={index === lines - 1 ? 'threeQuarter' : 'full'} 
        />
      ))}
    </div>
  );
};

export {
  LoadingSpinner,
  LoadingOverlay,
  LoadingButton,
  LoadingCard,
  LoadingTable,
  LoadingDots,
  SkeletonLine,
  SkeletonText
};

export default LoadingSpinner;