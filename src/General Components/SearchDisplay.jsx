import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import './searchdisplay.css';
import { LuCameraOff } from "react-icons/lu";
import ReactPaginate from 'react-paginate';
import { CiGrid41, CiGrid2H } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';
import Footer from './Footer';
import { GrCart } from "react-icons/gr";
import { useAuth } from '../MainOpeningpage/AuthContext';

export default function SearchDisplay({ handleAddProductDetails,handleAddProduct }) {
  const location = useLocation();
  const { results: initialResults, term: initialTerm } = location.state || { results: [], term: '' };
  const [results, setResults] = useState(initialResults);
  const [categories, setCategories] = useState({});
  const [layoutMode, setLayoutMode] = useState('grid');
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 20;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(results.length / itemsPerPage);
  const [searchTerm, setSearchTerm] = useState(initialTerm || '');
  const { currentUser } = useAuth();
  useEffect(() => {
    if (initialResults.length > 0) {
      const categoryCount = initialResults.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      setCategories(categoryCount);
    }
  }, [initialResults]);
  const handleAddToCart = async (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }
  
    console.log('User Email:', currentUser.email); // Debugging
    console.log('Product Part Number:', product.partnumber); // Debugging
  
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/singlecart`, {
        partnumber: product.partnumber,
        quantity: 1,
        userEmail: currentUser.email, // Ensure userEmail is correctly set
        description: product.Description, // Include description
        price: product.Price, // Include price
    
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
  
  const handleCategoryClick = async (category) => {
    try {
      if (!currentUser) {
        console.error('No user email provided');
        return;
      }
  
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/search`, {
        params: {
          term: searchTerm,  
          category,
          email:  currentUser.email  
        }
      });
  
      setResults(response.data);
      setPageNumber(0); 
    } catch (error) {
      console.error('Error fetching category results:', error);
    }
  };
  

  return (
    <div className='searchdisplay_container'>
      
      <Link to='/Shop' className='arrowbacktocart_search'><IoIosArrowBack className='arrowback' />Back to Shopping</Link>
      <h2>Search Results for: {searchTerm}</h2>
      <div className='search_display_wrapper'>
        <div className='productdisplay_container_search'>
          <div className={`sub_productdisplay_container_search ${layoutMode}`}>
         
            {results.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
              <Link key={item.partnumber} className='mylink_search'
                to={`/Productdetails?name=${item.Description}&id=${item.partnumber}`} onClick={() => handleAddProductDetails(item)}>
                   {item.image ? (
            <img className="prdt_image" src={item.image} alt="" />
          ) : (
            <p className="cameraoff_icon">
              <LuCameraOff />
            </p>
          )}
                <p className='prdt_partnumber'>{item.partnumber}</p>
                <p className='prdt_title'>{item.Description}</p>
                <p className='prdt_price'>${item.Price}</p>
                <div className="stock_status">
                  <div className={`status_indicator ${item.quantity > 0 ? 'in_stock' : 'out_of_stock'}`}></div>
                  <div className="in_out_stock">{item.quantity > 0 ? 'In Stock' : 'Out of Stock'}</div>
                  <div className="get_quote_productpage" onClick={() =>
                          handleAddToCart(item)
                        } >
                          <p><GrCart className="cart_productpage"  /></p>
                        </div>
                </div>
              </Link>
            ))}
            <small className='featuredprdts_length'>{results.length} Results</small>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={(e) => setPageNumber(e.selected)}
              containerClassName={'pagination'}
              previousLinkClassName={'pagination__link'}
              nextLinkClassName={'pagination__link'}
              disabledClassName={'pagination__link--disabled'}
              activeClassName={'pagination__link--active'}
            />
          </div>
          <div className='search_footer' >
        <Footer />
      </div>
        </div>
        <div className='sidebar_search'>
          <h3>Categories</h3>
          <ul>
            {Object.entries(categories).map(([category, count], index) => (
              <li key={index} onClick={() => handleCategoryClick(category)} style={{ cursor: 'pointer' }}>
                {category} ({count})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <NavigationBar />
      
    </div>
  );
}
