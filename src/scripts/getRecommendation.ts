import fs from 'fs'
import Papa from 'papaparse'

interface Movie {
    id: number;
    imdb_rating: number;
    user_rating: number | null;
    is_interested: number | null;
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

const loadMovies = async (): Promise<Movie[]> => {
    const fileContent = fs.readFileSync('../static/final-dataset.csv', 'utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            complete: (results: { data: any[]; }) => {
                const movies = results.data.map((row) => ({
                    id: row.id,
                    imdb_rating: parseFloat(row.vote_average),  // Assuming 'vote_average' is analogous to 'imdb_rating'
                    user_rating: row.user_rating,
                    is_interested: row.is_interested
                }));
                resolve(movies);
            },
            error: function(err: Error) {
                reject(err);
            }
        });
    });
}

export const getRecommendation = async (userId: number, temperature: number) => {
    if (temperature <= 0) {
        console.error("Temperature must be greater than 0.");
        return null;
    }

    const movies = await loadMovies();
    
    // TODO: Execute model prediction

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
