import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to view favorites');
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [currentUser, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(prev => prev.filter(item => item._id !== id));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
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

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-artbloom-peach mr-3 fill-artbloom-peach" />
          <h1 className="text-4xl font-playfair font-bold text-artbloom-charcoal">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair font-bold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Start exploring and save the artworks you love.</p>
            <Link 
              to="/discover" 
              className="inline-block bg-artbloom-peach text-white font-medium py-3 px-8 rounded-lg hover:bg-artbloom-peach/90 transition-colors"
            >
              Discover Art
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <Link
                key={item._id}
                to={`/artwork/${item._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img loading="lazy"
                    src={item.imageUrl || item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => removeFavorite(item._id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-playfair font-bold text-lg text-artbloom-charcoal mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.artist?.name && (
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">by {item.artist.name}</p>
                    )}
                  </div>
                  <div className="font-semibold text-artbloom-peach">
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      </div>
  );
};

export default Favorites;
