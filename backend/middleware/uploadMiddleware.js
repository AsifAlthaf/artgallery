const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
cloudinary: cloudinary,
params: {
folder: 'uploads', // folder name in cloudinary
allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
transformation: [
{
width: 800,
height: 600,
crop: 'fill',
quality: 'auto',
fetch_format: 'auto'
}
]
},
});

const upload = multer({ storage: storage });

module.exports = upload;