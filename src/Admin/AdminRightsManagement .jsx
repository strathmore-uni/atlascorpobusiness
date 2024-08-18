import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminRightsManagement.css';
import AdminCategory from './AdminCategory';

const AdminRightsManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissions, setPermissions] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
    manageUsers: false,
    manageProducts: false,
    manageOrders: false,
  });
  const [categories, setCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(true);

  const roles = ['Super Admin', 'admin', 'Editor', 'Viewer', 'Support', 'Finance'];

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admins`);
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to fetch admins');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      }
    };

    fetchAdmins();
    fetchCategories();
  }, []);

  const fetchAdminRights = async (adminId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/permissions/${adminId}`);
      const { create_permission, read_permission, update_permission, delete_permission, role,
              manage_users_permission, manage_products_permission, manage_orders_permission } = response.data;
  
      setPermissions({
        create: create_permission || false,
        read: read_permission || false,
        update: update_permission || false,
        delete: delete_permission || false,
        manageUsers: manage_users_permission || false,
        manageProducts: manage_products_permission || false,
        manageOrders: manage_orders_permission || false,
      });
  
      // Assuming categories come in a different field or need separate fetching
      // If categories are included in the response, adjust this line accordingly
      // setSelectedCategories(response.data.categories || []);
  
    } catch (error) {
      console.error('Error fetching admin rights:', error);
      setError('Failed to fetch admin rights');
    }
  };
  

  const handleViewPermissions = async (admin) => {
    setSelectedAdmin(admin);
    await fetchAdminRights(admin.id);
    setViewMode(true);
  };

  const handleEditPermissions = async (admin) => {
    setSelectedAdmin(admin);
    await fetchAdminRights(admin.id);
    setViewMode(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/permissions`, {
        user_id: selectedAdmin.id,
        role: selectedAdmin.role,
        create_permission: permissions.create,
        read_permission: permissions.read,
        update_permission: permissions.update,
        delete_permission: permissions.delete,
        manage_users_permission: permissions.manageUsers,
        manage_products_permission: permissions.manageProducts,
        manage_orders_permission: permissions.manageOrders,
        categories: selectedCategories,
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
        manageUsers: false,
        manageProducts: false,
        manageOrders: false,
      });
      setSelectedCategories([]);
      setViewMode(true);
    } catch (error) {
      console.error('Error updating admin rights:', error);
      setError('Failed to update admin rights');
    }
  };

  const handlePermissionChange = (permission, value) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(category => category !== value);
      }
    });
  };
  const handleSuspendAdmin = async (admin, suspend) => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/suspend`, {
        adminId: admin.id,
        suspend,
      });
      alert(`Admin ${suspend ? 'suspended' : 'reactivated'} successfully`);
      setAdmins(admins.map(a =>
        a.id === admin.id ? { ...a, is_suspended: suspend } : a
      ));
    } catch (error) {
      console.error('Error updating admin status:', error);
      setError('Failed to update admin status');
    }
  };

  return (
    <div>
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
                    <button onClick={() => handleViewPermissions(admin)}>View Permissions</button>
                    <button onClick={() => handleEditPermissions(admin)}>Edit Permissions</button>
                    <button onClick={() => handleSuspendAdmin(admin, !admin.is_suspended)}>
                      {admin.is_suspended ? 'Reactivate' : 'Suspend'}
                    </button>
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
            <div>
              <label>Manage Users:</label>
              <input
                type="checkbox"
                checked={permissions.manageUsers}
                onChange={(e) => handlePermissionChange('manageUsers', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            <div>
              <label>Manage Products:</label>
              <input
                type="checkbox"
                checked={permissions.manageProducts}
                onChange={(e) => handlePermissionChange('manageProducts', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            <div>
              <label>Manage Orders:</label>
              <input
                type="checkbox"
                checked={permissions.manageOrders}
                onChange={(e) => handlePermissionChange('manageOrders', e.target.checked)}
                disabled={viewMode}
              />
            </div>
            {/* Categories Selection */}
            {!viewMode && (
              <div>
                <label>Categories:</label>
                {Array.isArray(categories) && categories.map(category => (
  <div key={category}>
    <input
      type="checkbox"
      value={category}
      checked={selectedCategories.includes(category)}
      onChange={handleCategoryChange}
      disabled={viewMode}
    />
    <label>{category}</label>
  </div>
))}

              </div>
            )}
            {error && <p className="error">{error}</p>}
            {!viewMode && <button type="submit">Save Changes</button>}
          </form>
        </div>
      )}
    </div>
    <AdminCategory />
      </div>
   
  );
};

export default AdminRightsManagement