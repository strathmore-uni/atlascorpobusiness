import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import AdminCategory from "./AdminCategory"; // Category component
import { useAuth } from "../MainOpeningpage/AuthContext";
import { Rings } from 'react-loader-spinner'; // Use Rings instead

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [fileChosen, setFileChosen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deriveCategoriesFromName = (productName) => {
    // Split product name by space or any delimiter (e.g., underscore or dash)
    const nameParts = productName.split(' ');
  
    // The first word is assigned as the mainCategory, and the second as the subCategory
    const mainCategory = nameParts[0] || "Uncategorized";
    const subCategory = nameParts[1] || "General";
  
    return {
      mainCategory,
      subCategory,
    };
  };
  
  const [singleProduct, setSingleProduct] = useState({
    partnumber: "",
    description: "",
    image: "",
    thumb1: "",
    thumb2: "",
    prices: [{ country_code: "", price: "" }],
    stock: 0,
    mainCategory: "",
    subCategory: "",
  });

  const [isTableVisible, setIsTableVisible] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [countries, setCountries] = useState([]);
 
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/settings/countries`
        );
        console.log("API Response:", response.data); // Log the response to check the structure
        if (Array.isArray(response.data)) {
          setCountries(response.data); // Assuming the response is an array of countries
        } else if (response.data.countries) {
          setCountries(response.data.countries); // Original structure assumption
        } else {
          toast.error("Unexpected API response structure");
        }
      } catch (error) {
        toast.error("Error fetching countries");
      }
    };
  
    fetchCountries();
  }, []); // Adding an empty dependency array prevents the endless loop
  
 
  
  const handleCountrySelection = (countryName) => {
    const selectedCountry = countries.find(
      (country) => country.name === countryName
    );

    if (!selectedCountry) {
      toast.error('Country not found');
      return;
    }

    const countryCode = selectedCountry.code;

    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter((code) => code !== countryCode));
    } else {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/categories`
        );
        if (response.data.categories && response.data.subcategories) {
          setCategories(response.data.categories);
          setSubcategories(response.data.subcategories);
        } else {
          toast.error("Unexpected API response structure");
        }
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle file upload and parse Excel data
  // Handle file upload and parse Excel data
  // Function to handle file upload and parse Excel data

  // Fetch the current user

  const fetchCurrentUser = () => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        return parsedUser;
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
        return null;
      }
    }
    console.error("No user data found in local storage.");
    return null;
  };
  const currentUser = fetchCurrentUser();
  
  const adminRole = currentUser ? currentUser.isAdmin : null;

  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
  
    setFileChosen(true);
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const [headerRow, ...rows] = jsonData;
  
      const normalizedHeaders = headerRow.map((header) =>
        header
          .toLowerCase()
          .replace(/[\s\(\):"]/g, "") // Removes spaces, parentheses, colons, and quotes
          .replace("itemnumber", "partnumber")
          .replace("priceusd", "price")
      );
  
      const parsedProducts = rows.map((row) => {
        const product = normalizedHeaders.reduce((acc, header, index) => {
          acc[header] = row[index] || "";
          return acc;
        }, {});
  
        // Automatically assign categories based on the product name
        const categoryAssignment = deriveCategoriesFromName(product.description || product.partnumber);
  
        return {
          partnumber: product["partnumber"] || "",
          description: product["description"] || "",
          image: product["image"] || "",
          thumb1: product["thumb1"] || "",
          thumb2: product["thumb2"] || "",
          mainCategory: categoryAssignment.mainCategory, // Automatically derived mainCategory
          subCategory: categoryAssignment.subCategory,   // Automatically derived subCategory
          prices: [
            {
              country_code: selectedCountries, // Assuming country code; replace with your dynamic logic
              price: parseFloat(product["price"]) || 0,
              stock_quantity: parseInt(product["stock"]) || 0,
            },
          ],
        };
      });
  
      console.log("Parsed Products:", parsedProducts);
  
      setProducts(parsedProducts);
      setIsFileLoaded(true);
      setIsTableVisible(true);
    };
  
    reader.readAsArrayBuffer(file);
  };
  

  // Handle changes to product data in the table
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value,
    };
    setProducts(updatedProducts);
  };

  // Handle bulk product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL}/api/products/bulk`,
        { products },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Products added successfully!");
        setProducts([]);
        setIsFileLoaded(false);
        setFileChosen(false);
      } else {
        toast.error("Failed to add products");
      }
    } catch (error) {
      console.error("Error adding products:", error);
      toast.error("Error adding products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle single product form submission
  const handleSingleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL}/api/products`,
        singleProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Product added successfully!");
        setSingleProduct({
          partnumber: "",
          description: "",
          image: "",
          thumb1: "",
          thumb2: "",
          prices: [{ country_code: "", price: "" }],
          stock: 0,
          mainCategory: "",
          subCategory: "",
        });
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for single product form
  const handleSingleProductChange = (e) => {
    const { name, value } = e.target;
    setSingleProduct({
      ...singleProduct,
      [name]: value,
    });
  };

  // Handle changes to the price entries in the single product form
  const handleSinglePriceChange = (index, e) => {
    const { name, value } = e.target;
    setSingleProduct({
      ...singleProduct,
      prices: singleProduct.prices.map((price, prIdx) =>
        prIdx === index ? { ...price, [name]: value } : price
      ),
    });
  };

  // Add a new price entry for the single product form
  const handleAddSinglePrice = () => {
    setSingleProduct({
      ...singleProduct,
      prices: [...singleProduct.prices, { country_code: "", price: "" }],
    });
  };
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-lg text-gray-600">Add products individually or upload in bulk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bulk Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bulk Product Upload</h2>
                <p className="text-gray-600">Upload Excel file with multiple products</p>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel File (.xlsx)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Excel files only</p>
                </div>
              </div>
            </div>

            {/* Country Selection */}
            {adminRole === true && isFileLoaded && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Countries for Price Adjustment:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                  {countries.map((country) => (
                    <label key={country.code} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country.code)}
                        onChange={() => handleCountrySelection(country.name)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{country.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Table Button */}
            {isFileLoaded && (
              <button
                onClick={toggleTableVisibility}
                className="w-full mb-4 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!fileChosen}
              >
                {isTableVisible ? "Hide Preview" : "Show Preview"}
              </button>
            )}

            {/* Products Table */}
            {isTableVisible && products.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.partnumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{product.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.prices[0]?.price || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!products.length || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Rings color="#ffffff" height={20} width={20} />
                  <span className="ml-2">Uploading...</span>
                </div>
              ) : (
                `Upload ${products.length} Products`
              )}
            </button>
          </div>

          {/* Single Product Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Single Product</h2>
                <p className="text-gray-600">Add one product at a time</p>
              </div>
            </div>

            <form onSubmit={handleSingleProductSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Number *
                  </label>
                  <input
                    type="text"
                    name="partnumber"
                    value={singleProduct.partnumber}
                    onChange={handleSingleProductChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter part number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={singleProduct.stock}
                    onChange={handleSingleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  value={singleProduct.description}
                  onChange={handleSingleProductChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={singleProduct.image}
                  onChange={handleSingleProductChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Category
                  </label>
                  <select
                    name="mainCategory"
                    value={singleProduct.mainCategory}
                    onChange={handleSingleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Main Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    value={singleProduct.subCategory}
                    onChange={handleSingleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Sub Category</option>
                    {subcategories.map((subcategory, index) => (
                      <option key={index} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Pricing Information
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSinglePrice}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Price
                  </button>
                </div>
                
                <div className="space-y-4">
                  {singleProduct.prices.map((price, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country Code
                        </label>
                        <input
                          type="text"
                          name="country_code"
                          value={price.country_code}
                          onChange={(e) => handleSinglePriceChange(index, e)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., US, EU, UK"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={price.price}
                          onChange={(e) => handleSinglePriceChange(index, e)}
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Rings color="#ffffff" height={20} width={20} />
                    <span className="ml-2">Adding Product...</span>
                  </div>
                ) : (
                  "Add Product"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Admin Category Section */}
        <div className="mt-12">
          <AdminCategory />
        </div>

        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default AddProduct;
