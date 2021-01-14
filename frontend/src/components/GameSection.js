import React from 'react';
import { connect } from 'react-redux';
import TimerForRoulette from './TimerForRoulette';
import DepositBlock from './DepositBlock';
import Roulette from './Roulette';
import LoginModal from './LoginModal';
import { appActions } from '../actions';

class GameSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHowToPlayActive: false,
      isModalActive: false,
      isTryWithDeposit: false,
      startGameWithDeposit: false,
      gameResult: null,
      isShowTimer: true,
      isShowRouletteAfterGame: false,
      isWaiting: false,
      isShowRouletteWithoutDeposit: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleCloseByEsc, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleCloseByEsc, false);
  }

  hideRouletteAndShowTimeout = () => {
    this.setState({
      isTryWithDeposit: false,
      isShowTimer: true,
      isShowRouletteWithoutDeposit: false,
      isGameEnded: false,
    });
  };

  hideTimer = () => {
    this.setState({ isShowTimer: false });
  };

  showRouletteWithoutDeposit = () => {
    this.setState({ isShowRouletteWithoutDeposit: true });
  };

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

  toggleHowToPlayBlock = () => {
    this.setState((state) => ({
      isHowToPlayActive: !state.isHowToPlayActive,
    }));
  };

  handleClickTryWithDeposit = async () => {
    const { dispatch } = this.props;
    try {
      const {
        userDepositAmountWithMargin,
      } = await window.smartContractService.getUserInfo();

      dispatch(appActions.appSendRequest());
      this.setState({
        isWaiting: true,
      });

      const gameResult = await window.smartContractService.double(
        userDepositAmountWithMargin * 0.1,
      );

      this.setState({
        isTryWithDeposit: true,
        startGameWithDeposit: true,
        isWaiting: false,
        gameResult,
      });
      dispatch(appActions.appFinishRequest());
    } catch (err) {
      console.log('double with deposit error:', err);

      this.setState({
        isWaiting: false,
      });
      dispatch(appActions.appFinishRequest());
    } finally {
      dispatch(appActions.appFinishRequest());
    }
  };

  resetGameStatusWithDeposit = () => {
    this.setState({
      startGameWithDeposit: false,
      gameResult: null,
    });
  };

  toggleRouletteBlock = () => {
    this.setState((prevState) => ({
      isShowRouletteAfterGame: !prevState.isShowRouletteAfterGame,
    }));
  };

  stopGame = () => {
    this.setState({
      isGameEnded: true,
    });
  };

  gameContinue = () => {
    this.setState({
      isGameEnded: false,
    });
  };

  render() {
    const {
      balance,
      isMarginAllowedToChange,
      internalUserId,
      dailyPoolEndAt,
      dailyPoolUserAttempts,
      userId,
      userDepositAmountWithMargin,
      isLoading,
    } = this.props;
    const {
      isHowToPlayActive,
      isModalActive,
      isTryWithDeposit,
      startGameWithDeposit,
      gameResult,
      isShowTimer,
      isShowRouletteAfterGame,
      isWaiting,
      isShowRouletteWithoutDeposit,
      isGameEnded,
    } = this.state;

    return (
      <section className="playground main-content__playground">
        <h2 className="visually-hidden">Game and Deposit Section</h2>
        <div className="playground__wrapper wrapper">
          <div className="game playground__game">
            {(isShowRouletteAfterGame ||
              isTryWithDeposit ||
              dailyPoolUserAttempts === 0 ||
              isShowRouletteWithoutDeposit) &&
              userId && (
                <div className="game__game-block">
                  <div className="game__wrapper">
                    <span className="game__logo">Game</span>
                    <button
                      type="button"
                      className="game__button--how button button--grey"
                      onClick={this.toggleHowToPlayBlock}
                    >
                      How to play?
                    </button>
                  </div>

                  <div className="game__roulette">
                    <Roulette
                      handleLoginClick={this.handleClickModalOpenButton}
                      hideRouletteAndShowTimeout={this.hideRouletteAndShowTimeout}
                      resetGameStatusWithDeposit={this.resetGameStatusWithDeposit}
                      hideTimer={this.hideTimer}
                      toggleRouletteBlock={this.toggleRouletteBlock}
                      startGameWithDeposit={startGameWithDeposit}
                      gameResult={gameResult}
                      isTryWithDeposit={isTryWithDeposit}
                    />
                  </div>
                </div>
              )}
            {isHowToPlayActive && (
              <div className="game__how-block">
                <div className="game__how-wrapper">
                  <div className="game__how-item game__how-item--margin">
                    <span className="game__how-title">Double</span>
                    <p className="game__how-text">
                      All users with a deposit have the opportunity to double their
                      deposits every 24 hours. In between free attempts, you can try your
                      luck for 10% of the commission.
                    </p>
                  </div>
                  <div className="game__how-item game__how-item--dividends">
                    <span className="game__how-title">Dividends</span>
                    <p className="game__how-text">
                      While you are trying to win a doubling, you will receive dividends
                      from everyone who comes or leaves the game after you
                    </p>
                  </div>
                  <div className="game__how-item game__how-item--risk">
                    <span className="game__how-title">Low risk</span>
                    <p className="game__how-text">
                      25% of fees that’s will be sent in dividend and prize pools it’s not
                      so much to have chance to Double your TRX, right?
                    </p>
                  </div>
                  <div className="game__how-item game__how-item--promo">
                    <span className="game__how-title">Promotion</span>
                    <p className="game__how-text">
                      Instantly earn referral % from your personal marketing or inviting
                      friends!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="referral__link-gen button game__how-button game__roulette-button"
                  onClick={this.toggleHowToPlayBlock}
                >
                  Start earning
                </button>
              </div>
            )}
            {(!userId || !!isMarginAllowedToChange) && !isShowRouletteWithoutDeposit && (
              <div
                className="game__how-block"
                style={{ position: !userId ? 'static' : 'absolute' }}
              >
                <div className="game__how-wrapper">
                  <div className="game__how-item game__how-item--margin">
                    <span className="game__how-title">Double</span>
                    <p className="game__how-text">
                      All users with a deposit have the opportunity to double their
                      deposits every 24 hours. In between free attempts, you can try your
                      luck for 10% of the commission.
                    </p>
                  </div>
                  <div className="game__how-item game__how-item--dividends">
                    <span className="game__how-title">Dividends</span>
                    <p className="game__how-text">
                      While you are trying to win a doubling, you will receive dividends
                      from everyone who comes or leaves the game after you
                    </p>
                  </div>
                  <div className="game__how-item game__how-item--risk">
                    <span className="game__how-title">Low risk</span>
                    <p className="game__how-text">
                      25% of fees that’s will be sent in dividend and prize pools it’s not
                      so much to have chance to Double your TRX, right?
                    </p>
                  </div>
                  <div className="game__how-item game__how-item--promo">
                    <span className="game__how-title">Promotion</span>
                    <p className="game__how-text">
                      Instantly earn referral % from your personal marketing or inviting
                      friends!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="referral__link-gen button game__how-button game__roulette-button"
                  onClick={userId ? this.showRouletteWithoutDeposit: this.handleClickModalOpenButton}
                  disabled={isLoading}
                >
                  Start earning
                </button>
              </div>
            )}
            {isShowTimer && !isTryWithDeposit && dailyPoolUserAttempts > 0 && userDepositAmountWithMargin > 0 &&  (
              <div className="game__timer-block">
                <div className="game__wrapper">
                  <span className="game__logo">Free spin in</span>
                  <button
                    type="button"
                    className="game__button--how button button--grey"
                    onClick={this.toggleHowToPlayBlock}
                  >
                    How to play?
                  </button>
                </div>
                <div className="game__clock">
                  <div className="game__clock-wrapper">
                    <TimerForRoulette endTime={new Date(dailyPoolEndAt)} gameContinue={this.gameContinue} stopGame={this.stopGame} />
                  </div>
                  {isWaiting && (
                    <span className="game__roulette-text game__roulette-text--lose">
                      Waiting...
                    </span>
                  )}
                  {!isGameEnded && !isWaiting && (
                    <button
                      type="button"
                      className="button game__roulette-button"
                      onClick={this.handleClickTryWithDeposit}
                      disabled={isLoading}
                    >
                      Try for 10%
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="deposit playground__deposit">
            <span className="deposit__header">Deposit</span>
            <DepositBlock
              balance={balance}
              isAllowToChangeMargin={isMarginAllowedToChange}
              internalUserId={internalUserId}
              currency="TRX"
              handleClickModalOpenButton={this.handleClickModalOpenButton}
            />
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
  balance: app.userInfo.balance,
  depositAmount: app.userInfo.depositAmount,
  userDepositAmountWithMargin: app.userInfo.userDepositAmountWithMargin,
  isMarginAllowedToChange: app.userInfo.isMarginAllowedToChange,
  dailyPoolEndAt: app.userInfo.dailyPoolEndAt,
  dailyPoolUserAttempts: app.userInfo.dailyPoolUserAttempts,
});

export default connect(mapStateToProps)(GameSection);
