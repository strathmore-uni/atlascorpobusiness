import "./App.css";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
          <Route path="/" element={<Mainpage  />} />
            <Route path="" element={<NavigationBar  />}  />
            
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
