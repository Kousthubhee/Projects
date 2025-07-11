import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, ArrowLeft, RotateCcw, 
  Copy, Check, Play, Pause, Globe, MessageSquare, Loader2,
  Settings, Download, Share2, Bookmark, BookmarkCheck
} from 'lucide-react';
import { NewsArticle, UserLocations } from '../types';

interface NewsChatProps {
  news: NewsArticle[];
  locations: UserLocations;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  inputType: 'voice' | 'text';
  isTyping?: boolean;
  language?: string;
}

export const NewsChat: React.FC<NewsChatProps> = ({ news, locations, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedMessages, setSavedMessages] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.9);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = getVoiceLanguage(selectedLanguage);

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          handleSendMessage(transcript, 'voice');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: `Hello! I can help you with news from your locations: ${locations.nativePlace.country} and ${locations.currentPlace.country}.

I have access to the current news feed and can answer questions about specific stories, locations, or topics.

Try asking:
• "What news do you have about Paris?"
• "Tell me about technology news"
• "What's happening in ${locations.nativePlace.country}?"
• "Summarize today's headlines"

What would you like to know?`,
      type: 'assistant',
      timestamp: new Date(),
      inputType: 'text',
      language: selectedLanguage
    };

    setMessages([welcomeMessage]);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update speech recognition language when language changes
    if (recognitionRef.current) {
      recognitionRef.current.lang = getVoiceLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getVoiceLanguage = (langCode: string): string => {
    const voiceMap: { [key: string]: string } = {
      'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
      'it': 'it-IT', 'pt': 'pt-PT', 'hi': 'hi-IN', 'zh': 'zh-CN',
      'ja': 'ja-JP', 'ko': 'ko-KR', 'ar': 'ar-SA', 'ru': 'ru-RU',
    };
    return voiceMap[langCode] || 'en-US';
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      handleSendMessage(inputText.trim(), 'text');
      setInputText('');
    }
  };

  const handleSendMessage = async (content: string, inputType: 'voice' | 'text') => {
    if (isProcessing) return;

    setIsProcessing(true);
    setTranscript('');

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      type: 'user',
      timestamp: new Date(),
      inputType,
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Generate AI response
      const response = await generateNewsResponse(content);
      
      // Add assistant message with typing effect
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: '',
        type: 'assistant',
        timestamp: new Date(),
        inputType: 'text',
        isTyping: true,
        language: selectedLanguage
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate typing animation
      await simulateTyping(assistantMessage.id, response);

      // Speak response if auto-speak is enabled and it was a voice input
      if (autoSpeak && inputType === 'voice' && synthRef.current) {
        speakText(response);
      }

    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateTyping = async (messageId: string, fullText: string) => {
    const words = fullText.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentText, isTyping: i < words.length - 1 }
          : msg
      ));
      
      // Variable delay for realistic typing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 30));
    }
  };

  const generateNewsResponse = async (query: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerQuery = query.toLowerCase();
    
    // Check if asking about a specific city/location
    const cityMatches = news.filter(article => 
      article.location && lowerQuery.includes(article.location.toLowerCase())
    );

    // Check if asking about Paris specifically
    if (lowerQuery.includes('paris')) {
      const parisNews = news.filter(article => 
        article.location?.toLowerCase().includes('paris')
      );
      
      if (parisNews.length > 0) {
        const headlines = parisNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the news I have about Paris:\n\n${headlines}`;
      } else {
        return "I don't have any specific news about Paris in the current feed. The available news covers other locations and topics.";
      }
    }

    // Check for specific country mentions
    if (lowerQuery.includes(locations.nativePlace.country.toLowerCase())) {
      const countryNews = news.filter(article => 
        article.location?.toLowerCase().includes(locations.nativePlace.country.toLowerCase())
      );
      
      if (countryNews.length > 0) {
        const headlines = countryNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the news from ${locations.nativePlace.country}:\n\n${headlines}`;
      } else {
        return `I don't have specific news about ${locations.nativePlace.country} in the current feed.`;
      }
    }

    if (lowerQuery.includes(locations.currentPlace.country.toLowerCase())) {
      const countryNews = news.filter(article => 
        article.location?.toLowerCase().includes(locations.currentPlace.country.toLowerCase())
      );
      
      if (countryNews.length > 0) {
        const headlines = countryNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the news from ${locations.currentPlace.country}:\n\n${headlines}`;
      } else {
        return `I don't have specific news about ${locations.currentPlace.country} in the current feed.`;
      }
    }

    // Check for category-specific requests
    if (lowerQuery.includes('technology') || lowerQuery.includes('tech')) {
      const techNews = news.filter(article => article.category === 'technology');
      if (techNews.length > 0) {
        const headlines = techNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the technology news:\n\n${headlines}`;
      } else {
        return "I don't have any technology news in the current feed.";
      }
    }

    if (lowerQuery.includes('business')) {
      const businessNews = news.filter(article => article.category === 'business');
      if (businessNews.length > 0) {
        const headlines = businessNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the business news:\n\n${headlines}`;
      } else {
        return "I don't have any business news in the current feed.";
      }
    }

    if (lowerQuery.includes('education') || lowerQuery.includes('student')) {
      const eduNews = news.filter(article => article.category === 'education');
      if (eduNews.length > 0) {
        const headlines = eduNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the education news:\n\n${headlines}`;
      } else {
        return "I don't have any education news in the current feed.";
      }
    }

    if (lowerQuery.includes('health')) {
      const healthNews = news.filter(article => article.category === 'health');
      if (healthNews.length > 0) {
        const headlines = healthNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the health news:\n\n${headlines}`;
      } else {
        return "I don't have any health news in the current feed.";
      }
    }

    if (lowerQuery.includes('sports')) {
      const sportsNews = news.filter(article => article.category === 'sports');
      if (sportsNews.length > 0) {
        const headlines = sportsNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the sports news:\n\n${headlines}`;
      } else {
        return "I don't have any sports news in the current feed.";
      }
    }

    if (lowerQuery.includes('international') || lowerQuery.includes('world')) {
      const intlNews = news.filter(article => article.category === 'international');
      if (intlNews.length > 0) {
        const headlines = intlNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here's the international news:\n\n${headlines}`;
      } else {
        return "I don't have any international news in the current feed.";
      }
    }

    // Summary requests
    if (lowerQuery.includes('summary') || lowerQuery.includes('headlines') || lowerQuery.includes('today')) {
      if (news.length > 0) {
        const topNews = news.slice(0, 5);
        const summary = topNews.map((article, index) => 
          `${index + 1}. ${article.title}\n   Location: ${article.location || 'International'}\n   ${article.summary}`
        ).join('\n\n');
        
        return `Here are today's top headlines:\n\n${summary}`;
      } else {
        return "I don't have any news available in the current feed.";
      }
    }

    // Help requests
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
      return `I can help you with the news that's currently loaded. I have ${news.length} articles covering:

Available categories:
• Local news from ${locations.currentPlace.city}
• National news from ${locations.currentPlace.country} and ${locations.nativePlace.country}
• International news
• Technology, Business, Health, Sports, Education

You can ask me:
• "What news do you have about [specific location]?"
• "Show me technology news"
• "Give me today's headlines"
• "Tell me about [specific topic]"

I'll only show you the actual news I have access to.`;
    }

    // Search through all news for keywords
    const searchResults = news.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.summary.toLowerCase().includes(lowerQuery) ||
      (article.location && article.location.toLowerCase().includes(lowerQuery))
    );

    if (searchResults.length > 0) {
      const results = searchResults.map((article, index) => 
        `${index + 1}. ${article.title}\n   Location: ${article.location || 'International'}\n   ${article.summary}`
      ).join('\n\n');
      
      return `I found ${searchResults.length} article(s) related to your query:\n\n${results}`;
    }

    // Default response when no specific information is found
    return `I don't have specific information about "${query}" in the current news feed. 

I have ${news.length} articles available covering news from ${locations.nativePlace.country}, ${locations.currentPlace.country}, and international topics.

You can ask me about:
• Specific locations (countries or cities)
• News categories (technology, business, health, sports, education)
• General headlines or summaries

What specific topic would you like to know about?`;
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      
      // Clean text for speech (remove markdown and special characters)
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = getVoiceLanguage(selectedLanguage);
      utterance.rate = speechRate;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const toggleSaveMessage = (id: string) => {
    setSavedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearChat = () => {
    setMessages([]);
    setSavedMessages(new Set());
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AI News Assistant</h1>
              <p className="text-sm text-gray-500">
                {news.length} articles • {locations.nativePlace.country} → {locations.currentPlace.country}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Export */}
          <button
            onClick={exportChat}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export chat"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Clear */}
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-blue-900">Chat Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-800">Auto-speak voice responses</span>
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-800">Speech rate:</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-blue-600">{speechRate}x</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {message.type === 'user' ? (
                      <>
                        {message.inputType === 'voice' ? (
                          <Mic className="w-3 h-3" />
                        ) : (
                          <MessageSquare className="w-3 h-3" />
                        )}
                        <span className="text-xs opacity-75">You</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-500">AI Assistant</span>
                      </>
                    )}
                  </div>
                  
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => speakText(message.content)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Read aloud"
                      >
                        <Play className="w-3 h-3 text-gray-400" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleSaveMessage(message.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Save message"
                      >
                        {savedMessages.has(message.id) ? (
                          <BookmarkCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Bookmark className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                  {message.isTyping && (
                    <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                  )}
                </div>

                {/* Message Footer */}
                <div className="flex items-center justify-between mt-2 text-xs opacity-60">
                  <span>{formatTime(message.timestamp)}</span>
                  {message.language && (
                    <span>{languages.find(l => l.code === message.language)?.flag}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Voice Transcript */}
          {(isListening || transcript) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <Mic className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {isListening ? 'Listening...' : 'Voice Input'}
                </span>
              </div>
              <div className="text-sm text-blue-800">
                {transcript || 'Speak now...'}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleTextSubmit} className="flex items-end space-x-3">
            {/* Voice Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about specific news, locations, or topics..."
                disabled={isProcessing}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>

            {/* Speaker Control */}
            <button
              type="button"
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
              className={`p-3 rounded-full transition-colors ${
                isSpeaking
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              `News from ${locations.nativePlace.country}`,
              `Local news in ${locations.currentPlace.city}`,
              'Technology news',
              'Business updates',
              'Today\'s headlines',
              'International news'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => !isProcessing && handleSendMessage(suggestion, 'text')}
                disabled={isProcessing}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};