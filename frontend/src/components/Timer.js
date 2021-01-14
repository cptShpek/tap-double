import React from 'react';
import { isNil } from 'ramda';

const FULL_DASH_ARRAY = 314;

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      strokeDasharray: FULL_DASH_ARRAY,
      timeLeft: 0,
    };
  }

  componentDidMount() {
    this.setState({ timeLeft: 20 });

    this.setCircleDasharrayIntervalId = setInterval(this.setCircleDasharray, 1000);
    this.restartIntervalId = setInterval(this.restart, 500);
    this.timeLeftIntervalId = setInterval(() => this.setState({ timeLeft: 0 }), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.setCircleDasharrayIntervalId);
    clearInterval(this.restartIntervalId);
    clearInterval(this.timeLeftIntervalId);
  }

  calculateTimeFraction = () => {
    const rawTimeFraction =
      (this.props.timeLeft || this.state.timeLeft) / this.props.timeLimit;
    return rawTimeFraction - (1 / this.props.timeLimit) * (1 - rawTimeFraction);
  };

  setCircleDasharray = () => {
    const circleDasharray = `${(this.calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(
      0,
    )} 314`;

    const { type = 'seconds' } = this.props;
    if (!isNil(document.getElementById(type))) {
      document.getElementById(type).setAttribute('stroke-dasharray', circleDasharray);
      this.setState({
        strokeDasharray: circleDasharray,
      });
    }
  };

  restart = () => {
    if (this.props.timeLeft === 0) {
      this.setState({ timeLeft: this.props.timeLimit });
    }
  };

  render() {
    return (
      <div className="base-timer">
        <svg className="base-timer__svg" viewBox="0 0 120 120">
          <g className="base-timer__circle">
            <circle className="base-timer__path-elapsed" cx="60" cy="60" r="50" />
            <path
              id={this.props.type}
              strokeDasharray={this.state.strokeDasharray}
              className="base-timer__path-remaining remainingPathColor"
              d="
                M 60, 60
                m -50, 0
                a 50,50 0 1,0 100,0
                a 50,50 0 1,0 -100,0
                "
            />
          </g>
        </svg>
        <div className="timer__label">
          <span className="timer__number">{this.props.timeLeft}</span>
          <span className="timer__text">{this.props.type}</span>
        </div>
      </div>
    );
  }
}

export default Timer;
