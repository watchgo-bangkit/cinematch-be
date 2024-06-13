import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import { parse } from 'csv-parse';
require('@tensorflow/tfjs-node');  // Use this for Node.js environment

// Helper function to load and parse CSV data
const loadCSVData = async (filePath: string) => {
  const records = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    records.push([
      parseInt(record.release_year),
      parseInt(record.runtime),
      parseInt(record.revenue),
      parseFloat(record.vote_average),
      parseInt(record.cast_1),
      parseInt(record.cast_2),
      parseInt(record.cast_3),
      // Assuming we sum all genre columns as a feature; adjust as needed
      Object.keys(record).reduce((sum, key) => key.startsWith('genre_') ? sum + parseInt(record[key]) : sum, 0)
    ]);
  }
  return records;
};

export const trainModel = async () => {
  // Load data from CSV
  const data = await loadCSVData('../static/final-dataset.csv');
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
  const savePath = `file://path/to/save/model`;
  await model.save(savePath);

  console.log('Model trained and saved successfully.');
};

// Example usage
trainModel().then(() => {
  console.log('Training complete.');
}).catch(error => {
  console.error('Training failed:', error);
});
