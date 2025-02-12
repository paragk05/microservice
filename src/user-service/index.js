const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const connectToDb = require('../../db-connection/db-connection');
const logger = require('../../db-connection/logger');
const cors = require("cors")
require('dotenv').config();


const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3002;

connectToDb();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    logger.error(`Error registering user: ${err.message}`);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    console.log(process.env.JWT_SECRET)

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    logger.error(`Error logging in user: ${err.message}`);
    res.status(500).json({ message: 'Error logging in user' });
  }
});

app.get('/getAllUsers', async(req,res)=> {
  try {
    const users = await User.find().select("username email -_id");
    res.status(200).json(users)
  } catch (error) {
    logger.error(`Error fetching in user: ${err.message}`);
    res.status(500).json({ message: 'Error logging in user' });
  }
})

app.listen(PORT, () => {
  logger.info(`User Service running on port ${PORT}`);
});
