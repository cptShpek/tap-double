import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'spin.js';
import { appActions } from '../actions';

/* functional creating time-left-HTML elements */

const TimeLeft = ({ timeLeft: { seconds, hours, minutes } }) => {
  return (
    <div className="rouletteTimer__time-left">
      {/* <div>
        <span>{`${
          days < 10 ? `0${days}` : days
        }`}</span>
        <span>Days</span>
      </div> */}
      <div className="time-unit">
        <span>{`${hours < 10 ? `0${hours}` : hours}`}</span>
        <span className="time-unit__name">Hour</span>
      </div>
      <span className="rouletteTimer__time-left__colon"> : </span>
      <div className="time-unit">
        <span>{`${minutes < 10 ? `0${minutes}` : minutes}`}</span>
        <span className="time-unit__name">Min</span>
      </div>
      <span className="rouletteTimer__time-left__colon"> : </span>
      <div className="time-unit">
        <span>{`${seconds < 10 ? `0${seconds}` : seconds}`}</span>
        <span className="time-unit__name">Sec</span>
      </div>
    </div>
  );
};

const spinnerLineLengthMobile = 12;
const spinnerLineLengthDesktop = 22;

class TimerForRoulette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeUnits: {},
      timerUIProperties: {
        xCord: 275,
        yCord: 275,
        radius: 240,
        strokeWidth: 20,
      },
    };
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    const {
      timeUnits: { hours, minutes, seconds },
    } = this.getTimeRemaining();
    this.timerId = setInterval(this.getTimeRemaining, 1000);

    let spinnerRadius = 160;
    if (hours > 0 || minutes > 0 || seconds > 0) {
      if (window.innerWidth <= 767) {
        spinnerRadius = this.svgRef.current.clientWidth / 2 - 93;

        this.createSpinner({
          radius: spinnerRadius,
          length: spinnerLineLengthMobile,
          width: 3,
        });
      } else {
        this.createSpinner({ radius: spinnerRadius });
      }
    }
    this.getUITimerProperites();

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.timerId);
  }

  /* time parsing */

  getTimeRemaining = () => {
    const t = Date.parse(this.props.endTime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const timeLeftCircleDegree = 135 - (24 - hours) * 11.25;

    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      clearInterval(this.timerId);
      if (this.spinner) {
        this.spinner.stop();
      }
      hours = 0;
      minutes = 0;
      seconds = 0;
      setTimeout(() => {
        window.smartContractService.getStats().then((res) => {
          this.props.dispatch(appActions.setUserInfo(res));
        });
      }, 3000);
      this.props.stopGame();
    }

    this.setState({
      timeUnits: {
        days,
        hours,
        minutes,
        seconds,
        timeLeftCircleDegree,
      },
    });

    return {
      timeUnits: {
        days,
        hours,
        minutes,
        seconds,
        timeLeftCircleDegree,
      },
    };
  };

  /* circles creation */

  polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');

    return d;
  };

  /* spinner creation */

  createSpinner = ({
    radius = 160,
    length = spinnerLineLengthDesktop,
    width = 5,
  } = {}) => {
    const opts = {
      lines: 18, // The number of lines to draw
      length, // The length of each line
      width, // The line thickness
      radius, // The radius of the inner circle
      corners: 0.8, // Corner roundness (0..1)
      color: ['#ef1b52'], // CSS color or array of colors
      fadeColor: ['#262931', '#262932', '#262933', '#302b32', '#323139'], // CSS color or array of colors
      speed: 0.2, // Rounds per second
      rotate: 90, // The rotation offset
      animation: 'spinner-line-fade-more', // The CSS animation name for the lines
      direction: -1, // 1: clockwise, -1: counterclockwise
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      className: 'spinner', // The CSS class to assign to the spinner
      shadow: '0 0 1px transparent', // Box-shadow for the lines
      position: 'relative', // Element positioning
    };

    this.spinner = new Spinner(opts).spin(document.getElementById('spinner'));
  };

  getUITimerProperites = () => {
    if (this.svgRef.current.clientWidth <= 500) {
      this.setState({
        timerUIProperties: {
          xCord: this.svgRef.current.clientWidth / 2,
          yCord: this.svgRef.current.clientHeight / 2,
          radius: this.svgRef.current.clientWidth / 2 - 51,
          strokeWidth: 8,
        },
      });
    }
  };

  handleResize = () => {
    if (window.innerWidth <= 767) {
      this.spinner.stop();
      this.getUITimerProperites();
      this.createSpinner({
        radius: this.svgRef.current.clientWidth / 2 - 93,
        length: spinnerLineLengthMobile,
        width: 3,
      });
    }
  };

  render() {
    const {
      timeUnits: { timeLeftCircleDegree, hours, minutes, seconds },
      timeUnits,
      timerUIProperties: { xCord, yCord, radius, strokeWidth },
    } = this.state;

    return (
      <>
        <svg className="rouletteTimer__circle" ref={this.svgRef}>
          <path
            id="arc1"
            strokeLinecap="round"
            fill="none"
            d={this.describeArc(xCord, yCord, radius, -135, 135)}
            stroke="#26292e"
            strokeWidth={strokeWidth}
          />
          {!(hours <= 0 && minutes <= 0 && seconds <= 0) && (
            <path
              id="arc2"
              strokeLinecap="round"
              fill="none"
              d={this.describeArc(xCord, yCord, radius, -135, timeLeftCircleDegree)}
              stroke="#ef1b52"
              strokeWidth={strokeWidth}
            />
          )}
        </svg>
        <TimeLeft timeLeft={timeUnits} />
        <div className="rouletteTimer__spinner" id="spinner" />
      </>
    );
  }
}

export default connect()(TimerForRoulette);
