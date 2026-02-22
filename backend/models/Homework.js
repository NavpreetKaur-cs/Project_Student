const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  assignedBy: String,
  class: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Class',
  required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Homework', homeworkSchema);