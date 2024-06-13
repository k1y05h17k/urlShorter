const express = require('express');
const morgan = require('morgan');


const app = express();

// This command show whats enviorement is running
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// Middlewares
app.use(express.json());

app.use((req,res,next)=>{
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTimme = new Date().toISOString();
    next();
});


module.exports = app;

