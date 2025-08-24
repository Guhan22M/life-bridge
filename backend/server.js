const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');
const passport = require('./config/passport');

connectDB();

const app = express();

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
})); 

// const __dirname = path.resolve(); it is not nessesary for normal js it is only for module it is pre build in this version

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());


app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/auth', require('./routes/googleAuthRoutes'));
app.use('/api/first-aid', require('./routes/firstAidRoutes'));
app.use('/api/blood-request', require('./routes/bloodReqRoutes'));


// Serve frontend
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.resolve(__dirname, '../client/life-bridge/build');
    app.use(express.static(buildPath));
  
    // Only match routes that are NOT API routes
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(buildPath, 'index.html'));
      } else {
        next();
      }
    });
  } else {
    app.get('/', (req, res) => res.send('Please set to production'));
  }

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
