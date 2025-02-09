import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarData from '../carMileageData/mileageData.json';
import { calculateFuelConsumption } from '../../../utils/flattencarData';
import { CarProvider, useCar } from '../contexts/Carcontext';

const carCompanies = Object.keys(CarData);
const initialCompany = carCompanies[0];
const initialModels = CarData[initialCompany];
const initialModel = initialModels[0].model;

const GetCarInformation = ({ onPredict }) => {
  // Access carData and updateCarData from the CarProvider
  const { carData, updateCarData } = useCar();
  carData.company = carData.company || initialCompany;
  carData.model = carData.model || initialModel;
  carData.productionYear = carData.productionYear || '2020';
  carData.fuelType = carData.fuelType || 'Petrol';
  carData.distanceDriven = carData.distanceDriven || '1000';
  carData.averageSpeed = carData.averageSpeed || '50';
  carData.mileage = carData.mileage || '24.3 km/l';

  const handleCarDataChange = (e) => {
    const { name, value } = e.target;
    updateCarData({ [name]: value });
  };
  const navigate = useNavigate();

  const parseMileage = (mileageStr) => {
    if (!mileageStr) return 0;
    const cleaned = mileageStr.toLowerCase().replace('km/l', '').trim();
    if (cleaned.includes('-')) {
      const parts = cleaned.split('-').map((p) => parseFloat(p));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] + parts[1]) / 2;
      }
    }
    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : value;
  };

  let modelsForCompany = CarData[carData.company] || [];
  useEffect(() => {
    modelsForCompany = CarData[carData.company] || [];
  }, [carData]);

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <form
        onSubmit={() => {
          e.preventDefault();
          navigate('/routes');
        }}
        className="flex flex-col w-full max-w-[512px] py-5">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">Car Journey Analysis</h1>
        </div>

        {/* Car Company Dropdown */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
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
            <input
              type="number"
              name="distanceDriven"
              value={carData.distanceDriven}
              onChange={handleCarDataChange}
              required
              placeholder="Total Distance Driven (KM)"
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base"
            />
          </label>
        </div>

        {/* Average Speed Input */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="number"
              name="averageSpeed"
              value={carData.averageSpeed}
              onChange={handleCarDataChange}
              required
              placeholder="Average Speed (km/h)"
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base"
            />
          </label>
        </div>

        {/* Submit and Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            Go to Routes
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetCarInformation;
