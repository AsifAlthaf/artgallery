import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
const editArtSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Please enter a price"),
});

const EditArtwork = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [artwork, setArtwork] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const form = useForm({
    resolver: zodResolver(editArtSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to edit artwork');
      navigate('/login');
      return;
    }
    fetchArtwork();
  }, [id, currentUser, navigate]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/artworks/${id}`);
      setArtwork(data);
      form.reset({
        title: data.title || "",
        description: data.description || "",
        category: data.category?.toLowerCase() || "",
        price: data.price?.toString() || "",
      });
    } catch (error) {
      console.error('Error fetching artwork:', error);
      toast.error('Failed to load artwork details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/artworks/${id}`,
        {
          title: values.title,
          description: values.description,
          price: values.price,
          category: values.category.toLowerCase(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Artwork updated successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update artwork");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-artbloom-cream">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artbloom-peach"></div>
        </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold mb-4">Edit Artwork</h1>
            <p className="text-lg text-muted-foreground">
              Update the details of your masterpiece
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Image</CardTitle>
                  <CardDescription>Image updates are not currently supported</CardDescription>
                </CardHeader>
                <CardContent>
                  {artwork?.imageUrl || artwork?.images?.[0] ? (
                    <img loading="lazy"
                      src={artwork.imageUrl || artwork.images[0]}
                      alt="Current artwork"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </CardContent>
              </Card>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your artwork"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-artbloom-peach hover:bg-artbloom-peach/80 text-white"
                >
                  {isSubmitting ? 'Updating...' : 'Update Artwork'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      </div>
  );
};

export default EditArtwork;
