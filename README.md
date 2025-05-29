# 🎬 Movie Explorer (IMDb Clone) - Backend (Server)

This is the backend of the **Movie Explorer** web application, providing API endpoints for authentication, movie CRUD operations, and data management. It is built with **Node.js**, **Express**, and **MongoDB** (via **Mongoose**) for storing and retrieving movie data.

---

## 🚀 Demo

🌐 **Frontend** (Client-side): [View Demo](https://imdb-clone-ui.netlify.app/)

🌐 **Frontend** (Client-side): [Frontend API](https://github.com/nandhinigurumoorthyy/IMDb-Clone-Frontend.git)

---

## 📦 Packages Used

Installed using `npm install`:

```bash
npm i mongoose
npm i dotenv
npm i express
npm i cors
npm i cookie-parser
npm i fs
npm i jsonwebtoken
npm i axios
```

* **mongoose** — MongoDB ODM to interact with the MongoDB database.
* **dotenv** — For managing environment variables (e.g., JWT secret, MongoDB URI).
* **express** — Web framework for building the backend API.
* **cors** — Middleware to enable cross-origin resource sharing.
* **cookie-parser** — Middleware for parsing cookies (useful for handling JWT in cookies).
* **fs** — Built-in Node.js module for working with the file system.
* **jsonwebtoken** — For generating and verifying JWT tokens for authentication.
* **axios** — To make HTTP requests, primarily for interacting with external APIs (like TMDB).

---

## 🛠️ Backend Setup & Installation

### 1. **Clone the repository**:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. **Navigate to the backend folder**:

```bash
cd server
```

### 3. **Install dependencies**:

```bash
npm install
```

### 4. **Setup Environment Variables**:

Create a `.env` file in the root of your server directory and add the following:

```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

### 5. **Start the backend server**:

```bash
npm run start
```

The backend server will start and you can access the API.

---

## 🛠️ Endpoints & Features

### 1. **Authentication**:

* **POST /login** — User login to receive JWT token
* **POST /register** — User registration to create a new account

### 2. **Movie Operations**:

* **GET /movies** — Fetch all movies in the user's collection.
* **POST /movies** — Add a new movie to the user's collection (requires authentication).
* **PUT /movies/\:id** — Update movie details (requires authentication).
* **DELETE /movies/\:id** — Delete a movie from the collection (requires authentication).

### 3. **Token Verification Middleware**:

* Use the `authenticateJWT` middleware to protect endpoints that require user authentication. It checks if the request contains a valid JWT in the header.

---


## 🛠️ MongoDB Integration

This backend uses **MongoDB** (via **Mongoose**) to store and manage user data and movie data. The **Movies Collection** stores movies added by the user, including the title, genre, description, release date, and more.

### Example of the **Movie Model** in Mongoose:

```js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  language: String,
  releaseDate: String,
  posterPath: String,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Movie', movieSchema);
```

---

## 🛠️ User Authentication with JWT

The backend uses **JWT (JSON Web Tokens)** to authenticate users and manage their sessions. JWT tokens are issued during login and are required for any request that modifies data, such as adding or deleting movies.

### JWT Flow:

1. **Login**:

   * User sends a request to `/login` with their credentials.
   * If valid, the backend responds with a JWT token.

2. **Add/Edit/Delete Movie**:

   * JWT token is sent in the `Authorization` header for authenticated routes.
   * The backend verifies the token and performs the requested operation.

---

## 📱 Cross-Origin Resource Sharing (CORS)

To allow the frontend to communicate with the backend, **CORS** is enabled on the server.

---

## 💡 External APIs

* **TMDB API**: For fetching movie data, including titles, descriptions, ratings, etc. You can integrate it in your backend to provide dynamic movie information for your users.

---

## ⚡ Tech Stack

* **Node.js** for backend server
* **Express** for routing and API handling
* **MongoDB** (via Mongoose) for storing movie and user data
* **JWT** for authentication
* **CORS** for cross-origin requests
* **dotenv** for environment variable management

---

# 📖 License

MIT License © [Nandhini](https://github.com/nandhinigurumoorthyy)

---

### **Notes**

* Make sure to secure the **JWT secret** and store sensitive credentials in environment variables.
* Ensure your **MongoDB** instance is running and accessible.
* Use the **JWT token** for authenticating all CRUD operations related to movies.

