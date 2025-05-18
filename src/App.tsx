import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import InstructionPanel from "./components/InstructionPanel";
import Navbar from "./components/Navbar";
import TopButtons from "./components/Dashboard/TopButtons";
import Body from "./components/Dashboard/Body";
import AboutPage from "./components/AboutPage";
import "./App.css";

function App() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  const isDashboard = location.pathname === "/";

  // Set page title based on current route
  useEffect(() => {
    if (location.pathname === "/about") {
      document.title = "EWS | About";
    } else if (location.pathname === "/preference") {
      document.title = "EWS | Preference";
    } else {
      document.title = "EWS | Dashboard";
    }
  }, [location.pathname]);

  // Auto-close instruction panel on route change
  useEffect(() => {
    setShowInstruction(false);
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar onInstructionClick={() => setShowInstruction(true)} />

      <div
        className={
          isDashboard && darkMode
            ? "app-dark-mode flex-grow-1 d-flex flex-column"
            : "flex-grow-1 d-flex flex-column"
        }
      >
        {isDashboard && (
          <TopButtons darkMode={darkMode} setDarkMode={setDarkMode} />
        )}

        <div className="flex-grow-1 d-flex overflow-hidden position-relative">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>

      {showInstruction && (
        <InstructionPanel onClose={() => setShowInstruction(false)} />
      )}
    </div>
  );
}

export default App;
