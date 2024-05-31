import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";
import Productdetails from "./Product Details/Productdetails";

import Products from "./Categories and Display page/Products";
import ShoppingCartPage from "./Shopping Cart/ShoppingCartPage";
import FilterElement from "./Categories and Display page/Categories Pages/FilterElement";
import Checkout from "./Shopping Cart/Checkout";
import Delivery from "./Shopping Cart/Delivery";
import MyComponent from "./Db/MyComponent";
import Form from "./Shopping Cart/Form";
import ReviewOrder from "./Shopping Cart/ReviewOrder";
import SearchDisplay from "./General Components/SearchDisplay";
import ScrollToTop from "./General Components/ScrollToTop";
import Servkit from "./Categories and Display page/Categories Pages/Servkit";

import "./App.css";
import OilFilterElement from "./Categories and Display page/Categories Pages/OilFilterElement";
import Autodrainvalve from "./Categories and Display page/Categories Pages/Autodrainvalve";
import Contractor from "./Categories and Display page/Categories Pages/Contractor";
import Overhaulkit from "./Categories and Display page/Categories Pages/Overhaulkit";
import Bearingkits from "./Categories and Display page/Categories Pages/Bearingkits";
import Silencerkit from "./Categories and Display page/Categories Pages/Silencerkit";
import Maintenancekit from "./Categories and Display page/Categories Pages/Maintenancekit";
import Prevmain from "./Categories and Display page/Categories Pages/Prevmain";
import Hrkit from "./Categories and Display page/Categories Pages/Hrkit";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [productdetails, setProductDetails] = useState([]);

  const totalPrice = cartItems.reduce(
    (Price, item) => Price + item.quantity * item.Price,
    0
  );

  useEffect(() => {
    // Save cart items to local storage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddProductDetails = (productdetailss) => {
    const ProductExistDetail = productdetails.find(
      (itemsdetails) => itemsdetails.id === productdetailss.id
    );

    if (ProductExistDetail) {
      setProductDetails(
        productdetails.map((item) =>
          item.id === productdetailss.id ? { ...ProductExistDetail } : item
        )
      );
    } else {
      setProductDetails([{ ...productdetailss }]);
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
  const handleRemoveSingleProduct = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id));
  };

 const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    async function fetchCountryCode() {
      let url = 'https://ipinfo.io/json?token=19349ef51244e4';
      let response = await fetch(url);
      let data = await response.json();
      setCountryCode(data.country);
    }
    fetchCountryCode();
  }, []);



  return (
    <>
      <BrowserRouter>
        <ScrollToTop />

        <NavigationBar cartItems={cartItems} />

        <Routes>
          <Route
            path="/"
            element={
              <Mainpage
                cartItems={cartItems}
                handleAddProductDetails={handleAddProductDetails}
                handleAddProduct={handleAddProduct}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/productdetails"
            element={
              <Productdetails
                handleAddProductDetails={handleAddProductDetails}
                handleAddProduct={handleAddProduct}
                productdetails={productdetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <ShoppingCartPage
                handleAddProduct={handleAddProduct}
                handleRemoveSingleProduct={handleRemoveSingleProduct}
                cartItems={cartItems}
                handleRemoveProduct={handleRemoveProduct}
                handleCartClearance={handleCartClearance}
                totalPrice={totalPrice}
              />
            }
          />
          <Route
            path="/delivery"
            element={<Delivery cartItems={cartItems} totalPrice={totalPrice} />}
          />
          <Route
            path="/form"
            element={<Form cartItems={cartItems} totalPrice={totalPrice} />}
          />
          <Route
            path="/review-order"
            element={
              <ReviewOrder cartItems={cartItems} totalPrice={totalPrice} />
            }
          />
          <Route
            path="/search"
            element={
              <SearchDisplay
                handleAddProduct={handleAddProduct}
                cartItems={cartItems}
                handleAddProductDetails={handleAddProductDetails}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cartItems} totalPrice={totalPrice} />}
          />
          <Route path="/mycomponent" element={<MyComponent />} />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/shop/servkit"
            element={
              <Servkit
                cartItems={cartItems}
                handleAddProductDetails={handleAddProductDetails}
              />
            }
          />
          <Route
            path="/shop/filterelement"
            element={
              <FilterElement
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/shop/autodrainvalve"
            element={
              <Autodrainvalve
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/shop/oilfilterelement"
            element={
              <OilFilterElement
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />

          <Route
            path="/shop/contractor"
            element={
              <Contractor
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/shop/bearingkits"
            element={
              <Bearingkits
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />

          <Route
            path="/shop/overhaulkit"
            element={
              <Overhaulkit
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/shop/silencerkit"
            element={
              <Silencerkit
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/shop/maintenancekit"
            element={
              <Maintenancekit
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path="/shop/prevmain"
            element={
              <Prevmain
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
             <Route
            path="/shop/hrkit"
            element={
              <Hrkit
                handleAddProduct={handleAddProduct}
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />


          <Route path="" element={<Notification />} />

          <Route
            path="/products"
            element={
              <Products
                handleAddProductDetails={handleAddProductDetails}
                cartItems={cartItems}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
