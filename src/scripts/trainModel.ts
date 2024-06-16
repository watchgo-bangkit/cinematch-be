import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import { parse } from 'csv-parse';
require('@tensorflow/tfjs-node');  // Use this for Node.js environment
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const loadCSVData = async (filePath: string, watchlist: any) => {
  const records = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    if (record.id in watchlist) {  // Check if this movie ID exists in the watchlist
      records.push([
        parseInt(record.release_year),
        parseInt(record.runtime),
        parseInt(record.revenue),
        parseFloat(record.vote_average),
        parseInt(record.cast_1),
        parseInt(record.cast_2),
        parseInt(record.cast_3),
        Object.keys(record).reduce((sum, key) => key.startsWith('genre_') ? sum + parseInt(record[key]) : sum, 0),
        watchlist[record.id] ? 1 : 0  // This is your label, based on whether the movie was liked
      ]);
    }
  }
  return records;
};

const getWatchlist = async (userId: number) => {
  const watchlistItems = await prisma.watchlist.findMany({
    select: {
      movie_id: true,
      liked: true
    },
    where: { user_id: userId },
  });
  // Convert array to a dictionary for easier access
  return watchlistItems.reduce((
    acc: any, 
    item: {movie_id: number, liked: boolean}
  ) => {
    acc[item.movie_id] = item.liked;
    return acc;
  }, {});
};

export const trainModel = async (userId: number) => {
  const watchlist = await getWatchlist(userId);

  // Load data from CSV
  const data = await loadCSVData('../static/final-dataset-normalized.csv', watchlist);
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
  // TODO: Delete yg di local

  console.log('Model trained and saved successfully.');
};
