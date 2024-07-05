import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LuCameraOff } from 'react-icons/lu';
import { CiGrid41, CiGrid2H } from 'react-icons/ci';
import ReactPaginate from 'react-paginate';
import NavigationBar from '../General Components/NavigationBar';
import Footer from '../General Components/Footer';
import ProductCategories from './ProductCategories';
import '../Categories and Display page/products.css';
import '../Categories and Display page/Categories Pages/filterelement.css';

const ProductsPage = ({ handleAddProductDetails, cartItems }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");
  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        setError('No user email provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_LOCAL}/api/products/${category}?email=${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products by category");
        }
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  return (
    <div className="big_container">
      <NavigationBar cartItems={cartItems} />
    
        <div className="shop_routes">
          <Link to="/" style={{ color: "#0078a1", textDecoration: "none" }}>
            Home &nbsp;/
          </Link>
          <Link to="/Shop" style={{ color: "#0078a1", textDecoration: "none" }}>
            &nbsp;Shop &nbsp;/
          </Link>
          <p
            style={{
              color: "#0078a1",
              textDecoration: "none",
              position: "absolute",
              left: "7.2rem",
              top: "-1rem",
              width: "10rem",
            }}
          >
            &nbsp;{category}&nbsp;
          </p>
        </div>

        <div className="productdisplay_container">
          <div className={`sub_productdisplay_container ${layoutMode}`}>
            <small className="featuredprdts_length">
              Featured Products: {products.length}
            </small>

            {products.slice(pagesVisited, pagesVisited + itemsPerPage).map((product, index) => (
              <Link
                key={product.partnumber}
                className="mylink"
                to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
                onClick={() => !isLoading && handleAddProductDetails(product)}
              >
                <div key={product.partnumber}>
                  {isLoading ? (
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
                      {product.image ? (
                        <img className="prdt_image" src={product.image} alt="" />
                      ) : (
                        <p className="cameraoff_icon">
                          <LuCameraOff />
                        </p>
                      )}
                      <p className="prdt_partnumber">{product.partnumber}</p>
                      <p className="prdt_title">{product.Description}</p>
                      <p className="prdt_price">${product.Price}</p>
                      <div className="stock_status">
                        <div
                          className={`status_indicator ${
                            product.quantity > 0 ? "in_stock" : "out_of_stock"
                          }`}
                        ></div>
                        <div className="in_out_stock">
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                        {product.quantity <= 0 && (
                          <div className="get_quote_productpage">
                            <p>Get a Quote</p>
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
          <div className='filterelement_footer'>
      <Footer />
      </div>
        </div>

        <ProductCategories setProducts={setProducts} />
      
      
    </div>
  );
};

export default ProductsPage;
