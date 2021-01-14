import React from 'react';

class FAQItem extends React.Component {
  constructor(props) {
    super(props);

    this.titleRef = React.createRef();
  }

  toggleItem = () => {
    const { current } = this.titleRef;
    const panel = current.nextElementSibling;

    current.parentNode.classList.toggle('active');

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  };

  render() {
    const { answer, question } = this.props;
    return (
      <div className="faq__item">
        <div className="faq__title" ref={this.titleRef} onClick={this.toggleItem}>
          <span className="faq__header">{question}</span>
          <button type="button" className="faq__button">
            Show Answer
          </button>
        </div>
        <div className="faq__description">
          <p className="faq__text">{answer()}</p>
        </div>
      </div>
    );
  }
}

export default FAQItem;
