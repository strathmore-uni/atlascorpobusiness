import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoggedInUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoggedInUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/logged-in-users`);
        setUsers(response.data.data);
      } catch (err) {
        setError("Error fetching logged-in users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Logged-In Users</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Login Time</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.email}</td>
                <td>{new Date(user.login_time).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No recent logins</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoggedInUsers;
