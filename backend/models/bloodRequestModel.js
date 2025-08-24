const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  age:{
    type: Number,
    required:true,
  },
  condition: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  unitsNeeded: {
    type: Number,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  hospitalLocation: {
    type: String,
    required: true,
  },
  wardOrRoomNumber: {
    type: String,
  },
  description: {
    type: String,
  },
  recipients: [String], // emails contacted
  responses: [
    {
      email: String,
      response: String, // 'yes' or 'no'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
