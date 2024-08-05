const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');

// Routes Require
const sequelize = require('./database/db');
const userRoutes = require('./routes/userRoutes');


// DataBase Tables
const User = require('./models/User');

const app = express()
app.use(express());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Routes
app.use('/user', userRoutes);
app.use(express.static(path.join(__dirname, 'views')));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'index.html'));
  });

// Error in middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send({ message: 'Internal Server Error' });
    next();
  });


// Server & Database Start
sequelize.sync()
  .then(() => {
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((err) => {
    console.error('Error syncing with the database', err);
  });
