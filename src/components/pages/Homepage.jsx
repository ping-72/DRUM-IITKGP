import React from 'react';
import GetCarInformation from '../../utils/getCarInfo';

function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Optional: Add a logo icon here */}
            <h2 className="text-2xl font-bold text-blue-600">DRUM</h2>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 container mx-auto px-6">
        <GetCarInformation />
      </main>
    </div>
  );
}

export default Homepage;
