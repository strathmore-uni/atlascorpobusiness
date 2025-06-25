import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuCameraOff } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
// import "./shoppingcartpage.css"; // Removed old CSS
import NavigationBar from "../General Components/NavigationBar";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useCart } from "../App";
import Footer from "../General Components/Footer";

export default function ShoppingCartPage({
  handleRemoveSingleQuotationProduct,
  quotationItems,
  handleAddQuotationProduct,
  handleRemoveQuotationProduct,
  handleCartClearance,
}) {
  const [quickOrderCode, setQuickOrderCode] = useState('');
  const [quickOrderQty, setQuickOrderQty] = useState(1);
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, isLoading, error } = useCart();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = getCartTotal();
    setTotalPrice(total.toFixed(2));
  }, [cartItems, getCartTotal]);

  const handleCheckout = () => {
    navigate('/review-order', { state: { cartItems, totalPrice } });
  };

  const handleQuickOrderSubmit = async () => {
    if (!quickOrderCode || quickOrderQty <= 0) {
      alert("Please enter a valid product code and quantity.");
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/products/partnumber/${quickOrderCode}`);
      const product = response.data;
      if (product) {
        // Add to cart using the context
        await addToCart({ ...product, quantity: quickOrderQty });
        setQuickOrderCode("");
        setQuickOrderQty(1);
      } else {
        alert("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product. Please try again.");
    }
  };

  const handleRemoveFromCart = async (partnumber) => {
    try {
      await removeFromCart(partnumber);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleClearCartClick = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleIncreaseQuantity = async (partnumber) => {
    const currentItem = cartItems.find(item => item.partnumber === partnumber);
    if (currentItem) {
      try {
        await updateQuantity(partnumber, currentItem.quantity + 1);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const handleDecreaseQuantity = async (partnumber) => {
    const currentItem = cartItems.find(item => item.partnumber === partnumber);
    if (currentItem && currentItem.quantity > 1) {
      try {
        await updateQuantity(partnumber, currentItem.quantity - 1);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading cart...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Cart</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-blue-700 mb-6 space-x-2" aria-label="Breadcrumb">
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:underline">Shop</a>
          <span>/</span>
          <span className="font-semibold">Cart</span>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <section className="md:col-span-2 bg-white rounded-2xl shadow p-4 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-900">Cart Items</h2>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition"
                onClick={handleClearCartClick}
              >
                <RiDeleteBinLine className="text-lg" /> Clear Cart
              </button>
            </div>
            <hr className="mb-4" />
            <div className="hidden md:grid grid-cols-6 gap-4 text-gray-500 font-semibold mb-2">
              <span>Description</span>
              <span>Part Number</span>
              <span>Net Price</span>
              <span>Total</span>
              <span>Qty</span>
              <span>Remove</span>
            </div>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <LuCameraOff className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started</p>
                <Link 
                  to="/shop"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.partnumber} className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center border-b py-4 last:border-b-0">
                  {/* Image */}
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                    {item.image ? (
                      <img className="w-full h-full object-cover rounded" src={item.image} alt={item.description} />
                    ) : (
                      <LuCameraOff className="text-3xl text-gray-400" />
                    )}
                  </div>
                  {/* Description */}
                  <div className="md:col-span-1 w-full text-gray-800 font-medium">{item.description}</div>
                  {/* Part Number */}
                  <div className="md:col-span-1 w-full text-xs text-gray-500 font-mono">{item.partnumber}</div>
                  {/* Net Price */}
                  <div className="md:col-span-1 w-full text-blue-800 font-bold">${item.price}</div>
                  {/* Total */}
                  <div className="md:col-span-1 w-full text-blue-900 font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  {/* Qty Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                      onClick={() => handleDecreaseQuantity(item.partnumber)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-2 font-semibold">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                      onClick={() => handleIncreaseQuantity(item.partnumber)}
                    >
                      +
                    </button>
                  </div>
                  {/* Remove Button */}
                  <div className="md:col-span-1 w-full flex justify-center">
                    <button
                      className="text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleRemoveFromCart(item.partnumber)}
                    >
                      <RiDeleteBinLine className="text-lg" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Order Summary */}
          <section className="bg-white rounded-2xl shadow p-6 h-fit">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Order Summary</h3>
            
            {/* Quick Order */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Quick Order</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Part Number"
                  value={quickOrderCode}
                  onChange={(e) => setQuickOrderCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quickOrderQty}
                  onChange={(e) => setQuickOrderQty(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleQuickOrderSubmit}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cartItems.length})</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold text-blue-900">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="block w-full text-center mt-3 px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
