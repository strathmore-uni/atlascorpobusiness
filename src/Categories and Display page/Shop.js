import React from "react";
import NavigationBar from "../General Components/NavigationBar";
import Categories from "./Categories";
import Products from "./Products";
import Footer from "../General Components/Footer";
import "./shop.css";

export default function Shop({
  handleAddProductDetails,
  fulldatas,
  cartItems,
  datas,
  handleAddQuotationProduct,
}) {
  return (
    <div className="shop-page-container">
     
  
      <div className="container_shop">
        <div className="shop_routes">
          <a href="/" style={{ color: "#0078a1", textDecoration: "none" }}>
            Home/  &nbsp;
          </a>
          <p style={{ color: "#0078a1", textDecoration: "none", position: "absolute", left: "3rem", top: "-.4rem" }}>
            &nbsp;Shop &nbsp;
          </p>
        </div>
        <div className="shop-product-container">
          <Products
            handleAddProductDetails={handleAddProductDetails}
            handleAddQuotationProduct={handleAddQuotationProduct}
          />
        </div>
      </div>
      <div className="shop_footer">
        <Footer  />
      </div>
      
      <NavigationBar cartItems={cartItems} />
    </div>
  );
}
