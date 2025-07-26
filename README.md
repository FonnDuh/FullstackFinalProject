# FullstackFinalProject Backend

This is the backend for a TMDB-powered media tracking application. It allows users to search for movies and TV shows, add them to their personal lists, track progress, and manage their media library. The backend is built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, JWT-based authentication, and protected routes.
- **Media Management**: Add, update, delete, and fetch user-specific media (movies, TV, anime, etc.).
- **TMDB Integration**: Search and fetch details for movies and TV shows using the TMDB API, with caching and rate limiting.
- **User Media Tracking**: Track status, rating, progress, favorites, and episode/season progress for each user/media pair.
- **Validation & Error Handling**: Input validation and centralized error handling for robust API responses.
- **Rate Limiting**: Protects TMDB endpoints from abuse.

## Main Endpoints

### Auth

- `POST /users` - Register a new user
- `POST /users/login` - Login and receive a JWT

### Media

- `POST /media` - Add media to user list
- `GET /media` - Get all media for the current user
- `GET /media/:id` - Get all media for a specific user (if authorized)
- `GET /media/:id/my-media` - Get all media for the current user (alias)
- `PUT /media/:id` - Update a user's media entry
- `DELETE /media/:id` - Delete a user's media entry
- `DELETE /media/all/:id` - Delete all media for a user

### TMDB

- `GET /movie/search?query=...` - Search for movies
- `GET /movie/:id` - Get movie details
- `GET /movie/popular` - Get popular movies
- `GET /movie/trending` - Get trending movies
- `GET /tv/search?query=...` - Search for TV shows
- `GET /tv/:id` - Get TV show details

## Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- TMDB API (v3/v4)
- JWT for authentication
- Joi for validation

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your MongoDB URI, TMDB API key, and other secrets
4. Start the server: `npm start`

## Notes

- All protected routes require a valid JWT in the `Authorization` header.
- Rate limiting is applied to TMDB endpoints.
- Caching is used for TMDB search results to reduce API calls.

---

Feel free to extend this README as you add more features or endpoints!
