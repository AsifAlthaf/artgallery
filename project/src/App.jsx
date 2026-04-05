import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Sell from "./pages/Sell";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import NotFound from "./pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import PublicProfile from "./pages/PublicProfile";

import ArtworkDetail from "@/pages/ArtworkDetail";
import Favorites from "@/pages/Favorites";
import Orders from "@/pages/Orders";
import EditArtwork from "@/pages/EditArtwork";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

// Lazy load the heavy 3D rendering context to prevent main thread blocking
const VRWorld = lazy(() => import("@/pages/VRWorld"));

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" toastOptions={{
              className: 'text-base p-5 min-w-[350px] font-medium shadow-xl border-2 border-orange-50',
              descriptionClassName: 'text-sm text-gray-500'
            }} />
            <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProfilePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/artwork/:id/edit" element={<EditArtwork />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/vr-world" element={
                <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xl animate-pulse">Initializing WebGL Engine...</div>}>
                   <VRWorld />
                </Suspense>
            } />
            <Route path="/artist/:id" element={<PublicProfile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
        </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;