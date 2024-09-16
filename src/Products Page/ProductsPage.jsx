import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { LuCameraOff } from "react-icons/lu";
import ReactPaginate from "react-paginate";
import NavigationBar from "../General Components/NavigationBar";
import Footer from "../General Components/Footer";
import "../Categories and Display page/products.css";
import "../Categories and Display page/Categories Pages/filterelement.css";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { GrCart } from "react-icons/gr";

const ProductsPage = ({ handleAddProductDetails,handleAddProduct, cartItems }) => {
  const { category } = useParams();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");
  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filters, setFilters] = useState({ priceRange: [0, 1000], inStock: false });

  const handleAddToCart = async (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }
  

  
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        partnumber: product.partnumber,
        quantity: 1,
        userEmail: currentUser.email, // Ensure userEmail is correctly set
        description: product.Description, // Include description
        price: product.Price // Include price
      });
      handleAddProduct(product);
      setNotificationMessage(`${product.Description} has been added to the cart.`);
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!currentUser || !currentUser.email) {
        setError('No user email provided');
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/products/${category}`,
          {
            params: { email: currentUser.email },
          }
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchProductsByCategory();
  }, [category]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sortedProducts = products.sort((a, b) => {
    if (sortOption === "priceLowToHigh") {
      return a.Price - b.Price;
    } else if (sortOption === "priceHighToLow") {
      return b.Price - a.Price;
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter((product) => {
    const inPriceRange =
      product.Price >= filters.priceRange[0] && product.Price <= filters.priceRange[1];
    const inStock = !filters.inStock || product.stock_quantity > 0;
    return inPriceRange && inStock;
  });

  return (
    <div className="big_container">
     
      <div className="products_routes">
        <Link to="/" style={{ color: "#0078a1", textDecoration: "none" }}>
          Home &nbsp;/
        </Link>
        <Link to="/Shop" style={{ color: "#0078a1", textDecoration: "none" }}>
          &nbsp;Shop &nbsp;/
        </Link>
        <p style={{ color: "#0078a1", textDecoration: "none", position: "absolute", left: "7.2rem", top: "0rem", width: "10rem" }}>
          &nbsp;{category}&nbsp;
        </p>
      </div>
      <div className="productdisplay_container">
   
        {isLoading ? (
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        ) : (
          <>
            
            {error && <div className="error-message">{error} <button onClick={() => window.location.reload()}>Retry</button></div>}
            <div className="sort-filter-container">
              <div className="sort-options">
                <label htmlFor="sort">Sort by: </label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                  <option value="">Select</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </select>
              </div>
              <div className="filter-options">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                  />
                  In Stock
                </label>
              </div>
            </div>
          
            <div className={`sub_productdisplay_container ${layoutMode}`}>
         <small className="featuredprdts_length">
                Results {filteredProducts.length}
              </small>
              {filteredProducts
                .slice(pagesVisited, pagesVisited + itemsPerPage)
                .map((product, index) => (
                  <Link
                    key={product.partnumber}
                    className="mylink"
                  
                  >
                    <div key={product.partnumber}>
                      {product.image ? (
                        <img className="prdt_image" src={product.image} alt="" />
                      ) : (
                        <p className="cameraoff_icon">
                          <LuCameraOff />
                        </p>
                      )}
                       <div className='the_prdt_details' >
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
                          handleAddToCart(product)
                        } >
                          <p><GrCart className="cart_productpage"  /></p>
                        </div>
                   
                    </div>
                    </div>
                    </div>
                  </Link>
                ))}
              {filteredProducts.length > 0 && (
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
              )}
            </div>
          </>
        )}
        <div className="filterelement_footer">
          <Footer />
        </div>
      </div>
      <NavigationBar cartItems={cartItems} />
    </div>
  );
};

export default ProductsPage;
