# Cinematch 🎬

Cinematch is a Node.js-based backend application designed to power a personalized movie discovery experience for movie enthusiasts. The backend API supports user authentication, movie recommendation, and watchlist management functionalities, ensuring a seamless interaction for the mobile application users.

## Features 🌟

- **User Authentication**: Secure login functionality to keep user preferences and watchlists private.
- **Movie Recommendations**: Advanced recommendation engine powered by machine learning algorithms.
- **Watchlist Management**: Add and manage movies in a personalized watchlist.

## Getting Started 🚀

### Prerequisites

- Node.js v14.x or newer
- npm v6.x or newer
- PostgreSQL or any SQL database supported by Prisma

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/cinematch-backend.git
   cd cinematch-backend
   ```

2. **Install dependencies:**

   ```sh
   Copy code
   npm install
   ```

3. **Set up environment variables:**
   Create a .env file in the root directory and configure your environment variables:

   ```env
   Copy code
   DATABASE_URL="your_database_url"
   JWT_SECRET="your_jwt_secret"
   TMDB_API_KEY="your_tmdb_api_key"
   ```

4. **Prisma Setup:**
   Generate Prisma client and run migrations:
   ```sh
   npm run prisma-dev [for development]
   or
   npm run prisma
   ```

### Running the App

#### Development Mode

To run the app in development mode with live-reloading and TypeScript support:

```sh
npm run dev
```

#### Build and Run

    To build the project and run the compiled JavaScript files:

1. **Build the project:**

```sh
npm run build
```

2. **Start the built application:**

```sh
npm start
```

### Core Project Structure

- **src/app.ts**: Entry point for the Express application.
- **src/utils/**: Utility functions including scripts like `populateGenres.ts`.
- **src/middleware/**: Custom middleware for authentication and validation.
- **src/routes/**: Route definitions for API endpoints.
- **src/services/**: Business logic and service layer.
- **src/dto/**: Data Transfer Objects for request and response schemas.
- **src/dao/**: Data Access Objects for database operations.
