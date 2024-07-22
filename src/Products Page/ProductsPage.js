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

  const categoryDescriptions = {
    Filterelement: `Our genuine Air Filters trap particles down to 3 microns, preventing 99.9% of contaminants from reaching your compressor elements. These filters were developed on the most important parameters for compressor applications: maximum dust holding capacity, high separation efficiency and minimized restriction.

Their air filter sealing is unique, as is the special filtration paper: this was designed with special indentations that trap foreign materials without impeding incoming air flow, maximizing your process efficiency!`,
    Oilfilterelement:
      "Oil filter elements are crucial for maintaining the purity of oil in your systems, preventing damage and ensuring smooth operation.",
    Servkit:
      "Service kits contain essential components for maintaining and servicing your equipment, ensuring reliability and performance.",
    Autodrainvalve:
      "Auto drain valves automatically remove accumulated water and other liquids from your system, preventing corrosion and damage.",
    Contractor:
      "Contractors are robust and reliable components used in various applications to ensure seamless and efficient operations.",
    Overhaulkit:
      "Overhaul kits include all necessary parts for a complete overhaul of your equipment, restoring it to optimal condition.",
    Silencerkit:
      "Silencer kits are designed to reduce noise levels in your machinery, providing a quieter and more comfortable working environment.",
    Maintenancekit:
      "Maintenance kits contain all the necessary components for routine maintenance, ensuring your equipment runs smoothly and efficiently.",
    Bearingkits:
      "Bearing kits include bearings and related components for various applications, ensuring smooth and reliable operation.",
    Kitpm8k:
      "KIT PM8K RS is a comprehensive kit for the PM8K RS system, including all necessary parts for maintenance and repair.",
    Energyrecovery:
      "Energy recovery systems capture and reuse energy that would otherwise be lost, improving efficiency and reducing costs.",
    blowerpowerckt:
      "Blower power circuits are essential for powering blowers, ensuring efficient and reliable operation in various applications.",
    blowerbearkingkit:
      "Blower bearing kits include all necessary bearings and components for maintaining and repairing blower systems.",
    Prevmain:
      "Preventive maintenance kits include all necessary components for regular maintenance, ensuring the longevity and reliability of your equipment.",
    Hrkit:
      "HR kits contain all necessary parts for maintaining and repairing HR systems, ensuring optimal performance and longevity.",
    kitfilterdd:
      "Kit Filter DD includes all necessary filter elements and components for maintaining DD filter systems.",
    kitfilterpd:
      "Kit Filter PD includes all necessary filter elements and components for maintaining PD filter systems.",
    kitfilterddp:
      "Kit Filter DDP includes all necessary filter elements and components for maintaining DDP filter systems.",
    kitfilterud:
      "Kit Filter UD includes all necessary filter elements and components for maintaining UD filter systems.",
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
    const inStock = !filters.inStock || product.quantity > 0;
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
        <p style={{ color: "#0078a1", textDecoration: "none", position: "absolute", left: "7.2rem", top: "-1rem", width: "10rem" }}>
          &nbsp;{category}&nbsp;
        </p>
      </div>
      <div className="productdisplay_container">
        <p className="category_p">&nbsp;{category}&nbsp;</p>
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
              <p className="category-description">
              {categoryDescriptions[category] || "Browse our selection of products."}
            </p>
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
                      <p className="prdt_partnumber">{product.partnumber}</p>
                     <Link key={product.partnumber}
                 style={{color:'black',textDecoration:'none'}}
                    to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
                    onClick={() =>
                      handleAddProductDetails(product)
                    }><p className="prdt_title">{product.Description}</p></Link> 
                      <p className="prdt_price">${product.Price}</p>
                      <div className="stock_status">
                        <div
                          className={`status_indicator ${product.quantity > 0 ? "in_stock" : "out_of_stock"}`}
                        ></div>
                        <div className="in_out_stock">
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                        {product.quantity <= 0 && (
                          <div className="get_quote_productpage" onClick={() =>
                            handleAddProduct(product)
                          } >
                            <p><GrCart className="cart_productpage"  /></p>
                          </div>
                        )}
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
