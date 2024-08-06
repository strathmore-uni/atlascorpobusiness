import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminRightsManagement.css';

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
  const [viewMode, setViewMode] = useState(true); // True for viewing, false for editing

  const roles = ['Admin', 'Editor', 'Viewer'];

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admins`);
        console.log('Fetched admins:', response.data);
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to fetch admins');
      }
    };

    fetchAdmins();
  }, []);

  const handleViewPermissions = async (adminId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admins/${adminId}/permissions`);
      setSelectedAdmin(admins.find(a => a.id === adminId));
      setPermissions({
        create: response.data.create_permission || false,
        read: response.data.read_permission || false,
        update: response.data.update_permission || false,
        delete: response.data.delete_permission || false,
      });
      setViewMode(true);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Failed to fetch permissions');
    }
  };

  const handleEditPermissions = async (adminId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admins/${adminId}/permissions`);
      setSelectedAdmin(admins.find(a => a.id === adminId));
      setPermissions({
        create: response.data.create_permission || false,
        read: response.data.read_permission || false,
        update: response.data.update_permission || false,
        delete: response.data.delete_permission || false,
      });
      setViewMode(false); // Switch to edit mode
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Failed to fetch permissions');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/update`, {
        user_id: selectedAdmin.id,
        create_permission: permissions.create,
        read_permission: permissions.read,
        update_permission: permissions.update,
        delete_permission: permissions.delete,
      });
      alert('Admin rights updated successfully');
      setAdmins(admins.map(admin =>
        admin.id === selectedAdmin.id ? { ...admin, permissions } : admin
      ));
      setSelectedAdmin(null);
      setPermissions({
        create: false,
        read: false,
        update: false,
        delete: false,
      });
      setViewMode(true);
    } catch (error) {
      console.error('Error updating admin rights:', error);
      setError('Failed to update admin rights');
    }
  };

  const handlePermissionChange = (permission, value) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
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
                    <button onClick={() => handleViewPermissions(admin.id)}>View Permissions</button>
                    <button onClick={() => handleEditPermissions(admin.id)}>Edit Permissions</button>
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

      {/* Admin Permissions */}
      {selectedAdmin && (
        <div className="admin-permissions">
          <h3>{viewMode ? 'View Admin Rights' : 'Edit Admin Rights'}</h3>
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
                disabled={viewMode}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Create:</label>
              <input
                type="checkbox"
                checked={permissions.create}
                onChange={(e) => handlePermissionChange('create', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            <div>
              <label>Read:</label>
              <input
                type="checkbox"
                checked={permissions.read}
                onChange={(e) => handlePermissionChange('read', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            <div>
              <label>Update:</label>
              <input
                type="checkbox"
                checked={permissions.update}
                onChange={(e) => handlePermissionChange('update', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            <div>
              <label>Delete:</label>
              <input
                type="checkbox"
                checked={permissions.delete}
                onChange={(e) => handlePermissionChange('delete', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            {error && <p className="error">{error}</p>}
            {!viewMode && <button type="submit">Save Changes</button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRightsManagement;
