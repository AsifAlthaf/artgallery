import Artwork from '../models/Artwork.js';
import asyncHandler from 'express-async-handler';
import { uploadImageToCloudinary } from '../services/uploadService.js';
import { deleteImageFromCloudinary } from '../services/uploadService.js';


// @desc    Fetch all artworks
// @route   GET /api/artworks
// @access  Public
const getArtworks = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i',
              },
          }
        : {};

    const count = await Artwork.countDocuments({ ...keyword });
    const artworks = await Artwork.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate('artist', 'name email'); // Populate artist details

    res.json({ artworks, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single artwork
// @route   GET /api/artworks/:id
// @access  Public
const getArtworkById = asyncHandler(async (req, res) => {
    const artwork = await Artwork.findById(req.params.id).populate('artist', 'name email imageUrl');

    if (artwork) {
        res.json(artwork);
    } else {
        res.status(404);
        throw new Error('Artwork not found');
    }
});

// @desc    Create an artwork
// @route   POST /api/artworks
// @access  Private/Artist
const createArtwork = asyncHandler(async (req, res) => {
    const { name, description, category, price, countInStock } = req.body;

    // Check if an image file was uploaded
    if (!req.file) {
        res.status(400);
        throw new Error('Artwork image is required.');
    }

    // Upload image to Cloudinary
    let cloudinaryResult;
    try {
        cloudinaryResult = await uploadImageToCloudinary(req.file.path, 'artworks');
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500);
        throw new Error('Failed to upload artwork image.');
    }

    const artwork = new Artwork({
        name,
        artist: req.user._id, // The authenticated user is the artist
        image: cloudinaryResult.secure_url,
        cloudinaryId: cloudinaryResult.public_id,
        description,
        category,
        price,
        countInStock,
    });

    const createdArtwork = await artwork.save();
    res.status(201).json(createdArtwork);
});

// @desc    Update an artwork
// @route   PUT /api/artworks/:id
// @access  Private/Artist or Admin
const updateArtwork = asyncHandler(async (req, res) => {
    const { name, description, category, price, countInStock } = req.body;

    const artwork = await Artwork.findById(req.params.id);

    if (artwork) {
        // Check if the authenticated user is the artist of the artwork or an admin
        if (artwork.artist.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(403);
            throw new Error('Not authorized to update this artwork');
        }

        artwork.name = name || artwork.name;
        artwork.description = description || artwork.description;
        artwork.category = category || artwork.category;
        artwork.price = price || artwork.price;
        artwork.countInStock = countInStock || artwork.countInStock;

        // If a new image file is uploaded
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (artwork.cloudinaryId) {
                await deleteImageFromCloudinary(artwork.cloudinaryId);
            }
            // Upload new image
            const cloudinaryResult = await uploadImageToCloudinary(req.file.path, 'artworks');
            artwork.image = cloudinaryResult.secure_url;
            artwork.cloudinaryId = cloudinaryResult.public_id;
        }

        const updatedArtwork = await artwork.save();
        res.json(updatedArtwork);
    } else {
        res.status(404);
        throw new Error('Artwork not found');
    }
});

// @desc    Delete an artwork
// @route   DELETE /api/artworks/:id
// @access  Private/Artist or Admin
const deleteArtwork = asyncHandler(async (req, res) => {
    const artwork = await Artwork.findById(req.params.id);

    if (artwork) {
        // Check if the authenticated user is the artist of the artwork or an admin
        if (artwork.artist.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(403);
            throw new Error('Not authorized to delete this artwork');
        }

        // Delete image from Cloudinary
        if (artwork.cloudinaryId) {
            await deleteImageFromCloudinary(artwork.cloudinaryId);
        }

        await artwork.remove();
        res.json({ message: 'Artwork removed' });
    } else {
        res.status(404);
        throw new Error('Artwork not found');
    }
});

// @desc    Get artworks by a specific artist
// @route   GET /api/artworks/artist/:artistId
// @access  Public
const getArtworksByArtist = asyncHandler(async (req, res) => {
    const artworks = await Artwork.find({ artist: req.params.artistId }).populate('artist', 'name email imageUrl');
    res.json(artworks);
});


export {
    getArtworks,
    getArtworkById,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    getArtworksByArtist
};