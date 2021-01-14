import mongoose from 'mongoose';
import { user } from '../types/roles';

const UserSchema = new mongoose.Schema({
  walletId: {
    type: String,
    trim: true,
    unique: true,
    minlength: 10,
    required: [true, 'Please, add a walletId'],
  },
  referralInfo: {
    walletId: {
      type: String,
      trim: true,
      minlength: 10,
    },
    ownPercent: {
      type: Number,
    },
    friendPercent: {
      type: Number,
    },
  },
  referralBonus: {
    type: {
      type: String,
      enum: ['Referral'],
    },
    walletId: {
      type: String,
      trim: true,
      minlength: 10,
    },
    linkCode: {
      type: String,
      trim: true,
      minlength: 6,
    },
    ownPercent: {
      type: Number,
    },
    friendPercent: {
      type: Number,
    },
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

module.exports = mongoose.model('User', UserSchema);
