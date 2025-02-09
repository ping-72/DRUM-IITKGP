// Fetching routes data from Mapbox and Graphhopper APIs

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

async function getMapboxRoutes(source, destination) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${source.position[0]},${source.position[1]};${destination.position[0]},${destination.position[1]}?steps=true&geometries=geojson&alternatives=true&waypoints_per_route=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const json = await query.json();
  let routes = json.routes;
  routes.forEach((route) => {
    route.time = route.duration * 1000;
  });
  return routes;
}

// Modify the getGraphopperRoutes to avoid key exposed in the code
async function getGraphhopperRoutes(temp_mode, source, destination) {
  const query = await fetch(
    `https://graphhopper.com/api/1/route?point=${source.position[1]},${source.position[0]}&point=${destination.position[1]},${destination.position[0]}&vehicle=${temp_mode}&debug=true&key=a5d0c631-d709-4015-b6cc-201c51f959aa&type=json&points_encoded=false&algorithm=alternative_route&alternative_route.max_paths=4&alternative_route.max_weight_factor=1.4&alternative_route.max_share_factor=0.6&elevation=true`,
    { method: 'GET' }
  );
  const json = await query.json();
  const routes = json.paths;
  return routes;
}

export { getMapboxRoutes, getGraphhopperRoutes };
