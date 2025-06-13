const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
    // Note: hash password before saving via middleware
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
