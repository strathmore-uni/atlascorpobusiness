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

import AdminCategory from "./AdminCategory";
import { RxCross2 } from "react-icons/rx";
import { FiSearch, FiFilter, FiEye, FiEdit, FiPrinter, FiPackage } from "react-icons/fi";

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
      const fetchSalesData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_LOCAL}/api/admin/productOrderCount/${selectedProduct.partnumber}`
          );
          setSalesData(response.data);
        } catch (error) {
          console.error("Error fetching sales data:", error);
        }
      };

      fetchSalesData();
    }
  }, [selectedProduct]);

  // Prepare chart data

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
  
  const chartData = {
    labels: salesData ? salesData.salesData.map(data => data.month) : [],
    datasets: [
      {
        label: "Sales",
        data: salesData ? salesData.salesData.map(data => data.total_quantity) : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Adjust for smoothness
        fill: true, // Fill area under the line
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Quantity: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Color of grid lines
          borderColor: 'rgba(200, 200, 200, 0.5)', // Color of x-axis border
          borderWidth: 1,
        },
        title: {
          display: true,
          text: 'Month',
          color: '#333',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Color of grid lines
          borderColor: 'rgba(200, 200, 200, 0.5)', // Color of y-axis border
          borderWidth: 1,
        },
        title: {
          display: true,
          text: 'Quantity',
          color: '#333',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Product Management</h1>
          </div>
          <p className="text-lg text-gray-600">View and manage all products in your inventory</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by part number or description"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Main Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedMainCategory}
                onChange={handleMainCategoryChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="">All Main Categories</option>
                {categories.mainCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category Filter */}
            {selectedMainCategory && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
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
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            {searchQuery || selectedMainCategory || selectedSubCategory ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMainCategory("");
                  setSelectedSubCategory("");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {filteredProducts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <FiPackage className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {product.partnumber || "N/A"}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {product.Description || "No description available"}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {product.mainCategory || "Uncategorized"}
                              </span>
                              {product.subCategory && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {product.subCategory}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <FiEye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {searchQuery || selectedMainCategory || selectedSubCategory
                    ? "Try adjusting your search criteria or filters."
                    : "No products have been added yet."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Product Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Product Details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          {selectedProduct && (
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedProduct.partnumber || "Product Details"}
                    </h2>
                    <p className="text-gray-600">{selectedProduct.Description || "No description"}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <RxCross2 className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Action Buttons */}
                <div className="flex space-x-3 mb-6">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    Edit Product
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FiPrinter className="w-4 h-4 mr-2" />
                    Print
                  </button>
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Product Details */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                        <p className="text-gray-900 font-medium">{selectedProduct.partnumber || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p className="text-gray-900">{selectedProduct.Description || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                        <p className="text-gray-900">{selectedProduct.mainCategory || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                        <p className="text-gray-900">{selectedProduct.subCategory || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                    {selectedProduct.image ? (
                      <div className="flex justify-center">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.Description || "Product"}
                          className="w-48 h-48 object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center hidden">
                          <FiPackage className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center mx-auto">
                        <FiPackage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sales Chart */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics</h3>
                  {salesData ? (
                    <div className="h-64">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                      <span className="text-gray-600">Loading sales data...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Admin Category Section */}
        <div className="mt-12">
          <AdminCategory />
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
