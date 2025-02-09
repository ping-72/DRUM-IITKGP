import React, { createContext, useState, useContext, useEffect } from 'react';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  // Initialize carData from localStorage if available,
  const [carData, setCarData] = useState(() => {
    const storedCarData = localStorage.getItem('carData');
    return storedCarData
      ? JSON.parse(storedCarData)
      : {
          company: '',
          model: '',
          productionYear: Number,
          distanceDriven: Number,
          averageSpeed: Number,
          fuelType: '',
          carType: '',
          mileage: '',
        };
  });

  useEffect(() => {
    localStorage.setItem('carData', JSON.stringify(carData));
    console.log('Car Data:', carData);
  }, [carData]);

  const updateCarData = (newData) => {
    const updatedCarData = { ...carData, ...newData };
    setCarData(updatedCarData);
    return updatedCarData;
  };

  return <CarContext.Provider value={{ carData, updateCarData }}>{children}</CarContext.Provider>;
};

export const useCar = () => {
  const context = useContext(CarContext);
  if (!CarContext) throw new Error('useCar must be used within a CarProvider');
  return context;
};
