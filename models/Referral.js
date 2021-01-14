import mongoose from 'mongoose';
import { user } from '../types/roles';

const ReferralSchema = new mongoose.Schema({
  linkCode: {
    type: String,
    unique: true,
  },
  walletId: {
    type: String,
    trim: true,
    minlength: 10,
    required: [true, 'Please, add a walletId'],
  },
  ownPercent: {
    type: Number,
    required: [true, 'Please, add a ownPercent'],
  },
  friendPercent: {
    type: Number,
    required: [true, 'Please, add a friendPercent'],
  },
  friendCount: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: [user],
    default: user,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Referral', ReferralSchema);
