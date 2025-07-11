import { culturalData } from '../data/culturalData';
import { Country } from '../types';
import { countries, continents } from '../data/countries';

const responseTemplates = {
  food: [
    "Let me tell you about the wonderful cuisine of {country}!",
    "Food in {country} is absolutely fascinating!",
    "The culinary traditions of {country} are rich and diverse.",
  ],
  celebrations: [
    "Celebrations in {country} are truly special!",
    "Let me share how people in {country} celebrate!",
    "The festivals and celebrations of {country} are amazing!",
  ],
  traditions: [
    "The traditions of {country} are deeply meaningful.",
    "Here's something beautiful about {country}'s cultural traditions:",
    "The cultural heritage of {country} includes these wonderful traditions:",
  ],
  customs: [
    "The customs in {country} are quite interesting!",
    "Let me explain some important customs from {country}:",
    "Understanding {country}'s customs helps appreciate the culture:",
  ],
  general: [
    "Here's something fascinating about {country}'s culture:",
    "Let me share an interesting aspect of life in {country}:",
    "The culture of {country} has many unique characteristics:",
  ]
};

// Comprehensive list of location identifiers for detection
const createLocationDatabase = () => {
  const locations = new Map<string, { name: string; code: string; type: 'country' | 'region' | 'continent'; parentCountry?: string }>();
  
  // Add all countries
  countries.forEach(country => {
    const variations = [
      country.name.toLowerCase(),
      country.code.toLowerCase(),
      // Add common variations and alternative names
      ...getLocationVariations(country.name)
    ];
    
    variations.forEach(variation => {
      locations.set(variation, { 
        name: country.name, 
        code: country.code, 
        type: country.parentCountry ? 'region' : 'country',
        parentCountry: country.parentCountry 
      });
    });
  });
  
  // Add all continents
  continents.forEach(continent => {
    const variations = [
      continent.name.toLowerCase(),
      continent.code.toLowerCase(),
      ...getLocationVariations(continent.name)
    ];
    
    variations.forEach(variation => {
      locations.set(variation, { name: continent.name, code: continent.code, type: 'continent' });
    });
  });
  
  // Add major cities and alternative names with their parent countries
  const cityMappings = {
    // Thai cities and regions
    'bangkok': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'pattaya': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'chiang mai': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'phuket': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'krabi': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'koh samui': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'ayutthaya': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'hua hin': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'kanchanaburi': { name: 'Thailand', code: 'TH', type: 'country' as const },
    'chiang rai': { name: 'Thailand', code: 'TH', type: 'country' as const },
    
    // Major world cities
    'tokyo': { name: 'Japan', code: 'JP', type: 'country' as const },
    'kyoto': { name: 'Japan', code: 'JP', type: 'country' as const },
    'osaka': { name: 'Japan', code: 'JP', type: 'country' as const },
    'hiroshima': { name: 'Japan', code: 'JP', type: 'country' as const },
    'beijing': { name: 'China', code: 'CN', type: 'country' as const },
    'shanghai': { name: 'China', code: 'CN', type: 'country' as const },
    'hong kong': { name: 'China', code: 'CN', type: 'country' as const },
    'mumbai': { name: 'India', code: 'IN', type: 'country' as const },
    'delhi': { name: 'India', code: 'IN', type: 'country' as const },
    'bangalore': { name: 'India', code: 'IN', type: 'country' as const },
    'chennai': { name: 'India', code: 'IN', type: 'country' as const },
    'kolkata': { name: 'India', code: 'IN', type: 'country' as const },
    'paris': { name: 'France', code: 'FR', type: 'country' as const },
    'lyon': { name: 'France', code: 'FR', type: 'country' as const },
    'marseille': { name: 'France', code: 'FR', type: 'country' as const },
    'berlin': { name: 'Germany', code: 'DE', type: 'country' as const },
    'munich': { name: 'Germany', code: 'DE', type: 'country' as const },
    'hamburg': { name: 'Germany', code: 'DE', type: 'country' as const },
    'rome': { name: 'Italy', code: 'IT', type: 'country' as const },
    'milan': { name: 'Italy', code: 'IT', type: 'country' as const },
    'venice': { name: 'Italy', code: 'IT', type: 'country' as const },
    'florence': { name: 'Italy', code: 'IT', type: 'country' as const },
    'madrid': { name: 'Spain', code: 'ES', type: 'country' as const },
    'barcelona': { name: 'Spain', code: 'ES', type: 'country' as const },
    'seville': { name: 'Spain', code: 'ES', type: 'country' as const },
    'london': { name: 'United Kingdom', code: 'GB', type: 'country' as const },
    'manchester': { name: 'United Kingdom', code: 'GB', type: 'country' as const },
    'edinburgh': { name: 'United Kingdom', code: 'GB', type: 'country' as const },
    'new york': { name: 'United States', code: 'US', type: 'country' as const },
    'los angeles': { name: 'United States', code: 'US', type: 'country' as const },
    'chicago': { name: 'United States', code: 'US', type: 'country' as const },
    'san francisco': { name: 'United States', code: 'US', type: 'country' as const },
    'miami': { name: 'United States', code: 'US', type: 'country' as const },
    'las vegas': { name: 'United States', code: 'US', type: 'country' as const },
    'toronto': { name: 'Canada', code: 'CA', type: 'country' as const },
    'vancouver': { name: 'Canada', code: 'CA', type: 'country' as const },
    'montreal': { name: 'Canada', code: 'CA', type: 'country' as const },
    'sydney': { name: 'Australia', code: 'AU', type: 'country' as const },
    'melbourne': { name: 'Australia', code: 'AU', type: 'country' as const },
    'perth': { name: 'Australia', code: 'AU', type: 'country' as const },
    'seoul': { name: 'South Korea', code: 'KR', type: 'country' as const },
    'busan': { name: 'South Korea', code: 'KR', type: 'country' as const },
    'singapore': { name: 'Singapore', code: 'SG', type: 'country' as const },
    'kuala lumpur': { name: 'Malaysia', code: 'MY', type: 'country' as const },
    'jakarta': { name: 'Indonesia', code: 'ID', type: 'country' as const },
    'bali': { name: 'Indonesia', code: 'ID', type: 'country' as const },
    'manila': { name: 'Philippines', code: 'PH', type: 'country' as const },
    'ho chi minh': { name: 'Vietnam', code: 'VN', type: 'country' as const },
    'hanoi': { name: 'Vietnam', code: 'VN', type: 'country' as const },
    'cairo': { name: 'Egypt', code: 'EG', type: 'country' as const },
    'alexandria': { name: 'Egypt', code: 'EG', type: 'country' as const },
    'casablanca': { name: 'Morocco', code: 'MA', type: 'country' as const },
    'marrakech': { name: 'Morocco', code: 'MA', type: 'country' as const },
    'cape town': { name: 'South Africa', code: 'ZA', type: 'country' as const },
    'johannesburg': { name: 'South Africa', code: 'ZA', type: 'country' as const },
    'lagos': { name: 'Nigeria', code: 'NG', type: 'country' as const },
    'nairobi': { name: 'Kenya', code: 'KE', type: 'country' as const },
    'rio de janeiro': { name: 'Brazil', code: 'BR', type: 'country' as const },
    'são paulo': { name: 'Brazil', code: 'BR', type: 'country' as const },
    'buenos aires': { name: 'Argentina', code: 'AR', type: 'country' as const },
    'lima': { name: 'Peru', code: 'PE', type: 'country' as const },
    'bogotá': { name: 'Colombia', code: 'CO', type: 'country' as const },
    'santiago': { name: 'Chile', code: 'CL', type: 'country' as const },
    'mexico city': { name: 'Mexico', code: 'MX', type: 'country' as const },
    'guadalajara': { name: 'Mexico', code: 'MX', type: 'country' as const },
    'cancun': { name: 'Mexico', code: 'MX', type: 'country' as const },
    'moscow': { name: 'Russia', code: 'RU', type: 'country' as const },
    'st petersburg': { name: 'Russia', code: 'RU', type: 'country' as const },
    'istanbul': { name: 'Turkey', code: 'TR', type: 'country' as const },
    'ankara': { name: 'Turkey', code: 'TR', type: 'country' as const },
    'athens': { name: 'Greece', code: 'GR', type: 'country' as const },
    'santorini': { name: 'Greece', code: 'GR', type: 'country' as const },
    'mykonos': { name: 'Greece', code: 'GR', type: 'country' as const },
  };
  
  Object.entries(cityMappings).forEach(([city, location]) => {
    locations.set(city, location);
  });
  
  return locations;
};

