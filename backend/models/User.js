// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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
    username: {
      type: String,
      unique: true,
      sparse: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9._-]+$/, 'Username can only contain lowercase letters, numbers, underscores, dots, and dashes.'],
      validate: {
        validator: function(v) {
          if (!v) return true;
          const dashCount = (v.match(/-/g) || []).length;
          const dotCount = (v.match(/\./g) || []).length;
          return dashCount <= 1 && dotCount <= 1;
        },
        message: 'Username can contain at most one dash and one dot.'
      }
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.firebaseUid;
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
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/your_cloud_name/image/upload/v1/default-profile.png",
    },
    lastProfileImageUpdate: {
        type: Date,
        default: null
    },
    imageUrl: {
        type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    socialLinks: [
      {
        platform: String,
        url: String,
      },
    ],
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    billingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    addresses: [
      {
        label: { type: String },
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
        isDefault: { type: Boolean, default: false }
      }
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.googleId || this.firebaseUid) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.googleId || this.firebaseUid) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
