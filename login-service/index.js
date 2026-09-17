require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true });
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const User = require('./User');

const app = express();
app.use(express.json());

connectDB();

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== role) {
      return res.status(401).json({ message: 'Invalid role for this account' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Login service running on port ${PORT}`);
});