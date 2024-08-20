import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const WeeklySalesChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const startOfCurrentMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfCurrentMonth = moment().endOf('month').format('YYYY-MM-DD');
        const startOfPreviousMonth = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        const endOfPreviousMonth = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

        const fetchData = async () => {
            try {
                const currentMonthResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/weekly-sales?start_date=${startOfCurrentMonth}&end_date=${endOfCurrentMonth}`);
                const previousMonthResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/weekly-sales?start_date=${startOfPreviousMonth}&end_date=${endOfCurrentMonth}`);

                const currentMonthData = currentMonthResponse.data;
                const previousMonthData = previousMonthResponse.data;

                const allWeeks = [
                    ...new Set([
                        ...previousMonthData.map(entry => entry.year_week),
                        ...currentMonthData.map(entry => entry.year_week)
                    ])
                ].sort();

                const currentMonthSales = allWeeks.map(week => {
                    const weekData = currentMonthData.find(entry => entry.year_week === week);
                    return weekData ? weekData.weekly_sales : 0;
                });

                const previousMonthSales = allWeeks.map(week => {
                    const weekData = previousMonthData.find(entry => entry.year_week === week);
                    return weekData ? weekData.weekly_sales : 0;
                });

                setChartData({
                    labels: allWeeks,
                    datasets: [
                        {
                            label: 'Current Month Sales',
                            data: currentMonthSales,
                            borderColor: '#007bff',
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            pointBackgroundColor: '#007bff',
                            fill: true,
                        },
                        {
                            label: 'Previous Month Sales',
                            data: previousMonthSales,
                            borderColor: '#ff0000',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            pointBackgroundColor: '#ff0000',
                            fill: true,
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching weekly sales data:', error);
                setError('Could not fetch weekly sales data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={styles.centered}><div style={styles.spinner}></div></div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Weekly Sales Data (Current and Previous Month)</h2>
            <div style={styles.chartContainer}>
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
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
        </div>
    );
}

const styles = {
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    spinner: {
        border: '8px solid #f3f3f3',
        borderRadius: '50%',
        borderTop: '8px solid #3498db',
        width: '60px',
        height: '60px',
        animation: 'spin 2s linear infinite',
    },
    error: {
        textAlign: 'center',
        color: '#ff0000',
        padding: '20px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        margin: '20px',
    },
    card: {
        padding: '20px',
        marginTop: '20px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        transition: '0.3s',
        borderRadius: '10px',
        backgroundColor: '#fff',
        maxWidth: '800px',
        margin: 'auto'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333'
    },
    chartContainer: {
        position: 'relative',
        height: '400px',
        width: '100%',
    }
};

export default WeeklySalesChart;
