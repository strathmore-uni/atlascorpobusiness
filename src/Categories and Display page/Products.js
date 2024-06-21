import React, {useState,useEffect,useContext}from "react";
import "./products.css";
import './Categories Pages/filterelement.css'

import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import axios from "axios";
import { ProductsContext } from "../MainOpeningpage/ProductsContext";

export default function Products({ handleAddProductDetails, handleAddQuotationProduct }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  


  const  REACT_API_ADDRESS= "http://indexserver-dot-ultra-mediator-423907-a4.uc.r.appspot.com"
  const local= "http://localhost:3001"
  const engine= "http://104.154.57.31:3001"

  useEffect(() => {
    axios
      .get("http://104.154.57.31:3001/api/products")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");

  const itemsPerPage = 16;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    
    try {
      const response = await fetch("http://104.154.57.31:3001/api/Countryproducts");
      if (!response.ok) {
        throw new Error("Failed to fetch items from MySQL");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const { products } = useContext(ProductsContext);

  useEffect(() => {
     
  }, [products]);


  return (
    <div className="big_container" key={1}>
      <div className="shop_routes">
        <a href="./" style={{ color: "#0078a1", textDecoration: "none" }}>
          {" "}
          Home &nbsp;/
        </a>
        <p href="/Shop"  style={{
            color: "#0078a1",
            textDecoration: "none",
            position: "absolute",
            left: "7.2rem",
            top: "-1rem",
            width: "10rem",
          }}>
  
        </p>
      
      </div>

      <div className="productdisplay_container">
  
        <div className={`sub_productdisplay_container ${layoutMode}`}>
          <small className="featuredprdts_length">
            Featured Products: {data.length}
          </small>
          <div className="btn_group">
            <small>Sort by:</small>
            <p onClick={() => setLayoutMode("grid")}>
              <CiGrid41 />
            </p>
            <p onClick={() => setLayoutMode("normal")}>
              {" "}
              <CiGrid2H />
            </p>
          </div>

          {data
            .slice(pagesVisited, pagesVisited + itemsPerPage)
            .map((product, index) => (
              <Link
              key={product.partnumber}
              className="mylink"
     
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
                      <img className="prdt_image" src={product.image} alt="" />
                      
                      <p className="cameraoff_icon">
                        <LuCameraOff />
                      </p>
                      <p className="prdt_partnumber">{product.partnumber}</p>
                      <Link key={product.partnumber}
              
              to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
              onClick={() => !isLoading && handleAddProductDetails(product)}   style={{color:"black",textDecoration:'none'}}  >
                      <p className="prdt_title">{product.Description}</p>
                      </Link>
                      
                      <p className="prdt_price">${product.Price}</p>
                      <div className="stock_status">
                  <div className={`status_indicator ${product.quantity > 0 ? 'in_stock' : 'out_of_stock'}`}></div>
                  <div className="in_out_stock" >{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</div>
                  {product.quantity <= 0 && (
                    <div className="get_quote"  onClick={() => handleAddQuotationProduct(product)}  >
                     <p> Get a Quote</p>
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
      </div>



      
    </div>
  );
}
