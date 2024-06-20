import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { getMovieById } from '../dao/movies.dao';

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY'; // gantikan dengan API key Anda atau pastikan variabel lingkungan disetel

// Fungsi untuk memvalidasi movie ID menggunakan TMDB API
const isValidMovieId = async (movieId: number) => {
  const data = getMovieById(movieId)
  return data && (await data).id === movieId;
};

export const getWatchlist = async (userId: number) => {
  return await prisma.watchlist.findMany({
    where: { user_id: userId },
  });
};

export const addWatchlistItem = async (data: {
  user_id: number;
  movie_id: number;
  liked: boolean;
  is_watched: boolean;
}) => {
  const existingItem = await prisma.watchlist.findFirst({
    where: {
      user_id: data.user_id,
      movie_id: data.movie_id,
    },
  });

  if (existingItem) {
    throw new Error('Movie is already in the watchlist');
  }

  const validMovie = await isValidMovieId(data.movie_id);
  if (!validMovie) {
    throw new Error('Invalid movie ID');
  }

  return await prisma.watchlist.create({
    data: {
      user_id: data.user_id,
      movie_id: data.movie_id,
      liked: data.liked,
      is_watched: data.is_watched,
    },
  });
};

export const updateWatchlistItem = async (id: number, userId: number, is_watched: boolean) => {
  const watchlistItem = await prisma.watchlist.findFirst({
    where: {
      id,
      user_id: userId,
    },
  });

  if (!watchlistItem) {
    throw new Error('Watchlist item not found');
  }

  await prisma.watchlist.update({
    where: { id },
    data: { is_watched },
  });
  return { message: 'Watchlist item updated successfully' };
};

export const deleteWatchlistItem = async (id: number, userId: number) => {
  const watchlistItem = await prisma.watchlist.findFirst({
    where: {
      id,
      user_id: userId,
    },
  });

  if (!watchlistItem) {
    throw new Error('Watchlist item not found');
  }

  await prisma.watchlist.delete({ where: { id } });
  return { message: 'Watchlist item deleted successfully' };
};
