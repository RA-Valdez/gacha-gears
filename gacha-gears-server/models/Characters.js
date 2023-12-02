const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rarity: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model('Characters', CharacterSchema);