const getLocationVariations = (name: string): string[] => {
  const variations = [];
  const lower = name.toLowerCase();
  
  // Common variations
  variations.push(lower);
  variations.push(lower.replace(/\s+/g, ''));
  variations.push(lower.replace(/\s+/g, '-'));
  variations.push(lower.replace(/\s+/g, '_'));
  
  // Handle "United States" variations
  if (lower.includes('united states')) {
    variations.push('usa', 'us', 'america', 'united states of america');
  }
  
  // Handle "United Kingdom" variations
  if (lower.includes('united kingdom')) {
    variations.push('uk', 'britain', 'great britain', 'england');
  }
  
  // Handle "South Korea" variations
  if (lower.includes('south korea')) {
    variations.push('korea', 'republic of korea');
  }
  
  // Handle "North Korea" variations
  if (lower.includes('north korea')) {
    variations.push('dprk', 'democratic people\'s republic of korea');
  }
  
  // Handle other common variations
  const commonVariations: { [key: string]: string[] } = {
    'netherlands': ['holland'],
    'switzerland': ['swiss'],
    'czech republic': ['czechia'],
    'bosnia and herzegovina': ['bosnia'],
    'democratic republic of congo': ['drc', 'congo'],
    'ivory coast': ['côte d\'ivoire'],
    'myanmar': ['burma'],
    'north macedonia': ['macedonia'],
    'east timor': ['timor-leste'],
    'cape verde': ['cabo verde'],
  };
  
  Object.entries(commonVariations).forEach(([key, vars]) => {
    if (lower.includes(key)) {
      variations.push(...vars);
    }
  });
  
  return variations;
};

