const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },

  deadline: {
    type: Date
  },

  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
