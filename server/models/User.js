const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, default: 'recruiter' },
  avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);