import calculateRouteExposureMapbox from '../utils/calculateRouteExposureMapbox.js';
import calculateRouteExposureGraphhopper from '../utils/calculateRouteExposureGraphhopper.js';
import calculateRouteEnergy from '../utils/calculateRouteEnergy.js';
import { CarProvider, useCar } from '../components/newFileStr/contexts/Carcontext.js';
import { calculateFuelConsumption } from '../utils/EmissionByCar.js';

export default async function getFastestRoute(routes, mode, carData) {
  if (!routes || !Array.isArray(routes) || routes.length === 0) {
    throw new Error('Invalid routes input: routes is undefined, not an array, or empty.');
  }

  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: '',
    },
  };

  // Sort routes by duration or time
  routes.sort((a, b) => {
    if (mode == 'driving-traffic') {
      return a.duration - b.duration;
    } else {
      return a.time - b.time;
    }
  });
  console.log('Routes are sorted by duration or time, they are: ', routes);

  const dist = routes[0].distance / 1000; // distance in km
  const time = mode == 'driving-traffic' ? routes[0].duration / 3600 : routes[0].time / 3600; // time in seconds

  //   Calculate the energy consumed by the vehicle here...

  geojson.geometry.coordinates = routes[0].geometry.coordinates;

  if (mode === 'driving-traffic') {
    // how to find the total energy consumed by the vehicle here...
    mode = 'car';
    const source = routes[0].waypoints[0];
    const destination = routes[0].waypoints[1];
    // console.log(source.location[1], destination.location[0], 'inside the get Fast route energy');

    const query = new URLSearchParams({
      key: process.env.NEW_GRAPHHOPPER_KEY,
    }).toString();

    const res = await fetch(
      `https://graphhopper.com/api/1/route?point=${source.location[1]},${source.location[0]}&point=${destination.location[1]},${destination.location[0]}&vehicle=${mode}&debug=true&key=a5d0c631-d709-4015-b6cc-201c51f959aa&type=json&points_encoded=false&algorithm=alternative_route&alternative_route.max_paths=5&alternative_route.max_weight_factor=1.4&alternative_route.max_share_factor=0.6&details=max_speed&elevation=true`,
      { method: 'GET' }
    );

    const json = await res.json();
    const temp_routes = routes; // graphhopper routes between the same points

    if (!temp_routes || temp_routes.length === 0) {
      throw new Error('No routes returned from Graphhopper.');
    }

    temp_routes.sort((a, b) => a.time - b.time);
    routes[0].totalEnergy = calculateRouteEnergy(temp_routes[0], mode);
    routes[0] = await calculateRouteExposureMapbox(routes[0]);
    geojson.geometry.coordinates = routes[0].geometry.coordinates;
  } else {
    routes[0].totalEnergy = calculateRouteEnergy(routes[0], mode);
    routes[0] = await calculateRouteExposureGraphhopper(routes[0]);
    geojson.geometry.coordinates = routes[0].points.coordinates;
  }

  return { geojson, routes };
}
