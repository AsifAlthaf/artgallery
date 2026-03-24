import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-artbloom-brown/90 backdrop-blur-md shadow-sm"
          : "bg-black/30 backdrop-blur-sm"
      )}
    >
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
          {!isMobile && (
            <nav className="flex items-center space-x-8 relative">
              <Link to="/" className="nav-link text-white hover:text-artbloom-peach">
                Home
              </Link>
              <Link to="/discover" className="nav-link text-white hover:text-artbloom-peach">
                Discover
              </Link>
              <Link to="/sell" className="nav-link text-white hover:text-artbloom-peach">
                Sell
              </Link>

              {!isAuthenticated ? (
                <Link to="/login" className="nav-link text-white hover:text-artbloom-peach">
                  Login
                </Link>
              ) : (
                <div className="relative">
                  {/* Profile Button */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {/* <img loading="lazy"
                      src={currentUser?.photoURL || "/default-avatar.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    /> */}
                    <span className="text-white font-medium hover:text-artbloom-peach">
                      {currentUser?.displayName || "Profile"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                        <p className="text-sm font-bold text-orange-600 truncate">@{currentUser?.username || currentUser?.name?.toLowerCase().replace(/\s+/g,'_') || "user"}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Wish List
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Order History
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 transition-colors border-t border-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && (
                <Link to="/cart" className="relative p-2 hover:bg-white/20 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <span className="absolute -top-1 -right-1 bg-artbloom-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems?.length || 0}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-white/20 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
