import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";
import Big from "./Categories and Display page/Categories Pages/Big";
import Heavy from "./Categories and Display page/Categories Pages/Heavy";
import Pagination from "./General Components/Pagination";
import Productdetails from "./Product Details/Productdetails";
import fulldata from "./Fulldata";
import Products from "./Categories and Display page/Products";

function App() {
  const fulldatas = fulldata;

  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="" element={<NavigationBar />} />
            <Route path="" element={<Categories />} />
            <Route path="/Shop" element={<Shop fulldatas={fulldatas} />} />
            <Route path="/Shop/Big" element={<Big fulldatas={fulldatas} />} />
            <Route path="/Shop/Heavy" element={<Heavy />} />
            <Route path="" element={<Pagination fulldatas={fulldatas} />} />
            <Route path="/Productdetails" element={<Productdetails  />} />
            <Route path="" element={<Products fulldatas={fulldatas}   />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
