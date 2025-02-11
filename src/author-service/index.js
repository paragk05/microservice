const express = require('express');
const Author = require('../../models/author');
const logger = require('../../db-connection/logger');
const connectToDb = require('../../db-connection/db-connection');
const cors= require("cors")
const app = express();
require('dotenv').config();

connectToDb();

app.use(express.json());
app.use(cors());
const PORT = process.env.AUTHOR_SERVICE_PORT || 3001;

app.post('/register', async (req, res) => {
  const { name, biography, dateOfBirth } = req.body;

  try {
    const newAuthor = new Author({
      name,
      biography,
      dateOfBirth
    });

    const savedAuthor = await newAuthor.save();
    logger.info(`Author created successfully. AuthorId: ${savedAuthor._id}`);
    res.status(201).json({ message: 'Author created successfully', author: savedAuthor });
  } catch (error) {
    logger.error(`Error creating author: ${error.message}`);
    res.status(500).json({ message: 'Error creating author', error: error.message });
  }
});

app.listen(PORT, () => {
  logger.info(`User Service running on port ${PORT}`);
});
