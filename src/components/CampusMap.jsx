// src/components/CampusMap.jsx
import React, { useState } from 'react';
import '../styles/CampusMap.css'; // Ensure this CSS file exists and matches the styles below

import { location_info } from '../data/locationInfo'; // Correct file name

const CampusMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="campus-map-container">
      <h2>🗺 Explore SECE Campus</h2>

      <div className="map-grid">
        {Object.keys(location_info).map((loc, idx) => (
          <div
            key={idx}
            className={`map-node ${selectedLocation === loc ? 'active' : ''}`}
            onClick={() => handleClick(loc)}
          >
            {loc.replace(/F[0-9]+_/, '').replace(/_/g, ' ')}
          </div>
        ))}
      </div>

      {selectedLocation && (
        <div className="location-info-box">
          <h3>{selectedLocation.replace(/F[0-9]+_/, '').replace(/_/g, ' ')}</h3>
          <p>{location_info[selectedLocation]}</p>
        </div>
      )}
    </div>
  );
};

export default CampusMap;
