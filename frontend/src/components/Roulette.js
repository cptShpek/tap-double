import React from 'react';
import { connect } from 'react-redux';
import RouletePng from '../assets/img/raster/roulette.png';
import RouleteArrow from '../assets/img/raster/game-pointer.png';
import { appActions } from '../actions';
import { appService } from '../services';

const hideRouletteAfterTime = 15000;
const hideRouletteAfterWinTime = 60000;

class Roulette extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRolling: false,
      isWinner: false,
      isLoser: false,
      isWaiting: false,
      messages: [],
    };
    this.rouletteImg = React.createRef();
  }

  hideRouletteAndShowTimeout = (isWin) => {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          this.props.hideRouletteAndShowTimeout();
          this.props.toggleRouletteBlock();
          this.setState({ 
            isRolling: false,
            isWinner: false,
            isLoser: false,
            isWaiting: false,
          });
          resolve(true);
        },
        isWin ? hideRouletteAfterWinTime : hideRouletteAfterTime,
      );
    });
  };

  startGameWithDeposit = async (gameResult = false) => {
    try {
      const {
        resetGameStatusWithDeposit,
        internalUserId,
        userId,
        userTotalAmount,
        dividendsAmount,
        toggleRouletteBlock,
      } = this.props;

      toggleRouletteBlock();

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
      resetGameStatusWithDeposit();

      this.setState({
        isRolling: true,
        isWaiting: false,
      });

      const [tronLink, result] = gameResult;

      await this.defineRoulettePosition(result);

      if (result) {
        appService.sendSuccessDoubleEvent({
          userId: internalUserId,
          walletId: userId,
          amount: userTotalAmount * 2 + dividendsAmount,
          tronLink,
        });
      }
    } catch (err) {
      console.log('double error', err);

      this.setState({
        isRolling: false,
        isWaiting: false,
      });
      this.props.dispatch(appActions.appFinishRequest());
    }
  };

  // startGame = async () => {
  //   try {
  //     const {
  //       hideTimer,
  //       internalUserId,
  //       userId,
  //       userTotalAmount,
  //       dividendsAmount,
  //       toggleRouletteBlock,
  //       dispatch,
  //     } = this.props;

  //     dispatch(appActions.appSendRequest());

  //     toggleRouletteBlock();

  //     hideTimer();
  //     this.setState((state) => ({
  //       isWaiting: !state.isWaiting,
  //     }));

  //     this.setState((state) => ({
  //       messages: [...state.messages, '#call startGame'],
  //     }));

  //     const gameResult = await window.smartContractService.double();
  //     this.setState((state) => ({
  //       messages: [...state.messages, '#call gameResult'],
  //     }));
  //     dispatch(appActions.appFinishRequest());
  //     this.setState({
  //       isRolling: true,
  //       isWaiting: false,
  //     });

  //     const [tronLink, result] = gameResult;
  //     this.setState((state) => ({
  //       messages: [...state.messages, [tronLink, result]],
  //     }));
  //     await this.defineRoulettePosition(result);

  //     if (result) {
  //       appService.sendSuccessDoubleEvent({
  //         userId: internalUserId,
  //         walletId: userId,
  //         amount: userTotalAmount * 2 + dividendsAmount,
  //         tronLink,
  //       });
  //     }
  //   } catch (err) {
  //     this.setState((state) => ({
  //       messages: [
  //         ...state.messages,
  //         `#catch error ${err} ${err.message} ${JSON.stringify(err)}`,
  //       ],
  //     }));
  //     const { dispatch } = this.props;
  //     console.log('double error', err);
  //     dispatch(appActions.appFinishRequest());
  //     this.setState({
  //       isRolling: false,
  //       isWaiting: false,
  //     });
  //   }
  // };

  startGame = () => {
    const {
      hideTimer,
      internalUserId,
      userId,
      userTotalAmount,
      dividendsAmount,
      toggleRouletteBlock,
      dispatch,
    } = this.props;

    dispatch(appActions.appSendRequest());

    toggleRouletteBlock();

    hideTimer();
    this.setState((state) => ({
      isWaiting: !state.isWaiting,
    }));

    window.smartContractService
      .double()
      .then((gameResult) => {
        this.setState({
          isRolling: true,
          isWaiting: false,
        });

        this.setState((state) => ({
          messages: [
            ...state.messages,
            '#call game finished',
            JSON.stringify(gameResult),
            'typeof',
            typeof gameResult,
          ],
        }));

        const tronLink = gameResult[0] || '';
        const result = gameResult[1] || false;
        return this.defineRoulettePosition(result).then(() => {
          if (result) {
            appService.sendSuccessDoubleEvent({
              userId: internalUserId,
              walletId: userId,
              amount: userTotalAmount * 2 + dividendsAmount,
              tronLink,
            });
          }
        });
      })
      .catch((err) => {
        console.log('double error', err);
        this.setState({
          isRolling: false,
          isWaiting: false,
        });
        dispatch(appActions.appFinishRequest());
      })
      .finally(() => {
        dispatch(appActions.appFinishRequest());
      });
  };

  defineRoulettePosition = async (result) => {
    const { dispatch, userId } = this.props;

    if (result) {
      await this.getWinDegree();
      await window.smartContractService.getStats().then((res) => {
        dispatch(appActions.setUserInfo(res));
      });
    } else {
      await this.getLoseDegree();
      await window.smartContractService.getStats().then((res) => {
        dispatch(appActions.setUserInfo(res));
      });
    }

    window.smartContractService.getUserBalance(userId).then((balance) => {
      dispatch(appActions.setUserBalance(balance));
    });

    this.hideRouletteAndShowTimeout(result);
  };

  getWinDegree = () => {
    if (Math.random() >= 0.5) {
      this.rouletteImg.current.style.transform = `rotate(${1080 + 0}deg)`;
    } else {
      this.rouletteImg.current.style.transform = `rotate(${1080 + 180}deg)`;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ isWinner: true, isRolling: false });
        resolve(true);
      }, 3000);
    });
  };

  getLoseDegree = () => {
    switch (Math.round(Math.random() * 4 + 1)) {
      case 1:
        this.rouletteImg.current.style.transform = `rotate(${1080 + 30}deg)`;
        break;
      case 2:
        this.rouletteImg.current.style.transform = `rotate(${1080 + 60}deg)`;
        break;
      case 3:
        this.rouletteImg.current.style.transform = `rotate(${1080 + 90}deg)`;
        break;
      case 4:
        this.rouletteImg.current.style.transform = `rotate(${1080 + 120}deg)`;
        break;
      default:
        this.rouletteImg.current.style.transform = `rotate(${1080 + 150}deg)`;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ isLoser: true, isRolling: false });
        resolve(true);
      }, 3000);
    });
  };

  handleClickDoubleButton = () => {
    this.startGame();
  };

  gameControls = () => {
    const { userId, dailyPoolUserAttempts, userDepositAmountWithMargin, isLoading } = this.props;
    const { isRolling, isWinner, isLoser, isWaiting } = this.state;
    console.log({ isRolling, isWinner, isLoser, isWaiting, userDepositAmountWithMargin });
    
    if (userId) {
      if (userDepositAmountWithMargin > 0) {
        if (isWaiting) {
          return (
            <span className="game__roulette-text game__roulette-text--rolling">
              Waiting...
            </span>
          );
        }
        if (isRolling) {
          return (
            <span className="game__roulette-text game__roulette-text--rolling">
              Rolling...
            </span>
          );
        }
        if (isWinner) {
          return (
            <span className="game__roulette-text game__roulette-text--win">
              You win <span className="text--green">x2</span>
            </span>
          );
        }
        if (isLoser) {
          return (
            <span className="game__roulette-text game__roulette-text--lose">
              Not today <span className="text--red">:(</span>
            </span>
          );
        }
        if (!isRolling && !isWinner && !isLoser) {
          
          if (dailyPoolUserAttempts !== 0) {
            return false;
          }
          return (
            <button
              type="button"
              className="button game__roulette-button game__roulette-button--dobule"
              onClick={this.handleClickDoubleButton}
              disabled={isLoading}
            >
              Double IT
            </button>
          );
        }
      }
      return (
        <span className="game__roulette-text game__roulette-text--rolling">
          Deposit TRX for double
        </span>
      );
    }
    return (
      <button
        type="button"
        className="button game__roulette-button game__roulette-button--login"
        onClick={this.props.handleLoginClick}
      >
        Login
      </button>
    );
  };

  render() {
    const { startGameWithDeposit, gameResult, isLoading } = this.props;

    if (startGameWithDeposit) {
      setTimeout(() => {
        this.startGameWithDeposit(gameResult);
      }, 0);
    }

    return (
      <div className="game__roulette-block">
        <div className="game__roulette-block--roulette">
          <img className="rolling-roulette" ref={this.rouletteImg} src={RouletePng} />
        </div>
        <div className="game__roulette-block--buttons">
          {this.gameControls()}
          <button
            type="button"
            className="button game__roulette-button game__roulette-button--withdraw hidden-element"
            disabled={isLoading}
          >
            Withdraw
          </button>
        </div>
        <img className="game__roulette-block--arrow" src={RouleteArrow} />
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  userId: app.userId,
  isLoading: app.loading,
  balance: app.balance,
  internalUserId: app.internalUserId,
  dailyPoolEndAt: app.userInfo.dailyPoolEndAt,
  dailyPoolUserAttempts: app.userInfo.dailyPoolUserAttempts,
  userDepositAmountWithMargin: app.userInfo.userDepositAmountWithMargin,
  depositAmount: app.userInfo.depositAmount,
  userTotalAmount: app.userInfo.userTotalAmount,
  dividendsAmount: app.userInfo.dividendsAmount,
  dailyPoolAmount: app.userInfo.dailyPoolAmount,
});

export default connect(mapStateToProps)(Roulette);
