import Navbar from "./components/Navbar";
import TopButtons from "./components/TopButtons";
import Body from "./components/Body";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const appClass = darkMode
    ? "app-dark-mode flex-grow-1 d-flex flex-column"
    : "flex-grow-1 d-flex flex-column";

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar />
      <div className={appClass}>
        <TopButtons darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-grow-1 d-flex overflow-hidden">
          <Body />
        </div>
      </div>
    </div>
  );
}

export default App;
