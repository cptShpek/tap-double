import React from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import Timer from './Timer';

class ClocksDeckBuilder extends React.Component {
  state = {
    timeUnits: {},
  };

  componentDidMount() {
    this.inetrvalId = setInterval(this.getTimeRemaining, 1000);
  }

  getTimeRemaining = () => {
    const utcEndTime = zonedTimeToUtc('2020-06-12 21:00:00', 'Europe/Moscow');

    // const t = Date.parse(this.props.endTime) - Date.parse(new Date());
    const t = utcEndTime - new Date().getTime();
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    this.setState({
      timeUnits: {
        days,
        hours,
        minutes,
        seconds,
      },
    });

    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
      clearInterval(this.inetrvalId);
      this.setState({
        timeUnits: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        },
      });
    }
  };

  render() {
    return (
      <div className="start-page__timer timer">
        <div className="timer__wrapper">
          <div className="timer__item">
            <Timer timeLimit={10} timeLeft={this.state.timeUnits.days} type="Days" />
          </div>
          <div className="timer__item">
            <Timer timeLimit={24} timeLeft={this.state.timeUnits.hours} type="Hours" />
          </div>
          <div className="timer__item">
            <Timer
              timeLimit={60}
              timeLeft={this.state.timeUnits.minutes}
              type="Minutes"
            />
          </div>
          <div className="timer__item">
            <Timer
              timeLimit={60}
              timeLeft={this.state.timeUnits.seconds}
              type="Seconds"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ClocksDeckBuilder;
