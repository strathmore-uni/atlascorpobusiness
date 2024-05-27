import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";
import Heavy from "./Categories and Display page/Categories Pages/Heavy";
import Productdetails from "./Product Details/Productdetails";
import fulldata from "./Fulldata";
import Products from "./Categories and Display page/Products";
import ShoppingCartPage from "./Shopping Cart/ShoppingCartPage";
import FilterElement from "./Categories and Display page/Categories Pages/FilterElement";
import Checkout from "./Shopping Cart/Checkout";
import Delivery from "./Shopping Cart/Delivery";
import MyComponent from "./Db/MyComponent";
import Form from "./Shopping Cart/Form";
import ReviewOrder from "./Shopping Cart/ReviewOrder";
import Footer from "./General Components/Footer";
import SearchDisplay from "./General Components/SearchDisplay";
import ScrollToTop from "./General Components/ScrollToTop";
import Servkit from "./Categories and Display page/Categories Pages/Servkit";
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState(() => {

    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

 const location =useLocation;

  const getUserLocation = async () => {
    const response = await fetch(`https://ipinfo.io/156.0.233.52/json?token=19349ef51244e4`);
    const data = await response.json();
    
    return data.country; // Use the country code or name as needed
};

getUserLocation().then(location => {
    
    // Now you can use location to fetch the price
}).catch(error => {
    console.error('Error fetching IP location:', error);
});

  const [productdetails, setProductDetails] = useState([]);
  const fulldatas = fulldata;
  const oilfreedata = fulldatas ? fulldatas.filter((Category) => Category.Category === 'Oil-free Compressors') : [];
  const totalPrice = cartItems.reduce((Price, item) => Price + item.quantity * item.Price, 0);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/data`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever cartItems changes
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
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

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />

       
        <NavigationBar cartItems={cartItems} />

          <Routes>
            <Route path="/" element={<Mainpage cartItems={cartItems}  datas={data} handleAddProductDetails={handleAddProductDetails} handleAddProduct={handleAddProduct} />} />
            <Route path="/shop" element={<Shop fulldatas={fulldatas} handleAddProduct={handleAddProduct} handleAddProductDetails={handleAddProductDetails} cartItems={cartItems} oilfreedata={oilfreedata} datas={data} />} />
            <Route path="/productdetails" element={<Productdetails handleAddProductDetails={handleAddProductDetails} handleAddProduct={handleAddProduct} productdetails={productdetails} cartItems={cartItems} datas={data} />} />
            <Route path="/cart" element={<ShoppingCartPage handleAddProduct={handleAddProduct} handleRemoveSingleProduct={handleRemoveSingleProduct} cartItems={cartItems} handleRemoveProduct={handleRemoveProduct} handleCartClearance={handleCartClearance} totalPrice={totalPrice} datas={data} />} />
            <Route path="/delivery" element={<Delivery cartItems={cartItems} totalPrice={totalPrice} />} />
            <Route path="/form" element={<Form cartItems={cartItems} totalPrice={totalPrice} />} />
            <Route path="/review-order" element={<ReviewOrder cartItems={cartItems} totalPrice={totalPrice} />} />
            <Route path="/search" element={<SearchDisplay handleAddProduct={handleAddProduct} cartItems={cartItems} handleAddProductDetails={handleAddProductDetails} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} totalPrice={totalPrice} />} />
            <Route path="/mycomponent" element={<MyComponent />} />
            <Route path="/categories" element={<Categories oilfreedata={oilfreedata} fulldatas={fulldatas} />} />
            <Route path="/shop/servkit" element={<Servkit fulldatas={fulldatas} cartItems={cartItems} oilfreedata={oilfreedata} handleAddProductDetails={handleAddProductDetails} />} />
            <Route path="/shop/filterelement" element={<FilterElement fulldatas={fulldatas} handleAddProduct={handleAddProduct} handleAddProductDetails={handleAddProductDetails} cartItems={cartItems} datas={data} />} />
            <Route path="/shop/heavy" element={<Heavy />} />
            <Route path="/products" element={<Products handleAddProductDetails={handleAddProductDetails} fulldatas={fulldatas} datas={data} cartItems={cartItems} />} />
          </Routes>
    
    
     
      </BrowserRouter>
    </>
  );
}

export default App;
