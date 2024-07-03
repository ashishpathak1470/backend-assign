const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://ashishpathak1470:ashish@cluster0.it173wi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to the database');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

const airportSchema = new mongoose.Schema({
  name: String,
  country: String,
  code: String,
  terminals: Number,
});

const Airport = mongoose.model('Airport', airportSchema);

app.get('/airports', async (req, res, next) => {
  try {
    const airports = await Airport.find();
    res.json(airports);
  } catch (error) {
    next(error);
  }
});

app.post('/airports', async (req, res, next) => {
  try {
    const newAirport = new Airport(req.body);
    await newAirport.save();
    res.json(newAirport);
  } catch (error) {
    next(error);
  }
});

app.put('/airports/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedAirport = await Airport.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedAirport);
  } catch (error) {
    next(error);
  }
});

app.delete('/airports/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await Airport.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ message: 'An internal server error occurred', error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
