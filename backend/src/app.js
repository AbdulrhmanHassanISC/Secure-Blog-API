const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userroutes');
const authRoutes = require('./routes/authRoute');
const postRoutes = require('./routes/postsRoute');
const profileRoute = require('./routes/profileRoute');
const categoryRoutes = require('./routes/categoryRoutes');
const ErrorHandler = require('./middlewares/ErrorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoute);
app.use('/api/categories', categoryRoutes);

app.use(ErrorHandler);

module.exports = app;
