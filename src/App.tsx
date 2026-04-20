import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import InstructionPanel from "./components/InstructionPanel";
import Navbar from "./components/Navbar";
import TopButtons from "./components/Dashboard/TopButtons";
import Body from "./components/Dashboard/Body";
import AboutPage from "./components/AboutPage";
import LoginPage from "./components/LoginPage";
import ContactPage from "./components/ContactPage";
import SettingsModal from "./components/SettingsModal";
import "./App.css";

export interface ClimateThreshold {
  green: number;
  orange: number;
}

export type ClimateThresholds = Record<string, ClimateThreshold>;

function App() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showClimateZones, setShowClimateZones] = useState(false);
  const [showPrecipitations, setShowPrecipitations] = useState(true);
  const [showWatersheds, setShowWatersheds] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  const [showFloodMap, setShowFloodMap] = useState(false);
  const [floodMapStatus] = useState<"public" | "private" | "none">("none");
  const [userCanAccessFloodMap] = useState(false);
  const [watershedStatus] = useState<"public" | "private" | "none">("none");
  const [userCanAccessWatersheds] = useState(false);
  const [defaultThresholds, setDefaultThresholds] = useState<ClimateThresholds>({});
  const [thresholds, setThresholds] = useState<ClimateThresholds>({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    if (location.pathname === "/about") {
      document.title = "EWS | About";
    } else if (location.pathname === "/contact") {
      document.title = "EWS | Contact";
    } else if (location.pathname === "/preference") {
      document.title = "EWS | Preference";
    } else {
      document.title = "EWS | Dashboard";
    }
  }, [location.pathname]);

  useEffect(() => {
    setShowInstruction(false);
  }, [location.pathname]);

  useEffect(() => {
    axios
      .get<ClimateThresholds>(`${API_BASE_URL}/api/climate-thresholds/`)
      .then((res) => {
        const fetchedThresholds = res.data;
        setDefaultThresholds(fetchedThresholds);
        setThresholds(fetchedThresholds);
      })
      .catch(() => {
        setThresholds({});
      });
  }, [API_BASE_URL]);

  const handleApplyThresholds = (nextThresholds: ClimateThresholds) => {
    setThresholds(nextThresholds);
    setShowSettings(false);
  };

  const handleResetThresholds = () => {
    setThresholds(defaultThresholds);
    setShowSettings(false);
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar
        onInstructionClick={() => setShowInstruction(true)}
        onLoginClick={() => setShowLogin(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

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
            showClimateZones={showClimateZones}
            setShowClimateZones={setShowClimateZones}
            showFloodMap={showFloodMap}
            setShowFloodMap={setShowFloodMap}
            showPrecipitations={showPrecipitations}
            setShowPrecipitations={setShowPrecipitations}
            showWatersheds={showWatersheds}
            setShowWatersheds={setShowWatersheds}
            floodMapStatus={floodMapStatus}
            userCanAccessFloodMap={userCanAccessFloodMap}
            watershedStatus={watershedStatus}
            userCanAccessWatersheds={userCanAccessWatersheds}
            onLoginClick={() => setShowLogin(true)}
          />
        )}

        <div className="flex-grow-1 d-flex overflow-hidden position-relative">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <Body
                  showClimateZones={showClimateZones}
                  showFloodMap={showFloodMap}
                  showPrecipitations={showPrecipitations}
                  thresholds={thresholds}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      {showInstruction && (
        <InstructionPanel onClose={() => setShowInstruction(false)} />
      )}
      {showLogin && (
        <LoginPage onClose={() => setShowLogin(false)} />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          thresholds={thresholds}
          defaultThresholds={defaultThresholds}
          onApply={handleApplyThresholds}
          onReset={handleResetThresholds}
        />
      )}
    </div>
  );
}

export default App;
