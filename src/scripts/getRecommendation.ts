import * as tf from '@tensorflow/tfjs';
import fs from 'fs'
import Papa from 'papaparse'

interface Movie {
    id: number;
    imdb_rating: number;
    user_rating: number | null;
    is_interested: number | null;
    release_year: number;
    runtime: number;
    revenue: number;
    // Assuming all genre and cast features are already binary or correctly formatted
    cast_1: number;
    cast_2: number;
    cast_3: number;
    genre_28: number;
    genre_12: number;
    genre_16: number;
    genre_35: number;
    genre_80: number;
    genre_99: number;
    genre_18: number;
    genre_10751: number;
    genre_14: number;
    genre_36: number;
    genre_27: number;
    genre_10402: number;
    genre_9648: number;
    genre_10749: number;
    genre_878: number;
    genre_10770: number;
    genre_53: number;
    genre_10752: number;
    genre_37: number;
}

// const movies: Movie[] = [
//     { id: 1, imdb_rating: 8.2, user_rating: null, is_interested: null },
//     { id: 2, imdb_rating: 7.5, user_rating: 9.0, is_interested: 1 },
//     { id: 3, imdb_rating: 6.3, user_rating: 7.0, is_interested: 1 },
//     { id: 4, imdb_rating: 9.0, user_rating: null, is_interested: null },
// ];

const calculateScore = (movie: Movie) => {
    if (movie.user_rating === null && movie.is_interested === null) {
        return movie.imdb_rating;
    }

    let score = 0;
    let count = 0;
    if (movie.imdb_rating !== null) {
        score += movie.imdb_rating;
        count++;
    }
    if (movie.user_rating !== null) {
        score += movie.user_rating;
        count++;
    }
    if (movie.is_interested !== null) {
        score += movie.is_interested * 10; // Scale binary interest into a 0-10 range
        count++;
    }

    return count > 0 ? score / count : 0; // Safe division
}

const normalizeRating = (rating: number, min: number, max: number) => 
    ((rating - min) / (max - min)) * 10;

const getMinMaxRating = async (filePath: string, columnName: string): Promise<{ minRating: number, maxRating: number }> => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            complete: (results: { data: any[]; errors: any[] }) => {
                if (results.errors.length) {
                    reject(new Error("Errors occurred while parsing the data."));
                } else {
                    let min = Infinity;
                    let max = -Infinity;
                    results.data.forEach(row => {
                        const value = row[columnName];
                        if (value !== null && !isNaN(value)) {
                            if (value < min) min = value;
                            if (value > max) max = value;
                        }
                    });
                    resolve({ 
                        minRating: min, 
                        maxRating: max 
                    });
                }
            },
            error: (err: Error) => {
                reject(err);
            }
        });
    });
};

const loadMovies = async (): Promise<Movie[]> => {
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

                // Assuming 'vote_average', 'release_year', 'runtime', and 'revenue' need normalization
                const voteAverages = results.data.map(row => parseFloat(row.vote_average));
                const releaseYears = results.data.map(row => parseFloat(row.release_year));
                const runtimes = results.data.map(row => parseFloat(row.runtime));
                const revenues = results.data.map(row => parseFloat(row.revenue));

                // Calculate min and max for normalization
                const minVoteAverage = Math.min(...voteAverages);
                const maxVoteAverage = Math.max(...voteAverages);
                const minReleaseYear = Math.min(...releaseYears);
                const maxReleaseYear = Math.max(...releaseYears);
                const minRuntime = Math.min(...runtimes);
                const maxRuntime = Math.max(...runtimes);
                const minRevenue = Math.min(...revenues);
                const maxRevenue = Math.max(...revenues);

                const movies = results.data.map(row => ({
                    id: row.id,
                    imdb_rating: normalizeRating(row.vote_average, minVoteAverage, maxVoteAverage),
                    user_rating: row.user_rating ? parseFloat(row.user_rating) : null,
                    is_interested: row.is_interested,
                    release_year: normalizeRating(row.release_year, minReleaseYear, maxReleaseYear),
                    runtime: normalizeRating(row.runtime, minRuntime, maxRuntime),
                    revenue: normalizeRating(row.revenue, minRevenue, maxRevenue),
                    // Assuming all genre and cast features are already binary or correctly formatted
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

    const movies = await loadMovies();
    
    // TODO: Load model nya dari cloud storage lagi (replace code below)
    const model = await tf.loadLayersModel(`../models/${userId}.json`);

    // TODO: Execute model prediction
    const features = movies.map(movie => [
        movie.imdb_rating,  // assuming the model uses the normalized imdb_rating
        movie.release_year, // and other relevant features
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

    // Execute model prediction
    const predictionResult = model.predict(featuresTensor);
    let predictions;
    if (Array.isArray(predictionResult)) {
        // Handle the scenario where prediction results are an array of Tensors
        predictions = predictionResult[0].dataSync(); // Adjust this based on which tensor you need
    } else {
        // Directly handle the scenario where the prediction result is a single Tensor
        predictions = predictionResult.dataSync();
    }
    
    // Update movies with predicted is_interested values
    movies.forEach((movie, index) => {
        movie.is_interested = predictions[index] > 0.5 ? 1 : 0;  // Assuming a threshold for binary classification
    });
  
    const scores = movies.map(movie => calculateScore(movie));
    const maxScore = Math.max(...scores);
    const weightedScores = scores.map(score => Math.exp((score - maxScore) / temperature));

    const totalWeight = weightedScores.reduce((acc, val) => acc + val, 0);
    const randomIndex = weightedScores.map(weight => weight / totalWeight)
                                      .reduce((acc, weight, index) => {
                                          const sum = acc.sum + weight;
                                          return { sum, index: sum > Math.random() ? index : acc.index };
                                      }, { sum: 0, index: -1 }).index;

    return movies[randomIndex] ? movies[randomIndex].id : null; // Check if index is valid
}

// Example usage
const temperature = 0.5; 
const movieRecommendation = getRecommendation(1, temperature);
console.log("Recommended Movie ID:", movieRecommendation);
