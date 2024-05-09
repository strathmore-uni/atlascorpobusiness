import React, {useState}from "react";
import "./products.css";
import './Categories Pages/big.css';
import ReactPaginate from "react-paginate";


export default function Products({ fulldatas }) {

  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState('grid');

  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(fulldatas.length / itemsPerPage);
  return (
    <div className="products_container">
   <div className='productdisplay_container' >

<div className={`productdisplay_container ${layoutMode}`}>
     <div className='btn_group' >
     <button   onClick={() => setLayoutMode('grid')}>Grid</button>
     <button onClick={() => setLayoutMode('normal')}>Normal</button>
</div>
       {fulldatas.slice(pagesVisited, pagesVisited + itemsPerPage).map((product, index) => (
         <div key={index} className="single_product">
           <img src={product.image} alt='' className='myimages' />
         </div>
       ))}
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
  );
}
