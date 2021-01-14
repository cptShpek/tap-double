import React from 'react';
import { connect } from 'react-redux';
import { appService } from '../services';
import { appActions } from '../actions';
import { toFixedNumber } from '../helpers';
import LoginModal from './LoginModal';

class UserStats extends React.Component {
  state = {
    loading: false,
    isModalActive: false,
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
    });

    document.body.style.overflow = 'hidden';
  };

  handleClickCloseModal = () => {
    this.setState({
      isModalActive: false,
    });

    document.body.style.overflow = '';
  };

  handleCloseByEsc = (e) => {
    if (e.keyCode === 27 && this.state.isModalActive) {
      this.setState({
        isModalActive: false,
      });
      document.body.style.overflowY = '';
    }
  };

  handleClickWithdrawButton = async () => {
    const { dispatch } = this.props;

    try {
      const {
        depositAmount,
        userId,
        internalUserId,
        dividendsAmount,
      } = this.props;

      dispatch(appActions.appSendRequest());

      const result = await window.smartContractService.withdraw();
      if (result && depositAmount + dividendsAmount > 0) {
        appService.sendSuccessWithdrawEvent({
          userId: internalUserId,
          amount: depositAmount + dividendsAmount,
          walletId: userId,
          tronLink: result,
        });
      }
  
      window.smartContractService.getStats().then((res) => {
        dispatch(appActions.setUserInfo(res));
        // tronweb has some delay with updating current user balance
        setTimeout(() => {
          window.smartContractService.getUserBalance(userId).then((balance) => {
            dispatch(appActions.setUserBalance(balance));
          });
        }, 5000);
      });
      dispatch(appActions.appFinishRequest());
    } catch(ex) {
      dispatch(appActions.appFinishRequest());
      console.log('winthdraw error', ex.error);
    } finally {
      dispatch(appActions.appFinishRequest());
    }
    
  };

  toFixedNumber = (number) => {
    return toFixedNumber(number);
  };

  render() {
    const {
      userId,
      userName,
      marginType,
      totalInAmount,
      totalOutAmount,
      dividendsAmount,
      isMarginAllowedToChange,
      depositAmount,
      isLoading,
    } = this.props;
    const { isModalActive } = this.state;
    return (
      <section className="stats main-content__stats">
        <h2 className="visually-hidden">User stats section</h2>
        <div className="wrapper">
          <div className="stats__wrapper">
            <div className="stats__username">
              <div className="stats__block stats__block--user">
                <span className="stats__block-title">Username</span>
                <span className="stats__block-text">{userName || '-'}</span>
              </div>
            </div>

            <div className="stats__total">
              <div className="stats__block stats__block--icon">
                <span className="stats__block-title">Total In</span>
                <span className="stats__block-text">
                  {userId ? this.toFixedNumber(totalInAmount) : '-'}
                </span>
              </div>
              <div className="stats__block stats__block--icon">
                <span className="stats__block-title">Total Out</span>
                <span className="stats__block-text">
                  {userId ? this.toFixedNumber(totalOutAmount) : '-'}
                </span>
              </div>
            </div>

            <div className="stats__deposit">
              <div className="stats__block stats__block--icon">
                <span className="stats__block-title">
                  Your Deposit {!isMarginAllowedToChange ? `(X${marginType + 1})` : ''}
                </span>
                <span className="stats__block-text">
                  {userId ? this.toFixedNumber(depositAmount) : '-'}
                  <span className="stats__block-currency">TRX</span>
                </span>
              </div>

              <div className="stats__block stats__block--icon">
                <span className="stats__block-title">Your dividends</span>
                <span className="stats__block-text">
                  {userId ? this.toFixedNumber(dividendsAmount) : '-'}
                  <span className="stats__block-currency">TRX</span>
                </span>
              </div>

              <button
                type="button"
                className="stats__button button button--grey stats__button--withdraw"
                onClick={
                  userId
                    ? this.handleClickWithdrawButton
                    : this.handleClickModalOpenButton
                }
                disabled={
                  (userId && depositAmount + dividendsAmount <= 0) || isLoading
                }
              >
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>
        <LoginModal isModalActive={isModalActive} onClose={this.handleClickCloseModal} />
      </section>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  userId: app.userId,
  isLoading: app.loading,
  internalUserId: app.internalUserId,
  userName: app.userName,
  marginType: app.userInfo.marginType,
  totalInAmount: app.userInfo.totalInAmount,
  totalOutAmount: app.userInfo.totalOutAmount,
  totalReferralBonusReceived: app.userInfo.totalReferralBonusReceived,
  dividendsAmount: app.userInfo.dividendsAmount,
  isMarginAllowedToChange: app.userInfo.isMarginAllowedToChange,
  depositAmount: app.userInfo.depositAmount,
});

export default connect(mapStateToProps)(UserStats);
