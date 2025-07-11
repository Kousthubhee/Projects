import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Heart, Star, MapPin } from 'lucide-react';

interface DynamicLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const DynamicLogo: React.FC<DynamicLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const icons = [Globe, Sparkles, Heart, Star, MapPin];
  const colors = [
    'text-blue-500',
    'text-purple-500', 
    'text-pink-500',
    'text-yellow-500',
    'text-green-500'
  ];

  const sizeClasses = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-base' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-lg' },
    xl: { container: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-xl' }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIcon((prev) => (prev + 1) % icons.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[currentIcon];
  const currentColor = colors[currentIcon];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated Logo Container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={`${sizeClasses[size].container} relative`}>
          <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-spin-slow opacity-30"></div>
          
          {/* Pulsing background */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse`}></div>
          
          {/* Main icon container */}
          <div className={`relative ${sizeClasses[size].container} rounded-full bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-lg flex items-center justify-center border border-white/50 backdrop-blur-sm`}>
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float opacity-40"
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${15 + (i * 8)}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + (i * 0.3)}s`
                  }}
                />
              ))}
            </div>
            
            {/* Main icon with transition */}
            <div className={`relative z-10 transition-all duration-500 ${
              isAnimating 
                ? 'scale-0 rotate-180 opacity-0' 
                : 'scale-100 rotate-0 opacity-100'
            }`}>
              <CurrentIcon className={`${sizeClasses[size].icon} ${currentColor} drop-shadow-sm`} />
            </div>
            
            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce opacity-70" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${sizeClasses[size].text} leading-tight`}>
            Cultural Explorer
          </h1>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">Discover • Connect • Explore</span>
          </div>
        </div>
      )}
    </div>
  );
};