const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

const router = express.Router();

// Validation rules
const jobValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').isIn(['Full-Time', 'Part-Time', 'Contract', 'Internship']).withMessage('Invalid job type'),
  body('category').isIn(['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Other']).withMessage('Invalid category'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('company').trim().notEmpty().withMessage('Company is required'),
];

// @desc    Get all jobs for recruiter
// @route   GET /api/v1/jobs
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, category, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const filter = { recruiter: req.user };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: order === 'desc' ? -1 : 1 };

    const jobs = await Job.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter._id.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a job
// @route   POST /api/v1/jobs
// @access  Private
router.post('/', jobValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const job = await Job.create({
      ...req.body,
      recruiter: req.user,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private
router.put('/:id', jobValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Delete related applicants
    await Applicant.deleteMany({ job: req.params.id });

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update job status
// @route   PATCH /api/v1/jobs/:id/status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;