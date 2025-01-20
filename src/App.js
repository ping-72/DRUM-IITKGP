import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapDrawer from './components/MapDrawer';
import Homepage from './components/pages/Homepage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/routes"
          element={
            <main className="h-screen w-full flex flex-col">
              <MapDrawer />
              {/* <footer className="mx-auto w-fit text-center bg-transparent">
          Least Exposure to Air Pollution Path
          </footer> */}
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
