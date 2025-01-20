import React, { useState } from 'react';

const GetCarInformation = () => {
  const [vehicleModel, setVehicleModel] = useState('2015');
  const [fuelType, setFuelType] = useState('Petrol');
  const [vehicleType, setVehicleType] = useState('');
  const [distanceDriven, setDistanceDriven] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emissionData = {
      vehicleModel,
      fuelType,
      vehicleType,
      distanceDriven: parseInt(distanceDriven, 10),
    };
    onPredict(emissionData); // Calls the function to predict emissions
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <>
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight min-w-72">Car Journey Analysis</p>
          </div>

          {/* Vehicle Model (Year) */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 bg-[image:--select-button-svg] placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
                type="number"
                // value={vechileModel}
                // onChange={(e) => setVehicleModel(e.target.value)}
                required
                placeholder="Vechile Model (Year)"
              />
            </label>
          </div>

          {/* Fuel Type */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <select
                // onChange={(e) => setFuelType(e.target.value)}
                // value={fuelType}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 bg-[image:--select-button-svg] placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
                placeholder="Fuel Type">
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
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 bg-[image:--select-button-svg] placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
                type="text"
                // value={vehicleType}
                // onChange={(e) => setVehicleType(e.target.value)}
                required
                placeholder="e.g., Sedan, SUV"
              />
            </label>
          </div>

          {/* Total Distance Driven (KM) */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="Total Distance Driven (KM)"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-14 placeholder:text-[#4f7296] p-[15px] text-base font-normal leading-normal"
                type="number"
                // value={distanceDriven}
                // onChange={(e) => setDistanceDriven(e.target.value)}
                required
                // placeholder="e.g., 15000"
              />
            </label>
          </div>

          {/* Important Features Section */}
          <h3 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Important Features</h3>

          {/* Time Required for Completion */}
          <div className="@container">
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
              <div className="flex w-full shrink-[3] items-center justify-between">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Time Required for Completion</p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:hidden">0</p>
              </div>
              <div className="flex h-4 w-full items-center gap-4">
                <div className="flex h-1 flex-1 rounded-sm bg-[#d0dbe6]">
                  <div className="h-full w-[32%] rounded-sm bg-[#1972d2]"></div>
                  <div className="relative">
                    <div className="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#1972d2]"></div>
                  </div>
                </div>
                <p className="text-[#0e141b] text-sm font-normal leading-normal hidden @[480px]:block">0</p>
              </div>
            </div>
          </div>

          {/* Total Distance */}
          <div className="@container">
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
              <div className="flex w-full shrink-[3] items-center justify-between">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Total Distance</p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:hidden">0</p>
              </div>
              <div className="flex h-4 w-full items-center gap-4">
                <div className="flex h-1 flex-1 rounded-sm bg-[#d0dbe6]">
                  <div className="h-full w-[32%] rounded-sm bg-[#1972d2]"></div>
                  <div className="relative">
                    <div className="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#1972d2]"></div>
                  </div>
                </div>
                <p className="text-[#0e141b] text-sm font-normal leading-normal hidden @[480px]:block">0</p>
              </div>
            </div>
          </div>
        </>

        {/* Total Cost (Fuel Consumption) */}
        <div className="@container">
          <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div className="flex w-full shrink-[3] items-center justify-between">
              <p className="text-[#0e141b] text-base font-medium leading-normal">Total Cost (Fuel Consumption)</p>
              <p className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:hidden">0</p>
            </div>
            <div className="flex h-4 w-full items-center gap-4">
              <div className="flex h-1 flex-1 rounded-sm bg-[#d0dbe6]">
                <div className="h-full w-[32%] rounded-sm bg-[#1972d2]"></div>
                <div className="relative">
                  <div className="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#1972d2]"></div>
                </div>
              </div>
              <p className="text-[#0e141b] text-sm font-normal leading-normal hidden @[480px]:block">0</p>
            </div>
          </div>
        </div>

        {/* AQI Exposure Level */}
        <div className="@container">
          <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div className="flex w-full shrink-[3] items-center justify-between">
              <p className="text-[#0e141b] text-base font-medium leading-normal">AQI Exposure Level</p>
              <p className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:hidden">0</p>
            </div>
            <div className="flex h-4 w-full items-center gap-4">
              <div className="flex h-1 flex-1 rounded-sm bg-[#d0dbe6]">
                <div className="h-full w-[32%] rounded-sm bg-[#1972d2]"></div>
                <div className="relative">
                  <div className="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#1972d2]"></div>
                </div>
              </div>
              <p className="text-[#0e141b] text-sm font-normal leading-normal hidden @[480px]:block">0</p>
            </div>
          </div>
        </div>

        {/* Final Button */}
        <div className="flex justify-center">
          <button className="py-2 px-4 bg-blue-500 text-white rounded-xl">Go to Routes</button>
        </div>
      </div>
    </div>
  );
};

export default GetCarInformation;
