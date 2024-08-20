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

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_LOCAL}/api/monthly-sales`)
            .then(response => {
                console.log(response.data); // Log response data

                if (response.data && Array.isArray(response.data)) {
                    const data = response.data;
                    const labels = data.map(entry => `${entry.year}-${String(entry.month).padStart(2, '0')}`);
                    const sales = data.map(entry => entry.monthly_sales);

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

    return (
        <div style={{ padding: '20px', marginTop: '20px' }}>
            <h3 className="text-center">Monthly Sales Data (Past 5 Months)</h3>
            <Line data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }} />
        </div>
    );
}

export default MonthlySalesLineChart;
