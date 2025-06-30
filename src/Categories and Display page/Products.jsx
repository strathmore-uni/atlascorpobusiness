import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { FaHeart, FaEye, FaStar, FaFilter, FaSort, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../MainOpeningpage/AuthContext";
import FilterElement from "./Categories Pages/FilterElement";
import LoadingSpinner from "../General Components/LoadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { currentUser, IsAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    priceRange: "",
    rating: "",
    availability: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all products from localhost on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!IsAuthenticated || !currentUser) {
          setError("Please sign in to view products");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3001/api/products", {
          params: { email: currentUser.email }
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (IsAuthenticated && currentUser) {
      fetchProducts();
    }
  }, [IsAuthenticated, currentUser]);

  // Filter products by category if category param exists
  useEffect(() => {
    let filtered = [...products];
    if (category) {
      filtered = filtered.filter(product => product.subCategory === category);
    }
    setFilteredProducts(filtered);
  }, [products, category]);

  // Update filtered products when products or filters change
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.partnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price range filter
    if (selectedFilters.priceRange) {
      const [min, max] = selectedFilters.priceRange.split("-").map(Number);
      filtered = filtered.filter(product => {
        const price = parseFloat(product.Price);
        return max ? price >= min && price <= max : price >= min;
      });
    }

    // Apply availability filter
    if (selectedFilters.availability) {
      if (selectedFilters.availability === "inStock") {
        filtered = filtered.filter(product => product.Stock > 0);
      } else if (selectedFilters.availability === "outOfStock") {
        filtered = filtered.filter(product => product.Stock === 0);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.Description?.toLowerCase() || "";
          bValue = b.Description?.toLowerCase() || "";
          break;
        case "price":
          aValue = parseFloat(a.Price) || 0;
          bValue = parseFloat(b.Price) || 0;
          break;
        case "partnumber":
          aValue = a.partnumber?.toLowerCase() || "";
          bValue = b.partnumber?.toLowerCase() || "";
          break;
        default:
          aValue = a.Description?.toLowerCase() || "";
          bValue = b.Description?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedFilters, sortBy, sortOrder]);

  // Remove wishlist functionality since it doesn't exist in backend
  const handleWishlistToggle = async (productId) => {
    if (!IsAuthenticated) {
      toast.error("Please sign in to manage wishlist");
      navigate("/signin");
      return;
    }
    
    // For now, just show a message that wishlist is not implemented
    toast.info("Wishlist functionality coming soon!");
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      brand: [],
      priceRange: "",
      rating: "",
      availability: "",
    });
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              const fetchProducts = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  
                  if (!IsAuthenticated || !currentUser) {
                    setError("Please sign in to view products");
                    setLoading(false);
                    return;
                  }

                  const response = await axios.get("http://localhost:3001/api/products", {
                    params: { email: currentUser.email }
                  });
                  setProducts(response.data);
                } catch (error) {
                  console.error("Error fetching products:", error);
                  setError("Failed to load products. Please try again.");
                } finally {
                  setLoading(false);
                }
              };
              fetchProducts();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {category} Products
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} of {products.length} products
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
         

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="partnumber">Part Number</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
                  >
                    <FaSort className={`h-4 w-4 text-gray-600 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} products
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FaSearch className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.Description}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                      
                      {/* Stock Badge */}
                      {product.Stock === 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link
                        to={`/productdetails/${product.partnumber}`}
                        className="block group"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {product.Description}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        Part Number: {product.partnumber}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ${parseFloat(product.Price).toFixed(2)}
                          </span>
                        </div>
                        
                        <span className="text-sm text-gray-600">
                          {product.Stock > 0 ? `${product.Stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`/productdetails/${product.partnumber}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FaEye className="h-4 w-4" />
                          View
                        </Link>
                        
                        {product.Stock > 0 && (
                          <button
                            onClick={() => {
                              toast.success(`${product.Description} added to cart!`);
                              // Simulate adding to cart
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            <GrCart className="h-4 w-4" />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
