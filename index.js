const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.route'))

async function start() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(
      'mongodb+srv://admin:admin@cluster0.ielym5z.mongodb.net/todo?retryWrites=true&w=majority',
    );

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}
start();
