import { Route, Routes } from 'react-router-dom';
import Piyush from './test-grounds/piyush';
import Harsh from './test-grounds/harsh';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div className="text-black">Home</div>} />
        <Route path="/piyush" element={<Piyush />} />
        <Route path="/harsh" element={<Harsh />} />
      </Routes>
    </>
  );
}

export default App;
