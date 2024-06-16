const express = require('express');
const morgan = require('morgan');


const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const urlRouter = require('./routes/urlRoutes');

const app = express();

// This command show whats enviorement is running
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// Middlewares
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTimme = new Date().toISOString();
    next();
});

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/urls', urlRouter);

// Start Server
module.exports = app;

