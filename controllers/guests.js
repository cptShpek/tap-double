const asyncHandler = require('../middleware/async');
const Guest = require('../models/Guest');

// @desc    Get all guests
// @route   GET /api/v1/guests
// @access  Private - admin
exports.getGuests = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: await Guest.find().countDocuments(),
  });
});

// @desc    Add guest
// @route   POST /api/v1/guests
// @access  Private - admin
exports.addGuest = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: await Guest.create({}),
  });
});
