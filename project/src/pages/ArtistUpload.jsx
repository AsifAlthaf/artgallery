import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const artUploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Please enter a price"),
  medium: z.string().min(1, "Please specify the medium"),
  dimensions: z.string().min(1, "Please specify dimensions"),
  tags: z.string().optional(),
});

const ArtistUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(artUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      medium: "",
      dimensions: "",
      tags: "",
    },
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedImages.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (values) => {
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    console.log('Art upload submitted:', { ...values, images: uploadedImages });
    toast.success("Your artwork has been uploaded successfully! It will be reviewed and published soon.");
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold mb-4">Upload Your Artwork</h1>
            <p className="text-lg text-muted-foreground">
              Share your creativity with the world and start selling your art
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Artwork Images</CardTitle>
                  <CardDescription>
                    Upload high-quality images of your artwork (up to 5 images)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ImagePlus className="h-12 w-12 text-muted-foreground" />
                          <p className="text-lg font-medium">Click to upload images</p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, or JPEG up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Artwork Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Artwork Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter artwork title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your artwork, inspiration, and techniques used"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="painting">Painting</SelectItem>
                              <SelectItem value="photography">Photography</SelectItem>
                              <SelectItem value="digital-art">Digital Art</SelectItem>
                              <SelectItem value="sculpture">Sculpture</SelectItem>
                              <SelectItem value="drawing">Drawing</SelectItem>
                              <SelectItem value="mixed-media">Mixed Media</SelectItem>
                              <SelectItem value="textile">Textile Art</SelectItem>
                              <SelectItem value="pottery">Pottery</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medium</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Oil on canvas, Digital, Watercolor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dimensions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 24 x 36 inches" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., abstract, nature, portrait (comma separated)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Commission</CardTitle>
                  <CardDescription>
                    ArtBloom takes a 10% commission on each sale. You'll receive 90% of the listed price.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {form.watch("price") && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Listed Price:</span>
                        <span>${parseFloat(form.watch("price") || "0").toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ArtBloom Commission (10%):</span>
                        <span>-${(parseFloat(form.watch("price") || "0") * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>You'll Receive:</span>
                        <span>${(parseFloat(form.watch("price") || "0") * 0.9).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-artbloom-peach hover:bg-artbloom-peach/80">
                  Upload Artwork
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtistUpload;