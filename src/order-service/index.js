const express = require('express');
const Order = require('../../models/order');
const Book = require('../../models/book');
const User = require('../../models/user');
const Author = require('../../models/author');
const connectToDb = require('../../db-connection/db-connection');
const logger = require('../../db-connection/logger');
const axios = require('axios');
require('dotenv').config();


const app = express();
const PORT = process.env.ORDER_SERVICE_PORT || 3004;

connectToDb();
app.use(express.json());

app.get('/getAllorders', async (req, res) => {
  try {
    let orders = await Order.find()
    .populate({ path: "user", select: "email -_id"})
    .populate({ path: "books"});
    if(orders.length < 1) {
      throw new Error;
    }
    res.status(200).json({ data: orders });
  } catch (err) {
    logger.error(`Error creating order: ${err.message}`);
    res.status(500).json({ message: 'Error creating order' });
  }
});


app.post('/createOrder', async (req, res) => {
  const { user, books, quantity, shippingAddress } = req.body;
  try {
    let bookData;
      try {
        const response = await axios.get('http://localhost:3003/book/' + books);
        bookData = response.data;
      } catch (err) {
        logger.error(`Error in API Gateway - /books: ${err.message}`);
        throw new err;
      }
    if(!bookData) {
      throw new Error;
    }
    let totalAmount = quantity * bookData.price;
    const order = new Order({ user, books, quantity, totalAmount, shippingAddress });
    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    logger.error(`Error creating order: ${err.message}`);
    res.status(500).json({ message: 'Error creating order' });
  }
});

app.get('/order/:id', async (req, res) => {
  try {
      const _id= req.params.id;
    const order = await Order.findOne({_id})
    .populate({ path: "user", select: "email -_id"})
    .populate({ path: "books"})
    res.status(200).json(order);
  } catch (err) {
    logger.error(`Error fetching books: ${err.message}`);
    console.log(err)
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  logger.info(`Order Service running on port ${PORT}`);
});
