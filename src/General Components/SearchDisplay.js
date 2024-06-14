import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import './searchdisplay.css';
import { LuCameraOff } from "react-icons/lu";
import ReactPaginate from 'react-paginate';
import { CiGrid41, CiGrid2H } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';

export default function SearchDisplay({ handleAddProductDetails }) {
  const location = useLocation();
 
 
  const { results: initialResults, term: initialTerm } = location.state || { results: [], term: '' };
  const [results, setResults] = useState(initialResults);
  const [categories, setCategories] = useState({});
  const [layoutMode, setLayoutMode] = useState('grid');
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 10;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(results.length / itemsPerPage);
  const [searchTerm, setSearchTerm] = useState(initialTerm || '');

  useEffect(() => {
    if (initialResults.length > 0) {
      const categoryCount = initialResults.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      setCategories(categoryCount);
    }
  }, [initialResults]);

  const handleCategoryClick = async (category) => {
    
    try {
      const response = await axios.get(`http://localhost:3001/api/search`, {
        params: {
          term: searchTerm,
          category
        }
      });
     
      setResults(response.data);
      setPageNumber(0); // Reset to first page
    } catch (error) {
      console.error('Error fetching category results:', error);
    }
  };

  return (
    <div className='searchdisplay_container'>
      <Link to='/Shop' className='arrowbacktocart'><IoIosArrowBack className='arrowback' />Back to Shopping</Link>
      <h2>Search Results for: {searchTerm}</h2>
      <div className='search_display_wrapper'>
      
        <div className='productdisplay_container_search'>
        
          <div className={`sub_productdisplay_container_search ${layoutMode}`}>
            
            <div className='btn_group'>
              <small>Sort by:</small>
              <p onClick={() => setLayoutMode('grid')}><CiGrid41 /></p>
              <p onClick={() => setLayoutMode('normal')}><CiGrid2H /></p>
            </div>
            
            {results.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
              
              <Link key={item.partnumber} className='mylink_search'
                to={`/Productdetails?name=${item.Description}&id=${item.partnumber}`} onClick={() => handleAddProductDetails(item)}>
                <p className='cameraoff_icon'><LuCameraOff /></p>
                <p className='prdt_partnumber'>{item.partnumber}</p>
                <p className='prdt_title'>{item.Description}</p>
                <p className='prdt_price'>USD {item.Price}</p>
                <div className="stock_status">
            <div className={`status_indicator ${item.quantity > 0 ? 'in_stock' : 'out_of_stock'}`}></div>
            <div className="in_out_stock" >{item.quantity > 0 ? 'In Stock' : 'Out of Stock'}</div>
            {item.quantity <= 0 && (
                    <div className="get_quote-search">
                      <p>Get a Quote</p>
                    </div>
                  )}
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
        </div>
      </div>
      <div className='sidebar'>
          <h3>Categories</h3>
          <ul>
            {Object.entries(categories).map(([category, count], index) => (
              <li key={index} onClick={() => handleCategoryClick(category)} style={{ cursor: 'pointer' }}>
                {category} ({count})
              </li>
            ))}
          </ul>
        </div>
      <NavigationBar />
    </div>
  );
}
