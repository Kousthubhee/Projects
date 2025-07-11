import React, { useState } from 'react';
import { LocationForm } from './components/LocationForm';
import { NewsDisplay } from './components/NewsDisplay';
import { UserLocations } from './types';

function App() {
  const [userLocations, setUserLocations] = useState<UserLocations | null>(null);

  const handleLocationSubmit = (locations: UserLocations) => {
    setUserLocations(locations);
  };

  const handleReset = () => {
    setUserLocations(null);
  };

  return (
    <div className="App">
      {!userLocations ? (
        <LocationForm onSubmit={handleLocationSubmit} />
      ) : (
        <NewsDisplay locations={userLocations} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;