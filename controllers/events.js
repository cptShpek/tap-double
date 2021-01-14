import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import Event from '../models/Event';
import Balance from '../models/Balance';
import * as eventTypes from '../types/events';
import { calculateTotal, createEventRoute } from '../helpers/events';
import moment from 'moment';
import { dateFormat } from '../utils/date';
import { get } from 'lodash';

// @desc    Create a deposit
// @route   POST /api/v1/events/deposit
// @access  Public
export const createDeposit = createEventRoute(eventTypes.deposit);

// @desc    Create a withdraw
// @route   POST /api/v1/events/withdraw
// @access  Public
export const createWithdraw = createEventRoute(eventTypes.withdraw);

// @desc    Create a win2x
// @route   POST /api/v1/events/win-x2
// @access  Public
export const createWinX2 = createEventRoute(eventTypes.winx2);

// @desc    Get all events
// @route   GET /api/v1/events?limit // limit = 10 by default
// @access  Public
export const getLastEvents = asyncHandler(async (req, res, next) => {
  const limit = +req.query.limit || 10;
  const sort = { createdAt: -1 };
  const lastEvents = await Event.find().sort(sort).limit(limit);

  res.status(200).json({
    success: true,
    data: lastEvents,
  });
});

// @desc    Get Daily Change
// @route   GET /api/v1/events/daily-change
// @access  Public
export const getDailyChange = asyncHandler(async (req, res, next) => {
  const today = moment().startOf('day').format(dateFormat);
  const yesterday = moment().subtract(1, 'day').startOf('day').format(dateFormat);
  const todayEventsQuery = {
    createdAt: {
      $gte: today,
    },
  };

  const yesterdayEventsQuery = {
    createdAt: {
      $gte: yesterday,
      $lte: today,
    },
  };

  const sortCreatedAtDesc = { createdAt: -1 };
  const [lastTodayBalance = { amount: 0 }] = await Balance.find(todayEventsQuery)
    .sort(sortCreatedAtDesc)
    .limit(1);

  const [lastYesterdayBalance = { amount: 0 }] = await Balance.find(yesterdayEventsQuery)
    .sort(sortCreatedAtDesc)
    .limit(1);

  const todayAmount = lastTodayBalance.amount;
  const yesterdayAmount = lastYesterdayBalance.amount;

  // dailyChange = (last today balance - last yesterday balance) / last today balance * 100
  const dailyChange = ((todayAmount - yesterdayAmount) / yesterdayAmount) * 100 || 0;
  const lastBalance = Balance.find().sort(sortCreatedAtDesc).limit(1);

  res.status(200).json({
    success: true,
    data: {
      dailyChange,
      contractBalance: get(lastBalance, 'amount') || 0,
    },
  });
});

// @desc    Get Chart Data
// @route   GET /api/v1/events/chart-data?days-range // days-range = 14 by default; 0 - is today
// @access  Public
export const getChartData = asyncHandler(async (req, res, next) => {
  const daysRange = +req.query['days-range'] >= 0 ? +req.query['days-range'] : 14;
  const format = 'YYYY-MM-DD HH:mm:ss';
  const daysRangeAgo = moment().subtract(daysRange, 'day').startOf('day').format(format);

  const daysRangeAgoEvents = await Event.find({
    createdAt: {
      $gte: daysRangeAgo,
    },
  });

  res.status(200).json({
    success: true,
    data: daysRangeAgoEvents,
  });
});

// @desc    Get totals
// @route   GET /api/v1/events/totals
// @access  Public
export const getTotals = asyncHandler(async (req, res, next) => {
  const events = await Event.find();
  const data = {
    players: calculateTotal.players(events),
    volume: calculateTotal.volume(events),
    wins: calculateTotal.wins(events),
  };

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Get last deposit
// @route   GET /api/v1/events/last-deposit/:userId
// @access  Public
export const getLastDeposit = asyncHandler(async (req, res, next) => {
  if (!req.params.userId) {
    return next(new ErrorResponse(`Provide userId`, 400));
  }

  const query = { eventType: 'deposit', userId: req.params.userId };
  const sort = { createdAt: -1 };
  const lastDeposit = await Event.find(query).sort(sort).limit(1);

  res.status(200).json({
    success: true,
    data: lastDeposit,
  });
});
