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
    manageClearOrder: false,
    approve: false,
    pending: false,
    cancel: false,
    clear: false,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(true);

  const roles = ['Super Admin', 'Admin', 'Editor', 'Viewer', 'Support', 'Finance'];

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
      const {
        create_permission,
        read_permission,
        update_permission,
        delete_permission,
        manage_users_permission,
        manage_products_permission,
        manage_orders_permission,
        manage_clearorder_permission,
        approve_permission,
        pending_permission,
        cancel_permission,
        clear_permission,
      } = response.data;

      setPermissions({
        create: create_permission || false,
        read: read_permission || false,
        update: update_permission || false,
        delete: delete_permission || false,
        manageUsers: manage_users_permission || false,
        manageProducts: manage_products_permission || false,
        manageOrders: manage_orders_permission || false,
        manageClearOrder: manage_clearorder_permission || false,
        approve: approve_permission || false,
        pending: pending_permission || false,
        cancel: cancel_permission || false,
        clear: clear_permission || false,
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
        manage_clearorder_permission: permissions.manageClearOrder,
        approve_permission: permissions.approve,
        pending_permission: permissions.pending,
        cancel_permission: permissions.cancel,
        clear_permission: permissions.clear,
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
        manageClearOrder: false,
        approve: false,
        pending: false,
        cancel: false,
        clear: false,
      });
    } catch (error) {
      console.error('Error updating admin rights:', error);
      setError('Failed to update admin rights');
    }
  };

  const togglePermission = (permission) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] });
  };

  return (
    <div className="admin-rights-container">
      <h1 className="admin-rights-header">Admin Rights Management</h1>
      {error && <div className="error-message">{error}</div>}
      <table className="admins-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button className="view-permissions-button" onClick={() => handleViewPermissions(admin)}>View</button>
                <button className="edit-permissions-button" onClick={() => handleEditPermissions(admin)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAdmin && (
        <div className="permissions-form">
          <h2>{viewMode ? 'View' : 'Edit'} Permissions for {selectedAdmin.name}</h2>
          <form onSubmit={handleSave}>
            <div className="permission-cards">
              <div className="permission-card">
                <h3>General Permissions</h3>
                <div className="permission-toggle">
                  <label>Create</label>
                  <input
                    type="checkbox"
                    checked={permissions.create}
                    onChange={() => togglePermission('create')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Read</label>
                  <input
                    type="checkbox"
                    checked={permissions.read}
                    onChange={() => togglePermission('read')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Update</label>
                  <input
                    type="checkbox"
                    checked={permissions.update}
                    onChange={() => togglePermission('update')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Delete</label>
                  <input
                    type="checkbox"
                    checked={permissions.delete}
                    onChange={() => togglePermission('delete')}
                    disabled={viewMode}
                  />
                </div>
              </div>
              <div className="permission-card">
                <h3>Management Permissions</h3>
                <div className="permission-toggle">
                  <label>Manage Users</label>
                  <input
                    type="checkbox"
                    checked={permissions.manageUsers}
                    onChange={() => togglePermission('manageUsers')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Manage Products</label>
                  <input
                    type="checkbox"
                    checked={permissions.manageProducts}
                    onChange={() => togglePermission('manageProducts')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Manage Orders</label>
                  <input
                    type="checkbox"
                    checked={permissions.manageOrders}
                    onChange={() => togglePermission('manageOrders')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Manage Clear Order</label>
                  <input
                    type="checkbox"
                    checked={permissions.manageClearOrder}
                    onChange={() => togglePermission('manageClearOrder')}
                    disabled={viewMode}
                  />
                </div>
              </div>
              <div className="permission-card">
                <h3>Order Actions</h3>
                <div className="permission-toggle">
                  <label>Approve</label>
                  <input
                    type="checkbox"
                    checked={permissions.approve}
                    onChange={() => togglePermission('approve')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Pending</label>
                  <input
                    type="checkbox"
                    checked={permissions.pending}
                    onChange={() => togglePermission('pending')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Cancel</label>
                  <input
                    type="checkbox"
                    checked={permissions.cancel}
                    onChange={() => togglePermission('cancel')}
                    disabled={viewMode}
                  />
                </div>
                <div className="permission-toggle">
                  <label>Clear</label>
                  <input
                    type="checkbox"
                    checked={permissions.clear}
                    onChange={() => togglePermission('clear')}
                    disabled={viewMode}
                  />
                </div>
              </div>
            </div>
            {!viewMode && (
              <button className="save-permissions-button" type="submit">Save Permissions</button>
            )}
          </form>
          <AdminCategory categories={categories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
        </div>
      )}
      <AdminCategory />
    </div>
  );
};

export default AdminRightsManagement;
