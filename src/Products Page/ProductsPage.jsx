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
    energyrecovery:
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
  const categoryBackgroundImages = {
    Filterelement: 'url(https://api.commercecloud-power-technique.atlascopco.com/medias/serviceTips.jpg?context=bWFzdGVyfGltYWdlc3w4NjIyMXxpbWFnZS9qcGVnfGFEWmhMMmcwTUM4NU1EZzROVEE1TlRjMU1UazRMM05sY25acFkyVlVhWEJ6TG1wd1p3fGViYjU5NGEwYzRiZmJhZjExOWExMzE1NzE3YzNjZGYyMjJiNzVhMjJlOGM0ZTIzYzczNWM5ZjIxOTYxNDlhOGQ)',
    Oilfilterelement: 'url(https://api.commercecloud-power-technique.atlascopco.com/medias/serviceTips.jpg?context=bWFzdGVyfGltYWdlc3w4NjIyMXxpbWFnZS9qcGVnfGFEWmhMMmcwTUM4NU1EZzROVEE1TlRjMU1UazRMM05sY25acFkyVlVhWEJ6TG1wd1p3fGViYjU5NGEwYzRiZmJhZjExOWExMzE1NzE3YzNjZGYyMjJiNzVhMjJlOGM0ZTIzYzczNWM5ZjIxOTYxNDlhOGQ)',
    Servkit: 'url(https://api.commercecloud-power-technique.atlascopco.com/medias/serviceTips.jpg?context=bWFzdGVyfGltYWdlc3w4NjIyMXxpbWFnZS9qcGVnfGFEWmhMMmcwTUM4NU1EZzROVEE1TlRjMU1UazRMM05sY25acFkyVlVhWEJ6TG1wd1p3fGViYjU5NGEwYzRiZmJhZjExOWExMzE1NzE3YzNjZGYyMjJiNzVhMjJlOGM0ZTIzYzczNWM5ZjIxOTYxNDlhOGQ)',
    Autodrainvalve: 'url(https://api.commercecloud-power-technique.atlascopco.com/medias/serviceTips.jpg?context=bWFzdGVyfGltYWdlc3w4NjIyMXxpbWFnZS9qcGVnfGFEWmhMMmcwTUM4NU1EZzROVEE1TlRjMU1UazRMM05sY25acFkyVlVhWEJ6TG1wd1p3fGViYjU5NGEwYzRiZmJhZjExOWExMzE1NzE3YzNjZGYyMjJiNzVhMjJlOGM0ZTIzYzczNWM5ZjIxOTYxNDlhOGQ)',
    Contractor: 'url(/path/to/contractor-image.jpg)',
    Overhaulkit: 'url(/path/to/overhaulkit-image.jpg)',
    Silencerkit: 'url(/path/to/silencerkit-image.jpg)',
    Maintenancekit: 'url(/path/to/maintenancekit-image.jpg)',
    Bearingkits: 'url(/path/to/bearingkits-image.jpg)',
    Kitpm8k: 'url(/path/to/kitpm8k-image.jpg)',
    energyrecovery: 'url(/path/to/energyrecovery-image.jpg)',
    blowerpowerckt: 'url(/path/to/blowerpowerckt-image.jpg)',
    blowerbearkingkit: 'url(/path/to/blowerbearkingkit-image.jpg)',
    Prevmain: 'url(/path/to/prevmain-image.jpg)',
    Hrkit: 'url(/path/to/hrkit-image.jpg)',
    kitfilterdd: 'url(/path/to/kitfilterdd-image.jpg)',
    kitfilterpd: 'url(/path/to/kitfilterpd-image.jpg)',
    kitfilterddp: 'url(/path/to/kitfilterddp-image.jpg)',
    kitfilterud: 'url(/path/to/kitfilterud-image.jpg)',
  };
  const categoryBackgroundStyle = {
    backgroundImage: categoryBackgroundImages[category] || 'none',
    backgroundSize: 'cover',
    position:'relative',
    backgroundPosition: 'center',
    height: '20rem',
    display: 'flex',
    alignItems: 'center',
    top:'-9rem',
    justifyContent: 'center',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    padding: '1rem',
    marginBottom: '0rem'
  };
  const handleAddToCart = async (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }
  
    console.log('User Email:', currentUser.email); // Debugging
    console.log('Product Part Number:', product.partnumber); // Debugging
  
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
              <p className="category-description"  style={categoryBackgroundStyle} >
                {category}
              {categoryDescriptions[category] || "Browse our selection of products."}
              <small className="featuredprdts_length">
                Results {filteredProducts.length}
              </small>
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
                          className={`status_indicator ${product.Stock > 0 ? "in_stock" : "out_of_stock"}`}
                        ></div>
                        <div className="in_out_stock">
                          {product.Stock > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                        {product.Stock <= 0 && (
                          <div className="get_quote_productpage" onClick={() =>
                            handleAddToCart(product)
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
