import React, { useState } from 'react';
import { minMaxNormalize, zScoreNormalize } from './NormalizationFunction'; // Correctly importing functions

const ParametersNormalizedValues = ({ data, setData }) => {
  const [importance, setImportance] = useState({
    timeTaken: 3,
    distance: 3,
    cost: 0,
    aqiExposure: 3,
    fuelConsumption: 0,
  });

  const handleSliderChange = (event, key) => {
    setImportance((prev) => ({
      ...prev,
      [key]: Number(event.target.value),
    }));
  };

  // Function to handle the button click and calculate the normalized values
  const handlePredict = () => {
    const values = Object.values(importance); // Get the array of values
    const minMaxNormalized = minMaxNormalize(values); // Normalize with minMax
    const zScoreNormalized = zScoreNormalize(values); // Normalize with zScore

    // Create tagged data for each parameter with normalized values
    const taggedData = Object.keys(importance).reduce((result, key, index) => {
      result[key] = {
        original: importance[key],
        minMax: minMaxNormalized[index],
        zScore: zScoreNormalized[index],
      };
      return result;
    }, {});

    setData(taggedData); // Use setData to return the tagged data to the parent component
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Rate the Importance for Your Journey</h2>

      <label>
        Time Required for Completion
        <br />
        <input type="range" min="0" max="5" value={importance.timeTaken} onChange={(e) => handleSliderChange(e, 'timeTaken')} />
        {importance.timeTaken}
      </label>
      <br />

      <label>
        Total Distance
        <br />
        <input type="range" min="0" max="5" value={importance.distance} onChange={(e) => handleSliderChange(e, 'distance')} />
        {importance.distance}
      </label>
      <br />

      <label>
        Total Cost (Fuel Consumption)
        <br />
        <input
          type="range"
          min="0"
          max="5"
          // value={importance.cost} onChange={(e) => handleSliderChange(e, 'cost')}
        />
        {importance.cost}
      </label>
      <br />

      <label>
        AQI Exposure Level
        <br />
        <input type="range" min="0" max="5" value={importance.aqiExposure} onChange={(e) => handleSliderChange(e, 'aqiExposure')} />
        {importance.aqiExposure}
      </label>
      <br />

      <label>
        Fuel Consumption Rate
        <br />
        <input
          type="range"
          min="0"
          max="5"
          value={importance.fuelConsumption}
          // onChange={(e) => handleSliderChange(e, 'fuelConsumption')}
        />
        {importance.fuelConsumption}
      </label>

      <br />
      <button className="border rounded-2xl p-2" onClick={handlePredict}>
        Predict Factors
      </button>
    </div>
  );
};

export default ParametersNormalizedValues;
