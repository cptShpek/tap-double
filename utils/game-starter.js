import { getStats, startGame } from './tron-web';

const runGameStarter = async () => {
  try {
    const { dailyPoolEndAt } = await getStats();
    const nextStart = dailyPoolEndAt - Date.now() + 5000;

    await startGame();
    setTimeout(runGameStarter, nextStart);
  } catch (ex) {
    console.error('runGameStarter', ex);
  }
};

export default runGameStarter;
