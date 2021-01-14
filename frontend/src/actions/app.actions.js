import { path } from 'ramda';
import { appActionTypes } from '../constants';
import { appService } from '../services';

function incrementUniqGuest() {
  return (dispatch) => {
    return appService
      .incrementUniqGuest()
      .then((response) => {
        dispatch(getVisitedUsers());
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function getVisitedUsers() {
  return (dispatch) => {
    return appService
      .getVisitedUsers()
      .then((response) => {
        dispatch(getVisitedUsersSuccess(response));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function generateReferralLink(walletId) {
  return (dispatch) => {
    return appService
      .generateReferralLink(walletId)
      .then((response) => {
        dispatch(generateReferralLinkSuccess(response));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function loginUser({ userId, userName }) {
  return (dispatch) => {
    dispatch(saveUserInStore({ userId, userName }));
    return appService.loginUser(userId).catch((err) => {
      console.log('User already exist', err);
    });
  };
}

function addUserByReferral({ userId, referralId, userName }) {
  return (dispatch) => {
    dispatch(saveUserInStore({ userId, userName }));
    return appService
      .addUserByReferral({ walletId: userId, linkCode: referralId })
      .catch((err) => console.log('User already exist', err));
  };
}

function getAllReferralsByUser(userId) {
  return (dispatch) => {
    return appService
      .getAllReferralsByUser(userId)
      .then((response) => {
        dispatch(getAllReferralsByUserSuccess(response));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function geInternalUserIdByWalletId(walletId) {
  return (dispatch) => {
    return appService
      .geInternalUserIdByWalletId(walletId)
      .then((response) => {
        // eslint-disable-next-line no-underscore-dangle
        dispatch(geInternalUserIdByWalletIdSuccess(response.data[0]));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function getLastEvents(limit = 10) {
  return (dispatch) => {
    return appService
      .getLastEvents(limit)
      .then((response) => {
        dispatch(getLastEventsSuccess(response.data));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function getChartData(daysRange) {
  return (dispatch) => {
    return appService
      .getChartData(daysRange)
      .then((response) => {
        dispatch(getChartDataSuccess(response.data));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function getDayliChange() {
  return (dispatch) => {
    return appService
      .getDayliChange()
      .then((response) => {
        dispatch(getDayliChangeSuccess(path(['data', 'dailyChange'], response)));
        dispatch(setContractBalance(path(['data', 'contractBalance'], response)));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

function getTotals() {
  return (dispatch) => {
    return appService
      .getTotals()
      .then((response) => {
        dispatch(getTotalsSuccess(response.data));
        return response;
      })
      .catch((error) => dispatch(appRequestFailure(error)));
  };
}

const saveUserInStore = (userData) => ({
  type: appActionTypes.SAVE_USER_IN_STORE,
  payload: userData,
});

const appSendRequest = () => ({
  type: appActionTypes.SEND_REQUEST,
  loading: true,
});

const appFinishRequest = () => ({
  type: appActionTypes.FINISH_REQUEST,
  loading: false,
});

const appRequestFailure = (error) => ({
  type: appActionTypes.REQUEST_FAILURE,
  payload: error,
  loading: false,
});

const getVisitedUsersSuccess = (payload) => ({
  type: appActionTypes.GET_VISITED_USERS_SUCCESS,
  payload,
  loading: false,
});

const generateReferralLinkSuccess = (payload) => ({
  type: appActionTypes.GENERATE_LINK_SUCCESS,
  payload,
  loading: false,
});

const getAllReferralsByUserSuccess = (payload) => ({
  type: appActionTypes.GET_ALL_REFERRALS_BY_USER,
  payload,
  loading: false,
});

const geInternalUserIdByWalletIdSuccess = (payload) => ({
  type: appActionTypes.GET_INTERNAL_USER_ID,
  payload,
  loading: false,
});

const setUserInfo = (payload) => ({
  type: appActionTypes.SET_USER_INFO,
  payload,
  loading: false,
});

const setUserBalance = (balance) => ({
  type: appActionTypes.SET_USER_BALANCE,
  payload: balance,
  loading: false,
});

const getLastEventsSuccess = (payload) => ({
  type: appActionTypes.GET_LAST_EVENTS,
  payload,
  loading: false,
});

const getChartDataSuccess = (payload) => ({
  type: appActionTypes.GET_CHART_DATA,
  payload,
  loading: false,
});

const getDayliChangeSuccess = (payload) => ({
  type: appActionTypes.GET_DAILY_CHANGE,
  payload,
  loading: false,
});

const addNewDepositEvent = (payload) => ({
  type: appActionTypes.ADD_NEW_DEPOSIT_EVENT,
  payload,
  loading: false,
});

const addNewWithdrawEvent = (payload) => ({
  type: appActionTypes.ADD_NEW_WITHDRAW_EVENT,
  payload,
  loading: false,
});

const addNewDoubleEvent = (payload) => ({
  type: appActionTypes.ADD_NEW_DOUBLE_EVENT,
  payload,
  loading: false,
});

const increasePlayersCount = (payload) => ({
  type: appActionTypes.INCREASE_PLAYERS_COUNT,
  payload,
  loading: false,
});

const getTotalsSuccess = (payload) => ({
  type: appActionTypes.GET_TOTALS,
  payload,
  loading: false,
});

const setContractBalance = (payload) => ({
  type: appActionTypes.SET_CONTRACT_BALANCE,
  payload,
  loading: false,
});

export const appActions = {
  appSendRequest,
  appFinishRequest,
  incrementUniqGuest,
  getVisitedUsers,
  loginUser,
  generateReferralLink,
  addUserByReferral,
  getAllReferralsByUser,
  geInternalUserIdByWalletId,
  setUserInfo,
  setUserBalance,
  getLastEvents,
  getChartData,
  getDayliChange,
  getTotals,
  addNewDepositEvent,
  addNewWithdrawEvent,
  addNewDoubleEvent,
  increasePlayersCount,
  setContractBalance,
};
