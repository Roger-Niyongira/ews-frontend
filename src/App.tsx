import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import InstructionPanel from "./components/InstructionPanel";
import Navbar from "./components/Navbar";
import TopButtons from "./components/Dashboard/TopButtons";
import Body from "./components/Dashboard/Body";
import AboutPage from "./components/AboutPage";
import "./App.css";

export type ViewMode = "precip" | "swat";

function App() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  //Adding the priority: precip or swat for big map display
  const [mode, setMode] = useState<ViewMode>("precip");
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    if (location.pathname === "/about") {
      document.title = "EWS | About";
    } else if (location.pathname === "/preference") {
      document.title = "EWS | Preference";
    } else {
      document.title = "EWS | Dashboard";
    }
  }, [location.pathname]);

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
          <TopButtons
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            mode={mode}
            setMode={setMode}
          />
        )}
        <div className="flex-grow-1 d-flex overflow-hidden position-relative">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Body mode={mode} />} />
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
