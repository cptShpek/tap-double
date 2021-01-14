import React from 'react';
import TelegramIcon from './svg/images/TelegramIcon';
import TwitterIcon from './svg/images/TwitterIcon';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="wrapper footer__wrapper">
          <div className="footer__block">
            <a href="#" className="footer__logo">
              <span>Dapp</span>
              <span>Double</span>
            </a>
            <span className="footer__copyright">&#169; 2020 DappDouble</span>
          </div>
          <ul className="footer__social nav__social">
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
      </footer>
    );
  }
}

export default Footer;
