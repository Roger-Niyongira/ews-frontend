import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import InstructionPanel from "./components/InstructionPanel";
import Navbar from "./components/Navbar";
import TopButtons from "./components/Dashboard/TopButtons";
import Body from "./components/Dashboard/Body";
import AboutPage from "./components/AboutPage";
import LoginPage from "./components/LoginPage";
import ContactPage from "./components/ContactPage";
import PlanningPage from "./components/PlanningPage";
import ProjectListModal, { UserProject } from "./components/ProjectListModal";
import SettingsModal from "./components/SettingsModal";
import "./App.css";

export interface ClimateThreshold {
  green: number;
  orange: number;
}

export type ClimateThresholds = Record<string, ClimateThreshold>;

export interface ProjectGeoJsonLayer {
  id: number;
  name: string;
  project: string | null;
  is_public: boolean;
  geojson_file: string;
  geojsonData: GeoJSON.GeoJsonObject | null;
}

function App() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(() => {
    const savedProject = localStorage.getItem("ews_selected_project");
    return savedProject ? (JSON.parse(savedProject) as UserProject) : null;
  });
  const [showInstruction, setShowInstruction] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showClimateZones, setShowClimateZones] = useState(false);
  const [showPrecipitations, setShowPrecipitations] = useState(false);
  const [precipitationAvailable, setPrecipitationAvailable] = useState(false);
  const [showWatersheds, setShowWatersheds] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  const [showFloodMap, setShowFloodMap] = useState(false);
  const [floodMapStatus] = useState<"public" | "private" | "none">("none");
  const [userCanAccessFloodMap] = useState(false);
  const [defaultThresholds, setDefaultThresholds] = useState<ClimateThresholds>({});
  const [thresholds, setThresholds] = useState<ClimateThresholds>({});
  const [currentUsername, setCurrentUsername] = useState<string | null>(() =>
    localStorage.getItem("ews_username")
  );
  const [currentFirstName, setCurrentFirstName] = useState<string | null>(() =>
    localStorage.getItem("ews_first_name")
  );
  const [currentLastName, setCurrentLastName] = useState<string | null>(() =>
    localStorage.getItem("ews_last_name")
  );
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("ews_access_token")
  );
  const [, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem("ews_refresh_token")
  );
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [projectWatersheds, setProjectWatersheds] = useState<ProjectGeoJsonLayer[]>([]);
  const watershedStatus: "public" | "private" | "none" =
    projectWatersheds.length > 0 && selectedProject ? "private" : "none";
  const userCanAccessWatersheds =
    Boolean(selectedProject) && projectWatersheds.length > 0;
  const dashboardFloodRasterAvailable =
    floodMapStatus !== "none" &&
    (floodMapStatus === "public" || userCanAccessFloodMap);

  useEffect(() => {
    if (location.pathname === "/about") {
      document.title = "EWS | About";
    } else if (location.pathname === "/contact") {
      document.title = "EWS | Contact";
    } else if (location.pathname === "/planning") {
      document.title = "EWS | Planning Tool";
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
    if (!accessToken) {
      setProjects([]);
      setSelectedProject(null);
      return;
    }

    axios
      .get<UserProject[]>(`${API_BASE_URL}/api/my-projects/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setProjects(res.data);
        setSelectedProject((current) => {
          const savedProject = localStorage.getItem("ews_selected_project");
          if (!savedProject) {
            return current;
          }

          const parsedProject = JSON.parse(savedProject) as UserProject;
          const stillAllowed = res.data.some((project) => project.id === parsedProject.id);

          return stillAllowed ? parsedProject : null;
        });
      })
      .catch(() => {
        localStorage.removeItem("ews_username");
        localStorage.removeItem("ews_first_name");
        localStorage.removeItem("ews_last_name");
        localStorage.removeItem("ews_access_token");
        localStorage.removeItem("ews_refresh_token");
        localStorage.removeItem("ews_selected_project");
        setCurrentUsername(null);
        setCurrentFirstName(null);
        setCurrentLastName(null);
        setAccessToken(null);
        setRefreshToken(null);
        setProjects([]);
        setSelectedProject(null);
      });
  }, [API_BASE_URL, accessToken]);

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

  useEffect(() => {
    if (!selectedProject || !accessToken) {
      setProjectWatersheds([]);
      setShowWatersheds(false);
      return;
    }

    axios
      .get<Omit<ProjectGeoJsonLayer, "geojsonData">[]>(
        `${API_BASE_URL}/api/projects/${selectedProject.slug}/watersheds/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then(async (res) => {
        const watershedLayers = await Promise.all(
          res.data.map(async (layer) => {
            try {
              const geojsonRes = await fetch(layer.geojson_file);

              if (!geojsonRes.ok) {
                throw new Error("Unable to load GeoJSON file");
              }

              const geojsonData = (await geojsonRes.json()) as GeoJSON.GeoJsonObject;
              return { ...layer, geojsonData };
            } catch {
              return { ...layer, geojsonData: null };
            }
          })
        );

        setProjectWatersheds(watershedLayers);
        setShowWatersheds(watershedLayers.length > 0);
      })
      .catch(() => {
        setProjectWatersheds([]);
        setShowWatersheds(false);
      });
  }, [API_BASE_URL, accessToken, selectedProject]);

  const handleApplyThresholds = (nextThresholds: ClimateThresholds) => {
    setThresholds(nextThresholds);
    setShowSettings(false);
  };

  const handleResetThresholds = () => {
    setThresholds(defaultThresholds);
    setShowSettings(false);
  };

  const handlePrecipitationAvailabilityChange = useCallback((available: boolean) => {
    setPrecipitationAvailable(available);
    setShowPrecipitations(available);
  }, []);

  const handleLoginSuccess = (payload: {
    username: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshToken: string;
  }) => {
    setCurrentUsername(payload.username);
    setCurrentFirstName(payload.firstName);
    setCurrentLastName(payload.lastName);
    setAccessToken(payload.accessToken);
    setRefreshToken(payload.refreshToken);
    localStorage.setItem("ews_username", payload.username);
    localStorage.setItem("ews_first_name", payload.firstName);
    localStorage.setItem("ews_last_name", payload.lastName);
    localStorage.setItem("ews_access_token", payload.accessToken);
    localStorage.setItem("ews_refresh_token", payload.refreshToken);
    setShowProjects(true);
  };

  const handleProjectSelect = (project: UserProject) => {
    setSelectedProject(project);
    localStorage.setItem("ews_selected_project", JSON.stringify(project));
    setShowProjects(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("ews_username");
    localStorage.removeItem("ews_first_name");
    localStorage.removeItem("ews_last_name");
    localStorage.removeItem("ews_access_token");
    localStorage.removeItem("ews_refresh_token");
    localStorage.removeItem("ews_selected_project");
    setCurrentUsername(null);
    setCurrentFirstName(null);
    setCurrentLastName(null);
    setAccessToken(null);
    setRefreshToken(null);
    setProjects([]);
    setSelectedProject(null);
    setShowProjects(false);
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar
        onInstructionClick={() => setShowInstruction(true)}
        onLoginClick={() => setShowLogin(true)}
        onSettingsClick={() => setShowSettings(true)}
        onProjectsClick={() => setShowProjects(true)}
        onLogout={handleLogout}
        currentUsername={currentUsername}
        currentDisplayName={currentFirstName || currentLastName || currentUsername}
        currentProjectName={selectedProject?.name ?? null}
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
            currentProjectName={selectedProject?.name ?? null}
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
            precipitationAvailable={precipitationAvailable}
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
                  darkMode={darkMode}
                  showClimateZones={showClimateZones}
                  showFloodMap={showFloodMap}
                  showPrecipitations={showPrecipitations}
                  projectName={selectedProject?.name ?? null}
                  projectWatersheds={projectWatersheds}
                  showWatersheds={showWatersheds}
                  thresholds={thresholds}
                  onPrecipitationAvailabilityChange={
                    handlePrecipitationAvailabilityChange
                  }
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/planning"
              element={
                <PlanningPage
                  projectName={selectedProject?.name ?? null}
                  dashboardWatersheds={projectWatersheds}
                  dashboardFloodRasterAvailable={dashboardFloodRasterAvailable}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      {showInstruction && (
        <InstructionPanel onClose={() => setShowInstruction(false)} />
      )}
      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showProjects && currentUsername && (
        <ProjectListModal
          onClose={() => setShowProjects(false)}
          projects={projects}
          username={currentUsername}
          onProjectSelect={handleProjectSelect}
        />
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
