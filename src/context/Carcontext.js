import React, { createContext, useState, useContext } from 'react';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [carData, setCarData] = useState({
    model: '',
    fuelType: '',
    vehicleType: '',
  });

  const updateCarData = (newData) => setCarData((prev) => ({ ...prev, ...newData }));

  return <CarContext.Provider value={{ carData, updateCarData }}>{children}</CarContext.Provider>;
};

// Hook to use CarContext
export const useCar = () => useContext(CarContext);
