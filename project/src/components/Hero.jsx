import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    alt: "Art studio with canvas and painting supplies",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    alt: "Colorful abstract painting on canvas",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    alt: "Digital art creation process",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("");

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;

      if (index > currentSlide) {
        setDirection("right");
      } else if (index < currentSlide) {
        setDirection("left");
      }

      setIsTransitioning(true);
      setCurrentSlide(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [currentSlide, isTransitioning]
  );

  const goToNextSlide = useCallback(() => {
    const nextSlide = (currentSlide + 1) % carouselImages.length;
    goToSlide(nextSlide);
  }, [currentSlide, goToSlide]);

  const goToPrevSlide = useCallback(() => {
    const prevSlide =
      (currentSlide - 1 + carouselImages.length) % carouselImages.length;
    goToSlide(prevSlide);
  }, [currentSlide, goToSlide]);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [goToNextSlide, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevSlide();
      } else if (e.key === "ArrowRight") {
        goToNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  return (
    <section className="relative min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="carousel-container h-full">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img loading="lazy"
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-6 text-sm font-medium bg-artbloom-gold/90 text-white rounded-full animate-fade-in">
            Unleash Your Creativity
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Your Artistic Journey Begins Here
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Create, share, and sell your artwork with a community of passionate
            artists and art lovers from around the world.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <button className="px-8 py-3 bg-artbloom-gold text-white font-medium rounded-md shadow-lg hover:bg-artbloom-gold/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              Start Creating
            </button>
            <a
              href="/discover"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/40 font-medium rounded-md shadow-lg hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl inline-block text-center"
            >
              Explore Gallery
            </a>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={goToPrevSlide}
        className="carousel-arrow left"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNextSlide}
        className="carousel-arrow right"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Dots */}
      <div className="carousel-dots absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-dot ${currentSlide === index ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
