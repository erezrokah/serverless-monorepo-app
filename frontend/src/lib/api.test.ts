const ENDPOINT = 'https://endpoint.test.com';
process.env.REACT_APP_API_SERVICE_ENDPOINT = ENDPOINT;

const EMAIL_ENDPOINT = 'https://email.endpoint.test.com';
process.env.REACT_APP_EMAIL_SERVICE_ENDPOINT = EMAIL_ENDPOINT;

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
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json };
    fetch.mockReturnValueOnce(response);

    const result = await publicApi();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ENDPOINT}/api/public`, {
      cache: 'no-store',
      method: 'POST',
    });
    expect(result).toEqual(data.message);
  });

  test('should call public api and throw error', async () => {
    const { publicApi } = require('./api');
    const error = new Error('error');
    fetch.mockReturnValueOnce(Promise.reject(error));

    expect.assertions(1);
    try {
      await publicApi();
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  test('should call private api and get response', async () => {
    const { privateApi } = require('./api');

    const token = 'someIdToken';
    localStorage.getItem.mockReturnValueOnce(token);
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json, ok: true };
    fetch.mockReturnValueOnce(response);

    const result = await privateApi();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ENDPOINT}/api/private`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    });
    expect(result).toEqual(data.message);
  });

  test('should call private api and throw error on unauthorized', async () => {
    const { privateApi } = require('./api');

    const token = 'someIdToken';
    localStorage.getItem.mockReturnValueOnce(token);
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json, ok: false };
    fetch.mockReturnValueOnce(response);

    expect.assertions(1);
    try {
      await privateApi();
    } catch (e) {
      expect(e).toEqual(new Error(data.message));
    }
  });

  test('should call private api and throw error', async () => {
    const { privateApi } = require('./api');

    const error = new Error('error');
    fetch.mockReturnValueOnce(Promise.reject(error));

    expect.assertions(1);
    try {
      await privateApi();
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  test('should call email api and get response', async () => {
    const { emailApi } = require('./api');

    const token = 'someIdToken';
    localStorage.getItem.mockReturnValueOnce(token);
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json, ok: true };
    fetch.mockReturnValueOnce(response);

    const toAddress = 'to_address';
    const result = await emailApi(toAddress);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${EMAIL_ENDPOINT}/email`, {
      body: JSON.stringify({ to_address: toAddress }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    });
    expect(result).toEqual(data.message);
  });

  test('should call email api and throw error on unauthorized', async () => {
    const { emailApi } = require('./api');

    const token = 'someIdToken';
    localStorage.getItem.mockReturnValueOnce(token);
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json, ok: false };
    fetch.mockReturnValueOnce(response);

    expect.assertions(1);
    try {
      await emailApi('');
    } catch (e) {
      expect(e).toEqual(new Error(data.message));
    }
  });

  test('should call email api and throw error', async () => {
    const { emailApi } = require('./api');

    const error = new Error('error');
    fetch.mockReturnValueOnce(Promise.reject(error));

    expect.assertions(1);
    try {
      await emailApi('');
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
