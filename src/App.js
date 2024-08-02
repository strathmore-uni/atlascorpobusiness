import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainpage from "./MainOpeningpage/Mainpage";
import NavigationBar from "./General Components/NavigationBar";
import Categories from "./Categories and Display page/Categories";
import Shop from "./Categories and Display page/Shop";
import Productdetails from "./Product Details/Productdetails";
import Products from "./Categories and Display page/Products";
import ShoppingCartPage from "./Shopping Cart/ShoppingCartPage";
import Checkout from "./Shopping Cart/Checkout";
import Delivery from "./Shopping Cart/Delivery";
import MyComponent from "./Db/MyComponent";
import Form from "./Shopping Cart/Form";
import ReviewOrder from "./Shopping Cart/ReviewOrder";
import SearchDisplay from "./General Components/SearchDisplay";
import ScrollToTop from "./General Components/ScrollToTop";
import "./App.css";
import Mytestingpage from "./Categories and Display page/Categories Pages/Mytestingpage";

import ProductsPage from "./Products Page/ProductsPage";
import BackToTopButton from "./General Components/BackToTopButton";
import SignInPage from "./MainOpeningpage/SignInPage";
import { AuthProvider, useAuth } from "./MainOpeningpage/AuthContext";

import OrderHistory from "./Shopping Cart/OrderHistory";

import Userprofile from "./Products Page/Userprofile";
import ForgotPasswordForm from "./ForgotPassword/ForgotFormPassword";
import ResetPasswordPage from "./ForgotPassword/ResetPasswordPage";
import VerifyEmail from "./MainOpeningpage/EmailVerification";

import EmailConfirmation from "./MainOpeningpage/Emailconfirmation";
import Saveditems from "./General Components/Saveditems";
import Mainadmin from "./Admin/Mainadmin";
import Ordereditems from "./Admin/Ordereditems";
import AddProduct from "./Admin/AddProduct";
import EditProduct from "./Admin/EditProduct";
import ProductsList from "./Admin/ProductList";
import RegisteredUsers from "./Admin/RegisteredUsers";
import OrderDetails from "./Admin/OrderDetails ";
import AdminDashboardSummary from "./Admin/AdminDashboardSummary ";
import OrderDetailsPage from "./Admin/OrderDetailsPage ";
import Stock from "./Admin/Stock";
import NotificationsPage from "./Admin/NotificationsPage";
import UserNotificationPage from "./General Components/UserNotificationPage";

import Settings from "./Admin/Settings ";
import CreateAdmin from "./Admin/CreateAdmin";
import CountryComparison from "./Admin/CountryComparison";
import AdminRightsManagement from "./Admin/AdminRightsManagement ";

