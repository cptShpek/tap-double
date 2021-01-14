import React from 'react';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { isNil } from 'ramda';
import { appService } from '../services';
import { appActions } from '../actions';
import { toFixedNumber } from '../helpers';

class DepositBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rate: '',
      margin: props.marginType + 1,
      messages: [],
    };
  }

  /* XXXXX to XX XXX */
  spaceBetween = (number = 0) => {
    number = toFixedNumber(number);
    return String(number).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  };

  /* changing rate for input */

  inputChangeRate = (event) => {
    const value = Number(event.target.value);
    const balance = Number(this.props.balance || 0);

    if (balance === 0) {
      this.setState({ rate: '' });

      return;
    }

    if (balance - value < 5) {
      this.setState({
        rate: balance - 5 > 0 ? balance - 5 : '',
      });

      return;
    }

    this.setState({
      rate: value === 0 ? '' : value,
    });
  };

  onChange = (value) => {
    const balance = Number(this.props.balance);

    if (balance - value < 5) {
      this.setState({
        rate: balance - 5 > 0 ? balance - 5 : '',
      });

      return;
    }

    this.setState({
      rate: value,
    });
  };

  marginOnChange = (value) => {
    this.setState({
      margin: value,
    });
  };

  setRate = (x) => {
    const balance = Number(this.props.balance || 0);
    const rate = balance * x;

    if (balance === 0) {
      this.setState({
        rate: '',
      });

      return;
    }

    if (balance - rate < 5) {
      this.setState({
        rate: balance - 5 > 0 ? balance - 5 : '',
      });

      return;
    }

    this.setState({
      rate,
    });
  };

  handleClickDepositButton = async () => {
    const { dispatch } = this.props;
    try {
      const {
        userId,
        internalUserId,
        referralInfo,
        marginType,
        isMarginAllowedToChange,
      } = this.props;
      const { rate, margin } = this.state;

      let finalMargin = marginType;
      if (isMarginAllowedToChange) {
        finalMargin = margin - 1;
      }

      dispatch(appActions.appSendRequest());

      let result;
      if (isNil(referralInfo)) {
        result = await window.smartContractService.deposit(rate, finalMargin);
      } else {
        result = await window.smartContractService.depositWithReferral({
          amount: rate,
          margin: finalMargin,
          referralId: referralInfo.walletId,
          referralRewardPercent: referralInfo.ownPercent,
        });
      }

      if (result) {
        appService.sendSuccessDepositEvent({
          userId: internalUserId,
          walletId: userId,
          amount: Number(rate),
          margin: `x${String(margin)}`,
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
        }, 3000);
      });
      this.setState({
        rate: 0,
      });
      dispatch(appActions.appFinishRequest);
    } catch (ex) {
      console.log('deposit error', ex.error);
      dispatch(appActions.appFinishRequest);
      this.setState((state) => ({
        messages: [...state.messages, ex.error],
      }));
    } finally {
      dispatch(appActions.appFinishRequest);
    }
  };

  render() {
    const {
      currency,
      isMarginAllowedToChange,
      handleClickModalOpenButton,
      userId,
      marginType,
      isLoading,
    } = this.props;
    const balance = Number(this.props.balance) || 0;
    const { rate, margin, messages } = this.state;

    let finalMargin = margin;

    if (!isMarginAllowedToChange) {
      finalMargin = marginType + 1;
    }

    return (
      <div className="deposit_block">
        <div className="deposit_block__balance deposit_block__rectangle">
          <div className="text">
            <p>
              <span className="deposit_block__numbers--font-color">
                {toFixedNumber(balance)}
              </span>{' '}
              {currency}
            </p>
            <p>Your balance</p>
          </div>
        </div>

        <div className="deposit_block__amount">
          <h2 className="deposit_block__headers">Amount:</h2>
          <div className="deposit_block__rectangle">
            <div className="text">
              <input
                className="deposit_block__numbers--font-color deposit_block__amount__input"
                value={rate}
                placeholder={rate}
                onChange={this.inputChangeRate}
                type="number"
                disabled={isLoading}
              />
            </div>
            <div className="input-range-wrapper amount-slider">
              <InputRange
                maxValue={balance || 0}
                minValue={0}
                value={rate}
                onChange={this.onChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="deposit_block__buttons">
            <button
              type="button"
              className={`deposit_block__redButton ${rate === 0 ? 'active' : ''}`}
              onClick={() => this.setRate(0)}
              disabled={isLoading}
            >
              0%
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${
                rate === balance * 0.25 ? 'active' : ''
              }`}
              onClick={() => this.setRate(0.25)}
              disabled={isLoading}
            >
              25%
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${
                rate === balance * 0.5 ? 'active' : ''
              }`}
              onClick={() => this.setRate(0.5)}
              disabled={isLoading}
            >
              50%
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${
                rate === balance * 0.75 ? 'active' : ''
              }`}
              onClick={() => this.setRate(0.75)}
              disabled={isLoading}
            >
              75%
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${rate === balance ? 'active' : ''}`}
              onClick={() => this.setRate(1)}
              disabled={isLoading}
            >
              100%
            </button>
          </div>
        </div>

        <div className="deposit_block__margin">
          <div className="deposit_block__margin__headingRow">
            <h2 className="deposit_block__headers">Margin:</h2>
            <div className="deposit__info">
              <img className="info__icon" src="/img/raster/info-icon.png" alt="info" />
              <div className="info__text">
                Margin system increases your deposit in the system allowing you to receive
                more dividends and increases your winnings in doubling. It allows you to
                make up to x8 from your deposit if win.
              </div>
            </div>
          </div>
          <div className="input-range-wrapper">
            <InputRange
              maxValue={4}
              minValue={1}
              value={finalMargin}
              onChange={(value) => this.marginOnChange(value)}
              disabled={!isMarginAllowedToChange || isLoading}
            />
            <span
              className={`circle first circle--active ${
                !isMarginAllowedToChange ? ' disabled' : ''
              }`}
              onClick={isMarginAllowedToChange && (() => this.marginOnChange(1))}
            />
            <span
              className={`circle second circle${finalMargin > 2 ? '--active' : ''} ${
                !isMarginAllowedToChange ? ' disabled' : ''
              }`}
              onClick={isMarginAllowedToChange && (() => this.marginOnChange(2))}
            />
            <span
              className={`circle third circle${finalMargin > 3 ? '--active' : ''} ${
                !isMarginAllowedToChange ? ' disabled' : ''
              }`}
              onClick={isMarginAllowedToChange && (() => this.marginOnChange(3))}
            />
            <span
              className={`circle fourth ${!isMarginAllowedToChange ? ' disabled' : ''}`}
              onClick={isMarginAllowedToChange && (() => this.marginOnChange(4))}
            />
          </div>

          <div className="deposit_block__buttons">
            <button
              type="button"
              className={`deposit_block__redButton ${finalMargin === 1 ? 'active' : ''} ${
                !isMarginAllowedToChange ? 'disabled' : ''
              }`}
              onClick={() => this.marginOnChange(1)}
              disabled={isLoading || !isMarginAllowedToChange}
            >
              x1
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${margin === 2 ? 'active' : ''} ${
                !isMarginAllowedToChange ? 'disabled' : ''
              }`}
              onClick={() => this.marginOnChange(2)}
              disabled={isLoading || !isMarginAllowedToChange}
            >
              x2
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${margin === 3 ? 'active' : ''} ${
                !isMarginAllowedToChange ? 'disabled' : ''
              }`}
              onClick={() => this.marginOnChange(3)}
              disabled={isLoading || !isMarginAllowedToChange}
            >
              {' '}
              x3{' '}
            </button>
            <button
              type="button"
              className={`deposit_block__redButton ${margin === 4 ? 'active' : ''} ${
                !isMarginAllowedToChange ? 'disabled' : ''
              }`}
              onClick={() => this.marginOnChange(4)}
              disabled={isLoading || !isMarginAllowedToChange}
            >
              {' '}
              x4{' '}
            </button>
          </div>
        </div>
        <button
          disabled={isLoading}
          type="button"
          className="button"
          onClick={userId ? this.handleClickDepositButton : handleClickModalOpenButton}
        >
          Deposit
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  isMarginAllowedToChange: app.userInfo.isMarginAllowedToChange,
  marginType: app.userInfo.marginType,
  userId: app.userId,
  referralInfo: app.referralInfo,
  isLoading: app.loading,
});

export default connect(mapStateToProps)(DepositBlock);
