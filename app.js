const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require('body-parser');
require("dotenv").config();

const userRoutes = require('./routes/userRoutes');

// app
const app = express();

// app.use(bodyParser.json());
app.use(express.json());

// routes middleware
app.use('/api/users', userRoutes);
// app.use(userRoutes);



module.exports = app;
