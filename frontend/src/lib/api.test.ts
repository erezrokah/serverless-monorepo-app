const ENDPOINT = 'https://endpoint.test.com';
process.env.REACT_APP_API_SERVICE_ENDPOINT = ENDPOINT;

const EMAIL_ENDPOINT = 'https://email.endpoint.test.com';
process.env.REACT_APP_EMAIL_SERVICE_ENDPOINT = EMAIL_ENDPOINT;

jest.spyOn(console, 'log');

describe('api lib', () => {
  const fetch = jest.fn();
  // @ts-ignore fetch does not exists on global
  global.fetch = fetch;

  const localStorage = { getItem: jest.fn() };
  // @ts-ignore localStorage does not exists on global
  global.localStorage = localStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should call public api and get response', async () => {
    const { publicApi } = require('./api');
    const data = 'data';
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json };
    fetch.mockReturnValueOnce(response);

    await publicApi();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ENDPOINT}/api/public`, {
      cache: 'no-store',
      method: 'POST',
    });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Message:', data);
  });

  test('should call public api and handle error', async () => {
    const { publicApi } = require('./api');
    const error = new Error('error');
    fetch.mockReturnValueOnce(Promise.reject(error));

    await publicApi();

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('error', error);
  });

  test('should call private api and get response', async () => {
    const { privateApi } = require('./api');

    const token = 'someIdToken';
    localStorage.getItem.mockReturnValueOnce(token);
    const data = 'data';
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json };
    fetch.mockReturnValueOnce(response);

    await privateApi();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ENDPOINT}/api/private`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Token:', data);
  });

  test('should call private api and handle error', async () => {
    const { privateApi } = require('./api');

    const error = new Error('error');
    fetch.mockReturnValueOnce(Promise.reject(error));

    await privateApi();

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('error', error);
  });

  test('should call email api and get response', async () => {
    const { emailApi } = require('./api');

    const token = 'someIdToken';
    localStorage.getItem.mockReturnValueOnce(token);
    const data = 'data';
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json };
    fetch.mockReturnValueOnce(response);

    const toAddress = 'to_address';
    await emailApi(toAddress);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${EMAIL_ENDPOINT}/email`, {
      body: JSON.stringify({ to_address: toAddress }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Mail:', data);
  });

  test('should call email api and handle error', async () => {
    const { emailApi } = require('./api');

    const error = new Error('error');
    fetch.mockReturnValueOnce(Promise.reject(error));

    await emailApi('');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('error', error);
  });
});
