import React, { useState } from 'react';
import { MessageSquare, Globe, ExternalLink } from 'lucide-react';
import { NewsArticle, UserLocations } from '../types';
import { NewsChat } from './NewsChat';

interface VoiceNewsExplainerProps {
  news: NewsArticle[];
  locations: UserLocations;
}

export const VoiceNewsExplainer: React.FC<VoiceNewsExplainerProps> = ({ news, locations }) => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <NewsChat news={news} locations={locations} onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <div className="relative group">
        <button
          onClick={() => setShowChat(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer relative z-10"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        
        {/* Pulse Animation - moved behind button */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 animate-ping opacity-20 pointer-events-none"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Chat with AI News Assistant</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Voice & text support • {locations.nativePlace.country} & {locations.currentPlace.country} news
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Feature Preview Card */}
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI News Assistant</h3>
              <p className="text-sm text-gray-500">ChatGPT-like interface</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Voice conversations in 12 languages</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Real-time news explanations</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Personalized for your locations</span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowChat(true);
            }}
            className="w-full mt-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Start Chatting</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};