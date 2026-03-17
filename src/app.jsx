import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./componets/layout/navibar";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Chatbot from "./pages/chatbot";
import Alerts from "./pages/alerts";
import CarbonCalculator from "./pages/carboncalculator";
import About from "./pages/about";

import TouristSpots from "./pages/touristspots";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/carbon" element={<CarbonCalculator />} />
        <Route path="/tourist" element={<TouristSpots />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
