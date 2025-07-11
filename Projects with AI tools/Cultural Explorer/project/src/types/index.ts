export interface Country {
  code: string;
  name: string;
  flag: string;
  language: string;
  languageCode: string;
  hasRegions?: boolean;
  parentCountry?: string;
}

export interface Continent {
  code: string;
  name: string;
  flag: string;
  countries: Country[];
  isComplete?: boolean; // Whether all countries are added
  totalCountries?: number; // Total number of countries that should be in this continent
  missingCount?: number; // Number of countries still to be added
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
  originalContent?: string;
}

export interface CulturalData {
  [countryCode: string]: {
    food: string[];
    celebrations: string[];
    traditions: string[];
    customs: string[];
    general: string[];
  };
}