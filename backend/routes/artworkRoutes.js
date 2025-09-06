import express from 'express';
const router = express.Router();
import {
    getArtworks,
    getArtworkById,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    getArtworksByArtist,
} from '../controllers/artworkController.js';
import { protect, admin, artist } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // For artwork image uploads

router.route('/')
    .get(getArtworks)
    .post(protect, artist, upload.single('artworkImage'), createArtwork); // Only authenticated artists can create

router.route('/:id')
    .get(getArtworkById)
    .put(protect, artist, upload.single('artworkImage'), updateArtwork) // Artists (or admin) can update their artwork
    .delete(protect, artist, deleteArtwork); // Artists (or admin) can delete their artwork

router.route('/artist/:artistId')
    .get(getArtworksByArtist); // Get artworks by a specific artist

export default router;