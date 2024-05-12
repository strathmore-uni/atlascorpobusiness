import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";
import Big from "./Categories and Display page/Categories Pages/Big";
import Heavy from "./Categories and Display page/Categories Pages/Heavy";

import Productdetails from "./Product Details/Productdetails";
import fulldata from "./Fulldata";
import Products from "./Categories and Display page/Products";
import ShoppingCartPage from "./Shopping Cart/ShoppingCartPage";

function App() {
  const fulldatas = fulldata;

  const [cartItems, setCartItems] = useState([]);

  const [productdetails, setproductdetails] = useState([]);

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
        <main>
          <Routes>
            <Route path="/" element={<Mainpage    cartItems={cartItems} />} />
            <Route path="" element={<NavigationBar   cartItems={cartItems} />} />
            <Route path="" element={<Categories />} />
            <Route
              path="/Shop"
              element={
                <Shop
                  fulldatas={fulldatas}
                  handleAddProduct={handleAddProduct}
                  handleAddProductDetails={handleAddProductDetails}
                  cartItems={cartItems}
                />
              }
            />
            <Route
              path="/Shop/Big"
              element={
                <Big
                  fulldatas={fulldatas}
                  handleAddProduct={handleAddProduct}
                  handleAddProductDetails={handleAddProductDetails}
                  cartItems={cartItems}
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
                 
                />
              }
            />
            <Route
              path=""
              element={
                <Products
                  handleAddProductDetails={handleAddProductDetails}
                  fulldatas={fulldatas}
                  
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
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
