import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-artbloom-cream px-4">
        <div className="max-w-md w-full glass-card rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-artbloom-peach/50 rounded-full mb-6">
            <span className="text-4xl font-playfair font-bold text-artbloom-brown">404</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-artbloom-charcoal">Page Not Found</h1>
          <p className="text-artbloom-charcoal/80 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-artbloom-gold text-white font-medium rounded-md shadow-md hover:bg-artbloom-gold/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
      </div>
  );
};

export default NotFound;
