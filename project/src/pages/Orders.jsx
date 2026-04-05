import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Clock, MapPin, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [currentUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-artbloom-cream">
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artbloom-peach"></div>
        </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Package className="w-8 h-8 text-artbloom-peach mr-3" />
          <h1 className="text-4xl font-playfair font-bold text-artbloom-charcoal">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders. Start expanding your art collection!</p>
            <Link 
              to="/discover" 
              className="inline-block bg-orange-500 text-white font-medium py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
            >
              Discover Art
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="font-semibold text-artbloom-peach">${parseFloat(order.totalPrice).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Order # {order._id.substring(order._id.length - 8)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mb-6 flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Shipping To</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.address}, {order.shippingAddress.city},<br/>
                          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <img loading="lazy"
                            src={item.imageUrl || item.image || "/placeholder.png"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h5 className="font-playfair font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                            <p className="text-gray-900 font-medium ml-4">${parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Footer - Actions */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => toast.success('Tracking details will be sent via email.')}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-1.5" />
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      </div>
  );
};

export default Orders;
