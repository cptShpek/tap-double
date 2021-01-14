import React from 'react';
import ChromeIcon from './svg/images/ChromeIcon';

const LoginModal = ({ isModalActive, onClose }) => {
  return (
    <>
      <div className={`modal ${isModalActive ? 'modal--active' : ''}`}>
        <button type="button" className="modal__cross" onClick={onClose}>
          Close
        </button>
        <div className="modal__wrapper">
          <div className="modal__picture">
            <img src="/img/raster/wallet-img.png" alt="wallet" />
          </div>
          {window.tronWeb ? (
            <span className="modal__header">Please login to your Tronlink account</span>
          ) : (
            <>
              <span className="modal__header">Login to your Tron Wallet</span>
              <p className="modal__text">
                If you do not have Tronlink wallet click “Install extension”. Create
                Tronlink wallet and you will be able to login.
              </p>

              <a
                href="https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec"
                target="_blank"
                className="modal__link button"
              >
                <ChromeIcon />
                <span>Install Extension</span>
              </a>
            </>
          )}
          <div className="modal__apps">
            <a target="_blank" href="https://apps.apple.com/us/app/tronlink/id1453530188">
              <img
                className="modal__apps-apple"
                src="/img/raster/app-store-badge.png"
                alt="app-store-badge"
              />
            </a>
            <a
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.tronlinkpro.wallet"
            >
              <img
                className="modal__apps-google"
                src="/img/raster/g-play-badge.png"
                alt="google play-badge"
              />
            </a>
          </div>
        </div>
      </div>
      {isModalActive && <div onClick={onClose} className="overlay active" />}
    </>
  );
};

export default LoginModal;
