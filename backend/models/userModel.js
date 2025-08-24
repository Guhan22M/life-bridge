const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please add name"] },
  email: { type: String, required: [true, "add your email"], unique: true },
  password: { type: String, required: [true, "add your password"] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
