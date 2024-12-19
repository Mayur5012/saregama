import "./App.css";
import React from "react";
import MusicPlayer from "./MusicPlayer";
function App() {
  return (
    <>
      <div className="h-screen bg-gradient-to-b from-white to-gray-300 text-gray-800">
        <MusicPlayer />
      </div>
    </>
  );
}

export default App;
