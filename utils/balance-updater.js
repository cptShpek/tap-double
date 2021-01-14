import Balance from '../models/Balance';
import { getStats } from './tron-web';

const ONE_HOUR_IN_MS = 3600000;

const saveBalance = async () => {
  try {
    const { currentContractBalance } = await getStats();

    if (currentContractBalance) {
      await Balance.create({ amount: currentContractBalance });
    }
  } catch (ex) {
    console.error('saveBalance', ex);
  }
};

export default () => {
  saveBalance();
  setInterval(saveBalance, ONE_HOUR_IN_MS);
};
