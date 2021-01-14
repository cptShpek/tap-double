import TronWeb from 'tronweb';
import dotenv from 'dotenv';
// Load env vars
dotenv.config({ path: './config/config.env' });

const PRIVATE_KEY = process.env.TRON_WEB_PRIVATE_KEY;
const GAME_CONTRACT_ADDRESS = process.env.TRON_WEB_GAME_CONTRACT_ADDRESS;
const USER_CONTRACT_ADDRESS = process.env.TRON_WEB_USER_CONTRACT_ADDRESS;
const tronWeb = new TronWeb(
  'https://api.trongrid.io',
  'https://api.trongrid.io',
  'https://api.trongrid.io',
  PRIVATE_KEY,
);

export const getStats = async () => {
  try {
    const gameContract = await tronWeb.contract().at(GAME_CONTRACT_ADDRESS);
    const gameStats = await gameContract.getStats(GAME_CONTRACT_ADDRESS).call();
    const balance = await tronWeb.trx.getBalance(USER_CONTRACT_ADDRESS);
    const currentContractBalance = Number(await tronWeb.fromSun(balance));

    return {
      currentContractBalance,
      dailyPoolEndAt: tronWeb.toDecimal(gameStats[1]) * 1000,
    };
  } catch (ex) {
    console.error('getStats:', ex);
    return {};
  }
};

export const startGame = async () => {
  try {
    const gameContract = await tronWeb.contract().at(GAME_CONTRACT_ADDRESS);
    const result = await gameContract.checkAndStartDaily().send({
      shouldPollResponse: true,
    });

    return result;
  } catch (ex) {
    console.error('startGame', ex);
    return {};
  }
};
