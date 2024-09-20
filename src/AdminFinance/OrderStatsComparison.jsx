import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orderstats.css';

const OrderStatsComparison = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/order-stats`);
               
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const data = response.data[0]; // Access the first item in the array

                    // Extract and convert the values to numbers
                    const totalOrdersValue = parseInt(data.total_orders, 10);
                    const completedOrdersValue = parseInt(data.completed_orders, 10);

                    setTotalOrders(totalOrdersValue);
                    setCompletedOrders(completedOrdersValue);
                } else {
                    throw new Error('No data available');
                }
            } catch (error) {
                console.error('Error fetching order stats:', error);
                setError('Could not fetch order stats. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    // Calculate the completion percentage, avoid division by zero
    const completionPercentage = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return (
        <div className="order-stats-container">
            <h3 className="text-center">Order Completion Stats</h3>
            <div className="stats-details">
                <div>
                    <strong>Total Orders:</strong> {totalOrders}
                </div>
                <div>
                    <strong>Completed Orders:</strong> {completedOrders}
                </div>
                <div className="stats-percentage">
                    <strong>Completion Rate:</strong> {completionPercentage.toFixed(2)}%
                </div>
            </div>
            <div className="comparison-bar-container">
                <div className="comparison-bar">
                    <div
                        className="comparison-bar-fill"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default OrderStatsComparison;
