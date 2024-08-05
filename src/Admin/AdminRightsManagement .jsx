import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminRightsManagement.css';

const AdminRightsManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissions, setPermissions] = useState({
    create: false,
    read: true,
    update: false,
    delete: false,
  });
  const [role, setRole] = useState('Viewer');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admins`);
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const handleEdit = (adminId) => {
    const admin = admins.find(a => a.id === adminId);
    setSelectedAdmin(admin);
    setPermissions({
      create: admin.create_permission,
      read: admin.read_permission,
      update: admin.update_permission,
      delete: admin.delete_permission,
    });
    setRole(admin.role);
  };

  const handleRevoke = async (adminId) => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/revoke`, { user_id: adminId });
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
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/rights`, {
        user_id: selectedAdmin.id,
        role,
        ...permissions
      });
      alert('Admin rights updated successfully');
      setAdmins(admins.map(admin =>
        admin.id === selectedAdmin.id ? { ...admin, role, ...permissions } : admin
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
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
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
