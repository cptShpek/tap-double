import { filter, size, sumBy, uniqBy } from 'lodash';
import asyncHandler from '../middleware/async';
import * as eventTypes from '../types/events';
import Event from '../models/Event';

export const calculateTotal = {
  players(events) {
    const deposits = filter(events, ['eventType', eventTypes.deposit]);
    const uniqDeposits = uniqBy(deposits, 'walletId');
    return size(uniqDeposits) || 0;
  },

  volume(events) {
    const deposits = filter(events, ['eventType', eventTypes.deposit]);
    return sumBy(deposits, 'amount');
  },

  wins(events) {
    const wins = filter(events, ['eventType', eventTypes.winx2]);
    return size(wins);
  },
};

export const createEventRoute = (eventType) => {
  return (io) =>
    asyncHandler(async (req, res, next) => {
      req.body.eventType = eventTypes[eventType];
      const event = await Event.create(req.body);

      emitEvents({ event, eventType, req, io });

      res.status(200).json({
        success: true,
        data: event,
      });
    });
};

const emitEvents = ({ event, eventType, req, io }) => {
  io.emit(eventType, { event });
  
  emitFirstDeposit({ event, eventType, req, io })
};

const emitFirstDeposit = async ({ eventType, io }) => {
  if (eventType !== eventTypes.deposit) {
    return;
  }

  try {
    const events = await Event.find();

    if (!calculateTotal.players(events)) {
      return;
    }

    io.emit(eventTypes.newPlayer, { players: calculateTotal.players(events) });
  } catch (ex) {
    console.error({
      message: 'Emit event error',
      ex,
    });
  }
};
