/* eslint-disable func-names */
import * as R from 'ramda';

export const generateQueryParams = (queryData) => {
  return R.compose(
    R.join('&'),
    R.map(R.join('=')),
    R.map(R.map(encodeURIComponent)),
    R.toPairs,
  )(queryData);
};

export const scrollTo = (element, to, duration) => {
  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 20;

  const animateScroll = () => {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    window.scrollTo(0, val);
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
};

export const debounce = R.curry((immediate, timeMs, fn) => () => {
  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;

      if (!immediate) {
        R.apply(fn, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, timeMs);

    if (callNow) {
      R.apply(fn, args);
    }

    return timeout;
  };
});

export const spaceBetween = (number) => {
  number = (number || 0).toFixed(2);
  return String(number).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

export const toFixedNumber = (number = 0) => {
  if (number % 1 === 0) {
    return number.toFixed(0);
  }
  const transformed = number.toFixed(2);
  if (Number(transformed) === 0) {
    return 0;
  }
  return transformed;
};

// t = current time
// b = start value
// c = change in value
// d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};
