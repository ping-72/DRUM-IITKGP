import calculateRouteExposureMapbox from '../utils/calculateRouteExposureMapbox.js'
import calculateRouteExposureGraphhopper from '../utils/calculateRouteExposureGraphhopper.js'
import calculateRouteEnergy from '../utils/calculateRouteEnergy.js'

export default async function getFastestRoute(routes, mode) {
    if (!routes || !Array.isArray(routes) || routes.length === 0) {
        throw new Error(
            'Invalid routes input: routes is undefined, not an array, or empty.'
        )
    } else {
        console.log('routes are valid and calculating getFastestRoute' + routes)
    }

    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: '',
        },
    }

    // Sort routes by duration or time
    routes.sort((a, b) => {
        if (mode == 'driving-traffic') {
            return a.duration - b.duration
        } else {
            return a.time - a.time
        }
    })

    if (mode === 'driving-traffic') {
        // how to find the total energy consumed by the vehicle here...
        mode = 'car'
        const source = routes[0].waypoints[0]
        const destination = routes[0].waypoints[1]
        console.log(
            source.location[1],
            destination.location[0],
            'inside the get Fast route energy'
        )

        const query = new URLSearchParams({
            key: process.env.NEW_GRAPHHOPPER_KEY,
        }).toString()

        const res = await fetch(
            `https://graphhopper.com/api/1/route?point=${source.location[1]},${source.location[0]}&point=${destination.location[1]},${destination.location[0]}&vehicle=${mode}&debug=true&key=a5d0c631-d709-4015-b6cc-201c51f959aa&type=json&points_encoded=false&algorithm=alternative_route&alternative_route.max_paths=5&alternative_route.max_weight_factor=1.4&alternative_route.max_share_factor=0.6&details=max_speed&elevation=true`,
            { method: 'GET' }
        )
        console.log('Graphhopper API is ' + query)

        console.log(
            'query fetched the routes between those locations ' +
                source.location[1] +
                ' ' +
                source.location[0] +
                ' ' +
                destination.location[1] +
                ' ' +
                destination.location[0]
        )

        const json = await res.json()
        const temp_routes = json.paths // graphhopper routes between the same points

        if (!temp_routes || temp_routes.length === 0) {
            throw new Error('No routes returned from Graphhopper.')
        }

        temp_routes.sort((a, b) => a.time - b.time)
        routes[0].totalEnergy = calculateRouteEnergy(temp_routes[0], mode)
        routes[0] = await calculateRouteExposureMapbox(routes[0])
        geojson.geometry.coordinates = routes[0].geometry.coordinates
    } else {
        routes[0].totalEnergy = calculateRouteEnergy(routes[0], mode)
        routes[0] = await calculateRouteExposureGraphhopper(routes[0])
        geojson.geometry.coordinates = routes[0].points.coordinates
    }

    return { geojson, routes }
}
