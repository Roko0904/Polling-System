const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: {
    type: [optionSchema],
    validate: {
      validator: function(v) { return v.length >= 2 && v.length <= 4; },
      message: 'Poll must have 2 to 4 options'
    }
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// active check
pollSchema.virtual('isActive').get(function () {
  return new Date() < new Date(this.expiresAt);
});

// total votes
pollSchema.virtual('totalVotes').get(function () {
  return this.options.reduce((sum, o) => sum + o.votes, 0);
});

//winning option
pollSchema.virtual('winner').get(function () {
  if (this.isActive) return null;
  return [...this.options].sort((a, b) => b.votes - a.votes)[0];
});

pollSchema.set('toJSON', { virtuals: true });
pollSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Poll', pollSchema);