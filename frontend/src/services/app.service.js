import { request } from '../helpers';

const GUEST_API_URL = '/server/api/v1/guests';
const USERS_API_URL = '/server/api/v1/users';
const REFERRAL_API_URL = '/server/api/v1/referrals';
const EVENTS_API_URL = '/server/api/v1/events';

function incrementUniqGuest() {
  return request(GUEST_API_URL, {
    method: 'post',
  });
}

function loginUser(userId) {
  return request(USERS_API_URL, {
    method: 'post',
    body: JSON.stringify({
      walletId: userId,
    }),
  });
}

function addUserByReferral(data) {
  return request(`${USERS_API_URL}/referral`, {
    method: 'post',
    body: JSON.stringify(data),
  });
}

function geInternalUserIdByWalletId(userId) {
  return request(`${USERS_API_URL}/${userId}`, {
    method: 'get',
  });
}

function generateReferralLink(data) {
  return request(REFERRAL_API_URL, {
    method: 'post',
    body: JSON.stringify(data),
  });
}

function getVisitedUsers() {
  return request(GUEST_API_URL, {
    method: 'get',
  });
}

function getAllReferralsByUser(userId) {
  return request(`${REFERRAL_API_URL}/${userId}`, {
    method: 'get',
  });
}

function sendSuccessDepositEvent(data) {
  return request(`${EVENTS_API_URL}/deposit`, {
    method: 'post',
    body: JSON.stringify(data),
  });
}

function sendSuccessWithdrawEvent(data) {
  return request(`${EVENTS_API_URL}/withdraw`, {
    method: 'post',
    body: JSON.stringify(data),
  });
}

function sendSuccessDoubleEvent(data) {
  return request(`${EVENTS_API_URL}/win-x2`, {
    method: 'post',
    body: JSON.stringify(data),
  });
}

function getLastEvents(limit = 10) {
  return request(`${EVENTS_API_URL}?limit=${limit}`, {
    method: 'get',
  });
}

function getTotals() {
  return request(`${EVENTS_API_URL}/totals`, {
    method: 'get',
  });
}

function getDayliChange() {
  return request(`${EVENTS_API_URL}/daily-change`, {
    method: 'get',
  });
}

function getChartData(daysRange = 14) {
  return request(`${EVENTS_API_URL}/chart-data?days-range=${daysRange}`, {
    method: 'get',
  });
}

export const appService = {
  incrementUniqGuest,
  getVisitedUsers,
  loginUser,
  generateReferralLink,
  getAllReferralsByUser,
  geInternalUserIdByWalletId,
  addUserByReferral,
  sendSuccessDepositEvent,
  sendSuccessWithdrawEvent,
  sendSuccessDoubleEvent,
  getLastEvents,
  getTotals,
  getDayliChange,
  getChartData,
};
