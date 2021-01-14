import React from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import ChromeIcon from '../components/svg/images/ChromeIcon';
import TimerForRoulette from '../components/TimerForRoulette';
import LoginModal from '../components/LoginModal';
import BasePage from './BasePage';
import DepositBlock from '../components/DepositBlock';
import Chart from '../components/Chart';

class MainPage extends React.Component {
  state = {
    isModalActive: false,
    referralLink: 'clickToGenerate',
    activePercentageItem: 0.25,
    referralBonuses: [0, 0.25, 0.5, 0.15, 0.2],
    data: [
      { date: 'apr 26', Deposit: 0, Withdraw: 100 },
      { date: 'apr 27', Deposit: 10, Withdraw: 70 },
      { date: 'apr 28', Deposit: 20, Withdraw: 130 },
      { date: 'apr 29', Deposit: 30, Withdraw: 100 },
      { date: 'apr 26', Deposit: 0, Withdraw: 170 },
      { date: 'apr 27', Deposit: 10, Withdraw: 100 },
      { date: 'apr 28', Deposit: 20, Withdraw: 10 },
      { date: 'apr 29', Deposit: 30, Withdraw: 20 },
      { date: 'apr 30', Deposit: 0, Withdraw: 20 },
      { date: 'may 01', Deposit: 10, Withdraw: 100 },
      { date: 'may 02', Deposit: 20, Withdraw: 40 },
      { date: 'may 03', Deposit: 30, Withdraw: 40 },
      { date: 'may 04', Deposit: 20, Withdraw: 100 },
      { date: 'may 05', Deposit: 30, Withdraw: 10 },
    ],
    balance: 8941068,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleCloseByEsc, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleCloseByEsc, false);
  }

  handleClickModalOpenButton = () => {
    this.setState({
      isModalActive: true,
      isOverlayActive: true,
    });

    document.body.style.overflow = 'hidden';
  };

  handleClickCloseModal = () => {
    this.setState({
      isModalActive: false,
      isOverlayActive: false,
    });

    document.body.style.overflow = 'auto';
  };

  handleCloseByEsc = (e) => {
    if (e.keyCode === 27 && this.state.isModalActive) {
      this.setState({
        isModalActive: false,
        isOverlayActive: false,
      });
    }
  };

  toggleNavigation = () => {
    this.setState((state) => ({
      isMenuOpened: !state.isMenuOpened,
    }));

    if (this.state.isMenuOpened) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  };

  changeActivePercentageItem = (event) => {
    const {
      target: { id },
    } = event;
    this.setState({
      youRecive: 1 - Number(id),
      friendsRecive: Number(id),
      activePercentageItem: Number(id),
    });
  };

  copyRefferalLink = () => {
    this.setState({
      showCopiedMessage: true,
    });
    copy(this.state.referralLink);
    setTimeout(
      () =>
        this.setState({
          showCopiedMessage: false,
        }),
      2000,
    );
  };

  render() {
    const { userId } = this.props;
    const {
      isModalActive,
      isOverlayActive,
      isMenuOpened,
      referralBonuses,
      data,
      balance,
    } = this.state;

    return (
      <BasePage>
        <TimerForRoulette endTime="2020-05-02" />
        <DepositBlock balance={1000} currency="TRX" />
        <Chart data={data} balance={balance} />
        <LoginModal isModalActive={isModalActive} onClose={this.handleClickCloseModal} />
        <div
          onClick={this.handleClickCloseModal}
          className={`overlay ${isOverlayActive || isMenuOpened ? 'active' : ''}`}
        />
      </BasePage>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  userId: app.userId,
});

export default connect(mapStateToProps)(MainPage);
