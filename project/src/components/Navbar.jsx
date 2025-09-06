import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-black/30 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/9338b940-6030-450a-b0bf-d771b2ed0641.png"
                alt="ArtBloom Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="font-playfair text-2xl font-semibold text-white drop-shadow-md">
                ArtBloom
              </span> {/*Dancing scripts*/}
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className="nav-link font-medium text-white hover:text-artbloom-peach drop-shadow-md transition-colors"
              >
                Home
              </Link>
              <Link
                to="/discover"
                className="nav-link font-medium text-white hover:text-artbloom-peach drop-shadow-md transition-colors"
              >
                Discover
              </Link>
              <Link
                to="/sell"
                className="nav-link font-medium text-white hover:text-artbloom-peach drop-shadow-md transition-colors"
              >
                Sell
              </Link>
              <Link
                to="/login"
                className="nav-link font-medium text-white hover:text-artbloom-peach drop-shadow-md transition-colors"
              >
                Login
              </Link>
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 text-white drop-shadow-md" />
                  <span className="absolute -top-1 -right-1 bg-artbloom-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    0
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
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && mobileMenuOpen && (
        <div className="bg-black/85 backdrop-blur-md px-4 py-4 shadow-md animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="px-3 py-2 rounded-md font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              to="/sell"
              className="px-3 py-2 rounded-md font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell
            </Link>
            <Link
              to="/login"
              className="px-3 py-2 rounded-md font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            {isAuthenticated && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium text-white">Cart</span>
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <span className="absolute -top-1 -right-1 bg-artbloom-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
