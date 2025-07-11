import React, { useState } from 'react';
import { Volume2, User, Bot, Heart, ThumbsUp, Copy, Check } from 'lucide-react';
import { Message, Country } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface MessageBubbleProps {
  message: Message;
  country: Country;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, country }) => {
  const { speak, isSpeaking } = useTextToSpeech();
  const [isLiked, setIsLiked] = useState(false);
  const [isHearted, setIsHearted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleSpeak = () => {
    if (!isSpeaking) {
      speak(message.content, message.language || 'en-US');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleHeart = () => {
    setIsHearted(!isHearted);
  };

  return (
    <div 
      className={`flex items-start gap-4 ${message.isUser ? 'flex-row-reverse' : ''} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
        message.isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
          : 'bg-white border-2 border-gray-200 hover:border-blue-300'
      }`}>
        {message.isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <span className="text-xl animate-bounce-slow">{country.flag}</span>
        )}
      </div>
      
      <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${
        message.isUser ? 'text-right' : ''
      }`}>
        <div className={`relative inline-block px-6 py-4 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
          message.isUser
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent hover:from-blue-600 hover:to-purple-700'
            : 'bg-white/90 backdrop-blur-sm text-gray-800 border-white/30 hover:bg-white hover:border-blue-200'
        }`}>
          {/* Animated background for AI messages */}
          {!message.isUser && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">
            {message.content}
          </p>
          
          {/* Floating sparkles for AI messages */}
          {!message.isUser && showActions && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className={`flex items-center mt-2 gap-3 text-xs text-gray-500 transition-all duration-300 ${
          message.isUser ? 'justify-end' : ''
        } ${showActions ? 'opacity-100' : 'opacity-60'}`}>
          <span className="font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {!message.isUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className="p-1.5 hover:bg-blue-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Listen to message"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              </button>
              
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Copy message"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleLike}
                className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                  isLiked ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-gray-600'
                }`}
                title="Like message"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleHeart}
                className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                  isHearted ? 'bg-pink-100 text-pink-600' : 'hover:bg-pink-100 text-gray-600'
                }`}
                title="Love message"
              >
                <Heart className={`w-3.5 h-3.5 ${isHearted ? 'fill-current animate-pulse' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};