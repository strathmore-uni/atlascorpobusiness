import React,{useState} from 'react'
import './pagination.css'
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";


export default function Pagination( fulldatas) {
    const [isGridMode, setGridMode] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const totalItems = 60;
  
   
  
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const renderPagination = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button key={i} onClick={() => handlePageChange(i)}>
            {i}
          </button>
        );
      }
      return <div className="pagination_container">{pages}</div>;
    };
  
    const renderItems = () => {
      const items = [];
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      const color = currentPage === 1 ? 'green' : currentPage === 2 ? 'blue' : 'red';
      for (let i = startIndex; i < endIndex; i++) {
        items.push(<div key={i} className={`single_product ${color}`}></div>);
      }
      return items;

      
    };
 
  
    return (
      <div className="big_container">
        
        <div className="productdisplay_container" style={isGridMode ? null : { width: '55rem' }}>
            
        <div className="button_container">
        <p className='sort_p' >Sort By: <p   className={`layout_option1 ${isGridMode ? 'active' : ''}`} 
            onClick={() => setGridMode(true)}><CiGrid41 /></p>
            
            <p className={`layout_option2 ${isGridMode ? 'active' : ''}`} 
            onClick={() => setGridMode(false)} ><CiGrid2H /> </p>  </p>
        
        </div>
          {isGridMode ? (
            <div className="products_grid">{renderItems()}</div>
          ) : (
           
            <div className="single_product_container">{renderItems()}</div>
           
          )}
          {renderPagination()}
        </div>
       
      </div>
    );
}
