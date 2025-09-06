import React, { useState } from 'react';
import { Upload, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Sell = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    
    if (file && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }
    
    // Simulate upload process
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Your artwork has been submitted for review!');
      setSelectedFile(null);
      setDescription('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-artbloom-charcoal">
              Share Your Art With The World
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-artbloom-charcoal/80">
              Join our community of artists and sell your creations to art lovers around the globe.
            </p>
          </div>
          
          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl font-playfair font-semibold mb-10 text-center text-artbloom-charcoal">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card hover-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 mb-4 rounded-full bg-artbloom-peach/20">
                      <Upload className="w-8 h-8 text-artbloom-peach" />
                    </div>
                    <h3 className="text-xl font-playfair font-semibold mb-2">Upload Your Art</h3>
                    <p className="text-artbloom-charcoal/70">
                      Take high-quality photos of your artwork and upload them to our platform.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 mb-4 rounded-full bg-artbloom-gold/20">
                      <Info className="w-8 h-8 text-artbloom-gold" />
                    </div>
                    <h3 className="text-xl font-playfair font-semibold mb-2">Add Details</h3>
                    <p className="text-artbloom-charcoal/70">
                      Provide information about your piece, including medium, dimensions, and price.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 mb-4 rounded-full bg-artbloom-sage/20">
                      <ArrowRight className="w-8 h-8 text-artbloom-sage" />
                    </div>
                    <h3 className="text-xl font-playfair font-semibold mb-2">Start Selling</h3>
                    <p className="text-artbloom-charcoal/70">
                      Once approved, your art will be listed on our marketplace for buyers to discover.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Upload Form */}
          <div className="max-w-3xl mx-auto">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-playfair font-semibold mb-6 text-center">
                  Upload Your Artwork
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white/60 border-2 border-dashed border-artbloom-peach/50 rounded-lg p-8 text-center cursor-pointer hover:bg-white/80 transition-colors">
                    <input 
                      type="file" 
                      id="artwork-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="artwork-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-artbloom-peach mb-4" />
                      <p className="font-medium text-artbloom-charcoal mb-2">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-artbloom-charcoal/60">
                        Support for JPG, PNG, WEBP (Max size: 10MB)
                      </p>
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-artbloom-charcoal mb-2">
                      Description
                    </label>
                    <Textarea 
                      id="description"
                      placeholder="Tell us about your artwork..." 
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/60 focus:bg-white"
                    />
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={() => window.location.href = '/artist-upload'}
                    className="w-full bg-artbloom-peach hover:bg-artbloom-peach/80 text-white"
                  >
                    Start Uploading
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sell;