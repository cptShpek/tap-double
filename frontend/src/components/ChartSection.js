import React from 'react';
import { connect } from 'react-redux';
import { format, isBefore, addDays } from 'date-fns';
import { isNil } from 'ramda';
import Chart from './Chart';
import { spaceBetween, toFixedNumber } from '../helpers';
import { smartContractAdresses, TRON_SCAN_URL } from '../services';

const events = {
  withdraw: 'Withdraw',
  deposit: 'Deposit',
  winx2: 'WinX2',
};


const CONTRACT_URL = `${TRON_SCAN_URL}/#/contract`;

class ChartSection extends React.Component {
  // countDailyChange = (lastDayDeposit, prevDayDeposit) => {
  //   return ((lastDayDeposit - prevDayDeposit) / lastDayDeposit) * 100;
  // };

  toFixedNumber = (number) => {
    return this.toFixedNumber(number);
  };

  render() {
    const { currentContractBalance = 0, lastEvents, chartData, dailyChange } = this.props;

    const firstDayOfChart = addDays(new Date(), -13);
    const allDaysOfChart = {};
    let nextDay = firstDayOfChart;

    while (isBefore(nextDay, new Date())) {
      const date = format(nextDay, 'MMM dd yyyy');
      allDaysOfChart[date] = { date, deposit: 0, withdraw: 0 };
      nextDay = addDays(nextDay, 1);
    }

    chartData.forEach(({ createdAt, amount, eventType }) => {
      const date = format(new Date(createdAt), 'MMM dd yyyy');

      if (eventType === 'winx2') {
        return;
      }

      if (isNil(allDaysOfChart[date])) {
        allDaysOfChart[date] = { date, deposit: 0, withdraw: 0 };
      }

      allDaysOfChart[date][eventType] += amount;
    });
    const chartDataTransformed = Object.values(allDaysOfChart);

    return (
      <section className="charts main-content__charts">
        <h2 className="visually-hidden">User Charts Section</h2>
        <div className="charts__wrapper">
          <div className="chart-bar charts__bar">
            <div className="chart-bar__header">
              <a
                className="chart-bar__balance"
                href={`${CONTRACT_URL}/${smartContractAdresses.USER}`}
                target="_blank"
              >
                <span className="chart-bar__balance-number">
                  {spaceBetween(currentContractBalance)}
                </span>
                <div className="chart-bar__balance-text">
                  <span>Contract</span>
                  <span>Balance</span>
                </div>
                <img
                  className="chart-bar__balance-icon"
                  src="/img/raster/сurrency-icon.png"
                  alt="currency icon"
                />
              </a>
              <div className="chart-bar__period">
                <span className="chart-bar__period-text">24h change</span>
                <span className="chart-bar__period-change text--green">
                  {Number(dailyChange) > 0 ? '+' : ''}
                  {((Number(dailyChange) === 0 ? 100 : Number(dailyChange)) || 0).toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
            </div>
            <Chart data={chartDataTransformed} />
          </div>
          <div className="chart-table charts__table">
            <span className="chart-table__header">Last events</span>
            <div className="chart-table__wrapper">
              <div className="chart-table__row chart-table__row--header">
                <span className="chart-table__event">Name</span>
                <span className="chart-table__date">Date</span>
                <span className="chart-table__adress">Address</span>
                <span className="chart-table__value">Value</span>
              </div>
              {lastEvents.map(
                ({ eventType, createdAt, walletId, amount, tronLink }, index) => (
                  <a
                    key={index}
                    href={`${TRON_SCAN_URL}/#/transaction/${tronLink}`}
                    target="_blank"
                    className={`chart-table__row ${
                      eventType === 'winx2' ? 'chart-table__row--win' : ''
                    }`}
                  >
                    <span className="chart-table__event">{events[eventType]}</span>
                    <span className="chart-table__date">
                      {format(new Date(createdAt), 'MMM do HH:mm')}
                    </span>
                    <span className="chart-table__adress">
                      {`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}
                    </span>
                    <span className="chart-table__value">{toFixedNumber(amount)}</span>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  currentContractBalance: app.userInfo.currentContractBalance,
  lastEvents: app.lastEvents,
  chartData: app.chartData,
  dailyChange: app.dailyChange,
  userId: app.userId,
});

export default connect(mapStateToProps)(ChartSection);
