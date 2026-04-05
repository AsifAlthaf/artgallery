import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const artCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'painting', name: 'Paintings' },
  { id: 'digital', name: 'Digital Art' },
  { id: 'photography', name: 'Photography' },
  { id: 'sculpture', name: 'Sculptures' },
  { id: 'illustration', name: 'Illustrations' },
];

const optimizeCloudinaryUrl = (url, width = 800) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && !url.includes('/upload/q_auto')) {
        return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
    }
    return url;
};

const Discover = () => {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [artworks, setArtworks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { toast } = useToast(); // If available
  
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const handleCartAction = (e, artwork) => {
      e.stopPropagation();
      const isInCart = cartItems.some(item => item._id === artwork._id || item.id === artwork._id);
      if (isInCart) {
          navigate('/cart');
      } else {
          addToCart(artwork);
      }
  };

  const isItemInCart = (id) => cartItems.some(item => item._id === id || item.id === id);

  useEffect(() => {
    fetchFeaturedArtists();
    fetchArtworks();
    if (currentUser) {
        fetchFavorites();
    }
  }, [currentUser]);

  const fetchFeaturedArtists = async () => {
      try {
          const { data } = await axios.get('/api/users/public');
          setFeaturedArtists(Array.isArray(data) ? data : []);
      } catch (error) {
          console.error("Error fetching featured artists:", error);
      }
  };

  const fetchArtworks = async () => {
      try {
          const { data } = await axios.get('/api/artworks');
          setArtworks(data.artworks || []); // Assuming API returns object with artworks array or direct array
      } catch (error) {
          console.error("Error fetching artworks:", error);
      } finally {
          setLoading(false);
      }
  };

  const fetchFavorites = async () => {
      try {
          const { data } = await axios.get('/api/users/favorites');
          setFavorites(data.map(fav => fav._id));
      } catch (error) {
          console.error("Error fetching favorites:", error);
      }
  };

  const toggleFavorite = async (e, artworkId) => {
      e.stopPropagation(); // Prevent card click
      if (!currentUser) {
          alert("Please login to save favorites"); // Or use toast
          return;
      }

      try {
          if (favorites.includes(artworkId)) {
              await axios.delete(`/api/users/favorites/${artworkId}`);
              setFavorites(prev => prev.filter(id => id !== artworkId));
          } else {
              await axios.post(`/api/users/favorites/${artworkId}`);
              setFavorites(prev => [...prev, artworkId]);
          }
      } catch (error) {
          console.error("Error toggling favorite:", error);
      }
  };
  
  const filteredArtworks = activeCategory === 'all' 
    ? artworks 
    : artworks.filter(art => (art.category || '').toLowerCase() === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-artbloom-charcoal">
              Discover Unique Artworks
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-artbloom-charcoal/80">
              Explore our curated collection of original art from talented artists around the world.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-artbloom-charcoal/50" />
              </div>
              <input
                type="text"
                placeholder="Search artworks, artists, or styles..."
                className="w-full py-3 pl-10 pr-4 rounded-md bg-white/60 border border-artbloom-peach/30 focus:ring-2 focus:ring-artbloom-peach/50 focus:border-transparent focus:outline-none focus:bg-white transition-colors"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto"></div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/60">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
                
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <line x1="3" x2="21" y1="12" y2="12" />
                      <line x1="3" x2="21" y1="18" y2="18" />
                    </svg>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
          
          {/* Featured Artists */}
          {featuredArtists.length > 0 && activeCategory === 'all' && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-artbloom-charcoal mb-6">Featured Artists</h2>
              <div className="flex overflow-x-auto gap-5 pb-4 custom-scrollbar">
                {featuredArtists.map(artist => (
                  <div key={artist._id} onClick={() => navigate(`/artist/${artist._id || artist.id}`)} className="flex flex-col items-center flex-shrink-0 w-24 cursor-pointer group hover:opacity-80 transition-opacity">
                    <div className="w-20 h-20 rounded-full border-2 border-orange-500 p-0.5 mb-2 shadow-sm relative overflow-hidden bg-white">
                      <img loading="lazy" src={optimizeCloudinaryUrl(artist.imageUrl || artist.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", 200)} alt={artist.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 text-center truncate w-full">{artist.name}</span>
                    <span className="text-xs text-orange-500 font-medium truncate w-full text-center">@{artist.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Categories */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 justify-center">
              {artCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category.id 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-white border border-gray-200 hover:border-orange-300 text-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Artwork Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredArtworks.map(artwork => (
              <Card key={artwork._id} onClick={() => navigate(`/artwork/${artwork._id}`)} className={`overflow-hidden hover-lift transition-all relative group cursor-pointer border-transparent shadow-sm hover:shadow-md ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                 {/* Favorite Button */}
                 <button 
                    onClick={(e) => toggleFavorite(e, artwork._id)}
                    className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={favorites.includes(artwork._id) ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart 
                        className={`w-4 h-4 transition-colors ${favorites.includes(artwork._id) ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                    />
                </button>

                <div className={viewMode === 'list' ? 'w-1/3' : 'aspect-[4/5] bg-gray-50 overflow-hidden rounded-t-xl'}>
                  <img loading="lazy" 
                    src={optimizeCloudinaryUrl(artwork.imageUrl, 500)} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardContent className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <h3 className="font-bold text-gray-900 text-lg mb-0.5 truncate">{artwork.title || "Untitled"}</h3>
                  <p className="text-gray-500 text-sm mb-4">by {artwork.artist?.name || artwork.artist?.username || "Unknown"}</p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold text-orange-500 text-lg">${artwork.price || 0}</span>
                    <span className="px-3 py-1 bg-[#F5F5F5] text-gray-600 text-xs font-semibold rounded-md capitalize">{artwork.category || "Art"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {loading && <div className="text-center py-10">Loading artworks...</div>}
          
          {/* Load More Button */}
          <div className="flex justify-center mt-12">
            <Button variant="outline" onClick={() => toast.info('No additional artworks found.')} className="border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white">
              Load More Artworks
            </Button>
          </div>
        </div>
      </main>
      
      </div>
  );
};

export default Discover;
