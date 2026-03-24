import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

// Simple wrapper to provide mandatory routing and context to Navbar
const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Navbar Component - White Box Test', () => {
  it('renders the ArtBloom logo successfully', () => {
    render(<Navbar />, { wrapper: Wrapper });
    const logoElement = screen.getByText(/ArtBloom/i);
    expect(logoElement).toBeInTheDocument();
  });

  it('renders core navigation links', () => {
    render(<Navbar />, { wrapper: Wrapper });
    
    // Check if the primary SaaS navigation elements exist
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Sell')).toBeInTheDocument();
  });
});
