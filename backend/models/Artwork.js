// backend/models/Artwork.js
const mongoose = require('mongoose');

const artworkSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Artist who uploaded the artwork
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String, // URL from Cloudinary
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['painting', 'sculpture', 'photography', 'digital_art', 'drawing', 'mixed_media', 'other'],
      default: 'other',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isForSale: {
      type: Boolean,
      default: true,
    },
    stock: { // If selling physical prints/copies
      type: Number,
      required: true,
      default: 1,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;