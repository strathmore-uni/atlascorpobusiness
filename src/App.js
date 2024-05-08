import "./App.css";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";
import Big from "./Categories and Display page/Categories Pages/Big";
import Heavy from "./Categories and Display page/Categories Pages/Heavy";
import Pagination from "./General Components/Pagination";

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
          <Route path="/" element={<Mainpage  />} />
            <Route path="" element={<NavigationBar  />}  />
            <Route path="" element={<Categories  />}  />
            <Route  path="/Shop"  element={<Shop  />} />
            <Route path="/Shop/Big" element={<Big />}  />
            <Route  path="/Shop/Heavy" element={<Heavy />} />
            <Route  path="" element={<Pagination />}  />
            
            
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
