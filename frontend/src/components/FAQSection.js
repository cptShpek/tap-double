/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import FAQItem from './FAQItem';

class FAQSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      faq: [
        {
          question: 'What is DappDouble?',
          answer: () => {
            return (
              <>
                DappDouble is a DeFi DApp based on{' '}
                {this.createLink('Tron Network', 'https://tron.network/')} smart contracts
                which significantly accelerate your progress in the best Tron Dapps by
                giving opportunity to double your TRX or TRC tokens with minimal risks.
              </>
            );
          },
        },
        {
          question: 'What does DApp mean?',
          answer: () => {
            return (
              <>
                DApp is an abbreviated term for "decentralized application". This means
                that the dapp code (known as a smart contract) runs on a Tron
                decentralized network. Decentralized applications have an advantage
                because of their transparency and the inability to change the code
                downloaded to the blockchain. This allows users to be sure that they work
                with the described tool without any loopholes, and each user can verify
                this by examining the contract code in tronscan. It also allows you to use
                dapp without a website, working with the contract code directly from the
                blockchain, which guarantees the complete safety of your funds.
              </>
            );
          },
        },
        {
          question: 'How does the game work?',
          answer: () => {
            return (
              <>
                All users make a deposit that they want to double. Users with deposits
                once in 24 hours can use the free attempt to double their deposit. After
                making a deposit, they also receive dividends from everyone who entered
                the game or left it. Also, in the interval between free spins, users have
                the opportunity to play for a fee  —  10% of their deposit. <br /> The
                chance to win a double is a 10%. <br /> You are able to withdraw your
                deposit any time you want but this will end your dividends and free spins
                receiving.
              </>
            );
          },
        },
        {
          question: 'How to start play?',
          answer: () => {
            return (
              <>
                If you want to use this platform on PC you need to have{' '}
                {this.createLink(
                  'TronLink',
                  'https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec',
                )}{' '}
                installed. <br />
                If you want to use this platform on mobile you need to have either{' '}
                {this.createLink('TronWallet', 'https://www.tronwallet.me/')},{' '}
                {this.createLink('GuildChat', 'https://www.guildchat.io/')} or{' '}
                {this.createLink('Tronlink', 'https://www.tronlink.org/')}. <br />
                Create or import your address, deposit some TRX in your wallet and start
                the game. <br />
                Note: freeze some TRX or have it on balance, when you work with smart
                contract each action takes some transaction fees.
              </>
            );
          },
        },
        {
          question: 'What are the fees?',
          answer: () => {
            return (
              <>
                Dividents 10% (5% on entry / 5% on exit)
                <br />
                Prize pool 10%
                <br />
                Developers 3%
                <br />
                Referral 2%
              </>
            );
          },
        },
        {
          question: 'What is margin?',
          answer: () => {
            return (
              <>
                The margin system increases your deposit in the system allowing you to
                receive more dividends and increases your winnings in double. It allows
                you to make up to x8 from your deposit.
              </>
            );
          },
        },
        {
          question: 'What about risks?',
          answer: () => {
            return (
              <>
                Immediately after making a deposit, you can withdraw only 75% of your
                deposit due to commissions, these are all the risks that you have in this
                game. <br /> Note: the margin increases your deposit in the system, so
                immediately after making a deposit with a 4x margin, you can only receive
                dividends or win x2 (with your margin 4x deposit, so this is x8 in total),
                because fee with margin 4x will be 100% from your deposited trx.
              </>
            );
          },
        },
        {
          question: 'Submit Dapp',
          answer: () => {
            return (
              <>
                You can fill out{' '}
                {this.createLink('this form', 'https://forms.gle/W2of3p88UbYgpmxG9')} if you want to suggest a dapp whose token will be used in our system.
              </>
            );
          },
        },
      ],
    };

    this.faqRefSection = React.createRef();
  }

  createLink = (text, link) => {
    return (
      <a href={link} target="_blank">
        {text}
      </a>
    );
  };

  render() {
    const { faq } = this.state;

    return (
      <section className="faq main-content__faq" ref={this.faqRefSection}>
        <h2 className="faq__section-header">FAQ</h2>
        <div className="faq__wrapper wrapper">
          {faq.map(({ answer, question }, index) => (
            <FAQItem key={index} answer={answer} question={question} />
          ))}
        </div>
      </section>
    );
  }
}

export default FAQSection;
