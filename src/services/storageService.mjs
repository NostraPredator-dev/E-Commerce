import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const app = express();
const port = 5000;

const uri = 'mongodb+srv://hcmcdc6038:Hc6038mc7!@e-commerce.fuuox.mongodb.net/E-CommUserData?retryWrites=true&w=majority&appName=E-Commerce';
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Connect to MongoDB
await client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.error('MongoDB connection error: ', e));

const database = client.db('E-CommUserData');

// Register a User
app.post('/users', async (req, res) => {
  try {
    const collection = database.collection('users');
    const { name, phone, email, password, provider, googleId } = req.body;

    if (!provider || !['email', 'google'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    // Check if user with the same email and provider already exists
    const existingUser = await collection.findOne({ email, provider });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email and provider' });
    }

    let newUser = { name, phone, email, provider, createdAt: new Date() };

    if (provider === 'email') {
      if (!password) return res.status(400).json({ error: 'Password is required for email sign-up' });

      newUser.password = await bcrypt.hash(password, 10);
    } else if (provider === 'google') {
      if (!googleId) return res.status(400).json({ error: 'Google ID is required for Google sign-in' });

      newUser.googleId = googleId;
    }

    await collection.insertOne(newUser);

    console.log(res.status(201).json({ message: 'User registered successfully', user: { email, provider } }));
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a User by Email
app.get('/users/:email', async (req, res) => {
  try {
    const collection = database.collection('users');
    const user = await collection.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Save or Update a Cart
app.post('/cart', async (req, res) => {
  try {
    const collection = database.collection('carts');
    const { email, items } = req.body;

    const cart = await collection.findOneAndUpdate(
      { email },
      { $set: { email, items } },
      { upsert: true, returnDocument: 'after' }
    );

    let result = cart.value;
    if (!result) {
      result = await collection.findOne({ email });
    }

    res.status(200).json({ message: 'Cart saved successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Cart by Email
app.get('/cart/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const collection = database.collection('carts');
    const cart = await collection.findOne({ email });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const collection = database.collection('products');
    const id = parseInt(req.params.id);
    const product = await collection.findOne({ id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a Review to a Product
app.post('/products/:id/reviews', async (req, res) => {
  try {
    const collection = database.collection('products');
    const id = parseInt(req.params.id);
    const { rating, comment, reviewerName, reviewerEmail } = req.body;

    const product = await collection.findOne({ id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const newReview = { rating, comment, reviewerName, reviewerEmail, date: new Date() };
    const updatedReviews = [...product.reviews, newReview];
    console.log(updatedReviews);
    const updatedRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

    await collection.updateOne(
      { id: id },
      { $set: { reviews: updatedReviews, rating: updatedRating } }
    );

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
