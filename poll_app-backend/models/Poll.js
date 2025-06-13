const mongoose = require('mongoose');

// Custom validator: options must have at least 2
function arrayLimit(val) {
  return val.length >= 2;
}

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'Poll must have at least two options']
  },
  votes: {
    type: Map,
    of: Number,
    default: () => ({})
  },
  votedUsers: {
    type: [String],
    default: []
  },
  closingDate: {
    type: Date,
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Poll', pollSchema);
