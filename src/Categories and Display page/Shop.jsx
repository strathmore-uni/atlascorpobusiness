import React from "react";
import NavigationBar from "../General Components/NavigationBar";
import Categories from "./Categories";
import Products from "./Products";
import Footer from "../General Components/Footer";
// import "./shop.css"; // Removed old CSS

export default function Shop({
  handleAddProductDetails,
  fulldatas,
  cartItems,
  datas,
  handleAddQuotationProduct,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar cartItems={cartItems} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-blue-700 mb-6 space-x-2" aria-label="Breadcrumb">
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <span className="font-semibold">Shop</span>
        </nav>
        {/* Products Section */}
        <section className="bg-white rounded-2xl shadow p-4 md:p-8">
          <Products
            handleAddProductDetails={handleAddProductDetails}
            handleAddQuotationProduct={handleAddQuotationProduct}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
