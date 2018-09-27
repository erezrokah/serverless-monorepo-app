jest.mock('aws-sdk', () => {
  const promise = jest.fn();
  const put = jest.fn(() => ({ promise }));
  const DocumentClient = jest.fn(() => ({ put }));
  const DynamoDB = { DocumentClient };
  return { DynamoDB };
});
jest.spyOn(console, 'log');
jest.mock('uuid/v1');

process.env.DYNAMODB_TABLE = 'TableName';

describe('db', () => {
  const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
  };

  const MockDate = require('mockdate');

  beforeEach(() => {
    jest.clearAllMocks();

    const date = '1/1/2000';
    MockDate.set(date);
  });

  afterEach(() => {
    MockDate.reset();
  });

  const badDataResponse = (input: any) => ({
    body: JSON.stringify({
      input,
      message: 'Bad input data or missing text',
    }),
    headers,
    statusCode: 422,
  });

  const AWS = require('aws-sdk');
  const dynamoDB = AWS.DynamoDB.DocumentClient;

  test('should return response on empty body', async () => {
    const { create } = require('./db');

    const body = '';

    const { response, error } = await create(body);

    expect(dynamoDB).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on malformed body', async () => {
    const { create } = require('./db');

    const body = 'invalid-json';

    const { response, error } = await create(body);

    expect(dynamoDB).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      'Invalid body',
      expect.any(SyntaxError),
    );
  });

  test('should return response on empty text', async () => {
    const { create } = require('./db');

    const body = JSON.stringify({ text: '' });

    const { response, error } = await create(body);

    expect(dynamoDB).toHaveBeenCalledTimes(1);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on valid text', async () => {
    const { create } = require('./db');

    const uuid = require('uuid/v1');
    const id = 'someUuid';
    uuid.mockReturnValue(id);

    const text = 'textToWrite';
    const body = JSON.stringify({ text });

    const { response, error } = await create(body);

    expect(uuid).toHaveBeenCalledTimes(1);

    const params = {
      Item: {
        checked: false,
        createdAt: new Date().getTime(),
        id,
        text,
        updatedAt: new Date().getTime(),
      },
      TableName: process.env.DYNAMODB_TABLE,
    };

    expect(dynamoDB().put).toHaveBeenCalledTimes(1);
    expect(dynamoDB().put).toHaveBeenCalledWith(params);
    expect(dynamoDB().put().promise).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      body: JSON.stringify(params.Item),
      headers,
      statusCode: 200,
    });
    expect(error).toBeNull();
  });

  test('should return response on promise rejects', async () => {
    const { create } = require('./db');

    const text = 'textToWrite';
    const body = JSON.stringify({ text });

    const expectedError = new Error(`Failed to save to db`);
    dynamoDB()
      .put()
      .promise.mockReturnValue(Promise.reject(expectedError));

    const { response, error } = await create(body);

    expect(response).toEqual({
      body: JSON.stringify({
        input: body,
        message: "Couldn't create the todo item.",
      }),
      headers,
      statusCode: 500,
    });

    expect(error).toEqual(expectedError);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
