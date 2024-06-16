import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import Papa from 'papaparse';
require('@tensorflow/tfjs-node');  // Use this for Node.js environment

import { getWatchlist } from './getWatchlist';
import { Movie } from './movie.type';

const calculateScore = (movie: Movie) => {
    let score = 0;
    let count = 0;
    if (movie.imdb_rating !== null) {
        score += movie.imdb_rating;
        count++;
    }
    if (movie.is_interested !== null) {
        score += movie.is_interested * 10; // Scale binary interest into a 0-10 range
        count++;
    }

    return count > 0 ? score / count : 0; // Safe division
}

const loadMovies = async (userId: number): Promise<Movie[]> => {
    const watchlist = await getWatchlist(userId);
    const fileContent = fs.readFileSync('../static/final-dataset-normalized.csv', 'utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            complete: (results: { data: any[]; }) => {
                if (results.data.length === 0) {
                    reject(new Error("No data found in the file."));
                    return;
                }

                const filteredData = results.data.filter(row => !(row.id in watchlist));
                const movies = filteredData.map(row => ({
                    id: row.id,
                    imdb_rating: parseFloat(row.vote_average),
                    user_rating: row.user_rating ? parseFloat(row.user_rating) : null,
                    is_interested: row.is_interested,
                    release_year: parseFloat(row.release_year),
                    runtime: parseFloat(row.runtime),
                    revenue: parseFloat(row.revenue),
                    cast_1: row.cast_1,
                    cast_2: row.cast_2,
                    cast_3: row.cast_3,
                    genre_28: row.genre_28,
                    genre_12: row.genre_12,
                    genre_16: row.genre_16,
                    genre_35: row.genre_35,
                    genre_80: row.genre_80,
                    genre_99: row.genre_99,
                    genre_18: row.genre_18,
                    genre_10751: row.genre_10751,
                    genre_14: row.genre_14,
                    genre_36: row.genre_36,
                    genre_27: row.genre_27,
                    genre_10402: row.genre_10402,
                    genre_9648: row.genre_9648,
                    genre_10749: row.genre_10749,
                    genre_878: row.genre_878,
                    genre_10770: row.genre_10770,
                    genre_53: row.genre_53,
                    genre_10752: row.genre_10752,
                    genre_37: row.genre_37
                }));

                resolve(movies);
            },
            error: function(err: Error) {
                reject(err);
            }
        });
    });
};

export const getRecommendation = async (userId: number, temperature: number) => {
    if (temperature <= 0) {
        console.error("Temperature must be greater than 0.");
        return null;
    }

    const movies = await loadMovies(userId);
    const model = await tf.loadLayersModel(`../models/${userId}.json`);

    const features = movies.map(movie => [
        movie.imdb_rating,
        movie.release_year,
        movie.runtime,
        movie.revenue,
        movie.cast_1,
        movie.cast_2,
        movie.cast_3,
        movie.genre_28,
        movie.genre_12,
        movie.genre_16,
        movie.genre_35,
        movie.genre_80,
        movie.genre_99,
        movie.genre_18,
        movie.genre_10751,
        movie.genre_14,
        movie.genre_36,
        movie.genre_27,
        movie.genre_10402,
        movie.genre_9648,
        movie.genre_10749,
        movie.genre_878,
        movie.genre_10770,
        movie.genre_53,
        movie.genre_10752,
        movie.genre_37,
    ]);
    const featuresTensor = tf.tensor2d(features);

    const predictionResult = model.predict(featuresTensor);
    let predictions = Array.isArray(predictionResult) ? predictionResult[0].dataSync() : predictionResult.dataSync();

    movies.forEach((movie, index) => {
        movie.is_interested = predictions[index] > 0.5 ? 1 : 0;
    });

    const scores = movies.map(movie => calculateScore(movie));
    const adjustedScores = scores.map(score => score / temperature);
    const probabilities = softmax(adjustedScores);

    const recommendedMovieIds = sampleMovies(movies, probabilities, 20);
    return recommendedMovieIds;
}

// Softmax function to convert scores to probabilities
function softmax(scores: number[]) {
    const maxScore = Math.max(...scores);
    const expScores = scores.map(score => Math.exp(score - maxScore));
    const sumExpScores = expScores.reduce((a, b) => a + b, 0);
    return expScores.map(score => score / sumExpScores);
}

// Random sampling based on softmax probabilities
function sampleMovies(movies: Movie[], probabilities: number[], numSamples: number) {
    const sampledIndices = [];
    for (let i = 0; i < numSamples; i++) {
        const index = weightedRandomChoice(probabilities);
        sampledIndices.push(movies[index].id);
    }
    return sampledIndices;
}

// Weighted random selection
function weightedRandomChoice(probabilities: number[]) {
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < probabilities.length; i++) {
        sum += probabilities[i];
        if (rand < sum) return i;
    }
    return probabilities.length - 1; // Return the last index if no other return occurred
}

// Example usage
const temperature = 0.5;
const userId = 1;

// Since getRecommendation is asynchronous, you must handle it with async/await or with .then()
async function displayRecommendations() {
    try {
        const movieRecommendationIds = await getRecommendation(userId, temperature);
        console.log("Recommended Movie IDs:", movieRecommendationIds);
    } catch (error: any) {
        console.error("Failed to get recommendations:", error.message);
    }
}

displayRecommendations();