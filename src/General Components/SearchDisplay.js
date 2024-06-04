import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import './searchdisplay.css';
import { LuCameraOff } from "react-icons/lu";
import ReactPaginate from 'react-paginate';
import { CiGrid41, CiGrid2H } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";


export default function SearchDisplay({ handleAddProductDetails }) {
  const location = useLocation();
  const { results } = location.state || { results: [] };
  const [layoutMode, setLayoutMode] = useState('grid');
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 10;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(results.length / itemsPerPage);



  return (
    <div className='searchdisplay_container'>
      <Link to='/Shop' className='arrowbacktocart'><IoIosArrowBack />Back to Shopping</Link>
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
                to={`/Productdetails?name=${item.Description}?id=${item.partnumber}`} onClick={() => handleAddProductDetails(item)}>
                <p className='cameraoff_icon'><LuCameraOff /></p>
                <p className='prdt_partnumber'>{item.partnumber}</p>
                <p className='prdt_title'>{item.Description}</p>
                <p className='prdt_category'>{item.category}</p>
                <p className='prdt_price'>USD {item.Price}</p>
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
                    <NavigationBar />
                  </div>
                );
              }
              