function App() {
  const [guestEmail, setGuestEmail] = useState("");
  const [quotationItems, setQuotationItems] = useState([]);
  const [saveditem, setSaveditem] = useState([]);

  const { currentUser } = useAuth();

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
  const handleAddQuotationProduct = (productquotation) => {
    const ProductExistQuotation = quotationItems.find(
      (itemquotation) => itemquotation.id === productquotation.id
    );

    if (ProductExistQuotation) {
      setQuotationItems(
        quotationItems.map((item) =>
          item.id === productquotation.id
            ? {
                ...ProductExistQuotation,
                quantity: ProductExistQuotation.quantity + 1,
              }
            : item
        )
      );
    } else {
      setQuotationItems([
        ...quotationItems,
        { ...productquotation, quantity: 1 },
      ]);
    }
  };

  const handleSavedItemsProduct = (productsaveditem) => {
    const ProductExistSaved = saveditem.find(
      (item) => item.id === productsaveditem.id
    );

    if (ProductExistSaved) {
      setSaveditem(
        saveditem.map((item) =>
          item.id === saveditem.id
            ? {
                ...ProductExistSaved,
                quantity: ProductExistSaved.quantity + 1,
              }
            : item
        )
      );
    } else {
      setSaveditem([...savedproductItems, { ...saveditem, quantity: 1 }]);
    }
  };

  const handleRemoveQuotationProduct = (productquotation) => {
    const ProductExistQuotation = quotationItems.find(
      (itemquotation) => itemquotation.id === productquotation.id
    );

    if (ProductExistQuotation.quantity === 1) {
      setQuotationItems(
        quotationItems.filter((item) => item.id !== productquotation.id)
      );
    } else {
      setQuotationItems(
        quotationItems.map((item) =>
          item.id === productquotation.id
            ? {
                ...ProductExistQuotation,
                quantity: ProductExistQuotation.quantity - 1,
              }
            : item
        )
      );
    }
  };
  const handleRemoveSingleQuotationProduct = (product) => {
    setQuotationItems(quotationItems.filter((item) => item.id !== product.id));
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
    setQuotationItems([]);
  };
  const handleAddProduct = (product) => {
    const ProductExist = cartItems.find(
      (item) => item.partnumber === product.partnumber
    );

    if (ProductExist) {
      setCartItems(
        cartItems.map((item) =>
          item.partnumber === product.partnumber
            ? { ...ProductExist, quantity: ProductExist.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };
  const handleAddHistoryProduct = (product) => {
    
  
 
    const formattedProduct = {
      partnumber: product.partnumber || '', 
      Description: product.description || '',
      Price: product.price || 0,
      quantity: product.quantity || 1,
      image: product.image || ''
    };
  
   
    const existingProduct = cartItems.find(item => item.partnumber === formattedProduct.partnumber);
  
    if (existingProduct) {
      
      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.partnumber === formattedProduct.partnumber
            ? { ...item, quantity: item.quantity + formattedProduct.quantity }
            : item
        )
      );
    } else {
      // Add new product to cart
      setCartItems(prevCartItems => [...prevCartItems, formattedProduct]);
    }
  };
  const handleRemoveSingleProduct = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id));
  };
 

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            <Route
              path="/"
              element={
                <Mainpage
                  cartItems={cartItems}
                  handleAddProductDetails={handleAddProductDetails}
                  handleAddProduct={handleAddProduct}
                  quotationItems={quotationItems}
                  handleAddQuotationProduct={handleAddQuotationProduct}
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
                  quotationItems={quotationItems}
                  handleAddQuotationProduct={handleAddQuotationProduct}
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
                <>
                  <ShoppingCartPage
                    handleAddProduct={handleAddProduct}
                    handleRemoveSingleQuotationProduct={
                      handleRemoveSingleQuotationProduct
                    }
                    handleRemoveSingleProduct={handleRemoveSingleProduct}
                    cartItems={cartItems}
                    quotationItems={quotationItems}
                    handleAddQuotationProduct={handleAddQuotationProduct}
                    handleRemoveProduct={handleRemoveProduct}
                    handleCartClearance={handleCartClearance}
                    totalPrice={totalPrice}
                    handleRemoveQuotationProduct={handleRemoveQuotationProduct}
              
                  />
                </>
              }
            />

            <Route
              path="/delivery"
              element={
                <Delivery cartItems={cartItems} totalPrice={totalPrice} />
              }
            />
            <Route
              path="/form"
              element={<Form cartItems={cartItems} totalPrice={totalPrice} />}
            />
            <Route
              path="/review-order"
              element={
                <ReviewOrder totalPrice={totalPrice} />
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
              element={
                <Checkout cartItems={cartItems} totalPrice={totalPrice} />
              }
            />
            <Route path="/mycomponent" element={<MyComponent />} />
            <Route path="/categories" element={<Categories />} />

            <Route path="/mytestingpage" element={<Mytestingpage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/emailconfirmation" element={<EmailConfirmation />} />

            <Route path="" element={<Notification />} />

            <Route
              path="/products"
              element={
                <Products
                  handleAddProductDetails={handleAddProductDetails}
                  cartItems={cartItems}
                  quotationItems={quotationItems}
                  handleAddQuotationProduct={handleAddQuotationProduct}
                />
              }
            />
            <Route
              path="/products/:category"
              element={
                <ProductsPage
                  handleAddProductDetails={handleAddProductDetails}
                  cartItems={cartItems}
                  handleAddProduct={handleAddProduct}
                />
              }
            />
            <Route
              path="/signin"
              element={<SignInPage setGuestEmail={setGuestEmail} />}
            />

            <Route path="/userprofile" element={<Userprofile />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route
              path="/saveditems"
              element={
                <Saveditems
                  handleSavedItemsProduct={handleSavedItemsProduct}
                  saveditem={saveditem}
                  quotationItems={quotationItems}
                  handleAddProduct={handleAddProduct}
                  handleRemoveSingleQuotationProduct={
                    handleRemoveSingleQuotationProduct
                  }
                />
              }
            />
            <Route path="/mainadmin" element={<Mainadmin  />} />
            <Route path="" element={<Ordereditems />} />
            <Route path="/ordereditems/:category" element={<OrderDetailsPage />} />
            <Route path="/addproduct"  element={<AddProduct />}/>
            <Route path="/dashboard" element={<AdminDashboardSummary />} />
            <Route path="/admin/settings" element={<Settings />}  />
            <Route path="/admin/create-admin" element={<CreateAdmin />} />
            <Route path="/admin/country-comparison" element={<CountryComparison />}  />
            <Route path='/stock' element={<Stock />} />
            <Route path="/editproduct/:id"  element={<EditProduct />}/>
            <Route path="/admin/adminrightsmanagement" element={<AdminRightsManagement />}  />
            <Route path="/productlist"  element={<ProductsList />}/>
            <Route path="/registeredusers"  element={<RegisteredUsers />}/>
            <Route path="orderdetails/:orderId" element={<OrderDetails />} />
            <Route path="/notifications" element={<NotificationsPage />}  />
            <Route path="/usernotifications" element={<UserNotificationPage />}  />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/orderhistory" element={<OrderHistory handleAddProduct={handleAddProduct}  handleAddHistoryProduct={handleAddHistoryProduct} />} />
          </Routes>
         
        </BrowserRouter>
        <BackToTopButton />
      </AuthProvider>
    </>
  );
}

export default App;
