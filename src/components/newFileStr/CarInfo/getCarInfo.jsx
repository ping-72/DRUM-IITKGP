import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Draggable } from 'react-drag-reorder';
import CarData from '../carMileageData/mileageData.json';
import { CarProvider, useCar } from '../contexts/Carcontext';

const carCompanies = Object.keys(CarData);
const initialCompany = carCompanies[0];
const initialModels = CarData[initialCompany];
const initialModel = initialModels[0].model;

// Custom reorder helper
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const GetCarInformation = ({ onPredict }) => {
  // Access carData and updateCarData from the CarProvider
  const { carData, updateCarData } = useCar();

  // Set default values if not already present in the context
  carData.company = carData.company || initialCompany;
  carData.model = carData.model || initialModel;
  carData.productionYear = carData.productionYear || '2020';
  carData.fuelType = carData.fuelType || 'Petrol';
  carData.distanceDriven = carData.distanceDriven || '1000';
  carData.averageSpeed = carData.averageSpeed || '50';
  carData.mileage = carData.mileage || '24.3 km/l';

  const navigate = useNavigate();

  const handleCarDataChange = (e) => {
    const { name, value } = e.target;
    updateCarData({ [name]: value });
  };

  // Local state for route preferences
  const [preferences, setPreferences] = useState(['Shortest', 'Faster', 'Least Exposure', 'Least Emission']);

  // Update the preferences order when the drag position changes
  const handlePosChange = (currentPos, newPos) => {
    const newOrder = reorder(preferences, currentPos, newPos);
    setPreferences(newOrder);
  };

  // Get the models for the currently selected company.
  let modelsForCompany = CarData[carData.company] || [];
  useEffect(() => {
    modelsForCompany = CarData[carData.company] || [];
  }, [carData]);

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <form className="flex flex-col w-full max-w-[512px] py-5">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">Car Journey Analysis</h1>
        </div>

        {/* Car Company Dropdown */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <span className="text-sm font-semibold">Car Company</span>
            <select
              name="company"
              value={carData.company}
              onChange={handleCarDataChange}
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base">
              {carCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Car Model Dropdown */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <span className="text-sm font-semibold">Car Model</span>
            <select
              name="model"
              value={carData.model}
              onChange={handleCarDataChange}
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base">
              {modelsForCompany.map((modelData) => (
                <option key={modelData.model} value={modelData.model}>
                  {modelData.model} ({modelData.carType})
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Production Year Input */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <span className="text-sm font-semibold">Production Year</span>
            <input
              type="number"
              name="productionYear"
              value={carData.productionYear}
              onChange={handleCarDataChange}
              required
              placeholder="Production Year (e.g., 2020)"
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base"
            />
          </label>
        </div>

        {/* Fuel Type Dropdown */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <span className="text-sm font-semibold">Fuel Type</span>
            <select
              name="fuelType"
              value={carData.fuelType}
              onChange={handleCarDataChange}
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="EV">EV</option>
            </select>
          </label>
        </div>

        {/* Total Distance Driven Input */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <span className="text-sm font-semibold">Total Distance Driven (KM)</span>
            <input
              type="number"
              name="distanceDriven"
              value={carData.distanceDriven || ''}
              onChange={handleCarDataChange}
              required
              placeholder="Total Distance Driven (KM)"
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base"
            />
          </label>
        </div>

        {/* User-preference for custom routing (drag and reorder options) */}
        <div className="flex flex-col max-w-[480px] gap-4 px-4 py-3">
          <h2 className="text-xl font-bold">Route Preferences</h2>
          <Draggable onPosChange={handlePosChange}>
            {preferences.map((preference, index) => (
              <div key={index} className="flex items-center gap-2 border border-black rounded p-2">
                <span className="flex justify-between w-full">
                  <button disabled className="px-2 py-1 rounded-sm ">
                    <span role="img" aria-label="up">
                      ⬆️
                    </span>
                  </button>
                  <span className="flex-1 text-center">{preference}</span>
                  <button disabled className="text-black px-2 py-1 rounded-sm ">
                    <span> ⬇️ </span>
                  </button>
                </span>
              </div>
            ))}
          </Draggable>
        </div>

        {/* Submit and Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/routes')}>
            Go to Routes
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetCarInformation;
