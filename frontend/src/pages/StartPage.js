import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { format } from 'date-fns';
import {} from 'date-fns-timezone';
import { isEmpty, isNil } from 'ramda';
import * as cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import ClocksDeckBuilder from '../components/ClocksDeckBuilder';
import UserIcon from '../components/svg/images/UserIcon';
import { appActions } from '../actions';

class StartPage extends React.Component {
  componentDidMount() {
    const { dispatch, uniqUsers } = this.props;
    if (isEmpty(uniqUsers)) {
      dispatch(appActions.getVisitedUsers());
    }
  }

  trackUser = () => {
    if (isNil(cookie.get('dapp_double_user_id'))) {
      const expDate = new Date();
      // set cookie for 6 months
      expDate.setTime(expDate.getTime() + 180 * 24 * 60 * 60 * 1000);
      cookie.set('dapp_double_user_id', uuidv4(), { expires: expDate });
      this.props.dispatch(appActions.incrementUniqGuest());
    }
  };

  handleInfoButtonClick = (e) => {
    e.preventDefault();
    this.trackUser();
    window.open(e.target.href);
  };

  handleInviteButtonClick = () => {
    this.trackUser();
    this.props.dispatch(push('/referral'));
  };

  render() {
    const { uniqUsers } = this.props;
    return (
      <main className="start-page">
        <div className="start-page__wrapper">
          <div className="start-page__logo">
            <span className="start-page__logo-img">
              <span>Dapp</span>
              <span>Double</span>
            </span>
            <span className="start-page__logo-text">Launch in:</span>
          </div>

          <ClocksDeckBuilder />

          <div className="start-page__join join">
            <a
              className="join__button button"
              href="https://medium.com/@dappdouble/welcome-to-the-dappdouble-world-97d453a9d73"
              target="_blank"
              onClick={this.handleInfoButtonClick}
            >
              Info
            </a>
            <div className="join__users">
              <UserIcon />
              <span className="join__users-number">{uniqUsers} </span>
              <span className="join__users-text">users joined</span>
            </div>
            <button
              type="button"
              className="invite-friends"
              onClick={this.handleInviteButtonClick}
            >
              Invite friends
            </button>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  uniqUsers: app.uniqUsers,
});

export default connect(mapStateToProps)(StartPage);
