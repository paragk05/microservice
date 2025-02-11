const mongoose = require('mongoose');
const logger = require('./logger');

const connectToDb = async () => {
  try {
    const dbURI = 'mongodb://localhost:27017/bookstore';
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDb;
