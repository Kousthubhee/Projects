import React, { useState } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { ChatInterface } from './components/ChatInterface';
import { Country } from './types';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleBack = () => {
    setSelectedCountry(null);
  };

  return (
    <>
      {!selectedCountry ? (
        <CountrySelector onSelectCountry={handleSelectCountry} />
      ) : (
        <ChatInterface country={selectedCountry} onBack={handleBack} />
      )}
    </>
  );
}

export default App;