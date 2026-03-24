const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const pollRoutes = require('./routes/pollRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express();

 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
 
app.use('/api/polls', pollRoutes);
app.use('/api/auth', authRoutes)
 
app.get('/', (req, res) => {
  res.json({ status: ' Decision Maker API running' });
});

 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Atlas Connected!');
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1);
  });