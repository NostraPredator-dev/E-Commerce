const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://hcmcdc6038:Hc6038mc7!@e-commerce.fuuox.mongodb.net/E-CommUserData?retryWrites=true&w=majority&appName=E-Commerce')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

app.post('/users', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      thumbnail: { type: String },
    },
  ],
});
const Cart = mongoose.model('Cart', cartSchema);

app.post('/cart', async (req, res) => {
  try {
    const { email, items } = req.body;
    
    let cart = await Cart.findOne({ email });

    if (cart) {
      cart.items = items;
    } else {
      cart = new Cart({ email, items });
    }

    await cart.save();
    res.status(200).json({ message: 'Cart saved successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/cart/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email);
    const cart = await Cart.findOne({ email });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
