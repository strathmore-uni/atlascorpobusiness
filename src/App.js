import React, { useState,useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";

import Heavy from "./Categories and Display page/Categories Pages/Heavy";

import Productdetails from "./Product Details/Productdetails";
import fulldata from "./Fulldata";
import Products from "./Categories and Display page/Products";
import ShoppingCartPage from "./Shopping Cart/ShoppingCartPage";
import OilFreeCompressor from "./Categories and Display page/Categories Pages/Servkit";
import FilterElement from "./Categories and Display page/Categories Pages/FilterElement";
import Checkout from "./Shopping Cart/Checkout";
import Delivery from "./Shopping Cart/Delivery";
import MyComponent from "./Db/MyComponent";
import axios from 'axios';
import './i18n ';
import Form from "./Shopping Cart/Form";
import ReviewOrder from "./Shopping Cart/ReviewOrder";
import Footer from "./General Components/Footer";
import SearchDisplay from "./General Components/SearchDisplay";
import ScrollToTop from "./General Components/ScrollToTop";
import Servkit from "./Categories and Display page/Categories Pages/Servkit";




function App() {


  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/data`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

   const datas=data;
  const fulldatas = fulldata;

  const [cartItems, setCartItems] = useState([]);
  const oilfreedata = fulldatas ? fulldatas.filter((Category) => Category.Category === 'Oil-free Compressors') : [];

  const [productdetails, setproductdetails] = useState([]);

  const totalPrice = cartItems.reduce(
    (Price, item) => Price + item.quantity * item.Price,
    0
  );
  

  const handleAddProductDetails = (productdetailss) => {
    const ProductExistDetail = productdetails.find(
      (itemsdetails) => itemsdetails.id === productdetailss.id
    );

    if (ProductExistDetail) {
      setproductdetails(
        productdetails.map((item) =>
          item.id === productdetailss.id ? { ...ProductExistDetail } : item
        )
      );
    } else {
      setproductdetails([{ ...productdetailss }]);
    }
  };

  const handleRemoveProduct = (product) => {
    const ProductExist = cartItems.find((item) => item.id === product.id);

    if (ProductExist.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...ProductExist, quantity: ProductExist.quantity - 1 }
            : item
        )
      );
    }
  };

  const handleCartClearance = () => {
    setCartItems([]);
  };

  const handleAddProduct = (product) => {
    const ProductExist = cartItems.find((item) => item.id === product.id);

    if (ProductExist) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...ProductExist, quantity: ProductExist.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <>
    
      <BrowserRouter>
      <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<Mainpage cartItems={cartItems} />} />
            <Route path="" element={<NavigationBar cartItems={cartItems} />} />
           
            <Route path="" element={<Categories   oilfreedata={oilfreedata} fulldatas={fulldatas} />} />
           <Route  path="/delivery" element={<Delivery  cartItems={cartItems} totalPrice={totalPrice}  />} />
           <Route  path="/form" element={<Form cartItems={cartItems} totalPrice={totalPrice} />}  />
           <Route  path="/review-order"  element={<ReviewOrder cartItems={cartItems} totalPrice={totalPrice}  />} />
           <Route  path="/search" element={<SearchDisplay  handleAddProduct={handleAddProduct} cartItems={cartItems} handleAddProductDetails={handleAddProductDetails} />}  />
<Route  path="mycomponent" element={<MyComponent />} />
           <Route  path="/Checkout"  element={<Checkout  cartItems={cartItems} totalPrice={totalPrice} />} />


            <Route
              path="/Shop/Servkit"
              element={
                <Servkit
                  fulldatas={fulldatas}
                  cartItems={cartItems}
                  oilfreedata={oilfreedata}
             handleAddProductDetails={handleAddProductDetails}
                />
              }
            />
            <Route
              path="/Shop"
              element={
                <Shop
                  fulldatas={fulldatas}
                  handleAddProduct={handleAddProduct}
                  handleAddProductDetails={handleAddProductDetails}
                  cartItems={cartItems}
                  oilfreedata={oilfreedata}
                  datas={datas}
                />
              }
            />
            <Route
              path="/Shop/Filterelement"
              element={
                <FilterElement
                  fulldatas={fulldatas}
                  handleAddProduct={handleAddProduct}
                  handleAddProductDetails={handleAddProductDetails}
                  cartItems={cartItems}
                 
                  datas={datas}
                />
              }
            />
            <Route path="/Shop/Heavy" element={<Heavy />} />

            <Route
              path="/Productdetails"
              element={
                <Productdetails
                  handleAddProductDetails={handleAddProductDetails}
                  handleAddProduct={handleAddProduct}
                  productdetails={productdetails}
                  cartItems={cartItems}
                  datas={datas}
                />
              }
            />
            <Route
              path=""
              element={
                <Products
                  handleAddProductDetails={handleAddProductDetails}
                  fulldatas={fulldatas}
                  datas={datas}
                  cartItems={cartItems}
                />
              }
            />
            <Route
              path="/Cart"
              element={
                <ShoppingCartPage
                  handleAddProduct={handleAddProduct}
                  cartItems={cartItems}
                  handleRemoveProduct={handleRemoveProduct}
                  handleCartClearance={handleCartClearance}
                  totalPrice={totalPrice}
                  datas={datas}
                />
              }
            />
             <Route path="" element={<Footer  />}  />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
