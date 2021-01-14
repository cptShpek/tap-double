const express = require('express');
const router = express.Router();
const {
  getLastEvents,
  getDailyChange,
  getChartData,
  getTotals,
  createDeposit,
  getLastDeposit,
  createWithdraw,
  createWinX2,
} = require('../controllers/events');

export default (io) => {
  router.route('/').get(getLastEvents);
  router.route('/daily-change').get(getDailyChange);
  router.route('/chart-data').get(getChartData);
  router.route('/totals').get(getTotals);
  router.route('/deposit').post(createDeposit(io));
  router.route('/last-deposit/:userId').get(getLastDeposit);
  router.route('/withdraw').post(createWithdraw(io));
  router.route('/win-x2').post(createWinX2(io));

  return router;
};
