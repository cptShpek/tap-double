import React from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';
// import { match } from 'react-router';
import { connect } from 'react-redux';
import { isNil, path } from 'ramda';
import io from 'socket.io-client';
import ReferralPage from './pages/ReferralPage';
import MainPage from './pages/MainPage';
import { appActions } from './actions';
import { SmartContractService } from './services';

const SOCKET_HOST = window.location.origin;

class App extends React.Component {
  componentDidMount() {
    this.getInitialData();

    const { dispatch } = this.props;

    this.intervalId = setInterval(async () => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(this.intervalId);

        const userId = path(['tronWeb', 'defaultAddress', 'base58'], window);
        const userName = path(['tronWeb', 'defaultAddress', 'name'], window);

        if (!window.smartContractService) {
          window.smartContractService = new SmartContractService(window.tronWeb, userId);
        }

        const { smartContractService } = window;

        await Promise.all([
          (smartContractService.getUserBalance(userId).then((balance) => {
            dispatch(appActions.setUserBalance(balance));
          }),
          smartContractService.getStats().then((res) => {
            dispatch(appActions.setUserInfo(res));
          })),
        ]);

        this.loginUser({ userId, userName });
      }
    }, 300);
    window.addEventListener('message', this.tronlinkLoginHandler);

    const socket = io(SOCKET_HOST, { secure: true });

    socket.on('connect', () => {
      console.log('socket connected');
    });

    socket.on('deposit', ({ event }) => {
      dispatch(appActions.addNewDepositEvent(event));
    });

    socket.on('withdraw', ({ event }) => {
      dispatch(appActions.addNewWithdrawEvent(event));
    });

    socket.on('winx2', ({ event }) => {
      dispatch(appActions.addNewDoubleEvent(event));
    });

    socket.on('newPlayer', ({ players }) => {
      dispatch(appActions.increasePlayersCount(players));
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.tronlinkLoginHandler);
  }

  getInitialData = async () => {
    const { dispatch } = this.props;
    dispatch(appActions.getLastEvents());
    dispatch(appActions.getChartData());
    dispatch(appActions.getDayliChange());
    dispatch(appActions.getTotals());
  };

  tronlinkLoginHandler = async (e) => {
    const { dispatch } = this.props;
    const userIdFromStore = this.props.userId;

    if (e.data.message && e.data.message.action === 'setAccount') {
      clearInterval(this.intervalId);
      if (!userIdFromStore) {
        const userId = path(['data', 'message', 'data', 'address'], e);
        const userName = path(['data', 'message', 'data', 'name'], e);
        if (!window.smartContractService) {
          window.smartContractService = new SmartContractService(window.tronWeb, userId);
        }
        const { smartContractService } = window;

        await Promise.all([
          smartContractService.getUserBalance(userId).then((balance) => {
            dispatch(appActions.setUserBalance(balance));
          }),
          smartContractService.getStats(userId).then((res) => {
            dispatch(appActions.setUserInfo(res));
          }),
        ]);
        this.loginUser({ userId, userName });
      } else {
        const userId = path(['data', 'message', 'data', 'address'], e);
        const userName = path(['data', 'message', 'data', 'name'], e);
        this.loginUser({ userId, userName });
      }
    }
  };

  loginUser = ({ userId, userName }) => {
    const { dispatch } = this.props;
    const match = matchPath(window.location.pathname, {
      path: '/referral/:id',
      exact: true,
      strict: false,
    });
    const linkCode = path(['params', 'id'], match);

    if (isNil(match)) {
      dispatch(appActions.loginUser({ userId, userName })).then(() => {
        dispatch(appActions.getAllReferralsByUser(userId));
        dispatch(appActions.geInternalUserIdByWalletId(userId));
      });
    } else {
      dispatch(
        appActions.addUserByReferral({ userId, referralId: linkCode, userName }),
      ).then(() => {
        dispatch(appActions.geInternalUserIdByWalletId(userId));
        dispatch(appActions.getAllReferralsByUser(userId));
      });
    }
  };

  render() {
    return (
      <>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/referral" component={ReferralPage} />
          <Route exact path="/referral/:id" component={MainPage} />
          <Route render={() => <Redirect path="/" />} />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  userId: app.userId,
  isNextGameAvailable: app.isNextGameAvailable,
});

export default connect(mapStateToProps)(App);
