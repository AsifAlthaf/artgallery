import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Paintbrush } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-artbloom-brown/90 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Paintbrush className="h-8 w-8 text-artbloom-peach" />
              <span className="font-playfair text-2xl font-semibold">
                ArtBloom
              </span>
            </div>
            <p className="text-white/80 mb-4">
              Unleashing Creativity, One Artwork at a Time.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/discover"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Art Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Artists</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sell"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sell Your Art
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@artbloom.com"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center lg:pr-32">
            <p className="text-white/70 text-sm mb-4 md:mb-0">
              © {currentYear} ArtBloom. All rights reserved. | Unleashing
              Creativity, One Artwork at a Time
            </p>
            <div className="flex space-x-4">
              <Link
                to="/terms"
                className="text-white/70 text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-white/70 text-sm hover:text-white transition-colors"
              >
                Privacy Policy 
              </Link>
              <button 
                onClick={() => document.documentElement.classList.toggle('dark')} 
                className="flex items-center gap-2 border border-white/30 px-3 py-1 rounded-full text-white/80 hover:bg-white transition-colors hover:text-artbloom-charcoal text-sm ml-4"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                 Toggle Dark Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
