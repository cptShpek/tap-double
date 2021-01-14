import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

class BasePage extends React.Component {
  componentDidMount() {
    document.body.style.overflowY = '';
  }

  render() {
    const { children, faqRef } = this.props;
    return (
      <div className="main-page">
        <Header faqRef={faqRef} />
        {children}
        <Footer />
      </div>
    );
  }
}

export default BasePage;
