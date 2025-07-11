import React, { useState } from 'react';
import { MapPin, Globe, ArrowRight } from 'lucide-react';
import { Location, UserLocations } from '../types';

interface LocationFormProps {
  onSubmit: (locations: UserLocations) => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({ onSubmit }) => {
  const [nativeCity, setNativeCity] = useState('');
  const [nativeCountry, setNativeCountry] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nativeCity || !nativeCountry || !currentCity || !currentCountry) {
      return;
    }

    const locations: UserLocations = {
      nativePlace: { city: nativeCity, country: nativeCountry },
      currentPlace: { city: currentCity, country: currentCountry },
    };

    onSubmit(locations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Global Student News
          </h1>
          <p className="text-lg text-gray-600">
            Stay connected with news from home and your new destination
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Your Home</h3>
              </div>
              
              <div>
                <label htmlFor="nativeCity" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="nativeCity"
                  value={nativeCity}
                  onChange={(e) => setNativeCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Hyderabad"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="nativeCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="nativeCountry"
                  value={nativeCountry}
                  onChange={(e) => setNativeCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., India"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">Current Location</h3>
              </div>
              
              <div>
                <label htmlFor="currentCity" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="currentCity"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Rouen"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="currentCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="currentCountry"
                  value={currentCountry}
                  onChange={(e) => setCurrentCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="e.g., France"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <span>Get My Personalized News</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};