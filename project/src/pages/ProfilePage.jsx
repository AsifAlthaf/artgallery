import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const Profile = () => {
  const { currentUser } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Fetch artworks uploaded by this user
      axios.get(`/api/artworks/user/${currentUser._id}`).then((res) => {
        setArtworks(res.data);
      });

      // Fetch orders made by this user
      axios.get(`/api/orders/user/${currentUser._id}`).then((res) => {
        setOrders(res.data);
      });
    }
  }, [currentUser]);

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* User Info */}
      <div className="flex items-center space-x-6 mb-10">
        <img
          src={currentUser.photoURL || currentUser.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">{currentUser.displayName || currentUser.name}</h1>
          <p className="text-gray-600">{currentUser.email}</p>
          <p className="mt-2">{currentUser.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* Artworks */}
      <h2 className="text-xl font-semibold mb-4">My Artworks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {artworks.map((art) => (
          <div key={art._id} className="border rounded-lg shadow p-4">
            <img src={art.imageUrl} alt={art.title} className="w-full h-48 object-cover rounded" />
            <h3 className="mt-2 font-medium">{art.title}</h3>
            <p className="text-sm text-gray-500">${art.price}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-lg shadow">
              <p className="font-medium">Order #{order._id}</p>
              <p>Status: {order.isPaid ? "Paid" : "Not Paid"} / {order.isDelivered ? "Delivered" : "Pending"}</p>
              <p>Total: ${order.totalPrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
