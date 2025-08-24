const mongoose = require('mongoose');

const firstAidSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inputType: {
      type: String,
      enum: ['description', 'image','both'],
      required: true,
    },
    inputContent: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    aiResponse: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FirstAid', firstAidSchema);
