const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Show the path of request when start
dotenv.config({path:'./config.env'});
const app = require('./app');

// Get the informations of config.env to connection with the DB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Create connection with mongoose
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB connection successful!');
}).catch((err) => console.error('Failed to connect to MongoDB', err));

// Start connection in the LocalHost!
const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
});