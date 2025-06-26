import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LuCameraOff } from "react-icons/lu";
import { GrCart } from "react-icons/gr";
import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";
import { FiFilter, FiChevronRight, FiChevronDown, FiX, FiSearch, FiClock } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import NavigationBar from "../General Components/NavigationBar";
import Footer from "../General Components/Footer";
import { useAuth } from "../MainOpeningpage/AuthContext";

const ProductsPage = ({ handleAddProductDetails, handleAddProduct, cartItems }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    brand: true,
    stock: true,
    rating: true,
    specifications: true
  });
  
  // Enhanced Filters State
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    brands: [],
    inStock: false,
    outOfStock: false,
    minRating: 0
  });

  // Advanced Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState(false);

  const itemsPerPage = 12;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(products.length / itemsPerPage);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim().length >= 2) {
            performSearch(query);
          } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
          }
        }, 300);
      };
    })(),
    []
  );

  const performSearch = async (query) => {
    if (!currentUser || !currentUser.email) return;
    
    try {
      setIsSearching(true);
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL}/api/search`,
        {
          params: {
            term: query,
            email: currentUser.email,
            category: category
          },
        }
      );
      
      // Generate suggestions from search results
      const suggestions = response.data.slice(0, 5).map(item => ({
        id: item.partnumber,
        text: item.Description,
        partnumber: item.partnumber,
        category: item.category || category
      }));
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
      setIsSearching(false);
    } catch (error) {
      console.error("Error performing search:", error);
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    
    if (query.trim() === "") {
      setSearchMode(false);
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    
    try {
      setIsSearching(true);
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL}/api/search`,
        {
          params: {
            term: searchQuery,
            email: currentUser.email,
            category: category
          },
        }
      );
      
      setSearchResults(response.data);
      setSearchMode(true);
      setShowSuggestions(false);
      
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      setIsSearching(false);
    } catch (error) {
      console.error("Error searching:", error);
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    // Trigger search with the selected suggestion
    setSearchQuery(suggestion.text);
    setTimeout(() => {
      handleSearchSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const handleHistoryClick = (historyItem) => {
    setSearchQuery(historyItem);
    setShowSuggestions(false);
    setTimeout(() => {
      handleSearchSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchMode(false);
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const removeFromHistory = (itemToRemove) => {
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Load search history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    }
  }, []);

  const handleAddToCart = async (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }
  
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        partnumber: product.partnumber,
        quantity: 1,
        userEmail: currentUser.email,
        description: product.Description,
        price: product.Price
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

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!currentUser || !currentUser.email) {
        setError('No user email provided');
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/products/${category}`,
          {
            params: { email: currentUser.email },
          }
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchProductsByCategory();
  }, [category, currentUser]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
    setPageNumber(0);
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      brands: [],
      inStock: false,
      outOfStock: false,
      minRating: 0
    });
    setPageNumber(0);
  };

  const sortedProducts = products.sort((a, b) => {
    if (sortOption === "priceLowToHigh") {
      return a.Price - b.Price;
    } else if (sortOption === "priceHighToLow") {
      return b.Price - a.Price;
    } else if (sortOption === "nameAZ") {
      return a.Description.localeCompare(b.Description);
    } else if (sortOption === "nameZA") {
      return b.Description.localeCompare(a.Description);
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter((product) => {
    // Price range filter
    const inPriceRange = product.Price >= filters.priceRange[0] && product.Price <= filters.priceRange[1];
    
    // Brand filter
    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand || product.manufacturer);
    
    // Stock filter
    const stockFilter = !filters.inStock && !filters.outOfStock || 
      (filters.inStock && product.Stock > 0) || 
      (filters.outOfStock && product.Stock <= 0);
    
    // Rating filter (if product has rating)
    const matchesRating = !filters.minRating || (product.rating && product.rating >= filters.minRating);

    return inPriceRange && matchesBrand && stockFilter && matchesRating;
  });

  // Use search results if in search mode, otherwise use filtered products
  const displayProducts = searchMode ? searchResults : filteredProducts.slice(pagesVisited, pagesVisited + itemsPerPage);
  const uniqueBrands = products.map(product => product.brand || product.manufacturer).filter(Boolean);

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar cartItems={cartItems} />
      
      {/* Notification */}
      {notificationMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notificationMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Home
        </Link>
            <FiChevronRight className="text-gray-400" />
            <Link to="/Shop" className="text-blue-600 hover:text-blue-800 transition-colors">
              Shop
        </Link>
            <FiChevronRight className="text-gray-400" />
            <span className="text-gray-900 font-medium">{category}</span>
          </div>
        </div>
      </div>
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Search Bar */}
            <div className="mb-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={`Search ${category} products...`}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : (
                      <>
                        {/* Search Suggestions */}
                        {searchSuggestions.length > 0 && (
                          <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Suggestions
                            </div>
                            {searchSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                              >
                                <div className="flex items-center">
                                  <FiSearch className="h-4 w-4 text-gray-400 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{suggestion.text}</div>
                                    <div className="text-xs text-gray-500">Part: {suggestion.partnumber}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Search History */}
                        {searchHistory.length > 0 && !searchQuery && (
                          <div className="py-2 border-t border-gray-100">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Recent Searches
                            </div>
                            {searchHistory.map((historyItem, index) => (
                              <button
                                key={index}
                                onClick={() => handleHistoryClick(historyItem)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FiClock className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-sm text-gray-900">{historyItem}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromHistory(historyItem);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <FiX className="h-4 w-4" />
                                  </button>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* No suggestions message */}
                        {searchQuery && searchSuggestions.length === 0 && !isSearching && (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No suggestions found for "{searchQuery}"
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </form>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Advanced Filters Sidebar */}
              <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FiFilter className="mr-2" />
                      Filters
                    </h2>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={filters.priceRange[0]}
                          onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  {uniqueBrands.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">Brands ({uniqueBrands.length})</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uniqueBrands.map((brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.brands.includes(brand)}
                              onChange={() => handleBrandToggle(brand)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Status Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Stock Status</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.outOfStock}
                          onChange={(e) => handleFilterChange('outOfStock', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Out of Stock</span>
                </label>
              </div>
            </div>
          
                  {/* Rating Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="minRating"
                            value={rating}
                            checked={filters.minRating === rating}
                            onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700 flex items-center">
                            {rating}+ <FaStar className="ml-1 text-yellow-400" />
                          </span>
                        </label>
                      ))}
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="minRating"
                          value={0}
                          checked={filters.minRating === 0}
                          onChange={() => handleFilterChange('minRating', 0)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Any Rating</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Header with Results Count and Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-4">
                      <h1 className="text-2xl font-bold text-gray-900">{category}</h1>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        <FiFilter />
                        Filters
                      </button>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'} found
                      {(filters.brands.length > 0 || filters.inStock || filters.outOfStock || filters.minRating > 0) && (
                        <span className="text-blue-600 ml-2">(filtered)</span>
                      )}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Layout Toggle */}
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                      <button
                        onClick={() => setLayoutMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          layoutMode === "grid"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <HiOutlineViewGrid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setLayoutMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          layoutMode === "list"
                            ? "bg-blue-600 text-white"
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
                        onChange={handleSortChange}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sort by</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                        <option value="priceHighToLow">Price: High to Low</option>
                        <option value="nameAZ">Name: A to Z</option>
                        <option value="nameZA">Name: Z to A</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(filters.brands.length > 0 || filters.inStock || filters.outOfStock || filters.minRating > 0) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-blue-900">Active Filters:</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filters.brands.map((brand) => (
                        <span key={brand} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {brand}
                          <button
                            onClick={() => handleBrandToggle(brand)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {filters.inStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                          <button
                            onClick={() => handleFilterChange('inStock', false)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.outOfStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of Stock
                          <button
                            onClick={() => handleFilterChange('outOfStock', false)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.minRating > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {filters.minRating}+ Stars
                          <button
                            onClick={() => handleFilterChange('minRating', 0)}
                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Products Grid/List */}
                {displayProducts.length > 0 ? (
                  <div className={`grid gap-6 ${
                    layoutMode === "grid" 
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "grid-cols-1"
                  }`}>
                    {displayProducts.map((product) => (
                      <div
                        key={product.partnumber}
                        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                          layoutMode === "list" ? "flex" : ""
                        }`}
                      >
                        {/* Product Image */}
                        <div className={`${layoutMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.Description}
                              className={`w-full object-cover ${
                                layoutMode === "list" ? "h-32" : "h-48"
                              }`}
                            />
                          ) : (
                            <div className={`flex items-center justify-center bg-gray-100 ${
                              layoutMode === "list" ? "h-32" : "h-48"
                            }`}>
                              <LuCameraOff className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className={`p-4 ${layoutMode === "list" ? "flex-1" : ""}`}>
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 font-mono">{product.partnumber}</p>
                          </div>
                          
                    <Link
                      to={`/Productdetails?name=${product.Description}?id=${product.partnumber}`}
                      onClick={() => handleAddProductDetails(product)}
                            className="block mb-2"
                          >
                            <h3 className={`font-medium text-gray-900 hover:text-blue-600 transition-colors ${
                              layoutMode === "list" ? "text-lg" : "text-sm"
                            }`}>
                              {product.Description}
                            </h3>
                    </Link>

                          <div className="flex items-center justify-between mb-3">
                            <p className="text-lg font-bold text-gray-900">${product.Price}</p>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                product.Stock > 0 ? "bg-green-500" : "bg-red-500"
                              }`}></div>
                              <span className={`text-xs font-medium ${
                                product.Stock > 0 ? "text-green-600" : "text-red-600"
                              }`}>
                        {product.Stock > 0 ? "In Stock" : "Out of Stock"}
                              </span>
                            </div>
                      </div>
                    
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.Stock <= 0}
                            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              product.Stock > 0
                                ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <GrCart className="w-4 h-4" />
                            <span>{product.Stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your filters or search criteria.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                    </div>
                )}

                {/* Pagination */}
                {displayProducts.length > itemsPerPage && (
                  <div className="mt-8 flex justify-center">
                <ReactPaginate
                      previousLabel="Previous"
                      nextLabel="Next"
                  pageCount={pageCount}
                  onPageChange={(e) => setPageNumber(e.selected)}
                      containerClassName="flex items-center space-x-1"
                      pageClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
                      previousClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
                      nextClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
                      activeClassName="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md"
                      disabledClassName="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
