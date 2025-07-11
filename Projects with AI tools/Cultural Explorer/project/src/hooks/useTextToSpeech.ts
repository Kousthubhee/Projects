import { useState, useCallback, useEffect } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  stop: () => void;
  isSupported: boolean;
  availableVoices: SpeechSynthesisVoice[];
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    };

    // Load voices immediately
    loadVoices();

    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const findBestVoice = (lang: string): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Enhanced language mapping for better voice selection
    const languageMap: { [key: string]: string[] } = {
      // Thai language with multiple search terms
      'th-TH': ['th-TH', 'th', 'thai', 'ไทย', 'thailand'],
      
      // Indian languages
      'ta-IN': ['ta-IN', 'ta', 'tamil', 'தமிழ்'],
      'te-IN': ['te-IN', 'te', 'telugu', 'తెలుగు'],
      'hi-IN': ['hi-IN', 'hi', 'hindi', 'हिन्दी'],
      'bn-IN': ['bn-IN', 'bn', 'bengali', 'বাংলা'],
      'kn-IN': ['kn-IN', 'kn', 'kannada', 'ಕನ್ನಡ'],
      'ml-IN': ['ml-IN', 'ml', 'malayalam', 'മലയാളം'],
      'mr-IN': ['mr-IN', 'mr', 'marathi', 'मराठी'],
      'gu-IN': ['gu-IN', 'gu', 'gujarati', 'ગુજરાતી'],
      'pa-IN': ['pa-IN', 'pa', 'punjabi', 'ਪੰਜਾਬੀ'],
      'or-IN': ['or-IN', 'or', 'odia', 'ଓଡ଼ିଆ'],
      'as-IN': ['as-IN', 'as', 'assamese', 'অসমীয়া'],
      
      // Other Asian languages
      'ja-JP': ['ja-JP', 'ja', 'japanese', '日本語'],
      'ko-KR': ['ko-KR', 'ko', 'korean', '한국어'],
      'zh-CN': ['zh-CN', 'zh', 'chinese', 'mandarin', '中文'],
      'zh-HK': ['zh-HK', 'zh-TW', 'yue', 'cantonese', '粵語'],
      'vi-VN': ['vi-VN', 'vi', 'vietnamese', 'tiếng việt'],
      
      // European languages
      'fr-FR': ['fr-FR', 'fr', 'french', 'français'],
      'de-DE': ['de-DE', 'de', 'german', 'deutsch'],
      'it-IT': ['it-IT', 'it', 'italian', 'italiano'],
      'es-ES': ['es-ES', 'es', 'spanish', 'español', 'castilian'],
      'es-MX': ['es-MX', 'es-419', 'es', 'spanish', 'español'],
      'pt-BR': ['pt-BR', 'pt', 'portuguese', 'português'],
      'ru-RU': ['ru-RU', 'ru', 'russian', 'русский'],
      'ar-EG': ['ar-EG', 'ar', 'arabic', 'العربية'],
      'ar-MA': ['ar-MA', 'ar', 'arabic', 'العربية'],
      'tr-TR': ['tr-TR', 'tr', 'turkish', 'türkçe'],
      'el-GR': ['el-GR', 'el', 'greek', 'ελληνικά'],
      'en-NG': ['en-NG', 'en-GB', 'en', 'english'],
      'en-ZA': ['en-ZA', 'en-GB', 'en', 'english'],
      
      // Regional variants
      'ca-ES': ['ca-ES', 'ca', 'catalan', 'català'],
      'eu-ES': ['eu-ES', 'eu', 'basque', 'euskera'],
      'gl-ES': ['gl-ES', 'gl', 'galician', 'galego'],
      'tt-RU': ['tt-RU', 'tt', 'tatar', 'татар'],
    };

    const searchTerms = languageMap[lang] || [lang];

    console.log(`🔍 Searching for voice for language: ${lang}`);
    console.log(`🔍 Search terms: ${searchTerms.join(', ')}`);

    // Try to find exact language match first
    for (const term of searchTerms) {
      const exactMatch = availableVoices.find(voice => 
        voice.lang.toLowerCase() === term.toLowerCase()
      );
      if (exactMatch) {
        console.log(`✅ Found exact language match: ${exactMatch.name} (${exactMatch.lang}) for ${lang}`);
        return exactMatch;
      }
    }

    // Try to find partial match in language code
    for (const term of searchTerms) {
      const partialMatch = availableVoices.find(voice => 
        voice.lang.toLowerCase().includes(term.toLowerCase()) ||
        voice.lang.toLowerCase().startsWith(term.toLowerCase())
      );
      if (partialMatch) {
        console.log(`✅ Found partial language match: ${partialMatch.name} (${partialMatch.lang}) for ${lang}`);
        return partialMatch;
      }
    }

    // Try to find match in voice name (case insensitive)
    for (const term of searchTerms) {
      const nameMatch = availableVoices.find(voice => 
        voice.name.toLowerCase().includes(term.toLowerCase())
      );
      if (nameMatch) {
        console.log(`✅ Found name match: ${nameMatch.name} (${nameMatch.lang}) for ${lang}`);
        return nameMatch;
      }
    }

    // Special handling for Thai
    if (lang === 'th-TH') {
      // Look for any voice that might be Thai-related
      const thaiVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('th') ||
        voice.lang.toLowerCase().includes('th') ||
        voice.name.toLowerCase().includes('asia') ||
        voice.name.toLowerCase().includes('southeast')
      );
      if (thaiVoice) {
        console.log(`✅ Using Thai-related voice: ${thaiVoice.name} (${thaiVoice.lang}) for ${lang}`);
        return thaiVoice;
      }
    }

    // Special fallbacks for specific regions
    if (lang.includes('-IN')) {
      // For Indian languages, try to find any Indian English voice as fallback
      const indianEnglish = availableVoices.find(voice => 
        voice.lang.toLowerCase().includes('en-in') ||
        voice.name.toLowerCase().includes('indian') ||
        voice.name.toLowerCase().includes('india')
      );
      if (indianEnglish) {
        console.log(`✅ Using Indian English fallback: ${indianEnglish.name} for ${lang}`);
        return indianEnglish;
      }
    }

    if (lang.startsWith('es-')) {
      // For Spanish variants, prefer any Spanish voice
      const spanishVoice = availableVoices.find(voice => 
        voice.lang.toLowerCase().startsWith('es')
      );
      if (spanishVoice) {
        console.log(`✅ Using Spanish fallback: ${spanishVoice.name} for ${lang}`);
        return spanishVoice;
      }
    }

    if (lang.startsWith('en-')) {
      // For English variants, prefer any English voice
      const englishVoice = availableVoices.find(voice => 
        voice.lang.toLowerCase().startsWith('en')
      );
      if (englishVoice) {
        console.log(`✅ Using English fallback: ${englishVoice.name} for ${lang}`);
        return englishVoice;
      }
    }

    console.log(`❌ No suitable voice found for ${lang}, using browser default`);
    return null;
  };

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Adjust speech parameters based on language
    if (lang === 'th-TH') {
      // Thai-specific speech parameters for better pronunciation
      utterance.rate = 0.8; // Slower rate for Thai
      utterance.pitch = 1.1; // Slightly higher pitch
      utterance.volume = 1.0;
    } else if (lang.includes('-IN')) {
      // Indian language parameters
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
    } else {
      // Default parameters
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
    }

    // Find the best available voice
    const bestVoice = findBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      console.log(`🎤 Speaking with: ${bestVoice.name} (${bestVoice.lang}) for language: ${lang}`);
    } else {
      console.log(`🎤 No specific voice found for ${lang}, using browser default with language setting`);
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log(`🗣️ Started speaking: "${text.substring(0, 50)}..." in ${lang}`);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log(`✅ Finished speaking in ${lang}`);
    };
    
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error(`❌ Speech error for ${lang}:`, event.error);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, availableVoices]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    isSpeaking,
    stop,
    isSupported,
    availableVoices
  };
};