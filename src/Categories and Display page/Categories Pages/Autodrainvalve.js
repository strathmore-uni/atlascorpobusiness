import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import NavigationBar from "../../General Components/NavigationBar";
import Categories from "../Categories";
import { Link, useNavigate } from "react-router-dom";
import { LuCameraOff } from "react-icons/lu";

import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import Footer from "../../General Components/Footer";


export default function Autodrainvalve({ handleAddProductDetails, cartItems }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    axios
      .get("http://localhost:3001/api/autodrainvalve")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");

  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/autodrainvalve");
      if (!response.ok) {
        throw new Error("Failed to fetch items from MySQL");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  return (
    <div className="big_container" key={1}>
      <div className="shop_routes">
        <a href="./" style={{ color: "#0078a1", textDecoration: "none" }}>
          {" "}
          Home &nbsp;/
        </a>
        <a href="/Shop" style={{ color: "#0078a1", textDecoration: "none" }}>
          &nbsp;Shop &nbsp;/
        </a>
        <p
          href="/Shop/Big"
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
                to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
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
                      <p className="prdt_title">{product.Description}</p>
                      <p className="prdt_price">${product.Price}</p>
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

      <Categories />

      <NavigationBar cartItems={cartItems} />
      <div className="filterelement_footer">
        <Footer />
      </div>
    </div>
  );
}
