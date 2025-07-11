import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, ArrowLeft, MessageCircle, Sparkles, Heart, Star, Info } from 'lucide-react';
import { Country, Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getCulturalResponse } from '../utils/culturalResponses';
import { DynamicLogo } from './DynamicLogo';

interface ChatInterfaceProps {
  country: Country;
  onBack: () => void;
}

const suggestedQuestions = [
  "What do people eat in {country}?",
  "How do people celebrate New Year in {country}?",
  "What are the main traditions in {country}?",
  "Tell me about the customs in {country}",
  "What festivals are popular in {country}?",
  "How do people greet each other in {country}?",
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ country, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [showVoiceInfo, setShowVoiceInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isListening, transcript, startListening, stopListening, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, isSpeaking, stop: stopSpeaking, isSupported: ttsSupported, availableVoices } = useTextToSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    // Welcome message with animation
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello! I'm excited to help you explore ${country.name} 🌍 Ask me anything about their culture, food, traditions, or celebrations. I can even respond in ${country.language}!`,
      isUser: false,
      timestamp: new Date(),
    };
    
    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 500);
  }, [country]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    // Show reactions after a few messages
    if (messageCount > 2 && Math.random() > 0.7) {
      setShowReactions(true);
      setTimeout(() => setShowReactions(false), 3000);
    }

    // Simulate AI response delay with realistic typing time
    const typingDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = getCulturalResponse(text, country);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        language: country.languageCode,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Auto-speak response if TTS is supported
      if (ttsSupported) {
        setTimeout(() => {
          console.log(`🎤 Auto-speaking response in ${country.languageCode} for ${country.name}`);
          speak(response, country.languageCode);
        }, 500);
      }
    }, typingDelay);
  };

  const handleSuggestedQuestion = (question: string) => {
    const personalizedQuestion = question.replace('{country}', country.name);
    handleSendMessage(personalizedQuestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const getVoiceInfo = () => {
    const voice = availableVoices.find(v => 
      v.lang.toLowerCase().includes(country.languageCode.toLowerCase()) ||
      v.name.toLowerCase().includes(country.language.toLowerCase()) ||
      (country.languageCode === 'th-TH' && (
        v.lang.toLowerCase().includes('th') ||
        v.name.toLowerCase().includes('thai')
      ))
    );
    
    if (voice) {
      return `Using ${voice.name} (${voice.lang}) for authentic ${country.language} pronunciation`;
    }
    
    // Special message for Thai
    if (country.languageCode === 'th-TH') {
      return `Thai voice not available. For authentic Thai pronunciation, install Thai language support in your system settings. Currently using browser default with Thai language settings.`;
    }
    
    // Check if it's an Indian language
    if (country.languageCode.includes('-IN')) {
      return `${country.language} voice not available. Install Indian language voices in your system settings for authentic pronunciation.`;
    }
    
    return `Using default voice for ${country.language}. For better pronunciation, install ${country.language} language support in your system.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            <MessageCircle className="w-6 h-6 text-blue-400" />
          </div>
        ))}
      </div>

      {/* Floating reactions */}
      {showReactions && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          {[Heart, Star, Sparkles].map((Icon, index) => (
            <div
              key={index}
              className="absolute animate-bounce"
              style={{
                left: `${(index - 1) * 40}px`,
                animationDelay: `${index * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <Icon className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Voice Info Tooltip */}
      {showVoiceInfo && (
        <div className="fixed top-20 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-xs border border-blue-200">
          <div className="text-sm text-gray-700">
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              Voice Information
            </div>
            <p>{getVoiceInfo()}</p>
            {(country.languageCode.includes('-IN') || country.languageCode === 'th-TH') && (
              <div className="mt-2 text-xs text-blue-600">
                💡 Tip: Install {country.language} language packs in your system for authentic pronunciation!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Dynamic Logo in Header */}
          <DynamicLogo size="sm" showText={false} />
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {country.name}
              <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Cultural Explorer • {messages.length} messages
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {ttsSupported && (
              <>
                <button
                  onClick={() => setShowVoiceInfo(!showVoiceInfo)}
                  className="p-3 rounded-full transition-all duration-200 hover:scale-110 hover:bg-blue-100 text-blue-600"
                  title="Voice information"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleSpeaking}
                  className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                    isSpeaking 
                      ? 'bg-orange-100 text-orange-600 animate-pulse' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto relative z-10">
        {messages.length === 1 && (
          <div className="mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Try asking about:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="group text-left p-4 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-300 text-sm text-gray-700 border border-white/40 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {question.replace('{country}', country.name)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MessageBubble message={message} country={country} />
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="relative">
                <div className="text-3xl animate-bounce-slow">{country.flag}</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs text-gray-500 ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-md border-t border-white/20 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-50"></div>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${country.name}'s culture...`}
                className="relative z-10 w-full px-6 py-4 pr-14 bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none min-h-[56px] max-h-32 transition-all duration-300 hover:border-blue-300"
                rows={1}
              />
              {speechSupported && (
                <button
                  onClick={toggleListening}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    isListening 
                      ? 'bg-red-100 text-red-600 animate-pulse shadow-lg' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          
          {isListening && (
            <div className="mt-3 text-center animate-fade-in">
              <div className="inline-flex items-center gap-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-full">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-medium">Listening... Speak now!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};