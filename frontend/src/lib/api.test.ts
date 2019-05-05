const ENDPOINT = 'https://endpoint.test.com';
process.env.REACT_APP_API_SERVICE_ENDPOINT = ENDPOINT;

const EMAIL_ENDPOINT = 'https://email.endpoint.test.com';
process.env.REACT_APP_EMAIL_SERVICE_ENDPOINT = EMAIL_ENDPOINT;

const FILE_ENDPOINT = 'https://file.endpoint.test.com';
process.env.REACT_APP_FILE_SERVICE_ENDPOINT = FILE_ENDPOINT;

const DB_ENDPOINT = 'https://db.endpoint.test.com';
process.env.REACT_APP_DB_SERVICE_ENDPOINT = DB_ENDPOINT;

describe('api lib', () => {
  const fetch = jest.fn();
  // @ts-ignore
  global.fetch = fetch;

  beforeEach(() => {
    localStorage.clear();
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
    localStorage.setItem('id_token', token);

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
    localStorage.setItem('id_token', token);

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
    localStorage.setItem('id_token', token);

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
    localStorage.setItem('id_token', token);

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

  test('should call saveFile and get response', async () => {
    const { saveFile } = require('./api');
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json, ok: true };
    fetch.mockReturnValueOnce(response);

    const payload = { fileUrl: 'fileUrl', key: 'key' };
    const result = await saveFile(payload);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${FILE_ENDPOINT}/save`, {
      body: JSON.stringify({ file_url: payload.fileUrl, key: payload.key }),
      method: 'POST',
    });
    expect(result).toEqual(data.message);
  });

  test('should call createTodosItem and get response', async () => {
    const { createTodosItem } = require('./api');
    const data = { message: 'message' };
    const json = jest.fn();
    json.mockReturnValueOnce(Promise.resolve(data));
    const response = { json, ok: true };
    fetch.mockReturnValueOnce(response);

    const text = 'text';
    const result = await createTodosItem(text);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${DB_ENDPOINT}/todos`, {
      body: JSON.stringify({ text }),
      method: 'POST',
    });
    expect(result).toEqual(JSON.stringify(data));
  });
});
