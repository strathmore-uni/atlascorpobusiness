import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

const CompanyComparisonChart = ({ adminEmail }) => {
  const [ordersChartData, setOrdersChartData] = useState({ labels: [], datasets: [] });
  const [salesChartData, setSalesChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/company-orders-count-chart`, {
          params: { email: adminEmail },
        });

        const data = response.data;

        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        // Organize data for the chart
        const months = Array.from(new Set(data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`))).sort();

        // Calculate total sales for each company
        const totalSalesByCompany = data.reduce((acc, item) => {
          const key = item.company_name;
          if (!acc[key]) acc[key] = 0;
          acc[key] += item.total_sales;
          return acc;
        }, {});

        // Get the top 3 companies by total sales
        const topCompanies = Object.entries(totalSalesByCompany)
          .sort(([, salesA], [, salesB]) => salesB - salesA)
          .slice(0, 3)
          .map(([company]) => company);

        // Create data for orders and sales
        const ordersData = topCompanies.map(company => {
          return months.map(month => {
            const companyData = data.find(item => item.company_name === company && `${item.year}-${item.month.toString().padStart(2, '0')}` === month);
            return companyData ? companyData.order_count : 0;
          });
        });

        const salesData = topCompanies.map(company => {
          return months.map(month => {
            const companyData = data.find(item => item.company_name === company && `${item.year}-${item.month.toString().padStart(2, '0')}` === month);
            return companyData ? companyData.total_sales : 0;
          });
        });

        // Set data for the orders chart
        setOrdersChartData({
          labels: months,
          datasets: topCompanies.map((company, i) => ({
            label: `${company} Orders`,
            data: ordersData[i],
            backgroundColor: generateRandomColor(),
            borderWidth: 1,
          })),
        });

        // Set data for the sales chart
        setSalesChartData({
          labels: months,
          datasets: topCompanies.map((company, i) => ({
            label: `${company} Sales`,
            data: salesData[i],
            backgroundColor: generateRandomColor(),
            borderWidth: 1,
          })),
        });

      } catch (error) {
        console.error("Error fetching company orders count", error);
      }
    };

    fetchData();
  }, [adminEmail]);

  return (
    <div className="country_comparison_container" >
      <h3>Top 3 Companies Orders (Last 4 Months)</h3>
      <Bar data={ordersChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Orders' } } }} />

      <h3>Top 3 Companies Sales (Last 4 Months)</h3>
      <Bar data={salesChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Sales' } } }} />
    </div>
  );
};

export default CompanyComparisonChart;
