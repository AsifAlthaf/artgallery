// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is not required if user signed up with Google
        return !this.googleId;
      },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isArtist: {
      type: Boolean,
      default: false,
    },
    googleId: { // To track users signed up with Google
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    profilePicture: {
      type: String, // URL to Cloudinary image
      default: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/default-profile.png' // Default placeholder
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    socialLinks: [
      {
        platform: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleId) { // Only hash if password is modified and not a Google user
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.googleId) { // Google users don't have a password to match
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;