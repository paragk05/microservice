const express = require('express');
const Book = require('../../models/book');
const Author = require('../../models/author'); 
const cors = require('cors');
const connectToDb = require('../../db-connection/db-connection');
const logger = require('../../db-connection/logger');
require('dotenv').config();


const app = express();
const PORT = process.env.BOOK_SERVICE_PORT || 3003;

connectToDb();
app.use(express.json());
app.use(cors());

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json(books);
  } catch (err) {
    logger.error(`Error fetching books: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.get('/book/:id', async (req, res) => {
    try {
        const _id= req.params.id;
      const books = await Book.findOne({_id}).populate('author');
      res.status(200).json(books);
    } catch (err) {
      logger.error(`Error fetching books: ${err.message}`);
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  });

app.post('/books', async (req, res) => {
  const { title, author, price, description } = req.body;
  try {
    const book = new Book({ title, author, price, description });
    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    logger.error(`Error adding book: ${err.message}`);
    res.status(500).json({ message: 'Error adding book' });
  }
});

app.listen(PORT, () => {
  logger.info(`Book Service running on port ${PORT}`);
});
