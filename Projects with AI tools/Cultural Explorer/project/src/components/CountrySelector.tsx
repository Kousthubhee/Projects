import React, { useState, useEffect } from 'react';
import { Search, Globe, Sparkles, MapPin, Users, ArrowLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Country, Continent } from '../types';
import { continents, getRegionsForCountry } from '../data/countries';
import { DynamicLogo } from './DynamicLogo';

interface CountrySelectorProps {
  onSelectCountry: (country: Country) => void;
}

type ViewType = 'continents' | 'countries' | 'regions';

export const CountrySelector: React.FC<CountrySelectorProps> = ({ onSelectCountry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<ViewType>('continents');
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [currentRegions, setCurrentRegions] = useState<Country[]>([]);

  // Filter current items based on view
  const getCurrentItems = () => {
    switch (currentView) {
      case 'continents':
        return continents.filter(continent =>
          continent.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'countries':
        return selectedContinent?.countries.filter(country =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
      case 'regions':
        return currentRegions.filter(region =>
          region.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  const currentItems = getCurrentItems();

  // Animate items on view change
  useEffect(() => {
    setAnimatedItems(new Set());
    const timer = setTimeout(() => {
      currentItems.forEach((item, index) => {
        setTimeout(() => {
          setAnimatedItems(prev => new Set([...prev, item.code]));
        }, index * 100);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [currentView, selectedContinent, currentRegions]);

  const getItemStats = (item: Country | Continent) => {
    const stats = {
      // Continent stats
      AS: { population: '4.6B', countries: '48 countries', timeZone: 'Various' },
      EU: { population: '748M', countries: '51 countries', timeZone: 'Various' },
      NA: { population: '580M', countries: '23 countries', timeZone: 'Various' },
      SA: { population: '430M', countries: '12 countries', timeZone: 'Various' },
      AF: { population: '1.4B', countries: '54 countries', timeZone: 'Various' },
      OC: { population: '45M', countries: '14 countries', timeZone: 'Various' },
      AN: { population: '4K', countries: '6 stations', timeZone: 'Various' },
      
      // Country stats (existing)
      JP: { population: '125M', continent: 'Asia', timeZone: 'JST' },
      FR: { population: '68M', continent: 'Europe', timeZone: 'CET' },
      IT: { population: '60M', continent: 'Europe', timeZone: 'CET' },
      ES: { population: '47M', continent: 'Europe', timeZone: 'CET' },
      DE: { population: '83M', continent: 'Europe', timeZone: 'CET' },
      CN: { population: '1.4B', continent: 'Asia', timeZone: 'CST' },
      KR: { population: '52M', continent: 'Asia', timeZone: 'KST' },
      IN: { population: '1.4B', continent: 'Asia', timeZone: 'IST' },
      BR: { population: '215M', continent: 'S. America', timeZone: 'BRT' },
      MX: { population: '128M', continent: 'N. America', timeZone: 'CST' },
      RU: { population: '146M', continent: 'Europe/Asia', timeZone: 'MSK' },
      EG: { population: '104M', continent: 'Africa', timeZone: 'EET' },
      TH: { population: '70M', continent: 'Asia', timeZone: 'ICT' },
      GR: { population: '11M', continent: 'Europe', timeZone: 'EET' },
      TR: { population: '84M', continent: 'Europe/Asia', timeZone: 'TRT' },
      MA: { population: '37M', continent: 'Africa', timeZone: 'WET' },
      PE: { population: '33M', continent: 'S. America', timeZone: 'PET' },
      VN: { population: '98M', continent: 'Asia', timeZone: 'ICT' },
      NG: { population: '218M', continent: 'Africa', timeZone: 'WAT' },
      ZA: { population: '60M', continent: 'Africa', timeZone: 'SAST' },
      
      // Regional stats (existing)
      'JP-TK': { population: '14M', continent: 'Kanto', timeZone: 'JST' },
      'JP-OS': { population: '9M', continent: 'Kansai', timeZone: 'JST' },
      'JP-KY': { population: '1.5M', continent: 'Kansai', timeZone: 'JST' },
      'JP-HK': { population: '5M', continent: 'Hokkaido', timeZone: 'JST' },
      'JP-OK': { population: '1.4M', continent: 'Ryukyu', timeZone: 'JST' },
      // ... (include all other existing regional stats)
    };
    return stats[item.code as keyof typeof stats] || { population: 'N/A', continent: 'Unknown', timeZone: 'N/A' };
  };

  const handleContinentClick = (continent: Continent) => {
    if (continent.countries.length === 0) return;
    setSelectedContinent(continent);
    setCurrentView('countries');
    setSearchTerm('');
  };

  const handleCountryClick = (country: Country) => {
    if (country.hasRegions) {
      const regions = getRegionsForCountry(country.code);
      setCurrentRegions(regions);
      setSelectedCountry(country);
      setCurrentView('regions');
      setSearchTerm('');
    } else {
      onSelectCountry(country);
    }
  };

  const handleRegionClick = (region: Country) => {
    onSelectCountry(region);
  };

  const handleBack = () => {
    if (currentView === 'regions') {
      setCurrentView('countries');
      setSelectedCountry(null);
      setCurrentRegions([]);
    } else if (currentView === 'countries') {
      setCurrentView('continents');
      setSelectedContinent(null);
    }
    setSearchTerm('');
  };

  const getTitle = () => {
    switch (currentView) {
      case 'continents':
        return 'Cultural Explorer';
      case 'countries':
        return `Explore ${selectedContinent?.name}`;
      case 'regions':
        return `Explore ${selectedCountry?.name}`;
      default:
        return 'Cultural Explorer';
    }
  };

  const getDescription = () => {
    switch (currentView) {
      case 'continents':
        return 'Embark on a journey through world cultures. Discover traditions, taste flavors, and celebrate diversity through interactive conversations.';
      case 'countries':
        return `Discover the rich diversity of ${selectedContinent?.name}'s countries and their unique cultures, languages, and traditions.`;
      case 'regions':
        return `Explore the fascinating regions of ${selectedCountry?.name} and their distinct cultural identities.`;
      default:
        return '';
    }
  };

  const getSearchPlaceholder = () => {
    switch (currentView) {
      case 'continents':
        return 'Search continents...';
      case 'countries':
        return `Search ${selectedContinent?.name} countries...`;
      case 'regions':
        return `Search ${selectedCountry?.name} regions...`;
      default:
        return 'Search...';
    }
  };

  const handleItemClick = (item: any) => {
    switch (currentView) {
      case 'continents':
        handleContinentClick(item as Continent);
        break;
      case 'countries':
        handleCountryClick(item as Country);
        break;
      case 'regions':
        handleRegionClick(item as Country);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            {currentView !== 'continents' && (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-gray-700 hover:text-blue-600 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
            )}
            
            {/* Dynamic Logo */}
            <div className="flex justify-center mb-6">
              <DynamicLogo size="xl" showText={currentView === 'continents'} />
            </div>
            
            {currentView !== 'continents' && (
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                {getTitle()}
              </h1>
            )}
            
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {getDescription()}
            </p>
            
            <div className="relative max-w-lg mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 animate-pulse"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-transparent rounded-full focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-700 bg-white/90 backdrop-blur-sm shadow-xl text-sm transition-all duration-300 hover:shadow-2xl"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.map((item, index) => {
              const stats = getItemStats(item);
              const isAnimated = animatedItems.has(item.code);
              const isHovered = hoveredItem === item.code;
              const hasSubItems = currentView === 'continents' 
                ? (item as Continent).countries.length > 0
                : currentView === 'countries' 
                ? (item as Country).hasRegions
                : false;
              
              // Check if continent is complete
              const isComplete = currentView === 'continents' && (item as Continent).isComplete;
              const missingCount = currentView === 'continents' && !(item as Continent).isComplete 
                ? ((item as Continent).totalCountries || 0) - (item as Continent).countries.length 
                : 0;
              
              return (
                <div
                  key={item.code}
                  className={`transform transition-all duration-500 ${
                    isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.code)}
                    onMouseLeave={() => setHoveredItem(null)}
                    disabled={currentView === 'continents' && (item as Continent).countries.length === 0}
                    className={`group relative w-full rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                      isComplete 
                        ? 'bg-gradient-to-br from-sky-50 to-blue-100 border-sky-200/50 hover:border-sky-300/50' 
                        : 'bg-white/80 backdrop-blur-sm border-white/30 hover:border-blue-200/50'
                    }`}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    } ${
                      isComplete 
                        ? 'bg-gradient-to-br from-sky-500/10 to-blue-500/10' 
                        : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                    }`}></div>
                    
                    {/* Sparkle effect on hover */}
                    {isHovered && (
                      <div className="absolute top-1 right-1">
                        <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
                      </div>
                    )}

                    {/* Completion status indicator */}
                    {currentView === 'continents' && (
                      <div className="absolute top-1 left-1">
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
                        )}
                      </div>
                    )}

                    {/* Expansion indicator */}
                    {hasSubItems && (
                      <div className="absolute top-1 right-1">
                        <ChevronRight className={`w-3 h-3 animate-pulse ${
                          isComplete ? 'text-sky-600' : 'text-blue-500'
                        }`} />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className={`text-3xl mb-3 transition-transform duration-300 ${
                        isHovered ? 'scale-125 rotate-12' : 'scale-100'
                      }`}>
                        {item.flag}
                      </div>
                      
                      <h3 className={`font-bold text-gray-800 text-base mb-2 transition-colors ${
                        isComplete 
                          ? 'group-hover:text-sky-600' 
                          : 'group-hover:text-blue-600'
                      }`}>
                        {item.name}
                        {(item as Country).parentCountry && (
                          <span className="text-xs text-gray-500 block font-normal">
                            {(item as Country).parentCountry}
                          </span>
                        )}
                      </h3>
                      
                      <p className="text-xs text-gray-500 mb-2">
                        {currentView === 'continents' 
                          ? `${(item as Continent).countries.length} countries`
                          : (item as Country).language
                        }
                        {hasSubItems && (
                          <span className={`block text-xs font-medium mt-1 ${
                            isComplete ? 'text-sky-600' : 'text-blue-600'
                          }`}>
                            Explore {currentView === 'countries' ? 'regions' : 'countries'} →
                          </span>
                        )}
                        {currentView === 'continents' && !isComplete && missingCount > 0 && (
                          <span className="block text-xs text-orange-600 font-medium mt-1">
                            +{missingCount} more to add
                          </span>
                        )}
                        {currentView === 'continents' && isComplete && (
                          <span className="block text-xs text-green-600 font-medium mt-1">
                            ✓ Complete
                          </span>
                        )}
                      </p>
                      
                      {/* Dynamic stats that appear on hover */}
                      <div className={`space-y-1 transition-all duration-300 ${
                        isHovered ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0'
                      } overflow-hidden`}>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" />
                            <span>{stats.population}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span className="truncate">{stats.continent || stats.countries}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Animated border */}
                      <div className={`absolute inset-0 rounded-xl border-2 transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      } ${
                        isComplete 
                          ? 'border-gradient-to-r from-sky-400 to-blue-400' 
                          : 'border-gradient-to-r from-blue-400 to-purple-400'
                      }`}></div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          
          {currentItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 animate-bounce">🌍</div>
              <p className="text-lg text-gray-500">
                No {currentView === 'continents' ? 'continents' : currentView === 'countries' ? 'countries' : 'regions'} found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};