import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import getIconFromMode from '../../../utils/getIconFromMode.js';
import getRouteColor from '../../../utils/getRouteColor.js';

export function setupMap({ position, placeName, locationType = 'default', mode, routePreference }) {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
  // Create the map and fit the bounds (the bounds are set for India in this example)
  window.$map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/saditya9211/clbw1qkuo000u15o2afjcpknz',
    center: position,
    zoom: 9,
  }).fitBounds(
    [
      [67.77384991, 10.27430903], // southwest
      [98.44100523, 36.45878352], // northeast
    ],
    { padding: 10 }
  );

  // If a marker is needed immediately (source/destination)
  if (locationType === 'source' || locationType === 'destination') {
    addMarkerToMap({ position, placeName, locationType, mode, routePreference });
  }

  // Add map controls
  window.$map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
  window.$map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    })
  );
  const scale = new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' });
  window.$map.addControl(scale, 'bottom-left');
}

export function addMarkerToMap({ position, placeName, locationType = 'default', mode, routePreference }) {
  // Check if the marker layer already exists
  if (window.$map.getLayer(`${position[0]}-${position[1]}-${locationType}-marker`)) {
    console.log('Removing the layer as it exists..');
    // Optionally remove the layer here if desired.
  }

  // When the style is loaded, add the marker layer with a custom icon
  window.$map.on('style.load', function () {
    const icon = getIconFromMode({ mode, locationType });
    icon.onload = function () {
      try {
        window.$map.addImage(`${mode}-${routePreference}-${position[0]}-${position[1]}`, icon);
      } catch (e) {
        console.error(e);
      }
      window.$map.addLayer({
        id: `${position[0]}-${position[1]}-${locationType}-marker`,
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: position },
            properties: { title: `${placeName}` },
          },
        },
        layout: {
          'icon-image': `${mode}-${routePreference}-${position[0]}-${position[1]}`,
          'icon-size': 0.12,
        },
      });
    };
  });

  // Immediately create a popup that is open by default
  new mapboxgl.Popup().setLngLat(position).setHTML(`<h3><strong>${placeName}</strong></h3>`).addTo(window.$map);

  // Also add a click event on the marker to open the popup
  window.$map.on('click', `${position[0]}-${position[1]}-${locationType}-marker`, function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const title = e.features[0].properties.title;
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(title).addTo(window.$map);
  });
}

export function displayRoute(geojson, start, end, routeId, tempRoutePreference) {
  // Add the route layer (line) to the map
  window.$map.addLayer({
    id: routeId,
    type: 'line',
    source: {
      type: 'geojson',
      data: geojson,
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': getRouteColor(tempRoutePreference),
      'line-width': 6,
      'line-opacity': 0.65,
    },
  });

  // Adjust the map bounds to show the route
  const minLng = Math.min(start.position[0], end.position[0]);
  const maxLng = Math.max(start.position[0], end.position[0]);
  const minLat = Math.min(start.position[1], end.position[1]);
  const maxLat = Math.max(start.position[1], end.position[1]);
  window.$map.fitBounds(
    [
      [minLng, minLat],
      [minLng, maxLat],
    ],
    { padding: 100 }
  );
}
