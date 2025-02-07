// average speed is to be given by the routes end-point

export function calculateFuelConsumption({ vehicleModel, fuelType, vehicleType, distanceDriven, averageSpeed = 50 }) {
  // 1. Set the baseline mileage (for a Petrol Hatchback, Model Year 2020, at v_opt=50 km/h)
  const baselineMileage = 18; // km/l

  // 2. Determine the body-type multiplier (α_body)
  let alphaBody;
  switch (vehicleType.toLowerCase()) {
    case 'hatchback':
      alphaBody = 1.0;
      break;
    case 'sedan':
      alphaBody = 0.95;
      break;
    case 'suv':
      alphaBody = 0.8;
      break;
    default:
      // If an unknown type is provided, assume the baseline value.
      alphaBody = 1.0;
      break;
  }

  // 3. Determine the fuel-type multiplier (α_fuel)
  let alphaFuel;
  if (fuelType.toLowerCase() === 'diesel') {
    alphaFuel = 1.15;
  } else if (fuelType.toLowerCase() === 'petrol') {
    alphaFuel = 1.0;
  } else if (fuelType.toLowerCase() === 'ev') {
    // For EVs, fuel consumption in litres is not applicable.
    return {
      effectiveMileage: Infinity,
      fuelConsumption: 0,
      message: 'Electric Vehicle: No fuel consumption in litres',
    };
  } else {
    // Default if an unknown fuel type is provided.
    alphaFuel = 1.0;
  }

  // 4. Compute the vehicle age factor (α_year)
  const referenceYear = 2020;
  const modelYear = parseInt(vehicleModel, 10);
  let age = referenceYear - modelYear;
  if (age < 0) age = 0; // If the vehicle is from the future, treat it as 0 years old.
  const k = 0.01;
  const alphaYear = 1 - age * k;

  // 5. Compute the average speed factor (α_speed)
  const vOpt = 50; // optimal speed (km/h)
  const beta = 0.005;
  const alphaSpeed = 1 - beta * Math.abs(averageSpeed - vOpt);

  // 6. Calculate the Effective Mileage (EM)
  const effectiveMileage = baselineMileage * alphaBody * alphaFuel * alphaYear * alphaSpeed;

  // 7. Compute total fuel consumption (in litres)
  const fuelConsumption = distanceDriven / effectiveMileage;

  return { effectiveMileage, fuelConsumption };
}
