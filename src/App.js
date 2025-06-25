import React, { useState, useEffect, createContext, useContext } from "react";
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

import Settings from "./Admin/Settings";
import CreateAdmin from "./Admin/CreateAdmin";
import CountryComparison from "./Admin/CountryComparison";
import AdminRightsManagement from "./Admin/AdminRightsManagement ";

import AuditLogPage from "./Admin/AuditLogPage";
import Dashboard from "./AdminWarehouse/Dashboard";
import WarehouseOrderDetails from "./AdminWarehouse/WarehouseOrderDetails";
import WarehouseOrderDetailsPage from "./AdminWarehouse/WarehouseOrderDetailsPage";
import FinanceDashboard from "./AdminFinance/FinanceDashboard";
import FinanceOrderViewPage from "./AdminFinance/FinanceOrderViewPage";
import AdminRecords from "./Admin/AdminRecords";
import FinanceUsers from "./AdminFinance/FinanceUsers";
import FinanceOrders from "./AdminFinance/FinanceOrders";
import AdminOrderHistory from "./Admin/AdminOrderHistory";
import AdminProfile from "./Admin/AdminProfile";
import AdminQuestionsPage from "./Admin/AdminQuesionsPage";
import axios from "axios";

// Create Cart Context
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch cart items from API
  const fetchCartItems = async () => {
    if (!currentUser?.email) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        params: { email: currentUser.email }
      });
      setCartItems(response.data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!currentUser?.email) {
      throw new Error('User not authenticated');
    }

    try {
      // First, add to API
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/singlecart`, {
        partnumber: product.partnumber,
        quantity: quantity,
        userEmail: currentUser.email,
        description: product.Description || product.description,
        price: product.Price || product.price,
        image: product.image
      });

      // Then update local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.partnumber === product.partnumber);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.partnumber === product.partnumber
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevItems, {
            partnumber: product.partnumber,
            description: product.Description || product.description,
            price: product.Price || product.price,
            quantity: quantity,
            image: product.image
          }];
        }
      });

      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (partnumber) => {
    if (!currentUser?.email) {
      throw new Error('User not authenticated');
    }

    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL}/api/cart/${partnumber}`, {
        params: { email: currentUser.email }
      });

      setCartItems(prevItems => prevItems.filter(item => item.partnumber !== partnumber));
      return { success: true, message: 'Item removed from cart successfully' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  };

  // Update item quantity
  const updateQuantity = async (partnumber, newQuantity) => {
    if (!currentUser?.email) {
      throw new Error('User not authenticated');
    }

    if (newQuantity <= 0) {
      return removeFromCart(partnumber);
    }

    try {
      await axios.put(`${process.env.REACT_APP_LOCAL}/api/cart/${partnumber}`, {
        quantity: newQuantity,
        email: currentUser.email
      });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.partnumber === partnumber
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      return { success: true, message: 'Quantity updated successfully' };
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw new Error('Failed to update quantity');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!currentUser?.email) {
      throw new Error('User not authenticated');
    }

    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        params: { email: currentUser.email }
      });

      setCartItems([]);
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Fetch cart items when user changes
  useEffect(() => {
    if (currentUser?.email) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [currentUser?.email]);

  const value = {
    cartItems,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

function App() {
  const [guestEmail, setGuestEmail] = useState("");
  const [quotationItems, setQuotationItems] = useState([]);
  const [saveditem, setSaveditem] = useState([]);
  const [productdetails, setProductDetails] = useState([]);

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
          item.id === productsaveditem.id
            ? {
                ...ProductExistSaved,
                quantity: ProductExistSaved.quantity + 1,
              }
            : item
        )
      );
    } else {
      setSaveditem([...saveditem, { ...productsaveditem, quantity: 1 }]);
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

  const handleCartClearance = () => {
    setQuotationItems([]);
  };

  return (
    <>     
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />

            <Routes>
              <Route
                path="/"
                element={
                  <Mainpage
                    handleAddProductDetails={handleAddProductDetails}
                    quotationItems={quotationItems}
                    handleAddQuotationProduct={handleAddQuotationProduct}
                  />
                }
              />
              <Route
                path="/shop"
                element={
                  <Shop
                    handleAddProductDetails={handleAddProductDetails}
                    quotationItems={quotationItems}
                    handleAddQuotationProduct={handleAddQuotationProduct}
                  />
                }
              />
              <Route
                path="/productdetails/:partnumber"
                element={
                  <Productdetails
                    handleAddProductDetails={handleAddProductDetails}
                    productdetails={productdetails}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <>
                    <ShoppingCartPage
                      handleRemoveSingleQuotationProduct={
                        handleRemoveSingleQuotationProduct
                      }
                      quotationItems={quotationItems}
                      handleAddQuotationProduct={handleAddQuotationProduct}
                      handleRemoveQuotationProduct={handleRemoveQuotationProduct}
                      handleCartClearance={handleCartClearance}
                    />
                  </>
                }
              />

              <Route
                path="/delivery"
                element={
                  <Delivery />
                }
              />
              <Route
                path="/form"
                element={<Form />}
              />
              <Route
                path="/review-order"
                element={
                  <ReviewOrder />
                }
              />
              <Route
                path="/search"
                element={
                  <SearchDisplay
                    handleAddProductDetails={handleAddProductDetails}
                  />
                }
              />
              <Route
                path="/checkout"
                element={
                  <Checkout />
                }
              />
             
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
                  />
                }
              />
              <Route
                path="/signin"
                element={<SignInPage setGuestEmail={setGuestEmail} />}
              />
              <Route path="/orderhistory" element={<OrderHistory />} />

              <Route path="/userprofile" element={<Userprofile />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route
                path="/saveditems"
                element={
                  <Saveditems
                    handleSavedItemsProduct={handleSavedItemsProduct}
                    saveditem={saveditem}
                    quotationItems={quotationItems}
                    handleRemoveSingleQuotationProduct={
                      handleRemoveSingleQuotationProduct
                    }
                  />
                }
              />
              <Route path="/Adminprofile" element={<AdminProfile />} />
              <Route path="/mainadmin" element={<Mainadmin  />} />
              <Route path="" element={<Ordereditems />} />
              <Route path="/order-history/:email" element={<AdminOrderHistory/>} />
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
     
              <Route path="/admin/auditlog" element={<AuditLogPage/>}  />
              <Route path="/admin/records" element={<AdminRecords />}   />
              <Route path='/admin/questions' element={<AdminQuestionsPage/>}  />

              {/**  Warehouse Admin  */}
              <Route path="/warehouse/dashboard" element={<Dashboard />}  />
              <Route path="" element={<Ordereditems />} />
              
              <Route path="/warehouseordertails/:orderId"  element={<WarehouseOrderDetails />}  />
              <Route path="/warehouseordereditems/:category"  element={<WarehouseOrderDetailsPage />}  />

              {/**   Warehouse Admin  */}
            

              {/** Finance Admin   */}
              <Route path="/finance/dashboard" element={<FinanceDashboard />}   />
              <Route path="/finaceordertails/:orderId"  element={<FinanceOrderViewPage />}  />
              <Route path="/finance/registeredusers"  element={<FinanceUsers />}  />
              <Route  path='/finance/orders' element={<FinanceOrders />} /> 

              {/** Finance Admin  */}
            </Routes>
           
          </BrowserRouter>
          <BackToTopButton />
        </CartProvider>
      </AuthProvider>
    
    </>
  );
}

export default App;
