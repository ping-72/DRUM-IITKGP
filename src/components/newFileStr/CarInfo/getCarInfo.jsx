import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Draggable } from 'react-drag-reorder';
import CarData from '../carMileageData/mileageData.json';
import { CarProvider, useCar } from '../contexts/Carcontext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const carCompanies = Object.keys(CarData);
const initialCompany = carCompanies[0];
const initialModels = CarData[initialCompany];
const initialModel = initialModels[0].model;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const GetCarInformation = () => {
  const { carData, updateCarData } = useCar();
  carData.company = carData.company || initialCompany;
  carData.model = carData.model || initialModel;
  carData.productionYear = carData.productionYear || '2020';
  carData.fuelType = carData.fuelType || 'Petrol';
  carData.distanceDriven = carData.distanceDriven || '1000';

  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(['Shortest', 'Faster', 'Least Exposure', 'Least Emission']);

  const handleCarDataChange = (e) => {
    const { name, value } = e.target;
    updateCarData({ [name]: value });
  };

  const handlePosChange = (currentPos, newPos) => {
    const newOrder = reorder(preferences, currentPos, newPos);
    setPreferences(newOrder);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg bg-white shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Car Journey Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Car Company</label>
              <Select name="company" value={carData.company} onValueChange={(value) => updateCarData({ company: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Car Company" />
                </SelectTrigger>
                <SelectContent>
                  {carCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Car Model</label>
              <Select name="model" value={carData.model} onValueChange={(value) => updateCarData({ model: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Car Model" />
                </SelectTrigger>
                <SelectContent>
                  {(CarData[carData.company] || []).map((modelData) => (
                    <SelectItem key={modelData.model} value={modelData.model}>
                      {modelData.model} ({modelData.carType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Production Year</label>
              <Input type="number" name="productionYear" value={carData.productionYear} onChange={handleCarDataChange} />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Fuel Type</label>
              <Select name="fuelType" value={carData.fuelType} onValueChange={(value) => updateCarData({ fuelType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="EV">EV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Total Distance Driven (KM)</label>
              <Input type="number" name="distanceDriven" value={carData.distanceDriven} onChange={handleCarDataChange} />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800">Route Preferences</h2>
              <Draggable onPosChange={handlePosChange}>
                {preferences.map((preference, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-200 p-3 rounded-lg shadow-sm cursor-move">
                    <span>{preference}</span>
                  </div>
                ))}
              </Draggable>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={() => navigate('/routes')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
                Go to Routes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetCarInformation;
