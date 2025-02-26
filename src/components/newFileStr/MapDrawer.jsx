import { useState, useEffect } from 'react';
import useInput from '../useInput.js';
import Instruction from '../Instruction.js';
import { CarProvider, useCar } from './contexts/Carcontext.js';
import GetCarInformation from './CarInfo/getCarInfo.jsx';
import { setupMap, addMarkerToMap } from './utils/mapUtils.js';
import prettyMilliseconds from 'pretty-ms';
import prettyMetric from 'pretty-metric';

// import Instruction from './Instruction.js';

import { getAllRoutes, getRoutes } from './controllers/routeHandlers.js';

export default function MapDrawer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showColorInfo, setShowColorInfo] = useState(true);

  // Form state using your custom hook
  const source = useInput('');
  const destination = useInput('');
  const [mode, setMode] = useState('car');
  const [routePreference, setRoutePreference] = useState('shortest');
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [instructions, setInstructions] = useState([]);

  const carData = useCar();

  // Route details state (for displaying route details later)
  const [shortestRoute, setShortestRoute] = useState({});
  const [fastestRoute, setFastestRoute] = useState({});
  const [leapRoute, setLeapRoute] = useState({});
  const [balancedRoute, setBalancedRoute] = useState({});
  const [leastCarbonRoute, setLeastCarbonRoute] = useState({});
  const [departureTime, setDepartureTime] = useState('');
  const [openDepartTime, setOpenDepartTime] = useState(false);

  // On mount, set up the map at a default position
  let position = [0, 0];
  useEffect(() => {
    if (!process.env.REACT_APP_MAPBOX_API_KEY) {
      console.error('Mapbox API Key is not set. Please set it in .env file.');
      return;
    }
    setupMap({ position, placeName: 'Default Location', mode, routePreference });
  }, [mode, routePreference]);

  return (
    <div className="drawer overflow-y-auto">
      {/* Toggle for the drawer */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" onClick={() => setIsExpanded(!isExpanded)} />

      <div className="drawer-content">
        {/* label for the drawer */}
        <label htmlFor="my-drawer" className="btn drawer-button btn-secondary btn-sm right-12 top-2 absolute z-40">
          {isExpanded ? 'Close' : 'Open'}
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          )}
        </label>

        <div>
          <div className="w-screen absolute -z-30 mr-5">
            <div id="map-container" className="h-screen w-full"></div>
          </div>
        </div>
      </div>

      {/* Drawer side panel */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 bg-white shadow-lg w-10/12 md:w-1/3 lg:w-1/4 rounded-md ml-4 m-2">
          <h1 className="text-lg font-semibold title-font text-center border-b-2 pb-2 mx-auto mb-4 text-gray-800">DRUM - IIT KGP</h1>
          <form>
            <div className="flex flex-col space-y-4 items-center">
              {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              {/* Source Input */}
              <>
                <input
                  type="text"
                  placeholder="Delhi"
                  className="input input-sm input-bordered bg-gray-100 text-gray-800 w-full max-w-xs"
                  required
                  {...source}
                  value={source.value}
                />
                <div>
                  {source.suggestions?.length > 0 && (
                    <div
                      name="suggestion-wrapper"
                      className="bg-white text-gray-800 absolute right-0 w-11/12 border border-gray-300 rounded-md shadow-lg z-50">
                      {source.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="hover:bg-gray-200 cursor-pointer max-w-sm border-b border-gray-200 p-2"
                          onClick={() => {
                            source.setValue(suggestion.text);
                            source.setPosition(suggestion.center);
                            source.setSuggestions([]);
                            setupMap({
                              position: suggestion.center,
                              placeName: suggestion.text,
                              locationType: 'source',
                              mode,
                              routePreference,
                            });
                          }}>
                          {suggestion.place_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
              TO
              {/* Destination Input */}
              <>
                <input
                  type="text"
                  placeholder="Sangam Vihar"
                  className="input input-sm input-bordered bg-gray-100 text-gray-800 w-full max-w-xs"
                  required
                  {...destination}
                  value={destination.value}
                />
                <div>
                  {destination.suggestions?.length > 0 && (
                    <div
                      name="suggestion-wrapper"
                      className="bg-white text-gray-800 absolute right-0 w-11/12 border border-gray-300 rounded-md shadow-lg z-50">
                      {destination.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="hover:bg-gray-200 cursor-pointer max-w-sm border-b border-gray-200 p-2"
                          onClick={() => {
                            destination.setValue(suggestion.text);
                            destination.setPosition(suggestion.center);
                            destination.setSuggestions([]);
                            setupMap({
                              position: suggestion.center,
                              placeName: suggestion.text,
                              locationType: 'destination',
                              mode,
                              routePreference,
                            });
                            addMarkerToMap({
                              position: source.position,
                              placeName: source.value,
                              locationType: 'source',
                              mode,
                              routePreference,
                            });
                          }}>
                          {suggestion.place_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
              {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              {/* Mode Select */}
              <select
                className="select select-sm select-bordered bg-gray-100 text-gray-800 w-full max-w-xs"
                required
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                }}>
                <option disabled value="none">
                  -- Select Mode of Transport --
                </option>
                <option value="driving-traffic">Car</option>
                {/* <option value="scooter">Motorbike</option>
                <option value="bike">Cycling</option>
                <option value="foot">Walking</option> */}
              </select>
              {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              {/* Important features (and possibly car info) */}
              {/* Import Car Info */}
              {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              <div className="flex flex-row justify-evenly items-center w-full max-w-xs">
                <select
                  className="select select-sm select-bordered bg-gray-100 text-gray-800 w-full"
                  required
                  value={routePreference}
                  onChange={(e) => {
                    setRoutePreference(e.target.value);
                  }}>
                  <option disabled value="none">
                    -- Select Route Preference --
                  </option>
                  <option value="shortest">Shortest (Distance)</option>
                  <option value="fastest">Fastest (Time)</option>
                  <option value="leap">LEAP (exposure)</option>
                  <option value="emission">LCO2 (emission)</option>
                  <option value="balanced">Optimal (recommended)</option>
                  <option value="all">All</option>
                </select>
                <div className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700 cursor-pointer"
                    onClick={() => setShowColorInfo(!showColorInfo)}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </div>
              </div>
              <div className={showColorInfo ? 'block w-full max-w-xs' : 'hidden'}>
                <div className="flex flex-row space-x-4 items-center">
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-5 h-5 bg-shortest rounded-full"></div>
                    <div className="text-xs text-gray-700">Shortest</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-5 h-5 bg-fastest rounded-full"></div>
                    <div className="text-xs text-gray-700">Fastest</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-5 h-5 bg-leap rounded-full"></div>
                    <div className="text-xs text-gray-700">LEAP</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-5 h-5 bg-emission rounded-full"></div>
                    <div className="text-xs text-gray-700">EMISSION</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-5 h-5 bg-balanced rounded-full"></div>
                    <div className="text-xs text-gray-700">Optimal</div>
                  </div>
                </div>
              </div>
              {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
              <br />
              <>
                <div className="flex flex-col justify-evenly items-center w-full max-w-xs border rounded-md p-1 border-gray-300">
                  <div onClick={() => setOpenDepartTime(!openDepartTime)} className="cursor-pointer">
                    {!openDepartTime ? 'Advanced Settings >' : 'Advanced Settings <'}
                    <br />
                  </div>
                  {openDepartTime && (
                    <div className="flex flex-col justify-evenly items-center w-full max-w-xs mt-4">
                      <label className="text-gray-700 text-sm">When will you be leaving?</label>
                      <select
                        className="select select-sm select-bordered bg-gray-100 text-gray-800 w-full m-1"
                        value={departureTime}
                        onChange={(e) => {
                          setDepartureTime(e.target.value);
                        }}>
                        <option value="0">Now</option>
                        <option value="1">+1 hour</option>
                        <option value="2">+2 hours</option>
                        <option value="3">+3 hours</option>
                        <option value="4">+4 hours</option>
                        <option value="5">+5 hours</option>
                        <option value="6">+6 hours</option>
                      </select>
                    </div>
                  )}
                </div>
              </>
              <button
                className="btn btn-wide bg-blue-600 text-white hover:bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  if (routePreference === 'all') {
                    getAllRoutes({
                      source,
                      destination,
                      mode,
                      routePreference,
                      setFastestRoute,
                      setShortestRoute,
                      setLeapRoute,
                      setBalancedRoute,
                      setLeastCarbonRoute,
                      setIsLoading,
                    });
                  } else {
                    getRoutes({
                      source,
                      destination,
                      mode,
                      routePreference,
                      setDistance,
                      setTime,
                      setInstructions,
                      setExposure,
                      setFastestRoute,
                      setShortestRoute,
                      setLeapRoute,
                      setBalancedRoute,
                      setLeastCarbonRoute,
                      setIsLoading,
                      carData,
                    });
                  }
                  setupMap({
                    position: destination.position,
                    placeName: destination.value,
                    locationType: 'destination',
                    mode,
                    routePreference,
                  });
                  addMarkerToMap({
                    position: source.position,
                    placeName: source.value,
                    locationType: 'source',
                    mode,
                    routePreference,
                  });
                  setIsLoading(true);
                }}>
                Find
              </button>
            </div>
          </form>
          <div>
            {routePreference !== 'all' && (
              <div className="text-center text-xl mt-4">
                Distance -{' '}
                <span className="text-blue-500">{isLoading ? prettyMetric(0).humanize() : prettyMetric(distance).humanize()}</span>
                <span className="text-gray-500 mx-2">|</span>
                <br />
                Time -{' '}
                <span className="text-green-400">
                  {isLoading
                    ? prettyMilliseconds(0)
                    : mode.includes('traffic')
                    ? prettyMilliseconds(time * 1000)
                    : prettyMilliseconds(time)}{' '}
                </span>
                <span className="text-gray-500 mx-2">|</span>
                <br />
                Exposure - <span className="text-red-500">{isLoading ? 0 : exposure?.toFixed(2)} μg/㎥ h</span>
              </div>
            )}
            {routePreference !== 'all' && (
              <div className="collapse mt-2">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium text-center underline text-gray-800">Instructions</div>
                <div className="collapse-content bg-gray-50 p-4 rounded-md">
                  {instructions.length > 0 && !isLoading ? (
                    <div className="overflow-auto h-40">
                      <ol className="list-decimal list-inside space-y-2">
                        {instructions.map((instruction, index) => (
                          <li key={index}>
                            <Instruction index={index} instruction={instruction} mode={mode} />
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : isLoading ? (
                    <div className="flex flex-col items-center">
                      <span className="text-sm mb-2 text-gray-700">Fetching Data...</span>
                      <progress className="progress w-11/12 progress-info"></progress>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-center items-center">
                      <span className="text-gray-700">Wow Such Empty!!</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 ml-2 text-gray-700">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="collapse mt-2">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium text-center underline text-gray-800">Route Details</div>
              <div className="collapse-content bg-gray-50 p-4 rounded-md">
                {routePreference === 'all' ? (
                  <div className="overflow-auto h-72 space-y-4">
                    {/* Details for each route type */}
                    <div>
                      <div className="font-bold underline text-gray-800">Shortest Route</div>
                      <ul className="ml-4 list-disc text-gray-700">
                        <li>Distance: {prettyMetric(shortestRoute.distance).humanize()}</li>
                        <li>Time Taken: {shortestRoute.time && prettyMilliseconds(shortestRoute.time)}</li>
                        <li>Total Exposure: {shortestRoute.totalExposure?.toFixed(2)} µg/㎥</li>
                        <li>Energy Required: {shortestRoute.totalEnergy?.toFixed(2)} kJ</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold underline text-gray-800">Fastest Route</div>
                      <ul className="ml-4 list-disc text-gray-700">
                        <li>Distance: {prettyMetric(fastestRoute.distance).humanize()}</li>
                        <li>
                          Time Taken:{' '}
                          {(fastestRoute.duration || fastestRoute.time) &&
                            prettyMilliseconds(fastestRoute.duration * 1000 || fastestRoute.time)}
                        </li>
                        <li>Total Exposure: {fastestRoute.totalExposure?.toFixed(2)} µg/㎥</li>
                        <li>Energy Required: {fastestRoute.totalEnergy?.toFixed(2)} kJ</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold underline text-gray-800">LEAP Route</div>
                      <ul className="ml-4 list-disc text-gray-700">
                        <li>Distance: {prettyMetric(leapRoute.distance).humanize()}</li>
                        <li>Time Taken: {leapRoute.time && prettyMilliseconds(leapRoute.time)}</li>
                        <li>Total Exposure: {leapRoute.totalExposure?.toFixed(2)} µg/㎥</li>
                        <li>Energy Required: {leapRoute.totalEnergy?.toFixed(2)} kJ</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold underline text-gray-800">LCO2 Route</div>
                      <ul className="ml-4 list-disc text-gray-700">
                        <li>Distance: {prettyMetric(leastCarbonRoute.distance).humanize()}</li>
                        <li>Time Taken: {leastCarbonRoute.time && prettyMilliseconds(leastCarbonRoute.time)}</li>
                        <li>Total Exposure: {leastCarbonRoute.totalExposure?.toFixed(2)} µg/㎥</li>
                        <li>Energy Required: {leastCarbonRoute.totalEnergy?.toFixed(2)} kJ</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold underline text-gray-800">Optimal Route</div>
                      <ul className="ml-4 list-disc text-gray-700">
                        <li>Distance: {prettyMetric(balancedRoute.distance).humanize()}</li>
                        <li>
                          Time Taken:{' '}
                          {(balancedRoute.time || balancedRoute.duration) &&
                            prettyMilliseconds(balancedRoute.time || balancedRoute.duration * 1000)}
                        </li>
                        <li>Total Exposure: {balancedRoute.totalExposure?.toFixed(2)} µg/㎥</li>
                        <li>Energy Required: {balancedRoute.totalEnergy?.toFixed(2)} kJ</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Vehicle Profile: {mode}</li>
                    <li>Route Preference: {routePreference}</li>
                    {routePreference === 'shortest' && <li>Distance: {prettyMetric(shortestRoute.distance).humanize()}</li>}
                    {routePreference === 'fastest' && <li>Distance: {prettyMetric(fastestRoute.distance).humanize()}</li>}
                    {routePreference === 'leap' && <li>Distance: {prettyMetric(leapRoute.distance).humanize()}</li>}
                    {routePreference === 'emission' && <li>Distance: {prettyMetric(leastCarbonRoute.distance).humanize()}</li>}
                    {routePreference === 'balanced' && <li>Distance: {prettyMetric(balancedRoute.distance).humanize()}</li>}
                    {!['shortest', 'fastest', 'leap', 'emission', 'balanced'].includes(routePreference) && (
                      <li>Distance: No Route Selected</li>
                    )}
                    {routePreference === 'shortest' && <li>Time Taken: {shortestRoute.time && prettyMilliseconds(shortestRoute.time)}</li>}
                    {routePreference === 'fastest' && (
                      <li>Time Taken: {fastestRoute.duration && prettyMilliseconds(fastestRoute.duration * 1000)}</li>
                    )}
                    {routePreference === 'leap' && <li>Time Taken: {leapRoute.time && prettyMilliseconds(leapRoute.time)}</li>}
                    {routePreference === 'emission' && (
                      <li>Time Taken: {leastCarbonRoute.time && prettyMilliseconds(leastCarbonRoute.time)}</li>
                    )}
                    {routePreference === 'balanced' && (
                      <li>
                        Time Taken:{' '}
                        {(balancedRoute.time || balancedRoute.duration) &&
                          prettyMilliseconds(balancedRoute.time || balancedRoute.duration * 1000)}
                      </li>
                    )}
                    {!['shortest', 'fastest', 'leap', 'emission', 'balanced'].includes(routePreference) && (
                      <li>Time Taken: No Route Selected</li>
                    )}
                    {routePreference === 'leap' && <li>Exposure: {leapRoute.totalExposure?.toFixed(2)} µg/㎥</li>}
                    {routePreference === 'balanced' && <li>Exposure: {balancedRoute.totalExposure?.toFixed(2)} µg/㎥</li>}
                    {routePreference === 'shortest' && <li>Exposure: {shortestRoute.totalExposure?.toFixed(2)} µg/㎥</li>}
                    {routePreference === 'fastest' && <li>Exposure: {fastestRoute.totalExposure?.toFixed(2)} µg/㎥</li>}
                    {routePreference === 'emission' && <li>Exposure: {leastCarbonRoute.totalExposure?.toFixed(2)} µg/㎥</li>}
                    {!['shortest', 'fastest', 'leap', 'emission', 'balanced'].includes(routePreference) && (
                      <li>Exposure: No Route Selected µg/㎥</li>
                    )}
                    {routePreference === 'leap' && <li>Energy Required: {leapRoute.totalEnergy?.toFixed(2)} kJ</li>}
                    {routePreference === 'balanced' && <li>Energy Required: {balancedRoute.totalEnergy?.toFixed(2)} kJ</li>}
                    {routePreference === 'shortest' && <li>Energy Required: {shortestRoute.totalEnergy?.toFixed(2)} kJ</li>}
                    {routePreference === 'fastest' && <li>Energy Required: {fastestRoute.totalEnergy?.toFixed(2)} kJ</li>}
                    {routePreference === 'emission' && <li>Energy Required: {leastCarbonRoute.totalEnergy?.toFixed(2)} kJ</li>}
                    {!['shortest', 'fastest', 'leap', 'emission', 'balanced'].includes(routePreference) && (
                      <li>Energy Required: No Route Selected</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
