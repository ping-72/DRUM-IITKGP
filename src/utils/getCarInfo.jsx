import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GetCarInformation = ({ onPredict }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleModel: '2015',
    fuelType: 'Petrol',
    vehicleType: '',
    distanceDriven: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emissionData = {
      ...formData,
      distanceDriven: parseInt(formData.distanceDriven, 10),
    };
    onPredict?.(emissionData);
  };

  // Calculate progress values based on form completion
  const getProgressValue = () => {
    const filled = Object.values(formData).filter(Boolean).length;
    return (filled / Object.keys(formData).length) * 100;
  };

  const progressValue = getProgressValue();

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-[512px] py-5">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">Car Journey Analysis</h1>
        </div>

        {/* Vehicle Model (Year) */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
              type="number"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleInputChange}
              required
              placeholder="Vehicle Model (Year)"
            />
          </label>
        </div>

        {/* Fuel Type */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="EV">EV</option>
            </select>
          </label>
        </div>

        {/* Vehicle Type */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              required
              placeholder="e.g., Sedan, SUV"
            />
          </label>
        </div>

        {/* Total Distance Driven (KM) */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
              type="number"
              name="distanceDriven"
              value={formData.distanceDriven}
              onChange={handleInputChange}
              required
              placeholder="Total Distance Driven (KM)"
            />
          </label>
        </div>

        {/* Progress Indicators */}
        <h3 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Important Features</h3>

        {['Time Required for Completion', 'Total Distance', 'Total Cost (Fuel Consumption)', 'AQI Exposure Level'].map((label) => (
          <div key={label} className="@container">
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
              <div className="flex w-full shrink-[3] items-center justify-between">
                <p className="text-[#0e141b] text-base font-medium leading-normal">{label}</p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:hidden">{progressValue.toFixed(0)}%</p>
              </div>
              <div className="flex h-4 w-full items-center gap-4">
                <div className="flex h-1 flex-1 rounded-sm bg-[#d0dbe6]">
                  <div className="h-full rounded-sm bg-[#1972d2]" style={{ width: `${progressValue}%` }} />
                  <div className="relative">
                    <div className="absolute -top-1.5 size-4 rounded-full bg-[#1972d2]" style={{ left: `${progressValue}%` }} />
                  </div>
                </div>
                <p className="text-[#0e141b] text-sm font-normal leading-normal hidden @[480px]:block">{progressValue.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        ))}

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
