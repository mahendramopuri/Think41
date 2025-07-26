const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const loadCSV = (filename) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, 'data', filename))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

app.get('/api/users', async (_, res) => res.json(await loadCSV('users.csv')));
app.get('/api/orders', async (_, res) => res.json(await loadCSV('orders.csv')));
app.get('/api/order_items', async (_, res) => res.json(await loadCSV('order_items.csv')));
app.get('/api/products', async (_, res) => res.json(await loadCSV('products.csv')));
app.get('/api/inventory_items', async (_, res) => res.json(await loadCSV('inventory_items.csv')));
app.get('/api/distribution_centers', async (_, res) => res.json(await loadCSV('distribution_centers.csv')));

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
