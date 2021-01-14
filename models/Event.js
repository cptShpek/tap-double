import mongoose from 'mongoose';
import { deposit, withdraw, winx2 } from '../types/events';
import { x1, x2, x3, x4 } from '../types/margins';

const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: [deposit, withdraw, winx2],
    required: [true, 'Please, provide eventType'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please, provide userId'],
  },
  walletId: {
    type: String,
    trim: true,
    minlength: 10,
    required: [true, 'Please, provide walletId'],
  },
  amount: {
    type: Number,
    min: 0,
    required: [true, 'Please, provide amount'],
  },
  margin: {
    type: String,
    enum: [x1, x2, x3, x4],
  },
  tronLink: {
    type: String,
    trim: true,
    required: [true, 'Please, provide tronLink'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);
