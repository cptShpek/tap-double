import React from 'react';
import { connect } from 'react-redux';
import { toFixedNumber } from '../helpers';

class InfoSection extends React.Component {
  render() {
    const {
      totals: { players, volume, wins },
    } = this.props;

    return (
      <div className="info main-content__info">
        <div className="info__wrapper">
          <div className="info__item">
            <span className="info__number">{players}</span>
            <span className="info__text">Total players</span>
          </div>

          <div className="info__item">
            <span className="info__number">{toFixedNumber(volume)}</span>
            <span className="info__text">Total volume</span>
          </div>

          <div className="info__item">
            <span className="info__number">{wins}</span>
            <span className="info__text">Total wins</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  totals: app.totals,
});

export default connect(mapStateToProps)(InfoSection);
