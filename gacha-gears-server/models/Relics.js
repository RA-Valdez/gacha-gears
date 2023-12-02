const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  zone: {
    type: Schema.Types.ObjectId,
    ref: "Zones",
    required: true,
  },
});

module.exports = User = mongoose.model('Relics', RelicSchema);