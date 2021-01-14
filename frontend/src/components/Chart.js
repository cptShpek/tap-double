import React, { PureComponent } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { isNil } from 'ramda';
import { format, addDays, isBefore } from 'date-fns';
import { debounce, toFixedNumber } from '../helpers';
import { smartContractAdresses, TRON_SCAN_URL } from '../services';

class Chart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cartesianGridVerticalPoint: [],
    };

    this.chartWrapper = React.createRef();

    this.drawVerticalCartesianGridDebounced = debounce(
      false,
      300,
      this.drawVerticalCartesianGrid,
    )();
  }

  componentDidMount() {
    this.drawVerticalCartesianGrid();

    window.addEventListener('resize', this.drawVerticalCartesianGrid);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawVerticalCartesianGrid);
  }

  spaceBetween = (str) => {
    return str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  };

  valueFormateer = (value, name, props) => `${toFixedNumber(Number(value))} TRX`;

  labelFormatter = (value) => format(new Date(value), 'd MMMM yyyy');

  tickFormatter = (value) => format(new Date(value), 'd MMM');

  drawVerticalCartesianGrid = () => {
    if (this.chartWrapper.current) {
      const barWidth =
        (this.chartWrapper.current.querySelector('.recharts-responsive-container')
          .clientWidth -
          104) /
        14;
      this.setState({
        cartesianGridVerticalPoint: new Array(14)
          .fill(null)
          .map((item, index) => barWidth * (index + 1) + 99),
      });
    }
  };

  customTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="recharts-default-tooltip">
          <p className="recharts-tooltip-label">{this.labelFormatter(label)}</p>
          <p className="recharts-tooltip-value-wr">
            <span className="name name--deposit">Deposit:</span>
            <span className="value">
              {this.valueFormateer(payload[0].payload.deposit)}
            </span>
          </p>
          <p className="recharts-tooltip-value-wr">
            <span className="name name--withdraw">Withdraw:</span>
            <span className="value">
              {this.valueFormateer(payload[0].payload.withdraw)}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  handleClickChartContainer = () => {
    window.open(
      `${TRON_SCAN_URL}/#/contract/${smartContractAdresses.STATS}/trx-balances-chart`,
      '_blank',
    );
  };

  render() {
    const { data } = this.props;
    const { cartesianGridVerticalPoint } = this.state;

    return (
      <div
        className="chart"
        ref={this.chartWrapper}
        onClick={this.handleClickChartContainer}
      >
        <ResponsiveContainer height={360}>
          <BarChart data={data} barSize={22}>
            <CartesianGrid
              verticalFill={['#272a2f', '#33373d']}
              horizontal={false}
              stroke={false}
              verticalPoints={cartesianGridVerticalPoint}
            />
            <XAxis dataKey="date" tickFormatter={this.tickFormatter} tickLine={false} />
            <YAxis width={100} tickLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} content={this.customTooltip} />
            <Bar radius={[5, 5, 5, 5]} dataKey="deposit" fill="#58e855" />
            <Bar radius={[5, 5, 5, 5]} dataKey="withdraw" fill="#dd4242" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
