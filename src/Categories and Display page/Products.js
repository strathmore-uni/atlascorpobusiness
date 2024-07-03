import React, { useState, useEffect, useContext, useCallback } from "react";
import "./products.css";
import "./Categories Pages/filterelement.css";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { FaBars } from "react-icons/fa6";
import Categories from "./Categories";

export default function Products({ handleAddProductDetails, handleAddQuotationProduct }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);

  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");
  const itemsPerPage = 20;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const [loading, setLoading] = useState(false);

  // Fetch user email from local storage
  const userEmail = localStorage.getItem('userEmail');

  const fetchProducts = useCallback(async () => {
    if (!userEmail) {
      setError('No user email provided');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL}/api/myproducts?email=${userEmail}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      fetchProducts();
    }
  }, []);

 

 

  const toggleCategories = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  return (
    <div className="big_container" key={1}>
      <div className={`categories_sidebar ${isCategoriesVisible ? 'visible' : ''}`}>
        <Categories />
      </div>
      <div className="productdisplay_container">
        <FaBars className="fabars_categories" onClick={toggleCategories} />
        <div className={`sub_productdisplay_container ${layoutMode}`}>
          <small className="featuredprdts_length">
            Featured Products: {data.length}
          </small>
          <div className="btn_group">
            <small>Sort by:</small>
            <p onClick={() => setLayoutMode("grid")}>
              <CiGrid41 />
            </p>
            <p onClick={() => setLayoutMode("normal")}>
              <CiGrid2H />
            </p>
          </div>

          {data
            .slice(pagesVisited, pagesVisited + itemsPerPage)
            .map((product, index) => (
              <Link
                key={product.partnumber}
                className="mylink"
                onClick={() => !loading && handleAddProductDetails(product)}
              >
                <div key={product.partnumber}>
                  {loading ? (
                    <div className="loader">
                      <div className="wrapper">
                        <div className="circle"></div>
                        <div className="line-1"></div>
                        <div className="line-2"></div>
                        <div className="line-3"></div>
                        <div className="line-4"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img className="prdt_image" src={product.image} alt="" />
                      <p className="cameraoff_icon">
                        <LuCameraOff />
                      </p>
                      <p className="prdt_partnumber">{product.partnumber}</p>
                      <Link
                        key={product.partnumber}
                        to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
                        onClick={() => !loading && handleAddProductDetails(product)}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <p className="prdt_title">{product.Description}</p>
                      </Link>
                      <p className="prdt_price">${product.Price}</p>
                      <div className="stock_status">
                        <div
                          className={`status_indicator ${product.quantity > 0 ? "in_stock" : "out_of_stock"}`}
                        ></div>
                        <div className="in_out_stock">
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                        {product.quantity <= 0 && (
                          <div className="get_quote" onClick={() => handleAddQuotationProduct(product)}>
                            <p> Get a Quote</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={(e) => setPageNumber(e.selected)}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      </div>
    </div>
  );
}
