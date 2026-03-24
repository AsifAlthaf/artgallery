import React from "react";
import { Palette, Image, Share2, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: <Palette className="h-12 w-12 text-artbloom-gold" />,
    title: "Create Your Art",
    description:
      "Whether you love painting, digital art, or sketching, this is your space to bring your artistic vision to life.",
  },
  {
    icon: <Image className="h-12 w-12 text-artbloom-gold" />,
    title: "Customize & Enhance",
    description:
      "Experiment with colors, styles, and effects to make your art stand out. Our tools help you perfect every detail.",
  },
  {
    icon: <Share2 className="h-12 w-12 text-artbloom-gold" />,
    title: "Share With The World",
    description:
      "Once you're satisfied, showcase your work to the world and connect with fellow artists in our community.",
  },
  {
    icon: <ShoppingBag className="h-12 w-12 text-artbloom-gold" />,
    title: "Sell Your Designs",
    description:
      "Turn your passion into profit. Set up your store and sell your artwork to art enthusiasts around the globe.",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-artbloom-gold bg-artbloom-peach rounded-full">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-artbloom-charcoal mb-4">
            Unleash Your Creativity & Share Your Art!
          </h2>
          <p className="max-w-2xl mx-auto text-artbloom-charcoal/80">
            ArtBloom provides everything you need to create stunning artwork and
            share it with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 flex flex-col items-center text-center hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 p-3 bg-artbloom-peach/30 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-artbloom-charcoal">
                {feature.title}
              </h3>
              <p className="text-artbloom-charcoal/80">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-artbloom-peach/30 rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
              <h2 className="text-2xl md:text-3xl font-bold text-artbloom-charcoal mb-4">
                Start creating today and let your imagination flow!
              </h2>
              <p className="text-artbloom-charcoal/80 mb-6">
                Join thousands of artists who have found their creative home at
                ArtBloom. Our platform provides all the tools and inspiration
                you need to create your next masterpiece.
              </p>
              <button className="px-6 py-3 bg-artbloom-gold text-white font-medium rounded-md shadow-md hover:bg-artbloom-gold/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                Get Started for Free
              </button>
            </div>
            <div className="md:w-1/2">
              <img loading="lazy"
                src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                alt="Artist creating colorful artwork"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
