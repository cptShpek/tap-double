/* eslint-disable react/button-has-type */
import React from 'react';
import { connect } from 'react-redux';
import BasePage from './BasePage';
import GameSection from '../components/GameSection';
import ChartSection from '../components/ChartSection';
import InfoSection from '../components/InfoSection';
import FAQSection from '../components/FAQSection';
import UserStats from '../components/UserStats';
import { smartContractService } from '../services';

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.faqSectionRef = React.createRef();
  }

  render() {
    const { userId } = this.props;

    return (
      <BasePage faqRef={this.faqSectionRef}>
        <main className="main-content">
          <UserStats />
          <GameSection />
          <ChartSection />
          <InfoSection />
          <FAQSection ref={this.faqSectionRef} />
        </main>
        <section className="partners">
          <div className="wrapper partners__wrapper">
            <h4 className="partners__header">Our partners:</h4>
            <a href="https://dappradar.com/tron/655/dappdouble" target="_blank">
              <img
                src="/img/raster/dappradar-icon.png"
                alt="partner logo"
                className="partners__item"
              />
            </a>
          </div>
        </section>
      </BasePage>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  userId: app.userId,
});

export default connect(mapStateToProps)(MainPage);
