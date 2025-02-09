import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import MapDrawer from './components/MapDrawer';
import MapDrawer from './components/newFileStr/MapDrawer';
import Homepage from './components/newFileStr/Homepage';
import { CarProvider } from './components/newFileStr/contexts/Carcontext';

export default function App() {
  return (
    <BrowserRouter>
      <CarProvider>
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
      </CarProvider>
    </BrowserRouter>
  );
}
