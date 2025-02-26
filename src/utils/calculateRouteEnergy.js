import { calculateFuelConsumption } from './EmissionByCar';
import { useCar } from '../components/newFileStr/contexts/Carcontext';

export default function calculateRouteEnergy(route, mode) {
  let totalFuelConsumption = 0;
  const segments = route.instructions || [];
  const carData = useCar();

  console.log('Inside calculateRouteEnergy', { route, carData });

  // Loop over each segment (simple path) in the route.
  for (let j = 0; j < segments.length; j++) {
    const segment = segments[j];
    const distanceMeters = segment.distance;
    const timeSeconds = segment.time / 1000;
    if (distanceMeters === 0 || timeSeconds === 0) continue;

    // Compute average speed in km/h and distance in km.
    const averageSpeedKmh = (distanceMeters / timeSeconds) * 3.6;
    const distanceKm = distanceMeters / 1000;

    // Prepare parameters from carData (passed from context) and segment info.
    const params = {
      vehicleModel: carData.model, // e.g., "2018"
      fuelType: carData.fuelType, // e.g., "petrol" or "diesel"
      vehicleType: carData.carType, // e.g., "sedan", "hatchback", or "suv"
      distanceDriven: distanceKm, // segment distance in km
      averageSpeed: averageSpeedKmh, // segment average speed in km/h
    };

    // Calculate fuel consumption for this segment.
    const { fuelConsumption } = calculateFuelConsumption(params);
    totalFuelConsumption += fuelConsumption;
  }

  // Attach the total fuel consumption (in litres) to the route.
  route.totalFuelConsumption = totalFuelConsumption;
  console.log('Total fuel consumption for route (litres):', totalFuelConsumption);

  return totalFuelConsumption;
}
