import React, { createContext, useState, useContext } from 'react';

const RouteContext = createContext();

const RouteProvider = ({ children }) => {
  const [routesParameters, setRoutesParameter] = useState([]);

  const addRoute = (route) => {
    setRoutesParameter((prevRoutes) => [
      ...prevRoutes,
      {
        id: prevRoutes.length + 1,
        totalDistance: route.totalDistance,
        totalTime: route.totalTime,
        aqiExposure: route.aqiExposure,
        energyConsumed: route.energyConsumed,
      },
    ]);
  };

  return <RouteContext.Provider value={{ routes, addRoute }}>{children}</RouteContext.Provider>;
};

export default RouteProvider;

// Hook to use RouteContext
export const useRoute = () => useContext(RouteContext);
