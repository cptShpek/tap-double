import React from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import CopyIcon from '../components/svg/images/CopyIcon';
import { appActions } from '../actions';
import { appService } from '../services';
import LoginModal from '../components/LoginModal';
import BasePage from './BasePage';

class ReferralPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalActive: false,
      showCopiedMessage: false,
      ownPercent: 85,
      friendPercent: 15,
      activePercentageItem: 15,
      referralBonuses: [0, 15, 20, 25, 50],
      loading: false,
    };
  }

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

  handleClickGenerateLinkButton = async () => {
    const { dispatch, userId } = this.props;
    const { ownPercent, friendPercent } = this.state;
    if (userId) {
      try {
        await dispatch(
          appActions.generateReferralLink({
            walletId: userId,
            ownPercent,
            friendPercent,
          }),
        );
      } catch (err) {
        console.log('Error while link was generated', err);
      }
    }
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

  changeActivePercentageItem = (event) => {
    const {
      target: { id },
    } = event;
    this.setState({
      ownPercent: 100 - Number(id),
      friendPercent: Number(id),
      activePercentageItem: Number(id),
    });
  };

  copyRefferalLink = () => {
    this.setState({
      showCopiedMessage: true,
    });
    copy(this.concatReferralLink());
    setTimeout(
      () =>
        this.setState({
          showCopiedMessage: false,
        }),
      2000,
    );
  };

  concatReferralLink = () => {
    const { generatedLink, referralLinks } = this.props;
    const { host } = window.location;
    let linkToDisplay = 'clickToGenerateLink';

    if (generatedLink) {
      linkToDisplay = `${host}/referral/${generatedLink}`;
    } else if (referralLinks.length) {
      linkToDisplay = `${host}/referral/${referralLinks[referralLinks.length - 1]}`;
    }

    return linkToDisplay;
  };

  withdraw = async () => {
    const {
      depositAmount,
      userId,
      internalUserId,
      dividendsAmount,
      dispatch,
    } = this.props;
    this.setState({
      loading: true,
    });
    const result = await window.smartContractService.withdraw();
    if (result) {
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
      }, 3000);
    });

    this.setState({
      loading: false,
    });
  };

  handleClickWithdrawButton = () => {
    const { userId } = this.props;

    if (userId) {
      this.withdraw();
    } else {
      this.handleClickModalOpenButton();
    }
  };

  render() {
    const { userId, friendCount, totalReferralBonusReceived } = this.props;
    const {
      isModalActive,
      referralBonuses,
      showCopiedMessage,
      ownPercent,
      friendPercent,
      activePercentageItem,
      loading,
    } = this.state;

    const referralBonusesControls = referralBonuses.map((item, index) => (
      <span
        onClick={this.changeActivePercentageItem}
        key={index}
        id={item}
        className={`percentage__item ${
          activePercentageItem === item ? 'percentage__item--active' : ''
        }`}
      >
        {item}%
      </span>
    ));

    return (
      <BasePage>
        <main className="referral">
          <div className="wrapper referral__wrapper">
            <div className="referral__block referral__block--left">
              <h1 className="referral__header">
                <span className="text--red">I</span>nvite friends
                <span className="text--red">.</span>
                <br />
                Double Crypto Together
              </h1>
              <p className="referral__text">
                Earn up to 2% from every deposit your friends make on DappDouble
              </p>

              <h2 className="referral__title">Your Referral Account</h2>
              <div className="referral__account referral__account--left-block">
                <div className="referral__account-block">
                  <span className="referral__account-text">You’ve earned:</span>
                  <span className="referral__account-number">
                    {totalReferralBonusReceived}
                    <span className="referral__account-currency">TRX</span>
                  </span>
                </div>
                <div className="referral__account-block">
                  <span className="referral__account-text">Total number of friends:</span>
                  <span className="referral__account-number">{friendCount}</span>
                </div>
              </div>
              {userId && (
                <button
                  type="button"
                  className="referral__button referral__button--withdraw button"
                  onClick={this.handleClickWithdrawButton}
                  disabled={loading}
                >
                  Withdraw
                </button>
              )}
            </div>
            <div className="referral__block referral__block--right">
              <h3 className="referral__caption">Generate your referral link</h3>

              <div className="referral__percentage percentage">
                <p className="percentage__text">Set friend’s commission kickback rate</p>
                <div className="percentage__wrapper">{referralBonusesControls}</div>
              </div>

              <div className="referral__account referral__account--right-block">
                <div className="referral__account-block">
                  <span className="referral__account-text">You Recieve</span>
                  <span className="referral__account-number">
                    {ownPercent}
                    <span className="text--red">%</span>
                  </span>
                </div>
                <div className="referral__account-block">
                  <span className="referral__account-text">Friends Recieve</span>
                  <span className="referral__account-number">
                    {friendPercent}
                    <span className="text--red">%</span>
                  </span>
                </div>
              </div>

              {userId && (
                <div className="referral__link">
                  <span className="referral__link-output">
                    {this.concatReferralLink()}
                  </span>
                  <button
                    type="button"
                    onClick={this.copyRefferalLink}
                    className="referral__link-copy"
                  >
                    Copy Link
                    <CopyIcon />
                  </button>
                  <span
                    style={{
                      display: `${showCopiedMessage ? 'inline-block' : 'none'}`,
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      left: '0',
                      fontSize: '12px',
                    }}
                  >
                    Link Copied
                  </span>
                </div>
              )}

              {userId ? (
                <button
                  type="button"
                  href="#"
                  className="referral__link-gen button"
                  onClick={this.handleClickGenerateLinkButton}
                >
                  Generate Link
                </button>
              ) : (
                <button
                  type="button"
                  href="#"
                  className="referral__link-gen button"
                  onClick={this.handleClickModalOpenButton}
                >
                  Login to Generate Link
                </button>
              )}
            </div>
          </div>
        </main>
        <section className="partners">
          <div className="wrapper partners__wrapper">
            <h4 className="partners__header">Our partners:</h4>
            <a href="https://dappradar.com/" target="_blank">
              <img
                src="/img/raster/dappradar-icon.png"
                alt="partner logo"
                className="partners__item"
              />
            </a>
            <a href="https://dappradar.com/" target="_blank">
              <img
                src="/img/raster/dappradar-icon.png"
                alt="partner logo"
                className="partners__item"
              />
            </a>
            <a href="https://dappradar.com/" target="_blank">
              <img
                src="/img/raster/dappradar-icon.png"
                alt="partner logo"
                className="partners__item"
              />
            </a>
          </div>
        </section>

        <LoginModal isModalActive={isModalActive} onClose={this.handleClickCloseModal} />
      </BasePage>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  userId: app.userId,
  generatedLink: app.generatedLink,
  friendCount: app.friendCount,
  referralLinks: app.referralLinks,
  totalReferralBonusReceived: app.userInfo.totalReferralBonusReceived,
  depositAmount: app.userInfo.depositAmount,
  dividendsAmount: app.userInfo.dividendsAmount,
});

export default connect(mapStateToProps)(ReferralPage);
