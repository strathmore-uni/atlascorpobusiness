import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import AdminCategory from './AdminCategory';
import { useAuth } from '../MainOpeningpage/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { FaCheckCircle, FaTruck, FaWarehouse, FaBoxOpen, FaClipboardList, FaRegClock } from 'react-icons/fa';

const stepIcons = [FaClipboardList, FaCheckCircle, FaRegClock, FaWarehouse, FaTruck, FaCheckCircle];

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async (status) => {
    try {
      await axios.patch(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}/status`, { 
        status, 
        userEmail: currentUser.email 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setOrder((prevOrder) => ({
        ...prevOrder,
        Status: status
      }));
      
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.');
    }
  };

  const generatePDF = () => {
    if (!order) return;

    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Invoice', 14, 22); 

    pdf.setFontSize(12);
    pdf.text(`Company: Atlas Copco Limited`, 14, 32); 
    pdf.text(`Order Number: ${order.ordernumber}`, 14, 42); 
    pdf.text(`Customer Email: ${order.email}`, 14, 52); 

    pdf.text('', 14, 62); 

    pdf.text('Items', 14, 72);
    pdf.text('Quantity', 100, 72);
    pdf.text('Price', 140, 72);

    let y = 82;
    order.items.forEach(item => {
      pdf.text(item.description, 14, y);
      pdf.text(`${item.quantity}`, 100, y);
      pdf.text(`$${item.price ? item.price.toFixed(2) : 'N/A'}`, 140, y);
      y += 10;
    });

    y += 10;
    pdf.text('', 14, y);

    pdf.text(`Total Price: $${order.totalprice ? order.totalprice : 'N/A'}`, 14, y + 10);

    pdf.save(`Invoice for order ${order.ordernumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center text-red-600 mt-8">Order not found.</div>;
  }

  const orderSteps = [
    { name: 'Received', icon: FaClipboardList },
    { name: 'Approved', icon: FaCheckCircle },
    { name: 'Being Processed', icon: FaRegClock },
    { name: 'Released from Warehouse', icon: FaWarehouse },
    { name: 'On Transit', icon: FaTruck },
    { name: 'Cleared', icon: FaCheckCircle },
  ];
  const getStatusIndex = (status) => orderSteps.findIndex(step => step.name === status);
  const progressIndex = getStatusIndex(order.Status);
  const isCleared = order.Status === 'Cleared';

  const actions = [
    { label: 'Cleared', value: 'Cleared', color: 'bg-green-600', show: true },
    { label: 'Approve', value: 'Approved', color: 'bg-blue-600', show: isCleared },
    { label: 'Pending', value: 'Pending', color: 'bg-yellow-500', show: isCleared },
    { label: 'Decline', value: 'Declined', color: 'bg-red-600', show: isCleared },
    { label: 'Complete', value: 'Released from Warehouse', color: 'bg-indigo-600', show: isCleared },
  ];

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    await updateOrderStatus(actionType);
    setShowConfirmation(false);
  };

  const cancelAction = () => setShowConfirmation(false);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 md:ml-32 lg:ml-48">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sticky Sidebar: Order Summary & Actions */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 h-fit bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <div><span className="font-semibold">Order #:</span> {order.ordernumber}</div>
              <div><span className="font-semibold">Customer:</span> {order.email}</div>
              <div><span className="font-semibold">Order Date:</span> {new Date(order.created_at).toLocaleDateString()}</div>
              <div><span className="font-semibold">Shipping Address:</span> {order.city || 'N/A'}</div>
              <div className="text-lg font-bold text-blue-700 mt-2">Total: ${order.totalprice ? order.totalprice : 'N/A'}</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Order Status</h3>
            {/* Stepper */}
            <div className="flex items-center justify-between gap-2">
              {orderSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= progressIndex;
                return (
                  <div key={step.name} className="flex flex-col items-center flex-1">
                    <div className={`rounded-full w-9 h-9 flex items-center justify-center mb-1 border-2 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-400'}`}>
                      <Icon className="text-lg" />
                    </div>
                    <span className={`text-xs text-center ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>{step.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1">
              {orderSteps.map((step, idx) => (
                <span key={step.name} className="text-[10px] text-gray-400 w-12 text-center truncate">{step.name}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {actions.filter(a => a.show).map(action => (
              <button
                key={action.value}
                onClick={() => handleAction(action.value)}
                className={`w-full px-4 py-2 rounded font-semibold text-white ${action.color} hover:brightness-110 transition disabled:opacity-50`}
                disabled={action.value !== 'Cleared' && !isCleared}
              >
                {action.label}
              </button>
            ))}
            <button
              onClick={generatePDF}
              className="w-full px-4 py-2 rounded font-semibold bg-gray-800 text-white hover:bg-gray-900 transition mt-2"
              disabled={!isCleared}
            >
              Generate PDF
            </button>
            <Link to={`/order-history/${order.email}`} className="w-full block text-center mt-2 text-blue-600 hover:underline font-medium">
              View Customer Order History
            </Link>
          </div>
        </aside>

        {/* Main Content: Order Items Table */}
        <main className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {order.items && order.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-2"><img src={item.image || 'https://via.placeholder.com/40'} alt={item.description} className="w-12 h-12 object-cover rounded border" /></td>
                      <td className="px-4 py-2 font-medium text-gray-800">{item.description}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-blue-700 font-semibold">${item.price ? item.price.toFixed(2) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-10">
            <AdminCategory />
          </div>
        </main>
        <ToastContainer />
        {/* Modal */}
        <Modal
          isOpen={showConfirmation}
          onRequestClose={cancelAction}
          contentLabel="Confirm Action"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={cancelAction}>&times;</button>
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to {actionType} this order?</h3>
            <div className="flex justify-end gap-2">
              <button onClick={confirmAction} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Yes</button>
              <button onClick={cancelAction} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">No</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default OrderDetails;
