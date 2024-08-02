import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./users.css";
import AdminCategory from "./AdminCategory";
import { RxCross2 } from "react-icons/rx";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
);

// Set the app element for accessibility
Modal.setAppElement("#root");

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({
    mainCategories: [],
    subCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [salesData, setSalesData] = useState(null); // State for sales data
  const [orderCountData, setOrderCountData] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/viewproducts`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/mycategories`
        );
        const categoriesData = response.data;

        if (categoriesData.mainCategories && categoriesData.subCategories) {
          setCategories({
            mainCategories: categoriesData.mainCategories,
            subCategories: categoriesData.subCategories,
          });
        } else {
          console.error(
            "Categories response is not in expected format:",
            categoriesData
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const fetchOrderCount = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_LOCAL}/api/admin/productOrderCount/${selectedProduct.partnumber}`
          );
          setOrderCountData(response.data);
        } catch (error) {
          console.error("Error fetching order count:", error);
        }
      };

      fetchOrderCount();
    }
  }, [selectedProduct]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMainCategoryChange = (e) => {
    setSelectedMainCategory(e.target.value);
    setSelectedSubCategory(""); // Reset subcategory when main category changes
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSalesData(null); // Reset sales data on modal close
  };

  const handleEdit = () => {
    if (selectedProduct) {
      window.location.href = `/editproduct/${selectedProduct.id}`;
    }
  };

  const handlePrint = () => {
    if (selectedProduct) {
      window.print(); // Adjust this if you have specific print logic
    }
  };

  // Filter products based on search query, main category, and subcategory
  const filteredProducts = products.filter((product) => {
    const partnumber = product.partnumber || ""; // Default to empty string if null or undefined
    const description = product.Description || ""; // Default to empty string if null or undefined
    const matchesSearch =
      partnumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMainCategory =
      !selectedMainCategory || product.mainCategory === selectedMainCategory;
    const matchesSubCategory =
      !selectedSubCategory || product.subCategory === selectedSubCategory;

    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  // Filter subcategories based on the selected main category
  const filteredSubCategories = categories.subCategories.filter((subCat) =>
    products.some(
      (product) =>
        product.mainCategory === selectedMainCategory &&
        product.subCategory === subCat
    )
  );

  // Prepare chart data
  const chartData = {
    labels: salesData ? salesData.dates : [], // Assuming salesData has a 'dates' array
    datasets: [
      {
        label: "Sales",
        data: salesData ? salesData.values : [], // Assuming salesData has a 'values' array
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  };

  return (
    <div className="products-container">
      <h2>Products List</h2>

      <input
        type="text"
        placeholder="Search by part number or description"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input-orderlist"
      />

      <div className="select-container">
        <select
          value={selectedMainCategory}
          onChange={handleMainCategoryChange}
          className="category-select"
        >
          <option value="">All Main Categories</option>
          {categories.mainCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {selectedMainCategory && (
        <select
          value={selectedSubCategory}
          onChange={handleSubCategoryChange}
          className="category-select"
        >
          <option value="">All Sub Categories</option>
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((subCategory, index) => (
              <option key={index} value={subCategory}>
                {subCategory}
              </option>
            ))
          ) : (
            <option value="">No Subcategories Available</option>
          )}
        </select>
      )}

      {loading ? (
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
        <ul>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product.id}>
                <span>
                  {product.partnumber || "N/A"} - {product.Description || "N/A"}
                </span>
                <button
                  onClick={() => handleViewProduct(product)}
                  className="view-button"
                >
                  View
                </button>
              </li>
            ))
          ) : (
            <li>No products found</li>
          )}
        </ul>
      )}

      <AdminCategory />

      {/* Modal for viewing product details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Product Details"
        style={{
          content: {
            position: "absolute",
            top: "0%",
            right: "0",
            bottom: "10%",
            height: "100%",
            width: "100%",
            padding: "20px",
            overflow: "auto",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
          },
        }}
      >
        {selectedProduct && (
          <div className="modal_viewproduct">
            <div onClick={closeModal}>
              <RxCross2 className="close_icon_prdtview" />
            </div>

            <p className="modal_header">
              {selectedProduct.Description || "N/A"}
            </p>
            <div className="modal-actions">
              <button className="btn_prdtview"  onClick={handleEdit}>Edit</button>
              <button  className="btn_prdtview" onClick={handlePrint} >Print</button>
              
              
            </div>
            <div className="prdtview_details">
              <small>Product Info</small>
              <p>
                <strong>Part Number:</strong>{" "}
                {selectedProduct.partnumber || "N/A"}
              </p>
              <p>
                <strong>Main Category:</strong>{" "}
                {selectedProduct.mainCategory || "N/A"}
              </p>
              <p>
                <strong>Sub Category:</strong>{" "}
                {selectedProduct.subCategory || "N/A"}
              </p>
              <img
                className="img_view"
                src={selectedProduct.image}
                alt={selectedProduct.image}
              />
              <div className="div_line"></div>
            </div>
            <div className="chart-container-prdtview">
              <h3>Sales Data</h3>
              {orderCountData ? (
                <Line data={chartData} />
              ) : (
                <p>Loading sales data...</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsList;
