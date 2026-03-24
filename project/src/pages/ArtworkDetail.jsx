import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { currentUser } = useAuth();
  
  // Use VITE_API_URL or fallback to localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchArtworkDetails();
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      checkIfFavorite();
    }
  }, [currentUser, id]);

  const fetchArtworkDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/artworks/${id}`);
      setArtwork(data);
    } catch (error) {
      console.error('Error fetching artwork details:', error);
      toast.error('Failed to load artwork details');
      navigate('/discover');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const { data } = await axios.get(`${API_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const isFav = data.some((fav) => fav._id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (isFavorite) {
        await axios.delete(`${API_URL}/users/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await axios.post(`${API_URL}/users/favorites/${id}`, {}, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const isInCart = cartItems.some(item => item._id === id);

  const handleCartAction = () => {
    if (isInCart) {
      navigate('/cart');
    } else {
      addToCart(artwork);
      toast.success('Added to cart');
    }
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

  if (!artwork) return null;

  const isFree = ['digital_art', 'photography', 'drawing', 'Water Painting'].includes(artwork.category) || parseFloat(artwork.price) === 0;

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-artbloom-peach transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 relative bg-gray-50 flex items-center justify-center min-h-[400px]">
            <img loading="lazy" 
              src={artwork.imageUrl || artwork.images?.[0] || "/placeholder.png"} 
              alt={artwork.title}
              className="w-full h-full max-h-[600px] object-contain p-4"
            />
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-playfair font-bold text-artbloom-charcoal mb-2">
                    {artwork.title}
                  </h1>
                  <p className="text-xl text-gray-500">
                    by {artwork.artist?.name || artwork.artistName || 'Unknown Artist'}
                  </p>
                </div>
                
                <button 
                  onClick={toggleFavorite}
                  className="p-3 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Heart 
                    className={`w-8 h-8 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
                  />
                </button>
              </div>

              <div className="mb-8">
                {isFree ? (
                  <span className="text-3xl font-bold text-gray-400 italic">Free</span>
                ) : (
                  <span className="text-4xl font-bold text-orange-500">
                    ${parseFloat(artwork.price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="prose prose-sm sm:prose-base text-gray-600 mb-8 max-w-none">
                <h3 className="font-semibold text-artbloom-charcoal mb-2">Description</h3>
                <p className="leading-relaxed">{artwork.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-gray-100">
                <div>
                  <span className="block text-sm text-gray-500 mb-1">Category</span>
                  <span className="font-medium text-artbloom-charcoal capitalize">
                    {artwork.category?.replace(/_/g, ' ') || 'Uncategorized'}
                  </span>
                </div>
                {!isFree && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Status</span>
                    <span className={`font-medium ${artwork.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {artwork.stock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              {isFree ? (
                <Button 
                  className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600 text-white font-bold"
                  onClick={() => window.open(artwork.imageUrl || artwork.images?.[0], '_blank')}
                >
                  View Full Size
                </Button>
              ) : (
                <Button 
                  className={`w-full py-6 text-lg text-white font-bold ${isInCart ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                  onClick={handleCartAction}
                  disabled={artwork.stock <= 0 && !isInCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? 'Go to Cart' : (artwork.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      </div>
  );
};

export default ArtworkDetail;
