import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import { parse } from 'csv-parse';
require('@tensorflow/tfjs-node');  // Use this for Node.js environment

import { getWatchlist } from './getWatchlist';

const loadCSVData = async (filePath: string, watchlist: any) => {
  const records = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    if (record.id in watchlist) {  // Check if this movie ID exists in the watchlist
      try {
        const releaseYear = parseInt(record.release_year);
        const runtime = parseInt(record.runtime);
        const revenue = parseInt(record.revenue);
        const voteAverage = parseFloat(record.vote_average);

        const cast1 = parseInt(record.cast_1);
        const cast2 = parseInt(record.cast_2);
        const cast3 = parseInt(record.cast_3);

        const genres = [
          parseInt(record.genre_28),
          parseInt(record.genre_12),
          parseInt(record.genre_16),
          parseInt(record.genre_35),
          parseInt(record.genre_80),
          parseInt(record.genre_99),
          parseInt(record.genre_18),
          parseInt(record.genre_10751),
          parseInt(record.genre_14),
          parseInt(record.genre_36),
          parseInt(record.genre_27),
          parseInt(record.genre_10402),
          parseInt(record.genre_9648),
          parseInt(record.genre_10749),
          parseInt(record.genre_878),
          parseInt(record.genre_10770),
          parseInt(record.genre_53),
          parseInt(record.genre_10752),
          parseInt(record.genre_37),
        ];

        const features = [
          releaseYear,
          runtime,
          revenue,
          voteAverage,
          cast1,
          cast2,
          cast3,
          ...genres,
          watchlist[record.id] // Directly use the binary value mapped in `getWatchlist`
        ];

        records.push(features);
      } catch (error) {
        console.error(`Error processing record ${record.id}: ${error}`);
      }
    }
  }

  return records;
};

export const trainModel = async (userId: number) => {
  const watchlist = await getWatchlist(userId);

  // Load data from CSV
  const data = await loadCSVData('static/final-dataset-normalized.csv', watchlist);

  // Check if the dataset size is a multiple of 20
  if (data.length % 20 !== 0) {
    console.error(`The dataset size is ${data.length}, which is not a multiple of 20. Aborting training.`);
    return; // Exit the function if condition is not met
  }

  const features = tf.tensor2d(data.map(item => item.slice(0, -1)));
  const labels = tf.tensor1d(data.map(item => item[item.length - 1]));

  // Define the model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({inputShape: [features.shape[1]], units: 10, activation: 'relu'}),
      tf.layers.dense({units: 1, activation: 'linear'})
    ]
  });

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
    metrics: ['meanAbsoluteError']
  });

  // Train the model
  await model.fit(features, labels, {
    epochs: 10,
    batchSize: 32
  });

  // Save the updated model
  const savePath = `../models/${userId}.json`;
  await model.save(savePath);

  // TODO: Store model to cloud storage 
  // TODO: Delete local model

  console.log('Model trained and saved successfully.');
};

// Function to demonstrate how to use the trainModel function
const userId = 1;

async function runTraining() {
  try {
      await trainModel(userId);
      console.log("Training completed successfully for user:", userId);
  } catch (error) {
      console.error("Training failed for user:", userId, "Error:", error);
  }
}

// Invoke the example usage function
runTraining();
