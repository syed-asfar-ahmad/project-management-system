const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth API route
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('API is working...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/projects', require('./routes/projects'));

app.use('/api/tasks', require('./routes/tasks'));

app.use('/api/users', require('./routes/users'));

app.use('/api/dashboard', require('./routes/dashboard'));


