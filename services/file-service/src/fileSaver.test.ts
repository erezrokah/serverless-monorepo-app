jest.mock('aws-sdk', () => {
  const promise = jest.fn();
  const putObject = jest.fn(() => ({ promise }));
  const S3 = jest.fn(() => ({ putObject }));
  return { S3 };
});
jest.mock('node-fetch');
jest.spyOn(console, 'log');

process.env.BUCKET = 'Bucket';

describe('fileSaver', () => {
  const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const badDataResponse = (input: any) => ({
    body: JSON.stringify({
      input,
      message: 'Bad input data or missing file url.',
    }),
    headers,
    statusCode: 422,
  });

  const AWS = require('aws-sdk');
  const s3 = AWS.S3;

  test('should return response on empty body', async () => {
    const { saveFile } = require('./fileSaver');

    const fetch = require('node-fetch');

    const body = '';

    const { response, error } = await saveFile(body);

    expect(fetch).toHaveBeenCalledTimes(0);
    expect(s3).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on malformed body', async () => {
    const { saveFile } = require('./fileSaver');

    const fetch = require('node-fetch');

    const body = 'invalid-json';

    const { response, error } = await saveFile(body);

    expect(fetch).toHaveBeenCalledTimes(0);
    expect(s3).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      'Invalid body',
      expect.any(SyntaxError),
    );
  });

  const fields = ['file_url', 'key'];
  fields.forEach(f => {
    test(`should return response on empty ${f}`, async () => {
      const { saveFile } = require('./fileSaver');

      const fetch = require('node-fetch');

      const body = JSON.stringify({ [f]: '' });

      const { response, error } = await saveFile(body);

      expect(fetch).toHaveBeenCalledTimes(0);
      expect(s3).toHaveBeenCalledTimes(1);
      expect(response).toEqual(badDataResponse(body));
      expect(error).toBeNull();
    });
  });

  test('should return response on valid inputs', async () => {
    const { saveFile } = require('./fileSaver');

    const fetch = require('node-fetch');
    const buffer = [];
    const fetchResponse = { ok: true, buffer: jest.fn(() => buffer) };
    fetch.mockReturnValue(Promise.resolve(fetchResponse));

    const fileUrl = 'https://somefile.com/image.png';
    const key = 'image.png';
    const body = JSON.stringify({ file_url: fileUrl, key });

    const { response, error } = await saveFile(body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fileUrl);
    expect(AWS.S3().putObject).toHaveBeenCalledTimes(1);
    expect(AWS.S3().putObject).toHaveBeenCalledWith({
      Body: buffer,
      Bucket: process.env.BUCKET,
      Key: key,
    });
    expect(AWS.S3().putObject().promise).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      body: JSON.stringify({
        input: body,
        message: 'File saved',
      }),
      headers,
      statusCode: 200,
    });
    expect(error).toBeNull();
  });

  test('should return response on failed fetch', async () => {
    const { saveFile } = require('./fileSaver');

    const fetch = require('node-fetch');
    const fetchResponse = {
      ok: false,
      status: 500,
      statusText: 'Failed',
      url: 'https://somefile.com/image.png',
    };
    fetch.mockReturnValue(Promise.resolve(fetchResponse));

    const fileUrl = 'https://somefile.com/image.png';
    const key = 'image.png';
    const body = JSON.stringify({ file_url: fileUrl, key });

    const { response, error } = await saveFile(body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fileUrl);
    expect(AWS.S3().putObject).toHaveBeenCalledTimes(0);

    expect(response).toEqual({
      body: JSON.stringify({
        input: body,
        message: 'Fetch failed',
      }),
      headers,
      statusCode: 500,
    });
    const expectedError = new Error(
      `Failed to fetch ${fetchResponse.url}: ${fetchResponse.status} ${
        fetchResponse.statusText
      }`,
    );
    expect(error).toEqual(expectedError);
  });

  test('should return response on failed promise rejects', async () => {
    const { saveFile } = require('./fileSaver');

    const fetch = require('node-fetch');
    const expectedError = new Error(`Failed to fetch`);
    fetch.mockReturnValue(Promise.reject(expectedError));

    const fileUrl = 'https://somefile.com/image.png';
    const key = 'image.png';
    const body = JSON.stringify({ file_url: fileUrl, key });

    const { response, error } = await saveFile(body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fileUrl);
    expect(AWS.S3().putObject).toHaveBeenCalledTimes(0);

    expect(response).toEqual({
      body: JSON.stringify({
        input: body,
        message: 'Unknown Error',
      }),
      headers,
      statusCode: 500,
    });

    expect(error).toEqual(expectedError);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
