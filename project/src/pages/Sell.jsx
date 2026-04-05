import React, { useState } from 'react';
import { Upload, Info, ArrowRight, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sell = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    dimensions: '',
    price: '',
    tags: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    setSelectedFile(file);
    if (file) {
       const img = new Image();
       img.src = URL.createObjectURL(file);
       img.onload = () => {
           setFormData(prev => ({...prev, dimensions: `${img.width} x ${img.height} px`}));
           toast.success(`Dimensions auto-detected: ${img.width}x${img.height}`);
       };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error('Please select an image to upload');
    if (!formData.title || !formData.price || !formData.category) return toast.error('Please fill in all required fields');

    setIsUploading(true);
    try {
      // Create FormData
      const data = new FormData();
      data.append('artworkImage', selectedFile);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category.toLowerCase());
      data.append('price', formData.price);
      data.append('medium', formData.medium);
      data.append('dimensions', formData.dimensions);
      
      const token = localStorage.getItem('token');
      await axios.post('/api/artworks', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Your artwork has been successfully published!');
      navigate('/dashboard');
    } catch (error) {
       console.error(error);
       toast.error(error.response?.data?.message || 'Failed to publish artwork');
    } finally {
       setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Image Box */}
            <Card className="bg-white border border-gray-100 shadow-md rounded-2xl border-t-4 border-t-orange-500">
              <CardContent className="pt-6">
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-1">Artwork Images</h3>
                <p className="text-sm text-gray-500 mb-6">Upload high-quality images of your artwork (up to 5 images)</p>
                
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      id="artwork-upload" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <ImagePlus className="w-10 h-10 text-gray-400 mb-4" />
                      <p className="font-medium text-gray-700 mb-1">
                        {selectedFile ? selectedFile.name : 'Click to upload Images'}
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, or WEBP up to 10MB each.
                      </p>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Box */}
            <Card className="bg-white border border-gray-100 shadow-md rounded-2xl">
              <CardContent className="pt-6 space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Artwork Details</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Title <span className="text-red-500">*</span></label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter artwork title" className="border-gray-200 focus-visible:ring-orange-500" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your artwork, inspiration, and techniques used" className="border-gray-200 focus-visible:ring-orange-500 min-h-[120px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                    <Select onValueChange={handleCategoryChange} value={formData.category}>
                      <SelectTrigger className="border-gray-200 focus:ring-orange-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="digital_art">Digital Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="sculpture">Sculpture</SelectItem>
                        <SelectItem value="illustration">Illustration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Medium</label>
                    <Input name="medium" value={formData.medium} onChange={handleInputChange} placeholder="e.g., Oil on canvas, Digital, Watercolor" className="border-gray-200 focus-visible:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Dimensions</label>
                    <Input name="dimensions" value={formData.dimensions} onChange={handleInputChange} placeholder="e.g., 24 x 36 inches" className="border-gray-200 focus-visible:ring-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Price (USD) <span className="text-red-500">*</span></label>
                    <Input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" className="border-gray-200 focus-visible:ring-orange-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tags (Optional)</label>
                  <Input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g., abstract, nature, portrait (comma separated)" className="border-gray-200 focus-visible:ring-orange-500" />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Box */}
            <Card className="bg-white border border-orange-100 shadow-md rounded-2xl">
              <CardContent className="pt-6">
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-1 border-b border-orange-100 pb-3">Pricing & Commission</h3>
                <p className="text-sm text-gray-600 mt-4">ArtBloom takes a 10% commission on each sale. You'll receive 90% of the listed price.</p>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
               <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-gray-200 w-32 font-bold px-8">Cancel</Button>
               <Button type="submit" disabled={isUploading} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 shadow-md">
                 {isUploading ? 'Uploading...' : 'Upload Artwork'}
               </Button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
};

export default Sell;