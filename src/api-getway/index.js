const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const logger = require('../../db-connection/logger');
const cors = require("cors")
const tokenCheck = require("../../middleware/index")
require('dotenv').config();

const app = express();
app.use(express.json())

app.use(cors());
const PORT = process.env.PORT || 3000;


app.get("", (req,res)=> res.status(200).json({mesage: "Hit"}))

app.post('/user/register', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/register', req.body);
    res.status(201).json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /register: ${err.message}`);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/author/register', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3001/register', req.body);
    res.status(201).json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /register: ${err.message}`);
    res.status(500).json({ message: 'Error registering user',error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/login', req.body);
    res.json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /login: ${err.message}`);
    res.status(500).json({ message: 'Error logging in user' });
  }
});

app.post('/book/register', tokenCheck, async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3003/books', req.body);
    res.json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /books: ${err.message}`);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

app.get('/books', tokenCheck, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3003/books');
    res.json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /books: ${err.message}`);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

app.get('/book/:id', tokenCheck, async (req, res) => {
  try {
    const _id = req.params.id;
    const response = await axios.get('http://localhost:3003/book/' + _id);
    res.json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /books: ${err.message}`);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

app.get('/orders', tokenCheck, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3004/getAllorders');
    res.status(200).json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /order: ${err.message}`);
    res.status(500).json({ message: 'Error placing order' });
  }
});

app.post('/order', tokenCheck, async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3004/createOrder',req.body);
    res.status(201).json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /order: ${err.message}`);
    res.status(500).json({ message: 'Error placing order' });
  }
});

app.get('/order/:id', tokenCheck, async (req, res) => {
  try {
    const _id = req.params.id;
    const response = await axios.get('http://localhost:3004/order/' + _id);
    res.json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /books: ${err.message}`);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

app.get('/getAllUsers', tokenCheck, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3002/getAllUsers');
    res.json(response.data);
  } catch (err) {
    logger.error(`Error in API Gateway - /login: ${err.message}`);
    res.status(500).json({ message: 'Error logging in user1' });
  }
});



app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
