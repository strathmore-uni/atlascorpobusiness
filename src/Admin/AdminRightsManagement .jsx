import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminRightsManagement.css'; // Import your CSS file

const AdminRightsManagement = () => {
  const [admins, setAdmins] = useState([]);
  
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissions, setPermissions] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
  });
  const [error, setError] = useState('');

  // Define roles and permissions
  const roles = ['Admin', 'Editor', 'Viewer'];
  
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admins`);
        console.log('API Response:', response.data);
  
        if (Array.isArray(response.data)) {
          setAdmins(response.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          setAdmins([]); // Ensure admins is always an array
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        setAdmins([]); // Ensure admins is always an array
      }
    };
  
    fetchAdmins();
  }, []);
  
  
  
  

  const handleEdit = (adminId) => {
    const admin = admins.find(a => a.id === adminId);
    setSelectedAdmin(admin);
    setPermissions(admin.permissions || {
      create: false,
      read: false,
      update: false,
      delete: false,
    });
  };

  const handleRevoke = async (adminId) => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/revoke`, { id: adminId });
      alert('Rights revoked successfully');
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error('Error revoking rights:', error);
      setError('Failed to revoke rights');
    }
  };

  const handlePermissionChange = (permission, value) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/update`, {
        id: selectedAdmin.id,
        role: selectedAdmin.role,
        permissions
      });
      alert('Admin rights updated successfully');
      setAdmins(admins.map(admin =>
        admin.id === selectedAdmin.id ? { ...admin, permissions } : admin
      ));
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error updating admin rights:', error);
      setError('Failed to update admin rights');
    }
  };

  return (
    <div className="admin-rights-management">
      <h2>Manage Admin Rights</h2>
      
      {/* Admin List */}
      <div className="admin-list">
        <input type="text" placeholder="Search admins" />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    <button onClick={() => handleEdit(admin.id)}>Edit</button>
                    <button onClick={() => handleRevoke(admin.id)}>Revoke</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No admins found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Edit Admin Rights */}
      {selectedAdmin && (
        <div className="edit-admin">
          <h3>Edit Admin Rights</h3>
          <form onSubmit={handleSave}>
            <div>
              <label>Name:</label>
              <input type="text" value={selectedAdmin.name} readOnly />
            </div>
            <div>
              <label>Role:</label>
              <select
                value={selectedAdmin.role}
                onChange={(e) => setSelectedAdmin(prev => ({ ...prev, role: e.target.value }))}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Permissions:</label>
              <div>
                <label><input type="checkbox" checked={permissions.create} onChange={(e) => handlePermissionChange('create', e.target.checked)} /> Create</label>
                <label><input type="checkbox" checked={permissions.read} onChange={(e) => handlePermissionChange('read', e.target.checked)} /> Read</label>
                <label><input type="checkbox" checked={permissions.update} onChange={(e) => handlePermissionChange('update', e.target.checked)} /> Update</label>
                <label><input type="checkbox" checked={permissions.delete} onChange={(e) => handlePermissionChange('delete', e.target.checked)} /> Delete</label>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
  
};

export default AdminRightsManagement;
