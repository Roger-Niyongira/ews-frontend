import { useState } from "react";
import InstructionPanel from "./components/InstructionPanel";
import Navbar from "./components/Navbar";
import TopButtons from "./components/TopButtons";
import Body from "./components/Body";
import "./App.css";

function App() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar onInstructionClick={() => setShowInstruction(true)} />
      <div className={darkMode ? "app-dark-mode flex-grow-1 d-flex flex-column" : "flex-grow-1 d-flex flex-column"}>
        <TopButtons darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-grow-1 d-flex overflow-hidden position-relative">
          <Body />
          {showInstruction && (
            <InstructionPanel onClose={() => setShowInstruction(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
