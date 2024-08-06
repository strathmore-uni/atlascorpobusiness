import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuditLogPage.css'; // Import your CSS file for styling

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'all'
  const [categories] = useState(['all', 'admin', 'product', 'system']); // Define available categories

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        let response;
        if (selectedCategory === 'product') {
          response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/product-audit-logs`);
        } else {
          response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/audit-logs`, {
            params: { category: selectedCategory },
          });
        }
        setLogs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setError('Failed to fetch audit logs.');
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [selectedCategory]);

  return (
    <div className="audit-log-page">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'active' : ''}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
        </ul>
      </div>
      <div className="logs-content">
        <h1>Audit Logs</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="audit-log-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Action</th>
                <th>Success</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.email}</td>
                  <td>{log.action}</td>
                  <td>{log.success ? 'Yes' : 'No'}</td>
                  <td>{log.ip_address}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
