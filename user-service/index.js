const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const User = require('./User');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

function getEmailFromToken(req) {
  const authHeader = req.headers['authorization'];
  console.log('DEBUG authHeader:', authHeader);
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  console.log('DEBUG token:', token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('DEBUG decoded:', decoded);
  return decoded.email;
}

app.get('/user/viewprofile', async (req, res) => {
  try {
    const email = getEmailFromToken(req);
    if (!email) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.log('DEBUG route error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.put('/user/updateprofile', async (req, res) => {
  try {
    const email = getEmailFromToken(req);
    if (!email) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { name, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { ...(name && { name }), ...(phone && { phone }) } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});