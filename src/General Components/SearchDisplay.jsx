import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
// import "./searchdisplay.css"; // Removed old CSS
import ReactPaginate from "react-paginate";
import { LuCameraOff } from "react-icons/lu";
import { HiOutlineViewGrid, HiOutlineViewList, HiOutlineFilter } from "react-icons/hi";
import { FiSearch, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import Footer from "./Footer";
import { GrCart } from "react-icons/gr";
import { BsStarFill, BsStar } from "react-icons/bs";
import { useAuth } from "../MainOpeningpage/AuthContext";

export default function SearchDisplay({
  handleAddProductDetails,
  handleAddProduct,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { results: initialResults, term: initialTerm } = location.state || {
    results: [],
    term: "",
  };
  const [results, setResults] = useState(initialResults);
  const [categories, setCategories] = useState({});
  const [layoutMode, setLayoutMode] = useState("grid");
  const [pageNumber, setPageNumber] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialTerm || "");
  const [sortOption, setSortOption] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const { currentUser } = useAuth();
  
  const itemsPerPage = 20;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(results.length / itemsPerPage);

  // Calculate categories and their item counts
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
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/singlecart`, {
        partnumber: product.partnumber,
        quantity: 1,
        userEmail: currentUser.email,
        description: product.Description,
        price: product.Price,
      });
      handleAddProduct(product);
      setNotification(`${product.Description} added to cart!`);
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification("Failed to add item to cart");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleCategoryClick = async (category) => {
    try {
      setIsLoading(true);
      if (!currentUser) {
        console.error("No user email provided");
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL}/api/search`,
        {
          params: {
            term: searchTerm,
            category,
            email: currentUser.email,
          },
        }
      );
      setResults(response.data);
      setPageNumber(0);
    } catch (error) {
      console.error("Error fetching category results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedResults = [...results];
    
    switch (option) {
      case "priceLowToHigh":
        sortedResults.sort((a, b) => a.Price - b.Price);
        break;
      case "priceHighToLow":
        sortedResults.sort((a, b) => b.Price - a.Price);
        break;
      case "nameAZ":
        sortedResults.sort((a, b) => a.Description.localeCompare(b.Description));
        break;
      case "nameZA":
        sortedResults.sort((a, b) => b.Description.localeCompare(a.Description));
        break;
      default:
        // Relevance - keep original order
        break;
    }
    setResults(sortedResults);
  };

  const filteredResults = results.filter(item => {
    const inPriceRange = item.Price >= priceRange[0] && item.Price <= priceRange[1];
    const inSelectedCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const stockFilter = !inStockOnly || item.quantity > 0;
    return inPriceRange && inSelectedCategory && stockFilter;
  });

  const displayResults = filteredResults.slice(pagesVisited, pagesVisited + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <NavigationBar />
      
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link 
              to="/Shop" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <IoIosArrowBack className="text-xl" /> 
              Back to Shop
      </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiSearch className="text-2xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for: <span className="text-blue-600">"{searchTerm}"</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {filteredResults.length} results found
              </span>
              {Object.keys(categories).length > 0 && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {Object.keys(categories).length} categories
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Advanced Filters Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            {/* Filter Toggle for Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4 font-medium text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <HiOutlineFilter className="text-xl" />
                  Filters & Categories
                </div>
                <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters Panel */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiChevronRight className="text-blue-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {Object.entries(categories)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, count], index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
                      >
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-bold">
                          {count}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStockOnly"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="inStockOnly" className="text-sm text-gray-700">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Layout Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setLayoutMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        layoutMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <HiOutlineViewGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setLayoutMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        layoutMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <HiOutlineViewList className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="relevance">Sort by Relevance</option>
                      <option value="priceLowToHigh">Price: Low to High</option>
                      <option value="priceHighToLow">Price: High to Low</option>
                      <option value="nameAZ">Name: A to Z</option>
                      <option value="nameZA">Name: Z to A</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {pagesVisited + 1}-{Math.min(pagesVisited + itemsPerPage, filteredResults.length)} of {filteredResults.length} results
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Results Grid/List */}
            {!isLoading && (
              <>
                {displayResults.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                      <FiSearch className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  <Link
                      to="/Shop"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse All Products
                    </Link>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${
                    layoutMode === "grid" 
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "grid-cols-1"
                  }`}>
                    {displayResults.map((item) => (
                      <div
                        key={item.partnumber}
                        className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                          layoutMode === "list" ? "flex" : ""
                        }`}
                      >
                        {/* Product Image */}
                        <div className={`${layoutMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.Description}
                              className={`w-full object-cover transition-transform group-hover:scale-105 ${
                                layoutMode === "list" ? "h-32" : "h-48"
                              }`}
                            />
                          ) : (
                            <div className={`flex items-center justify-center bg-gray-100 ${
                              layoutMode === "list" ? "h-32" : "h-48"
                            }`}>
                              <LuCameraOff className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className={`p-4 ${layoutMode === "list" ? "flex-1" : ""}`}>
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 font-mono">{item.partnumber}</p>
                          </div>
                          
                          <Link
                            to={`/productdetails/${item.partnumber}`}
                            onClick={() => handleAddProductDetails(item)}
                            className="block mb-2"
                          >
                            <h3 className={`font-semibold text-gray-900 hover:text-blue-600 transition-colors ${
                              layoutMode === "list" ? "text-lg" : "text-sm"
                            }`}>
                              {item.Description}
                            </h3>
                          </Link>

                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xl font-bold text-blue-600">${item.Price}</p>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-yellow-400">
                                  {star <= 4 ? <BsStarFill className="w-4 h-4" /> : <BsStar className="w-4 h-4" />}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                item.quantity > 0 ? "bg-green-500" : "bg-red-500"
                              }`}></div>
                              <span className={`text-xs font-medium ${
                                item.quantity > 0 ? "text-green-600" : "text-red-600"
                              }`}>
                                {item.quantity > 0 ? "In Stock" : "Out of Stock"}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={item.quantity <= 0}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                item.quantity > 0
                                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <GrCart className="w-4 h-4" />
                              {item.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Enhanced Pagination */}
                {filteredResults.length > itemsPerPage && (
                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Page {pageNumber + 1} of {pageCount}
                    </div>
            <ReactPaginate
                      previousLabel="Previous"
                      nextLabel="Next"
              pageCount={pageCount}
              onPageChange={(e) => setPageNumber(e.selected)}
                      containerClassName="flex items-center space-x-1"
                      pageClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                      previousClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                      nextClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                      activeClassName="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg"
                      disabledClassName="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
            />
          </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
