const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const partSchema = mongoose.Schema({
  title: { type: String, required: true, default: "No title" },
  content: { type: String, required: true },
  partNumber: { type: String, required: true, unique: true },
  imagePath: { type: String },
  createdBy: { type: String, required: true }
},
  { collection: 'carParts' }
);

partSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Part', partSchema);
