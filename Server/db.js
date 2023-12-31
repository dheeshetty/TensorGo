// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dheemanthshetty1:dheeshetty@cluster0.ybc4r6u.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
