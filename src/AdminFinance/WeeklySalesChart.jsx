import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const WeeklySalesChart = () => {
    const [chartData, setChartData] = useState(null); // Initialize chartData as null
    const [error, setError] = useState(null); // To handle errors

    useEffect(() => {
        // Get the first day of the current month
        const startOfCurrentMonth = moment().startOf('month').format('YYYY-MM-DD');
        // Get the first day of the previous month
        const startOfPreviousMonth = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        // Get the last day of the current month
        const endOfCurrentMonth = moment().endOf('month').format('YYYY-MM-DD');

        // Fetch the sales data
        axios.get(`/api/weekly-sales?start_date=${startOfPreviousMonth}&end_date=${endOfCurrentMonth}`)
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    const data = response.data;
                    const weeks = data.map(entry => entry.year_week);
                    const sales = data.map(entry => entry.weekly_sales);

                    setChartData({
                        labels: weeks,
                        datasets: [
                            {
                                label: 'Weekly Sales',
                                data: sales,
                                borderColor: 'rgba(75,192,192,1)',
                                backgroundColor: 'rgba(75,192,192,0.2)',
                                fill: true,
                            }
                        ]
                    });
                } else {
                    throw new Error("Invalid data format");
                }
            })
            .catch(error => {
                console.error('Error fetching weekly sales data:', error);
                setError('Could not fetch weekly sales data.');
            });
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!chartData) {
        return <div>Loading...</div>; // Show loading state while data is being fetched
    }

    return (
        <div>
            <h2>Weekly Sales Data (Current and Previous Month)</h2>
            <Line data={chartData} />
        </div>
    );
}

export default WeeklySalesChart;
