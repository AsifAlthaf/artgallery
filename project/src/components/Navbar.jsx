import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Bell, ShoppingBag, Eye, Paintbrush, Box } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-orange-500 shadow-md border-b border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="ArtBloom" className="h-10 w-auto drop-shadow-md" />
              <span className="font-playfair text-2xl font-semibold text-white drop-shadow-md hidden sm:block">
                ArtBloom
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <nav className="flex items-center space-x-8 relative">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/discover" className="text-sm font-bold text-white/90 hover:text-white transition-colors relative group">
                  Discover
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </Link>
                <Link to="/sell" className="text-sm font-bold text-white/90 hover:text-white transition-colors relative group">
                  Sell Art
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </Link>
                <Link to="/vr-world" className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-sm font-bold text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all animate-pulse hover:animate-none">
                  <Box className="w-4 h-4" /> VR Exhibition
                </Link>
              </div>
              {!isAuthenticated ? (
                <Link to="/login" className="px-6 py-2 bg-white text-orange-600 font-bold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  Login
                </Link>
              ) : (
                <div className="flex items-center space-x-6">
                  {/* Notifications */}
                  <div className="relative">
                    <button 
                        onClick={() => {
                            setNotificationOpen(!notificationOpen);
                            setDropdownOpen(false);
                            if (!notificationOpen && unreadCount > 0) markAllAsRead();
                        }}
                        className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Bell className="h-5 w-5 text-white" />
                      {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex flex-col items-center justify-center shadow-sm">
                            {unreadCount}
                          </span>
                      )}
                    </button>

                    {notificationOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111111] rounded-xl shadow-2xl py-2 z-50 border border-gray-100 dark:border-[#2a2a2a] overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-50 dark:border-[#2a2a2a] flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">Notifications</span>
                            <span className="text-xs text-orange-500 font-medium">{notifications.length} Total</span>
                          </div>
                          <div className="max-h-80 overflow-y-auto w-full custom-scrollbar">
                              {notifications.length === 0 ? (
                                  <div className="p-4 text-center text-sm text-gray-500">No notifications yet.</div>
                              ) : (
                                  notifications.map(n => (
                                      <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b border-gray-50 dark:border-[#2a2a2a] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${!n.read ? 'bg-orange-50/50 dark:bg-[#b026ff]/10' : ''}`}>
                                          <p className="text-sm text-gray-800 dark:text-gray-200">{n.text}</p>
                                          <p className="text-[10px] text-gray-400 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                                      </div>
                                  ))
                              )}
                          </div>
                        </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                          setDropdownOpen(!dropdownOpen);
                          setNotificationOpen(false);
                      }}
                      className="flex items-center space-x-2 focus:outline-none px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <span className="text-white font-bold drop-shadow-sm">
                        {currentUser?.displayName || currentUser?.username || "Profile"}
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                          <p className="text-sm font-bold text-orange-600 truncate">@{currentUser?.username || currentUser?.name?.toLowerCase().replace(/\s+/g,'_') || "user"}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setDropdownOpen(false)}>
                          Profile Settings
                        </Link>
                        <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setDropdownOpen(false)}>
                          My Wish List
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setDropdownOpen(false)}>
                          Order History
                        </Link>

                        <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 transition-colors border-t border-gray-50">
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <Link to="/cart" className="relative p-2 hover:bg-white/20 rounded-full transition-colors">
                    <ShoppingCart className="h-5 w-5 text-white" />
                    <span className="absolute -top-1 -right-1 bg-gray-900 border-2 border-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems?.length || 0}
                    </span>
                  </Link>
                </div>
              )}
            </nav>
          ) : (
            <div className="flex items-center gap-4">
               {isAuthenticated && (
                <Link to="/cart" className="relative p-2 hover:bg-white/20 rounded-full transition-colors">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <span className="absolute -top-1 -right-1 bg-gray-900 border-2 border-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems?.length || 0}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-white/20 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Expanded State (Hidden in Snippet for Brevity - Standard Dropdown Implementations Apply) */}
      {isMobile && mobileMenuOpen && (
          <div className="bg-orange-600 border-t border-orange-400 p-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium">Home</Link>
              <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium">Discover</Link>
              <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium">Sell</Link>
              {isAuthenticated ? (
                  <>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium">Profile</Link>
                      <button onClick={logout} className="text-left text-white font-bold opacity-80">Sign Out</button>
                  </>
              ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-white font-bold">Login</Link>
              )}
          </div>
      )}
    </header>
  );
};

export default Navbar;
