import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orderstats.css'

const OrderTransitCount = () => {
    const [totalOrdersTransit, setTotalOrdersTransit] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/order-transit-count`);
                console.log('API Response:', response.data); // Check the API response format

                setTotalOrdersTransit(response.data.total_orders_transit);
            } catch (error) {
                console.error('Error fetching order transit count:', error);
                setError('Could not fetch order transit count. Please try again later.');
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

    return (
        <div className="order-transit-container">
            <h3 className="text-center">Orders In Transit</h3>
            <div className="transit-count">
                <strong>Total Orders In Transit:</strong> {totalOrdersTransit}
            </div>
        </div>
    );
}

export default OrderTransitCount;
