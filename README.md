# README for Art Bloom

## Overview

Art Bloom is a full-stack web application designed as an online art marketplace where artists can upload their artworks, and customers can explore, discover, and purchase them seamlessly. The platform integrates a modern **React + Vite + Tailwind** frontend with a robust **Node.js + Express + MongoDB** backend. It includes user authentication, role-based access (users, artists, admins), secure payment handling, and responsive UI for an optimal experience. The system is modularly structured with controllers, routes, services, middleware, and utility functions on the backend, ensuring scalability and maintainability. On the frontend, it employs reusable components, context-based state management, Firebase for authentication, and custom hooks for flexibility. This repository provides a production-ready template for an e-commerce-like art platform with a complete workflow from artwork uploads, cart management, order placement, payments, and admin-level monitoring.

---

## Features

* **User Authentication and Authorization**

  * JWT-based authentication with middleware for route protection.
  * Firebase integration for frontend user handling.
  * Role-based differentiation between artists and customers.

* **Artwork Management**

  * Artists can upload artwork with metadata (title, description, price, image).
  * Images stored via **Cloudinary** integration.
  * Artworks served via dedicated routes and controllers.

* **Shopping Cart and Orders**

  * Add/remove items from the cart.
  * Secure checkout process.
  * Order history management via `Order` model.

* **Payment Integration**

  * Backend services handle payment requests and validations.
  * Secure flow with `paymentController.js` and `paymentService.js`.

* **Email and Notifications**

  * Email services (`emailService.js`, `sendMail.js`) for order confirmations and user updates.

* **Error Handling**

  * Centralized error middleware for consistent API responses.
  * Validation utilities for request safety.

* **Frontend Functionality**

  * Responsive UI built with **React + Tailwind**.
  * Pages include Artist Upload, Discover Art, Cart, Checkout, Sell, and Login.
  * Reusable components like Navbar, Footer, Hero, and Features.
  * Context (`AuthContext`) for global state management.
  * Firebase config for authentication flow.
  * Custom hooks (`use-toast`, `use-mobile`) for UI experience.
  * Proper routing with fallback to a **NotFound** page.

---

## Tech Stack

* **Frontend**

  * React (Vite)
  * Tailwind CSS
  * Firebase Authentication
  * Context API and Custom Hooks

* **Backend**

  * Node.js + Express.js
  * MongoDB + Mongoose
  * Cloudinary (image hosting)
  * JWT Authentication
  * Nodemailer for emails

---

## Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shinchan-nohara45/artgallery.git
   cd artgallery
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   * Create a `.env` file with the following:

     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_API_KEY=your_key
     CLOUDINARY_API_SECRET=your_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     EMAIL_USER=your_email
     EMAIL_PASS=your_password
     ```
   * Run backend:

     ```bash
     npm start
     ```

3. **Frontend Setup**

   ```bash
   cd project
   npm install
   npm run dev
   ```

4. Open the application in your browser:

   ```
   http://localhost:5173
   ```

---

## Folder Structure

### Backend (`/backend`)

* **config/** → Database and Cloudinary configuration.
* **controllers/** → Logic for artworks, users, orders, payments.
* **middleware/** → Authentication, error handling, file upload.
* **models/** → Mongoose schemas (`User`, `Artwork`, `Order`, `CartItem`).
* **routes/** → REST API endpoints grouped by functionality.
* **services/** → Handles email, payment, and file upload services.
* **utils/** → Utility functions (token generation, validations, responses).

### Frontend (`/project`)

* **components/** → Reusable UI components (Navbar, Footer, Hero).
* **contexts/** → Global state management (AuthContext).
* **firebase/** → Firebase authentication configuration.
* **hooks/** → Custom hooks for responsive UI and notifications.
* **pages/** → Application pages (ArtistUpload, Cart, Checkout, Discover, Sell, Login).
* **lib/** → Utility functions for frontend.
* **App.jsx / main.jsx** → Entry points.

---

## Future Enhancements

* Admin dashboard for monitoring artworks, users, and orders.
* Review and rating system for artworks.
* Advanced search and filtering by category, price, or artist.
* Integration of multiple payment gateways.
* Deployment setup with CI/CD.
* Machine Learning techniques like Digital Image processing for image security and monitoring 

---

## Collaborators
* **Rohini Sai** -> github.com/Rohinisai04
* **Asif Shaik** -> github.com/AsifAlthaf
