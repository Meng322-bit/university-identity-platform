require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true });
const express = require('express');
const bcrypt = require('bcrypt');
const connectDB = require('./db');
const User = require('./User');

const app = express();
app.use(express.json());

connectDB();

app.post('/userregister', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Register service running on port ${PORT}`);
});