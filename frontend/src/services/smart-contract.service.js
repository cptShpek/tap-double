/* eslint-disable class-methods-use-this */
import { isNil, path } from 'ramda';
import { request } from '../helpers';

export const smartContractAdresses = {
  USER: 'TMcBfuGpqXDAHVPUVVo9inacyb78i56JqW',
  GAME: 'TNXY7BH3tuZV2T94K6MSVw4oCLBKeDm79w',
  STATS: 'TN3DDHR1NS4eow8a2bYMWL5UY2VjCrrVXd',
};

export const TRON_SCAN_URL = 'https://tronscan.org';
export const TRON_WEB_API_URL = 'https://api.trongrid.io';

export class SmartContractService {
  constructor(tronWeb, user) {
    this.userContract = null;
    this.gameContract = null;
    this.statsContract = null;
    this.tronWeb = tronWeb;
    this.user = user;

    this.initSmartContracts();
  }

  async initSmartContracts() {
    try {
      const [userContract, gameContract, statsContract] = await Promise.all([
        this.tronWeb.contract().at(smartContractAdresses.USER),
        this.tronWeb.contract().at(smartContractAdresses.GAME),
        this.tronWeb.contract().at(smartContractAdresses.STATS),
      ]);
      this.userContract = userContract;
      this.gameContract = gameContract;
      this.statsContract = statsContract;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getStats() {
    try {
      if (isNil(this.statsContract)) {
        this.statsContract = await this.tronWeb
          .contract()
          .at(smartContractAdresses.STATS);
      }

      const stats = await this.statsContract.getStats(this.user).call();
      const { userDepositAmountWithMargin } = await this.getUserInfo();
      const depositAmount = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[0]));
      const userTotalAmount = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[1]));
      const marginType = this.tronWeb.toDecimal(stats[2]);
      const totalInAmount = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[3]));
      const totalOutAmount = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[4]));
      const totalReferralBonusReceived = this.tronWeb.toDecimal(
        this.tronWeb.fromSun(stats[5]),
      );
      const isMarginAllowedToChange = this.tronWeb.toDecimal(stats[6]);
      const currentContractBalance = this.tronWeb.toDecimal(
        this.tronWeb.fromSun(stats[7]),
      );
      const dividendsAmount = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[8]));
      const dailyPoolUserAttempts = this.tronWeb.toDecimal(stats[9]);
      const dailyPoolEndAt = this.tronWeb.toDecimal(stats[10]);
      const dailyPoolAmount = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[11]));
      const prizePool = this.tronWeb.toDecimal(this.tronWeb.fromSun(stats[12]));

      // console.log({
      //   depositAmount,
      //   userTotalAmount,
      //   marginType,
      //   totalInAmount,
      //   totalOutAmount,
      //   totalReferralBonusReceived,
      //   isMarginAllowedToChange,
      //   currentContractBalance,
      //   dividendsAmount,
      //   dailyPoolUserAttempts,
      //   dailyPoolEndAt,
      //   dailyPoolAmount,
      //   prizePool,
      // });

      return {
        depositAmount,
        userTotalAmount,
        marginType,
        totalInAmount,
        totalOutAmount,
        totalReferralBonusReceived,
        isMarginAllowedToChange,
        currentContractBalance,
        dividendsAmount,
        dailyPoolUserAttempts,
        dailyPoolEndAt: dailyPoolEndAt * 1000,
        dailyPoolAmount,
        prizePool,
        userDepositAmountWithMargin: Number(userDepositAmountWithMargin),
      };
    } catch (ex) {
      console.log(ex);
      return {};
    }
  }

  async deposit(amount, margin) {
    try {
      if (isNil(this.userContract)) {
        this.userContract = await this.tronWeb.contract().at(smartContractAdresses.USER);
      }

      const result = await this.userContract.deposit(margin).send({
        // feeLimit:100,
        callValue: this.tronWeb.toSun(amount),
        // tokenId:1000036,
        // tokenValue:0,
        shouldPollResponse: true,
        keepTxID: true,
      });

      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      const txId = await this.getLastUserTransactionTXID();

      return txId;
    } catch (ex) {
      console.log('deposit err', ex.error);
      return false;
    }
  }

  async depositWithReferral({ amount, margin, referralId, referralRewardPercent }) {
    try {
      if (isNil(this.userContract)) {
        this.userContract = await this.tronWeb.contract().at(smartContractAdresses.USER);
      }
      const result = await this.userContract
        .depositWithReferral(margin, referralId, referralRewardPercent)
        .send({
          // feeLimit:100,
          callValue: this.tronWeb.toSun(amount),
          keepTxID: true,
          // tokenId:1000036,
          // tokenValue:0,
          shouldPollResponse: true,
        });

      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }

      const txId = await this.getLastUserTransactionTXID();

      return txId;
    } catch (ex) {
      console.log('deposit err', ex.error);
      return false;
    }
  }

  async withdraw() {
    try {
      if (isNil(this.userContract)) {
        this.userContract = await this.tronWeb.contract().at(smartContractAdresses.USER);
      }

      const result = await this.userContract.withdraw().send({
        keepTxID: true,
        shouldPollResponse: true,
      });

      if (Array.isArray(result) && result.length > 0 && result[0]) {
        return result[0];
      }

      const txId = await this.getLastUserTransactionTXID();

      return txId;
    } catch (err) {
      return false;
    }
  }

  double(amount = 0) {
    return this.tronWeb
      .contract()
      .at(smartContractAdresses.GAME)
      .then((gameContract) => {
        return gameContract.double().send({
          callValue: this.tronWeb.toSun(amount),
          shouldPollResponse: true,
          keepTxID: true,
        });
      })
      .then((result) => {
        if (Array.isArray(result)) {
          return result;
        }

        return this.getLastUserTransactionTXID().then((txId) => {
          return [txId, result];
        });
      });
  }

  async getUserBalance() {
    const balance = await this.tronWeb.trx.getBalance(this.user);
    return this.tronWeb.fromSun(balance);
  }

  async getEvents() {
    // Posible events: Deposit, Withdraw, Win
    const events = await this.tronWeb.getEventResult(smartContractAdresses.USER, {
      // eventName:"Deposit",
      size: 10,
      // filters:{from: "0xa319aae271b031fba91cf489b709616e837a1a56"}
    });

    return events;
  }

  async checkAndStartDaily() {
    if (isNil(this.gameContract)) {
      this.gameContract = await this.tronWeb.contract().at(smartContractAdresses.GAME);
    }
    const res = await this.gameContract.checkAndStartDaily().send({
      shouldPollResponse: true,
    });

    return res;
  }

  async getUserInfo() {
    if (isNil(this.userContract)) {
      this.userContract = await this.tronWeb.contract().at(smartContractAdresses.USER);
    }

    const userInfo = await this.userContract.getUser(this.user).call();
    const userDepositAmountWithMargin = this.tronWeb.fromSun(
      userInfo.userDepositAmountWithMargin.toNumber(),
    );
    return {
      userDepositAmountWithMargin,
    };
  }

  async getLastUserTransactionTXID() {
    const transaction = await request(
      `${TRON_WEB_API_URL}/v1/accounts/${this.user}/transactions?limit=1`,
    );
    return path(['data', 0, 'txID'], transaction);
  }
}
