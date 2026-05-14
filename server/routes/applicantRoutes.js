const express = require('express');
const { body, validationResult } = require('express-validator');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const applicationValidation = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('resumeUrl').isURL().withMessage('Invalid resume URL'),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years'),
];

// @desc    Get all applicants for recruiter
// @route   GET /api/v1/applicants
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 15, search, status, jobId } = req.query;
    
    const filter = { recruiter: req.user };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) filter.status = status;
    if (jobId) filter.job = jobId;

    const skip = (page - 1) * limit;

    const applicants = await Applicant.find(filter)
      .populate('job', 'title company')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Applicant.countDocuments(filter);

    res.json({
      success: true,
      data: applicants,
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

// @desc    Get applicants for specific job
// @route   GET /api/v1/applicants/job/:jobId
// @access  Private
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    const applicants = await Applicant.find({ 
      job: req.params.jobId,
      recruiter: req.user 
    }).populate('job', 'title company');

    res.json({ success: true, data: applicants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get single applicant
// @route   GET /api/v1/applicants/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id)
      .populate('job', 'title company description')
      .populate('recruiter', 'name email company');

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    // Check ownership
    if (applicant.recruiter._id.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Submit application
// @route   POST /api/v1/applicants/job/:jobId
// @access  Public
router.post('/job/:jobId', applicationValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    const existing = await Applicant.findOne({
      job: req.params.jobId,
      email: req.body.email,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    const applicant = await Applicant.create({
      ...req.body,
      job: req.params.jobId,
      recruiter: job.recruiter,
    });

    // Update job applicant count
    job.applicantCount = (job.applicantCount || 0) + 1;
    await job.save();

    res.status(201).json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Update applicant status
// @route   PATCH /api/v1/applicants/:id/status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    if (applicant.recruiter.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('job', 'title company');

    res.json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update applicant notes
// @route   PUT /api/v1/applicants/:id/notes
// @access  Private
router.put('/:id/notes', protect, async (req, res) => {
  try {
    const { notes } = req.body;

    let applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    if (applicant.recruiter.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    res.json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete applicant
// @route   DELETE /api/v1/applicants/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    if (applicant.recruiter.toString() !== req.user) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Applicant.findByIdAndDelete(req.params.id);

    // Update job applicant count
    const job = await Job.findById(applicant.job);
    if (job) {
      job.applicantCount = Math.max(0, (job.applicantCount || 1) - 1);
      await job.save();
    }

    res.json({ success: true, message: 'Applicant deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;