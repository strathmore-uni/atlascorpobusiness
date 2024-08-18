import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseCategory from './WarehouseCategory';
import { useAuth } from '../MainOpeningpage/AuthContext';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import './dashboard.css'

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [summary, setSummary] = useState({
        stockamount: [],
        pendingOrders: [],
        mostOrderedProducts: [],
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const [
                    stockamountresponse,
                    pendingOrdersResponse,
                    mostOrderedProductsResponse,
                ] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/near-completion`, { params: { email: currentUser.email } }),
                    axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/pending`, { params: { email: currentUser.email } }),
                    axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/mostOrderedProducts`, { params: { email: currentUser.email } }),
                ]);

                const sortByDateDescending = (a, b) => new Date(b.created_at) - new Date(a.created_at);
                setSummary({
                    stockamount: stockamountresponse.data,
                    pendingOrders: pendingOrdersResponse.data.sort(sortByDateDescending),
                    mostOrderedProducts: mostOrderedProductsResponse.data,
                });
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };

        fetchSummary();
    }, [currentUser]);

    const lineData = {
        labels: summary.mostOrderedProducts.map(product => product.partnumber),
        datasets: [
            {
                label: 'Total Quantity Ordered',
                data: summary.mostOrderedProducts.map(product => product.total_quantity),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
        ],
    };

    const lineOptions = {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-summary">
                <h2 className="summary-heading">Order Summary</h2>
                <div className="pending-orders-section">
                    <h3 className="pending-orders-title">Pending Orders</h3>
                    <div className="pending-orders-list">
                        <ul>
                            {summary.pendingOrders.map(order => (
                                <Link to={`/warehouseordertails/${order.id}`} className="pending-order-link" key={order.id}>
                                    <li className="pending-order-item">
                                        Order Number: {order.ordernumber} Email: {order.email}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="stock-section">
                    <h2 className="stock-heading">Products with Near Completion Stock</h2>
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>Part Number</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Stock Quantity</th>
                                <th>Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.stockamount.map(product => (
                                <tr key={product.partnumber}>
                                    <td>{product.partnumber}</td>
                                    <td>{product.description}</td>
                                    <td>${Number(product.price).toFixed(2)}</td>
                                    <td>{product.stock_quantity}</td>
                                    <td>{product.country_code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="chart-section">
                    <h3 className="chart-title">Most Ordered Products</h3>
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>
            <WarehouseCategory />
        </div>
    );
};

export default Dashboard;
