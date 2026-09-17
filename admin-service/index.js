const express = require('express');
const connectDB = require('./db');
const User = require('./User');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

// GET /admin/searchuser?query=daniel   (searches name or email)
app.get('/admin/searchuser', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.status(200).json({ count: users.length, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/viewalluser
app.get('/admin/viewalluser', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /admin/deluser
app.delete('/admin/deluser', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const deletedUser = await User.findOneAndDelete({ email: email.toLowerCase() });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'Admin Service', status: 'running' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log('Admin Service running on port ' + PORT);
});