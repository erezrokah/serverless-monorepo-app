import MockDate = require('mockdate');

jest.mock('aws-sdk', () => {
  const promise = jest.fn();
  const putRecord = jest.fn(() => ({ promise }));
  const Kinesis = jest.fn(() => ({ putRecord }));
  return { Kinesis };
});
jest.mock('uuid', () => {
  const v1 = jest.fn(() => '00000000000000000000000000');
  return { v1 };
});
jest.spyOn(console, 'log');

process.env.Stream = 'Stream';

MockDate.set('1948/1/1');

describe('kinesis', () => {
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
      message: 'Bad input data',
    }),
    headers,
    statusCode: 422,
  });

  const AWS = require('aws-sdk');
  const kinesis = AWS.Kinesis;
  const { v1: uuid } = require('uuid');

  test('should return response on empty body', async () => {
    const { queueEvent } = require('./kinesis');

    const body = '';

    const { response, error } = await queueEvent(body);

    expect(kinesis).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on malformed body', async () => {
    const { queueEvent } = require('./kinesis');

    const body = 'invalid-json';

    const { response, error } = await queueEvent(body);

    expect(kinesis).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      'Invalid body',
      expect.any(SyntaxError),
    );
  });

  test('should return response on invalid record', async () => {
    const { queueEvent } = require('./kinesis');

    const record = { message: [] };
    const body = JSON.stringify({ record });

    const { response, error } = await queueEvent(body);

    expect(kinesis).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on valid input', async () => {
    const { queueEvent } = require('./kinesis');

    const record = { message: 'some message' };
    const body = JSON.stringify({ record });

    const { response, error } = await queueEvent(body);

    expect(uuid).toHaveBeenCalledTimes(1);
    expect(AWS.Kinesis().putRecord).toHaveBeenCalledTimes(1);
    expect(AWS.Kinesis().putRecord).toHaveBeenCalledWith({
      Data: JSON.stringify({
        record: { message: record.message, id: uuid() },
        timestamp: new Date().toISOString(),
      }),
      PartitionKey: uuid(),
      StreamName: process.env.Stream,
    });
    expect(AWS.Kinesis().putRecord().promise).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      body: JSON.stringify({
        data: { message: 'Record saved', id: uuid() },
        input: body,
      }),
      headers,
      statusCode: 200,
    });
    expect(error).toBeNull();
  });
});
