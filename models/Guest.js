import mongoose from 'mongoose';
import { guest } from '../types/roles';

const GuestSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: [guest],
    default: guest,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Guest', GuestSchema);
