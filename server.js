const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

//Routes files
const auth = require('./routes/auth');
const book = require('./routes/book');
const user = require('./routes/user');

const app = express();

//Body parser
app.use(express.json());

//Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/book', book);
app.use('/api/v1/user', user);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});