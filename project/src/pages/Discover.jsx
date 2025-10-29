import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Sample art data
const artCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'painting', name: 'Paintings' },
  { id: 'digital', name: 'Digital Art' },
  { id: 'photography', name: 'Photography' },
  { id: 'sculpture', name: 'Sculptures' },
  { id: 'illustration', name: 'Illustrations' },
];

const artworks = [
  {
    id: 1,
    title: 'Abstract Dreams',
    artist: 'Maria Rivera',
    image: '/lovable-uploads/bluesky-greenforest.jpg',
    category: 'painting',
    price: '$350',
  },
  {
    id: 2,
    title: 'Ocean Waves',
    artist: 'Thomas Chen',
    image: '/bluesky-greenforest.jpg',
    category: 'photography',
    price: '$220',
  },
  {
    id: 3,
    title: 'Digital Landscape',
    artist: 'Alex Johnson',
    image: '/bluesky-greenforest.jpg',
    category: 'digital',
    price: '$180',
  },
  {
    id: 4,
    title: 'Autumn Forest',
    artist: 'Emma Wilson',
    image: '/bluesky-greenforest.jpg',
    category: 'painting',
    price: '$420',
  },
  {
    id: 5,
    title: 'Urban Reflection',
    artist: 'Michael Brown',
    image: '/bluesky-greenforest.jpg',
    category: 'photography',
    price: '$290',
  },
  {
    id: 6,
    title: 'Modern Abstract',
    artist: 'Sofia Garcia',
    image: '/bluesky-greenforest.jpg',
    category: 'painting',
    price: '$380',
  },
  {
    id: 7,
    title: 'Character Design',
    artist: 'David Park',
    image: 'bluesky-greenforest.jpg',
    category: 'illustration',
    price: '$150',
  },
  {
    id: 8,
    title: 'Bronze Figure',
    artist: 'Claire Adams',
    image: '/placeholder.svg',
    category: 'sculpture',
    price: '$950',
  },
];

const Discover = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  const filteredArtworks = activeCategory === 'all' 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <Navbar />
      
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
              <Tabs defaultValue="categories" className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto bg-white/60">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="artists">Artists</TabsTrigger>
                  <TabsTrigger value="styles">Styles</TabsTrigger>
                </TabsList>
              </Tabs>
              
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
          
          {/* Categories */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 justify-center">
              {artCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activeCategory === category.id 
                      ? 'bg-artbloom-peach text-white' 
                      : 'bg-white/60 hover:bg-white text-artbloom-charcoal'
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
              <Card key={artwork.id} className={`overflow-hidden hover-lift transition-all ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                <div className={viewMode === 'list' ? 'w-1/3' : ''}>
                  <img 
                    src={artwork.image} 
                    alt={artwork.title} 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardContent className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <h3 className="font-playfair text-lg font-semibold mb-1">{artwork.title}</h3>
                  <p className="text-artbloom-charcoal/70 text-sm">{artwork.artist}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-medium">{artwork.price}</span>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-artbloom-peach text-artbloom-peach hover:bg-artbloom-peach hover:text-white">
              Load More Artworks
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
