# 🎨 Art Bloom (Formely Art Gallery)

**Art Bloom (Formely Art Gallery)** is a full-stack digital art marketplace and exhibition platform where artists can upload their artworks and customers can explore, discover, and purchase them seamlessly.

The platform combines a **modern MERN stack architecture** with **mobile and web applications**, enabling users to browse art, follow artists, upload artwork, and complete purchases securely.

It integrates a **React + Tailwind frontend**, **Node.js + Express backend**, **MongoDB database**, **Cloudinary image hosting**, and **Firebase authentication** to deliver a scalable and responsive art marketplace.

---

# 🚀 Key Features

## 👤 User Authentication & Authorization

* Firebase authentication for frontend login/signup
* JWT-based authentication for backend API security
* Role-based access control (User / Artist / Admin)
* Secure protected routes using middleware

## 🎨 Artwork Management

* Artists can upload artwork with:

  * Title
  * Description
  * Price
  * Image
* Images stored securely using **Cloudinary**
* Artworks retrieved through dedicated controllers and routes

## 🛒 Shopping Cart & Orders

* Add/remove artworks from cart
* Secure checkout system
* Order tracking and order history
* Managed via **Order** and **CartItem** models

## 💳 Payment Integration

* Backend payment services
* Secure payment validation workflow
* Controllers and services handling payment processing

## 📧 Email Notifications

* Order confirmation emails
* User update notifications
* Implemented using **Nodemailer**

## 🖥️ Frontend Experience

* Responsive UI built with **React + Tailwind CSS**
* Core pages include:

  * Discover Art
  * Artist Upload
  * Sell Artwork
  * Cart
  * Checkout
  * Login
* Reusable UI components:

  * Navbar
  * Footer
  * Hero Section
  * Feature sections
* Global state management using **React Context API**
* Custom hooks for responsive UI and notifications

---

# 🧱 Tech Stack

## Frontend (Web)

* React (Vite)
* Tailwind CSS
* Context API
* Firebase Authentication
* Custom Hooks

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cloudinary (image hosting)
* Nodemailer (email services)

## Mobile Application

* React Native (Expo)
* Uses the same backend APIs as the web application

---

# 📂 Project Structure

## Root Structure

```
artgallery/
│
├── backend/          # Node.js + Express backend
├── project/          # React web application
├── mobile/           # React Native mobile app
│
├── docs/             # Project documentation
├── public/           # Static assets
├── src/              # Core application source files
│
├── package.json
└── README.md
```

---

## Backend Structure (`/backend`)

```
backend/
│
├── config/        # Database and Cloudinary configuration
├── controllers/   # Business logic for users, artworks, orders
├── middleware/    # Auth middleware, error handling, uploads
├── models/        # MongoDB schemas (User, Artwork, Order, CartItem)
├── routes/        # API route definitions
├── services/      # Email, payment and upload services
├── utils/         # Utility helpers (token generation, validation)
```

---

## Frontend Structure (`/project`)

```
project/
│
├── components/   # Reusable UI components
├── contexts/     # Global state management
├── firebase/     # Firebase configuration
├── hooks/        # Custom React hooks
├── pages/        # Application pages
├── lib/          # Frontend utilities
│
├── App.jsx
└── main.jsx
```

---

# 📱 Application Screens

### Authentication

| Account Creation                                                                                         | Sign-in                                                                                                  | Terms & Conditions                                                                                       |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/654bc321-3e3d-4fa4-a433-47160a44ba79" width="250"/> | <img src="https://github.com/user-attachments/assets/4d1895ea-963b-4c8e-a535-3d9d3f3d4e36" width="250"/> | <img src="https://github.com/user-attachments/assets/055d0b35-24b7-4a0d-8dc4-a1a059ae4184" width="250" />


### Browsing

| Home Page                                                                                                | Discover                                                                                                 | View Artwork                                                                                             |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/074a327c-230d-424c-af76-fded76ea69b1" width="250"/> | <img src="https://github.com/user-attachments/assets/bb70368e-343b-40e3-af16-ca2555726ac5" width="250"/> | <img src="https://github.com/user-attachments/assets/5290fe38-da63-4ef3-86c7-f76849d888bb" width="250"/> |

### Selling & Buying

| Upload Artwork                                                                                           | Cart                                                                                                     | Checkout                                                                                                 |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/10c7d012-009a-4cdd-89eb-223dbd06a16f" width="250"/> | <img src="https://github.com/user-attachments/assets/1f3eeab4-d8b4-489a-9838-45c337575744" width="250"/> | <img src="https://github.com/user-attachments/assets/f0933814-1c06-464a-a5bd-98e4ea5b66df" width="250"/> |

### Profile

<img src="https://github.com/user-attachments/assets/724da6a5-7585-49c8-988b-a3beb03ef153" width="250"/>

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```
git clone https://github.com/AsifAlthaf/artgallery.git
cd artgallery
```

---

## 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env`

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

Run backend

```
npm start
```

or

```
npm run dev
```

---

## 3️⃣ Frontend Setup

```
cd project
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 4️⃣ Mobile Application

```
cd mobile
npx expo start
```

---

# 🔗 MCP Server Configuration

This repository integrates **Model Context Protocol (MCP)** to stream documentation updates using an SSE server.

```
{
  "servers": {
    "artgallery Docs": {
      "type": "sse",
      "url": "https://gitmcp.io/AsifAlthaf/artgallery/tree/Update-1"
    }
  }
}
```

This allows real-time streaming of project documentation.

---

# 🛠️ Using the Application

### Mobile App

Download APK:

```
https://expo.dev/accounts/asif_shaik/projects/artbloom-mobile/builds/57c5deee-7038-4569-9d10-c05f0bc29a75
```

Install the APK and create an account.

### Backend (Render Deployment)

```
https://art-bloom.onrender.com
```

Open the backend URL once to wake up the server before using the app.

---

# 📖 Documentation

All project documentation is available in the **docs/** folder and streamed via MCP integration.

---

# 🔮 Future Enhancements

* Admin dashboard for monitoring users, artworks, and orders
* Artwork review and rating system
* Advanced search and filtering (category, price, artist)
* Multi-payment gateway support
* CI/CD deployment pipeline
* Machine learning integration for **digital image security and monitoring**

---

# 🤝 Contributing

1. Fork the repository
2. Create a branch

```
feature/your-feature
```

3. Commit changes
4. Push to your fork
5. Open a Pull Request

---

# 👨‍💻 Contributors

**Asif Althaf**
BTech, SRM University
Passionate about AI-powered platforms and scalable solutions

**Rohini Sai**
BTech, SRM University

GitHub

* https://github.com/AsifAlthaf
* https://github.com/Rohinisai04

---
