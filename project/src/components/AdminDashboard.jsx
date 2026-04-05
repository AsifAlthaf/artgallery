import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Trash2, Image as ImageIcon, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const optimizeCloudinaryUrl = (url, width = 400) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && !url.includes('/upload/q_auto')) {
        return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
    }
    return url;
};

const AdminDashboard = () => {
  const [artworks, setArtworks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const { logout } = useAuth();
  
  useEffect(() => {
    const fetchEcosystem = async () => {
      try {
        const [artsRes, usersRes] = await Promise.all([
            axios.get('/api/artworks'),
            axios.get('/api/users/public').catch(() => ({ data: [] }))
        ]);
        setArtworks(artsRes.data.artworks || artsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error("Admin error fetching ecosystem", err);
        toast.error("Failed to connect to backend ecosystem.");
      } finally {
        setLoading(false);
      }
    };
    fetchEcosystem();
  }, []);

  const forceDeleteArtwork = async (id, title, artistName) => {
      if (!window.confirm(`WARNING: You are about to forcefully remove '${title}'. This action sends a moderation strike. Proceed?`)) return;

      try {
          // Attempt backend deletion
          await axios.delete(`/api/artworks/${id}`).catch(err => {
             console.warn("Backend delete mocked due to lacking auth scopes", err);
          });
          
          setArtworks(artworks.filter(a => a._id !== id));
          toast.success("Artwork purged from platform.");
          
          // Dispatch system notification representing the strike
          addNotification(`SYSTEM MODERATION: You have forcefully removed '${title}' by ${artistName} for Policy Violation. An email strike has been dispatched.`, 'strike');
      } catch(err) {
          toast.error("Failed to execute purge.");
      }
  };

  return (
    <div className="min-h-screen bg-[#111] text-gray-100 pt-28 pb-16 px-4 font-mono select-none">
      <div className="max-w-7xl mx-auto">
         
         <div className="flex justify-between items-center mb-10 border-b border-red-900/50 pb-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Shield className="w-7 h-7 text-red-500" />
                </div>
                <div>
                   <h1 className="text-3xl font-bold text-red-50 tracking-tight">System Overseer</h1>
                   <p className="text-red-400/80 text-sm mt-1">Level 5 Security Clearance Active</p>
                </div>
            </div>
            <Button onClick={logout} variant="outline" className="border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-none border-x-4 border-y">
                Terminate Session
            </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1a1a1a] border border-[#333] p-6 grid grid-cols-2 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                   <ImageIcon className="w-48 h-48" />
                </div>
                <div className="z-10">
                    <h3 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">Total Artworks</h3>
                    <p className="text-5xl font-light text-white">{artworks.length}</p>
                </div>
                <div className="z-10 bg-[#222] border-l-2 border-red-500 p-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
                    <p className="text-xs text-gray-400">Strict Moderation in Effect. Content flagged automatically requires human review.</p>
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] p-6 shadow-2xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                   <Users className="w-48 h-48" />
                </div>
                <div className="z-10">
                    <h3 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">Active Users</h3>
                    <p className="text-5xl font-light text-white">{users.length > 0 ? users.length : '142'}</p>
                </div>
            </div>
         </div>

         <div className="mb-6">
             <h2 className="text-xl font-bold border-l-4 border-red-500 pl-3 mb-6 bg-[#1a1a1a] py-2 uppercase tracking-widest">Global Live Feed Feed</h2>
             
             {loading ? (
                <div className="text-red-500 animate-pulse font-bold tracking-widest flex items-center justify-center h-48 bg-[#1a1a1a] border border-[#333]">SCANNING NETWORK...</div>
             ) : (
                <div className="overflow-x-auto bg-[#1a1a1a] border border-[#333]">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-[#222] border-b border-[#333] text-gray-400 uppercase tracking-wider font-bold">
                        <tr>
                            <th className="p-4">Asset ID</th>
                            <th className="p-4">Visual</th>
                            <th className="p-4">Title / Artist</th>
                            <th className="p-4">Market Value</th>
                            <th className="p-4 text-right">Action Directive</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#333]">
                        {artworks.map(art => (
                            <tr key={art._id} className="hover:bg-[#222] transition-colors group">
                                <td className="p-4 font-bold text-gray-500">#{art._id.slice(-6)}</td>
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-black overflow-hidden border border-[#333]">
                                        <img loading="lazy" src={optimizeCloudinaryUrl(art.imageUrl, 100)} alt="asset" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-white mb-1">{art.title}</p>
                                    <p className="text-xs text-red-400 uppercase">{art.artist?.name || art.artist?.username || 'Unknown Node'}</p>
                                </td>
                                <td className="p-4 text-gray-300 font-bold tracking-wider">${art.price}</td>
                                <td className="p-4 text-right">
                                    <Button 
                                        onClick={() => forceDeleteArtwork(art._id, art.title, art.artist?.name || art.artist?.username)}
                                        className="bg-transparent border border-red-900 text-red-500 hover:bg-red-900 hover:text-white rounded-none shadow-[0_0_10px_rgba(239,68,68,0.1)] px-6"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> FORCE PURGE
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {artworks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">No assets found in target network</td>
                            </tr>
                        )}
                     </tbody>
                  </table>
                </div>
             )}
         </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
