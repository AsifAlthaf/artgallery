import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Link as LinkIcon, Calendar, Users, Heart, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const optimizeCloudinaryUrl = (url, width = 800) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && !url.includes('/upload/q_auto')) {
        return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
    }
    return url;
};

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        // Fallback robust fetching mapping the known /api/users/public endpoint if a specific /:id one fails
        try {
           const userRes = await axios.get(`/api/users/${id}`);
           setArtist(userRes.data);
        } catch (e) {
           const publicRes = await axios.get('/api/users/public');
           const found = publicRes.data.find(a => a._id === id || a.username === id);
           if (found) setArtist(found);
           else throw new Error("Artist not found");
        }

        const artsRes = await axios.get('/api/artworks');
        const artistArtworks = (artsRes.data.artworks || artsRes.data).filter(a => 
            a.artist?._id === id || a.artist === id || a.artist?._id === artist?._id 
        );
        setArtworks(artistArtworks);

      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArtistData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#050505]">Loading artist profile...</div>;
  if (!artist) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#050505]">Artist not found</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pt-24 pb-16 px-4 font-montserrat">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a2a2a] overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-orange-400 to-artbloom-peach dark:from-[#b026ff] dark:to-[#4a0082]"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#111111] overflow-hidden bg-white shadow-md">
                <img 
                  src={optimizeCloudinaryUrl(artist.imageUrl || artist.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png")} 
                  alt={artist.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`rounded-full px-6 font-semibold transition-all shadow-sm ${isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-white' : 'bg-orange-500 hover:bg-orange-600 text-white dark:bg-[#b026ff] dark:hover:bg-[#d175ff]'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline" className="rounded-full shadow-sm dark:bg-[#1a1a1a] dark:text-gray-200 dark:border-[#333333]">Message</Button>
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 font-playfair">{artist.name}</h1>
              <p className="text-lg text-orange-500 dark:text-[#d175ff] font-medium mb-4">@{artist.username}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex gap-2 text-center items-center">
                    <span className="font-bold text-xl text-gray-900 dark:text-white">{artworks.length}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Uploads</span>
                </div>
                <div className="flex gap-2 text-center items-center">
                    <span className="font-bold text-xl text-gray-900 dark:text-white">{artist.followers || Math.floor(Math.random() * 500) + 10}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Followers</span>
                </div>
                <div className="flex gap-2 text-center items-center">
                    <span className="font-bold text-xl text-gray-900 dark:text-white">{artist.following || Math.floor(Math.random() * 100) + 5}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Following</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                {artist.bio || "Digital artist and illustrator passionate about creating vibrant, surreal worlds. Exploring the boundaries between reality and imagination."}
              </p>
            </div>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-[#2a2a2a] pb-4">
            <ImageIcon className="text-orange-500 dark:text-[#b026ff] w-6 h-6" />
            <h2 className="text-2xl font-bold font-playfair text-gray-900 dark:text-white">Portfolio</h2>
        </div>

        {artworks.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#111111] rounded-2xl border border-dashed border-gray-300 dark:border-[#333333]">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No artworks published yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map(artwork => (
                <Card key={artwork._id} onClick={() => navigate(`/artwork/${artwork._id}`)} className="overflow-hidden hover:-translate-y-1 transition-all cursor-pointer shadow-sm hover:shadow-md dark:bg-[#111111] dark:border-[#2a2a2a]">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img loading="lazy" 
                      src={optimizeCloudinaryUrl(artwork.imageUrl, 500)} 
                      alt={artwork.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 truncate">{artwork.title || "Untitled"}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-orange-500 dark:text-[#d175ff] text-lg">${artwork.price || 0}</span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-md capitalize">{artwork.category || "Art"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default PublicProfile;
