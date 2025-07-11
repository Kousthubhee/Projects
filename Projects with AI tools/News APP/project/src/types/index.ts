export interface Location {
  city: string;
  country: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'local' | 'national' | 'international' | 'technology' | 'business' | 'health' | 'sports' | 'education';
  location?: string;
  timestamp: Date;
  readTime: number;
  articleUrl?: string; // Placeholder for full article URL
}

export interface UserLocations {
  nativePlace: Location;
  currentPlace: Location;
}

// Placeholder interfaces for future API integration
export interface NewsAPIResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  categories: string[];
  locations: UserLocations;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query: string;
  category?: string;
  location?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Voice Assistant Types
export interface VoiceCommand {
  id: string;
  transcript: string;
  intent: 'news_query' | 'location_specific' | 'category_filter' | 'language_change' | 'summary_request';
  entities: {
    location?: string;
    category?: string;
    language?: string;
    timeframe?: string;
  };
  confidence: number;
  timestamp: Date;
}

export interface VoiceResponse {
  id: string;
  commandId: string;
  text: string;
  audioUrl?: string;
  language: string;
  synthesized: boolean;
  timestamp: Date;
}

// Global type extensions for Speech APIs
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}