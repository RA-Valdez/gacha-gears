const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuildSchema = new mongoose.Schema({
  character: {
    type: Schema.Types.ObjectId,
    ref: "Characters",
    required: true,
  },
  relic: [{
    type: Schema.Types.ObjectId,
    ref: "Relics",
    required: true,
  }],
  ornament: {
    type: Schema.Types.ObjectId,
    ref: "Ornaments",
    required: true,
  },
  body: {
    type: String,
  },
  feet: {
    type: String,
  },
  sphere: {
    type: String,
  },
  rope: {
    type: String,
  },
  substats: {
    type: String,
  },
  lb: {
    type: Boolean,
  },
});

module.exports = User = mongoose.model('Builds', BuildSchema);