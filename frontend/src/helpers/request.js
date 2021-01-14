import Cookies from 'js-cookie';

function timeoutPromise(ms, promise, options) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (options && options.goToErrorPage) {
        window.location = '/error';
      }
      reject(new Error('Request timed out. Try again later'));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
}

function getStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.text().then((res) => {
      return res ? JSON.parse(res) : {};
    });
  }

  if (response.status === 400) {
    return response.text().then((res) => {
      res = res ? JSON.parse(res) : {};
      if (res.error === 'User already exists') {
        return res;
      }
    });
  }

  throw new Error(`Status text: ${response.statusText}. Status: ${response.status}`);
}

export async function request(
  url,
  { method = 'get', body, headers = {}, ...rest } = {},
  options = {},
) {
  if (!options.withoutHeader && !headers['Content-Type'] && !headers['Content-type']) {
    // eslint-disable-next-line no-param-reassign
    headers['Content-Type'] = 'application/json';
  }

  const response = await timeoutPromise(
    30000,
    fetch(url, {
      method,
      headers,
      body,
      ...rest,
    }),
  );

  return getStatus(response);
}
