import React, { useState, useEffect, useCallback } from "react";
import "./products.css";
import "./Categories Pages/filterelement.css";
import { Link, useNavigate } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";
import { FaBars } from "react-icons/fa6";
import Categories from "./Categories";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { GrCart } from "react-icons/gr";
export default function Products({ handleAddProductDetails, handleAddQuotationProduct }) {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Initially show 20 products
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState("grid");
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

  return (
    <div className="big_container" key={1}>
      {isLoading ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="productdisplay_container">
            <FaBars className="fabars_categories" onClick={toggleCategories} />
            <div className={`productdisplay_container_shop ${layoutMode}`}>
              <small className="featuredprdts_length">
                Featured Products: {data.length}
              </small>
              {data.slice(0, visibleCount).map((product, index) => (
                <Link
                  key={product.partnumber}
                  className="mylink_shop"
                  onClick={() => handleAddProductDetails(product)}
                >
                  <div key={product.partnumber}>
                    {product.image ? (
                      <img className="prdt_image_shop" src={product.image} alt="" />
                    ) : (
                      <p className="cameraoff_icon">
                        <LuCameraOff />
                      </p>
                    )}
                    <p className="prdt_partnumber">{product.partnumber}</p>
                    <Link
                      key={product.partnumber}
                      to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
                      onClick={() => handleAddProductDetails(product)}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <p className="prdt_title">{product.Description}</p>
                    </Link>
                    <p className="prdt_price">${product.Price}</p>
                    <div className="stock_status">
                      <div
                        className={`status_indicator ${product.Stock > 0 ? "in_stock" : "out_of_stock"}`}
                      ></div>
                      <div className="in_out_stock">
                        {product.Stock > 0 ? "In Stock" : "Out of Stock"}
                      </div>
                    
                        <div className="get_quote_productpage" onClick={() =>
                          handleAddProduct(product)
                        } >
                          <p><GrCart className="cart_productpage"  /></p>
                        </div>
                   
                    </div>
                  </div>
                </Link>
              ))}
               <p className="showing_no_items">Showing {visibleCount} of {data.length}</p> 
              {visibleCount < data.length && (
                <button className="show-more-button" onClick={loadMoreProducts}>
                  Show More
                </button>
                
              )}
             
            </div>
          </div>
          <div className={`categories_sidebar ${isCategoriesVisible ? 'visible' : ''}`}>
            <Categories />
          </div>
        </>
      )}
    </div>
  );
}
