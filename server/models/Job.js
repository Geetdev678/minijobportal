const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, minlength: 3, maxlength: 100 },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'], required: true },
  category: { type: String, enum: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Other'], required: true },
  description: { type: String, required: true },
  requirements: [String],
  salaryMin: Number,
  salaryMax: Number,
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  deadline: Date,
  applicantCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);