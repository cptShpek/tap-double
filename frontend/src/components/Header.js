/* eslint-disable no-script-url */
import React from 'react';
import { Link, matchPath } from 'react-router-dom';
import { path, equals } from 'ramda';
import TelegramIcon from './svg/images/TelegramIcon';
import TwitterIcon from './svg/images/TwitterIcon';
import { scrollTo } from '../helpers';
import { smartContractAdresses, TRON_SCAN_URL } from '../services';

class Header extends React.Component {
  state = {
    isMenuOpened: false,
    currency: 'TRX',
  };

  toggleNavigation = () => {
    this.setState((state) => ({
      isMenuOpened: !state.isMenuOpened,
    }));

    if (!this.state.isMenuOpened) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
  };

  scrollToFaqSection = () => {
    this.setState({
      isMenuOpened: false,
    });
    scrollTo(
      document.body,
      this.props.faqRef.current.faqRefSection.current.offsetTop,
      500,
    );
  };

  handleChangeCurrency = (e) => {
    const { value } = e.target;
    if (equals(value, 'add')) {
      window.open('https://forms.gle/W2of3p88UbYgpmxG9', '_blank');
    }
  };

  render() {
    const { isMenuOpened, currency } = this.state;
    const match = matchPath(window.location.pathname, {
      path: '/:id',
    });
    const location = path(['params', 'id'], match);

    return (
      <>
        <nav className="nav">
          <div
            className={`wrapper nav__wrapper ${
              isMenuOpened ? 'nav__wrapper--menu-open' : ''
            }`}
          >
            <button
              type="button"
              className={`nav__burger ${isMenuOpened ? 'nav__burger--close' : ''}`}
              onClick={this.toggleNavigation}
            >
              Open Menu
            </button>
            <div className="nav__logo">
              <Link to="/" className="start-page__logo-img">
                <span>Dapp</span>
                <span>Double</span>
              </Link>
              <div className="nav__currency nav__currency--desktop">
                <select
                  name="currency"
                  id="currencySelect"
                  onChange={this.handleChangeCurrency}
                  value={currency}
                >
                  <option value="TRX">TRX</option>
                  <option value="add">+ Add</option>
                </select>
              </div>
            </div>

            <ul className={`nav__links ${isMenuOpened ? 'nav__links--open' : ''}`}>
              {!location && (
                <li className="nav__item">
                  <a href="#faq" onClick={this.scrollToFaqSection}>
                    FAQ
                  </a>
                </li>
              )}
              <li className="nav__item">
                <Link to="/referral">Referral</Link>
              </li>
              <li className="nav__item">
                <a
                  href="https://tronscan.org/#/address/THcZGG1KW5SGGRCXcjq2LhjmkK8EHAVx8G/contracts"
                  target="_blank"
                >
                  Contract
                </a>
              </li>
              <li className="nav__item--currency">
                <div className="nav__currency nav__currency--mobile">
                  <select name="currency" id="currencySelect1">
                    <option value="TRX">TRX</option>
                    <option value="BTC">BTC</option>
                  </select>
                </div>
              </li>
            </ul>

            <ul className="nav__social">
              <li className="nav__social-item">
                <a href="https://t.me/dappdouble" target="_blank">
                  <TelegramIcon />
                  <span>Telegram</span>
                </a>
              </li>
              <li className="nav__social-item">
                <a href="https://twitter.com/dappdouble" target="_blank">
                  <TwitterIcon />
                  <span>Twitter</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {isMenuOpened && (
          <div onClick={this.toggleNavigation} className="overlay active" />
        )}
      </>
    );
  }
}

export default Header;
