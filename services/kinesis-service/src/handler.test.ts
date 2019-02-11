import { queue } from './handler';

jest.mock('./kinesis');

describe('handler', () => {
  const { queueEvent } = require('./kinesis');
  const response = {};
  const error = new Error('some error');

  const payload = {
    message: 'some message',
  };
  const event = { body: JSON.stringify(payload) };
  const context: any = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback on response', async () => {
    queueEvent.mockReturnValue(Promise.resolve({ response, error: null }));

    const callback = jest.fn();

    await queue(event, context, callback);

    expect(queueEvent).toHaveBeenCalledTimes(1);
    expect(queueEvent).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, response);
  });

  test('should call callback on error', async () => {
    queueEvent.mockReturnValue(Promise.resolve({ response, error }));

    const callback = jest.fn();

    await queue(event, context, callback);

    expect(queueEvent).toHaveBeenCalledTimes(1);
    expect(queueEvent).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error);
  });
});
