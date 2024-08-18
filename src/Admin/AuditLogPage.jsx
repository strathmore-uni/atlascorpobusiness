import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuditLogPage.css'; // Import your CSS file for styling

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'all'
  const [categories] = useState(['all', 'product', 'system']); // Define available categories

  // New filter states
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [changedByFilter, setChangedByFilter] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        let response;

        // Construct the query parameters
        const queryParams = new URLSearchParams({
          date: dateFilter,
          time: timeFilter,
          changed_by: changedByFilter,
        }).toString();

        // Determine which API to call based on the selected category
        if (selectedCategory === 'product') {
          // Fetch product audit logs
          response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/product-audit-logs?${queryParams}`);
        } else if (selectedCategory === 'system') {
          // Fetch system audit logs
          response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/audit-logs?${queryParams}`);
        } else {
          // Fetch all audit logs
          response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/all-audit-logs?${queryParams}`);
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
  }, [selectedCategory, dateFilter, timeFilter, changedByFilter]);

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

        {/* Filter Inputs */}
        <div className="filters">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Date"
          />
          <input
            type="time"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            placeholder="Time"
          />
          <input
            type="text"
            value={changedByFilter}
            onChange={(e) => setChangedByFilter(e.target.value)}
            placeholder="Changed By"
          />
        </div>

        {isLoading ? (
          /* From Uiverse.io by abrahamcalsin */ 
/* From Uiverse.io by mrhyddenn */ 
<div class="spinner center">
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
</div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="audit-log-list">
            {logs.map((log) => (
              <div className="audit-log-line" key={log.id}>
                <span className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</span> | 
                <span className="log-email">{log.email}</span> | 
                <span className="log-changed-by">{log.changed_by}</span> |
                <span className="log-action">{log.action}</span> | 
                <span className={`log-success ${log.success ? 'success' : 'failure'}`}>{log.success ? 'Success' : 'Failed'}</span> | 
                <span className="log-ip">{log.ip_address}</span>
                <span className="log-details">{log.details}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
