import React, { useState, useEffect, useCallback } from "react";
// import "./products.css";
// import "./Categories Pages/filterelement.css";
import { Link, useNavigate } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";
import { FaBars } from "react-icons/fa6";
import Categories from "./Categories";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useCart } from "../App";
import { GrCart } from "react-icons/gr";

export default function Products({ handleAddProductDetails, handleAddQuotationProduct }) {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Initially show 20 products
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState("grid");
  const navigate = useNavigate();
  const [notificationMessage, setNotificationMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setError('No user email provided');
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_LOCAL}/api/myproducts?email=${currentUser.email}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategories = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  const loadMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 20); // Load 20 more products
  };

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    
    try {
      await addToCart(product, 1);
      setNotificationMessage(`${product.Description} has been added to the cart.`);
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotificationMessage('Failed to add item to cart. Please try again.');
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    }
  };

  return (
    <div className="relative" key={1}>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-8">{error}</div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none mr-2"
              onClick={toggleCategories}
              aria-label="Open categories menu"
            >
              <FaBars className="text-2xl text-blue-800" />
            </button>
            <span className="text-gray-700 font-medium">Featured Products: {data.length}</span>
          </div>
          {notificationMessage && (
            <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow z-50 animate-fade-in">
              {notificationMessage}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.slice(0, visibleCount).map((product) => (
              <div
                key={product.partnumber}
                className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col h-full group cursor-pointer"
                onClick={() => handleAddProductDetails(product)}
              >
                <Link
                  to={`/productdetails/${product.partnumber}`}
                  onClick={e => { e.stopPropagation(); handleAddProductDetails(product); }}
                  className="block"
                >
                  {product.image ? (
                    <img className="w-full h-40 object-cover rounded-t-xl group-hover:scale-105 transition" src={product.image} alt={product.Description} />
                  ) : (
                    <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-t-xl text-4xl text-gray-400">
                      <LuCameraOff />
                    </div>
                  )}
                </Link>
                <div className="flex-1 flex flex-col p-4">
                  <p className="text-xs text-gray-400 mb-1">{product.partnumber}</p>
                  <Link
                    to={`/productdetails/${product.partnumber}`}
                    onClick={e => { e.stopPropagation(); handleAddProductDetails(product); }}
                    className="font-semibold text-gray-800 hover:text-blue-700 mb-1 truncate"
                  >
                    {product.Description}
                  </Link>
                  <p className="text-lg font-bold text-blue-800 mb-2">${product.Price}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className={`w-3 h-3 rounded-full ${product.Stock > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span className="text-xs font-medium text-gray-600">{product.Stock > 0 ? "In Stock" : "Out of Stock"}</span>
                    <button
                      className="ml-auto flex items-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition"
                      onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                      disabled={product.Stock <= 0}
                    >
                      <GrCart className="text-base" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <p className="text-gray-500 text-sm mr-4">Showing {Math.min(visibleCount, data.length)} of {data.length}</p>
            {visibleCount < data.length && (
              <button
                className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition"
                onClick={loadMoreProducts}
              >
                Show More
              </button>
            )}
          </div>
          {/* Categories Sidebar (Mobile/Tablet) */}
          {isCategoriesVisible && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex">
              <div className="bg-white w-72 max-w-full h-full shadow-lg p-4 overflow-y-auto animate-slide-in-left">
                <Categories />
              </div>
              <div className="flex-1" onClick={toggleCategories}></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
