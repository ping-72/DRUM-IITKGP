import { calculateFuelConsumption } from './EmissionByCar';

export default function calculateRouteEnergy(route, mode, carData) {
  let totalFuelConsumption = 0;
  const segments = route.instructions || [];

  console.log('Inside calculateRouteEnergy', { route, carData });

  // Loop over each segment in the route.
  for (let j = 0; j < segments.length; j++) {
    const segment = segments[j];
    const distanceMeters = segment.distance;
    const timeSeconds = segment.time / 1000;
    if (distanceMeters === 0 || timeSeconds === 0) continue;

    const averageSpeedKmh = (distanceMeters / timeSeconds) * 3.6;
    const distanceKm = distanceMeters / 1000;

    const params = {
      vehicleModel: carData.model, // e.g., "2018"
      fuelType: carData.fuelType, // e.g., "petrol" or "diesel"
      vehicleType: carData.carType, // e.g., "sedan", "hatchback", or "suv"
      distanceDriven: distanceKm, // segment distance in km
      averageSpeed: averageSpeedKmh, // segment average speed in km/h
    };

    const { fuelConsumption } = calculateFuelConsumption(params);
    totalFuelConsumption += fuelConsumption;
  }

  route.totalFuelConsumption = totalFuelConsumption;
  console.log('Total fuel consumption for route (litres):', totalFuelConsumption);

  return totalFuelConsumption;
}
