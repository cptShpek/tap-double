import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import User from '../models/User';
import Referral from '../models/Referral';
import { head } from 'lodash';
import { omit } from 'lodash/fp';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Public
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.find({ walletId: req.params.id });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Public
export const createUser = asyncHandler(async (req, res, next) => {
  let user = await User.find({ walletId: req.body.walletId });
  user = head(user);

  if (user) {
    return next(new ErrorResponse(`User already exists`, 400));
  }

  user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Public
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate({ walletId: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Public
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findAndRemove({ walletId: req.params.id });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create user by referral
// @route   POST /api/v1/auth/referral
// @access  Public
export const createUserByReferral = asyncHandler(async (req, res, next) => {
  if (!req.body.walletId) {
    return next(new ErrorResponse(`Please, provide a wallet id`, 400));
  }

  const userExist = await User.findOne({ walletId: req.body.walletId });

  if (userExist) {
    return next(new ErrorResponse(`User already registered`, 400));
  }

  const referralData = await Referral.findOne({ linkCode: req.body.linkCode });

  if (!referralData) {
    return next(new ErrorResponse(`Referral info for this link code not found`, 404));
  }

  const updatedReferralData = await Referral.findOneAndUpdate(
    { walletId: referralData.walletId },
    { $inc: { friendCount: 1 } },
    {
      new: true,
      runValidators: true,
    },
  );

  const referralBonus = omit(referralData, ['friendCount', '__v', '_id', 'role']);
  const referralInfo = {
    walletId: updatedReferralData.walletId,
    ownPercent: updatedReferralData.ownPercent,
    friendPercent: updatedReferralData.friendPercent,
  };


  const user = await User.create({
    ...req.body,
    referralInfo,
    referralBonus,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
