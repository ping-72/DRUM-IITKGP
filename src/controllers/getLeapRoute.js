import calculateRouteEnergy from '../utils/calculateRouteEnergy';
import calculateRouteExposureGraphhopper from '../utils/calculateRouteExposureGraphhopper';

// Now carData will be passed as a parameter.
export default async function getLeapRoute(routes, mode, carData) {
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: '',
    },
  };

  // For each route, update (or log) its exposure
  for (let i = 0; i < routes.length; i++) {
    routes[i] = await calculateRouteExposureGraphhopper(routes[i]);
    console.log('Final route:', JSON.parse(JSON.stringify(routes[i])));
    console.log('Total route exposure is:', routes[i].totalExposure);
  }

  // Sort routes by their totalExposure value
  routes.sort((a, b) => a.totalExposure - b.totalExposure);
  console.log('Sorted routes:', routes);

  // Calculate energy for the chosen (lowest exposure) route using the passed carData.
  routes[0].totalEnergy = calculateRouteEnergy(routes[0], mode, carData);
  console.log('Inside getLeapRoute, totalEnergy:', routes[0].totalEnergy);

  // Set geojson coordinates to the selected route's coordinates
  geojson.geometry.coordinates = routes[0].points.coordinates;
  console.log('Inside getLeapRoute, final Routes:', routes);

  return { geojson, routes };
}
