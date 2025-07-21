const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Team Member'],
    default: 'Team Member'
  },

  bio: { type: String },

  dateOfBirth: { type: Date },

  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  profilePicture: { type: String }, 

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
