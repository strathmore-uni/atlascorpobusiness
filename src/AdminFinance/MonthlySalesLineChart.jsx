import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MonthlySalesLineChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastMonthSales, setLastMonthSales] = useState(0);
    const [thisMonthSales, setThisMonthSales] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_LOCAL}/api/monthly-sales`)
        .then(response => {
            if (response.data && Array.isArray(response.data)) {
                const data = response.data.slice(-5); // Ensure only the last 5 months are considered
                const labels = data.map(entry => `${entry.year}-${String(entry.month).padStart(2, '0')}`);
                const sales = data.map(entry => parseFloat(entry.monthly_sales));
                
                // Extract the sales for the last month and the current month
                const lastMonthData = data[data.length - 2] || { monthly_sales: 0 };
                const thisMonthData = data[data.length - 1] || { monthly_sales: 0 };

                // Ensure sales data is a number
                const lastMonthSalesValue = parseFloat(lastMonthData.monthly_sales) || 0;
                const thisMonthSalesValue = parseFloat(thisMonthData.monthly_sales) || 0;

                setLastMonthSales(lastMonthSalesValue);
                setThisMonthSales(thisMonthSalesValue);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Monthly Sales',
                            data: sales,
                            borderColor: '#007bff',
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            pointBackgroundColor: '#007bff',
                            fill: true,
                            tension: 0.4, // Smoother line
                            borderWidth: 2,
                        }
                    ]
                });
            } else {
                throw new Error("Invalid data format");
            }
        })
        .catch(error => {
            console.error('Error fetching monthly sales data:', error);
            setError('Could not fetch monthly sales data. Please try again later.');
        })
        .finally(() => setLoading(false));
    
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    // Determine color based on sales comparison
    const salesColor = thisMonthSales > lastMonthSales ? 'green' : 'red';

    return (
        <div style={{ padding: '20px', marginTop: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h3 className="text-center">Monthly Sales Data (Past 5 Months)</h3>
            <div className="sales-info-container">   
                <div style={{ color: salesColor }}>
                    <small>This Month:</small> ${thisMonthSales.toFixed(2)}
                </div>
                <div>
                    <small>Last Month:</small> ${lastMonthSales.toFixed(2)}
                </div>
            </div>

            <Line 
                data={chartData} 
                options={{
                    responsive: true,
                    maintainAspectRatio: true, // Keep aspect ratio to prevent stretching
                    scales: {
                        x: {
                            type: 'category',
                            labels: chartData.labels,
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Month',
                            },
                            ticks: {
                                maxTicksLimit: 5, // Limit the number of X-axis labels to 5
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Sales',
                            },
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Sales: $${tooltipItem.formattedValue}`;
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1000, // Smooth animation
                        easing: 'easeInOutQuad',
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                }} 
            />
        </div>
    );
}

export default MonthlySalesLineChart;
