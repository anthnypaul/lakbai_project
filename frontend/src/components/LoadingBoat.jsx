export function LoadingBoat() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <div className="relative w-40 h-32">
          {/* Wave animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 20 Q40 15, 80 20 Q120 25, 160 20 T240 20"
                fill="none"
                stroke="#4DB6AC"
                strokeWidth="2"
                className="animate-wave"
              />
              <path
                d="M0 20 Q40 25, 80 20 Q120 15, 160 20 T240 20"
                fill="none"
                stroke="#4DB6AC"
                strokeWidth="2"
                className="animate-wave-2"
                opacity="0.5"
              />
            </svg>
          </div>
  
          {/* Boat */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-boat-sailing">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 18h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"
                fill="#4DB6AC"
              />
              <path
                d="M15 4.5L3 15h18L15 4.5zM15 2l15 13H0L15 2z"
                fill="#2979FF"
              />
            </svg>
          </div>
        </div>
        <p className="text-lg font-medium text-[#4DB6AC] animate-pulse">
          Planning your adventure...
        </p>
      </div>
    );
  }