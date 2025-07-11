import React, { useState, useEffect } from 'react';
import { RefreshCw, Settings, Home, MapPin, Globe, Laptop, ChevronDown, Building, Briefcase, Heart, Zap, Search, X } from 'lucide-react';
import { UserLocations, NewsArticle } from '../types';
import { getNewsForStudent, searchNews } from '../services/newsService';
import { NewsCard } from './NewsCard';
import { VoiceNewsExplainer } from './VoiceNewsExplainer';

interface NewsDisplayProps {
  locations: UserLocations;
  onReset: () => void;
}

type TabType = 'current' | 'home' | 'category';

type CategoryType = 'international' | 'technology' | 'business' | 'health' | 'sports' | 'education';

const categories = [
  { id: 'international' as CategoryType, label: 'International', icon: <Globe className="w-4 h-4" /> },
  { id: 'technology' as CategoryType, label: 'Technology', icon: <Laptop className="w-4 h-4" /> },
  { id: 'business' as CategoryType, label: 'Business', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'health' as CategoryType, label: 'Health', icon: <Heart className="w-4 h-4" /> },
  { id: 'sports' as CategoryType, label: 'Sports', icon: <Zap className="w-4 h-4" /> },
  { id: 'education' as CategoryType, label: 'Education', icon: <Building className="w-4 h-4" /> },
];

