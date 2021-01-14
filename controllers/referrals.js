const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Referral = require("../models/Referral");
const { head } = require("lodash");
const { getUniqueLinkCode } = require("../utils/unique-link-code");

// @desc    Get all referrals
// @route   GET /api/v1/referrals
// @access  Public
exports.getReferrals = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Create referral link
// @route   POST /api/v1/referrals
// @access  Public
exports.createReferralLink = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ walletId: req.body.walletId });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.body.walletId}`, 404)
    );
  }

  const linkCode = await getUniqueLinkCode();

  const referral = await Referral.create({
    linkCode,
    ...req.body,
  });

  console.log({ linkCode });

  res.status(200).json({
    success: true,
    data: referral,
  });
});

// @desc    Get all referrals by user
// @route   GET /api/v1/referrals/:id
// @access  Public
exports.getReferralsByUser = asyncHandler(async (req, res, next) => {
  const referralLinks =
    (await Referral.find({ walletId: req.params.id })) || [];

  res.status(200).json({
    success: true,
    count: referralLinks.length,
    data: referralLinks,
  });
});
