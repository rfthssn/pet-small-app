const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const weightSchema = new Schema({
  user: {
    type: String,
    required: true,
  },

  weight_in_kg: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const weight = mongoose.model('weight', weightSchema);

module.exports = weight;