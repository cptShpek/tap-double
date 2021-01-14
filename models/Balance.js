import mongoose from 'mongoose';
import moment from 'moment';
import { dateFormat } from '../utils/date';

const BalanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please, add amount'],
  },
  createdAt: {
    type: String,
    default: moment().format(dateFormat),
  },
});

module.exports = mongoose.model('Balance', BalanceSchema);