export const NewsDisplay: React.FC<NewsDisplayProps> = ({ locations, onReset }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('international');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newArticles = getNewsForStudent(locations.nativePlace, locations.currentPlace);
    setNews(newArticles);
    setFilteredNews(newArticles);
    setLoading(false);
  };

  const refreshNews = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newArticles = getNewsForStudent(locations.nativePlace, locations.currentPlace);
    setNews(newArticles);
    
    // Re-apply search if active
    if (searchQuery) {
      const searchResults = await searchNews(searchQuery, undefined, newArticles);
      setFilteredNews(searchResults);
    } else {
      setFilteredNews(newArticles);
    }
    
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      setSearchActive(true);
      const searchResults = await searchNews(query, undefined, news);
      setFilteredNews(searchResults);
    } else {
      setSearchActive(false);
      setFilteredNews(news);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchActive(false);
    setFilteredNews(news);
  };

  useEffect(() => {
    loadNews();
  }, [locations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const groupedNews = {
    current: filteredNews.filter(article => 
      (article.category === 'local' && article.location === locations.currentPlace.city) ||
      (article.category === 'national' && article.location === locations.currentPlace.country)
    ),
    home: filteredNews.filter(article => 
      (article.category === 'local' && article.location === locations.nativePlace.city) ||
      (article.category === 'national' && article.location === locations.nativePlace.country)
    ),
    category: filteredNews.filter(article => article.category === selectedCategory),
  };

  const tabs = [
    {
      id: 'current' as TabType,
      label: `${locations.currentPlace.city}, ${locations.currentPlace.country}`,
      shortLabel: 'Current',
      icon: <MapPin className="w-4 h-4" />,
      count: groupedNews.current.length,
      color: 'blue'
    },
    {
      id: 'home' as TabType,
      label: `${locations.nativePlace.city}, ${locations.nativePlace.country}`,
      shortLabel: 'Home',
      icon: <Home className="w-4 h-4" />,
      count: groupedNews.home.length,
      color: 'green'
    },
    {
      id: 'category' as TabType,
      label: categories.find(cat => cat.id === selectedCategory)?.label || 'Category',
      shortLabel: 'Category',
      icon: categories.find(cat => cat.id === selectedCategory)?.icon || <Globe className="w-4 h-4" />,
      count: groupedNews.category.length,
      color: 'purple'
    }
  ];

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'border-blue-500 text-blue-600 bg-blue-50' 
        : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300',
      green: isActive 
        ? 'border-green-500 text-green-600 bg-green-50' 
        : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300',
      purple: isActive 
        ? 'border-purple-500 text-purple-600 bg-purple-50' 
        : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
    };
    return colors[color as keyof typeof colors];
  };

  const handleCategorySelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    setActiveTab('category');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      setActiveTab('category');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized news...</p>
        </div>
      </div>
    );
  }

  const currentNews = groupedNews[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Global Student News</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshNews}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={onReset}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Change Locations</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search news articles..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
          {searchActive && (
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                Found {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} for "{searchQuery}"
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation with Category Dropdown */}
        <div className="mb-8 relative">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {/* Current Location Tab */}
              <button
                onClick={() => {
                  setActiveTab('current');
                  setDropdownOpen(false);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${getTabColorClasses('blue', activeTab === 'current')}`}
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">{tabs[0].label}</span>
                <span className="sm:hidden">{tabs[0].shortLabel}</span>
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs font-medium">
                  {tabs[0].count}
                </span>
              </button>

              {/* Home Location Tab */}
              <button
                onClick={() => {
                  setActiveTab('home');
                  setDropdownOpen(false);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${getTabColorClasses('green', activeTab === 'home')}`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{tabs[1].label}</span>
                <span className="sm:hidden">{tabs[1].shortLabel}</span>
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs font-medium">
                  {tabs[1].count}
                </span>
              </button>

              {/* Category Tab with Dropdown */}
              <div className="relative category-dropdown">
                <button
                  onClick={toggleDropdown}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${getTabColorClasses('purple', activeTab === 'category')}`}
                >
                  {categories.find(cat => cat.id === selectedCategory)?.icon}
                  <span className="hidden sm:inline">{categories.find(cat => cat.id === selectedCategory)?.label}</span>
                  <span className="sm:hidden">Category</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs font-medium">
                    {tabs[2].count}
                  </span>
                </button>

                {/* Dropdown Menu - Positioned relative to the category tab */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                        Select Category
                      </div>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center space-x-3 transition-all duration-150 ${
                            selectedCategory === category.id 
                              ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500' 
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <span className={`${selectedCategory === category.id ? 'text-purple-600' : 'text-gray-400'} transition-colors`}>
                            {category.icon}
                          </span>
                          <span className="flex-1 font-medium">{category.label}</span>
                          {selectedCategory === category.id && (
                            <span className="text-purple-600 font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {currentNews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {currentNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                {searchActive ? (
                  <Search className="w-8 h-8 text-gray-400" />
                ) : (
                  <>
                    {activeTab === 'current' && <MapPin className="w-8 h-8 text-gray-400" />}
                    {activeTab === 'home' && <Home className="w-8 h-8 text-gray-400" />}
                    {activeTab === 'category' && (categories.find(cat => cat.id === selectedCategory)?.icon || <Globe className="w-8 h-8 text-gray-400" />)}
                  </>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchActive ? 'No search results found' : 'No news available'}
              </h3>
              <p className="text-gray-500">
                {searchActive ? (
                  <>Try adjusting your search terms or <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800 underline">clear the search</button></>
                ) : (
                  <>
                    {activeTab === 'current' && `No news found for ${locations.currentPlace.city}, ${locations.currentPlace.country}`}
                    {activeTab === 'home' && `No news found for ${locations.nativePlace.city}, ${locations.nativePlace.country}`}
                    {activeTab === 'category' && `No ${categories.find(cat => cat.id === selectedCategory)?.label.toLowerCase()} news available`}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* News Summary */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {searchActive ? 'Search Results Summary' : 'News Summary'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{groupedNews.current.length}</div>
              <div className="text-sm text-gray-600">Current Location</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="flex items-center justify-center mb-2">
                <Home className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{groupedNews.home.length}</div>
              <div className="text-sm text-gray-600">Home Location</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <div className="flex items-center justify-center mb-2">
                {categories.find(cat => cat.id === selectedCategory)?.icon || <Globe className="w-5 h-5 text-purple-500" />}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{groupedNews.category.length}</div>
              <div className="text-sm text-gray-600">{categories.find(cat => cat.id === selectedCategory)?.label}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Voice News Explainer */}
      <VoiceNewsExplainer news={news} locations={locations} />
    </div>
  );
};