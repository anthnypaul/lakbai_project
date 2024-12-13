import React from 'react';
import { Sailboat } from 'lucide-react';

export function LoadingBoat() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 overflow-hidden">
      {/* Main container with perspective */}
      <div className="relative w-64 h-48 perspective-1000">
        {/* Ocean container */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-sky-200 overflow-hidden rounded-lg">
          {/* Multiple wave layers */}
          <div className="absolute inset-x-0 bottom-0">
            {/* Background waves */}
            <svg className="w-[200%] animate-wave-slow" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 50 C 100 10, 200 90, 300 50 C 400 10, 500 90, 600 50 C 700 10, 800 90, 900 50 L 1000 50 L 1000 200 L 0 200 Z"
                fill="rgba(14, 165, 233, 0.3)"
              />
            </svg>
            {/* Middle waves */}
            <svg className="w-[200%] absolute bottom-0 animate-wave-medium" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 70 C 100 30, 200 110, 300 70 C 400 30, 500 110, 600 70 C 700 30, 800 110, 900 70 L 1000 70 L 1000 200 L 0 200 Z"
                fill="rgba(14, 165, 233, 0.4)"
              />
            </svg>
            {/* Foreground waves */}
            <svg className="w-[200%] absolute bottom-0 animate-wave-fast" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 90 C 100 50, 200 130, 300 90 C 400 50, 500 130, 600 90 C 700 50, 800 130, 900 90 L 1000 90 L 1000 200 L 0 200 Z"
                fill="rgba(14, 165, 233, 0.5)"
              />
            </svg>
          </div>

          {/* Boat */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-boat">
            <div className="relative w-16 h-16 animate-boat-tilt">
              {/* Custom boat SVG */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                {/* Hull */}
                <path
                  d="M2 20h20l-10-15L2 20Z"
                  fill="#1e40af"
                  className="drop-shadow-md"
                />
                {/* Sail */}
                <path
                  d="M12 5v10M12 5l6 10M12 5l-6 10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Flag */}
                <path
                  d="M12 5l3-2v3l-3-1Z"
                  fill="#ef4444"
                  className="animate-flag-wave"
                />
              </svg>
            </div>
          </div>

          {/* Sun */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-300 rounded-full animate-pulse blur-sm" />
          
          {/* Birds */}
          <div className="absolute top-8 left-8 animate-birds">
            <div className="space-x-2">
              <span className="inline-block text-slate-600 transform rotate-12">‿</span>
              <span className="inline-block text-slate-600 transform rotate-12">‿</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-medium text-sky-600 animate-pulse">
          Planning your adventure...
        </p>
        <p className="text-sm text-sky-500">Discovering amazing destinations</p>
      </div>
    </div>
  );
}

export default LoadingBoat;