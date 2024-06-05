import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";
import Categories from '../Categories and Display page/Categories';
import { CiGrid41, CiGrid2H } from "react-icons/ci";
import ReactPaginate from 'react-paginate';
import NavigationBar from '../General Components/NavigationBar';
import Footer from '../General Components/Footer';
import { ProductsContext } from '../MainOpeningpage/ProductsContext';

const ProductsPage = ({ handleAddProductDetails, cartItems }) => {
  const { category } = useParams();
  const { selectedCountry } = useContext(ProductsContext);

  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");
  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const [isLoading, setIsLoading] = useState(true);


{/**
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
     
        const response = await axios.get(`http://localhost:3001/api/products/${category}`);
  
        setProducts(response.data);
           setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
 
    fetchProductsByCategory();
  }, [category]);


*/}


  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products`, {
          params: { category, country: selectedCountry }
        });
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByCategory();
  }, [category, selectedCountry]);

  return (
    <div>
      <div className="big_container" key={1}>
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
            &nbsp;Filter Element &nbsp;
          </p>
        </div>

        <div className="productdisplay_container">
          <div className={`sub_productdisplay_container ${layoutMode}`}>
            <small className="featuredprdts_length">
              {products.length} Results
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

            {products
              .slice(pagesVisited, pagesVisited + itemsPerPage)
              .map((product) => (
                <Link
                  key={product.partnumber}
                  className="mylink"
                  to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
                  onClick={() => !isLoading && handleAddProductDetails(product)}
                >
                  <div key={product.id}>
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
                        <img className="prdt_image" src={product.image} alt="" />
                        <p className="cameraoff_icon">
                          <LuCameraOff />
                        </p>
                        <p className="prdt_partnumber">{product.name}</p>
                        <p className="prdt_title">{product.description}</p>
                        <p className="prdt_price">${product.price}</p>
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

       {/** <Categories />*/} 

        <NavigationBar cartItems={cartItems} />
        <div className="filterelement_footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