const locationDatabase = createLocationDatabase();

const getParentCountryCode = (country: Country): string => {
  // If it's a region, get the parent country code
  if (country.parentCountry) {
    const parentCountry = countries.find(c => c.name === country.parentCountry);
    return parentCountry?.code || country.code;
  }
  return country.code;
};

const detectOtherLocation = (question: string, currentCountry: Country): { detected: boolean; location?: { name: string; code: string; type: string } } => {
  const lowerQuestion = question.toLowerCase();
  
  // Remove common words that might interfere with detection
  const cleanQuestion = lowerQuestion
    .replace(/\b(what|how|where|when|why|who|tell|me|about|in|from|of|the|a|an|is|are|do|does|did|can|could|would|should|will)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split into words and check each phrase
  const words = cleanQuestion.split(' ');
  
  // Get the current country's base country code (for regions)
  const currentCountryCode = getParentCountryCode(currentCountry);
  
  // Check for multi-word locations first (longer phrases have priority)
  for (let i = 0; i < words.length; i++) {
    for (let j = words.length; j > i; j--) {
      const phrase = words.slice(i, j).join(' ').trim();
      if (phrase.length > 2) { // Avoid very short phrases
        const location = locationDatabase.get(phrase);
        if (location) {
          // Check if the detected location is from a different country
          const detectedCountryCode = location.type === 'region' && location.parentCountry 
            ? countries.find(c => c.name === location.parentCountry)?.code || location.code
            : location.code;
          
          // Only trigger redirection if it's a different country
          if (detectedCountryCode !== currentCountryCode && location.code !== currentCountry.code) {
            return { detected: true, location };
          }
        }
      }
    }
  }
  
  return { detected: false };
};

const generateRedirectionMessage = (detectedLocation: { name: string; code: string; type: string }, currentCountry: Country): string => {
  const messages = [
    `I notice you're asking about ${detectedLocation.name}, but our current chat is focused on ${currentCountry.parentCountry || currentCountry.name}! 🌍`,
    `That's an interesting question about ${detectedLocation.name}! However, this conversation is dedicated to exploring ${currentCountry.parentCountry || currentCountry.name}. 🗺️`,
    `I'd love to tell you about ${detectedLocation.name}, but right now we're discovering the culture of ${currentCountry.parentCountry || currentCountry.name}! 🎭`,
    `Great question about ${detectedLocation.name}! This chat session is specifically about ${currentCountry.parentCountry || currentCountry.name} though. 🌟`,
  ];
  
  const redirectionInstructions = [
    `To learn about ${detectedLocation.name}, please go back to the main page and select ${detectedLocation.name} to start a new cultural exploration! ✨`,
    `If you'd like to explore ${detectedLocation.name}'s culture, head back to the country selector and choose ${detectedLocation.name} for a dedicated chat session! 🚀`,
    `To discover ${detectedLocation.name}'s fascinating culture, return to the main page and select ${detectedLocation.name} from the ${detectedLocation.type === 'continent' ? 'continent list' : 'country list'}! 🎯`,
    `For information about ${detectedLocation.name}, please navigate back and select ${detectedLocation.name} to start a focused conversation about that location! 🧭`,
  ];
  
  const currentLocationPrompts = [
    `Meanwhile, feel free to ask me anything about ${currentCountry.parentCountry || currentCountry.name}'s food, traditions, celebrations, or customs! 🍽️🎉`,
    `I'm here to help you discover everything about ${currentCountry.parentCountry || currentCountry.name} - from delicious cuisine to fascinating traditions! 🌟`,
    `Let's continue exploring ${currentCountry.parentCountry || currentCountry.name}! Ask me about their festivals, food culture, or daily customs! 🎭`,
    `I have lots to share about ${currentCountry.parentCountry || currentCountry.name}'s rich culture - what would you like to know? 🤔`,
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const randomRedirection = redirectionInstructions[Math.floor(Math.random() * redirectionInstructions.length)];
  const randomPrompt = currentLocationPrompts[Math.floor(Math.random() * currentLocationPrompts.length)];
  
  return `${randomMessage}\n\n${randomRedirection}\n\n${randomPrompt}`;
};

export const getCulturalResponse = (question: string, country: Country): string => {
  // First check if the question is about a different location
  const otherLocationCheck = detectOtherLocation(question, country);
  if (otherLocationCheck.detected && otherLocationCheck.location) {
    return generateRedirectionMessage(otherLocationCheck.location, country);
  }
  
  // Get the appropriate cultural data - use parent country data for regions
  const dataKey = country.parentCountry ? getParentCountryCode(country) : country.code;
  const countryData = culturalData[dataKey];
  
  if (!countryData) {
    const countryName = country.parentCountry || country.name;
    return `I'd love to help you learn about ${countryName}, but I don't have detailed information about this location yet. Feel free to ask me about other countries like Japan, France, Italy, Spain, Germany, or China! 🌍\n\nYou can go back to the main page to select a different country with comprehensive cultural information! ✨`;
  }

  const lowerQuestion = question.toLowerCase();
  
  let category: keyof typeof countryData = 'general';
  let responses = countryData.general;

  if (lowerQuestion.includes('food') || lowerQuestion.includes('eat') || lowerQuestion.includes('cuisine') || lowerQuestion.includes('cook') || lowerQuestion.includes('dish') || lowerQuestion.includes('meal')) {
    category = 'food';
    responses = countryData.food;
  } else if (lowerQuestion.includes('celebrat') || lowerQuestion.includes('festival') || lowerQuestion.includes('holiday') || lowerQuestion.includes('new year') || lowerQuestion.includes('party') || lowerQuestion.includes('event')) {
    category = 'celebrations';
    responses = countryData.celebrations;
  } else if (lowerQuestion.includes('tradition') || lowerQuestion.includes('culture') || lowerQuestion.includes('heritage') || lowerQuestion.includes('history') || lowerQuestion.includes('ancient')) {
    category = 'traditions';
    responses = countryData.traditions;
  } else if (lowerQuestion.includes('custom') || lowerQuestion.includes('manner') || lowerQuestion.includes('etiquette') || lowerQuestion.includes('behav') || lowerQuestion.includes('greet') || lowerQuestion.includes('polite')) {
    category = 'customs';
    responses = countryData.customs;
  }

  const template = responseTemplates[category][Math.floor(Math.random() * responseTemplates[category].length)];
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  const displayName = country.parentCountry || country.name;
  return `${template.replace('{country}', displayName)} ${response}`;
};