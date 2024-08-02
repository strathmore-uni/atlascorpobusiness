import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './countrycomparison.css';
import AdminCategory from  "./AdminCategory"

const CountryComparison = () => {
  const [countries, setCountries] = useState([]);
  const [comparisonData, setComparisonData] = useState({});
  const [productComparisonData, setProductComparisonData] = useState({});
  const [error, setError] = useState(null);
  const [compareOrders, setCompareOrders] = useState(true);
  const [compareUsers, setCompareUsers] = useState(true);
  const [compareProducts, setCompareProducts] = useState(false);

  const handleCompare = async () => {
    if (countries.length < 2) {
      setError("Please select at least two countries for comparison");
      return;
    }

    if (!compareOrders && !compareUsers && !compareProducts) {
      setError("Please select at least one comparison criteria (orders, users, or products)");
      return;
    }

    try {
      // Fetch comparison data
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/compare-countries`, {
        params: { countries }
      });
      setComparisonData(response.data);

      // Fetch product comparison data if needed
      if (compareProducts) {
        const productResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/compare-products`, {
          params: { countries }
        });
        setProductComparisonData(productResponse.data);
      }

      setError(null); // Clear previous errors
    } catch (error) {
      setError("Error fetching comparison data");
      console.error("Error fetching comparison data:", error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountries = Array.from(e.target.selectedOptions, option => option.value);
    setCountries(selectedCountries);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'orders') {
      setCompareOrders(checked);
    } else if (name === 'users') {
      setCompareUsers(checked);
    } else if (name === 'products') {
      setCompareProducts(checked);
    }
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: Object.keys(comparisonData),
    datasets: [
      compareOrders && {
        label: 'Number of Orders',
        data: Object.values(comparisonData).map(data => data.order_count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      compareUsers && {
        label: 'Number of Users',
        data: Object.values(comparisonData).map(data => data.user_count),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ].filter(Boolean), // Remove any undefined datasets
  };

  const productChartData = {
    labels: Object.keys(productComparisonData),
    datasets: Object.keys(productComparisonData[Object.keys(productComparisonData)[0]] || {}).map(product => ({
      label: product,
      data: Object.keys(productComparisonData).map(country => productComparisonData[country][product] || 0),
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fill: false,
    })),
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div  className='container_comparison'>
      <h1>Compare Countries</h1>
      <select className='select_comparison' multiple={true} onChange={handleCountryChange} value={countries} style={{ width: '100%', height: '100px' }}>
        <option value="UG">Uganda</option>
        <option value="KE">Kenya</option>
        <option value="TZ">Tanzania</option>
        {/* Add more options as needed */}
      </select>
      <div>
        <label>
          <input
            type="checkbox"
            name="orders"
            checked={compareOrders}
            onChange={handleCheckboxChange}
          />
          Compare Orders
        </label>
        <label>
          <input
            type="checkbox"
            name="users"
            checked={compareUsers}
            onChange={handleCheckboxChange}
          />
          Compare Users
        </label>
        <label>
          <input
            type="checkbox"
            name="products"
            checked={compareProducts}
            onChange={handleCheckboxChange}
          />
          Compare Products
        </label>
      </div>
      <button onClick={handleCompare} className='btn_compare' style={{ margin: '20px 0' }}>Compare</button>

      {error && <p className="error-message">{error}</p>}
      {Object.keys(comparisonData).length > 0 && (
        <div>
          <h2>Comparison Table</h2>
          <table>
            <thead>
              <tr>
                <th>Country</th>
                {compareOrders && <th>Number of Orders</th>}
                {compareUsers && <th>Number of Users</th>}
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparisonData).map(([country, data]) => (
                <tr key={country}>
                  <td>{country}</td>
                  {compareOrders && <td>{data.order_count}</td>}
                  {compareUsers && <td>{data.user_count}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          {compareProducts && (
            <div>
              <h2>Product Comparison Line Graph</h2>
              <div style={{ height: '300px' }}>
                <Line data={productChartData} options={lineChartOptions} />
              </div>
            </div>
          )}

          <h2>Comparison Line Graph</h2>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      )}
      <AdminCategory />
    </div>
  );
};

export default CountryComparison;
