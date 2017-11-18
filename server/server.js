'use strict';

const express = require('express'),
      logger = require('morgan'), 
      mongoose = require('mongoose'), 
      bodyParser = require('body-parser'), 
      app = express(),
      config = require('../config'),
      // Import the routes
      userRoutes = require('./api/routes/usersRoutes'),
      documentRoutes = require('./api/routes/documentsRoutes'),
      searchRoutes = require('./api/routes/searchRoutes');

// Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config[process.env.NODE_ENV]['DATABASE'], { useMongoClient: true });

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());

// Routes
app.use('/api/users/', userRoutes);
app.use('/api/documents/', documentRoutes);
app.use('/api/search/', searchRoutes);

// Catch 404 Errors and forward them to error handlers
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    // Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
});

// Start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app; // for testing
