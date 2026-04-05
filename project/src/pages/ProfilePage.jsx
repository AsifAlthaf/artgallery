import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { MapPin, Heart, Package, Upload, LogOut, Settings, ChevronRight, Trash2, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/AdminDashboard";

// Cloudinary image optimizer for instant loading
const optimizeCloudinaryUrl = (url, width = 800) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && !url.includes('/upload/q_auto')) {
        return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
    }
    return url;
};

const confirmDelete = (onConfirm) => {
  if (window.confirm("Are you sure you want to delete this artwork?")) {
    onConfirm();
  }
};

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const ProfilePage = () => {
  const { currentUser, login, logout } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Layout Tab State
  const [activeTab, setActiveTab] = useState("uploads"); // 'uploads', 'orders', 'favorites', 'address'

  // Edit State
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', category: '', description: '' });

  // Profile Edit State
  const [profileEditForm, setProfileEditForm] = useState({ name: '', username: '' });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Address State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', customLabel: '', address: '', city: '', postalCode: '', country: '', isDefault: false });

  const handleSaveAddress = async () => {
      try {
          if (!addressForm.address || !addressForm.city || !addressForm.postalCode || !addressForm.country) {
              return toast.error("Please fill all required fields");
          }
          if (addressForm.label === 'Other' && !addressForm.customLabel) {
              return toast.error("Please name your custom address");
          }
          const finalLabel = addressForm.label === 'Other' ? addressForm.customLabel : addressForm.label;
          const newAddress = {
            label: finalLabel,
            address: addressForm.address,
            city: addressForm.city,
            postalCode: addressForm.postalCode,
            country: addressForm.country,
            isDefault: addressForm.isDefault
          };
          const { data } = await axios.put('/api/users/profile', { newAddress }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
          setAddresses(data.addresses || []);
          setIsAddressModalOpen(false);
          setAddressForm({ label: 'Home', customLabel: '', address: '', city: '', postalCode: '', country: '', isDefault: false });
          toast.success("Address added successfully!");
      } catch (e) {
          toast.error("Failed to add address");
      }
  };

  const handleOpenProfileEdit = () => {
     setProfileEditForm({
         name: currentUser?.name || currentUser?.displayName || '',
         username: currentUser?.username || ''
     });
     setIsProfileModalOpen(true);
  };

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const [profileRes, artRes, ordRes, favRes] = await Promise.all([
            axios.get(`/api/users/profile`, config).catch(() => ({ data: currentUser })),
            axios.get(`/api/artworks/user/${currentUser._id || currentUser.uid}`, config).catch(() => ({ data: [] })),
            axios.get(`/api/orders/myorders`, config).catch(() => ({ data: [] })),
            axios.get(`/api/users/favorites`, config).catch(() => ({ data: [] }))
          ]);
          
          if (profileRes.data) {
              currentUser.followers = profileRes.data.followers || [];
              currentUser.following = profileRes.data.following || [];
              currentUser.photoURL = profileRes.data.profilePicture || currentUser.photoURL;
              setAddresses(profileRes.data.addresses || []);
          }

          setArtworks(Array.isArray(artRes.data) ? artRes.data : []);
          setOrders(Array.isArray(ordRes.data) ? ordRes.data : []);
          setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [currentUser]);

  const handleDeleteArtwork = async (id) => {
    confirmDelete(async () => {
      try {
        await axios.delete(`/api/artworks/${id}`, getAuthConfig());
        setArtworks(artworks.filter(art => art._id !== id));
      } catch (error) {
        console.error("Failed to delete artwork:", error);
        toast.error(error.response?.data?.message || "Failed to delete artwork");
      }
    });
  };

  const removeFromFavorites = async (id) => {
      try {
          await axios.delete(`/api/users/favorites/${id}`, getAuthConfig());
          setFavorites(favorites.filter(fav => fav._id !== id));
      } catch (error) {
          console.error("Error removing favorite:", error);
      }
  };

  const handleEditClick = (art) => {
      setEditingArtwork(art);
      setEditForm({
          title: art.title,
          price: art.price,
          category: art.category,
          description: art.description || ''
      });
  };

  const handleUpdateArtwork = async () => {
      if (!editingArtwork) return;
      
      try {
          await axios.put(`/api/artworks/${editingArtwork._id}`, {
              ...editForm,
              category: editForm.category.toLowerCase()
        }, getAuthConfig());
          
          setArtworks(artworks.map(art => 
              art._id === editingArtwork._id ? { ...art, ...editForm } : art
          ));
          setEditingArtwork(null);
      } catch (error) {
          console.error("Update error:", error);
      }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return <div className="min-h-screen flex items-center justify-center p-8"><p className="text-gray-500 animate-pulse font-medium text-lg">Signing out securely...</p></div>;

  // SYSTEM ADMIN OVERRIDE DIRECTIVE
  if (currentUser.role === 'admin') {
      return <AdminDashboard />;
  }

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 font-medium">
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}`} />
        {label}
      </div>
      <ChevronRight className={`w-4 h-4 ${activeTab === id ? 'text-orange-400 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'} transition-all`} />
    </button>
  );

  const generateActivityData = () => {
     const days = 7;
     const data = [];
     for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const count = artworks.filter(art => {
           if (!art.createdAt) return false;
           const artDate = new Date(art.createdAt);
           return artDate.getDate() === d.getDate() && artDate.getMonth() === d.getMonth() && artDate.getFullYear() === d.getFullYear();
        }).length;
        
        data.push({
           date: format(d, 'MMM d'),
           count: count,
           height: count > 0 ? Math.max(25, (count / Math.max(1, artworks.length)) * 100) : 10
        });
     }
     return data;
  };
  
  const activityData = generateActivityData();

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR - SaaS Styling */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-100 flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <img loading="lazy"
                  src={optimizeCloudinaryUrl(currentUser.photoURL || currentUser.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", 300)}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-orange-50 shadow-md"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{currentUser?.name || currentUser?.displayName || "ArtBloom User"}</h1>
              <p className="text-sm font-bold text-orange-500 mb-4">@{currentUser?.username || currentUser?.name?.toLowerCase().replace(/\s+/g,'_') || "user"}</p>
              
              <div className="w-full flex justify-center gap-6 py-4 border-t border-b border-gray-50 mb-4">
                <div>
                  <p className="text-lg font-bold text-gray-900">{currentUser.followers?.length || 0}</p>
                  <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{currentUser.following?.length || 0}</p>
                  <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Following</p>
                </div>
              </div>

              <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenProfileEdit} variant="outline" className="w-full rounded-full font-medium shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all border-gray-200 mt-4">
                    Edit Public Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="font-playfair text-2xl">Edit Profile</DialogTitle>
                    <DialogDescription className="text-gray-500">Update your public persona.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-4">
                      <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold">Display Name</Label>
                          <Input id="name" value={profileEditForm.name} onChange={(e) => setProfileEditForm({...profileEditForm, name: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
                          <Input id="username" value={profileEditForm.username} onChange={(e) => setProfileEditForm({...profileEditForm, username: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                          <Input id="email" value={currentUser?.email || ''} disabled className="bg-gray-50 border-gray-200 text-gray-500" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="profileImage" className="text-sm font-semibold">Profile Picture</Label>
                          <Input id="profileImage" type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files[0])} className="border-gray-200 cursor-pointer text-sm" />
                          <p className="text-xs text-gray-500">Only upload PNG/JPG formats. Max 5MB.</p>
                      </div>
                  </div>
                  <DialogFooter>
                      <Button type="submit" onClick={async () => {
                        try {
                           const formData = new FormData();
                           formData.append("name", profileEditForm.name);
                           formData.append("username", profileEditForm.username);
                           if (profileImageFile) {
                               formData.append("profileImage", profileImageFile);
                           }
                           
                           const { data } = await axios.put('/api/users/profile', formData, { 
                               headers: { 
                                   Authorization: `Bearer ${localStorage.getItem('token')}`,
                                   'Content-Type': 'multipart/form-data'
                               }
                           });
                           login(data, data.token);
                           window.location.reload();
                        } catch (err) {
                           alert(err.response?.data?.message || 'Failed to update profile');
                        }
                      }} className="bg-orange-500 hover:bg-orange-600 text-white w-full rounded-lg h-11">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
              <div className="p-4 space-y-1">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Personalisation</p>
                <NavItem id="address" icon={MapPin} label="My Address" />
                <NavItem id="favorites" icon={Heart} label="My Wish List" />
                
                <div className="h-px bg-gray-100 my-4" />
                
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</p>
                <NavItem id="orders" icon={Package} label="My Orders" />
                <NavItem id="uploads" icon={Upload} label="Manage Uploads" />
              </div>
              
              <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out Securely
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Dynamic Header */}
            <div className="px-8 py-6 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                  {activeTab === 'uploads' && "Manage Uploads"}
                  {activeTab === 'orders' && "Order History"}
                  {activeTab === 'favorites' && "My Wish List"}
                  {activeTab === 'address' && "Delivery Addresses"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === 'uploads' && "Review, edit, or remove your published artworks."}
                  {activeTab === 'orders' && "Track your recent purchases and their fulfillment status."}
                  {activeTab === 'favorites' && "The collection of art you've adored from across the platform."}
                  {activeTab === 'address' && "Manage shipping destinations for checkout."}
                </p>
              </div>
              {activeTab === 'uploads' && (
                <Button onClick={() => navigate('/sell')} className="bg-orange-500 hover:bg-orange-600 font-bold text-white rounded-full shadow-md px-6">
                  <Upload className="w-4 h-4 mr-2"/> Default Upload
                </Button>
              )}
            </div>

            <div className="flex-1 p-8 bg-gray-50/30">
              {/* UPLOADS RENDER */}
              {activeTab === 'uploads' && (
                <div className="space-y-8">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center transition-all hover:border-orange-200 hover:shadow-md">
                       <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Total Uploads</p>
                       <h3 className="text-5xl font-playfair font-bold text-orange-500">{artworks.length}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center transition-all hover:border-orange-200 hover:shadow-md">
                       <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">Joined ArtBloom</p>
                       <h3 className="text-xl font-bold text-gray-900">{currentUser.createdAt ? format(new Date(currentUser.createdAt), 'MMMM yyyy') : 'Recently'}</h3>
                       <p className="text-xs text-orange-500 mt-1 font-medium">Active Member</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:border-orange-200 hover:shadow-md">
                       <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-4 text-center">Upload Activity</p>
                       <div className="flex items-end justify-between gap-1.5 h-16 w-full px-2 opacity-90">
                         {activityData.map((data, i) => (
                           <div key={i} className={`flex-1 ${data.count > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-200'} rounded-t-sm transition-colors relative group`} style={{ height: `${data.height}%` }}>
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
                                 Uploaded {data.count} on {data.date}
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>

                  {/* Portfolio Grid */}
                  {artworks.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-orange-100">
                        <Upload className="w-6 h-6 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Artworks Portfolio</h3>
                      <p className="text-sm text-gray-500 px-4">Share your creative genius with the ArtBloom community and watch your portfolio grow.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {artworks.map((art) => (
                        <div key={art._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:border-orange-300 transition-all hover:shadow-md">
                          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                            <img loading="lazy" src={optimizeCloudinaryUrl(art.imageUrl, 500)} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-3 right-3 flex gap-2">
                               <Dialog>
                                  <DialogTrigger asChild>
                                      <button onClick={() => handleEditClick(art)} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors">
                                          <Edit3 className="w-4 h-4" />
                                      </button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                          <DialogTitle className="font-playfair text-2xl">Edit Artwork</DialogTitle>
                                          <DialogDescription className="text-gray-500">Update pricing or descriptions instantly.</DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-5 py-4">
                                          <div className="space-y-2">
                                              <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
                                              <Input id="title" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="price" className="text-sm font-semibold">Price ($)</Label>
                                                <Input id="price" type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                                                <Input id="category" value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500 capitalize" />
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                                              <Textarea id="description" rows={4} value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500 resize-none" />
                                          </div>
                                      </div>
                                      <DialogFooter>
                                          <p className="text-xs text-gray-400 w-full text-left mr-auto pt-2 hidden sm:block">Full image/details editing via /sell suite</p>
                                          <Button type="submit" onClick={handleUpdateArtwork} className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto rounded-lg h-11 px-8">Commit Changes</Button>
                                      </DialogFooter>
                                  </DialogContent>
                              </Dialog>
                              <button onClick={() => handleDeleteArtwork(art._id)} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-playfair font-bold text-lg text-gray-900 truncate mb-1">{art.title}</h3>
                              <p className="text-xs font-medium text-orange-500 uppercase tracking-wider mb-3">{art.category}</p>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-auto">
                              <span className="text-xs px-2.5 py-1 bg-gray-100 rounded-md text-gray-600 font-mono">Stock: {art.stock}</span>
                              <span className="font-bold text-gray-900">${art.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ORDERS RENDER */}
              {activeTab === 'orders' && (
                orders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Order History</h3>
                    <p className="text-gray-500">When you purchase an artwork, tracking details and digital receipts will appear securely right here.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                          <div className="flex gap-8 text-sm">
                              <div>
                                  <p className="text-gray-400 md:mb-1 uppercase tracking-wider text-[10px] font-bold">Order Placed</p>
                                  <p className="font-medium text-gray-900">{order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy') : 'N/A'}</p>
                              </div>
                              <div>
                                  <p className="text-gray-400 mb-1 uppercase tracking-wider text-[10px] font-bold">Total Spent</p>
                                  <p className="font-bold text-gray-900">${order.totalPrice}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.isDelivered ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                              {order.isDelivered ? "Delivered" : "Processing"}
                            </span>
                            <span className="text-xs text-gray-300 font-mono hidden sm:inline-block">#{order._id.slice(-8)}</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-5 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"> 
                                    <img loading="lazy" src={optimizeCloudinaryUrl(item.imageUrl, 200) || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 truncate mb-1">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.qty} × <span className="font-semibold text-gray-700">${item.price}</span></p>
                                    </div>
                                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs h-8 rounded-full">View Item</Button>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* FAVORITES RENDER */}
              {activeTab === 'favorites' && (
                favorites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-pink-100">
                      <Heart className="w-8 h-8 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your Wish List is Empty</h3>
                    <p className="text-gray-500">Explore the gallery and hit the heart icon on any masterpiece that catches your eye.</p>
                    <Button className="mt-6 bg-gray-900 text-white hover:bg-gray-800 rounded-full">Explore Gallery</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((art) => (
                      <div key={art._id} className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                          <img loading="lazy" src={optimizeCloudinaryUrl(art.imageUrl, 500)} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <button onClick={() => removeFromFavorites(art._id)} className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform z-10" title="Remove from favorites">
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <div className="p-5">
                          <h3 className="font-playfair font-bold text-lg text-gray-900 truncate mb-1">{art.title}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">{art.category}</p>
                          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                            <p className="font-bold text-gray-900">${art.price}</p>
                            <span className="text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium cursor-pointer">View Details &rarr;</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'address' && (
                <div className="flex flex-col h-full">
                   {addresses.length === 0 ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                       <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100">
                         <MapPin className="w-8 h-8 text-green-500" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery Management</h3>
                       <p className="text-gray-500 mb-6">Store default addresses for lighting-fast checkout processing across all your favorite artworks.</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {addresses.map((addr, idx) => (
                           <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative hover:border-orange-200 transition-colors">
                              {addr.isDefault && <span className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Default</span>}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="w-5 h-5 text-gray-400" /></div>
                                <h4 className="font-bold text-gray-900 text-lg">{addr.label}</h4>
                              </div>
                              <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
                              <p className="text-gray-500 text-xs">{addr.city}, {addr.postalCode}</p>
                              <p className="text-gray-400 text-xs mt-1">{addr.country}</p>
                           </div>
                        ))}
                     </div>
                   )}

                   <div className="flex justify-center mt-auto pt-6 border-t border-gray-50">
                     <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                        <DialogTrigger asChild>
                           <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-8 shadow-md h-12">Add New Address</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px]">
                           <DialogHeader>
                              <DialogTitle className="font-playfair text-2xl">Add Address</DialogTitle>
                              <DialogDescription className="text-gray-500">Add a new delivery destination</DialogDescription>
                           </DialogHeader>
                           <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                  <Label className="text-sm font-semibold">Label As</Label>
                                  <div className="flex gap-2">
                                      {['Home', 'Work', 'Other'].map(l => (
                                          <button key={l} type="button" onClick={() => setAddressForm({...addressForm, label: l})} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${addressForm.label === l ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{l}</button>
                                      ))}
                                  </div>
                              </div>
                              {addressForm.label === 'Other' && (
                                  <div className="space-y-2">
                                      <Label htmlFor="customLabel" className="text-sm font-semibold">Custom Label Name</Label>
                                      <Input id="customLabel" placeholder="e.g. Studio" value={addressForm.customLabel} onChange={e => setAddressForm({...addressForm, customLabel: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                                  </div>
                              )}
                              <div className="space-y-2">
                                  <Label htmlFor="address" className="text-sm font-semibold">Street Address</Label>
                                  <Input id="address" placeholder="123 Main St" value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                                      <Input id="city" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="postalCode" className="text-sm font-semibold">Postal Code</Label>
                                      <Input id="postalCode" value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="country" className="text-sm font-semibold">Country</Label>
                                  <Input id="country" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} className="border-gray-200 focus-visible:ring-orange-500" />
                              </div>
                              <div className="flex items-center space-x-2 pt-2">
                                  <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer" />
                                  <Label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Set as default address</Label>
                              </div>
                           </div>
                           <DialogFooter>
                              <Button type="button" onClick={handleSaveAddress} className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full h-11 rounded-lg">Save Address</Button>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                   </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
