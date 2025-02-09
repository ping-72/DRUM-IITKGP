import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarData from '../carMileageData/mileageData.json';
import { calculateFuelConsumption } from '../../../utils/flattencarData';

// Extract initial company and model from the JSON
const carCompanies = Object.keys(CarData);
const initialCompany = carCompanies[0];
const initialModels = CarData[initialCompany];
const initialModel = initialModels[0].model;

const GetCarInformation = ({ onPredict }) => {
  const navigate = useNavigate();

  // Initialize form state using the defined variables.
  const [formData, setFormData] = useState({
    carCompany: initialCompany,
    carModel: initialModel,
    productionYear: '2020',
    fuelType: 'Petrol',
    distanceDriven: '',
    averageSpeed: '50',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // When the car company changes, update the car model to the first model for that company.
    if (name === 'carCompany') {
      const newModels = CarData[value];
      setFormData((prev) => ({ ...prev, [name]: value, carModel: newModels[0].model }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Utility function: Parse mileage string (e.g., "24.3 km/l" or "10-12 km/l")
  const parseMileage = (mileageStr) => {
    if (!mileageStr) return 0;
    // Use toLowerCase (with a capital "C")
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the selected car's data in the JSON.
    const selectedCompanyData = CarData[formData.carCompany];
    const carInfo = selectedCompanyData.find((car) => car.model === formData.carModel);
    if (!carInfo) {
      alert('Invalid Car Model');
      return;
    }

    // Extract the baseline mileage from the car info.
    const baselineMileage = parseMileage(carInfo.averageMileage);

    // Parse numeric inputs
    const productionYear = parseInt(formData.productionYear, 10);
    const distanceDriven = parseInt(formData.distanceDriven, 10);
    const averageSpeed = parseInt(formData.averageSpeed, 10);

    // Calculate fuel consumption using the imported function.
    const { effectiveMileage, fuelConsumption, message } = calculateFuelConsumption({
      baselineMileage,
      productionYear,
      fuelType: formData.fuelType,
      distanceDriven,
      averageSpeed,
    });

    // Pass the results to the parent (if provided)
    onPredict?.({
      ...formData,
      carInfo,
      baselineMileage,
      effectiveMileage,
      fuelConsumption,
      ...(message ? { message } : {}),
    });
  };

  // Compute a simple form progress value.
  const getProgressiveValue = () => {
    const filled = Object.values(formData).filter(Boolean).length;
    return (filled / Object.keys(formData).length) * 100;
  };

  // Use a consistent variable name for progress value.
  const progressValue = getProgressiveValue();

  // Get the list of models for the selected car company.
  const modelsForCompany = CarData[formData.carCompany] || [];

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-[512px] py-5">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">Car Journey Analysis</h1>
        </div>

        {/* Car Company Dropdown */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <select
              name="carCompany"
              value={formData.carCompany}
              onChange={handleInputChange}
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
              name="carModel"
              value={formData.carModel}
              onChange={handleInputChange}
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
              value={formData.productionYear}
              onChange={handleInputChange}
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
              value={formData.fuelType}
              onChange={handleInputChange}
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
              value={formData.distanceDriven}
              onChange={handleInputChange}
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
              value={formData.averageSpeed}
              onChange={handleInputChange}
              required
              placeholder="Average Speed (km/h)"
              className="form-input flex w-full rounded-xl border border-[#d0dbe6] bg-[#f8fafb] p-[15px] text-base"
            />
          </label>
        </div>

        {/* Progress Indicator (Optional) */}
        <div className="px-4 py-3">
          <p className="text-[#0e141b] text-sm">Form Completion: {progressValue.toFixed(0)}%</p>
        </div>

        {/* Submit and Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            Calculate Emissions
          </button>
          <button
            type="button"
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
