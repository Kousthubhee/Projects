import React from 'react';
import { Clock, MapPin, Globe, Laptop, Building, Briefcase, Heart, Zap, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'local':
      return <MapPin className="w-4 h-4" />;
    case 'national':
      return <Building className="w-4 h-4" />;
    case 'international':
      return <Globe className="w-4 h-4" />;
    case 'technology':
      return <Laptop className="w-4 h-4" />;
    case 'business':
      return <Briefcase className="w-4 h-4" />;
    case 'health':
      return <Heart className="w-4 h-4" />;
    case 'sports':
      return <Zap className="w-4 h-4" />;
    case 'education':
      return <Building className="w-4 h-4" />;
    default:
      return <Globe className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'local':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'national':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'international':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'technology':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'business':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'health':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'sports':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'education':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const handleReadMore = () => {
    if (article.articleUrl) {
      // TODO: Track read history in database
      console.log('📊 [Analytics] User clicked read more for article:', article.id);
      window.open(article.articleUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 flex flex-col min-h-[320px]">
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center space-x-2 flex-wrap">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
            {getCategoryIcon(article.category)}
            <span className="capitalize">{article.category}</span>
          </span>
          {article.location && (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              {article.location}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3 text-xs text-gray-500 flex-shrink-0">
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{article.readTime} min read</span>
          </span>
          <span>{formatTimeAgo(article.timestamp)}</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight line-clamp-3">
          {article.title}
        </h3>
        
        <div className="flex-1 mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {article.summary}
          </p>
        </div>
        
        {/* Read More Button */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={handleReadMore}
            className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group w-full justify-center py-2 px-4 rounded-lg hover:bg-blue-50"
          >
            <span>Read full article</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};