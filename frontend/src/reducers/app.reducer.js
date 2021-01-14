/* eslint-disable no-case-declarations */
import { remove, compose, insert } from 'ramda';
import { appActionTypes } from '../constants';

const initialUserInfo = {
  depositAmount: 0,
  userTotalAmount: 0,
  marginType: 0,
  totalInAmount: 0,
  totalOutAmount: 0,
  totalReferralBonusReceived: 0,
  isMarginAllowedToChange: 1,
  currentContractBalance: 0,
  dividendsAmount: 0,
  dailyPoolUserAttempts: 0,
  dailyPoolEndAt: null,
  dailyPoolAmount: 0,
  prizePool: 0,
  userDepositAmountWithMargin: 0,
};

const initialState = {
  uniqUsers: '',
  userId: null,
  generatedLink: '',
  friendCount: 0,
  error: null,
  loading: false,
  referralLinks: [],
  internalUserId: '',
  lastEvents: [],
  chartData: [],
  dailyChange: 0,
  referralInfo: null,
  totals: {
    players: 0,
    volume: 0,
    wins: 0,
  },
  userInfo: {
    ...initialUserInfo,
  },
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case appActionTypes.SEND_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case appActionTypes.FINISH_REQUEST:
      return {
        ...state,
        loading: false,
      };
    case appActionTypes.GET_VISITED_USERS_SUCCESS:
      return {
        ...state,
        uniqUsers: action.payload.data,
      };
    case appActionTypes.SAVE_USER_IN_STORE: {
      const newState = {
        ...state,
        ...action.payload,
      };

      if (!action.payload.userId) {
        newState.userInfo = { ...initialUserInfo };
      }

      return newState;
    }
    case appActionTypes.GENERATE_LINK_SUCCESS:
      return {
        ...state,
        generatedLink: action.payload.data.linkCode,
      };
    case appActionTypes.GET_ALL_REFERRALS_BY_USER:
      return {
        ...state,
        friendCount: action.payload.data.reduce(
          (accum, { friendCount }) => accum + friendCount,
          0,
        ),
        referralLinks: action.payload.data.map(({ linkCode }) => linkCode),
      };
    case appActionTypes.GET_INTERNAL_USER_ID:
      const { _id, referralInfo = null } = action.payload;
      return {
        ...state,
        internalUserId: _id,
        referralInfo,
      };
    case appActionTypes.SET_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    case appActionTypes.SET_USER_BALANCE: {
      const balance = Number(action.payload);
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          balance: Number(balance) % 1 === 0 ? balance : Number(balance.toFixed(2)),
        },
      };
    }
    case appActionTypes.GET_LAST_EVENTS: {
      return {
        ...state,
        lastEvents: action.payload,
      };
    }
    case appActionTypes.GET_CHART_DATA: {
      return {
        ...state,
        chartData: action.payload,
      };
    }
    case appActionTypes.GET_DAILY_CHANGE: {
      return {
        ...state,
        dailyChange: action.payload || 0,
      };
    }
    case appActionTypes.GET_TOTALS: {
      return {
        ...state,
        totals: action.payload,
      };
    }
    case appActionTypes.INCREASE_PLAYERS_COUNT: {
      return {
        ...state,
        totals: {
          ...state.totals,
          players: action.payload,
        },
      };
    }
    case appActionTypes.ADD_NEW_DEPOSIT_EVENT: {
      const { lastEvents, chartData } = state;
      const chartDataNew = [...chartData];
      chartDataNew.push(action.payload);
      const newEvents =
        lastEvents.length < 10
          ? insert(0, action.payload, lastEvents)
          : compose(
              insert(0, action.payload),
              remove(lastEvents.length - 1, 1),
            )(lastEvents);
      return {
        ...state,
        lastEvents: newEvents,
        chartData: chartDataNew,
        totals: {
          ...state.totals,
          volume: state.totals.volume + action.payload.amount,
        },
      };
    }
    case appActionTypes.ADD_NEW_WITHDRAW_EVENT: {
      const { lastEvents, chartData } = state;
      const chartDataNew = [...chartData];
      chartDataNew.push(action.payload);
      const newEvents =
        lastEvents.length < 10
          ? insert(0, action.payload, lastEvents)
          : compose(
              insert(0, action.payload),
              remove(lastEvents.length - 1, 1),
            )(lastEvents);
      return {
        ...state,
        lastEvents: newEvents,
        chartData: chartDataNew,
      };
    }
    case appActionTypes.ADD_NEW_DOUBLE_EVENT: {
      const { lastEvents } = state;
      const newEvents =
        lastEvents.length < 10
          ? insert(0, action.payload, lastEvents)
          : compose(
              insert(0, action.payload),
              remove(lastEvents.length - 1, 1),
            )(lastEvents);
      return {
        ...state,
        lastEvents: newEvents,
        totals: {
          ...state.totals,
          wins: state.totals.wins + 1,
        },
      };
    }
    case appActionTypes.SET_CONTRACT_BALANCE: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          currentContractBalance: action.payload || 0,
        },
      };
    }
    default:
      return state;
  }
}
